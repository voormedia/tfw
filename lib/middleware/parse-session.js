"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cookies = require("cookies");
function decode(input) {
    const json = Buffer.from(input, "base64").toString("utf8");
    return JSON.parse(json);
}
function encode(input) {
    const json = JSON.stringify(input);
    return Buffer.from(json).toString("base64");
}
const day = 24 * 60 * 60 * 1000;
function parseSession({ name = "sess", keys, maxAge = 90 * day } = {}) {
    return async function parseSession(next) {
        let session;
        let cookie;
        const socket = this.request.socket;
        const secure = socket.encrypted || this.request.headers["x-forwarded-proto"] === "https";
        const cookies = new Cookies(this.request, this.response, { keys, secure });
        Object.defineProperty(this.data, "session", {
            get: () => {
                if (session !== undefined)
                    return session;
                cookie = cookies.get(name, { signed: true });
                if (cookie) {
                    try {
                        session = decode(cookie);
                    }
                    catch (err) {
                        session = {};
                    }
                }
                else {
                    session = {};
                }
                return session;
            },
            set: (value) => {
                if (typeof value !== "object") {
                    throw new TypeError("Session must be an object");
                }
                if (cookie === undefined) {
                    cookie = cookies.get(name, { signed: true });
                }
                session = value;
            },
        });
        try {
            await next();
        }
        finally {
            if (session === undefined) {
                /* Session not used. */
            }
            else if (session && Object.keys(session).length) {
                const encoded = encode(session);
                if (encoded !== cookie) {
                    /* Only set session if it has changed. */
                    cookies.set(name, encoded, { maxAge, signed: true });
                }
            }
            else if (cookies.get(name, { signed: false })) {
                /* Session cookies were invalid. Clear session & signature. */
                cookies.set(name, undefined, { signed: false });
                cookies.set(name + ".sig", undefined, { signed: false });
            }
        }
    };
}
exports.default = parseSession;
//# sourceMappingURL=parse-session.js.map
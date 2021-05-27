"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resource = void 0;
const route_1 = require("./route");
function resource({ singular } = { singular: false }) {
    const single = [
        ["show", "GET", "/"],
        ["create", "POST", "/"],
        ["create", "PUT", "/"],
        ["update", "PATCH", "/"],
        ["destroy", "DELETE", "/"],
        ["new", "GET", "/new"],
        ["edit", "GET", "/edit"],
    ];
    const plural = [
        ["index", "GET", "/"],
        ["show", "GET", "/{id}"],
        ["create", "POST", "/"],
        ["create", "PUT", "/"],
        ["update", "PATCH", "/{id}"],
        ["destroy", "DELETE", "/{id}"],
        ["new", "GET", "/new"],
        ["edit", "GET", "/{id}/edit"],
    ];
    const map = singular ? single : plural;
    return (object) => {
        for (const [name, method, pattern] of map) {
            let descriptor = Object.getOwnPropertyDescriptor(object.prototype, name);
            if (descriptor) {
                const decorate = route_1.route(pattern, { method });
                descriptor = decorate(object.prototype, name, descriptor);
                if (descriptor) {
                    Object.defineProperty(object.prototype, name, descriptor);
                }
            }
        }
    };
}
exports.resource = resource;
//# sourceMappingURL=resource.js.map
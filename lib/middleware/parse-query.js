import { URLSearchParams } from "url";
export default function parseQuery() {
    return async function parseQuery(next) {
        const search = this.url.split("?").slice(1).join("?");
        const params = Object.fromEntries(new URLSearchParams(search));
        if (this.data.params) {
            Object.assign(this.data.params, params);
        }
        else {
            this.data.params = params;
        }
        return next();
    };
}
//# sourceMappingURL=parse-query.js.map
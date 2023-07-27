import Router from "../../router";
export default function routerify(object) {
    if (!object.router) {
        Object.defineProperty(object, "router", {
            value: new Router(),
        });
    }
    return object.router;
}
//# sourceMappingURL=routerify.js.map
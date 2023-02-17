import routerify from "./util/routerify";
import Application from "../application";
export function start(options = {}) {
    return (object) => {
        options.router = routerify(object.prototype);
        object.instance = Application.start(options);
    };
}
//# sourceMappingURL=start.js.map
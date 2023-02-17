import { route } from "./route";
export function resource({ singular } = { singular: false }) {
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
                const decorate = route(pattern, { method });
                descriptor = decorate(object.prototype, name, descriptor);
                if (descriptor) {
                    Object.defineProperty(object.prototype, name, descriptor);
                }
            }
        }
    };
}
//# sourceMappingURL=resource.js.map
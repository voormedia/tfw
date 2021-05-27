"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.when = void 0;
function when(condition, decorator) {
    if (condition)
        return decorator;
    /* Null decorator. */
    return (object, key, descriptor) => {
        if (descriptor)
            return descriptor;
        if (object)
            return object;
    };
}
exports.when = when;
//# sourceMappingURL=when.js.map
export function when(condition, decorator) {
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
//# sourceMappingURL=when.js.map
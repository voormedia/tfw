import { InternalServerError, NotFound } from "../errors";
export default function compose(stack, context) {
    const iterator = stack.values();
    return async function next() {
        const handler = iterator.next().value;
        /* Check if a handler is present and valid. */
        if (!handler) {
            throw new NotFound("This endpoint does not exist.");
        }
        /* tslint:disable-next-line: strict-type-predicates */
        if (typeof handler !== "function") {
            throw new InternalServerError("Invalid endpoint handler");
        }
        // ES7: return context::handler(next)
        return handler.call(context, next);
    };
}
//# sourceMappingURL=compose.js.map
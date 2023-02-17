import compose from "../app/compose";
import { Context } from "../app/context";
export default function dispatch(initialStack) {
    return function dispatch(request, response) {
        const stack = initialStack.slice(0);
        const handler = compose(stack, new Context(stack, request, response));
        Promise.resolve(handler()).catch(err => {
            process.nextTick(() => { throw err; });
        });
    };
}
//# sourceMappingURL=dispatch.js.map
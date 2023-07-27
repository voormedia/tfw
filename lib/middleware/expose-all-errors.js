import { InternalServerError } from "../errors";
export default function exposeAllErrors() {
    return async function exposeAllErrors(next) {
        try {
            await next();
        }
        catch (err) {
            if (err instanceof Error) {
                /* Add specific JSON serialization to the error and make it exposable. */
                if (!err.toJSON) {
                    ;
                    err.toJSON = toJSON;
                }
                ;
                err.expose = true;
                throw err;
            }
            /* Wrap anything that's not an Error but that pretends to be one. */
            throw new InternalServerError(err.message || err.Message || err);
        }
    };
}
const { error } = new InternalServerError();
function toJSON() {
    /* TODO: Include stack? {stack: this.stack.split(/\n\s+/)} */
    return { error, message: this.message };
}
//# sourceMappingURL=expose-all-errors.js.map
import * as contentType from "content-type";
import { UnsupportedMediaType } from "../errors";
export default function validateContentType(expected) {
    return async function validateContentType(next) {
        if (this.request.headers["content-length"] || this.request.headers["content-encoding"]) {
            /* If there is a body and no Content-Type, we are allowed to assume
               application/octet-stream: https://tools.ietf.org/html/rfc7231#section-3.1.1.5 */
            const { type } = contentType.parse(this.request.headers["content-type"] || "application/octet-stream");
            if (type !== expected) {
                throw new UnsupportedMediaType(`Request requires '${expected}' content type`);
            }
        }
        return next();
    };
}
//# sourceMappingURL=validate-content-type.js.map
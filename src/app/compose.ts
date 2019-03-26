import {InternalServerError, NotFound} from "../errors"

import {Next, Stack} from "../middleware"
import {Context} from "./context"

export default function compose(stack: Stack, context: Context): Next {
  const iterator = stack.values()

  return async function next(): Promise<void> {
    const handler = iterator.next().value

    /* Check if a handler is present and valid. */
    if (!handler) {
      throw new NotFound("This endpoint does not exist.")
    }

    /* tslint:disable-next-line: strict-type-predicates */
    if (typeof handler !== "function") {
      throw new InternalServerError("Invalid endpoint handler")
    }

    // ES7: return context::handler(next)
    return handler.call(context, next)
  }
}

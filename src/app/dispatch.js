/* @flow */
import Context from "./context"
import compose from "./compose"

import type {Stack} from "../middleware"
import type {Request, Response} from "./context"

export default function dispatch(initialStack: Stack) {
  return function dispatch(request: Request, response: Response): void {
    const stack = initialStack.slice(0)
    const handler = compose(stack, new Context(stack, request, response))

    Promise.resolve(handler()).catch(err => {
      process.nextTick(() => {throw err})
    })
  }
}

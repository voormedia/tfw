import compose from "./compose"

import {Stack} from "../middleware"
import {Context, Request, Response} from "./context"

export default function dispatch(initialStack: Stack) {
  return function dispatch(request: Request, response: Response): void {
    const stack = initialStack.slice(0)
    const handler = compose(stack, new Context(stack, request, response))

    Promise.resolve(handler()).catch(err => {
      process.nextTick(() => {throw err})
    })
  }
}

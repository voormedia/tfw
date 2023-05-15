import compose from "../app/compose"

import {Context, Request, Response} from "../app/context"
import {Stack} from "../middleware"

export default function dispatch(initialStack: Stack) {
  return function dispatch(request: Request, response: Response): void {
    const stack = initialStack.slice(0)
    const handler = compose(stack, new Context(stack, request, response))

    Promise.resolve(handler()).catch(err => {
      process.nextTick(() => {
        throw err
      })
    })
  }
}

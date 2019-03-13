import {Request, Response} from "../app/context"
import {Context, Middleware, Next} from "../middleware"

type NextHandler = (err?: Error) => Promise<void>
export type ConnectMiddleware = (req: Request, res: Response, next: NextHandler) => void

export default function connect(fn: ConnectMiddleware): Middleware {
  return function connect(this: Context, next: Next) {
    return new Promise((resolve, reject) => {
      fn(this.request, this.response, async (err?: Error) => {
        if (err) {
          return reject(err)
        } else {
          try {
            await next()
            resolve()
          } catch (err) {
            reject(err)
          }
        }
      })
    })
  }
}

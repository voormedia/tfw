/* @flow */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
import type {Context, Next, Middleware} from "../middleware"
import type {Request, Response} from "../app/context"

type ConnectMiddleware = (req: Request, res: Response, next: Function) => void

export default function connect(fn: ConnectMiddleware): Middleware {
  return function connect(next: Next) {
    (this: Context)

    return new Promise((resolve, reject) => {
      fn(this.request, this.response, async err => {
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

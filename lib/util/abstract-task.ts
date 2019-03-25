import hostPkg from "./host-pkg"
import Logger from "./logger"

const description = `${hostPkg.name} service ${process.env.HOSTNAME || ""}`.trim()

export abstract class AbstractTask {
  description: string = description
  logger!: Logger

  constructor() {
    /* Assign default env. */
    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = "development"
    }
  }

  async start(): Promise<void> {
    process.on("SIGINT", async () => {
      await this.stop()
      process.exit(128 + 2)
    })

    process.on("SIGTERM", async () => {
      await this.stop()
      process.exit(128 + 15)
    })

    if (process.env.NODE_ENV !== "test") {
      const proc = process as NodeJS.EventEmitter

      proc.on("uncaughtException", async (err: Error) => {
        this.logger.critical(`uncaught ${err.stack}`)
        await this.kill()
        process.exit(1)
      })

      proc.on("unhandledRejection", async (err: Error, promise: Promise<any>) => {
        this.logger.critical(`unhandled ${err.stack || err.toString()}`)
        await this.kill()
        process.exit(2)
      })
    }

    this.logger.notice(`starting ${this.description}`)
  }

  async stop(): Promise<void> {
    this.logger.notice(`stopping ${this.description}`)
    /* Left up to implementation how to further deal with this scenario. */
  }

  async kill(): Promise<void> {
    this.logger.warning(`forcefully stopped ${this.description}`)
    /* Left up to implementation how to further deal with this scenario. */
  }

  abstract inspect(): any
}

export default AbstractTask

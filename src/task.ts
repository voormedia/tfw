import "./util/polyfill"

import AbstractTask from "./util/abstract-task"
import Logger from "./util/logger"

export interface TaskOptions {
  logger?: Logger,
}

export class Task extends AbstractTask {
  /* Start a new task with the given options in next tick. */
  static start(options: TaskOptions = {}) {
    const task = new this(options)
    process.nextTick(() => {task.start().catch(err => {throw err})})
    return task
  }

  constructor(options: TaskOptions = {}) {
    super()

    const {
      logger = new Logger,
    } = options

    this.logger = logger

    Object.freeze(this)
  }

  async start(): Promise<void> {
    await super.start()
    await this.run()
    await this.stop()
  }

  async stop(): Promise<void> {
    await super.stop()
    process.exit()
  }

  /* tslint:disable-next-line: prefer-function-over-method */
  async run(): Promise<void> {
  }

  /* tslint:disable-next-line: prefer-function-over-method */
  inspect(): any {
    return {}
  }
}

export default Task

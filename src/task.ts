import "./util/polyfill"

import AbstractTask from "./util/abstract-task"
import Logger from "./util/logger"

export interface TaskOptions {
  logger?: Logger,
}

export class Task extends AbstractTask {
  /* Start a new task with the given options in next tick. */
  public static start(options: TaskOptions = {}) {
    const task = new this(options)
    process.nextTick(() => {task.start()})
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

  public async start(): Promise<void> {
    await super.start()
    await this.run()
    await this.stop()
  }

  public async stop(): Promise<void> {
    await super.stop()
    process.exit()
  }

  public async run(): Promise<void> {
  }
}

export default Task

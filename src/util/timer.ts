export class Timer {
  public time: number
  public timer?: number

  constructor(time: number) {
    this.time = time
  }

  public sleep(): Promise<void> {
    return new Promise((resolve) => {
      this.timer = setTimeout(resolve, this.time)
    })
  }

  public clear() {
    clearTimeout(this.timer)
  }
}

export default Timer

/* @flow */
export class Timer {
  time: number
  timer: TimeoutID

  constructor(time: number) {
    this.time = time
  }

  sleep(): Promise<void> {
    return new Promise(resolve => {
      this.timer = setTimeout(resolve, this.time)
    })
  }

  clear() {
    clearTimeout(this.timer)
  }
}

export default Timer

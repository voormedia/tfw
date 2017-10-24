/* @flow */
export class Timer {
  time: number
  timer: number

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

export class Timer {
  time: number
  timer?: number

  constructor(time: number) {
    this.time = time
  }

  clear() {
    clearTimeout(this.timer)
  }

  async sleep(): Promise<void> {
    return new Promise(resolve => {
      this.timer = setTimeout(resolve, this.time)
    })
  }
}

export class Timer {
  time: number
  timer?: NodeJS.Timeout

  constructor(time: number) {
    this.time = time
  }

  clear() {
    if (this.timer) clearTimeout(this.timer)
  }

  async sleep(): Promise<void> {
    return new Promise(resolve => {
      this.timer = setTimeout(resolve, this.time)
    })
  }
}

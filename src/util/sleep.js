/* @flow */
export default function sleep(time: number) {
  return new Timer(time).sleep()
}

export class Timer {
  time: number
  timer: number

  constructor(time: number) {
    this.time = time
  }

  sleep() {
    return new Promise(resolve => {
      this.timer = setTimeout(resolve, this.time)
    })
  }

  clear() {
    clearTimeout(this.timer)
  }
}

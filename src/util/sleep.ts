import Timer from "./timer"

export default function sleep(time: number) {
  return new Timer(time).sleep()
}

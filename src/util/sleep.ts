import {Timer} from "./timer"

export default async function sleep(time: number) {
  return new Timer(time).sleep()
}

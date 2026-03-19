import dayjs from "dayjs"

export function parseTime(text: string) {
  return dayjs(text, "HH:mm")
}

import { Dayjs } from "dayjs"

export interface TimesheetEntry {
  start: Dayjs
  end: Dayjs
  note: string | null
  element: HTMLElement
  id: string
}

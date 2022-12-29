import { Dayjs } from "dayjs"

export interface TimesheetEntry {
  start: Dayjs
  end: Dayjs
  hasNote: boolean
  element: HTMLElement
  id: string
}

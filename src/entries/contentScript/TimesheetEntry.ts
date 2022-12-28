import { Dayjs } from "dayjs"

export interface TimesheetEntry {
  start: Dayjs
  end: Dayjs | null
  hasNote: boolean
  element: HTMLElement
  id: string
}

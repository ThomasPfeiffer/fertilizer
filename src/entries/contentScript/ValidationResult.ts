import { TimesheetEntry } from "../TimesheetEntry"

export type ValidationResult = { entry: TimesheetEntry } & (
  | {
      type: "ok"
    }
  | {
      type: "overlap"
      minutes: number
    }
  | {
      type: "break"
      minutes: number
    }
)

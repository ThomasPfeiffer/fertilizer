import { Timesheet } from "./Timesheet"
import { TimesheetEntry } from "./TimesheetEntry"
import { TimesheetEntryGap, TimesheetEntryNote, ValidationResult } from "./ValidationResult"

export function validateTimesheet(timesheet: Timesheet): ValidationResult[] {
  return timesheet.entries
    .slice()
    .sort((a, b) => a.start.diff(b.start))
    .map((currentEntry, index, entries) => {
      const gap = validateGap(currentEntry, entries[index + 1])
      const note: TimesheetEntryNote = currentEntry.hasNote ? { type: "ok" } : { type: "missing" }

      return {
        entry: currentEntry,
        gap,
        note,
      }
    })
}

function validateGap(firstEntry: TimesheetEntry, secondEntry?: TimesheetEntry): TimesheetEntryGap {
  if (!secondEntry || !firstEntry.end) return { type: "ok" }

  const timeDiff = secondEntry.start.diff(firstEntry.end, "minutes")

  if (timeDiff < -1) {
    return {
      type: "overlap",
      minutes: -timeDiff,
    }
  }

  if (timeDiff > 1) {
    return {
      type: "break",
      minutes: timeDiff,
    }
  }

  return { type: "ok" }
}

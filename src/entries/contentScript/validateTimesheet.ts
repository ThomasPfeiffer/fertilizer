import { Timesheet } from "./Timesheet"
import { TimesheetEntry } from "./TimesheetEntry"
import { GapValidationResult, NoteValidationResult, ValidationResult } from "./ValidationResult"

export function validateTimesheet(timesheet: Timesheet): ValidationResult[] {
  return timesheet.entries
    .slice()
    .sort((a, b) => a.start.diff(b.start))
    .map((currentEntry, index, entries) => {
      const gap = validateGap(currentEntry, entries[index + 1])
      const note = validateNote(currentEntry)

      return {
        entry: currentEntry,
        gap,
        note,
      }
    })
}

const invalidTextRegex = RegExp(/[^\x00-\x7F]/gmu)

function validateNote(entry: TimesheetEntry): NoteValidationResult {
  if (entry.note === null || entry.note === "") {
    return {
      type: "missing",
    }
  }

  const invalidText = entry.note?.match(invalidTextRegex)
  if (invalidText) {
    return {
      type: "invalidCharacters",
      invalidCharacters: invalidText,
    }
  }

  return {
    type: "ok",
  }
}

function validateGap(firstEntry: TimesheetEntry, secondEntry?: TimesheetEntry): GapValidationResult {
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

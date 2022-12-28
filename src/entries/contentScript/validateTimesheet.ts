import { TimesheetEntry } from "./TimesheetEntry"
import { ValidationResult } from "./ValidationResult"

export function validateEntries(entries: TimesheetEntry[]): ValidationResult[] {
  return entries.map((currentEntry, index) => {
    const nextEntry = entries[index + 1]

    if (!nextEntry) {
      return { type: "ok", entry: currentEntry }
    }
    return validateGap(currentEntry, nextEntry)
  })
}

function validateGap(firstEntry: TimesheetEntry, secondEntry: TimesheetEntry): ValidationResult {
  if (!firstEntry.end) return { type: "ok", entry: firstEntry }

  const timeDiff = firstEntry.end.diff(secondEntry.start, "minutes")

  if (timeDiff > 1) {
    return {
      type: "break",
      minutes: timeDiff,
      entry: firstEntry,
    }
  }

  if (timeDiff < -1) {
    return {
      type: "overlap",
      minutes: -timeDiff,
      entry: firstEntry,
    }
  }

  return { type: "ok", entry: firstEntry }
}

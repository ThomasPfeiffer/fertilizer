import customParseFormat from "dayjs/plugin/customParseFormat"
import dayjs from "dayjs"
import { findTimesheetInTimeView } from "./findTimesheetInTimeView"
import { markResults } from "./markValidationResults"
import { validateTimesheet } from "./validateTimesheet"
import { findTimesheetsInTeamView } from "./findTimesheetsInTeamView"
import { onMessage, EntryWarning } from "~/messaging"

let latestWarnings: EntryWarning[] = []
let latestEntryCount = 0
let isActive = false

export default defineContentScript({
  matches: ["https://*.harvestapp.com/*"],
  main: () => {
    dayjs.extend(customParseFormat)
    initialize()
    onMessage("GET_STATUS", () => ({ warnings: latestWarnings, entryCount: latestEntryCount, isActive }))
  },
})

function initialize() {
  try {
    onChange()
    const config = { attributes: true, childList: true, subtree: true }
    const observer = new MutationObserver(() => {
      onChange()
    })
    observer.observe(document, config)
    isActive = true
    console.log("Fertilizer active 🪴")
  } catch (e) {
    console.error("Fertilizer: ", e)
  }
}

function onChange() {
  const warnings: EntryWarning[] = []
  let entryCount = 0
  findTimeSheets().forEach((timesheet) => {
    entryCount += timesheet.entries.length
    const results = validateTimesheet(timesheet)
    markResults(results)
    for (const r of results) {
      if (r.gap.type !== "ok" || r.note.type !== "ok") {
        warnings.push({ startTime: r.entry.start.format("HH:mm"), gap: r.gap, note: r.note })
      }
    }
  })
  latestWarnings = warnings
  latestEntryCount = entryCount
}

function findTimeSheets() {
  if (window.location.pathname.startsWith("/team")) {
    return findTimesheetsInTeamView()
  }
  return [findTimesheetInTimeView()]
}

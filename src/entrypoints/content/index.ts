import customParseFormat from "dayjs/plugin/customParseFormat"
import dayjs from "dayjs"
import { findTimesheetInTimeView } from "./findTimesheetInTimeView"
import { markResults } from "./markValidationResults"
import { validateTimesheet } from "./validateTimesheet"
import { findTimesheetsInTeamView } from "./findTimesheetsInTeamView"
import { onMessage } from "~/messaging"

let latestWarningCount = 0

export default defineContentScript({
  matches: ["https://*.harvestapp.com/*"],
  main: () => {
    dayjs.extend(customParseFormat)
    initialize()
    onMessage("GET_WARNING_COUNT", () => ({ warningCount: latestWarningCount }))
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
    console.log("Fertilizer active 🪴")
  } catch (e) {
    console.error("Fertilizer: ", e)
  }
}

function onChange() {
  const timesheets = findTimeSheets()
  let totalWarnings = 0
  timesheets.forEach((timesheet) => {
    const results = validateTimesheet(timesheet)
    markResults(results)
    totalWarnings += results.filter(
      (r) => r.gap.type !== "ok" || r.note.type !== "ok",
    ).length
  })
  latestWarningCount = totalWarnings
}

function findTimeSheets() {
  if (window.location.pathname.startsWith("/team")) {
    return findTimesheetsInTeamView()
  }
  return [findTimesheetInTimeView()]
}

import customParseFormat from "dayjs/plugin/customParseFormat"
import dayjs from "dayjs"
import { findTimesheetInTimeView } from "./findTimesheetInTimeView"
import { markResults } from "./markValidationResults"
import { validateTimesheet } from "./validateTimesheet"
import { findTimesheetsInTeamView } from "./findTimesheetsInTeamView"

dayjs.extend(customParseFormat)
initialize()

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
  timesheets.forEach((timesheet) => {
    const results = validateTimesheet(timesheet)
    markResults(results)
  })
}

function findTimeSheets() {
  if (window.location.pathname.startsWith("/team")) {
    return findTimesheetsInTeamView()
  }
  return [findTimesheetInTimeView()]
}

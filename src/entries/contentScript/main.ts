import customParseFormat from "dayjs/plugin/customParseFormat"
import dayjs from "dayjs"
import { findTimesheetEntries } from "./findTimeViewEntries"
import { markResults } from "./markValidationResults"
import { validateEntries as validateTimesheet } from "./validateTimesheet"

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
  const entries = findTimesheetEntries()
  const results = validateTimesheet(entries)
  markResults(results)
}

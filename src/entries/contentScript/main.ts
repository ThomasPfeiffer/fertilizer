import customParseFormat from "dayjs/plugin/customParseFormat"
import dayjs from "dayjs"
import { findTimesheetEntries } from "./findTimesheetEntries"
import { markResults } from "./markValidationResults"
import { validateEntries as validateTimesheet } from "./validateTimesheet"

dayjs.extend(customParseFormat)

initialize()

function onChange() {
  const entries = findTimesheetEntries()
  const results = validateTimesheet(entries)
  markResults(results)
}

function initialize() {
  try {
    onChange()
    const config = { attributes: true, childList: true, subtree: true }
    const observer = new MutationObserver(() => {
      onChange()
    })
    observer.observe(document, config)
  } catch (e) {
    console.error("Fertilizer: ", e)
    displayError()
  }
}

function displayError() {
  const id = "fertilizer-error-alert"
  if (document.getElementById(id)) {
    return
  }
  const alert = document.createElement("div")
  alert.id = id
  alert.style.position = "sticky"
  alert.style.bottom = "20px"
  alert.style.left = "20px"
  alert.style.width = "350px"
  alert.style.backgroundColor = "rgb(255 0 0 / 24%)"
  alert.style.textAlign = "center"
  alert.style.paddingTop = "1rem"
  alert.style.paddingBottom = "1rem"
  alert.style.borderRadius = "5px"
  alert.textContent = "Achtung: Fertilizer funktioniert nicht mehr!"
  document.body.appendChild(alert)
}

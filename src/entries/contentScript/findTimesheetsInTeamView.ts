import dayjs from "dayjs"
import { TimesheetEntry } from "./TimesheetEntry"
import { parseTime } from "./parseTime"
import { Timesheet } from "./Timesheet"

function findTimesheetElements() {
  const elements = document.querySelectorAll<HTMLElement>("table.pds-table")
  if (elements === null) {
    throw new Error("Failed to find root element for timesheet")
  }
  return Array.from(elements)
}

function findTextContent(tableRow: HTMLElement, selector: string) {
  const result = tableRow.querySelector(selector)
  if (result === null || result.textContent === null) {
    throw Error("Failed to find timestamp elements in table row")
  }
  return result.textContent
}

function readEntries(tableRow: HTMLElement): TimesheetEntry {
  const hasNote = tableRow.querySelector(".time-entry-notes") !== null

  const startTimeText = findTextContent(tableRow, ".start-time")
  const endTimeText = findTextContent(tableRow, ".end-time")

  const start = parseTime(startTimeText)
  const endToday = endTimeText ? parseTime(endTimeText) : dayjs()
  const end = endToday.isBefore(start) ? endToday.add(1, "days") : endToday

  return {
    hasNote,
    start: start,
    end: end,
    element: tableRow,
    id: `FertilizerEntry${tableRow.id}`,
  }
}

export function findTimesheetsInTeamView(): Timesheet[] {
  const timesheetElements = findTimesheetElements()

  const timesheets = timesheetElements.map((timesheetElement) => {
    const tableRowElements = Array.from(timesheetElement.querySelectorAll<HTMLElement>("[data-analytics-day-entry-id]"))

    const entries = tableRowElements.map(readEntries)
    return { entries }
  })
  return timesheets
}

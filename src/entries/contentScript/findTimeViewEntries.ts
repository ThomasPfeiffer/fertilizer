import dayjs from "dayjs"
import { TimesheetEntry } from "./TimesheetEntry"
import { parseTime } from "./parseTime"

function findTimesheetElement() {
  const element = document.getElementById("day-view-entries")
  if (element === null) {
    throw new Error("Failed to find root element for timesheet")
  }
  return element
}

function findTextContent(tableRow: HTMLElement, selector: string) {
  const result = tableRow.querySelector(selector)
  if (result === null || result.textContent === null) {
    throw Error("Failed to find timestamp elements in table row")
  }
  return result.textContent
}

export function findTimesheetEntries(): TimesheetEntry[] {
  const timesheetElement = findTimesheetElement()

  const tableRowElements = Array.from(timesheetElement.querySelectorAll<HTMLElement>(".day-view-entry"))

  return tableRowElements.map((tableRow) => {
    const hasNote = tableRow.querySelector(".notes") !== null

    const startTimeText = findTextContent(tableRow, ".entry-timestamp-start")
    const endTimeText = findTextContent(tableRow, ".entry-timestamp-end")

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
  })
}

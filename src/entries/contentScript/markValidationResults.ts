import { TimesheetEntry } from "./TimesheetEntry"
import { ValidationResult } from "./ValidationResult"

export function markResults(results: ValidationResult[]) {
  results.forEach((result) => {
    switch (result.type) {
      case "break":
        mark(result.entry, `${result.minutes} Minuten Pause`, "rgb(142 223 142 / 37%)")
        break
      case "overlap":
        mark(result.entry, `${result.minutes} Minuten Überlappung`, "rgb(255 0 0 / 24%)")
        break
      case "ok":
        unmark(result.entry)
        break
    }
  })
}

export function mark(entry: TimesheetEntry, text: string, color: string) {
  if (isMarked(entry)) {
    return
  }

  const newRow = document.createElement("tr")
  newRow.setAttribute("colspan", "100%")
  newRow.setAttribute("id", idForEntryMarking(entry))

  const newCell = document.createElement("td")
  newCell.setAttribute("colspan", "100%")
  newCell.style.padding = "0"
  newRow.append(newCell)

  const markingContainer = document.createElement("div")
  markingContainer.style.backgroundColor = color
  markingContainer.style.padding = "0.5rem"
  markingContainer.style.display = "flex"
  newCell.append(markingContainer)

  function createArrow() {
    const arrow = document.createElement("span")
    arrow.textContent = "↕️"
    return arrow
  }

  markingContainer.append(createArrow())

  const markingElement = document.createElement("mark")
  markingElement.textContent = text
  markingElement.style.flex = "1"
  markingElement.style.textAlign = "center"
  markingElement.style.backgroundColor = "unset"
  markingContainer.append(markingElement)

  markingContainer.append(createArrow())

  entry.element.after(newRow)
}

function idForEntryMarking(entry: TimesheetEntry) {
  return "luegge_" + entry.id
}

function findMarkingFor(entry: TimesheetEntry) {
  const id = idForEntryMarking(entry)
  return document.getElementById(id)
}

function isMarked(entry: TimesheetEntry) {
  return Boolean(findMarkingFor(entry))
}

export function unmark(entry: TimesheetEntry) {
  const marking = findMarkingFor(entry)
  marking && marking.remove()
}

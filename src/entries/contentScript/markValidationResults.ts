import { TimesheetEntry } from "./TimesheetEntry"
import { ValidationResult } from "./ValidationResult"

export function markResults(results: ValidationResult[]) {
  results.forEach((result) => {
    switch (result.gap.type) {
      case "break":
        markGap(result.entry, `${result.gap.minutes} Minuten Pause`, "rgb(142 223 142 / 37%)")
        break
      case "overlap":
        markGap(result.entry, `${result.gap.minutes} Minuten Überlappung`, "rgb(255 0 0 / 24%)")
        break
      case "ok":
        unmarkGap(result.entry)
        break
    }
    switch (result.note.type) {
      case "missing":
        markEntry(result.entry)
        break
      case "ok":
        unmarkEntry(result.entry)
        break
    }
  })
}

function markEntry(entry: TimesheetEntry) {
  entry.element.style.backgroundColor = "rgb(166 166 166 / 25%)"
}

function unmarkEntry(entry: TimesheetEntry) {
  entry.element.style.backgroundColor = ""
}

function markGap(entry: TimesheetEntry, text: string, color: string) {
  if (hasGapMarking(entry)) {
    return
  }

  const newRow = document.createElement("tr")
  newRow.setAttribute("colspan", "100%")
  newRow.setAttribute("id", idForGapMarking(entry))

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

function idForGapMarking(entry: TimesheetEntry) {
  return "luegge_" + entry.id
}

function findGapMarking(entry: TimesheetEntry) {
  const id = idForGapMarking(entry)
  return document.getElementById(id)
}

function hasGapMarking(entry: TimesheetEntry) {
  return Boolean(findGapMarking(entry))
}

function unmarkGap(entry: TimesheetEntry) {
  findGapMarking(entry)?.remove()
}

import { TimesheetEntry } from "./TimesheetEntry"
import { ValidationResult } from "./ValidationResult"
import { currentPalette, Palette } from "./theme"

export function markResults(results: ValidationResult[]) {
  const palette = currentPalette()
  results.forEach((result) => {
    switch (result.gap.type) {
      case "break":
        markGap(result.entry, `${result.gap.minutes} Minuten Pause`, palette.break, palette)
        break
      case "overlap":
        markGap(result.entry, `${result.gap.minutes} Minuten Überlappung`, palette.overlap, palette)
        break
      case "ok":
        unmarkGap(result.entry)
        break
    }
    switch (result.note.type) {
      case "missing":
        markEntry(result.entry, palette.missingNote)
        break
      case "invalidCharacters":
        markEntry(result.entry, palette.invalidCharacters)
        break
      case "ok":
        unmarkEntry(result.entry)
        break
    }
  })
}

function markEntry(entry: TimesheetEntry, color: string) {
  setStyle(entry.element, "backgroundColor", color)
}

function unmarkEntry(entry: TimesheetEntry) {
  setStyle(entry.element, "backgroundColor", "")
}

type StyleProperty = "backgroundColor" | "borderBottom"

// Only write changed values, so restyling on every DOM change doesn't feed the MutationObserver.
// Style getters return normalized values (e.g. "#bbbbbb" reads back as "rgb(187, 187, 187)"), so we
// compare by normalizing the desired value through a scratch element.
const scratch = document.createElement("div")
function setStyle(element: HTMLElement, property: StyleProperty, value: string) {
  scratch.style[property] = value
  if (element.style[property] !== scratch.style[property]) {
    element.style[property] = value
  }
}

function markGap(entry: TimesheetEntry, text: string, color: string, palette: Palette) {
  const existingMarking = findGapMarking(entry)
  if (existingMarking) {
    // Update the existing marking, as the gap or the colors may have changed since it was created
    setStyle(existingMarking, "borderBottom", `1px solid ${palette.gapBorder}`)
    const markingContainer = existingMarking.querySelector<HTMLElement>("div")
    if (markingContainer) setStyle(markingContainer, "backgroundColor", color)
    const markingElement = existingMarking.querySelector("mark")
    if (markingElement && markingElement.textContent !== text) markingElement.textContent = text
    return
  }

  const newRow = document.createElement("tr")
  newRow.setAttribute("colspan", "100%")
  newRow.setAttribute("id", idForGapMarking(entry))
  setStyle(newRow, "borderBottom", `1px solid ${palette.gapBorder}`)

  const newCell = document.createElement("td")
  newCell.setAttribute("colspan", "100%")
  newCell.style.padding = "0"
  newRow.append(newCell)

  const markingContainer = document.createElement("div")
  setStyle(markingContainer, "backgroundColor", color)
  markingContainer.style.padding = "0.5rem"
  markingContainer.style.display = "flex"
  newCell.append(markingContainer)

  function createArrow() {
    const arrow = document.createElement("span")
    arrow.textContent = "↕"
    return arrow
  }

  markingContainer.append(createArrow())

  const markingElement = document.createElement("mark")
  markingElement.textContent = text
  markingElement.style.flex = "1"
  markingElement.style.textAlign = "center"
  markingElement.style.backgroundColor = "unset"
  markingElement.style.color = "inherit"
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

function unmarkGap(entry: TimesheetEntry) {
  findGapMarking(entry)?.remove()
}

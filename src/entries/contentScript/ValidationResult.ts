import { TimesheetEntry } from "./TimesheetEntry"

export type ValidationResult = { entry: TimesheetEntry; gap: GapValidationResult; note: NoteValidationResult }

export type OkResult = {
  type: "ok"
}

export type GapValidationResult = OverlapResult | BreakResult | OkResult

export type OverlapResult = {
  type: "overlap"
  minutes: number
}

export type BreakResult = {
  type: "break"
  minutes: number
}

export type InvalidCharactersResult = {
  type: "invalidCharacters"
  invalidCharacters: string[]
}

export type NoteMissingResult = {
  type: "missing"
}

export type NoteValidationResult = NoteMissingResult | InvalidCharactersResult | OkResult

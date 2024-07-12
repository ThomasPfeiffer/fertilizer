import { TimesheetEntry } from "./TimesheetEntry"
import dayjs from "dayjs"
import { validateTimesheet } from "./validateTimesheet"
import { BreakResult, InvalidCharactersResult, OverlapResult } from "./ValidationResult"

const div = document.createElement("div")
const someEntry: TimesheetEntry = {
  element: div,
  id: "1",
  note: "abc",
  start: dayjs("2018-04-04T16:00:00.000Z"),
  end: dayjs("2018-04-04T18:00:00.000Z"),
}

function timestampAt(time: string) {
  return dayjs(`2018-04-04T${time}:00.000Z`)
}

function entryWithTimes(from: string, to: string): TimesheetEntry {
  return {
    ...someEntry,
    start: timestampAt(from),
    end: timestampAt(to),
  }
}

describe("Overlaps", () => {
  it("Should find overlaps in timesheets", () => {
    const entry1 = entryWithTimes("16:00", "18:00")
    const entry2 = entryWithTimes("17:00", "19:00")

    const result = validateTimesheet({ entries: [entry1, entry2] })

    expect(result[0].gap.type).toBe("overlap")
    expect((result[0].gap as OverlapResult).minutes).toBe(60)
  })

  it("Should not declare a single minute as overlap", () => {
    const entry1 = entryWithTimes("16:00", "17:00")
    const entry2 = entryWithTimes("17:00", "18:00")

    const result = validateTimesheet({ entries: [entry1, entry2] })

    expect(result[0].gap.type).toBe("ok")
  })
})

describe("Breaks", () => {
  it("Should find breaks in timesheets", () => {
    const entry1 = entryWithTimes("16:00", "17:00")
    const entry2 = entryWithTimes("17:30", "19:00")

    const result = validateTimesheet({ entries: [entry1, entry2] })

    expect(result[0].gap.type).toBe("break")
    expect((result[0].gap as BreakResult).minutes).toBe(30)
  })

  it("Should declare a single minute as break", () => {
    const entry1 = entryWithTimes("16:00", "17:00")
    const entry2 = entryWithTimes("17:01", "18:00")

    const result = validateTimesheet({ entries: [entry1, entry2] })

    expect(result[0].gap.type).toBe("ok")
  })
})

describe("Missing notes", () => {
  it("Should return missing for entries that have no note", () => {
    const entry = {
      ...someEntry,
      note: null,
    }

    const result = validateTimesheet({ entries: [entry] })

    expect(result[0].note.type).toBe("missing")
  })

  it("Should return ok for entries that have a note note", () => {
    const entry = {
      ...someEntry,
      hasNote: true,
    }

    const result = validateTimesheet({ entries: [entry] })

    expect(result[0].note.type).toBe("ok")
  })
})

describe("Order of timesheet entries", () => {
  it("Should process entries sorted by their start timestamp", () => {
    const entry1 = entryWithTimes("17:00", "19:00")
    const entry2 = entryWithTimes("16:00", "18:00")

    const result = validateTimesheet({ entries: [entry1, entry2] })

    expect(result[0].gap.type).toBe("overlap")
    expect((result[0].gap as OverlapResult).minutes).toBe(60)
  })
})

describe("Illegal Characters", () => {
  it.each(["Chilling 😴", "🥸 Concentrated working 🥸", "😉", "ᏙᎥᎡᏌᏚ", "(⚆ₓ⚆)", "𒐫"])(
    "Should return validation errors for notes with illegal characters",
    (note) => {
      const entry: TimesheetEntry = {
        ...someEntry,
        note,
      }

      const result = validateTimesheet({ entries: [entry] })

      expect(result[0].note.type).toBe("invalidCharacters")
    }
  )

  it.each([
    {
      note: "Chilling 😴",
      expected: ["😴"],
    },
    {
      note: "🙂 Blabla 🥸",
      expected: ["🙂", "🥸"],
    },
    {
      note: "🙂🙂🙂 foo 🙂 bar🙂🙂",
      expected: ["🙂", "🙂", "🙂", "🙂", "🙂", "🙂"],
    },
  ])("Extracts the invalid Characters correctly", ({ note, expected }) => {
    const entry: TimesheetEntry = {
      ...someEntry,
      note,
    }

    const result = validateTimesheet({ entries: [entry] })

    expect((result[0].note as InvalidCharactersResult).invalidCharacters).toEqual(expected)
  })

  it("Allows regular characters", () => {
    const entry: TimesheetEntry = {
      ...someEntry,
      note: "This is completely ok! \n Even with newlines",
    }

    const result = validateTimesheet({ entries: [entry] })

    expect(result[0].note.type).not.toBe("invalidCharacters")
  })
})

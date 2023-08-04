import dayjs from "dayjs"
import fs from "fs"
import path from "path"
import { findTimesheetsInTeamView } from "./findTimesheetsInTeamView"

beforeEach(() => {
  const testPage = fs.readFileSync(path.resolve(__dirname, `testdata/teamView.html`), "utf-8")
  document.body.innerHTML = testPage
  document.body.innerHTML = testPage
})

function todayAt(hour: number, minute: number) {
  return dayjs().hour(hour).minute(minute).second(0).millisecond(0)
}

describe("Timesheet Content", () => {
  const firstTimeSheet = () => findTimesheetsInTeamView()[0].entries

  it("parses start timestamp", () => {
    const entries = firstTimeSheet()

    expect(entries[0].start.isSame(todayAt(8, 0))).toBe(true)
    expect(entries[1].start.isSame(todayAt(9, 0))).toBe(true)
    expect(entries[2].start.isSame(todayAt(10, 30))).toBe(true)
  })

  it("parses end timestamp", () => {
    const entries = firstTimeSheet()

    expect(entries[0].end!.isSame(todayAt(9, 0))).toBe(true)
  })

  it("recognizes entries that pass midnight", () => {
    const entries = firstTimeSheet()

    expect(entries[2].end!.isSame(todayAt(2, 0).add(1, "days"))).toBe(true)
  })

  it("uses 'now' as end when there is no end timestamp'", () => {
    const entries = firstTimeSheet()

    expect(entries[1].end!.isSame(dayjs())).toBe(true)
  })

  it("considers an entry to have a note if the div with class notes exists", () => {
    const entries = firstTimeSheet()

    expect(entries[0].hasNote).toBe(false)
  })

  it("considers an entry to have no note if the div with class notes is missing", () => {
    const entries = firstTimeSheet()

    expect(entries[1].hasNote).toBe(true)
    expect(entries[2].hasNote).toBe(true)
  })
})

describe("Timesheets", () => {
  it("finds all timesheets", () => {
    const timesheets = findTimesheetsInTeamView()

    expect(timesheets).toHaveLength(7)
    expect(timesheets[0].entries).toHaveLength(3)
    expect(timesheets[1].entries).toHaveLength(1)
  })
})

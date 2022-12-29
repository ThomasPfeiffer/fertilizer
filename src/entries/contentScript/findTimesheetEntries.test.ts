import dayjs from "dayjs"
import { findTimesheetEntries } from "./findTimesheetEntries"

beforeEach(() => {
  document.body.innerHTML = testPage
})

function todayAt(hour: number, minute: number) {
  return dayjs().hour(hour).minute(minute).second(0).millisecond(0)
}

describe("Timestamps", () => {
  it("parses start timestamp", () => {
    const entries = findTimesheetEntries()

    expect(entries[0].start.isSame(todayAt(8, 0))).toBe(true)
    expect(entries[1].start.isSame(todayAt(9, 0))).toBe(true)
    expect(entries[2].start.isSame(todayAt(10, 30))).toBe(true)
  })

  it("parses end timestamp", () => {
    const entries = findTimesheetEntries()

    expect(entries[0].end!.isSame(todayAt(9, 0))).toBe(true)
  })

  it("recognizes entries that pass midnight", () => {
    const entries = findTimesheetEntries()

    expect(entries[2].end!.isSame(todayAt(2, 0).add(1, "days"))).toBe(true)
  })

  it("uses 'now' as end when there is no end timestamp'", () => {
    const entries = findTimesheetEntries()

    expect(entries[1].end!.isSame(dayjs())).toBe(true)
  })
})

describe("Notes", () => {
  it("considers an entry to have a note if the div with class notes exists", () => {
    const entries = findTimesheetEntries()

    expect(entries[0].hasNote).toBe(false)
  })

  it("considers an entry to have no note if the div with class notes is missing", () => {
    const entries = findTimesheetEntries()

    expect(entries[1].hasNote).toBe(true)
    expect(entries[2].hasNote).toBe(true)
  })
})

const testPage = `
<table id="day-view-entries">
  <tbody class="js-day-view-entry-list" data-test-day="2022-12-26">
    <tr
      id="timesheet_day_entry_1966770715"
      class="day-view-entry test-entry-1966770715"
    >
      <td>
        <div class="day-entry-with-timestamps">
          <div class="entry-timestamps">
            <span class="entry-timestamp-start">8:00</span>
            <span class="entry-timestamp-end">9:00</span>
          </div>
        </div>
      </td>
    </tr>
    <tr
      id="timesheet_day_entry_1966770823"
      class="day-view-entry test-entry-1966770823"
    >
      <td>
        <div class="day-entry-with-timestamps">
          <div class="entry-timestamps">
            <span class="entry-timestamp-start">9:00</span>
            <span class="entry-timestamp-end"></span>
          </div>

          <div class="entry-details">
            <div class="notes">
              <p>Has Note</p>
            </div>
          </div>
        </div>
      </td>
    </tr>
    <tr
      id="timesheet_day_entry_1966770787"
      class="day-view-entry test-entry-1966770787"
    >
      <td>
        <div class="day-entry-with-timestamps">
          <div class="entry-timestamps">
            <span class="entry-timestamp-start">10:30</span>
            <span class="entry-timestamp-end">2:00</span>
          </div>

          <div class="entry-details">
            <div class="notes">
              <p>Another Note</p>
            </div>
          </div>
        </div>
      </td>
    </tr>
  </tbody>
</table>
`

# CLAUDE.md

## What this is

Fertilizer is a browser extension (Chrome + Firefox) that enhances the [Harvest](https://www.getharvest.com/) time-tracking UI. It highlights breaks, overlaps, and missing/invalid notes in timesheets by injecting a content script into `*.harvestapp.com`.

Built with [WXT](https://wxt.dev/) and TypeScript.

## Architecture

The extension has a single entrypoint: `src/entrypoints/content/index.ts`. It runs on all `*.harvestapp.com` pages and sets up a `MutationObserver` to re-run on every DOM change.

On each change, the pipeline is:

1. **Find timesheets** — Two parsers depending on the current URL:

   - `/team` path: `findTimesheetsInTeamView.ts` — scrapes `table.pds-table` elements, reads `.start-time` / `.end-time` / `.time-entry-notes` selectors
   - All other paths: `findTimesheetInTimeView.ts` — scrapes `#day-view-entries` with `.day-view-entry` rows, reads `.entry-timestamp-start` / `.entry-timestamp-end` / `.notes p` selectors

2. **Validate** — `validateTimesheet.ts` sorts entries by start time and checks:

   - **Gap**: compares consecutive entry end/start times; flags breaks (>1 min gap) or overlaps (>1 min overlap)
   - **Note**: flags missing notes or notes containing emoji characters (via `emoji-regex` package, which supports Unicode/Umlauts)

3. **Mark results** — `markValidationResults.ts` applies inline styles directly to the entry's `HTMLElement` and inserts/removes `<tr>` rows between entries to display gap/overlap indicators.

## Key types

- `TimesheetEntry` — `{ start, end: Dayjs, note: string | null, element: HTMLElement, id: string }`
- `ValidationResult` — `{ entry, gap: GapValidationResult, note: NoteValidationResult }`
- Gap results: `"ok" | "break" | "overlap"` (with `minutes`)
- Note results: `"ok" | "missing" | "invalidCharacters"` (with `invalidCharacters`)

## Testing

Tests use Jest with `ts-jest` + `jsdom`. `src/setupTests.ts` globally extends dayjs with `customParseFormat` and freezes time to `2022-12-29 22:00` via `MockDate`. Test HTML fixtures live in `src/entrypoints/content/testdata/`.

The path alias `~` resolves to `src/` (configured in both `wxt.config.ts` and used via Vite).

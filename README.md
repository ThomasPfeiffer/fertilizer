# Fertilizer

A browser extension for Chrome and Firefox that enhances the [Harvest](https://www.getharvest.com/) time-tracking UI. It highlights breaks, overlaps, and missing or invalid notes directly in the timesheet view.

## What it does

Fertilizer injects a content script into `*.harvestapp.com` and validates your timesheet entries on every page change:

- **Breaks** — flags gaps of more than one minute between consecutive entries
- **Overlaps** — flags entries that overlap by more than one minute
- **Missing notes** — flags entries without a note
- **Invalid characters** — flags notes containing emoji characters

Results are shown inline via colored highlights and gap/overlap indicator rows inserted between entries.

## Development

Built with [WXT](https://wxt.dev/) and TypeScript.

```sh
pnpm install
pnpm dev          # Chrome (hot reload)
pnpm dev:firefox  # Firefox (hot reload)
```

## Build & Package

```sh
pnpm build          # Production build for Chrome
pnpm build:firefox  # Production build for Firefox
pnpm zip            # Packaged zip for Chrome Web Store
pnpm zip:firefox    # Packaged zip for Firefox Add-ons
```

## Release

1. Git tag with the version number and push it:
   ```sh
   git tag 1.2.3
   git push origin 1.2.3
   ```
2. The [Release workflow](.github/workflows/release.yml) triggers automatically, builds both Chrome and Firefox packages, and publishes them as a GitHub Release with two zip files attached.
3. Download the zips from the GitHub Release and upload them manually to the respective stores:
   - **Chrome**: [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - **Firefox**: [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/)

## Tests

Tests run with [Vitest](https://vitest.dev/) in a jsdom environment:

```sh
pnpm test
```

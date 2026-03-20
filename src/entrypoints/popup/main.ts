import { sendMessage, EntryWarning } from "~/messaging"

const app = document.getElementById("app")!

async function init() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true })
  const url = tab?.url ?? ""

  if (!/harvestapp\.com/.test(url)) {
    renderInactive()
  } else {
    try {
      const response = await sendMessage(tab.id!, "GET_WARNINGS")
      renderWarnings(response.warnings)
    } catch {
      renderLoading()
    }
  }
}

function renderInactive() {
  app.innerHTML = `
    <div class="state-inactive">
      <p>Fertilizer nicht aktiv, gehe auf dein Timesheet um es zu &uuml;berpr&uuml;fen</p>
    </div>
  `
}

function renderLoading() {
  app.innerHTML = `<div class="state-loading"><p>Timesheet wird geladen&hellip;</p></div>`
}

function renderWarnings(warnings: EntryWarning[]) {
  if (warnings.length === 0) {
    app.innerHTML = `<div class="state-ok"><p>Keine Warnungen</p></div>`
    return
  }

  const items = warnings.flatMap((w) => {
    const messages: string[] = []
    if (w.gap.type === "overlap") messages.push(`Überlappung (${w.gap.minutes} Min.)`)
    if (w.note.type === "missing") messages.push("Fehlende Notiz")
    if (w.note.type === "invalidCharacters")
      messages.push(`Ungültige Zeichen: ${w.note.invalidCharacters.join(" ")}`)
    if (messages.length === 0) return []
    return [`
      <li class="warning-item">
        <span class="warning-time">${w.startTime}</span>
        <span class="warning-messages">${messages.join(", ")}</span>
      </li>`]
  })

  if (items.length === 0) {
    app.innerHTML = `<div class="state-ok"><p>Keine Warnungen</p></div>`
    return
  }

  app.innerHTML = `
    <div class="state-active">
      <p class="warning-summary">${items.length} Warnung${items.length !== 1 ? "en" : ""}</p>
      <ul class="warning-list">${items.join("")}</ul>
    </div>
  `
}

init()

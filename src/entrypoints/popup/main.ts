import { sendMessage, EntryWarning } from "~/messaging"

const app = document.getElementById("app")!

async function init() {
  try {
    const response = await sendMessage("GET_STATUS")
    if (!response.isActive) {
      renderInactive()
    } else {
      renderWarnings(response.warnings, response.entryCount)
    }
  } catch {
    renderInactive()
  }
}

function renderInactive() {
  app.innerHTML = `
    <div class="state-inactive">
      <p>Der Fertilizer ist auf dieser Seite nicht aktiv, gehe auf dein Timesheet um es zu &uuml;berpr&uuml;fen</p>
    </div>
  `
}

function renderWarnings(warnings: EntryWarning[], entryCount: number) {
  const entryMeta = `${entryCount} Eintr${entryCount !== 1 ? "äge" : "ag"} validiert`

  if (warnings.length === 0) {
    app.innerHTML = `
      <div class="state-ok">
        <span class="status-icon">✓</span>
        <p class="status-title">Keine Warnungen</p>
        <p class="status-meta">${entryMeta}</p>
      </div>`
    return
  }

  const items = warnings.flatMap((w) => {
    const messages: string[] = []
    if (w.gap.type === "overlap") messages.push(`Überlappung (${w.gap.minutes} Min.)`)
    if (w.note.type === "missing") messages.push("Fehlende Notiz")
    if (w.note.type === "invalidCharacters") messages.push(`Ungültige Zeichen: ${w.note.invalidCharacters.join(" ")}`)
    if (messages.length === 0) return []
    return [
      `
      <li class="warning-item">
        <span class="warning-time">${w.startTime}</span>
        <span class="warning-messages">${messages.join(", ")}</span>
      </li>`,
    ]
  })

  if (items.length === 0) {
    app.innerHTML = `
      <div class="state-ok">
        <span class="status-icon">✓</span>
        <p class="status-title">Keine Warnungen</p>
        <p class="status-meta">${entryMeta}</p>
      </div>`
    return
  }

  app.innerHTML = `
    <div class="state-active">
      <div class="warning-header">
        <p class="status-title">${items.length} Warnung${items.length !== 1 ? "en" : ""}</p>
        <p class="status-meta">${entryMeta}</p>
      </div>
      <ul class="warning-list">${items.join("")}</ul>
    </div>
  `
}

init()

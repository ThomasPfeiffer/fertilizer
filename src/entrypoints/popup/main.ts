import { sendMessage } from "~/messaging"

const app = document.getElementById("app")!

async function init() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true })
  const url = tab?.url ?? ""

  if (!/harvestapp\.com/.test(url)) {
    renderInactive()
  } else {
    try {
      const response = await sendMessage(tab.id!, "GET_WARNING_COUNT")
      const count = response?.warningCount ?? null
      renderActive(count)
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
  const text = "Fertilizer aktiv &mdash; Timesheet wird geladen&hellip;"
  app.innerHTML = `<div class="state-active"><p>${text}</p></div>`
}

function renderActive(count: number) {
  let text: string
  if (count === 0) {
    text = "Fertilizer aktiv &mdash; Keine Warnungen im aktuellen Timesheet"
  } else {
    text = `Fertilizer aktiv &mdash; <span class="warning-count">${count}</span> Warnung(en) im aktuellen Timesheet`
  }
  app.innerHTML = `<div class="state-active"><p>${text}</p></div>`
}

init()

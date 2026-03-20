const app = document.getElementById("app")!

async function init() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true })
  const url = tab?.url ?? ""

  if (!/harvestapp\.com/.test(url)) {
    renderInactive(url)
  } else {
    let count: number | null = null
    try {
      const response = await browser.tabs.sendMessage(tab.id!, {
        type: "GET_WARNING_COUNT",
      })
      count = response?.warningCount ?? null
    } catch {
      // content script not ready
    }
    renderActive(count)
  }
}

function renderInactive(url: string) {
  let href = "https://harvestapp.com"
  try {
    const parsed = new URL(url)
    const subdomain = parsed.hostname.match(/^(.+)\.harvestapp\.com$/)?.[1]
    if (subdomain) {
      href = `https://${subdomain}.harvestapp.com`
    }
  } catch {
    // invalid URL, use default
  }

  app.innerHTML = `
    <div class="state-inactive">
      <p>Fertilizer nicht aktiv, gehe auf dein Timesheet um es zu &uuml;berpr&uuml;fen</p>
      <a href="${href}" target="_blank">${href}</a>
    </div>
  `
}

function renderActive(count: number | null) {
  let text: string
  if (count === null) {
    text = "Fertilizer aktiv &mdash; Timesheet wird geladen&hellip;"
  } else if (count === 0) {
    text = "Fertilizer aktiv &mdash; Keine Warnungen im aktuellen Timesheet"
  } else {
    text = `Fertilizer aktiv &mdash; <span class="warning-count">${count}</span> Warnung(en) im aktuellen Timesheet`
  }

  app.innerHTML = `<div class="state-active"><p>${text}</p></div>`
}

init()

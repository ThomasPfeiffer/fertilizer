async function cats() {
  const [currentTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  chrome.tabs.sendMessage(currentTab.id ?? 0, { command: "cats" });
}

document.getElementById("btn-cats")?.addEventListener("click", cats);

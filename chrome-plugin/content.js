console.log("Content script loaded");

function run() {
  const observer = new MutationObserver((mutation) => {
    console.log("Mutation!");
    // const dataIsland = window.document.querySelector("#timesheet-data-island");
    const timesheetString = mutation.target.textContent;
    const timesheet = JSON.parse(timesheetString);
    console.log(timesheet.week_of);
  });
  observer.observe(document.getElementById("timesheet-data-island"), {
    characterData: false,
    attributes: false,
    childList: true,
    subtree: false,
  });
}

// Idee verworfen
function getAllHtmlTimesheetEntries() {
  const allTimesheets = document.getElementById("day-view-entries")
  const tbody = allTimesheets.getElementsByTagName("tbody")[0]

  for(let i = 0; i < tbody.children.length - 1; ++i){
    // const starttimeOfNextElem = tbody.children.item(i + 1).getElementsByClassName("entry-timestamp-start")[0].textContent
    // const starttime = tbody.children.item(i).getElementsByClassName("entry-timestamp-start")[0].textContent


  }
}

function addTableRowToTimesheet(elementToAppend, type){
  const trElem = document.createElement("tr")
  trElem.setAttribute("colspan", "2")
  trElem.setAttribute("id", "luegge_" + elementToAppend.getAttribute("id").split('_').pop())
  const tdInTr = document.createElement("td")
  tdInTr.classList.add("lueggeBox-td")
  tdInTr.setAttribute("colspan", "3")
  const innerDivOfTr = document.createElement("div")
  innerDivOfTr.classList.add("lueggebox-" + type)
  innerDivOfTr.textContent = "soos"
  trElem.append(tdInTr)
  tdInTr.append(innerDivOfTr)

  elementToAppend.after(trElem)
  return trElem
}

const checkTimes = () => {
  const dataIsland = window.document.querySelector("#timesheet-data-island");
  const timesheetString = dataIsland.textContent;
  const timesheet = JSON.parse(timesheetString);
  console.log(timesheet.week_of);
};

setInterval(() => addTableRowToTimesheet(document.getElementById("timesheet_day_entry_1944091275"), "pause"), 1000);

window.addEventListener(
  "load",
  function load(e) {
    window.removeEventListener("load", load, false);
    this.setTimeout(() => {
      console.log("Registering Mutation observer");
      run();
    }, 3000);
  },
  false
);

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

const checkTimes = () => {
  const dataIsland = window.document.querySelector("#timesheet-data-island");
  const timesheetString = dataIsland.textContent;
  const timesheet = JSON.parse(timesheetString);
  console.log(timesheet.week_of);
};

setInterval(() => checkTimes(), 1000);

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

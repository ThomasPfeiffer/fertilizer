/* Validation error marking in DOM */
function mark(entry, text, color) {
  if (isMarked(entry)) {
    return;
  }

  const newRow = document.createElement("tr");
  newRow.setAttribute("colspan", "100%");
  newRow.setAttribute("id", idForEntryMarking(entry));

  const newCell = document.createElement("td");
  newCell.setAttribute("colspan", "100%");
  newRow.append(newCell);

  const innerDivOfTr = document.createElement("div");
  innerDivOfTr.textContent = text;
  innerDivOfTr.style.backgroundColor = color;
  innerDivOfTr.style.padding = "5px";
  newCell.append(innerDivOfTr);

  entry.element.before(newRow);
}

function idForEntryMarking(entry) {
  return "luegge_" + entry.id;
}

function findMarkingFor(entry) {
  const id = idForEntryMarking(entry);
  return document.getElementById(id);
}

function isMarked(entry) {
  return Boolean(findMarkingFor(entry));
}

function unmark(entry) {
  const marking = findMarkingFor(entry);
  marking && marking.remove();
}

/* Timesheet Entry validation */
function compare(firstEntry, secondEntry) {
  const timeDiff = secondEntry.startMinute - firstEntry.endMinute;
  const isBreak = timeDiff > 1;

  if (isBreak) {
    return {
      type: "break",
      minutes: timeDiff,
    };
  }

  const isOverlap = timeDiff < 0;

  if (isOverlap) {
    return {
      type: "overlap",
      minutes: -timeDiff,
    };
  }

  return { type: "ok" };
}

function processTimesheet(entries) {
  entries.forEach((currentEntry, index) => {
    const previousEntry = entries[index - 1];

    if (!previousEntry) {
      return;
    }

    const result = compare(previousEntry, currentEntry);

    switch (result.type) {
      case "break":
        mark(currentEntry, `${result.minutes}min Pause`, "green");
        break;
      case "overlap":
        mark(currentEntry, `${result.minutes}min Überlappung`, "red");
        break;
      case "ok":
        unmark(currentEntry);
        break;
    }
  });
}

/* DOM Queries */
function findTimesheetElement() {
  return document.getElementById("day-view-entries");
}

function findEntries() {
  const tableRowElements = Array.from(
    window.document.querySelectorAll(".day-view-entry")
  );

  return tableRowElements.map((tableRow) => {
    const startTimeText = tableRow.querySelector(
      ".entry-timestamp-start"
    ).textContent;
    const endTimeText = tableRow.querySelector(
      ".entry-timestamp-end"
    ).textContent;
    return {
      startMinute: parseMinutes(startTimeText),
      endMinute: parseMinutes(endTimeText),
      element: tableRow,
      id: tableRow.id,
    };
  });
}

function parseMinutes(text) {
  const [hour, minute] = text.split(":");
  return parseInt(hour) * 60 + parseInt(minute);
}

/* Entrypoint */
function initialize() {
  const targetNode = findTimesheetElement();
  const config = { attributes: true, childList: true, subtree: true };
  const observer = new MutationObserver(() => {
    const entries = findEntries();
    processTimesheet(entries);
  });
  observer.observe(targetNode, config);
}
initialize();

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
  newCell.style.padding = 0;
  newRow.append(newCell);

  const markingContainer = document.createElement("div");
  markingContainer.style.backgroundColor = color;
  markingContainer.style.padding = "0.5rem";
  markingContainer.style.display = "flex";
  newCell.append(markingContainer);

  function createArrow() {
    const arrow = document.createElement("span");
    arrow.textContent = "↕️";
    return arrow;
  }

  markingContainer.append(createArrow());

  const markingElement = document.createElement("mark");
  markingElement.textContent = text;
  markingElement.style.flex = "1";
  markingElement.style.textAlign = "center";
  markingElement.style.backgroundColor = "unset";
  markingContainer.append(markingElement);

  markingContainer.append(createArrow());

  entry.element.after(newRow);
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

function displayError() {
  const id = "fertilizer-error-alert";
  if (document.getElementById(id)) {
    return;
  }
  const alert = document.createElement("div");
  alert.id = id;
  alert.style.position = "sticky";
  alert.style.bottom = "20px";
  alert.style.left = "20px";
  alert.style.width = "350px";
  alert.style.backgroundColor = "rgb(255 0 0 / 24%)";
  alert.style.textAlign = "center";
  alert.style.paddingTop = "1rem";
  alert.style.paddingBottom = "1rem";
  alert.style.borderRadius = "5px";
  alert.textContent = "Achtung: Fertilizer funktioniert nicht mehr!";
  document.body.appendChild(alert);
}

/* Timesheet Entry validation */

function midnightAdjustment(entry) {
  function passesMidnight(entry) {
    return entry.endMinute < entry.startMinute;
  }

  return passesMidnight(entry) ? 1440 : 0;
}

function compare(firstEntry, secondEntry) {
  const secondStart = secondEntry.startMinute + midnightAdjustment(secondEntry);
  const firstEnd = firstEntry.endMinute + midnightAdjustment(firstEntry);
  const timeDiff = secondStart - firstEnd;

  if (timeDiff > 1) {
    return {
      type: "break",
      minutes: timeDiff,
    };
  }

  if (timeDiff < 0) {
    return {
      type: "overlap",
      minutes: -timeDiff,
    };
  }

  return { type: "ok" };
}

function processTimesheet(entries) {
  entries.forEach((currentEntry, index) => {
    const nextEntry = entries[index + 1];

    if (!nextEntry) {
      return;
    }

    const result = compare(currentEntry, nextEntry);

    switch (result.type) {
      case "break":
        mark(
          currentEntry,
          `${result.minutes} Minuten Pause`,
          "rgb(142 223 142 / 37%)"
        );
        break;
      case "overlap":
        mark(
          currentEntry,
          `${result.minutes} Minuten Überlappung`,
          "rgb(255 0 0 / 24%)"
        );
        break;
      case "ok":
        unmark(currentEntry);
        break;
    }
  });
}

/* DOM Queries */
function findTimesheetElement() {
  const element = document.getElementById("day-view-entries");
  if (element === null) {
    throw new Error("Failed to find root element for timesheet");
  }
  return element;
}

function findEntries(timesheetElement) {
  const tableRowElements = Array.from(
    timesheetElement.querySelectorAll(".day-view-entry")
  );

  return tableRowElements.map((tableRow) => {
    function find(selector) {
      const result = tableRow.querySelector(selector);
      if (result === null) {
        displayError();
        throw Error("Failed to find timestamp elements in table row");
      }
      return result;
    }
    const startTimeText = find(".entry-timestamp-start").textContent;
    const endTimeText = find(".entry-timestamp-end").textContent;

    return {
      startMinute: parseMinutes(startTimeText),
      endMinute: endTimeText ? parseMinutes(endTimeText) : currentMinutes(),
      element: tableRow,
      id: tableRow.id,
    };
  });
}

function currentMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function parseMinutes(text) {
  const [hour, minute] = text.split(":");
  return parseInt(hour) * 60 + parseInt(minute);
}

/* Entrypoint */
function initialize() {
  try {
    const timesheetElement = findTimesheetElement();
    const config = { attributes: true, childList: true, subtree: true };
    const observer = new MutationObserver(() => {
      const entries = findEntries(timesheetElement);
      processTimesheet(entries);
    });
    observer.observe(timesheetElement, config);
  } catch (e) {
    console.error("Fertilizer: ", e);
    displayError();
  }
}
initialize();

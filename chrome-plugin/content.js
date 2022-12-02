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

function addMarking(entry, text, color) {
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

function removeMarking(entry) {
  const marking = findMarkingFor(entry);
  marking && marking.remove();
}

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

const checkTimes = () => {
  const entries = findEntries();

  entries.forEach((currentEntry, index) => {
    const previousEntry = entries[index - 1];

    if (!previousEntry) {
      return;
    }

    const result = compare(previousEntry, currentEntry);

    switch (result.type) {
      case "break":
        !isMarked(currentEntry) &&
          addMarking(currentEntry, `${result.minutes}min Pause`, "green");
        break;
      case "overlap":
        !isMarked(currentEntry) &&
          addMarking(currentEntry, `${result.minutes}min Überlappung`, "red");
        break;
      case "ok":
        removeMarking(currentEntry);
        break;
    }
  });
};

setInterval(() => checkTimes(), 500);

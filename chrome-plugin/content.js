console.log("Content script loaded");

function getIdForTableRow(tableRow) {
  return "luegge_" + tableRow.getAttribute("id").split("_").pop();
}

function addTableRowToTimesheet(elementToAppend, type) {
  const trElem = document.createElement("tr");
  trElem.setAttribute("colspan", "2");
  trElem.setAttribute("id", getIdForTableRow(elementToAppend));
  const tdInTr = document.createElement("td");
  tdInTr.classList.add("lueggeBox-td");
  tdInTr.setAttribute("colspan", "3");
  const innerDivOfTr = document.createElement("div");
  innerDivOfTr.classList.add("lueggebox-" + type);
  innerDivOfTr.textContent = "soos";
  trElem.append(tdInTr);
  tdInTr.append(innerDivOfTr);

  elementToAppend.before(trElem);
  return trElem;
}

function getTime(element, name) {
  const start = element.querySelector(".entry-timestamp-" + name).textContent;

  const [hour, minute] = start.split(":");

  return parseInt(hour) * 60 + parseInt(minute);
}

const markings = {};

function addMarking(tablerow) {
  const markierung = document.createElement("div");
  markierung.textContent = "ALAAAAAAAAARM";
  tablerow.appendChild(markierung);
  return markierung;
}

function removeMarking(tablerow) {
  console.log("Removing mark for " + tablerow.id);
  console.log(markings[tablerow.id]);
  markings[tablerow.id].remove();

  delete markings[tablerow.id];
}

const checkTimes = () => {
  console.log(markings);
  console.log("-----");
  const entryTableRowElements =
    window.document.querySelectorAll(".day-view-entry");

  let previousEntryEnd;

  entryTableRowElements.forEach((entryTableRowEl) => {
    const timestampsWrapper =
      entryTableRowEl.querySelector(".entry-timestamps");

    const start = getTime(timestampsWrapper, "start");
    if (previousEntryEnd) {
      // const isÜberlappung = previousTimestampEnd > start;
      // console.log("Überlappung");
      // console.log(isÜberlappung, previousTimestampEnd, start);
      //
      const isMarked =
        Object.keys(markings).includes(entryTableRowEl.id) &&
        markings[entryTableRowEl.id];

      const isBreak = start - previousEntryEnd > 1;
      if (isBreak && !isMarked) {
        const markierung = addTableRowToTimesheet(entryTableRowEl, "pause");
        markings[entryTableRowEl.id] = markierung;
      }
      if (!isBreak && isMarked) {
        removeMarking(entryTableRowEl);
      }
    }

    const end = getTime(timestampsWrapper, "end");
    previousEntryEnd = end;
  });
};

setInterval(() => checkTimes(), 5000);

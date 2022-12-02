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
  innerDivOfTr.textContent = "ALAAAAAARRRRM!!";
  innerDivOfTr.style.backgroundColor = "green";
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

function removeMarking(tablerow) {
  const marking = document.getElementById(getIdForTableRow(tablerow));
  if (marking) {
    markings[tablerow.id].remove();
  }

  delete markings[tablerow.id];
}

const checkTimes = () => {
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
      const idForMarking = getIdForTableRow(entryTableRowEl);
      const isMarked =
        Object.keys(markings).includes(entryTableRowEl.id) &&
        document.getElementById(getIdForTableRow(entryTableRowEl));

      const isBreak = start - previousEntryEnd > 1;
      if (isBreak && !isMarked) {
        addTableRowToTimesheet(entryTableRowEl, "pause");
        markings[entryTableRowEl.id] = idForMarking;
      }
      if (!isBreak && isMarked) {
        removeMarking(entryTableRowEl);
      }
      if (!isBreak) {
        delete markings[entryTableRowEl.id];
      }
    }

    const end = getTime(timestampsWrapper, "end");
    previousEntryEnd = end;
  });
};

setInterval(() => checkTimes(), 500);

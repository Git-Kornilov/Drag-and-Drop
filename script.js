"use strict";

const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArray = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release something", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Work out", "Getting stuff done"];
    onHoldListArray = ["Being calm"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArray = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];

  const arrayNames = ["backlog", "progress", "complete", "onHold"];

  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArray[index]));
  });
}

// Filter array to remove item (null)
const filterArray = (array) => {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
};

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);

  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);

  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);

  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);

  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Update item - delete / update Array value
const updateItem = (id, column) => {
  const selectedArray = listArray[column];
  const selectedColumnEl = listColumns[column].children;

  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }

    updateDOM();
  }
};

// Allow  array to reflect drag-drop items
const rebuildArrays = () => {
  // fill array from backlogList.children (convert to Array.from()) with map.method
  backlogListArray = Array.from(backlogList.children).map((i) => i.textContent);
  progressListArray = Array.from(progressList.children).map(
    (i) => i.textContent
  );
  completeListArray = Array.from(completeList.children).map(
    (i) => i.textContent
  );
  onHoldListArray = Array.from(backlogList.children).map((i) => i.textContent);

  updateDOM();
};

//Ad to colum list, reset textbox
const addToColumn = (col) => {
  const itemText = addItems[col].textContent;
  const selectedArray = listArray[col];
  selectedArray.push(itemText);

  addItems[col].textContent = "";

  updateDOM();
};

// Show input box
const showInputBox = (col) => {
  addBtns[col].style.visibility = "hidden";
  saveItemBtns[col].style.display = "flex";
  addItemContainers[col].style.display = "flex";
};

// Hide input box
const hideInputBox = (col) => {
  addBtns[col].style.visibility = "visible";
  saveItemBtns[col].style.display = "none";
  addItemContainers[col].style.display = "none";

  addToColumn(col);
};

// Start dragging
const drag = (e) => {
  draggedItem = e.target;

  dragging = true;
};

// Allow drop
const allowDrop = (e) => {
  e.preventDefault();
};

// Item enters on column - show color
const dragEnter = (column) => {
  listColumns[column].classList.add("over");

  currentColumn = column;
};

// Dropping item
const drop = (e) => {
  e.preventDefault();
  listColumns.forEach((column) => column.classList.remove("over"));

  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);

  dragging = false;

  rebuildArrays();
};

// On load
updateDOM();

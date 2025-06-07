let entries = [];
let isEditing = false;
let editIndex = null;

const form = document.getElementById("entry-form");
const typeInput = document.getElementById("type");
const descInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const dateReceivedInput = document.getElementById("date-received");
const dueDateInput = document.getElementById("due-date");
const paidDateInput = document.getElementById("paid-date");
const incomeDates = document.getElementById("income-dates");
const expenseDates = document.getElementById("expense-dates");
const tableBody = document.querySelector("#entry-table tbody");
const balanceEl = document.getElementById("balance");
const addButton = document.getElementById("add-button");
const liveRegion = document.getElementById("live-region");

typeInput.addEventListener("change", () => {
  if (typeInput.value === "income") {
    incomeDates.style.display = "block";
    expenseDates.style.display = "none";
  } else {
    incomeDates.style.display = "none";
    expenseDates.style.display = "block";
  }
});

function updateButtonLabel() {
  addButton.textContent = isEditing ? "Update Entry" : "Add Entry";
}

function updateBalance() {
  let balance = 0;
  entries.forEach(e => {
    balance += e.type === "income" ? e.amount : -e.amount;
  });
  balanceEl.textContent = balance.toFixed(2);
}

function renderTable() {
  tableBody.innerHTML = "";
  entries.forEach((entry, index) => {
    let dateDisplay = "";
    if (entry.type === "income") {
      dateDisplay = `Received: ${entry.dateReceived}`;
    } else {
      dateDisplay = `Due: ${entry.dueDate || 'N/A'}<br>Paid: ${entry.paidDate}`;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.type}</td>
      <td>${entry.description}</td>
      <td>$${entry.amount.toFixed(2)}</td>
      <td>${dateDisplay}</td>
      <td>
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </td>
    `;

    const editBtn = row.querySelector(".edit");
    const deleteBtn = row.querySelector(".delete");

    editBtn.addEventListener("click", () => {
      isEditing = true;
      editIndex = index;
      typeInput.value = entry.type;
      descInput.value = entry.description;
      amountInput.value = entry.amount;
      dateReceivedInput.value = entry.dateReceived || "";
      dueDateInput.value = entry.dueDate || "";
      paidDateInput.value = entry.paidDate || "";
      typeInput.dispatchEvent(new Event("change"));
      updateButtonLabel();
    });

    setupDeleteButton(deleteBtn, index);
    tableBody.appendChild(row);
  });
}

function setupDeleteButton(button, index) {
  let confirmed = false;
  button.addEventListener("click", function () {
    if (!confirmed) {
      button.textContent = "Confirm Delete?";
      confirmed = true;
      setTimeout(() => {
        button.textContent = "Delete";
        confirmed = false;
      }, 3000);
    } else {
      entries.splice(index, 1);
      renderTable();
      updateBalance();
      liveRegion.textContent = "Entry deleted.";
    }
  });
}

function showSavedFeedback() {
  const originalText = addButton.textContent;
  addButton.textContent = "Saved!";
  setTimeout(() => {
    addButton.textContent = originalText;
  }, 2000);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const type = typeInput.value;
  const description = descInput.value.trim();
  const amount = parseFloat(amountInput.value);

  const dateReceived = dateReceivedInput.value;
  const dueDate = dueDateInput.value || "";
  const paidDate = paidDateInput.value;

  if (isNaN(amount) || description === "") return;

  let entry = { type, description, amount };

  if (type === "income") {
    entry.dateReceived = dateReceived;
  } else {
    if (dueDate) entry.dueDate = dueDate;
    entry.paidDate = paidDate;
  }

  if (isEditing && editIndex !== null) {
    entries[editIndex] = entry;
    isEditing = false;
    editIndex = null;
    updateButtonLabel();
    liveRegion.textContent = "Entry updated.";
  } else {
    entries.push(entry);
    liveRegion.textContent = "Entry added.";
  }

  descInput.value = "";
  amountInput.value = "";
  dateReceivedInput.value = "";
  dueDateInput.value = "";
  paidDateInput.value = "";

  renderTable();
  updateBalance();
  showSavedFeedback();
});

updateButtonLabel();
typeInput.dispatchEvent(new Event("change"));

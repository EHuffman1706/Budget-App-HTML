
let entries = JSON.parse(localStorage.getItem('budgetEntries')) || [];
let editIndex = -1;

function updateTable() {
  const tbody = document.querySelector('#entryTable tbody');
  const balanceDiv = document.getElementById('runningBalance');
  tbody.innerHTML = '';
  let income = 0;
  let expenses = 0;

  entries.forEach((entry, index) => {
    if (entry.type === 'income') income += entry.amount;
    else expenses += entry.amount;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>$${entry.amount.toFixed(2)}</td>
      <td>${entry.category}</td>
      <td>${entry.type}</td>
      <td>${entry.date}</td>
      <td>
        <button onclick="editEntry(${index})">Edit</button>
        <button onclick="deleteEntry(${index})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  const balance = income - expenses;
  balanceDiv.textContent = \`Running Balance: $\${balance.toFixed(2)}\`;
  localStorage.setItem('budgetEntries', JSON.stringify(entries));
}

document.getElementById('entryForm').onsubmit = e => {
  e.preventDefault();
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const type = document.getElementById('type').value;
  const date = document.getElementById('entryDate').value;

  if (editIndex > -1) {
    entries[editIndex] = { amount, category, type, date };
    editIndex = -1;
  } else {
    entries.push({ amount, category, type, date });
  }

  e.target.reset();
  updateTable();
};

function editEntry(index) {
  const entry = entries[index];
  document.getElementById('amount').value = entry.amount;
  document.getElementById('category').value = entry.category;
  document.getElementById('type').value = entry.type;
  document.getElementById('entryDate').value = entry.date;
  editIndex = index;
}

function deleteEntry(index) {
  entries.splice(index, 1);
  updateTable();
}

window.onload = updateTable;


let editIndex = null;

document.getElementById('entryForm').onsubmit = function(e) {
  e.preventDefault();

  const amount = document.getElementById('amount').value;
  const type = document.getElementById('type').value;
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;

  const entries = JSON.parse(localStorage.getItem('entries')) || [];

  if (editIndex !== null) {
    // Update existing entry
    entries[editIndex] = { amount, type, category, date };
    editIndex = null;
  } else {
    // Add new entry
    entries.push({ amount, type, category, date });
  }

  localStorage.setItem('entries', JSON.stringify(entries));
  document.getElementById('entryForm').reset();
  renderEntries();
};

function renderEntries() {
  const entries = JSON.parse(localStorage.getItem('entries')) || [];
  const table = document.getElementById('entryTable').querySelector('tbody');
  table.innerHTML = '';

  entries.forEach((entry, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${entry.amount}</td>
      <td>${entry.type}</td>
      <td>${entry.category}</td>
      <td>${entry.date}</td>
      <td>
        <button onclick="editEntry(${index})">Edit</button>
        <button onclick="deleteEntry(${index})">Delete</button>
      </td>
    `;
    table.appendChild(row);
  });
}

function deleteEntry(index) {
  const entries = JSON.parse(localStorage.getItem('entries')) || [];
  entries.splice(index, 1);
  localStorage.setItem('entries', JSON.stringify(entries));
  renderEntries();
}

function editEntry(index) {
  const entries = JSON.parse(localStorage.getItem('entries')) || [];
  const entry = entries[index];

  document.getElementById('amount').value = entry.amount;
  document.getElementById('type').value = entry.type;
  document.getElementById('category').value = entry.category;
  document.getElementById('date').value = entry.date;

  editIndex = index;
}

// Load saved entries on page load
window.addEventListener('load', renderEntries);


document.getElementById('entryForm').onsubmit = function(e) {
  e.preventDefault();
  const amount = document.getElementById('amount').value;
  const type = document.getElementById('type').value;
  const category = document.getElementById('category').value;
  const date = document.getElementById('date').value;

  const table = document.getElementById('entryTable').querySelector('tbody');
  const row = document.createElement('tr');
  row.innerHTML = `<td>${amount}</td><td>${type}</td><td>${category}</td><td>${date}</td>`;
  table.appendChild(row);

  document.getElementById('entryForm').reset();
};

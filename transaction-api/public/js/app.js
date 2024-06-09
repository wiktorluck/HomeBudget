document.addEventListener('DOMContentLoaded', function() {
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    function formatDateForInput(dateStr) {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`; 
    }

    fetch('/api/transactions')
        .then(response => response.json())
        .then(data => {
            const groupedTransactions = {};
            data.forEach(transaction => {
                const date = transaction.date.substring(0, 10);
                if (!groupedTransactions[date]) {
                    groupedTransactions[date] = [];
                }
                groupedTransactions[date].push(transaction);
            });

            const daysList = document.getElementById('daysList');
            const sortedDates = Object.keys(groupedTransactions).sort((a, b) => new Date(b) - new Date(a));

            sortedDates.forEach(date => {
                const transactions = groupedTransactions[date];
                const formattedDate = formatDate(date);
                const dayItem = document.createElement('li');
                dayItem.className = 'list-group-item transactions-day';
                dayItem.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <strong>${formattedDate}</strong><span class="badge text-bg-primary rounded-pill">${transactions.length}</span>
                    </div>
                    <ul class="list-group list-group-numbered transactions-list">
                        ${transactions.map(transaction => `
                            <li class="list-group-item d-flex justify-content-between align-items-start">
                                <div class="ms-2 me-auto">
                                    <strong>Tytuł:</strong> ${transaction.title}<br>
                                    <strong>Opis:</strong> ${transaction.body}<br>
                                    <strong>Kwota:</strong> ${transaction.amount} zł<br>
                                    <strong>Data:</strong> ${formatDate(transaction.date)}
                                </div>
                                <div>
                                    <button class="btn btn-sm btn-warning edit-transaction" data-id="${transaction._id}" data-title="${transaction.title}" data-body="${transaction.body}" data-amount="${transaction.amount}" data-date="${transaction.date}">Edytuj</button>
                                    <button class="btn btn-sm btn-danger delete-transaction" data-id="${transaction._id}">Usuń</button>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                `;
                daysList.appendChild(dayItem);
            });

            document.querySelectorAll('.transactions-day').forEach(dayItem => {
                dayItem.addEventListener('click', function() {
                    const transactionsList = this.querySelector('.transactions-list');
                    transactionsList.style.display = transactionsList.style.display === 'none' ? 'block' : 'none';
                });
            });

            document.querySelectorAll('.edit-transaction').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const title = this.getAttribute('data-title');
                    const body = this.getAttribute('data-body');
                    const amount = this.getAttribute('data-amount');
                    const date = formatDateForInput(this.getAttribute('data-date'));

                    document.getElementById('editTransactionId').value = id;
                    document.getElementById('editTitle').value = title;
                    document.getElementById('editBody').value = body;
                    document.getElementById('editAmount').value = amount;
                    document.getElementById('editDate').value = date;

                    $('#editTransactionModal').modal('show');
                });
            });

            document.querySelectorAll('.delete-transaction').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');

                    if (confirm('Czy na pewno chcesz usunąć tę transakcję?')) {
                        fetch(`/api/transactions/${id}`, {
                            method: 'DELETE'
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Error deleting transaction');
                            }
                            return response.text();
                        })
                        .then(() => {
                            const listItem = this.closest('li');
                            const dayItem = listItem.closest('.transactions-day');
                            const transactionsList = listItem.closest('.transactions-list');

                            listItem.remove();

                            const badge = dayItem.querySelector('.badge');
                            badge.textContent = transactionsList.children.length;

                            if (transactionsList.children.length === 0) {
                                dayItem.remove();
                            }
                        })
                        .catch(error => console.error('Error:', error));
                    }
                });
            });
        });

    // Add transaction
    const addForm = document.getElementById('addTransactionForm');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const title = document.getElementById('title').value;
            const body = document.getElementById('body').value;
            const amount = parseFloat(document.getElementById('amount').value);
            const date = document.getElementById('date').value || new Date().toISOString().substring(0, 10);

            fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, body, amount, date })
            })
            .then(response => response.json())
            .then(data => {
                location.reload(); 
            })
            .catch(error => console.error('Error:', error));

            addForm.reset();
            $('#addTransactionModal').modal('hide');
        });
    }

    // Edit transaction
    const editForm = document.getElementById('editTransactionForm');
    if (editForm) {
        editForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const id = document.getElementById('editTransactionId').value;
            const title = document.getElementById('editTitle').value;
            const body = document.getElementById('editBody').value;
            const amount = parseFloat(document.getElementById('editAmount').value);
            const date = document.getElementById('editDate').value;

            fetch(`/api/transactions/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, body, amount, date })
            })
            .then(response => response.json())
            .then(data => {
                location.reload(); 
            })
            .catch(error => console.error('Error:', error));

            editForm.reset();
            $('#editTransactionModal').modal('hide');
        });
    }
});

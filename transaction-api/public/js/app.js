document.addEventListener('DOMContentLoaded', function() {
    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;  // Format YYYY-MM-DD
    }

    fetch('/api/transactions')
        .then(response => response.json())
        .then(data => {
            const transactionList = document.getElementById('transactionList');
            if (transactionList) {
                data.forEach(transaction => {
                    const formattedDate = formatDate(transaction.date);
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                    listItem.innerHTML = `
                        <div>
                            <strong>Tytuł:</strong> ${transaction.title}<br>
                            <strong>Opis:</strong> ${transaction.body}<br>
                            <strong>Kwota:</strong> ${transaction.amount} zł<br>
                            <strong>Data:</strong> ${formattedDate}
                        </div>
                        <div>
                            <button class="btn btn-sm btn-warning edit-transaction" data-id="${transaction._id}" data-title="${transaction.title}" data-body="${transaction.body}" data-amount="${transaction.amount}" data-date="${transaction.date}">Edytuj</button>
                            <button class="btn btn-sm btn-danger delete-transaction" data-id="${transaction._id}">Usuń</button>
                        </div>
                    `;
                    transactionList.appendChild(listItem);
                });

                // Attach event listeners for edit and delete buttons
                document.querySelectorAll('.edit-transaction').forEach(button => {
                    button.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        const title = this.getAttribute('data-title');
                        const body = this.getAttribute('data-body');
                        const amount = this.getAttribute('data-amount');
                        const date = this.getAttribute('data-date').substring(0, 10);  // Format YYYY-MM-DD
                        
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
                                this.closest('li').remove();
                            })
                            .catch(error => console.error('Error:', error));
                        }
                    });
                });
            }
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
                const formattedDate = formatDate(data.date);
                const transactionList = document.getElementById('transactionList');
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                listItem.innerHTML = `
                    <div>
                        <strong>Tytuł:</strong> ${data.title}<br>
                        <strong>Opis:</strong> ${data.body}<br>
                        <strong>Kwota:</strong> ${data.amount} zł<br>
                        <strong>Data:</strong> ${formattedDate}
                    </div>
                    <div>
                        <button class="btn btn-sm btn-warning edit-transaction" data-id="${data._id}" data-title="${data.title}" data-body="${data.body}" data-amount="${data.amount}" data-date="${data.date}">Edytuj</button>
                        <button class="btn btn-sm btn-danger delete-transaction" data-id="${data._id}">Usuń</button>
                    </div>
                `;
                transactionList.appendChild(listItem);

                // Attach event listeners for new edit and delete buttons
                listItem.querySelector('.edit-transaction').addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const title = this.getAttribute('data-title');
                    const body = this.getAttribute('data-body');
                    const amount = this.getAttribute('data-amount');
                    const date = this.getAttribute('data-date').substring(0, 10);
                    
                    document.getElementById('editTransactionId').value = id;
                    document.getElementById('editTitle').value = title;
                    document.getElementById('editBody').value = body;
                    document.getElementById('editAmount').value = amount;
                    document.getElementById('editDate').value = date;
                    
                    $('#editTransactionModal').modal('show');
                });

                listItem.querySelector('.delete-transaction').addEventListener('click', function() {
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
                            this.closest('li').remove();
                        })
                        .catch(error => console.error('Error:', error));
                    }
                });

                // Clear form and close modal
                addForm.reset();
                $('#addTransactionModal').modal('hide');
            })
            .catch(error => console.error('Error:', error));
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
                const formattedDate = formatDate(data.date);
                const listItem = document.querySelector(`button[data-id="${id}"]`).closest('li');
                listItem.innerHTML = `
                    <div>
                        <strong>Tytuł:</strong> ${data.title}<br>
                        <strong>Opis:</strong> ${data.body}<br>
                        <strong>Kwota:</strong> ${data.amount} zł<br>
                        <strong>Data:</strong> ${formattedDate}
                    </div>
                    <div>
                        <button class="btn btn-sm btn-warning edit-transaction" data-id="${data._id}" data-title="${data.title}" data-body="${data.body}" data-amount="${data.amount}" data-date="${data.date}">Edytuj</button>
                        <button class="btn btn-sm btn-danger delete-transaction" data-id="${data._id}">Usuń</button>
                    </div>
                `;

                // Attach event listeners for updated edit and delete buttons
                listItem.querySelector('.edit-transaction').addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const title = this.getAttribute('data-title');
                    const body = this.getAttribute('data-body');
                    const amount = this.getAttribute('data-amount');
                    const date = this.getAttribute('data-date').substring(0, 10);
                    
                    document.getElementById('editTransactionId').value = id;
                    document.getElementById('editTitle').value = title;
                    document.getElementById('editBody').value = body;
                    document.getElementById('editAmount').value = amount;
                    document.getElementById('editDate').value = date;
                    
                    $('#editTransactionModal').modal('show');
                });

                listItem.querySelector('.delete-transaction').addEventListener('click', function() {
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
                            this.closest('li').remove();
                        })
                        .catch(error => console.error('Error:', error));
                    }
                });

                // Clear form and close modal
                editForm.reset();
                $('#editTransactionModal').modal('hide');
            })
            .catch(error => console.error('Error:', error));
        });
    }
});

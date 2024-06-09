const Transaction = require('../db/models/transaction');

class TransactionActions {
    async saveTransaction(req, res) {
        const { title, body, amount, date } = req.body;

        console.log('Received data for saving:', { title, body, amount, date });

        if (!title || !body || !amount) {
            return res.status(400).json({ message: 'Title, body, and amount are required' });
        }
        if (isNaN(amount)) {
            return res.status(400).json({ message: 'Amount must be a number' });
        }

        try {
            const transaction = new Transaction({
                title,
                body,
                amount: parseFloat(amount),
                date: date ? new Date(date) : new Date()
            });

            await transaction.save();
            console.log('Transaction saved:', transaction);
            res.status(201).json(transaction);
        } catch (err) {
            console.error('Error saving transaction:', err);
            res.status(422).json({ message: err.message });
        }
    }

    async getAllTransactions(req, res) {
        try {
            const transactions = await Transaction.find({});
            console.log('Transactions retrieved:', transactions);
            res.status(200).json(transactions);
        } catch (err) {
            console.error('Error retrieving transactions:', err);
            res.status(500).json({ message: err.message });
        }
    }

    async getTransaction(req, res) {
        const id = req.params.id;
        try {
            const transaction = await Transaction.findById(id);
            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found' });
            }
            res.status(200).json(transaction);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async updateTransaction(req, res) {
        const id = req.params.id;
        const { title, body, amount, date } = req.body;

        console.log('Received data for updating:', { id, title, body, amount, date });

        try {
            const transaction = await Transaction.findById(id);
            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found' });
            }

            if (!title || !body || !amount || !date) {
                return res.status(400).json({ message: 'Title, body, amount, and date are required' });
            }
            if (isNaN(amount)) {
                return res.status(400).json({ message: 'Amount must be a number' });
            }

            transaction.title = title;
            transaction.body = body;
            transaction.amount = parseFloat(amount);
            transaction.date = new Date(date);
            await transaction.save();

            console.log('Transaction updated:', transaction);
            res.status(200).json(transaction);
        } catch (err) {
            console.error('Error updating transaction:', err);
            res.status(500).json({ message: err.message });
        }
    }

    async deleteTransaction(req, res) {
        const id = req.params.id;

        console.log('Received request for deletion:', { id });

        try {
            const transaction = await Transaction.findById(id);
            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found' });
            }

            await Transaction.deleteOne({ _id: id });
            console.log('Transaction deleted:', id);
            res.sendStatus(204);
        } catch (err) {
            console.error('Error deleting transaction:', err);
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = new TransactionActions();

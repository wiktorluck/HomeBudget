const Transaction = require('../db/models/transaction');

class TransactionActions {

    async saveTransaction(req, res){
        const { title, body, amount } = req.body;
        
        // Walidacja danych
        if (!title || !body || !amount) {
            return res.status(400).json({ message: 'Title, body, and amount are required' });
        }

        let transaction;

        try {
            transaction = new Transaction({
                title: title,
                body: body,
                amount: amount
            });
    
            await transaction.save(); 
        } catch (err) {
            return res.status(422).json({ message: err.message });
        }

        res.status(201).json(transaction);
    }

    async getAllTransactions(req, res){
        const doc = await Transaction.find({});
        res.status(200).json(doc);
    }

    async getTransaction(req, res){
        const id = req.params.id;
        const transaction = await Transaction.findOne({ _id: id });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json(transaction);
    }

    async updateTransaction(req, res){
        const id = req.params.id;
        const { title, body, amount } = req.body;

        const transaction = await Transaction.findOne({ _id: id });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        transaction.title = title;
        transaction.body = body;
        transaction.amount = amount;
        await transaction.save();

        res.status(200).json(transaction);
    }

    async deleteTransaction(req, res){
        const id = req.params.id;
        const transaction = await Transaction.findOne({ _id: id });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        await Transaction.deleteOne({ _id: id });

        res.sendStatus(204);
    }
}

module.exports = new TransactionActions();

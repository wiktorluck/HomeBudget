const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Transaction', transactionSchema);

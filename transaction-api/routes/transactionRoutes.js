const express = require('express');
const router = express.Router();
const transactionActions = require('../controllers/transactionActions');

router.post('/transactions', transactionActions.saveTransaction);
router.get('/transactions', transactionActions.getAllTransactions);
router.get('/transactions/:id', transactionActions.getTransaction);
router.put('/transactions/:id', transactionActions.updateTransaction);
router.delete('/transactions/:id', transactionActions.deleteTransaction);

module.exports = router;

const express = require('express');
const router = express.Router();
const transactionActions = require('../controllers/transactionActions');

router.post('/', transactionActions.saveTransaction);
router.get('/', transactionActions.getAllTransactions);
router.get('/:id', transactionActions.getTransaction);
router.put('/:id', transactionActions.updateTransaction);
router.delete('/:id', transactionActions.deleteTransaction);

module.exports = router;

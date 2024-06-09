const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const transactionRoutes = require('./routes/transactionRoutes');
const db = require('./db');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/transactions', transactionRoutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'transactions.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const transactionRoutes = require('./routes/transactionRoutes');
require('./db');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', transactionRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/transactions', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'transactions.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

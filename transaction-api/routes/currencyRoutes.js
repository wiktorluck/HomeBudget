const express = require('express');
const router = express.Router();
const axios = require('axios');

// Endpoint do przeliczania walut
router.get('/convert', async (req, res) => {
    const { amount, from, to } = req.query;

    if (!amount || !from || !to) {
        return res.status(400).json({ error: 'Proszę podać kwotę, walutę źródłową i walutę docelową' });
    }

    try {
        const apiKey = 'd29e0837e947abe6438ef78d';
        const apiUrl = `https://api.exchangerate-api.com/v4/latest/${from}`;

        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data.error) {
            return res.status(400).json({ error: data.error });
        }

        const rate = data.rates[to];
        if (!rate) {
            return res.status(400).json({ error: `Nie znaleziono kursu wymiany dla waluty ${to}` });
        }

        const result = amount * rate;
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

module.exports = router;

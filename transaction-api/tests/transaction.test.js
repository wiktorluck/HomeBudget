const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); 
const Transaction = require('../db/models/transaction'); 

let server;

beforeAll(async () => {
    const url = 'mongodb://127.0.0.1:27017/homebudget-test';
    if (!mongoose.connection.readyState) {
        await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    }
    // Wystartuj serwer na porcie 4000
    server = app.listen(4000); 
});

afterAll(async () => {
    await mongoose.connection.close();
    server.close();
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (let key in collections) {
        await collections[key].deleteMany({});
    }
});

describe('Transaction API', () => {

    //Sprawdzenie utworzenia nowej transakcji
    it('should create a new transaction', async () => {
        const response = await request(server)
            .post('/api/transactions')
            .send({
                title: 'Test Transaction',
                body: 'This is a test transaction',
                amount: 100,
                date: '2024-06-10'
            })
            .expect(201);

        expect(response.body).toHaveProperty('_id');
        expect(response.body.title).toBe('Test Transaction');
        expect(response.body.body).toBe('This is a test transaction');
        expect(response.body.amount).toBe(100);
    });

    //Sprawdzenie pobrania wszystkich transakcji
    it('should get all transactions', async () => {
        const transaction = new Transaction({
            title: 'Transaction 1',
            body: 'First transaction',
            amount: 100,
            date: '2024-06-10'
        });
        await transaction.save();

        const response = await request(server)
            .get('/api/transactions')
            .expect(200);

        expect(response.body.length).toBe(1);
        expect(response.body[0].title).toBe('Transaction 1');
    });

    //Sprawdzenie pobrania transakcji po ID
    it('should get a transaction by id', async () => {
        const transaction = new Transaction({
            title: 'Transaction 1',
            body: 'First transaction',
            amount: 100,
            date: '2024-06-10'
        });
        await transaction.save();

        const response = await request(server)
            .get(`/api/transactions/${transaction._id}`)
            .expect(200);

        expect(response.body.title).toBe('Transaction 1');
    });

    //Test aktualizacji transakcji
    it('should update a transaction', async () => {
        const transaction = new Transaction({
            title: 'Transaction 1',
            body: 'First transaction',
            amount: 100,
            date: '2024-06-10'
        });
        await transaction.save();

        const response = await request(server)
            .put(`/api/transactions/${transaction._id}`)
            .send({
                title: 'Updated Transaction',
                body: 'Updated first transaction',
                amount: 150,
                date: '2024-06-12'
            })
            .expect(200);

        expect(response.body.title).toBe('Updated Transaction');
        expect(response.body.body).toBe('Updated first transaction');
        expect(response.body.amount).toBe(150);
    });

    //Test usuwania transakcji
    it('should delete a transaction', async () => {
        const transaction = new Transaction({
            title: 'Transaction 1',
            body: 'First transaction',
            amount: 100,
            date: '2024-06-10'
        });
        await transaction.save();

        await request(server)
            .delete(`/api/transactions/${transaction._id}`)
            .expect(204);

        const foundTransaction = await Transaction.findById(transaction._id);
        expect(foundTransaction).toBeNull();
    });
});

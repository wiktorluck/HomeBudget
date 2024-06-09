const mongoose = require('mongoose');
const path = require('path');

const configPath = path.resolve(__dirname, '../config/config.js');
console.log(`Loading config from: ${configPath}`);

const { database } = require(configPath);

// db connect
mongoose.connect(database)
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.log('Database connection error: ', err));

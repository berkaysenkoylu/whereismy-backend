export {};
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const handleErrors = require('./middleware/handleErrors');
const sequelize = require('./utils/database');

const userRoutes = require('./routes/user');

const app = express();

app.use((req: any, res: any, next: any) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// NORMAL ROUTES
app.use('/api/user', userRoutes);

app.use(handleErrors);

sequelize.sync().then((result: any) => {
    console.log('Connection has been established successfully.');
    // console.log(result)
    app.listen(process.env.PORT || 8000);
}).catch((error: any) => {
    console.error('Unable to connect to the database:', error);
});
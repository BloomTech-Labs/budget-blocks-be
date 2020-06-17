// Imports all the protective middleware to validate for routes
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

// SECTION User Routes
const plaidRouter = require('./plaid/plaidRouter');
const oktaRouter = require('./okta/okta-router');
const incomeRouter = require('./onboarding/income/incomeRouter');
const budgetRouter = require('./onboarding/budget/budgetRouter');

// Server initialization
const knex = require('./data/db-config');
const server = express();

server.use(express.json());
server.use(helmet());
server.use(cors());
server.use(morgan('dev'));

// SECTION ROUTER USE
server.use('/plaid', plaidRouter);
server.use('/api', oktaRouter);
server.use('/api', incomeRouter);
server.use('/api', budgetRouter);

server.use('/', (req, res) => {
  res.send({ message: 'API is up and running...' });
});

module.exports = server;

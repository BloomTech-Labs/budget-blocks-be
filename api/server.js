const express = require('express')
require('dotenv').config()

const cors = require('cors')
const app = express();
const AuthRouter = require('./Auth/AuthRouter.js')
const PlaidRouter = require('../plaid/PlaidRouter.js');



app.use(express.json())
app.use(cors())

app.use('/api', AuthRouter)
app.use('/plaid', PlaidRouter)

module.exports = app;


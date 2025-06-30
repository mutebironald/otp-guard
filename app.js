const express = require('express');

const api = require('./routes')

const app = express();
app.use(express.json())

app.use('/', api)

module.exports = app;

const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/apiRouter');

const app = express();
app.use(cors());

// Use the API router under the /api path prefix.
app.use('/api', apiRouter);

module.exports = app;

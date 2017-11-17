const express = require('express');
const balance = require('./routes/balance');
const contract = require('./routes/contract');
const transaction = require('./routes/transaction');

const bodyParser = require('body-parser');
const logger = require('morgan');

const cors = require('cors')

let app = express();

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));

app.use('/balance', balance);
app.use('/contract', contract);
app.use('/transaction', transaction);
app.listen(3000, 'localhost', () => console.log('Example app listening on port 3000!'));

// catch 404
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;

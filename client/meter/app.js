const express = require('express')
const balance = require('./routes/balance')

let app = express()

app.use('/balance', balance)
app.listen(3000, () => console.log('Example app listening on port 3000!'))

// catch 404
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// err handler
app.use((err, req, res, next) => {
  res.redirect('/');
})

module.exports = app

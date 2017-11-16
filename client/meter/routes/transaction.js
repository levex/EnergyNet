const express = require('express');
const router = express.Router();
const blockchain = require('../blockchain');

router.post('/buy', (req, res) => {
  const body = req.body;
  const contract = body.contract;
  const amount = body.amount;
  blockchain.buyEnergy(contract, amount)
    .then(() => res.status(200).end())
    .catch(() => res.status(400).end())
});

router.post('/sell', (req, res) => {
  const body = req.body;
  const price = body.price;
  const amount = body.amount;
  blockchain.sellEnergy(price, amount)
    .then(() => res.status(200).end())
    .catch(() => res.status(400).end())
});

router.post('/consume', (req, res) => {
  const body = req.body;
  const amount = body.amount;

  // TODO get contract address from DB and consume energy.
  // If there's not enough energy available, get another contract,
  // buy from there (if allowed) -> consume
});

module.exports = router;

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

  fetch('http://localhost:8086/write?db=energy', {
    method: 'POST',
    headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
	      },
    body: 'energy_sold amount=' + amount,
  })

  blockchain.sellEnergy(price, amount)
    .then(() => res.status(200).end())
    .catch(() => res.status(400).end())
});

router.post('/consume', (req, res) => {
  const body = req.body;
  const amount = body.amount;

  fetch('http://localhost:8086/write?db=energy', {
    method: 'POST',
    headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
	      },
    body: 'energy_consumed amount=' + amount,
  })

  blockchain.consumeEnergy(amount)
    .then(() => res.status(200).end())
    .catch(reason => res.status(500).send(reason))
});

module.exports = router;

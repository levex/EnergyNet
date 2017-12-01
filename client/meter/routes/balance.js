const oo7parity = require('oo7-parity');
const express = require('express');
const router = express.Router();
const blockchain = require('../blockchain');

router.get('/ether', (req, res) => {
  const balance = oo7parity.bonds.balance(oo7parity.bonds.me);
  balance.then((balance) => {
    const formattedBalance = oo7parity.formatBalance(balance);
    res.status(200).json({ balance: formattedBalance });
  });
});

router.get('/energy', (req, res) => {
  blockchain.myEnergyBalance()
    .then(balance => res.status(200).json({ balance }))
    .catch(() => res.status(500).end());
});

module.exports = router;

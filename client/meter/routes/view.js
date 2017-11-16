const express = require('express');
const router = express.Router();

const blockchain = require('../blockchain');

router.get('/available_contracts', (req, res) => {
  blockchain.availableContracts()
    .then(contracts => res.status(200).json(contracts))
    .catch(() => res.status(500).end())
});

router.get('/my_contracts', (req, res) => {
  blockchain.myContracts()
    .then(contracts => res.status(200).json(contracts))
    .catch(() => res.status(500).end())
});

router.get('/my_seller_contracts', (req, res) => {
  blockchain.mySellerContracts()
    .then(contracts => res.status(200).json(contracts))
    .catch(() => res.status(500).end())
});

router.get('/my_buyer_contracts', (req, res) => {
  blockchain.myBuyerContracts()
    .then(contracts => res.status(200).json(contracts))
    .catch(() => res.status(500).end())
});

module.exports = router;

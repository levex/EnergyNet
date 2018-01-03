const express = require("express");
const router = express.Router();
const blockchain = require("../blockchain");
const consume = require("../consume");
const sell = require("../sell");

router.post("/buy", (req, res) => {
  const body = req.body;
  const contract = body.contract;
  const amount = body.amount;

  blockchain.buyEnergy(contract, amount)
    .then(() => res.status(200).end())
    .catch(() => res.status(400).end());
});

router.post("/sell", (req, res) => {
  const body = req.body;
  const amount = body.amount;

  if (sell.sellEnergy(amount)) {
    res.status(200).end();
  } else {
    res.status(400).end();
  }
});

router.post("/consume", (req, res) => {
  const body = req.body;
  const amount = body.amount;

  if (consume.consumeEnergy(amount)) {
    res.status(200).end();
  } else {
    res.status(500).send();
  }
});

router.post("/updateBlockchain", (req, res) => {
  const body = req.body;
  const blockNumber = body.blockNumber;
  blockchain.updateBlockchain(blockNumber)
    .then(() => res.status(200).end())
    .catch(reason => res.status(500).send(reason));
});

module.exports = router;

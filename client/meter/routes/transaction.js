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

router.post("/setPrebuyLimit", (req, res) => {
  const body = req.body;
  const preBuyLimit = body.preBuyLimit;

  console.log(preBuyLimit);
  consume.setPreBuyLimit(preBuyLimit);
  res.status(200).end();
});

router.get("/prebuyLimit", (req, res) => {
  console.log(consume.getPreBuyLimit());
  res.status(200).json({preBuyLimit: consume.getPreBuyLimit()});
});

router.get("/renewables", (req, res) => {
  res.status(200).json({preferRenewables: consume.getRenewables()});
});

router.post("/setRenewables", (req, res) => {
  const body = req.body;
  const preferRenewables = body.preferRenewables;
  console.log(preferRenewables);
  consume.setRenewables(preferRenewables);
  res.status(200).end();
})

router.post("/updateBlockchain", (req, res) => {
  const body = req.body;
  const blockNumber = body.blockNumber;
  blockchain.updateBlockchain(blockNumber)
    .then(() => res.status(200).end())
    .catch(reason => res.status(500).send(reason));
});

module.exports = router;

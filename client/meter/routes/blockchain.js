const express = require("express");
const router = express.Router();
const blockchain = require("../blockchain");

router.post("/update", (req, res) => {
  const body = req.body;
  const blockNumber = body.blockNumber;
  blockchain.updateBlockchain(blockNumber)
    .then(() => res.status(200).end())
    .catch(reason => res.status(500).send(reason));
});

router.get("/log", (req, res) => {
  res.status(200).json(blockchain.getLog());
});

module.exports = router;

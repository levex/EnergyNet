const express = require("express");
const router = express.Router();
const sell = require("../sell");

router.post("/price", (req, res) => {
  const body = req.body;
  const price = body.price;

  if (price) {
    sell.setPrice(price);
    res.status(200).end();
    return;
  }

  res.status(400).end();
});

module.exports = router;
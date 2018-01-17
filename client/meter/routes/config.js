const express = require("express");
const router = express.Router();
const sell = require("../sell");
const recorder = require("../recorder.js");

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

router.post("/location", (req, res) => {
  const body = req.body;
  const location = body.location;

  if (location) {
    recorder.change_location(location);
    res.status(200).end();
    return;
  }

  res.status(400).end();
});

router.post("/renewable", (req, res) => {
  const body = req.body;
  const renewable = body.renewable;

  console.log("renewable: " + renewable);
  if (renewable !== undefined) {
    sell.setRenewable(renewable);
    res.status(200).end();
    return;
  }

  res.status(400).end();
});


module.exports = router;

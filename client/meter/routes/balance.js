const oo7parity = require('oo7-parity')
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  const balance = oo7parity.bonds.balance(oo7parity.bonds.me)
  res.status(200).json({ balance: balance })
})

module.exports = router

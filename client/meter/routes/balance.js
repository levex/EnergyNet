const oo7parity = require('oo7-parity')
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  const balance = oo7parity.bonds.balance(oo7parity.bonds.me)
  balance.then((balance) => {
    const formattedBalance = oo7parity.formatBalance(balance)
    res.status(200).json({ balance: formattedBalance })
  })
})

module.exports = router

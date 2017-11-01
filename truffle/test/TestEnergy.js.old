const Energy = artifacts.require('./Energy.sol');

contract('TestEnergy', function(accounts) {
    const seller = accounts[0]
    const buyer = accounts[1]

    it('getBalance should be 0 after contract is created', () => {
        return Energy.deployed().then(instance => {
          return instance.getBalance.call().then(balance => {
            assert.equal(balance.valueOf(), 0, 'balance is not 0')
          })
        })
    })

    it('getPrice should equal unit price', () => {
      return Energy.deployed().then(instance => {
        return instance.getPrice.call().then(price => {
          assert.equal(price.valueOf(), 2, 'getPrice doesn\'t equal unit price')
        })
      })
    })

    it('sell() - update current balance', () => {
      const amountToSell = 10
      let balance
      let energy
      return Energy.deployed().then(instance => {
        energy = instance
        return energy.sell(amountToSell, {from: seller})
      }).then(() => {
        return energy.getBalance.call()
      }).then(balance => {
        assert.equal(amountToSell, balance.valueOf(), 'balance not updated')
      })

    })

    it('consume() - let buyer buy energy', () => {
      const toConsume = 10
      const newEnergyBalance = 0
      const value = toConsume * 2
      let sellerBalanceBefore
      let energy
      return Energy.deployed().then(instance => {
        energy = instance
        return energy.consume(toConsume, {from: buyer, value: value})
      }).then((result) => {
        sellerBalanceBefore = web3.eth.getBalance(seller).toNumber()
        return energy.getBalance.call()
      }).then(balance => {
        assert.equal(balance.valueOf(), newEnergyBalance, 'incorrect amount was consumed')
        const sellerBalance = web3.eth.getBalance(seller).toNumber()
        assert.equal(sellerBalance - 20, sellerBalanceBefore, 'seller has not been payed');
      })
    })
})

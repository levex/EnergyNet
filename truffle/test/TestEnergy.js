const Energy = artifacts.require('./Energy.sol');

contract('TestEnergy', function(accounts) {
    const seller = accounts[0]
    const buyer = 0x42

    it('getBalance should be 0 after contract is created', () => {
        Energy.deployed().then(instance => {
            instance.getBalance.call().then(balance => {
              assert.equal(balance, 0, 'balance is not 0')
            })
        })
    })

    it('getPrice should equal unit price', () => {
      Energy.deployed().then(instance => {
        instance.getPrice.call().then(price => {
          assert.equal(price, 2, 'getPrice doesn\'t equal unit price')
        })
      })
    })

    it('sell() should update current balance', () => {
      const newBalance = 10
      let energy
      Energy.deployed().then(instance => {
        energy = instance
        return energy.sell.call(newBalance, {from: seller})
      }).then(() => {
        return energy.getBalance.call()
      }).then(balance => {
        assert.equal(balance, newBalance, 'balance not updated')
      })
    })
})

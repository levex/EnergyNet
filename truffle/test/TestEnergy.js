const Energy = artifacts.require('./Energy.sol');

contract('TestEnergy', function(accounts) {
    const seller = accounts[0]
    const buyer = 0x42

    it('getBalance should be 0 after contract is created', function() {
        Energy.deployed().then(instance => {
            energy.getBalance.call({from: buyer}).then(function(balance) {
              assert.equal(energy.getBalance(), 'balance is not 0')
            })
        })
    })
})

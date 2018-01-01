const Master = artifacts.require('./Master.sol');
const Energy = artifacts.require('./Energy.sol');

contract('Master', accounts => {
  it("starts with no contracts", () => {
    return Master.deployed().then(instance => {
      return instance.contractCount.call();
    }).then(count => {
      assert.equal(count.valueOf(), 0, "Master is not initialised with no contracts");
    })
  });

  it("can sell energy at specified price and amount", () => {
    const initAmount = 42;
    const initPrice = 4200;
    let actualPrice;
    let actualAmount;
    let energyContract;

    /* FIXME: This does not work */
    return Master.deployed().then(instance => {
      return instance.sell.call(initPrice, initAmount);
    }).then(energyContractAddress => {
      energyContract = Energy.at(energyContractAddress);
      return energyContract.unitPrice.call();
    }).then(unitPrice => {
      actualPrice = unitPrice.toNumber();
      return energyContract.offeredAmount.call();
    }).then(offeredAmount => {
      actualAmount = offeredAmount.toNumber();

      assert.equal(actualAmount, initAmount, "Amount is different from init value.");
      assert.equal(actualPrice, initPrice, "Price is different from init value.");
    })
  });
})

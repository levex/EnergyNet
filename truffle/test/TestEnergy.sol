pragma solidity ^0.4.10;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Master.sol";
import "../contracts/Energy.sol";

contract TestEnergy {

  uint public initialBalance = 1 ether;

  uint price;
  uint amount;
  uint date;
  bool renewable;
  address seller;
  Energy energy;

  function beforeAll() {
    price = 2 wei;
    amount = 10;
    date = now;
    renewable = true;
    seller = DeployedAddresses.Master();
    energy = new Energy(seller, price, amount, date, renewable);
  }

  function testCanCreateContract() public {
    uint actual_price = energy.unitPrice();
    uint actual_amount = energy.offeredAmount();
    uint actual_date = energy.dateCreated();
    bool isRenewable = energy.renewable();
    address actual_seller = energy.seller();

    Assert.equal(price, actual_price, "Price is incorrect");
    Assert.equal(amount, actual_amount, "Amount is incorrect");
    Assert.equal(date, actual_date, "Date is incorrect");
    Assert.equal(renewable, isRenewable, "Renewability is incorrect");
    Assert.equal(seller, actual_seller, "Incorrect seller");
  }

  function testBuy() public {
    uint amountToBuy = 5;
    energy.buy(amountToBuy);

    uint bought = energy.remainingEnergy(this);
    Assert.equal(amountToBuy, bought, "Buy error!");
  }

  //function testConsume() public {
    //uint amountToConsume = 3;
    //uint amountBefore = energy.remainingEnergy(this);

    //energy.consume.value(amountToConsume * price)(amountToConsume);
    //uint amountAfter = energy.remainingEnergy(this);
    //Assert.equal(amountAfter, amountBefore - amountToConsume, "Consume error!");
  //}
}


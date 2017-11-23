pragma solidity ^0.4.10;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Master.sol";
import "../contracts/Energy.sol";

contract TestMaster {

    function testSellCanDeployContract() {
        Master master = Master(DeployedAddresses.Master());
        uint price = 100;
        uint offeredAmount = 10;
        Energy energy = Energy(master.sell(price, offeredAmount));
        uint actual_price = energy.unitPrice();
        uint actual_offeredAmount = energy.offeredAmount();
        address actual_seller = energy.seller();
        Assert.equal(price, actual_price, "Price should be set");
        Assert.equal(offeredAmount, actual_offeredAmount, "offeredAmount should be set");
        Assert.equal(this, actual_seller, "Seller should be caller");
    }
}

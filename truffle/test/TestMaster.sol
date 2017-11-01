pragma solidity ^0.4.10;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Master.sol";
import "../contracts/Energy.sol";

contract TestMaster {

    function testSellCanDeployContract() {
        Master master = Master(DeployedAddresses.Master());
        uint price = 100;
        uint capacity = 10;
        Energy energy = Energy(master.sell(price, capacity));
        uint actual_price = energy.unitPrice();
        uint actual_capacity = energy.capacity();
        address actual_seller = energy.seller();
        address actual_master_addr = energy.master_addr();
        Assert.equal(price, actual_price, "Price should be set");
        Assert.equal(capacity, actual_capacity, "Capacity should be set");
        Assert.equal(this, actual_seller, "Seller should be caller");
        Assert.equal(master, actual_master_addr, "Master address should be set");
    }
}

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
        uint date = now;
        bool renewable = true;
        Energy energy = Energy(master.sell(price, offeredAmount, renewable));
        uint actual_price = energy.unitPrice();
        uint actual_offeredAmount = energy.offeredAmount();
        uint actual_date = energy.dateCreated();
        bool actual_renewable = energy.renewable();
        address actual_seller = energy.seller();
        address actual_master_addr = energy.master_addr();
        Assert.equal(price, actual_price, "Price should be set");
        Assert.equal(offeredAmount, actual_offeredAmount, "offeredAmount should be set");
        Assert.equal(this, actual_seller, "Seller should be caller");
        Assert.equal(master, actual_master_addr, "Master address should be set");
        Assert.equal(date, actual_date, "Date is wrong");
        Assert.equal(renewable, actual_renewable, "Wrong renewability setting");
    }
}

pragma solidity ^0.4.10;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/EnergyMaster.sol";

contract TestEnergyMaster {
    function testCanRegisterOneBuyerOneContract() {
        EnergyMaster master = EnergyMaster(DeployedAddresses.EnergyMaster());
        address fake_account = 0x42;
        address fake_contract = 0x420;
        master.registerBuyer(fake_contract, fake_account);
        uint actual_count = master.getBuyerContractCount(fake_account);
        Assert.equal(actual_count, 2, "Buyer contract count should be 2");
        address actual_contract = master.getBuyerContractByIndex(fake_account, 1);
        Assert.equal(actual_contract, fake_contract, "Contract should be stored in index 1");
    }

    function testCanRegisterSameBuyerAnotherContract() {
        EnergyMaster master = EnergyMaster(DeployedAddresses.EnergyMaster());
        address fake_account = 0x42;
        address fake_contract0 = 0x420;  // registered in first test
        address fake_contract1 = 0x421;
        master.registerBuyer(fake_contract1, fake_account);
        uint actual_count = master.getBuyerContractCount(fake_account);
        Assert.equal(actual_count, 3, "Buyer contract count should be 3");
        address actual_contract0 = master.getBuyerContractByIndex(fake_account, 1);
        Assert.equal(actual_contract0, fake_contract0, "Contract should be stored in index 1");
        address actual_contract1 = master.getBuyerContractByIndex(fake_account, 2);
        Assert.equal(actual_contract1, fake_contract1, "Contract should be stored in index 2");
    }

    function testCanRegisterOneSellerOneContract() {
        EnergyMaster master = EnergyMaster(DeployedAddresses.EnergyMaster());
        address fake_account = 0x42;
        address fake_contract = 0x420;
        master.registerSeller(fake_contract, fake_account);
        uint actual_count = master.getSellerContractCount(fake_account);
        Assert.equal(actual_count, 1, "Seller contract count should be 1");
        address actual_contract = master.getSellerContractByIndex(fake_account, 0);
        Assert.equal(actual_contract, fake_contract, "Contract should be stored in index 0");
    }

    function testCanRegisterSameSellerAnotherContract() {
        EnergyMaster master = EnergyMaster(DeployedAddresses.EnergyMaster());
        address fake_account = 0x42;
        address fake_contract0 = 0x420;  // registered in first test
        address fake_contract1 = 0x421;
        master.registerSeller(fake_contract1, fake_account);
        uint actual_count = master.getSellerContractCount(fake_account);
        Assert.equal(actual_count, 2, "Seller contract count should be 2");
        address actual_contract0 = master.getSellerContractByIndex(fake_account, 0);
        Assert.equal(actual_contract0, fake_contract0, "Contract should be stored in index 1");
        address actual_contract1 = master.getSellerContractByIndex(fake_account, 1);
        Assert.equal(actual_contract1, fake_contract1, "Contract should be stored in index 2");
    }
}

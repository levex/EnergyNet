pragma solidity ^0.4.10;

contract EnergyMaster {
    mapping(address => address[]) sellers;

    function registerSeller(address energyContract, address seller) public {
        sellers[seller].push(energyContract);
    }

    function getSellerContractCount(address seller) constant returns (uint) {
        return sellers[seller].length;
    }

    function getSellerContractByIndex(address seller, uint index) constant returns (address) {
        require(index < sellers[seller].length);
        return sellers[seller][index];
    }
}

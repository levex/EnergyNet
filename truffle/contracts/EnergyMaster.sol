pragma solidity ^0.4.10;

contract EnergyMaster {
    mapping(address => address[]) buyers;
    mapping(address => address[]) sellers;

    function registerBuyer(address energyContract, address buyer) public {
        buyers[buyer].push(energyContract);
    }

    function registerSeller(address energyContract, address seller) public {
        sellers[seller].push(energyContract);
    }

    function getBuyerContractCount(address buyer) constant returns (uint) {
        return buyers[buyer].length;
    }

    function getBuyerContractByIndex(address buyer, uint index) constant returns (address) {
        require(index < buyers[buyer].length);
        return buyers[buyer][index];
    }

    function getSellerContractCount(address seller) constant returns (uint) {
        return sellers[seller].length;
    }

    function getSellerContractByIndex(address seller, uint index) constant returns (address) {
        require(index < sellers[seller].length);
        return sellers[seller][index];
    }
}

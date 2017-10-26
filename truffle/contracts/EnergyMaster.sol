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

    function getBuyerContracts(address buyer) constant returns (address[]) {
        return buyers[buyer];
    }

    function getSellerContracts(address seller) constant returns (address[]) {
        return sellers[seller];
    }
}

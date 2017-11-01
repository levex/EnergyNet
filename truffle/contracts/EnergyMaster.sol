pragma solidity ^0.4.10;

import "./Energy.sol";

contract Master {
    struct ContractEntity {
        address contract_addr;
        address seller;
        bool deleted;
    }

    ContractEntity[] public contracts;
    mapping (address => uint) lookup;

    function Master() public {
    }

    function sell(uint unitPrice, uint capacity) public returns(address) {
        Energy energy = new Energy(msg.sender, unitPrice, capacity);
        ContractEntity memory entity;
        entity.contract_addr = energy;
        entity.seller = msg.sender;
        lookup[energy] = contracts.length;
        contracts.push(entity);
        return energy;
    }

    function deregister(address contract_addr) public {
        require(msg.sender == contract_addr);
        contracts[lookup[contract_addr]].deleted = true;
    }

}

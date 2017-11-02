pragma solidity ^0.4.10;

import "./Energy.sol";

contract Master {
    struct ContractEntity {
        address contract_addr;
        address seller;
        bool deregistered;
    }

    ContractEntity[] public contracts;
    // lookup index of contract in the list
    mapping (address => uint) lookupIdxByContract;

    function Master() public {
    }

    // Sender is the seller, return deployed energy contract
    function sell(uint unitPrice, uint amountOffered) public returns(address) {
        // TODO: delegate call
        Energy energy = new Energy(msg.sender, unitPrice, amountOffered);
        ContractEntity memory entity;
        entity.contract_addr = energy;
        entity.seller = msg.sender;
        lookupIdxByContract[energy] = contracts.length;
        contracts.push(entity);
        return energy;
    }

    // Called by energy contract for deregister
    function deregister(address contract_addr) public {
        require(msg.sender == contract_addr);
        contracts[lookupIdxByContract[contract_addr]].deregistered = true;
    }

    function contractCount() view public returns(uint) {
        return contracts.length;
    }

}

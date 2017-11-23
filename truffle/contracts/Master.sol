pragma solidity ^0.4.10;

import "./Energy.sol";

contract Master {

    address[] public contracts;
    event Update(uint index);

    function Master() public {
    }

    // Sender is the seller, return deployed energy contract
    function sell(uint unitPrice, uint amountOffered) public returns(address) {
        // TODO: delegate call
        require(amountOffered > 0);
        Energy energy = new Energy(msg.sender, unitPrice, amountOffered);
        contracts.push(energy);
        Update(contracts.length - 1);
        return energy;
    }

    function contractCount() view public returns(uint) {
        return contracts.length;
    }

}

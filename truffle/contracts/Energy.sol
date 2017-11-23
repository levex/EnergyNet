pragma solidity ^0.4.10;

import './Master.sol';

contract Energy {
    uint public unitPrice;
    uint public offeredAmount;
    mapping (address => uint) public remainingEnergy;
    uint public boughtAmount;  // sum of remainingEnergy;
    address public seller;
    bool public noUpdate;

    event update(uint blockNumber);

    function Energy(address seller_, uint unitPrice_, uint offeredAmount_) public {
        unitPrice = unitPrice_;
        offeredAmount = offeredAmount_;
        seller = seller_;
        boughtAmount = 0;
        noUpdate = false;
    }

    function buy(uint amount) public {
        require(amount <= offeredAmount);
        offeredAmount -= amount;
        remainingEnergy[msg.sender] += amount;
        boughtAmount += amount;
        update(block.number);
        // there will always be an update when the buyer consumes energy
    }

    function consume(uint amount) public payable {
        require(remainingEnergy[msg.sender] >= amount);
        require(msg.value >= unitPrice * amount);
        seller.transfer(msg.value);
        remainingEnergy[msg.sender] -= amount;
        boughtAmount -= amount;
        if (boughtAmount == 0 && offeredAmount == 0) {
            noUpdate = true;
        }
        update(block.number);
    }

}

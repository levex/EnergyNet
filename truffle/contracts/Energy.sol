pragma solidity ^0.4.10;

import './Master.sol';

contract Energy {
    uint public unitPrice;
    uint public offeredAmount;
    mapping (address => uint) public remainingEnergy;
    address public seller;
    bool public noUpdate;

    event finalUpdate(uint blockNumber);
    event update(uint blockNumber);

    function Energy(address seller_, uint unitPrice_, uint offeredAmount_) public {
        unitPrice = unitPrice_;
        offeredAmount = offeredAmount_;
        seller = seller_;
        noUpdate = false;
    }

    function buy(uint amount) public {
        require(amount <= offeredAmount);
        offeredAmount -= amount;
        remainingEnergy[msg.sender] += amount;
        if (offeredAmount == 0) {
            noUpdate = true;
            finalUpdate(block.number);
        } else {
            update(block.number);
        }
    }

    function consume(uint amount) public payable {
        require(remainingEnergy[msg.sender] >= amount);
        require(msg.value >= unitPrice * amount);
        seller.transfer(msg.value);
        remainingEnergy[msg.sender] -= amount;
    }

}

pragma solidity ^0.4.10;

import './Master.sol';

contract Energy {
    uint public unitPrice;
    uint public offeredAmount;
    mapping (address => uint) public balancePerBuyer;
    // the sum of remainingEnergy, a.k.a. sold, unconsumed energy
    uint public soldAmount;
    address public seller;
    bool public empty;

    event Update(uint blockNumber);

    function Energy(address seller_, uint unitPrice_, uint offeredAmount_) public {
        unitPrice = unitPrice_;
        offeredAmount = offeredAmount_;
        seller = seller_;
        soldAmount = 0;
        empty = false;
    }

    function buy(uint amount) public {
        require(amount <= offeredAmount);
        offeredAmount -= amount;
        balancePerBuyer[msg.sender] += amount;
        soldAmount += amount;
        Update(block.number);
        // there will always be an update when the buyer consumes energy
    }

    function consume(uint amount) public payable {
        require(balancePerBuyer[msg.sender] >= amount);
        require(msg.value >= unitPrice * amount);
        seller.transfer(msg.value);
        balancePerBuyer[msg.sender] -= amount;
        soldAmount -= amount;
        if (soldAmount == 0 && offeredAmount == 0) {
            empty = true;
        }

        Update(block.number);
    }

}

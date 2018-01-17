pragma solidity ^0.4.10;

import './Master.sol';

contract Energy {
    uint public unitPrice;
    uint public offeredAmount;
    uint public dateCreated;
    bool public renewable;
    mapping (address => uint) public remainingEnergy;
    address public seller;
    address public master_addr;

    function Energy(address seller_, uint unitPrice_,
                    uint offeredAmount_, uint dateCreated_, bool renewable_) public {
        unitPrice = unitPrice_;
        offeredAmount = offeredAmount_;
        seller = seller_;
        dateCreated = dateCreated_;
        renewable = renewable_;
        // Sender is master contract, this is called in sell function
        master_addr = msg.sender;
    }

    function buy(uint amount) public {
        require(amount <= offeredAmount);
        offeredAmount -= amount;
        remainingEnergy[msg.sender] += amount;
        if (offeredAmount == 0) {
            Master master = Master(master_addr);
            master.deregister(this);
        }
    }

    function consume(uint amount) public payable {
        require(remainingEnergy[msg.sender] >= amount);
        require(msg.value >= unitPrice * amount);
        seller.transfer(msg.value);
        remainingEnergy[msg.sender] -= amount;
    }

}

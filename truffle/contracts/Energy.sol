pragma solidity ^0.4.10;

import './EnergyMaster.sol';

contract Energy {
    uint public unitPrice;
    uint public capacity;
    mapping (address => uint) public balance;
    address public seller;
    address public master_addr;

    function Energy(address seller_, uint unitPrice_, uint capacity_) public {
        unitPrice = unitPrice_;
        capacity = capacity_;
        seller = seller_;
        master_addr = msg.sender;
    }

    function buy(uint amount) public {
        require(amount <= capacity);
        capacity -= amount;
        balance[msg.sender] += amount;
        if (capacity == 0) {
            Master master = Master(master_addr);
            master.deregister(this);
        }
    }

    function consume(uint amount) public payable {
        require(balance[msg.sender] >= amount);
        require(msg.value >= unitPrice * amount);
        seller.transfer(msg.value);
    }

}

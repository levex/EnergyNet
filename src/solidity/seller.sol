pragma solidity ^0.4.11;

contract seller {

  address owner;
  uint energy;
  uint price;

  function seller(uint price_) public {
    owner = msg.sender;
    price = price_;
  }

  function buy(uint energy_) public payable returns(uint) {
    if (price * energy_ < msg.value) {
      // TODO: Refund
      return 0;
    } else {
      energy += energy_;
      return energy_;
    }
  }

  function die() public {
    if (msg.sender == owner) {
      selfdestruct(owner);
    }
  }
}

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
    if (price * energy_ != msg.value) {
      // TODO: Refund
      return 0;
    } else {
      energy += energy_;
      return energy_;
    }
  }

  function energy_available() public view returns(uint) {
    return energy;
  }

  function consume(uint energy_) public returns(uint) {
    if (energy_ > energy) {
      return 0;
    } else {
      energy -= energy_;
      return energy_;
    }
  }

  function get_price() public view returns(uint) {
    return price;
  }

  function die() public {
    if (msg.sender == owner) {
      selfdestruct(owner);
    }
  }
}

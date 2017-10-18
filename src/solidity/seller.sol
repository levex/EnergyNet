pragma solidity ^0.4.11;

contract seller {

  address owner;
  int energy;

  function seller() public {
    owner = msg.sender;
  }

  function buy(int amount) returns (int x) {
    if (msg.value > 1 ether) {
      owner.transfer(1 ether);
      return 1;
    }

    return -1;
  }

  function die() public {
    if (msg.sender == owner) {
      selfdestruct(owner);
    }
  }
}

pragma solidity ^0.4.11;

contract EnergyContract {

  address seller;
  uint buyable;
  uint bought;
  uint consumed;
  uint price;

  function EnergyContract(uint price_, uint buyable_) public {
    seller = msg.sender;
    price = price_;
    buyable = buyable_;
    bought = 0;
    consumed = 0;
  }

  function buy(uint energy_to_buy) public payable returns(uint) {
    if (price * energy_to_buy != msg.value || buyable < energy_to_buy) {
      // TODO: Refund
      return 0;
    } else {
      buyable -= energy_to_buy;
      bought += energy_to_buy;
      return energy_to_buy;
    }
  }

  function energy_available() public view returns(uint) {
    return buyable;
  }

  function consume(uint energy_consumed) public returns(uint) {
    if (energy_consumed > bought) {
      return 0;
    } else {
      consumed += energy_consumed;
      return energy_consumed;
    }
  }

  function get_price() public view returns(uint) {
    return price;
  }

  function get_buyable() public view returns(uint) {
    return buyable;
  }

  function get_bought() public view returns(uint) {
    return bought;
  }

  function get_consumed() public view returns(uint) {
    return consumed;
  }

  function die() public {
    if (msg.sender == seller) {
      selfdestruct(seller);
    }
  }
}

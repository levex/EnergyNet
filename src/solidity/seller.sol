pragma solidity ^0.4.11;

contract EnergyContract {

  address seller;  // creator of contract
  uint buyable;    // amount of energy provided
  uint bought;     // amount of energy bought by user
  uint consumed;   // amount of energy bought and consumed by user
  uint price;      // unit price for energy

  /// @notice Create a contract with given price and amount buyable, the
  /// deployer of the contract will be the seller.
  /// @param price_ unit price of energy
  /// @param buyable_ amount of energy buyable
  function EnergyContract(uint price_, uint buyable_) public {
    seller = msg.sender;
    price = price_;
    buyable = buyable_;
    bought = 0;
    consumed = 0;
  }

  /// @notice Buy energy from the seller. Must be invoked with exact amount
  /// of ether needed (i.e. unit price * amount)
  /// @param energy_to_buy amount of energy to buy, must not be greater
  /// than amount of energy buyable
  /// @return amount of energy bought if success or 0 if failure
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

  /// @notice Consume energy that has been bought earlier
  /// @param energy_consumed amount of energy consumed, must not be greater
  /// than amount of energy bought
  /// @return amount of energy consumed if success or 0 if failure
  function consume(uint energy_consumed) public returns(uint) {
    if (energy_consumed > bought) {
      return 0;
    } else {
      consumed += energy_consumed;
      return energy_consumed;
    }
  }

  /// @notice Query the price of energy
  /// @return price of energy
  function get_price() public view returns(uint) {
    return price;
  }

  /// @notice Query the amount of energy buyable
  /// @return amount of energy buyable
  function get_buyable() public view returns(uint) {
    return buyable;
  }

  /// @notice Query the amount of energy bought
  /// @return amount of energy bought
  function get_bought() public view returns(uint) {
    return bought;
  }

  /// @notice Query the amount of energy consumed
  /// @return amount of energy consumed
  function get_consumed() public view returns(uint) {
    return consumed;
  }

  /// @notice End the contract and return all money to seller
  function die() public {
    if (msg.sender == seller) {
      selfdestruct(seller);
    }
  }
}

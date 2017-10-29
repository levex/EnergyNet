pragma solidity ^0.4.10;

import "./EnergyMaster.sol";

contract Energy {
    address seller;
    uint energyBalance;
    uint unitPrice;

    /// @notice Construct a contract between a seller and a buyer with a price
    /// set by the seller (deployer of contract)
    /// @param unitPrice_ Price per unit energy
    function Energy(address energyMaster_, uint unitPrice_) public {
        EnergyMaster energyMaster = EnergyMaster(energyMaster_);
        seller = msg.sender;
        energyBalance = 0;
        unitPrice = unitPrice_;
        energyMaster.registerSeller(this, seller);
    }

    /// @notice Sell given amount of energy to buyer, can only be called by
    /// seller
    /// @param amountOffered amount of energy offered to sell by seller,
    /// consumable by buyer
    function sell(uint amountOffered) public {
        require(msg.sender == seller);
        energyBalance += amountOffered;
    }

    /// @notice Consume given amount of energy previous purchased from seller,
    /// send the price paid to seller
    /// @param amountConsumed amount of energy consumed by buyer, purchased
    /// from seller
    function consume(uint amountConsumed) public payable {
        require(msg.value >= unitPrice * amountConsumed);
        require(amountConsumed <= energyBalance);
        energyBalance -= amountConsumed;
        seller.transfer(unitPrice * amountConsumed);
    }

    /// @notice Get price of unit energy
    /// @return Price of unit energy
    function getPrice() public constant returns(uint) {
        return unitPrice;
    }

    /// @notice Get amount of energy purchased but not consumed yet, i.e.
    /// amount of consumable energy
    /// @return amount of energy purchased by buyer but not consumed yet
    function getBalance() public constant returns(uint) {
        return energyBalance;
    }
}

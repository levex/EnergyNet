import React from "react";
import BuyEnergyPanel from "./BuyEnergyPanel";

const SettingsBuy = (props) => {
  const contracts = props.contracts;
  const bonds = props.bonds;

  return (
    <div className="col-lg-12">
      <BuyEnergyPanel contracts={contracts.contracts} buyEnergy={bonds.buyEnergy} amountBond={bonds.buyAmountBond} />
    </div>
  );
};

export default SettingsBuy;
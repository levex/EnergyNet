import BuyEnergyPanel from "./BuyEnergyPanel";

const SettingsBuy = (props) => {
  const contracts = props.contracts;
  const bonds = props.bonds;

  return (
    <div className="col-lg-12">
      <SellEnergyPanel sellTx={contracts.sellTx} amountBond={bonds.sellAmountBond} priceBond={bonds.priceBond}
        offerEnergy={bonds.offerEnergy}/>
    </div>
  );
};

export default SettingsBuy;
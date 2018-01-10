import React from "react";
import BuyEnergyPanel from "./BuyEnergyPanel";

const SettingsBuy = (props) => {
  const contracts = props.contracts;
  const bonds = props.bonds;

  return (
    <div className="col-lg-12">
      <div className="col-lg-5">
        <div className="panel panel-default">
          <div className="panel-heading">
              Auto-buy settings
          </div>
          <div className="panel-body">

            <div className="row" style={{margin: "0px 0px 15px 0px"}}>
              <label for="basic-url">Maximum unit price</label>
              <div className="input-group">
                <input type="text" class="form-control" id="basic-url" aria-describedby="addon1"/>
                <span class="input-group-addon" id="addon1">$/kWh</span>
              </div>
            </div>

            <div className="row" style={{margin: "0px 0px 15px 0px"}}>
              <label for="basic-url">Prebuy limit</label>
              <div className="input-group">
                <input type="text" class="form-control" id="basic-url" aria-describedby="addon2"/>
                <span class="input-group-addon" id="addon2">kWh</span>
              </div>
            </div>

            <div className="row" style={{margin: "0px 0px 15px 0px"}}>
              <div class="checkbox">
                <label><input type="checkbox" value=""/>Prefer renewables?</label>
              </div>
            </div>

            <div className="row" style={{margin: "0px 0px 15px 0px"}}>
              <button type="button" class="btn btn-primary">Update configuration</button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-7">
        <BuyEnergyPanel contracts={contracts.contracts} buyEnergy={bonds.buyEnergy} amountBond={bonds.buyAmountBond} />
      </div>
    </div>
  );
};

export default SettingsBuy;

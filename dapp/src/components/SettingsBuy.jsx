import React from "react";
import BuyEnergyPanel from "./BuyEnergyPanel";

const METER_BACKEND = "http://localhost:3000";

class SettingsBuy extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      contracts: props.contracts,
      bonds: props.bonds,
      preferRenewables: props.preferRenewables,
      preBuyLimit: props.preBuyLimit,
    };
  }

  componentDidMount() {
    this.getPreBuyLimit();
    this.getRenewablePreference();
  }

  getPreBuyLimit() {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    fetch(METER_BACKEND + "/transaction/prebuyLimit", {
      method: "GET",
      headers: headers
    }).then((data) => data.json())
      .then((data) => {
        console.log(data);
        this.setState({preBuyLimit: data.preBuyLimit});
      });
  }


  getRenewablePreference() {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    fetch(METER_BACKEND + "/transaction/renewables", {
      method: "GET",
      headers: headers
    }).then((data) => data.json())
      .then((data) => {
        console.log(data);
        this.setState({preferRenewables : data.preferRenewables});
      });
  }

  setPreBuyLimit() {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    fetch(METER_BACKEND + "/transaction/setPrebuyLimit", {
      method: "POST",
      body: JSON.stringify({preBuyLimit: this.state.preBuyLimit}),
      headers: headers
    }).catch(console.log);
  }

  setRenewablePreference() {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    fetch(METER_BACKEND + "/transaction/setRenewables", {
      method: "POST",
      body: JSON.stringify({preferRenewables: this.state.preferRenewables}),
      headers: headers
    }).catch(console.log);
  }

  render() {
    console.log(this.state.preBuyLimit);
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
                  <input type="text" class="form-control" id="basic-url" aria-describedby="addon2" value={this.state.preBuyLimit}
                        onChange={(e) => this.setState({preBuyLimit: e.target.value})} />
                  <span class="input-group-addon" id="addon2">kWh</span>
                </div>
              </div>

              <div className="row" style={{margin: "0px 0px 15px 0px"}}>
                <div class="checkbox">
                  <label><input type="checkbox" value="" checked={this.state.preferRenewables}
                                onChange={() => {this.setState({preferRenewables: !this.state.preferRenewables})}}/>
                    Prefer renewables?
                  </label>
                </div>
              </div>

              <div className="row" style={{margin: "0px 0px 15px 0px"}}>
                <button type="button" class="btn btn-primary" onClick={() => {
                  this.setPreBuyLimit();
                  this.setRenewablePreference();
                }}>
                  Update configuration
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-7">
          <BuyEnergyPanel contracts={this.state.contracts.contracts} buyEnergy={this.state.bonds.buyEnergy}
                          amountBond={this.state.bonds.buyAmountBond}/>
        </div>
      </div>
    );
  }
};

export default SettingsBuy;

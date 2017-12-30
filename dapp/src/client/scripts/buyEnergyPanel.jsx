import React from "react";
import {BButton, InputBond, TransactionProgressLabel} from "parity-reactive-ui";
import {AvailableContractsTable} from "./availableContractsTable";

export class BuyEnergyPanel extends React.Component {
  render() {
    return (<div className="panel panel-default">
      <div className="panel-heading">
        <i className="fa fa-bar-chart-o fa-fw"></i>
        Buy energy
      </div>

      <div className="panel-body">
        <AvailableContractsTable contracts={this.props.contracts} amountBond={this.props.amountBond} buyEnergy={this.props.buyEnergy}/>
      </div>
    </div>);
  }
}

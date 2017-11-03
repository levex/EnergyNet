import React from 'react';
import {bonds} from 'oo7-parity';
import {BButton, InputBond, TransactionProgressLabel} from 'parity-reactive-ui'
import {makeMasterContract, makeContract} from "./blockchain";
import update from 'immutability-helper'

export class BuyEnergyPanel extends React.Component {

  constructor(props) {
    super(props);
    this.master = makeMasterContract();
  }

  render() {
    var tableBody = Object.keys(this.props.contracts).map(contractAddr => {
      var contractState = this.props.contracts[contractAddr];

      return (
        <tr key={contractAddr}>
          <td>Some date</td>
          <td>{contractState.offeredAmount.toString(10)}
            kWh/day</td>
          <td>£{contractState.unitPrice.toString(10)}/kWh</td>
          <td>
            <form role="form">
              <InputBond placeholder="kWh/day" bond={this.props.amountBond} style={{width: "100%"}} action>
                <input />
                {contractState.tx == null
                  ? <BButton className="btn btn-primary" content="Buy Energy" onClick={() => this.props.buyEnergy(contractState)}/>
                  : <TransactionProgressLabel value={contractState.tx}/>
                }
              </InputBond>
            </form>
          </td>
        </tr>
      );
    });

    return (<div className="panel panel-default">
      <div className="panel-heading">
        <i className="fa fa-bar-chart-o fa-fw"></i>
        Buy energy
      </div>

      <div className="panel-body">
        <table width="100%" className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Date offered</th>
              <th>Amount available</th>
              <th>Price</th>
              <th>Buy</th>
            </tr>
          </thead>
          <tbody>
            {tableBody}
          </tbody>
        </table>
      </div>
      {/* /.panel-body */}
    </div>)
  }
}

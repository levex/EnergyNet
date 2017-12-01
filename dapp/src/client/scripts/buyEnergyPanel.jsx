import React from 'react';
import {BButton, InputBond, TransactionProgressLabel} from 'parity-reactive-ui'
import {AvailableContractsTable} from './availableContractsTable'

export class BuyEnergyPanel extends React.Component {
  render() {
    var tableBody = Object.keys(this.props.contracts).map(address => {
      const contract = this.props.contracts[address];
      return (
        <tr key={contract.address}>
          <td>Some date</td>
          <td>{contract.offeredAmount}
            kWh/day</td>
          <td>£{contract.unitPrice}/kWh</td>
          <td>
            <form role="form">
              <InputBond placeholder="kWh/day" bond={this.props.amountBond} style={{width: "100%"}} action>
                <input />
                {contract.tx === null
                  ? <BButton className="btn btn-primary" content="Buy Energy" onClick={() => this.props.buyEnergy(address)}/>
                  : <TransactionProgressLabel value={contract.tx}/>
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
        <AvailableContractsTable contracts={this.props.contracts} amountBond={this.props.amountBond} buyEnergy={this.props.buyEnergy}/>
      </div>
      {/* /.panel-body */}
    </div>)
  }
}

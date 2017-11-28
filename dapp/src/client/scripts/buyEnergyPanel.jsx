import React from 'react';
import {BButton, InputBond, TransactionProgressLabel} from 'parity-reactive-ui'

export class BuyEnergyPanel extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    var tableBody = this.props.contracts.map(contract => {
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
                  ? <BButton className="btn btn-primary" content="Buy Energy" onClick={() => this.props.buyEnergy(contract)}/>
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

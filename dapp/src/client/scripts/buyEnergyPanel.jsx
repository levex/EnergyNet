import React from 'react';
import {bonds} from 'oo7-parity';
import {makeMasterContract, makeContract} from "./blockchain";

export class BuyEnergyPanel extends React.Component {

  async getSellerContracts() {
    let count = await this.master.contractCount();

    for (let i = 0; i < count; i++) {
      const contractEntity = await this.master.contracts(i);
      const deregistered = contractEntity[2];
      const contractAddr = contractEntity[0];

      if (!deregistered) {
        const contract = makeContract(contractAddr);
        const offeredAmount = await contract.offeredAmount();
        const unitPrice = await contract.unitPrice();

        this.setState((prev) => {
          return {
            contracts: prev.contracts.concat([
              {
                offeredAmount: offeredAmount,
                unitPrice: unitPrice
              }
            ])
          }
        })
      }
    }
  }

  constructor() {
    super();
    this.master = makeMasterContract();
    this.state = {
      contracts: []
    };
    this.getSellerContracts();
  }

  buyEnergy() {
    
  }

  render() {
    var tableBody = this.state.contracts.map((contract, index) => <tr key={index}>
      <td>Some date</td>
      <td>{contract.offeredAmount.toString(10)} kWh/day</td>
      <td>£{contract.unitPrice.toString(10)}/kWh</td>
      <td>
        <a href="#" onClick={() => this.buyEnergy()}>Buy</a>
      </td>
    </tr>);

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
              <th>Amount offered</th>
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

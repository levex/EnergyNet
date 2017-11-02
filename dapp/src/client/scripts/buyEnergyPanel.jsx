import React from 'react';
import {bonds} from 'oo7-parity';
import {makeMasterContract, makeContract} from "./blockchain";

export class BuyEnergyPanel extends React.Component {

  async getContracts() {
    let count = await this.master.contractCount();
    this.setState({count: count});
    for (let i = 0; i < count; i++) {
      const contractEntity = await this.master.contracts(i);
      const deregistered = contractEntity[2];
      const contract_addr = contractEntity[0];
      if (!deregistered) {
        const contract = makeContract(contract_addr);
        const offeredAmount = await contract.offeredAmount();
        const unitPrice = await contract.unitPrice();
        const newEntry = {
          offeredAmount: offeredAmount,
          unitPrice: unitPrice
        };
        this.setState((prev) => {
          return {contracts: prev.contracts.concat([newEntry])}
        })
      }
    }
    console.log(this.state);
  }

  constructor() {
    super();
    this.master = makeMasterContract();
    this.state = {contracts: []};
    this.getContracts();
  }

  render() {
    var tableBody = this.state.contracts.map(contract =>
      <tr>
        <td>Some date</td>
        <td>{contract.offeredAmount}</td>
        <td>{contract.unitPrice}</td>
      </tr>
    );

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
            </tr>
          </thead>
          <tbody>
            {tableBody}
          </tbody>
        </table>
      </div>
      {/* /.panel-body */}
    </div>
    )
  }
}

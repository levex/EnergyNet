import React from 'react';
import {Bond} from 'oo7';
import {bonds} from 'oo7-parity';
import {BButton, InputBond, TransactionProgressLabel} from 'parity-reactive-ui'
import {makeMasterContract, makeContract} from "./blockchain";
import update from 'immutability-helper'

export class BuyEnergyPanel extends React.Component {

  constructor() {
    super();
    this.master = makeMasterContract();
    this.amountBond = new Bond();
    this.state = {
      contracts: {}
    };
    bonds.head.tie(this.getSellerContracts.bind(this));
  }

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

        this.setState(update(this.state, {
          contracts: {
            $merge: {
              [contractAddr]: {
                contractAddr: contractAddr,
                contract: contract,
                offeredAmount: offeredAmount,
                unitPrice: unitPrice,
                tx: null
              }
            }
          }
        }));
      } else {
        this.setState(update(this.state, {
          contracts: {
            $unset: [contractAddr]
          }
        }))
      }
    }
  }

  buyEnergy(contractState) {
    this.setState(update(this.state, {
      contracts: {
        [contractState.contractAddr]: {
          tx: {
            $set: contractState.contract.buy(this.amountBond)
          }
        }
      }
    }));
  }

  render() {
    var tableBody = Object.keys(this.state.contracts).map(contractAddr => {
      var contractState = this.state.contracts[contractAddr];

      return (
        <tr key={contractAddr}>
          <td>Some date</td>
          <td>{contractState.offeredAmount.toString(10)}
            kWh/day</td>
          <td>£{contractState.unitPrice.toString(10)}/kWh</td>
          <td>
            <form role="form">
              <InputBond placeholder="kWh/day" bond={this.amountBond} style={{width: "100%"}} action>
                <input />
                {contractState.tx == null
                  ? <BButton className="btn btn-primary" content="Buy Energy" onClick={() => this.buyEnergy(contractState)}/>
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

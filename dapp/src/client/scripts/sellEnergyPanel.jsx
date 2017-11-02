import React from 'react'
import {Bond} from 'oo7'
import {BButton, InputBond, TransactionProgressLabel} from 'parity-reactive-ui'
import {bonds} from 'oo7-parity'
import {makeMasterContract} from './blockchain'

export class SellEnergyPanel extends React.Component {
  constructor() {
    super();

    this.energyMaster = makeMasterContract();
    this.amountBond = new Bond();
    this.priceBond = new Bond();
    this.state = {
      tx: null
    };
  }

  offerEnergy() {
    this.setState({
      tx: this.energyMaster.sell(this.priceBond, this.amountBond)
    });
  }

  render() {
    return (<div className="panel panel-default">
      <div className="panel-heading">
        <i className="fa fa-bar-chart-o fa-fw"></i>
        Sell energy
      </div>

      <div className="panel-body">
        <form role="form">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-5">
                <InputBond label="Amount" placeholder="kWh/day" bond={this.amountBond} style={{width: "100%"}} />
              </div>
              <div className="col-lg-5">
                <InputBond label="Price" placeholder="£/kWh" bond={this.priceBond} style={{width: "100%"}} />
              </div>
              <div className="col-lg-2">
                {this.state.tx == null
                  ? <BButton className="btn btn-primary btn-block" content="Offer Energy" onClick={() => this.offerEnergy()} />
                  : <TransactionProgressLabel value={this.state.tx} />
                }
              </div>
            </div>
          </div>
        </form>
      </div>
      {/* /.panel-body */}
    </div>);
  }
}

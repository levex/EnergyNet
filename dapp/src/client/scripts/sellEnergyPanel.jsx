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
      tx: this.energyMaster.sell(this.amountBond, this.priceBond)
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

          <div className="row">
            <div className="col-lg-6">
              <div className="form-group">
                <label>Amount</label>
                <InputBond placeholder="kWh/day" bond={this.amountBond}/>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <label>Price</label>
                <InputBond placeholder="£/kWh" bond={this.priceBond}/>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-6">
              <BButton className="btn btn-primary" content="Offer Energy" onClick={() => this.offerEnergy()}/>
            </div>

            <div className="col-lg-6">
              <TransactionProgressLabel value={this.state.tx}/>
            </div>
          </div>

        </form>
      </div>
      {/* /.panel-body */}
    </div>);
  }
}

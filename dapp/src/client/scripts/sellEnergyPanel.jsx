import React from 'react'
import {Bond} from 'oo7'
import {BButton, InputBond, TransactionProgressLabel} from 'parity-reactive-ui'
import {bonds} from 'oo7-parity'
import {makeMasterContract} from './blockchain'

export class SellEnergyPanel extends React.Component {
  constructor(props) {
    super(props);
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
                <InputBond label="Amount" placeholder="kWh/day" bond={this.props.amountBond} style={{width: "100%"}} />
              </div>
              <div className="col-lg-5">
                <InputBond label="Price" placeholder="£/kWh" bond={this.props.priceBond} style={{width: "100%"}} />
              </div>
              <div className="col-lg-2">
                {this.props.sellTx === null
                  ? <BButton className="btn btn-primary btn-block" content="Offer Energy" onClick={() => this.props.offerEnergy()} />
                  : <TransactionProgressLabel value={this.props.sellTx} />
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

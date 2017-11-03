import React from 'react';
import {Rspan} from 'oo7-react';
import {bonds, formatBalance} from 'oo7-parity';
import {Nav} from './nav';
import {Bond} from 'oo7';
import {makeContract, makeMasterContract} from './blockchain';
import {SellEnergyPanel} from './sellEnergyPanel';
import {BuyEnergyPanel} from './buyEnergyPanel';
import update from 'immutability-helper';
import BigNumber from 'bignumber.js';
import dateFormat from 'dateformat';

export class App extends React.Component {
  constructor() {
    super();
    this.master = makeMasterContract();
    this.state = {
      contracts: {},
      sellTx: null,
      energyBalance: new BigNumber(0),
      monthlyUsage: new BigNumber(0)
    };
    this.buyAmountBond = new Bond();
    this.sellAmountBond = new Bond();
    this.priceBond = new Bond();
    bonds.head.tie(this.getSellerContracts.bind(this));
    bonds.me.tie(this.getAccount.bind(this));
  }

  async getAccount() {
    const account = await bonds.me;
    this.setState({account: account});
  }

  async getSellerContracts() {
    let energyBalance = new BigNumber(0);
    let count = await this.master.contractCount();

    for (let i = 0; i < count; i++) {
      const contractEntity = await this.master.contracts(i);
      const deregistered = contractEntity[2];
      const contractAddr = contractEntity[0];
      const contract = makeContract(contractAddr);
      const remainingEnergyInContract = await contract.remainingEnergy(this.state.account);
      energyBalance = energyBalance.add(remainingEnergyInContract);
      if (!deregistered) {
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
    this.setState({energyBalance: energyBalance.toString(10)});
  }

  buyEnergy(contractState) {
    this.setState(update(this.state, {
      contracts: {
        [contractState.contractAddr]: {
          tx: {
            $set: contractState.contract.buy(this.buyAmountBond)
          }
        }
      }
    }));
  }

  offerEnergy() {
    this.setState({
      sellTx: this.master.sell(this.priceBond, this.sellAmountBond)
    });
  }

  componentDidMount() {
    const today = new Date();
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const format = 'ddd, dd mmm yyyy HH:MM:ss Z'
    fetch('http://localhost:5000/consumed_aggregate?aggregate={"$date_from":"'
        + dateFormat(firstOfMonth, format) + '","$date_to":"' + dateFormat(today, format) + '"}')
      .then(response => { return response.json() })
      .then(result => result['_items'])
      .then(maybeItems => { if (maybeItems.length == 0) { return Promise.reject('empty list') } else { return maybeItems } })
      .then(items => items[0]['total_amount'])
      .then(amount => this.setState({monthlyUsage: amount}))
  }

  render() {
    return (<div id="wrapper">
      <Nav/>
      <div id="page-wrapper">
        <div className="row">
          <div className="col-lg-12">
            <h1 className="page-header">Dashboard</h1>
          </div>
          {/* /.col-lg-12 */}
        </div>
        {/* /.row */}
        <div className="row">
          <div className="col-lg-4 col-md-8">
            <div className="panel panel-green">
              <div className="panel-heading">
                <div className="row">
                  <div className="col-xs-3">
                    <i className="fa fa-money fa-5x"></i>
                  </div>
                  <div className="col-xs-9 text-right">
                    <div className="huge"><Rspan>{bonds.balance(bonds.me).map(formatBalance)}</Rspan></div>
                    <div>Account Balance</div>
                  </div>
                </div>
              </div>
              <a href="#">
                <div className="panel-footer">
                  <span className="pull-left">View Details</span>
                  <span className="pull-right">
                    <i className="fa fa-arrow-circle-right"></i>
                  </span>
                  <div className="clearfix"></div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-lg-4 col-md-8">
            <div className="panel panel-primary">
              <div className="panel-heading">
                <div className="row">
                  <div className="col-xs-2">
                    <i className="fa fa-bolt fa-5x"></i>
                  </div>
                  <div className="col-xs-5 text-right">
                    <div className="huge">
                        {this.state.monthlyUsage.toString(10)}
                    </div>
                    <div>kWh used</div>
                  </div>
                  <div className="col-xs-5 text-right">
                    <div className="huge">
                        {this.state.energyBalance.toString(10)}
                    </div>
                    <div>kWh bought</div>
                  </div>
                </div>
              </div>
              <a href="#">
                <div className="panel-footer">
                  <span className="pull-left">View Details</span>
                  <span className="pull-right">
                    <i className="fa fa-arrow-circle-right"></i>
                  </span>
                  <div className="clearfix"></div>
                </div>
              </a>
            </div>
          </div>
          <div className="col-lg-4 col-md-8">
            <div className="panel panel-red">
              <div className="panel-heading">
                <div className="row">
                  <div className="col-xs-3">
                    <i className="fa fa-tasks fa-5x"></i>
                  </div>
                  <div className="col-xs-9 text-right">
                    <div className="huge">
                      <Rspan>3</Rspan>
                    </div>
                    <div>Contracts in effect</div>
                  </div>
                </div>
              </div>
              <a href="#">
                <div className="panel-footer">
                  <span className="pull-left">View Details</span>
                  <span className="pull-right">
                    <i className="fa fa-arrow-circle-right"></i>
                  </span>
                  <div className="clearfix"></div>
                </div>
              </a>
            </div>
          </div>
        </div>
        {/* /.row */}
        <div className="row">
          <div className="col-lg-12">
            <SellEnergyPanel sellTx={this.state.sellTx} amountBond={this.sellAmountBond} priceBond={this.priceBond} offerEnergy={this.offerEnergy.bind(this)}/>
            <BuyEnergyPanel contracts={this.state.contracts} buyEnergy={this.buyEnergy.bind(this)} amountBond={this.buyAmountBond} />
            <div className="panel panel-default">
              <div className="panel-heading">
                <i className="fa fa-bar-chart-o fa-fw"></i>
                Energy consumption
                <div className="pull-right">
                  <div className="btn-group">
                    <button type="button" className="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
                      Actions
                      <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu pull-right" role="menu">
                      <li>
                        <a href="#">Action</a>
                      </li>
                      <li>
                        <a href="#">Another action</a>
                      </li>
                      <li>
                        <a href="#">Something else here</a>
                      </li>
                      <li className="divider"></li>
                      <li>
                        <a href="#">Separated link</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* /.panel-heading */}
              <div className="panel-body">
                <div id="morris-area-chart"></div>
              </div>
              {/* /.panel-body */}
            </div>
            {/* /.panel */}
          </div>
          {/* /.col-lg-8 */}
        </div>
        {/* /.row */}
      </div>
      {/* /#page-wrapper */}

    </div>);
  }
}

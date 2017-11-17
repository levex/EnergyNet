import React from 'react';
import {Rspan} from 'oo7-react';
import {bonds, formatBalance} from 'oo7-parity';
import {Nav} from './nav';
import {Bond} from 'oo7';
import {makeContract, makeMasterContract} from './blockchain';
import {SellEnergyPanel} from './sellEnergyPanel';
import {BuyEnergyPanel} from './buyEnergyPanel';
import {ContractsViewPanel} from "./contractsViewPanel";
import update from 'immutability-helper';
import BigNumber from 'bignumber.js';
import dateFormat from 'dateformat';
import {EnergyConsumptionGraph} from './energyConsumptionGraph';

export class App extends React.Component {
  constructor() {
    super();
    this.master = makeMasterContract();
    this.state = {
      has_next: false,
      contractPages: [],
      contracts: {},
      mySellerContracts: {},
      myBuyerContracts: {},
      sellTx: null,
      energyBalance: new BigNumber(0),
      monthlyUsage: new BigNumber(0)
    };
    this.buyAmountBond = new Bond();
    this.sellAmountBond = new Bond();
    this.priceBond = new Bond();
    //bonds.head.tie(this.getSellerContracts.bind(this));

    //TODO: Auto update this
    this.getEnergyConsumptionHistory()
    bonds.me.tie(this.getAccount.bind(this));
    bonds.me.tie(this.getSellerContracts.bind(this));
    bonds.me.tie(this.getBuyerContracts.bind(this));
    bonds.me.tie(this.getAvailableContracts.bind(this));
  }

  async getAccount() {
    const account = await bonds.me;
    this.setState({account: account, mySellerContracts: {}, myBuyerContracts: {}});
  }

  async getAvailableContracts() {
    fetch('http://localhost:3000/contract/available_contracts')
    .then(response => response.json())
    .then(result => {
      this.setState({
        contractPages: result.pages,
        has_next: result.has_next
      })
      return result.data;
    })
    .then(contracts => contracts.filter((c) => c.offeredAmount > 0))
    .then(contracts => {
      contracts.forEach((contract) => {
        this.setState(update(this.state, {
          contracts: {
            $merge: {
              [contract.contractAddr]: {
                contractAddr: contract.contractAddr,
                offeredAmount: contract.offeredAmount,
                unitPrice: contract.unitPrice
              }
            }
          }
        }))
      })
    })
  }

  async getSellerContracts() {
    fetch('http://localhost:3000/contract/my_seller_contracts').then(response => response.json()).then(contracts => contracts.filter((c) => c.offeredAmount > 0)).then(contracts => {
      contracts.forEach((contract) => {
        this.setState(update(this.state, {
          mySellerContracts: {
            $merge: {
              [contract.contractAddr]: {
                contractAddr: contract.contractAddr,
                amount: contract.offeredAmount,
                unitPrice: contract.unitPrice
              }
            }
          }
        }))
      })
    })
  }

  async getBuyerContracts() {
    fetch('http://localhost:3000/contract/my_buyer_contracts').then(response => response.json()).then(contracts => contracts.filter((c) => c.remainingAmount > 0)).then(contracts => {
      contracts.forEach((contract) => {
        this.setState(update(this.state, {
          myBuyerContracts: {
            $merge: {
              [contract.contractAddr]: {
                contractAddr: contract.contractAddr,
                amount: contract.remainingAmount,
                unitPrice: contract.unitPrice
              }
            }
          }
        }))
      })
    })
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

  componentDidMount() {}

  getEnergyUsageThisMonth() {
    const today = new Date();
    const firstOfMonth = new Date(2017, 10, 1);
    const format = 'ddd, dd mmm yyyy HH:MM:ss Z'

    fetch('http://localhost:5000/consumed_aggregate?aggregate={"$date_from":"' + dateFormat(firstOfMonth, format) + '","$date_to":"' + dateFormat(today, format) + '"}').then(response => {
      return response.json()
    }).then(result => result['_items']).then(maybeItems => {
      if (maybeItems.length == 0) {
        return Promise.reject('empty list')
      } else {
        return maybeItems
      }
    }).then(items => items[0]['total_amount']).then(amount => this.setState({monthlyUsage: amount}))
  }

  getEnergyConsumptionHistory() {
    fetch('http://localhost:5000/consumed')
      .then(response => response.json())
      .then(result => result['_items'])
      .then(history => {
        this.setState({energyConsumptionHistory: history})
      })
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
                    <div className="huge">
                      <Rspan>{bonds.balance(bonds.me).map(formatBalance)}</Rspan>
                    </div>
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
                      <Rspan>{Object.keys(this.state.myBuyerContracts).length + Object.keys(this.state.mySellerContracts).length}</Rspan>
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
            <BuyEnergyPanel
              contractPages={this.state.contractPages}
              has_next={this.state.has_next}
              contracts={this.state.contracts}
              buyEnergy={this.buyEnergy.bind(this)}
              amountBond={this.buyAmountBond}
            />
            <ContractsViewPanel contracts={this.state.myBuyerContracts} contractName="My contracts as buyer"/>
            <ContractsViewPanel contracts={this.state.mySellerContracts} contractName="My contracts as seller"/>
            <EnergyConsumptionGraph data={this.state.energyConsumptionHistory} />
          </div>
          {/* /.col-lg-8 */}
        </div>
        {/* /.row */}
      </div>
      {/* /#page-wrapper */}

    </div>);
  }
}

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
import {BarChart, Bar, Label, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

const file = "dapp/src/client/scripts/app.js"
const METER_BACKEND = "http://localhost:3000"

export class App extends React.Component {
  constructor() {
    super();
    this.master = makeMasterContract();
    this.state = {
      contracts: [],
      mySellerContracts: [],
      myBuyerContracts: [],
      sellTx: null,
      energyBalance: new BigNumber(0),
      monthlyUsage: new BigNumber(0),
      contractsHistogram: []
    };
    this.buyAmountBond = new Bond();
    this.sellAmountBond = new Bond();
    this.priceBond = new Bond();
    /* FIXME: this fetch will not fetch up-to-date data, because back end
     * takes time to poll latest block update. This leads to front end rendering
     * not up-to-date data. */
    bonds.head.tie(this.updateContracts.bind(this));
    // FIXME: change in account does not propagate to back end
    bonds.me.tie(this.getAccount.bind(this));
    bonds.me.tie(this.updateContracts.bind(this));
  }

  async getAccount() {
    const account = await bonds.me;
    this.setState({
      account: account,
      mySellerContracts: [],
      myBuyerContracts: [],
    });
  }

  updateHistogram() {
    const HISTOGRAM_BINS = 10;
    let minHistogramPrice = new BigNumber(Number.MAX_SAFE_INTEGER);
    let maxHistogramPrice = new BigNumber(0);

    Object.keys(this.state.contracts).forEach(address => {
      const unitPrice = this.state.contracts[address].unitPrice;
      maxHistogramPrice = BigNumber.max(maxHistogramPrice, unitPrice);
      minHistogramPrice = BigNumber.min(minHistogramPrice, unitPrice);
    });

    let contractsHistogram = new Array(HISTOGRAM_BINS);
    let binSize = (maxHistogramPrice - minHistogramPrice) / HISTOGRAM_BINS;
    binSize = Math.round(binSize * 100) / 100;

    for (let i = 0; i < HISTOGRAM_BINS; i++) {
      let region = Math.round((minHistogramPrice.toNumber() + (i * binSize)) * 100) / 100;
      contractsHistogram[i] = {
        region: region,
        count: 0
      }
    }

    Object.keys(this.state.contracts).forEach(address => {
      const contract = this.state.contracts[address];
      let bin = Math.round((contract.unitPrice - minHistogramPrice) / binSize);
      if (bin <= HISTOGRAM_BINS && bin >= 0) {
        if (bin == HISTOGRAM_BINS) {
          bin -= 1;
        }

        contractsHistogram[bin].count += 1;
      }
    });

    this.setState({contractsHistogram: contractsHistogram});
  }

  updateContracts() {
    this.getAvailableContracts();
    this.getSellerContracts();
    this.getBuyerContracts();
  }

  getContracts(route) {
    return fetch(METER_BACKEND + route)
      .then(response => response.json())
  }

  getSellerContracts() {
    this.getContracts("/contract/my_seller_contracts")
      .then(data => {
        const sellerContracts = [];
        for (let c in data) { sellerContracts.push(data[c]) }
        this.setState({
          mySellerContracts: sellerContracts,
        })
      });
  }

  getAvailableContracts() {
    this.getContracts("/contract/available_contracts")
      .then(data => {
        const contracts = {}
        for (let c in data) {
          const contract = data[c];
          contracts[contract.address] = contract;
          contracts[contract.address].tx = null;
        }
        this.setState({
          contracts: contracts,
        });

        this.updateHistogram();
      });
  }

  getBuyerContracts() {
    this.getContracts("/contract/my_buyer_contracts")
      .then(data => {
        const buyerContracts = []
        for (let c in data) { buyerContracts.push(data[c]) }
        this.setState({
          myBuyerContracts: buyerContracts,
        })
      });
  }

  buyEnergy(contractAddress) {
    const contract = makeContract(contractAddress);
    this.setState(update(this.state, {
      contracts: {
        [contractAddress]: {
          tx: {
            $set: contract.buy(this.buyAmountBond)
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
                      {
                        Object.keys(this.state.myBuyerContracts).length
                      +
                        Object.keys(this.state.mySellerContracts).length
                      }
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
            <ContractsViewPanel contracts={this.state.myBuyerContracts} contractName="My contracts as buyer" amountSelector="remainingAmount" />
            <ContractsViewPanel contracts={this.state.mySellerContracts} contractName="My contracts as seller" amountSelector="offeredAmount" />
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
            <div className="panel panel-default">
              <div className="panel-heading">
                <i className="fa fa-bar-chart-o fa-fw"></i>
                Average price histogram
              </div>
              {/* /.panel-heading */}
              <div className="panel-body">
                <BarChart width={800} height={480} margin={{ top: 5, right: 5, bottom: 20, left: 5 }} data={this.state.contractsHistogram}>
                  <XAxis dataKey="region">
                    <Label position="bottom" value="Unit price [ETH]" />
                  </XAxis>
                  <YAxis />
                  <CartesianGrid strokeDashArray="3 3" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
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

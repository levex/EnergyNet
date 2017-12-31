import React from 'react';
import {Rspan} from 'oo7-react';
import {bonds, formatBalance} from 'oo7-parity';
import {Bond} from 'oo7';
import {makeContract, makeMasterContract} from './blockchain';
import update from 'immutability-helper';
import BigNumber from 'bignumber.js';
import Column from './Column';
import Stats from './Stats';
import Nav from './Nav';

const METER_BACKEND = "http://localhost:3000";

class App extends React.Component {

  constructor() {
    super();
    this.master = makeMasterContract();
    this.state = {
      contracts: {},
      mySellerContracts: [],
      myBuyerContracts: [],
      sellTx: null,
      contractsHistogram: [],
      show: "stats",
    };
    this.buyAmountBond = new Bond();
    this.sellAmountBond = new Bond();
    this.priceBond = new Bond();
    /* FIXME: this fetch will not fetch up-to-date data, because back end
     * takes time to poll latest block update. This leads to front end rendering
     * not up-to-date data. */
    bonds.head.tie(this.updateBlock.bind(this));
    // FIXME: change in account does not propagate to back end
    bonds.me.tie(this.getAccount.bind(this));
    bonds.me.tie(this.updateContracts.bind(this));
  }

  async updateBlock(blockNumber) {
    const payload = {
      blockNumber: blockNumber.number
    };
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    fetch(METER_BACKEND + "/transaction/updateBlockchain", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: headers
    }).then(this.updateContracts());
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
      };
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
      .then(response => response.json());
  }

  getSellerContracts() {
    this.getContracts("/contract/my_seller_contracts")
      .then(data => {
        const sellerContracts = [];
        for (let c in data) { sellerContracts.push(data[c]); }
        this.setState({
          mySellerContracts: sellerContracts,
        });
      });
  }

  getAvailableContracts() {
    this.getContracts("/contract/available_contracts")
      .then(data => {
        data.forEach(contract => contract.tx = null);

        this.setState({
          contracts: data,
        });

        this.updateHistogram();
      });
  }

  getBuyerContracts() {
    this.getContracts("/contract/my_buyer_contracts")
      .then(data => {
        const buyerContracts = [];
        for (let c in data) { buyerContracts.push(data[c]); }
        this.setState({
          myBuyerContracts: buyerContracts,
        });
      });
  }

  buyEnergy(contractAddress) {
    const contract = makeContract(contractAddress);
    var index = 0;
    for (var i = 0; i < this.state.contracts.length; i++) {
      if (this.state.contracts[i].address == contractAddress) {
        index = i;
        break;
      }
    }
    this.setState(update(this.state, {
      contracts: {
        [index]: {
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
    const accountBalance = <div className="col-xs-9 text-right">
        <div className="huge"><Rspan>{bonds.balance(bonds.me).map(formatBalance)}</Rspan></div>
        <div>Account Balance</div>
      </div>;

    const contractsInEffect = <div className="col-xs-9 text-right">
        <div className="huge">
          {
            Object.keys(this.state.myBuyerContracts).length
            +
            Object.keys(this.state.mySellerContracts).length
          }
        </div>
        <div>Contracts in effect</div>
      </div>;

    const transferedEnergy = <div>
      <div className="col-xs-3 text-right">
        <div className="huge">
          {this.state.mySellerContracts.reduce(
            (acc, contract) => {
              return acc.add(new BigNumber(contract.offeredAmount))
            }, new BigNumber(0)
          ).toString()}
        </div>
        <div>kWh to sell</div>
      </div>
      <div className="col-xs-1 text-right huge">
      :
      </div>
      <div className="col-xs-4 text-right">
        <div className="huge">
          {this.state.myBuyerContracts.reduce(
            (acc, contract) => {
              return acc.add(new BigNumber(contract.remainingAmount))
            }, new BigNumber(0)
          ).toString()}
        </div>
        <div>kWh bought</div>
      </div>
    </div>;

    const statsContractData = {
      sellTx: this.state.sellTx,
      contracts: this.state.contracts,
      myBuyerContracts: this.state.myBuyerContracts,
      mySellerContracts: this.state.mySellerContracts,
      contractsHistogram: this.state.contractsHistogram,
    };

    const statsBonds = {
      sellAmountBond: this.sellAmountBond,
      buyAmountBond: this.buyAmountBond,
      priceBond: this.priceBond,
      offerEnergy: this.offerEnergy.bind(this),
      buyEnergy: this.buyEnergy.bind(this),
    };

    const navButtonClass = {
      stats: this.state.show === "stats" ? "active" : "",
      data: this.state.show === "data" ? "active" : "",
    };

    return (
      <div id="wrapper">
        <Nav/>
        <div id="page-wrapper">
          <div className="row">
            <Column icon="fa fa-money fa-5x" color="green" content={accountBalance} />
            <Column icon="fa fa-bolt fa-5x" color="primary" content={transferedEnergy} />
            <Column icon="fa fa-tasks fa-5x" color="red" content={contractsInEffect} />
          </div>
          <div className="row">
            <ul className="nav nav-tabs nav-justified">
              <li role="presentation" className={navButtonClass.stats} onClick={() => {this.setState({show: "stats"})}}>
                <a>Stats</a>
              </li>
              <li role="presentation" className={navButtonClass.data} onClick={() => {this.setState({show: "data"})}}>
                <a>Settings</a>
              </li>
            </ul>

            {this.state.show === "stats"
              ? <Stats contracts={statsContractData} bonds={statsBonds} />
              : <div> LOL </div>
            }

          </div>
        </div>
      </div>
    );
  }
}

export default App;
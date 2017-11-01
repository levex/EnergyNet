import React from 'react';
import {Rspan} from 'oo7-react';
import {bonds} from 'oo7-parity';
import {Nav} from './nav'

const ENERGY_MASTER_ADDRESS = "0xFD1867fF6E64DB3B38ea51158A4993F303855CD2";

/* TODO: Import ABI somehow */
const ENERGY_MASTER_ABI = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "seller",
        "type": "address"
      }, {
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getSellerContractByIndex",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "type": "function"
  }, {
    "constant": false,
    "inputs": [
      {
        "name": "energyContract",
        "type": "address"
      }, {
        "name": "seller",
        "type": "address"
      }
    ],
    "name": "registerSeller",
    "outputs": [],
    "payable": false,
    "type": "function"
  }, {
    "constant": true,
    "inputs": [
      {
        "name": "seller",
        "type": "address"
      }
    ],
    "name": "getSellerContractCount",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  }
];

export class App extends React.Component {
  constructor() {
    super();
    this.energyMaster = bonds.makeContract(ENERGY_MASTER_ADDRESS, ENERGY_MASTER_ABI);
    this.state = {
      contracts: []
    };
    bonds.me.tie(this.getContracts.bind(this));
  }

  async getContractCount(account) {
    const count = await this.energyMaster.getSellerContractCount(account);
    return count.toString(10);
  }

  async getContracts(account) {
    const count = await this.getContractCount(account);
    const promises = [];
    for (let i = 0; i < count; i++) {
      promises.push(this.energyMaster.getSellerContractByIndex(account, i));
    }
    this.setState({contracts: await Promise.all(promises)});
  }

  render() {
    /*
		return (<Rspan>
                My Address:
                {bonds.me}
                <br />
                <Rspan>
                    My contracts: <br />
                    {this.state.accounts.join(', ')}
                </Rspan>
		</Rspan>
		*/

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
                    <div className="huge">£ 2048</div>
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
                  <div className="col-xs-3">
                    <i className="fa fa-bolt fa-5x"></i>
                  </div>
                  <div className="col-xs-9 text-right">
                    <div className="huge">421</div>
                    <div>kWh used this month</div>
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
                      <Rspan>{this.state.contracts.length}</Rspan>
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
            <div className="panel panel-default">
              <div className="panel-heading">
                <i className="fa fa-bar-chart-o fa-fw"></i>
                Find energy contracts
              </div>
              {/* /.panel-heading */}
              <div className="panel-body">
                <table width="100%" class="table table-striped table-bordered table-hover">
                  <thead>
                    <tr>
                      <th>Date offered</th>
                      <th>Amount offered</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>1st November 2017</th>
                      <th>100kWh/day</th>
                      <th>£1/kWh</th>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* /.panel-body */}
            </div>
            {/* /.panel */}
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

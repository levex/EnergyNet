import React from 'react';
import {Rspan} from 'oo7-react';
import {bonds} from 'oo7-parity';
import Nav from './nav'

const ENERGY_MASTER_ADDRESS = "0xFD1867fF6E64DB3B38ea51158A4993F303855CD2";

/* TODO: Import ABI somehow */
const ENERGY_MASTER_ABI = [
    {
      "constant": true,
      "inputs": [
        {
          "name": "seller",
          "type": "address"
        },
        {
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
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "energyContract",
          "type": "address"
        },
        {
          "name": "seller",
          "type": "address"
        }
      ],
      "name": "registerSeller",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
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
        this.state = {contracts: []};
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
		return (
	    <div id="wrapper">
					<Nav />
	        <div id="page-wrapper">
	            <div className="row">
	                <div className="col-lg-12">
	                    <h1 className="page-header">Dashboard</h1>
	                </div>
	                {/* /.col-lg-12 */}
	            </div>
	            {/* /.row */}
	            <div className="row">
	                <div className="col-lg-3 col-md-6">
	                    <div className="panel panel-primary">
	                        <div className="panel-heading">
	                            <div className="row">
	                                <div className="col-xs-3">
	                                    <i className="fa fa-bolt fa-5x"></i>
	                                </div>
	                                <div className="col-xs-9 text-right">
	                                    <div className="huge">421</div>
	                                    <div>kWh used</div>
	                                </div>
	                            </div>
	                        </div>
	                        <a href="#">
	                            <div className="panel-footer">
	                                <span className="pull-left">View Details</span>
	                                <span className="pull-right"><i className="fa fa-arrow-circle-right"></i></span>
	                                <div className="clearfix"></div>
	                            </div>
	                        </a>
	                    </div>
	                </div>
	                <div className="col-lg-3 col-md-6">
	                    <div className="panel panel-green">
	                        <div className="panel-heading">
	                            <div className="row">
	                                <div className="col-xs-3">
	                                    <i className="fa fa-money fa-5x"></i>
	                                </div>
	                                <div className="col-xs-9 text-right">
	                                    <div className="huge">2048 $</div>
	                                    <div>USD</div>
	                                </div>
	                            </div>
	                        </div>
	                        <a href="#">
	                            <div className="panel-footer">
	                                <span className="pull-left">View Details</span>
	                                <span className="pull-right"><i className="fa fa-arrow-circle-right"></i></span>
	                                <div className="clearfix"></div>
	                            </div>
	                        </a>
	                    </div>
	                </div>
	                <div className="col-lg-3 col-md-6">
	                    <div className="panel panel-yellow">
	                        <div className="panel-heading">
	                            <div className="row">
	                                <div className="col-xs-3">
	                                    <i className="fa fa-shopping-cart fa-5x"></i>
	                                </div>
	                                <div className="col-xs-9 text-right">
	                                    <div className="huge">124</div>
	                                    <div>Latest orders</div>
	                                </div>
	                            </div>
	                        </div>
	                        <a href="#">
	                            <div className="panel-footer">
	                                <span className="pull-left">View Details</span>
	                                <span className="pull-right"><i className="fa fa-arrow-circle-right"></i></span>
	                                <div className="clearfix"></div>
	                            </div>
	                        </a>
	                    </div>
	                </div>
	                <div className="col-lg-3 col-md-6">
	                    <div className="panel panel-red">
	                        <div className="panel-heading">
	                            <div className="row">
	                                <div className="col-xs-3">
	                                    <i className="fa fa-tasks fa-5x"></i>
	                                </div>
	                                <div className="col-xs-9 text-right">
	                                    <div className="huge"><Rspan>{this.state.contracts.length}</Rspan></div>
	                                    <div>Contracts in effect</div>
	                                </div>
	                            </div>
	                        </div>
	                        <a href="#">
	                            <div className="panel-footer">
	                                <span className="pull-left">View Details</span>
	                                <span className="pull-right"><i className="fa fa-arrow-circle-right"></i></span>
	                                <div className="clearfix"></div>
	                            </div>
	                        </a>
	                    </div>
	                </div>
	            </div>
	            {/* /.row */}
	            <div className="row">
	                <div className="col-lg-8">
	                    <div className="panel panel-default">
	                        <div className="panel-heading">
	                            <i className="fa fa-bar-chart-o fa-fw"></i> Energy consumption
	                            <div className="pull-right">
	                                <div className="btn-group">
	                                    <button type="button" className="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
	                                        Actions
	                                        <span className="caret"></span>
	                                    </button>
	                                    <ul className="dropdown-menu pull-right" role="menu">
	                                        <li><a href="#">Action</a>
	                                        </li>
	                                        <li><a href="#">Another action</a>
	                                        </li>
	                                        <li><a href="#">Something else here</a>
	                                        </li>
	                                        <li className="divider"></li>
	                                        <li><a href="#">Separated link</a>
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
	                    <div className="panel panel-default">
	                        <div className="panel-heading">
	                            <i className="fa fa-bar-chart-o fa-fw"></i> Bar Chart Example
	                            <div className="pull-right">
	                                <div className="btn-group">
	                                    <button type="button" className="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
	                                        Actions
	                                        <span className="caret"></span>
	                                    </button>
	                                    <ul className="dropdown-menu pull-right" role="menu">
	                                        <li><a href="#">Action</a>
	                                        </li>
	                                        <li><a href="#">Another action</a>
	                                        </li>
	                                        <li><a href="#">Something else here</a>
	                                        </li>
	                                        <li className="divider"></li>
	                                        <li><a href="#">Separated link</a>
	                                        </li>
	                                    </ul>
	                                </div>
	                            </div>
	                        </div>
	                        {/* /.panel-heading */}
	                        <div className="panel-body">
	                            <div className="row">
	                                <div className="col-lg-4">
	                                    <div className="table-responsive">
	                                        <table className="table table-bordered table-hover table-striped">
	                                            <thead>
	                                                <tr>
	                                                    <th>#</th>
	                                                    <th>Date</th>
	                                                    <th>Time</th>
	                                                    <th>Amount</th>
	                                                </tr>
	                                            </thead>
	                                            <tbody>
	                                                <tr>
	                                                    <td>3326</td>
	                                                    <td>10/21/2013</td>
	                                                    <td>3:29 PM</td>
	                                                    <td>$321.33</td>
	                                                </tr>
	                                                <tr>
	                                                    <td>3325</td>
	                                                    <td>10/21/2013</td>
	                                                    <td>3:20 PM</td>
	                                                    <td>$234.34</td>
	                                                </tr>
	                                                <tr>
	                                                    <td>3324</td>
	                                                    <td>10/21/2013</td>
	                                                    <td>3:03 PM</td>
	                                                    <td>$724.17</td>
	                                                </tr>
	                                                <tr>
	                                                    <td>3323</td>
	                                                    <td>10/21/2013</td>
	                                                    <td>3:00 PM</td>
	                                                    <td>$23.71</td>
	                                                </tr>
	                                                <tr>
	                                                    <td>3322</td>
	                                                    <td>10/21/2013</td>
	                                                    <td>2:49 PM</td>
	                                                    <td>$8345.23</td>
	                                                </tr>
	                                                <tr>
	                                                    <td>3321</td>
	                                                    <td>10/21/2013</td>
	                                                    <td>2:23 PM</td>
	                                                    <td>$245.12</td>
	                                                </tr>
	                                                <tr>
	                                                    <td>3320</td>
	                                                    <td>10/21/2013</td>
	                                                    <td>2:15 PM</td>
	                                                    <td>$5663.54</td>
	                                                </tr>
	                                                <tr>
	                                                    <td>3319</td>
	                                                    <td>10/21/2013</td>
	                                                    <td>2:13 PM</td>
	                                                    <td>$943.45</td>
	                                                </tr>
	                                            </tbody>
	                                        </table>
	                                    </div>
	                                    {/* /.table-responsive */}
	                                </div>
	                                {/* /.col-lg-4 (nested) */}
	                                <div className="col-lg-8">
	                                    <div id="morris-bar-chart"></div>
	                                </div>
	                                {/* /.col-lg-8 (nested) */}
	                            </div>
	                            {/* /.row */}
	                        </div>
	                        {/* /.panel-body */}
	                    </div>
	                    {/* /.panel */}
	                </div>
	                {/* /.col-lg-8 */}
	                <div className="col-lg-4">
	                    <div className="panel panel-default">
	                        <div className="panel-heading">
	                            <i className="fa fa-bell fa-fw"></i> Notifications Panel
	                        </div>
	                        {/* /.panel-heading */}
	                        <div className="panel-body">
	                            <div className="list-group">
	                                <a href="#" className="list-group-item">
	                                    <i className="fa fa-twitter fa-fw"></i> 3 New subscribers
	                                    <span className="pull-right text-muted small"><em>12 minutes ago</em>
	                                    </span>
	                                </a>
	                                <a href="#" className="list-group-item">
	                                    <i className="fa fa-envelope fa-fw"></i> Message received
	                                    <span className="pull-right text-muted small"><em>27 minutes ago</em>
	                                    </span>
	                                </a>
	                                <a href="#" className="list-group-item">
	                                    <i className="fa fa-tasks fa-fw"></i> New predictions for week 43
	                                    <span className="pull-right text-muted small"><em>43 minutes ago</em>
	                                    </span>
	                                </a>
	                                <a href="#" className="list-group-item">
	                                    <i className="fa fa-bolt fa-fw"></i> Network update
	                                    <span className="pull-right text-muted small"><em>11:13 AM</em>
	                                    </span>
	                                </a>
	                                <a href="#" className="list-group-item">
	                                    <i className="fa fa-shopping-cart fa-fw"></i> Energy order place
	                                    <span className="pull-right text-muted small"><em>9:49 AM</em>
	                                    </span>
	                                </a>
	                                <a href="#" className="list-group-item">
	                                    <i className="fa fa-money fa-fw"></i> Received payment from @user
	                                    <span className="pull-right text-muted small"><em>Yesterday</em>
	                                    </span>
	                                </a>
	                            </div>
	                            {/* /.list-group */}
	                            <a href="#" className="btn btn-default btn-block">View All Alerts</a>
	                        </div>
	                        {/* /.panel-body */}
	                    </div>
	                    {/* /.panel */}
	                    <div className="panel panel-default">
	                        <div className="panel-heading">
	                            <i className="fa fa-bar-chart-o fa-fw"></i> Donut Chart Example
	                        </div>
	                        <div className="panel-body">
	                            <div id="morris-donut-chart"></div>
	                            <a href="#" className="btn btn-default btn-block">View Details</a>
	                        </div>
	                        {/* /.panel-body */}
	                    </div>
	                    {/* /.panel */}
	                    <div className="chat-panel panel panel-default">
	                        <div className="panel-heading">
	                            <i className="fa fa-comments fa-fw"></i> Feed
	                            <div className="btn-group pull-right">
	                                <button type="button" className="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
	                                    <i className="fa fa-chevron-down"></i>
	                                </button>
	                                <ul className="dropdown-menu slidedown">
	                                    <li>
	                                        <a href="#">
	                                            <i className="fa fa-refresh fa-fw"></i> Refresh
	                                        </a>
	                                    </li>
	                                    <li>
	                                        <a href="#">
	                                            <i className="fa fa-check-circle fa-fw"></i> Available
	                                        </a>
	                                    </li>
	                                    <li>
	                                        <a href="#">
	                                            <i className="fa fa-times fa-fw"></i> Busy
	                                        </a>
	                                    </li>
	                                    <li>
	                                        <a href="#">
	                                            <i className="fa fa-clock-o fa-fw"></i> Away
	                                        </a>
	                                    </li>
	                                    <li className="divider"></li>
	                                    <li>
	                                        <a href="#">
	                                            <i className="fa fa-sign-out fa-fw"></i> Sign Out
	                                        </a>
	                                    </li>
	                                </ul>
	                            </div>
	                        </div>
	                        {/* /.panel-heading */}
	                        <div className="panel-body">
	                            <ul className="chat">
	                                <li className="left clearfix">
	                                    <span className="chat-img pull-left">
	                                        <img src="http://placehold.it/50/55C1E7/fff" alt="User Avatar" className="img-circle" />
	                                    </span>
	                                    <div className="chat-body clearfix">
	                                        <div className="header">
	                                            <strong className="primary-font">Energy news</strong>
	                                            <small className="pull-right text-muted">
	                                                <i className="fa fa-clock-o fa-fw"></i> 12 mins ago
	                                            </small>
	                                        </div>
	                                        <p>
	                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare dolor, quis ullamcorper ligula sodales.
	                                        </p>
	                                    </div>
	                                </li>
	                                <li className="right clearfix">
	                                    <span className="chat-img pull-right">
	                                        <img src="http://placehold.it/50/FA6F57/fff" alt="User Avatar" className="img-circle" />
	                                    </span>
	                                    <div className="chat-body clearfix">
	                                        <div className="header">
	                                            <small className=" text-muted">
	                                                <i className="fa fa-clock-o fa-fw"></i> 13 mins ago</small>
	                                            <strong className="pull-right primary-font">Neighbourhood group</strong>
	                                        </div>
	                                        <p>
	                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare dolor, quis ullamcorper ligula sodales.
	                                        </p>
	                                    </div>
	                                </li>
	                                <li className="left clearfix">
	                                    <span className="chat-img pull-left">
	                                        <img src="http://placehold.it/50/55C1E7/fff" alt="User Avatar" className="img-circle" />
	                                    </span>
	                                    <div className="chat-body clearfix">
	                                        <div className="header">
	                                            <strong className="primary-font">Energy news</strong>
	                                            <small className="pull-right text-muted">
	                                                <i className="fa fa-clock-o fa-fw"></i> 14 mins ago</small>
	                                        </div>
	                                        <p>
	                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare dolor, quis ullamcorper ligula sodales.
	                                        </p>
	                                    </div>
	                                </li>
	                            </ul>
	                        </div>
	                        {/* /.panel-body */}
	                        <div className="panel-footer">
	                            <div className="input-group">
	                                <input id="btn-input" type="text" className="form-control input-sm" placeholder="Type your message here..." />
	                                <span className="input-group-btn">
	                                    <button className="btn btn-warning btn-sm" id="btn-chat">
	                                        Send
	                                    </button>
	                                </span>
	                            </div>
	                        </div>
	                        {/* /.panel-footer */}
	                    </div>
	                    {/* /.panel .chat-panel */}
	                </div>
	                {/* /.col-lg-4 */}
	            </div>
	            {/* /.row */}
	        </div>
	        {/* /#page-wrapper */}

	    </div>
		);
	}
}

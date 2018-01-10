import React from "react";
import {ContractsViewPanel} from "./contractsViewPanel";
import {BarChart, Bar, Label, XAxis, YAxis, CartesianGrid, Tooltip} from "recharts";

const Stats = (props) => {
  const contracts = props.contracts;

  return (
    <div className="col-lg-12">

      <div className="panel panel-default">
        <div className="panel-heading">
          <i className="fa fa-bar-chart-o fa-fw"></i>
          Energy consumption
        </div>
        <div className="panel-body">
          <div className="col-lg-4">
            <iframe src="http://localhost:4000/dashboard-solo/db/energy-statistics?orgId=1&panelId=1&from=now-24h&to=now&theme=light" width="100%" height="200" frameborder="0"></iframe>
          </div>
          <div className="col-lg-4">
            <iframe src="http://localhost:4000/dashboard-solo/db/energy-statistics?orgId=1&from=1514786595639&to=1515216195883&panelId=2&&theme=light" width="100%" height="200" frameborder="0"></iframe>
          </div>
          <div className="col-lg-4">
            <iframe src="http://localhost:4000/dashboard-solo/db/energy-statistics?orgId=1&from=1514786595639&to=1515216195883&panelId=3&&theme=light" width="100%" height="200" frameborder="0"></iframe>
          </div>
        </div>
        {/* /.panel-body */}
      </div>

      <div className="row">
        <div className="col-lg-6">
          <ContractsViewPanel contracts={contracts.myBuyerContracts} contractName="My contracts as buyer"
            title="My buyer contracts" amountSelector="remainingAmount" />
        </div>
        <div className="col-lg-6">
          <ContractsViewPanel contracts={contracts.mySellerContracts} contractName="My contracts as seller"
            title="My seller contracts" amountSelector="offeredAmount" />
        </div>
      </div>

      <div className="panel panel-default">
        <div className="panel-heading">
          <i className="fa fa-bar-chart-o fa-fw"></i>
          Average price histogram
        </div>
        {/* /.panel-heading */}
        <div className="panel-body">
          <BarChart width={800} height={480} margin={{ top: 5, right: 5, bottom: 20, left: 5 }} data={contracts.contractsHistogram}>
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
  );
};

export default Stats;

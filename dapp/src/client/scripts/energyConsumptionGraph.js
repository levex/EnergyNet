import React from 'react';
import dateFormat from 'dateformat';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

export class EnergyConsumptionGraph extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
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
      	<LineChart
            width={1000}
            height={500}
            data={this.props.data}
            margin={{top: 20, right: 20, left: 20, bottom: 20}}>
         <XAxis
           dataKey="to"
           tickFormatter={(tick) => {
             var date = new Date(tick)
             return dateFormat('dd/mmm/yyyy')
           }}
         />
         <YAxis />
         <CartesianGrid strokeDasharray="3 3"/>
         <Tooltip
           formatter={(value) => value + " kWh"}
         />
         <Legend />
         <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{r: 8}}/>
        </LineChart>
      </div>
    </div>)
  }
}

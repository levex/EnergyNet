import React from 'react';

export class ContractsViewPanel extends React.Component {

  constructor(props) {
    super(props)
  }
  render() {
    var tableBody = Object.keys(this.props.contracts).map(contractAddr => {
      var contractState = this.props.contracts[contractAddr];

      return (
        <tr key={contractAddr}>
          <td>Some date</td>
          <td>{contractState.amount.toString(10)}
            kWh/day</td>
          <td>£{contractState.unitPrice.toString(10)}/kWh</td>
        </tr>
      );
    });

    return (<div className="panel panel-default">
      <div className="panel-heading">
        <i className="fa fa-bar-chart-o fa-fw"></i>
        {this.props.contractName}
      </div>

      <div className="panel-body">
        <table width="100%" className="table table-striped table-bordered table-hover">
          <thead>
          <tr>
            <th>Date offered</th>
            <th>Amount</th>
            <th>Price</th>
          </tr>
          </thead>
          <tbody>
          {tableBody}
          </tbody>
        </table>
      </div>
      {/* /.panel-body */}
    </div>)
  }
}

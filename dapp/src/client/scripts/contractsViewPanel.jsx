import React from 'react';

export class ContractsViewPanel extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    let tableBody = (this.props.contracts).map(contract => {
      return (
        <tr key={contract.address}>
          <td>Some date</td>
          <td>{contract[this.props.amountSelector]}
            kWh/day</td>
          <td>£{contract.unitPrice}/kWh</td>
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

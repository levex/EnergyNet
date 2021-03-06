import React from "react";
import ReactDOM from "react-dom";
import {BButton, InputBond, TransactionProgressLabel} from "parity-reactive-ui";

const $ = require("jquery");
$.DataTable = require("datatables.net-bs");

class BuyEnergyPanel extends React.Component {

  componentDidMount() {
    const columns =

    $(this.refs.table).DataTable({
      "dom":
         "<'data-table-wrapper'" +
         "<'row'<'col-sm-6'l><'col-sm-6'>>" +
         "<'row'<'col-sm-12'tr>>" +
         "<'row'<'col-sm-5'i><'col-sm-7'p>>" +
         ">",
      "data": this.props.contracts,
      "columns": [
        {
          title: "Amount Offered",
          width: 100,
          data: "offeredAmount",
          type: "num",
          render: (data, type, row) => data + " kWh/day"
        },
        {
          title: "Amount Bought",
          width: 100,
          data: "remainingAmount",
          type: "num",
          render: (data, type, row) => data + " kWh/day"
        },
        {
          title: "Price",
          width: 100,
          data: "unitPrice",
          type: "num",
          render: (data, type, row) => data + " £/kWh"
        },
        {
          title: "Buy Energy",
          width: 400,
          data: null,
          orderable: false,
          createdCell: (cell, cellData, rowData, rowIndex, colIndex) => ReactDOM.render(
            <form role="form">
              <InputBond placeholder="kWh/day" bond={this.props.amountBond} style={{width: "100%"}} action>
                <input />
                {rowData.tx === null
                  ? <BButton className="btn btn-primary" content="Buy Energy" onClick={() => this.props.buyEnergy(rowData.address)}/>
                  : <TransactionProgressLabel value={rowData.tx}/>
                }
              </InputBond>
            </form>, cell)
        },
      ],
      "order": [[2, "asc"]],
    });
  }

  componentWillUnmount() {
    $(".data-table-wrapper")
      .find("table")
      .DataTable()
      .destroy(true);
  }

  shouldComponentUpdate(nextProps) {
    const table = $(".data-table-wrapper")
      .find("table")
      .DataTable();
    table.clear();
    table.rows.add(nextProps.contracts);
    table.draw();
    return false;
  }

  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <i className="fa fa-bar-chart-o fa-fw"></i>
          Buy energy
        </div>

        <div className="panel-body">
          <table width="100%" className="table table-striped table-bordered table-hover" ref="table" />
        </div>
      </div>
    );
  }
}

export default BuyEnergyPanel;

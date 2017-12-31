import React from "react";

const $ = require('jquery');
$.DataTable = require('datatables.net-bs');

export class ContractsViewPanel extends React.Component {

  constructor(props) {
    super(props);
  }

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
           title: "Date Offered",
           width: 100,
           data: null,
           type: "string",
           render: (data, type, row) => "SomeDate"
         },
         {
           title: "Amount Offered",
           width: 100,
           data: this.props.amountSelector,
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
       ],
       "order": [[2, "asc"]],
    })
  }

  componentWillUnmount() {
    $('.data-table-wrapper')
    .find('table')
    .DataTable()
    .destroy(true)
  }

  shouldComponentUpdate(nextProps) {
    const table = $('.data-table-wrapper')
    .find('table')
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
          {this.props.title}
        </div>

        <div className="panel-body">
          <table width="100%" className="table table-striped table-bordered table-hover" ref="table" />
        </div>
      </div>
    )
  }
}

import React from 'react';
import ReactDOM from 'react-dom';
import {BButton, InputBond, TransactionProgressLabel} from 'parity-reactive-ui'

const $ = require('jquery');
$.DataTable = require('datatables.net-bs');

export class SellerContractsTable extends React.Component {

    componentDidMount() {
        const columns = $(this.refs.table).DataTable({
            "dom":
            "<'data-table-wrapper'" +
            "<'row'<'col-sm-6'l><'col-sm-6'>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-5'i><'col-sm-7'p>>" +
            ">",
            "data": this.props.contracts,
            "columns": [
                {
                    title: "Date offered",
                    width: 100,
                    data: "offeredAmount",
                    render: (data, type, row) => "someDate"
                },
                {
                    title: "Amount",
                    width: 100,
                        data: "amountSelector",
                        render: (data, type, row) => data + " kWh/day"
                },
                {
                    title: "Price",
                    width: 100,
                    data: "unitPrice",
                    render: (data, type, row) => data + " £/kWh"
                },
            ],
            "order": [[0, "asc"], [1, "asc"], [2, "asc"]],
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
            <div>
            <table width="100%" className="table table-striped table-bordered table-hover" ref="table" />
            </div>
    )
    }
}

import React from 'react';
import {Rspan} from 'oo7-react';
import {bonds} from 'oo7-parity';

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
        this.state = {accounts: []};
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
        this.setState({accounts: await Promise.all(promises)});
    }

	render() {
		return (<Rspan>
                My Address:
                {bonds.me}
                <br />
                <Rspan>
                    My contracts: <br />
                    {this.state.accounts.join(', ')}
                </Rspan>
		</Rspan>
        );
	}
}

import {bonds} from 'oo7-parity'

const ENERGY_MASTER_ADDRESS = "0x3507Ff52cB28F3eCB32A8ee0b0B00618D2E3dD02";

/* TODO: Import ABI somehow */
const ENERGY_MASTER_ABI = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "contracts",
    "outputs": [
      {
        "name": "contract_addr",
        "type": "address"
      }, {
        "name": "seller",
        "type": "address"
      }, {
        "name": "deregistered",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }, {
    "constant": false,
    "inputs": [
      {
        "name": "contract_addr",
        "type": "address"
      }
    ],
    "name": "deregister",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }, {
    "constant": true,
    "inputs": [],
    "name": "contractCount",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }, {
    "constant": false,
    "inputs": [
      {
        "name": "unitPrice",
        "type": "uint256"
      }, {
        "name": "amountOffered",
        "type": "uint256"
      }
    ],
    "name": "sell",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }, {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  }
]

export function makeMasterContract() {
  return bonds.makeContract(ENERGY_MASTER_ADDRESS, ENERGY_MASTER_ABI);
}

import { bonds } from 'oo7-parity'

const ENERGY_MASTER_ADDRESS = "0xFD1867fF6E64DB3B38ea51158A4993F303855CD2";

/* TODO: Import ABI somehow */
const ENERGY_MASTER_ABI = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "seller",
        "type": "address"
      }, {
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
  }, {
    "constant": false,
    "inputs": [
      {
        "name": "energyContract",
        "type": "address"
      }, {
        "name": "seller",
        "type": "address"
      }
    ],
    "name": "registerSeller",
    "outputs": [],
    "payable": false,
    "type": "function"
  }, {
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

export function makeMasterContract() {
  return bonds.makeContract(ENERGY_MASTER_ADDRESS, ENERGY_MASTER_ABI);
}

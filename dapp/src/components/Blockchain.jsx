import {bonds} from "oo7-parity";
import ENERGY_ABI from "./abis/abi.js";
import ENERGY_MASTER_ABI from "./abis/abi_master.js";

const config = require("../config.json");
const ENERGY_MASTER_ADDRESS = config.master;

export function makeMasterContract() {
  return bonds.makeContract(ENERGY_MASTER_ADDRESS, ENERGY_MASTER_ABI);
}

export function makeContract(address) {
  return bonds.makeContract(address, ENERGY_ABI);
}

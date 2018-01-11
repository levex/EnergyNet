import {bonds} from "oo7-parity";
import ENERGY_ABI from "./abis/abi.js";
import ENERGY_MASTER_ABI from "./abis/abi_master.js";

const ENERGY_MASTER_ADDRESS = "0x86f2835e5C9be2Ea5e512237411Af7B304Ce0A1B";

export function makeMasterContract() {
  return bonds.makeContract(ENERGY_MASTER_ADDRESS, ENERGY_MASTER_ABI);
}

export function makeContract(address) {
  return bonds.makeContract(address, ENERGY_ABI);
}

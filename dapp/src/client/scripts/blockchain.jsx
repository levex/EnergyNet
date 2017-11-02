import {bonds} from 'oo7-parity'
import {ENERGY_ABI} from "./abi.js";
import {ENERGY_MASTER_ABI} from "./abi_master.js";

const ENERGY_MASTER_ADDRESS = "0x3507Ff52cB28F3eCB32A8ee0b0B00618D2E3dD02";

export function makeMasterContract() {
  return bonds.makeContract(ENERGY_MASTER_ADDRESS, ENERGY_MASTER_ABI);
}

export function makeContract(address) {
  return bonds.makeContract(address, ENERGY_ABI);
}

const oo7parity = require("oo7-parity");
const bonds = oo7parity.bonds;
const ENERGY_MASTER_ABI = require("./abis/abi_master");
const ENERGY_ABI = require("./abis/abi");
const ENERGY_MASTER_ADDRESS = "0x7B019fD19f8b75Ff00089Dc93411dFB04e6D48Ca";
const bigNumber = require("bignumber.js");
const recorder = require("./recorder");

const EnergyMaster = bonds.makeContract(ENERGY_MASTER_ADDRESS, ENERGY_MASTER_ABI);

let contracts = {};
let buyerContractsSet = new Set();
let sellerContractsSet = new Set();
let availableContractsSet = new Set();
let inited = false;
let lastBlock = 0;
let lastCount = 0;
let logs = [];

async function getContractInfoByAddress(address) {
  const account = await myAccount();
  const contract = makeEnergyContract(address);
  const [
    seller,
    offeredAmount,
    unitPrice,
    remainingAmount
  ] = await Promise.all([
    contract.seller(),
    contract.offeredAmount(),
    contract.unitPrice(),
    contract.remainingEnergy(account)
  ]);
  contracts[address] = {
    seller,
    offeredAmount,
    unitPrice,
    remainingAmount,
    address
  };
  if (seller === account && offeredAmount > 0) {
    sellerContractsSet.add(address);
  } else {
    sellerContractsSet.delete(address);
  }
  if (remainingAmount > 0) {
    buyerContractsSet.add(address);
  } else {
    buyerContractsSet.delete(address);
  }
  if (offeredAmount > 0) {
    availableContractsSet.add(address);
  } else {
    availableContractsSet.delete(address);
  }
}

async function getContractInfoByIndex(index) {
  const contractEntity = await EnergyMaster.contracts(index);
  const contractAddr = contractEntity[0];
  await getContractInfoByAddress(contractAddr);
}

async function updateMaster() {
  const count = await EnergyMaster.contractCount();
  const promises = [];
  for (let i = lastCount; i < count; i++) {
    promises.push(getContractInfoByIndex(i));
  }
  await Promise.all(promises);
  lastCount = count;
}

async function init() {
  // FIXME: Multiple inits
  if (inited) return;
  await updateMaster();
  lastBlock = await bonds.height;
  console.log("Blockchain synced");
  inited = true;
}

function isInited() {
  return inited;
}

function makeEnergyContract(address) {
  return bonds.makeContract(address, ENERGY_ABI);
}

async function myAccount() {
  return await bonds.me;
}

async function myContracts() {
  const sellerContracts = await mySellerContracts();
  const buyerContracts = await myBuyerContracts();
  return contracts;
  //return {sellerContracts, buyerContracts};
}

async function mySellerContracts() {
  if (!inited) return Promise.reject({ msg: "Blockchain unsynced" });
  return Object.keys(contracts)
    .filter((contractAddr) => sellerContractsSet.has(contractAddr))
    .map((contractAddr) => contracts[contractAddr]);
}

async function myBuyerContracts() {
  if (!inited) return Promise.reject({ msg: "Blockchain unsynced" });
  return Object.keys(contracts)
    .filter((contractAddr) => buyerContractsSet.has(contractAddr))
    .map((contractAddr) => contracts[contractAddr]);
}

async function availableContracts() {
  if (!inited) return Promise.reject({ msg: "Blockchain unsynced" });
  return Object.keys(contracts)
    .filter((contractAddr) => availableContractsSet.has(contractAddr))
    .map((contractAddr) => contracts[contractAddr]);
}

async function buyEnergy(contractAddress, amount) {
  if (!inited) return Promise.reject({ msg: "Blockchain unsynced" });
  if (!contractAddress || !amount) {
    return Promise.reject({ msg: "Wrong contact address or amount", value: amount });
  }

  const contract = makeEnergyContract(contractAddress);
  logs.push({
    action: "buy",
    amount: amount,
    contract: contractAddress
  });
  return await contract.buy(amount);
}

async function sellEnergy(price, amount) {
  if (!inited) return Promise.reject({ msg: "Blockchain unsynced" });
  if (!price || !amount) {
    return Promise.reject({ msg: "Unable to sell energy", value: amount, price: price});
  }

  recorder.record_sold_energy(amount);
  recorder.record_sell_price(price);

  logs.push({
    // FIXME: Log contract address
    // This is not available due to parity APIs unblocks
    // after tx is initiated instead of completed
    action: "sell",
    amount: amount,
  });
  return await EnergyMaster.sell(price, amount);
}


async function myEnergyBalance() {
  if (!inited) return Promise.reject({ msg: "Blockchain unsynced" });
  const contracts = await myBuyerContracts();
  let balance = new bigNumber(0);
  for (const contract of contracts) {
    balance = balance.add(contract.remainingAmount);
  }
  return balance;
}

async function updateBlock(blockNumber) {
  if (blockNumber < lastCount) return;
  const block = await bonds.findBlock(blockNumber);
  const txs = block.transactions;
  for (const tx of txs) {
    const txDetail = await bonds.transaction(tx);
    const to = txDetail.to;
    if (to === ENERGY_MASTER_ADDRESS) {
      console.log("Updating master");
      await updateMaster();
    } else if (contracts[to] !== undefined) {
      console.log(`Updating contract ${to}`);
      await getContractInfoByAddress(to);
    }
  }
  console.log(`Synced block ${blockNumber}`);
  lastBlock = blockNumber;
}

async function updateBlockchain(blockNumber) {
  if (!inited) return Promise.reject({ msg: "Blockchain unsynced" });
  for (let i = lastBlock + 1; i <= blockNumber; i++) {
    await updateBlock(i);
  }
}

init();

function log(msg) {
  logs.push(msg);
}

function getLog() {
  return logs.slice(-10);
}

module.exports = {
  makeEnergyContract,
  myAccount,
  myBuyerContracts,
  mySellerContracts,
  myContracts,
  myEnergyBalance,
  availableContracts,
  buyEnergy,
  sellEnergy,
  updateBlockchain,
  getLog,
  log,
  isInited,
};

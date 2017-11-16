const oo7parity = require('oo7-parity');
const bonds = oo7parity.bonds;
const ENERGY_MASTER_ABI = require('./abis/abi_master');
const ENERGY_ABI = require('./abis/abi');
const ENERGY_MASTER_ADDRESS = "0x520fF2C06fB1ee32eB9e4f1EedecB985869769Ab";
const bigNumber = require('bignumber.js');

const EnergyMaster = bonds.makeContract(ENERGY_MASTER_ADDRESS, ENERGY_MASTER_ABI);

function makeEnergyContract(address) {
  return bonds.makeContract(address, ENERGY_ABI);
}

async function myAccount() {
  return await bonds.me;
}

async function myContracts() {
  const sellerContracts = await mySellerContracts();
  const buyerContracts = await myBuyerContracts();
  return {sellerContracts, buyerContracts};
}

async function mySellerContracts() {
  const account = await myAccount();
  const count = await EnergyMaster.contractCount();
  const contracts = [];
  for (let i = 0; i < count; i++) {
    const contractEntity = await EnergyMaster.contracts(i);
    const contractAddr = contractEntity[0];
    const contract = makeEnergyContract(contractAddr);
    const seller = await contract.seller();
    if (seller === account) {
      const offeredAmount = await contract.offeredAmount();
      const unitPrice = await contract.unitPrice();
      contracts.push({contractAddr, unitPrice, offeredAmount})
    }
  }
  return contracts;
}

async function myBuyerContracts() {
  const account = await myAccount();
  const count = await EnergyMaster.contractCount();
  const contracts = [];
  for (let i = 0; i < count; i++) {
    const contractEntity = await EnergyMaster.contracts(i);
    const contractAddr = contractEntity[0];
    const contract = makeEnergyContract(contractAddr);
    const remainingAmount = await contract.remainingEnergy(account);
    if (remainingAmount.greaterThan(0)) {
      const unitPrice = await contract.unitPrice();
      contracts.push({contractAddr, unitPrice, remainingAmount})
    }
  }
  return contracts;
}

async function availableContracts() {
  const count = await EnergyMaster.contractCount();
  const contracts = [];
  for (let i = 0; i < count; i++) {
    const contractEntity = await EnergyMaster.contracts(i);
    const contractAddr = contractEntity[0];
    const deregistered = contractEntity[2];
    if (!deregistered) {
      const contract = makeEnergyContract(contractAddr);
      const offeredAmount = await contract.offeredAmount();
      const unitPrice = await contract.unitPrice();
      contracts.push({contractAddr, unitPrice, offeredAmount})
    }
  }
  return contracts;
}

async function buyEnergy(contractAddress, amount) {
  if (!contractAddress || !amount) throw new Error();
  const contract = makeEnergyContract(contractAddress);
  return await contract.buy(amount);
}

async function sellEnergy(price, amount) {
  if (!price || !amount) throw new Error();
  return await EnergyMaster.sell(price, amount);
}

async function consumeEnergyFromContract(contractAddress, amount) {
  const contract = makeEnergyContract(contractAddress);
  const price = await contract.unitPrice();
  const cost = price.mul(amount);
  return await contract.consume(amount, {value: cost})
}

async function consumeEnergy(amount) {
  const contracts = await myBuyerContracts();
  if (amount < 0) throw new Error("negative amount");
  let toConsume = amount;
  // cheapest first
  contracts.sort((a, b) => {
    return a.unitPrice - b.unitPrice;
  });
  let txs = [];
  for (const contract of contracts) {
    if (toConsume === 0) break;
    const deduction = Math.min(toConsume, contract.remainingAmount);
    try {
      txs.push({ contractAddr: contract.contractAddr, amount: deduction});
      toConsume -= deduction;
    } catch (e) {
      // ignore
    }
  }
  if (toConsume > 0) throw new Error("Insufficient energy balance");
  const promises = txs.map((tx) => consumeEnergyFromContract(tx.contractAddr, tx.amount));
  return Promise.all(promises)
}

async function myEnergyBalance() {
  const contracts = await myBuyerContracts();
  let balance = new bigNumber(0);
  for (const contract of contracts) {
    balance = balance.add(contract.remainingAmount);
  }
  return balance;

}

module.exports = {
  myAccount,
  myBuyerContracts,
  mySellerContracts,
  myContracts,
  myEnergyBalance,
  availableContracts,
  buyEnergy,
  sellEnergy,
  consumeEnergy
};

const oo7parity = require('oo7-parity');
const bonds = oo7parity.bonds;
const ENERGY_MASTER_ABI = require('./abis/abi_master');
const ENERGY_ABI = require('./abis/abi');
const ENERGY_MASTER_ADDRESS = "0x3507Ff52cB28F3eCB32A8ee0b0B00618D2E3dD02";

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

async function consumeEnergy(contractAddress, amount) {
  const contract = makeEnergyContract(contractAddress);
  const price = await contract.unitPrice();
  const cost = price.mul(amount);
  return await contract.consume(amount, {value: cost})
}

module.exports = {
  myAccount,
  myBuyerContracts,
  mySellerContracts,
  myContracts,
  availableContracts,
  buyEnergy,
  sellEnergy,
  consumeEnergy
};

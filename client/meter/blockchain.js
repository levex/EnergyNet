const oo7parity = require('oo7-parity');
const bonds = oo7parity.bonds;
const ENERGY_MASTER_ABI = require('./abis/abi_master');
const ENERGY_ABI = require('./abis/abi');
const ENERGY_MASTER_ADDRESS = "0x7B7DC4FdB4eAf8168FBC73a9b67f15bB559c87cC";
const bigNumber = require('bignumber.js');

const EnergyMaster = bonds.makeContract(ENERGY_MASTER_ADDRESS, ENERGY_MASTER_ABI);

function send_energy_metric(name, amount) {
  fetch('http://localhost:8086/write?db=energy', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: name + ' amount=' + amount,
  });
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
  return {sellerContracts, buyerContracts};
}

async function mySellerContracts() {
  const account = await myAccount();
  const count = await EnergyMaster.contractCount();
  const contracts = [];
  const getInfo = async (index) => {
    const contractEntity = await EnergyMaster.contracts(index);
    const contractAddr = contractEntity[0];
    const contract = makeEnergyContract(contractAddr);
    const [seller, offeredAmount, unitPrice] = await Promise.all([contract.seller(), contract.offeredAmount(), contract.unitPrice()]);
    if (seller === account) {
      if (offeredAmount == 0) return;
      contracts.push({contractAddr, unitPrice, offeredAmount})
    }
  };
  const promises = [];
  for (let i = 0; i < count; i++) {
    promises.push(getInfo(i));
  }
  await Promise.all(promises);
  return contracts;
}

async function myBuyerContracts() {
  const account = await myAccount();
  const count = await EnergyMaster.contractCount();
  const contracts = [];
  const getInfo = async (index) => {
    const contractEntity = await EnergyMaster.contracts(index);
    const contractAddr = contractEntity[0];
    const contract = makeEnergyContract(contractAddr);
    const [remainingAmount, unitPrice] = await Promise.all([contract.remainingEnergy(account), contract.unitPrice()]);
    if (remainingAmount.greaterThan(0)) {
      contracts.push({contractAddr, unitPrice, remainingAmount})
    }
  };
  const promises = [];
  for (let i = 0; i < count; i++) {
    promises.push(getInfo(i));
  }
  await Promise.all(promises);
  return contracts;
}


async function availableContracts() {
  const count = await EnergyMaster.contractCount();
  const contracts = [];
  const getInfo = async (index) => {
    const contractEntity = await EnergyMaster.contracts(index);
    const contractAddr = contractEntity[0];
    const deregistered = contractEntity[2];
    const contract = makeEnergyContract(contractAddr);
    const [offeredAmount, unitPrice] = await Promise.all([contract.offeredAmount(), contract.unitPrice()]);
    if (!deregistered) {
      const contract = makeEnergyContract(contractAddr);
      contracts.push({contractAddr, unitPrice, offeredAmount})
    }
  };
  const promises = [];
  for (let i = 0; i < count; i++) {
    promises.push(getInfo(i));
  }
  await Promise.all(promises);
  return contracts;
}

async function buyEnergy(contractAddress, amount) {
  if (!contractAddress || !amount) {
    return Promise.reject({ msg: "Wrong contact address or amount", value: amount });
  }

  send_energy_metric('energy_bought', amount);
  const contract = makeEnergyContract(contractAddress);
  return await contract.buy(amount);
}

async function sellEnergy(price, amount) {
  if (!price || !amount) {
    return Promise.reject({ msg: "Unable to sell energy", value: amount, price: price});
  }

  send_energy_metric('energy_sold', amount);

  return await EnergyMaster.sell(price, amount);
}

async function consumeEnergyFromContract(contractAddress, amount) {
  const contract = makeEnergyContract(contractAddress);
  const price = await contract.unitPrice();
  const cost = price.mul(amount);
  send_energy_metric('energy_consumed', amount);
  return await contract.consume(amount, {value: cost})
}

async function consumeEnergy(amount) {
  if (amount < 0) {
    return Promise.reject({ msg: "negative amount", value: amount });
  }

  let energyBalance = await myEnergyBalance();
  if (energyBalance < amount) {
    try {
      await autoBuy(amount - energyBalance);

      let count = 0;
      while (energyBalance < amount) {
        energyBalance = await myEnergyBalance();
        count++;
        if (count == 30) {
          return Promise.reject({ msg: "failed to autoBuy", value: amount });
        }
      }
    } catch(e) {
      return Promise.reject(e);
    }
  }

  const contracts = await myBuyerContracts();
  let toConsume = amount;
  // cheapest first
  contracts.sort((a, b) => {
    return a.unitPrice - b.unitPrice;
  });

  let txs = [];
  for (const contract of contracts) {
    if (toConsume === 0) break;
    const deduction = Math.min(toConsume, contract.remainingAmount);
    txs.push({ contractAddr: contract.contractAddr, amount: deduction});
    toConsume -= deduction;
  }

  if (toConsume > 0) {
    return Promise.reject({ msg: "Unable to consume energy", value: toConsume });
  }

  const promises = txs.map((tx) => consumeEnergyFromContract(tx.contractAddr, tx.amount));
  return Promise.all(promises);
}

async function myEnergyBalance() {
  const contracts = await myBuyerContracts();
  let balance = new bigNumber(0);
  for (const contract of contracts) {
    balance = balance.add(contract.remainingAmount);
  }
  return balance;
}

async function autoBuy(amount) {
  if (!amount || amount < 0) {
    return Promise.reject({ msg: "Invalid amount", value: amount });
  }

  const contracts = await availableContracts();
  let toBuy = amount;
  // cheapest first
  contracts.sort((a, b) => {
    return a.unitPrice - b.unitPrice;
  });
  let txs = [];
  for (const contract of contracts) {
    if (toBuy === 0) break;
    const deduction = Math.min(toBuy, contract.offeredAmount);
    txs.push({ contractAddr: contract.contractAddr, amount: deduction});
    toBuy -= deduction;
  }

  if (toBuy > 0) {
    return Promise.reject({ msg: "Insufficient energy over network", value: toBuy });
  }

  const promises = txs.map((tx) => buyEnergy(tx.contractAddr, tx.amount));
  return Promise.all(promises)
}

module.exports = {
  send_energy_metric,
  myAccount,
  myBuyerContracts,
  mySellerContracts,
  myContracts,
  myEnergyBalance,
  availableContracts,
  buyEnergy,
  sellEnergy,
  consumeEnergy,
  autoBuy
};

const oo7parity = require('oo7-parity');
const bonds = oo7parity.bonds;
const ENERGY_MASTER_ABI = require('./abis/abi_master');
const ENERGY_ABI = require('./abis/abi');
const ENERGY_MASTER_ADDRESS = "0x520fF2C06fB1ee32eB9e4f1EedecB985869769Ab";
const bigNumber = require('bignumber.js');
const paginate = require('express-paginate');

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
      if (offeredAmount == 0)
        continue;
      const unitPrice = await contract.unitPrice();
      contracts.push({contractAddr: contractAddr, unitPrice: unitPrice, offeredAmount: offeredAmount})
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
      contracts.push({contractAddr: contractAddr, unitPrice: unitPrice, remainingAmount: remainingAmount})
    }
  }
  return contracts;
}

async function availableContracts(req, res) {
  const count = await EnergyMaster.contractCount()
  const contracts = []

  for (let i = req.offset; i < Math.min(req.offset + req.query.limit, count); i++) {
    const contractEntity = await EnergyMaster.contracts(i)
    const contractAddr = contractEntity[0]
    const deregistered = contractEntity[2]

    if (!deregistered) {
      const contract = makeEnergyContract(contractAddr)
      const offeredAmount = await contract.offeredAmount()
      const unitPrice = await contract.unitPrice()

      contracts.push({contractAddr: contractAddr, unitPrice: unitPrice, offeredAmount: offeredAmount})
    } else {
      // We always want to return req.limit items, so we increase the conditional of the loop
      // if this contract is deregistered
      req.offset++
    }
  }

  pageCount = Math.ceil(count / req.query.limit)

  return {
    pages: paginate.getArrayPages(req)(9, pageCount, req.query.page),
    has_more: paginate.hasNextPages(req)(pageCount),
    data: contracts
  };
}

async function buyEnergy(contractAddress, amount) {
  if (!contractAddress || !amount) {
    return Promise.reject({msg: "Wrong contact address or amount", value: amount});
  }

  const contract = makeEnergyContract(contractAddress);
  return await contract.buy(amount);
}

async function sellEnergy(price, amount) {
  if (!price || !amount) {
    return Promise.reject({msg: "Unable to sell energy", value: amount, price: price});
  }

  return await EnergyMaster.sell(price, amount);
}

async function consumeEnergyFromContract(contractAddress, amount) {
  const contract = makeEnergyContract(contractAddress);
  const price = await contract.unitPrice();
  const cost = price.mul(amount);
  return await contract.consume(amount, {value: cost})
}

async function consumeEnergy(amount) {
  if (amount < 0) {
    return Promise.reject({msg: "negative amount", value: amount});
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
          return Promise.reject({msg: "failed to autoBuy", value: amount});
        }
      }
    } catch (e) {
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
    if (toConsume === 0)
      break;
    const deduction = Math.min(toConsume, contract.remainingAmount);
    txs.push({contractAddr: contract.contractAddr, amount: deduction});
    toConsume -= deduction;
  }

  if (toConsume > 0) {
    return Promise.reject({msg: "Unable to consume energy", value: toConsume});
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
    return Promise.reject({msg: "Invalid amount", value: amount});
  }

  const contracts = await availableContracts();
  let toBuy = amount;
  // cheapest first
  contracts.sort((a, b) => {
    return a.unitPrice - b.unitPrice;
  });
  let txs = [];
  for (const contract of contracts) {
    if (toBuy === 0)
      break;
    const deduction = Math.min(toBuy, contract.offeredAmount);
    txs.push({contractAddr: contract.contractAddr, amount: deduction});
    toBuy -= deduction;
  }

  if (toBuy > 0) {
    return Promise.reject({msg: "Insufficient energy over network", value: toBuy});
  }

  const promises = txs.map((tx) => buyEnergy(tx.contractAddr, tx.amount));
  return Promise.all(promises)
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
  consumeEnergy,
  autoBuy
};

const blockchain = require("./blockchain");
const recorder = require("./recorder");
const buy = require("./buy");

const PROCESS_INTERVAL = 10000;
const PREBUY_COEF = 2;
const consumeRequests = [];

async function consumeEnergyFromContract(contractAddress, amount) {
  if (!blockchain.isInited()) return Promise.reject({ msg: "Blockchain unsynced" });
  const contract = blockchain.makeEnergyContract(contractAddress);
  const price = await contract.unitPrice();
  const cost = price.mul(amount);
  blockchain.log({
    action: "consume",
    amount: amount,
    contract: contractAddress
  });
  return await contract.consume(amount, {value: cost});
}

function consumeEnergy(amount) {
  if (!blockchain.isInited() || amount < 0) return false;

  consumeRequests.push(amount);
  return true;
}

function processConsumption() {
  if (consumeRequests.length === 0) {
    return;
  }

  amount = consumeRequests.reduce((acc, x) => acc + x);
  consumeRequests.length = 0;
  if (amount > 0) {
    recorder.record_consumed_energy(amount);
    consumeEnergyFromChain(amount).catch();
  }
}

async function consumeEnergyFromChain(amount) {
  let energyBalance = await blockchain.myEnergyBalance();
  if (energyBalance < amount) {
    try {
      buyAmount = (amount - energyBalance) * PREBUY_COEF;
      await buy.autoBuy(buyAmount);

      let count = 0;
      while (energyBalance < amount) {
        energyBalance = await blockchain.myEnergyBalance();
        count++;
        if (count == 30) {
          return Promise.reject({ msg: "failed to autoBuy", value: amount });
        }
      }
    } catch(e) {
      return Promise.reject(e);
    }
  }

  const contracts = await blockchain.myBuyerContracts();
  let toConsume = amount;
  // cheapest first
  contracts.sort((a, b) => {
    return a.unitPrice - b.unitPrice;
  });

  let txs = [];
  for (const contract of contracts) {
    if (toConsume === 0) break;
    const deduction = Math.min(toConsume, contract.remainingAmount);
    txs.push({ address: contract.address, amount: deduction});
    toConsume -= deduction;
  }

  if (toConsume > 0) {
    return Promise.reject({ msg: "Unable to consume energy", value: toConsume });
  }

  const promises = txs.map((tx) => consumeEnergyFromContract(tx.address, tx.amount));
  return Promise.all(promises);
}

// Every PROCESS_INTERVAL record the consumption in the blockchain and update the contracts
setInterval(processConsumption, PROCESS_INTERVAL);

module.exports = {
  consumeEnergy,
}
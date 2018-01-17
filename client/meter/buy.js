const blockchain = require("./blockchain");
const recorder = require("./recorder");
const BigNumber = require("bignumber.js");
const consume = require("./consume");

const BUY_INTERVAL = 10000;

let autoBuyAmount = new BigNumber(0);

async function actuallyAutoBuy() {
  if (autoBuyAmount.lte(0)) {
    autoBuyAmount = new BigNumber(0);
    return;
  }
  const contracts = await blockchain.availableContracts();
  let toBuy = autoBuyAmount;
  // cheapest first
  contracts.sort((a, b) => {
    if (consume.getRenewables()) {
      if (a.renewable) {
        return -1;
      } else if (b.renewable) {
        return 1
      }
    }

    return a.unitPrice - b.unitPrice;
  });
  let txs = [];
  for (const contract of contracts) {
    if (toBuy.eq(0)) break;
    const deduction = BigNumber.min(toBuy, contract.offeredAmount);
    txs.push({ address: contract.address, amount: deduction});
    toBuy = toBuy.sub(deduction);
    recorder.record_buy_price(contract.unitPrice.toString());
  }

  if (toBuy > 0) {
    console.log({ msg: "Insufficient energy over network", value: toBuy });
    return;
  }

  const promises = txs.map((tx) => blockchain.buyEnergy(tx.address, tx.amount).then(() => autoBuyAmount = autoBuyAmount.sub(tx.amount)).catch(console.log));
  Promise.all(promises).catch(console.log);
}

async function autoBuy(amount) {
  if (!blockchain.isInited()) return Promise.reject({ msg: "Blockchain unsynced" });
  if (!amount || amount < 0) {
    return Promise.reject({ msg: "Invalid amount", value: amount });
  }
  let amountBigNumber = new BigNumber(amount);
  autoBuyAmount = autoBuyAmount.add(amountBigNumber);
}

setInterval(actuallyAutoBuy, BUY_INTERVAL);

module.exports = {
  autoBuy,
};

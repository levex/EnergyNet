const blockchain = require("./blockchain");
const recorder = require("./recorder");

async function autoBuy(amount) {
  if (!blockchain.isInited()) return Promise.reject({ msg: "Blockchain unsynced" });
  if (!amount || amount < 0) {
    return Promise.reject({ msg: "Invalid amount", value: amount });
  }

  const contracts = await blockchain.availableContracts();
  let toBuy = amount;
  // cheapest first
  contracts.sort((a, b) => {
    return a.unitPrice - b.unitPrice;
  });
  let txs = [];
  for (const contract of contracts) {
    if (toBuy === 0) break;
    const deduction = Math.min(toBuy, contract.offeredAmount);
    txs.push({ address: contract.address, amount: deduction});
    toBuy -= deduction;
    recorder.record_buy_price(contract.unitPrice);
  }

  if (toBuy > 0) {
    return Promise.reject({ msg: "Insufficient energy over network", value: toBuy });
  }

  const promises = txs.map((tx) => blockchain.buyEnergy(tx.address, tx.amount));
  return Promise.all(promises);
}

module.exports = {
  autoBuy,
}

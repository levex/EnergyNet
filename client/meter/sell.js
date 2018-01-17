const blockchain = require("./blockchain");
const BigNumber = require("bignumber.js");
const recorder = require("./recorder");

const PROCESS_INTERVAL = 10000;
const sellRequests = [];
let price = 1;
let renewable = false;

function setPrice(newPrice) {
  price = newPrice;
}

function setRenewable(isRenevable) {
  renewable = isRenevable;
}

function sellEnergy(amount) {
  if (!blockchain.isInited() || amount < 0) return false;

  sellRequests.push(amount);
  return true;
}

function processProdution() {
  if (sellRequests.length === 0) {
    recorder.record_sold_energy(0);
    return;
  }

  const amount = sellRequests.reduce((acc, x) => acc.add(x), new BigNumber(0));
  sellRequests.length = 0;
  if (amount > 0) {
    blockchain.sellEnergy(price, amount, renewable).catch();
  }
}

// Every PROCESS_INTERVAL record the production in the blockchain and update the contracts
setInterval(processProdution, PROCESS_INTERVAL);

module.exports = {
  sellEnergy,
  setPrice,
  setRenewable,
};

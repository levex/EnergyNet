const blockchain = require("./blockchain");

const PROCESS_INTERVAL = 10000;
const sellRequests = [];
let price = 1;

function setPrice(price) {
  this.price = price;
}

function sellEnergy(amount) {
  if (!blockchain.isInited() || amount < 0) return false;

  sellRequests.push(amount);
  return true;
}

function processProdution() {
  if (sellRequests.length === 0) {
    return;
  }

  amount = sellRequests.reduce((acc, x) => acc + x);
  sellRequests.length = 0;
  if (amount > 0) {
    blockchain.sellEnergy(price, amount).catch();
  }
}

// Every PROCESS_INTERVAL record the production in the blockchain and update the contracts
setInterval(processProdution, PROCESS_INTERVAL);

module.exports = {
  sellEnergy,
  setPrice,
}

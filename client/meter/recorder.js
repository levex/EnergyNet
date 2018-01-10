let config = require("./config.json");

function record_sold_energy(amount) {
  send_energy_metric("energy_sold", amount);
}

function record_consumed_energy(amount) {
  send_energy_metric("energy_consumed", amount);
}

function record_buy_price(price) {
  send_energy_metric("buy_price", price);
}

function record_sell_price(price) {
  send_energy_metric("sell_price", price);
}

function send_energy_metric(name, amount) {
  const location = config.location;
  fetch(config.influxUrl, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: location + name + " amount=" + amount,
  });
}

function change_location(location) {
  config.location = location;
}

module.exports = {
  record_buy_price,
  record_sell_price,
  record_consumed_energy,
  record_sold_energy,
  change_location,
};

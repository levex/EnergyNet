const Master = artifacts.require('./Master.sol');

var accounts;
web3.eth.getAccounts(function(err,res) { accounts = res; });

module.exports = (deployer) => {
  deployer.deploy(Master);
};

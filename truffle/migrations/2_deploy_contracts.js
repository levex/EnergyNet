const ConvertLib = artifacts.require("./ConvertLib.sol");
const MetaCoin = artifacts.require("./MetaCoin.sol");
const Master = artifacts.require('./Master.sol');

var accounts;
web3.eth.getAccounts(function(err,res) { accounts = res; });

module.exports = (deployer) => {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(Master);
};

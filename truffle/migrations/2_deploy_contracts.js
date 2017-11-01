const ConvertLib = artifacts.require("./ConvertLib.sol");
const MetaCoin = artifacts.require("./MetaCoin.sol");
const EnergyMaster = artifacts.require('./EnergyMaster.sol');

var accounts;
web3.eth.getAccounts(function(err,res) { accounts = res; });

module.exports = (deployer) => {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(EnergyMaster);
};

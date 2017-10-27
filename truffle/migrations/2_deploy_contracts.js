const ConvertLib = artifacts.require("./ConvertLib.sol");
const MetaCoin = artifacts.require("./MetaCoin.sol");
const EnergyMaster = artifacts.require('./EnergyMaster.sol');
const Energy = artifacts.require('./Energy.sol');

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(EnergyMaster);
  deployer.deploy(Energy, EnergyMaster.address, 0x42, 2);
};

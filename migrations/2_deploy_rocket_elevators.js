var RocketToken = artifacts.require("RocketToken");

module.exports = function(deployer) {
  // Deploy the Migrations contract as our only task
  deployer.deploy(RocketToken);
};

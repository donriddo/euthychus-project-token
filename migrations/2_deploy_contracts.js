var EPT = artifacts.require("EPT");

module.exports = function (deployer) {
  deployer.deploy(EPT, 21000000000000); // 21 trillion tokens
};

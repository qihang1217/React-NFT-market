const Migrations = artifacts.require("OwnedEverythings");

module.exports = function (deployer) {
    deployer.deploy(Migrations);
};

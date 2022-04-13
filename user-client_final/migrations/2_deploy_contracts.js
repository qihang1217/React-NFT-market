const OwnedEverythings = artifacts.require("OwnedEverythings");

module.exports = async function (deployer) {
	await deployer.deploy(OwnedEverythings);
};

const hre = require("hardhat");

const main = async () => {
	const Transactions = await hre.ethers.getContractFactory("Transactions");
	const transactions = await Transactions.deploy();

	await transactions.deployed();

	console.log("Transactions deployed to: ", transactions.address);
	// const currentTimestampInSeconds = Math.round(Date.now() / 1000);
	// const unlockTime = currentTimestampInSeconds + 60;

	// const lockedAmount = hre.ethers.utils.parseEther("0.001");

	// const lock = await hre.ethers.deployContract("Transactions", [unlockTime], {
	// 	value: lockedAmount,
	// });

	// await lock.waitForDeployment();

	// console.log(
	// 	`Lock with ${ethers.formatEther(
	// 		lockedAmount
	// 	)}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
	// );
};

const runmain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

runmain();

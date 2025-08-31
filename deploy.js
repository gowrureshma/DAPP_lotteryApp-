const hre = require("hardhat");

async function main() {
  // Get the ContractFactory for Mdlottery
  const Mdlottery = await hre.ethers.getContractFactory("Mdlottery");

  // Deploy the Mdlottery contract
  // Note: Your Mdlottery contract's constructor does not take any arguments,
  // so we call deploy() without arguments.
  const mdlottery = await Mdlottery.deploy();

  // Wait for the contract to be deployed
  await mdlottery.waitForDeployment();

  console.log(`Mdlottery deployed to ${mdlottery.target}`);
  console.log(`Manager: ${await mdlottery.manager()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
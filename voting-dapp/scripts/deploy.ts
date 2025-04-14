import { ethers } from "hardhat";

async function main() {
  const VotingFactory = await ethers.getContractFactory("VotingFactory");
  const factory = await VotingFactory.deploy();

  // ethers v6 fix
  await factory.waitForDeployment();

  console.log("VotingFactory deployed to:", await factory.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

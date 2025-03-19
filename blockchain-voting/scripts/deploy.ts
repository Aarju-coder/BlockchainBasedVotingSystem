import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contract...");

  // Get the first signer (account) from Hardhat
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contract with the account: ${deployer.address}`);

  // Get the contract factory
  const ContractFactory = await ethers.getContractFactory("Election");
  
  // Deploy the contract properly
  const contract = await ContractFactory.deploy();

  // Wait for deployment to finish
  await contract.waitForDeployment();

  console.log(`Contract deployed to: ${await contract.getAddress()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

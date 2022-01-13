// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { SetLastDeployedContractAddress } from "./utils";

async function main() {
  const signers = await ethers.getSigners();

  const SlotMachine = await ethers.getContractFactory(
    "SlotMachine",
    signers[signers.length - 1]
  );
  const slotMachine = await SlotMachine.deploy();

  await slotMachine.deployed();

  console.log("Contract deployed.");
  console.log(`from: ${slotMachine.deployTransaction.from}`);
  console.log(`to: ${slotMachine.address}`);
  SetLastDeployedContractAddress(slotMachine.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

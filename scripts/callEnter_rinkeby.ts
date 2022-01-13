/* eslint-disable node/no-missing-import */
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
// eslint-disable-next-line camelcase
import { SlotMachine } from "../typechain";
import { GetLastDeployedContractAddress } from "./utils";

async function main() {
  const account = (await ethers.getSigners())[1];
  const contractAddress = GetLastDeployedContractAddress();
  const SlotMachine = await ethers.getContractFactory("SlotMachine");
  const slotMachine = await SlotMachine.attach(contractAddress);

  await enterValue(slotMachine, account, "0.1");
}

async function enterValue(
  slotMachine: SlotMachine,
  account: SignerWithAddress,
  value: string
) {
  const slotMachineInstance = slotMachine.connect(account);

  const tx = await slotMachineInstance.play({
    value: ethers.utils.parseEther(value),
  });
  await tx.wait(1);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

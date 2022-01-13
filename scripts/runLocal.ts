/* eslint-disable node/no-missing-import */
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
// eslint-disable-next-line camelcase
import { SlotMachine } from "../typechain";
import { GetLastDeployedContractAddress } from "./utils";

// const CONTRACT_ADDRESS = "0x73511669fd4dE447feD18BB79bAFeAC93aB7F31f";
const ENTRANCE_VALUE = "0.1";

interface PlayersMap {
  [address: string]: {
    count: number;
    startBalance: BigNumber;
  };
}

async function main() {
  const contractAddress = GetLastDeployedContractAddress();
  const SlotMachine = await ethers.getContractFactory("SlotMachine");
  const slotMachine = await SlotMachine.attach(contractAddress);

  const players: PlayersMap = {};
  const accounts = await ethers.getSigners();
  const startJackpot = await slotMachine.getPrizeValue();
  const winnerAccount = await asyncEnterValue(
    slotMachine,
    ENTRANCE_VALUE,
    0,
    startJackpot,
    accounts,
    players
  );

  console.log();
  console.log("************ A Winner Found! ************");
  console.log(
    `Starting Jackpot Value: ${ethers.utils.formatEther(startJackpot)}eth`
  );
  const endJackpot = await slotMachine.getPrizeValue();
  console.log(`End Jackpot Value: ${ethers.utils.formatEther(endJackpot)}eth`);

  const ownerBalance = await ethers.provider.getBalance(
    accounts[accounts.length - 1].address
  );
  const winnerBalance = await ethers.provider.getBalance(winnerAccount.address);
  console.log();
  console.log(`Winner played ${players[winnerAccount.address].count} times.`);
  console.log(
    `Winner starting balance: ${ethers.utils.formatEther(
      players[winnerAccount.address].startBalance
    )}`
  );
  console.log(`Winner end balance: ${ethers.utils.formatEther(winnerBalance)}`);
  console.log(`Owner balance: ${ethers.utils.formatEther(ownerBalance)}`);
}

async function asyncEnterValue(
  slotMachine: SlotMachine,
  value: string,
  count: number,
  lastJackpot: BigNumber,
  accounts: SignerWithAddress[],
  players: PlayersMap
): Promise<SignerWithAddress> {
  console.log(`Count: ${++count}`);

  const accountId = Math.floor(Math.random() * (accounts.length - 2));
  const account = accounts[accountId];
  if (players[account.address]) {
    players[account.address].count += 1;
  } else {
    const startBalance = await ethers.provider.getBalance(account.address);
    players[account.address] = {
      count: 0,
      startBalance,
    };
  }

  await enterValue(slotMachine, account, value);

  const newJackpot = await slotMachine.getPrizeValue();
  console.log(`Current Jackpot: ${ethers.utils.formatEther(newJackpot)}`);

  if (newJackpot.gt(lastJackpot) || newJackpot.eq(lastJackpot)) {
    return await asyncEnterValue(
      slotMachine,
      value,
      count,
      newJackpot,
      accounts,
      players
    );
  } else {
    return account;
  }
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

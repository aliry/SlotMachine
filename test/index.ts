import { expect } from "chai";
import { ethers } from "hardhat";

describe("Slot Machine", function () {
  it("Should increase the prize when played.", async () => {
    const entranceFee = 0.1;
    const expectedPrize = ((entranceFee * 0.8) / 2).toFixed(2);

    const SlotMachine = await ethers.getContractFactory("SlotMachine");
    const slotMachine = await SlotMachine.deploy();
    await slotMachine.deployed();

    expect(await slotMachine.getPrizeValue()).to.equal(0);

    await slotMachine.play({
      value: ethers.utils.parseEther(entranceFee.toString()),
    });
    console.log("Prize: ", await slotMachine.getPrizeValue());
    const prize = await slotMachine.getPrizeValue();
    expect(ethers.utils.formatUnits(prize)).to.equal(expectedPrize.toString());
  });
});

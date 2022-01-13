//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract SlotMachine {
    address owner;
    uint256 constant minEntrance = 10**17;
    uint256 constant entranceFee = 2*minEntrance/10;
    uint16 constant prizeRatio = 2;
    uint16 constant winnerOdds = 1000;

    constructor(){
        owner = msg.sender;
    }

    function play() public payable {
        // require(msg.sender != owner, "Owner cannot play!");
        require(msg.value >= minEntrance, "Value should be (0.1 ETH) or higher!");

        // Transfer 0.05wei fee
        payable(owner).transfer(entranceFee);

        // Check if sender is a winner
        uint ts = block.timestamp;
        uint reminder = ts % winnerOdds;
        bool isWinner = reminder == 0;
        console.log("Block timestamp:", ts);
        console.log("Reminder:", reminder);
        if (isWinner) {
            payable(msg.sender).transfer(address(this).balance / prizeRatio);
            console.log("winner is:", msg.sender);
        }
    }

    function getPrizeValue() public view returns(uint){
        return address(this).balance / prizeRatio;
    }
}
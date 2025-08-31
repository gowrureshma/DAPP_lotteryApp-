const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Mdlottery", function () {
    let Mdlottery;
    let mdlottery;
    let owner;
    let addr1;
    let addr2;
    let addr3;
    let addrs;

    // Deploy the contract before each test
    beforeEach(async function () {
        [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
        Mdlottery = await ethers.getContractFactory("Mdlottery");
        mdlottery = await Mdlottery.deploy();
        await mdlottery.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the right manager", async function () {
            expect(await mdlottery.manager()).to.equal(owner.address);
        });

        it("Should have an initial empty players array", async function () {
            // Using getPlayers() from the contract
            expect((await mdlottery.getPlayers()).length).to.equal(0);
        });

        it("Should have an initial balance of 0", async function () {
            expect(await mdlottery.getContractBalance()).to.equal(0);
        });
    });

    describe("Participation", function () {
        it("Should allow players to participate with more than 1 Ether", async function () {
            const entryAmount = ethers.parseEther("1.5"); // 1.5 Ether
            // Using the participate() function to send value
            await expect(mdlottery.connect(addr1).participate({ value: entryAmount }))
                .to.emit(mdlottery, "PlayerParticipated")
                .withArgs(addr1.address, entryAmount);

            expect((await mdlottery.getPlayers()).length).to.equal(1);
            expect(await mdlottery.getPlayers()).to.include(addr1.address);
            expect(await mdlottery.getContractBalance()).to.equal(entryAmount);
        });

        it("Should revert if player sends less than or equal to 1 Ether", async function () {
            const entryAmount = ethers.parseEther("1"); // Exactly 1 Ether
            await expect(mdlottery.connect(addr1).participate({ value: entryAmount }))
                .to.be.revertedWith("Mdlottery: Please pay a value greater than 1 Ether");

            const entryAmountTooLow = ethers.parseEther("0.5"); // 0.5 Ether
            await expect(mdlottery.connect(addr2).participate({ value: entryAmountTooLow }))
                .to.be.revertedWith("Mdlottery: Please pay a value greater than 1 Ether");
        });

        it("Should allow multiple players to participate", async function () {
            const entryAmount = ethers.parseEther("2");
            await mdlottery.connect(addr1).participate({ value: entryAmount });
            await mdlottery.connect(addr2).participate({ value: entryAmount });
            await mdlottery.connect(addr3).participate({ value: entryAmount });


            expect((await mdlottery.getPlayers()).length).to.equal(3);
            expect(await mdlottery.getPlayers()).to.include(addr1.address);
            expect(await mdlottery.getPlayers()).to.include(addr2.address);
            expect(await mdlottery.getPlayers()).to.include(addr3.address);
            expect(await mdlottery.getContractBalance()).to.equal(ethers.parseEther("6"));
        });
    });

    describe("Pick Winner", function () {
        beforeEach(async function () {
            // Ensure at least 3 players for pickWinner to work
            await mdlottery.connect(addr1).participate({ value: ethers.parseEther("2") });
            await mdlottery.connect(addr2).participate({ value: ethers.parseEther("2") });
            await mdlottery.connect(addr3).participate({ value: ethers.parseEther("2") });
        });

        it("Should only allow the manager to pick a winner", async function () {
            await expect(mdlottery.connect(addr1).pickWinner())
                .to.be.revertedWith("Mdlottery: You are not the manager");
        });

        it("Should revert if there are less than 3 players", async function () {
            // Deploy a fresh contract to ensure less than 3 players
            const newMdlottery = await Mdlottery.deploy();
            await newMdlottery.waitForDeployment();

            await newMdlottery.connect(addr1).participate({ value: ethers.parseEther("2") });
            await newMdlottery.connect(addr2).participate({ value: ethers.parseEther("2") });

            expect((await newMdlottery.getPlayers()).length).to.equal(2);

            await expect(newMdlottery.connect(owner).pickWinner())
                .to.be.revertedWith("Mdlottery: Requires at least 3 players to pick a winner");
        });

        it("Should pick a winner, transfer funds, and reset the lottery", async function () {
            const initialContractBalance = await mdlottery.getContractBalance(); // Should be 6 ETH
            let winnerAddress;
            let winnerBalanceBefore;

            // Get initial balances of all players to check after winner is picked
            const playerBalancesBefore = new Map();
            for (const player of [addr1, addr2, addr3]) {
                playerBalancesBefore.set(player.address, await ethers.provider.getBalance(player.address));
            }

            const tx = await mdlottery.connect(owner).pickWinner();
            const receipt = await tx.wait();

            // Extract WinnerPicked event to get the winner's address
            const winnerEvent = receipt.logs.find(log => mdlottery.interface.parseLog(log)?.name === "WinnerPicked");
            if (winnerEvent) {
                winnerAddress = winnerEvent.args.winnerAddress;
            } else {
                throw new Error("WinnerPicked event not found");
            }

            // Check if players array is reset
            expect((await mdlottery.getPlayers()).length).to.equal(0);

            // Check if contract balance is 0 after winner is paid
            expect(await mdlottery.getContractBalance()).to.equal(0);

            // Check winner's balance after receiving prize
            const winnerBalanceAfter = await ethers.provider.getBalance(winnerAddress);
            const expectedWinnerBalance = playerBalancesBefore.get(winnerAddress) + initialContractBalance;

            // Allow for gas costs by checking if the balance increased by roughly the prize amount
            expect(winnerBalanceAfter).to.be.closeTo(expectedWinnerBalance, ethers.parseEther("0.001")); // Allowing for small gas differences

            // Ensure LotteryReset event was emitted
            await expect(tx).to.emit(mdlottery, "LotteryReset");
        });
    });

    describe("getPlayers", function () {
        it("Should return the current list of players", async function () {
            await mdlottery.connect(addr1).participate({ value: ethers.parseEther("2") });
            await mdlottery.connect(addr2).participate({ value: ethers.parseEther("2") });
            const currentPlayers = await mdlottery.getPlayers();
            expect(currentPlayers.length).to.equal(2);
            expect(currentPlayers).to.include(addr1.address);
            expect(currentPlayers).to.include(addr2.address);
        });
    });
});

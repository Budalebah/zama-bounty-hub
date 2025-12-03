import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { FHEBlindAuction } from "../types";
import { FhevmType } from "@fhevm/hardhat-plugin";

describe("FHEBlindAuction", function () {
    let contract: FHEBlindAuction;
    let contractAddress: string;

    before(async function () {
        const factory = await ethers.getContractFactory("FHEBlindAuction");
        contract = (await factory.deploy()) as unknown as FHEBlindAuction;
        await contract.waitForDeployment();
        contractAddress = await contract.getAddress();
    });

    it("should update highest bid correctly", async function () {
        const [alice, bob] = await ethers.getSigners();

        // 1. Alice bids 100
        const encBidAlice = await fhevm.createEncryptedInput(contractAddress, alice.address).add32(100).encrypt();
        const txAlice = await contract.connect(alice).bid(encBidAlice.handles[0], encBidAlice.inputProof);
        await txAlice.wait();

        // Check Alice status
        const aliceStatusHandle = await contract.isWinning(alice.address);
        const isAliceWinning = await fhevm.userDecryptEbool(aliceStatusHandle, contractAddress, alice);
        expect(isAliceWinning).to.be.true;

        // 2. Bob bids 50 (Lower)
        const encBidBobLow = await fhevm.createEncryptedInput(contractAddress, bob.address).add32(50).encrypt();
        const txBobLow = await contract.connect(bob).bid(encBidBobLow.handles[0], encBidBobLow.inputProof);
        await txBobLow.wait();

        // Check Bob status
        const bobStatusHandleLow = await contract.isWinning(bob.address);
        const isBobWinningLow = await fhevm.userDecryptEbool(bobStatusHandleLow, contractAddress, bob);
        expect(isBobWinningLow).to.be.false;

        // 3. Bob bids 150 (Higher)
        const encBidBobHigh = await fhevm.createEncryptedInput(contractAddress, bob.address).add32(150).encrypt();
        const txBobHigh = await contract.connect(bob).bid(encBidBobHigh.handles[0], encBidBobHigh.inputProof);
        await txBobHigh.wait();

        // Check Bob status
        const bobStatusHandleHigh = await contract.isWinning(bob.address);
        const isBobWinningHigh = await fhevm.userDecryptEbool(bobStatusHandleHigh, contractAddress, bob);
        expect(isBobWinningHigh).to.be.true;
    });
});

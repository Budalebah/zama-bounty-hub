import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { FHEERC20 } from "../types";
import { FhevmType } from "@fhevm/hardhat-plugin";

describe("FHEERC20", function () {
    let contract: FHEERC20;
    let contractAddress: string;

    before(async function () {
        const factory = await ethers.getContractFactory("FHEERC20");
        contract = (await factory.deploy("Confidential Token", "CTK")) as unknown as FHEERC20;
        await contract.waitForDeployment();
        contractAddress = await contract.getAddress();
    });

    it("should mint and transfer tokens correctly", async function () {
        const [alice, bob] = await ethers.getSigners();

        // 1. Mint 100 to Alice
        const encMint = await fhevm.createEncryptedInput(contractAddress, alice.address).add32(100).encrypt();
        const txMint = await contract.mint(alice.address, encMint.handles[0], encMint.inputProof);
        await txMint.wait();

        // Verify Alice balance = 100
        const aliceBalanceHandle = await contract.balanceOf(alice.address);
        const aliceBalance = await fhevm.userDecryptEuint(FhevmType.euint32, aliceBalanceHandle, contractAddress, alice);
        expect(aliceBalance).to.equal(100);

        // 2. Transfer 40 from Alice to Bob
        const encTransfer = await fhevm.createEncryptedInput(contractAddress, alice.address).add32(40).encrypt();
        const txTransfer = await contract.connect(alice).transfer(bob.address, encTransfer.handles[0], encTransfer.inputProof);
        await txTransfer.wait();

        // Verify Alice balance = 60
        const aliceBalanceAfter = await fhevm.userDecryptEuint(FhevmType.euint32, await contract.balanceOf(alice.address), contractAddress, alice);
        expect(aliceBalanceAfter).to.equal(60);

        // Verify Bob balance = 40
        const bobBalance = await fhevm.userDecryptEuint(FhevmType.euint32, await contract.balanceOf(bob.address), contractAddress, bob);
        expect(bobBalance).to.equal(40);
    });

    it("should fail transfer if insufficient balance (encrypted check)", async function () {
        const [alice, bob] = await ethers.getSigners();

        // Current state: Alice 60, Bob 40

        // Try to transfer 1000 from Alice to Bob
        const encTransfer = await fhevm.createEncryptedInput(contractAddress, alice.address).add32(1000).encrypt();
        const txTransfer = await contract.connect(alice).transfer(bob.address, encTransfer.handles[0], encTransfer.inputProof);
        await txTransfer.wait();

        // Verify balances unchanged
        const aliceBalance = await fhevm.userDecryptEuint(FhevmType.euint32, await contract.balanceOf(alice.address), contractAddress, alice);
        expect(aliceBalance).to.equal(60);

        const bobBalance = await fhevm.userDecryptEuint(FhevmType.euint32, await contract.balanceOf(bob.address), contractAddress, bob);
        expect(bobBalance).to.equal(40);
    });
});

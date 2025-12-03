import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { FHEPublicDecryption } from "../types";

describe("FHEPublicDecryption", function () {
    let contract: FHEPublicDecryption;
    let contractAddress: string;

    before(async function () {
        const factory = await ethers.getContractFactory("FHEPublicDecryption");
        contract = (await factory.deploy()) as unknown as FHEPublicDecryption;
        await contract.waitForDeployment();
        contractAddress = await contract.getAddress();
    });

    it("should decrypt data publicly", async function () {
        const [signer] = await ethers.getSigners();
        const secretValue = 1337;

        // 1. Set secure data
        const encData = await fhevm.createEncryptedInput(contractAddress, signer.address).add32(secretValue).encrypt();
        const tx = await contract.setSecureData(encData.handles[0], encData.inputProof);
        await tx.wait();

        // Verify it is NOT revealed yet
        expect(await contract.isRevealed()).to.be.false;
        expect(await contract.publicData()).to.equal(0);

        // 2. Reveal data
        const txReveal = await contract.reveal();
        await txReveal.wait();

        // 3. Verify public data
        expect(await contract.isRevealed()).to.be.true;
        expect(await contract.publicData()).to.equal(secretValue);
    });
});

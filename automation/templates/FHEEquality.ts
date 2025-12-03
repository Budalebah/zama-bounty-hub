import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { FHEEquality } from "../types";
import { FhevmType } from "@fhevm/hardhat-plugin";

describe("FHEEquality", function () {
    let contract: FHEEquality;
    let contractAddress: string;

    before(async function () {
        const factory = await ethers.getContractFactory("FHEEquality");
        contract = (await factory.deploy()) as unknown as FHEEquality;
        await contract.waitForDeployment();
        contractAddress = await contract.getAddress();
    });

    it("should return true for equal values (10 == 10)", async function () {
        const [signer] = await ethers.getSigners();

        const encA = await fhevm.createEncryptedInput(contractAddress, signer.address).add32(10).encrypt();
        const encB = await fhevm.createEncryptedInput(contractAddress, signer.address).add32(10).encrypt();

        const tx = await contract.checkEquality(encA.handles[0], encA.inputProof, encB.handles[0], encB.inputProof);
        await tx.wait();

        const resultHandle = await contract.isEqual();
        const decryptedResult = await fhevm.userDecryptEbool(
            resultHandle,
            contractAddress,
            signer
        );

        expect(decryptedResult).to.be.true;
    });

    it("should return false for different values (10 != 5)", async function () {
        const [signer] = await ethers.getSigners();

        const encA = await fhevm.createEncryptedInput(contractAddress, signer.address).add32(10).encrypt();
        const encB = await fhevm.createEncryptedInput(contractAddress, signer.address).add32(5).encrypt();

        const tx = await contract.checkEquality(encA.handles[0], encA.inputProof, encB.handles[0], encB.inputProof);
        await tx.wait();

        const resultHandle = await contract.isEqual();
        const decryptedResult = await fhevm.userDecryptEbool(
            resultHandle,
            contractAddress,
            signer
        );

        expect(decryptedResult).to.be.false;
    });
});

import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { FHEArithmetic } from "../types";
import { FhevmType } from "@fhevm/hardhat-plugin";

describe("FHEArithmetic", function () {
    let contract: FHEArithmetic;
    let contractAddress: string;

    before(async function () {
        const factory = await ethers.getContractFactory("FHEArithmetic");
        contract = (await factory.deploy()) as unknown as FHEArithmetic;
        await contract.waitForDeployment();
        contractAddress = await contract.getAddress();
    });

    it("performs encrypted addition (5 + 3 = 8)", async function () {
        const [signer] = await ethers.getSigners();

        const encA = await fhevm.createEncryptedInput(contractAddress, signer.address).add32(5).encrypt();
        const encB = await fhevm.createEncryptedInput(contractAddress, signer.address).add32(3).encrypt();

        const tx = await contract.add(encA.handles[0], encA.inputProof, encB.handles[0], encB.inputProof);
        await tx.wait();

        const resultHandle = await contract.result();
        const decryptedResult = await fhevm.userDecryptEuint(
            FhevmType.euint32,
            resultHandle,
            contractAddress,
            signer
        );

        expect(decryptedResult).to.equal(8);
    });

    it("performs encrypted subtraction (10 - 4 = 6)", async function () {
        const [signer] = await ethers.getSigners();

        const encA = await fhevm.createEncryptedInput(contractAddress, signer.address).add32(10).encrypt();
        const encB = await fhevm.createEncryptedInput(contractAddress, signer.address).add32(4).encrypt();

        const tx = await contract.sub(encA.handles[0], encA.inputProof, encB.handles[0], encB.inputProof);
        await tx.wait();

        const resultHandle = await contract.result();
        const decryptedResult = await fhevm.userDecryptEuint(
            FhevmType.euint32,
            resultHandle,
            contractAddress,
            signer
        );

        expect(decryptedResult).to.equal(6);
    });
});

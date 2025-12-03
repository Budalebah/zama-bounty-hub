import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { EncryptedValue } from "../types";
import { FhevmType } from "@fhevm/hardhat-plugin";

describe("EncryptedValue", function () {
    let contract: EncryptedValue;
    let contractAddress: string;

    before(async function () {
        const factory = await ethers.getContractFactory("EncryptedValue");
        contract = (await factory.deploy()) as unknown as EncryptedValue;
        await contract.waitForDeployment();
        contractAddress = await contract.getAddress();
        console.log("EncryptedValue deployed to:", contractAddress);
    });

    it("should set and get encrypted value", async function () {
        const [signer] = await ethers.getSigners();
        const valueToEncrypt = 1337;

        // Create encrypted input
        const encryptedInput = await fhevm
            .createEncryptedInput(contractAddress, signer.address)
            .add32(valueToEncrypt)
            .encrypt();

        // Call setValue
        const tx = await contract.setValue(encryptedInput.handles[0], encryptedInput.inputProof);
        await tx.wait();

        // Get value (returns handle)
        const encryptedHandle = await contract.getValue();

        // Decrypt (in test environment)
        const decryptedValue = await fhevm.userDecryptEuint(
            FhevmType.euint32,
            encryptedHandle,
            contractAddress,
            signer
        );

        expect(decryptedValue).to.equal(valueToEncrypt);
    });
});

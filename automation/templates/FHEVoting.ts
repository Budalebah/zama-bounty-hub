import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { FHEVoting } from "../types";
import { FhevmType } from "@fhevm/hardhat-plugin";

describe("FHEVoting", function () {
    let contract: FHEVoting;
    let contractAddress: string;

    before(async function () {
        const factory = await ethers.getContractFactory("FHEVoting");
        contract = (await factory.deploy()) as unknown as FHEVoting;
        await contract.waitForDeployment();
        contractAddress = await contract.getAddress();
    });

    it("should aggregate votes correctly (1 + 1 + 0 = 2)", async function () {
        const [owner, alice, bob, charlie] = await ethers.getSigners();

        // 1. Alice votes 1
        const encVote1 = await fhevm.createEncryptedInput(contractAddress, alice.address).add32(1).encrypt();
        await contract.connect(alice).vote(encVote1.handles[0], encVote1.inputProof);

        // 2. Bob votes 1
        const encVote2 = await fhevm.createEncryptedInput(contractAddress, bob.address).add32(1).encrypt();
        await contract.connect(bob).vote(encVote2.handles[0], encVote2.inputProof);

        // 3. Charlie votes 0
        const encVote3 = await fhevm.createEncryptedInput(contractAddress, charlie.address).add32(0).encrypt();
        await contract.connect(charlie).vote(encVote3.handles[0], encVote3.inputProof);

        // 4. Owner grants access to themselves
        await contract.connect(owner).revealToOwner();

        // 5. Owner decrypts result
        const resultHandle = await contract.connect(owner).getResult();
        const result = await fhevm.userDecryptEuint(FhevmType.euint32, resultHandle, contractAddress, owner);

        expect(result).to.equal(2);
    });
});

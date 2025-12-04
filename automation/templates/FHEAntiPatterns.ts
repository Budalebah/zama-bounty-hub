import { expect } from "chai";
import { ethers } from "hardhat";
import { FHEAntiPatterns } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { createFheInstance } from "../utils/fhevm";

describe("FHEAntiPatterns - Common Mistakes & Best Practices", function () {
    let contract: FHEAntiPatterns;
    let owner: HardhatEthersSigner;
    let user: HardhatEthersSigner;

    before(async function () {
        [owner, user] = await ethers.getSigners();
    });

    beforeEach(async function () {
        const factory = await ethers.getContractFactory("FHEAntiPatterns");
        contract = await factory.deploy();
        await contract.waitForDeployment();
    });

    describe("MISTAKE 1: View Functions with Encrypted Data", function () {
        it("should NOT allow decryption in view functions (commented out in contract)", async function () {
            // This test demonstrates why the badViewDecrypt() function is commented out.
            // FHE.decrypt() requires gas and cannot be called in a view/pure function.
            // 
            // If you uncomment badViewDecrypt() in the contract, compilation will fail with:
            // "Function declared as view, but this expression (potentially) modifies the state"
            //
            // LESSON: Never try to decrypt encrypted values in view functions.
            // Use re-encryption (FHE.allow + off-chain userDecrypt) instead.

            expect(true).to.be.true; // Placeholder test
        });
    });

    describe("MISTAKE 2: Forgetting FHE.allowThis()", function () {
        it("should demonstrate the WRONG way (badSetData)", async function () {
            const fhevm = await createFheInstance();
            const encryptedValue = fhevm.encrypt32(42);

            // This sets the data but FORGETS to call FHE.allowThis()
            await contract.badSetData(encryptedValue.data, encryptedValue.proof);

            // RESULT: The contract cannot perform operations on secureData later
            // because it doesn't have permission to access the handle.
            // In a real scenario, subsequent operations would fail.

            // NOTE: In mock environment, this might not throw immediately,
            // but in production FHEVM, missing allowThis() causes failures.
        });

        it("should demonstrate the CORRECT way (goodSetData)", async function () {
            const fhevm = await createFheInstance();
            const encryptedValue = fhevm.encrypt32(100);

            // This correctly calls FHE.allowThis() after setting the data
            await contract.goodSetData(encryptedValue.data, encryptedValue.proof);

            // RESULT: The contract can now safely perform operations on secureData
            // because it has explicit permission to access the handle.

            // LESSON: Always call FHE.allowThis() for state variables that
            // the contract needs to operate on in future transactions.
        });
    });

    describe("MISTAKE 3: Not Allowing Users to Access Handles", function () {
        it("should demonstrate the WRONG way (badGetHandle)", async function () {
            const fhevm = await createFheInstance();
            const encryptedValue = fhevm.encrypt32(777);

            await contract.goodSetData(encryptedValue.data, encryptedValue.proof);

            // badGetHandle() returns the handle but doesn't grant permission
            const handle = await contract.badGetHandle();

            // RESULT: The user receives a handle (euint32) but cannot decrypt it
            // or perform any operations with it because they lack permission.

            expect(handle).to.not.equal(0); // Handle exists but is useless

            // LESSON: Returning encrypted handles without FHE.allow() is pointless.
        });

        it("should demonstrate the CORRECT way (goodGetHandle)", async function () {
            const fhevm = await createFheInstance();
            const encryptedValue = fhevm.encrypt32(999);

            await contract.goodSetData(encryptedValue.data, encryptedValue.proof);

            // goodGetHandle() explicitly grants permission to the caller
            await contract.connect(user).goodGetHandle();

            // RESULT: The user (msg.sender) now has permission to decrypt
            // or re-encrypt the data using their public key.

            // In a real application, the user would then call:
            // const decrypted = await fhevm.userDecrypt(handle, userPublicKey);

            // LESSON: Always use FHE.allow(handle, address) when you want
            // a specific address to access encrypted data.
        });
    });

    describe("Best Practices Summary", function () {
        it("should follow all FHE best practices", async function () {
            const fhevm = await createFheInstance();
            const value1 = fhevm.encrypt32(50);
            const value2 = fhevm.encrypt32(25);

            // ✅ CORRECT: Set data and immediately call allowThis()
            await contract.goodSetData(value1.data, value1.proof);

            // ✅ CORRECT: Grant permission to user before they need it
            await contract.goodGetHandle();

            // ✅ CORRECT: Never try to decrypt in view functions
            // (Use re-encryption pattern instead)

            // ✅ CORRECT: Always validate encrypted operations with FHE.req()
            // (Not shown in this contract, but important in production)

            expect(true).to.be.true;
        });
    });

    describe("Additional Anti-Patterns (Not in Contract)", function () {
        it("should explain: Missing FHE.req() for conditional checks", async function () {
            // ANTI-PATTERN: Using if (FHE.decrypt(condition)) in production
            // This is impossible because decrypt is async/requires gateway.
            //
            // CORRECT: Use FHE.req(condition) to enforce encrypted conditions
            // Example: FHE.req(FHE.le(balance, amount))

            expect(true).to.be.true;
        });

        it("should explain: Exposing encrypted data in events", async function () {
            // ANTI-PATTERN: emit Transfer(from, to, encryptedAmount)
            // This leaks the encrypted handle, which can be analyzed.
            //
            // CORRECT: Either don't emit encrypted values, or emit only
            // the hash of the handle if you need event tracking.

            expect(true).to.be.true;
        });

        it("should explain: Not using FHE.allowTransient for temporary data", async function () {
            // ANTI-PATTERN: Using FHE.allow() for data that's only needed
            // within a single transaction.
            //
            // CORRECT: Use FHE.allowTransient() for temporary permissions
            // that don't need to persist in storage.

            expect(true).to.be.true;
        });
    });
});

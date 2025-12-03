// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

// @title FHE Anti-Patterns & Common Mistakes
// @chapter security
// @example fhe-anti-patterns
// @description Demonstrates common mistakes in FHE development and how to fix them.
contract FHEAntiPatterns is ZamaEthereumConfig {
    euint32 private secureData;

    constructor() {
        secureData = FHE.asEuint32(0);
        FHE.allowThis(secureData);
    }

    // MISTAKE 1: Trying to decrypt in a view function
    // FHE operations are asynchronous or require gas, so decryption cannot happen in a pure view.
    /*
    function badViewDecrypt() public view returns (uint32) {
        return FHE.decrypt(secureData); // Compilation Error or Runtime Revert
    }
    */

    // CORRECT 1: Use re-encryption for viewing data
    // The user must provide a public key, and the contract re-encrypts the data for them.
    // This is handled off-chain via `fhevm.userDecrypt`.

    // MISTAKE 2: Forgetting FHE.allowThis()
    // If you don't allow the contract to access the handle, it cannot operate on it later.
    function badSetData(externalEuint32 input, bytes calldata proof) public {
        secureData = FHE.fromExternal(input, proof);
        // MISSING: FHE.allowThis(secureData);
        // Result: Future operations on secureData will fail.
    }

    // CORRECT 2: Always use FHE.allowThis() for state variables
    function goodSetData(externalEuint32 input, bytes calldata proof) public {
        secureData = FHE.fromExternal(input, proof);
        FHE.allowThis(secureData);
    }

    // MISTAKE 3: Returning encrypted handles to users without FHE.allow()
    // Users cannot decrypt or use handles unless explicitly allowed.
    function badGetHandle() public view returns (euint32) {
        return secureData; // User gets the handle but can't do anything with it
    }

    // CORRECT 3: Explicitly allow the user (usually done during interaction or via a specific function)
    function goodGetHandle() public {
        FHE.allow(secureData, msg.sender);
    }
}

// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

// @title FHE User Decryption Example
// @chapter decryption
// @example fhe-reencryption
// @description Demonstrates how users can store and retrieve their own encrypted data.
contract FHEReencryption is ZamaEthereumConfig {
    mapping(address => euint32) private userValues;

    function storeValue(externalEuint32 input, bytes calldata proof) public {
        euint32 value = FHE.fromExternal(input, proof);
        userValues[msg.sender] = value;
        
        // Crucial step: Allow the user to decrypt this value later
        FHE.allowThis(value);
        FHE.allow(value, msg.sender);
    }

    function getValue() public view returns (euint32) {
        return userValues[msg.sender];
    }
}

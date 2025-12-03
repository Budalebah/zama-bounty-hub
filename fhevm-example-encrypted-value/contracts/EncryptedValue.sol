// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import "hardhat/console.sol";

/// @title EncryptedValue
/// @notice A simple example demonstrating how to store an encrypted value.
contract EncryptedValue is ZamaEthereumConfig {
    euint32 private encryptedValue;

    /// @notice Sets the encrypted value.
    /// @param _encryptedValue The encrypted value to store.
    function setValue(externalEuint32 _encryptedValue, bytes calldata inputProof) public {
        encryptedValue = FHE.fromExternal(_encryptedValue, inputProof);
        FHE.allowThis(encryptedValue);
        FHE.allow(encryptedValue, msg.sender);
    }

    /// @notice Returns the encrypted value handle.
    /// @return The encrypted value handle.
    function getValue() public view returns (euint32) {
        return encryptedValue;
    }
}

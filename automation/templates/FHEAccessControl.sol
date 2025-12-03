// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

// @title FHE Access Control Example
// @chapter security
// @example fhe-access-control
// @description Demonstrates how to explicitly grant access to encrypted data using FHE.allow.
contract FHEAccessControl is ZamaEthereumConfig {
    euint32 private secureData;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function setSecureData(externalEuint32 input, bytes calldata proof) public {
        secureData = FHE.fromExternal(input, proof);
        FHE.allowThis(secureData);
        // Note: We deliberately do NOT allow msg.sender here to demonstrate explicit granting.
    }

    function grantAccess(address user) public onlyOwner {
        FHE.allow(secureData, user);
    }

    function getSecureDataHandle() public view returns (euint32) {
        return secureData;
    }
}

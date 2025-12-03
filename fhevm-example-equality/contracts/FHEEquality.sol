// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint32, ebool, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

// @title FHE Equality Example
// @chapter basic
// @example fhe-equality
// @description Demonstrates encrypted equality check using FHEVM.
contract FHEEquality is ZamaEthereumConfig {
    ebool public isEqual;

    function checkEquality(externalEuint32 a, bytes calldata proofA, externalEuint32 b, bytes calldata proofB) public {
        euint32 encA = FHE.fromExternal(a, proofA);
        euint32 encB = FHE.fromExternal(b, proofB);
        isEqual = FHE.eq(encA, encB);
        FHE.allowThis(isEqual);
        FHE.allow(isEqual, msg.sender);
    }
}

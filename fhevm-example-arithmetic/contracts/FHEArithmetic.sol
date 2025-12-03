// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

// @title FHE Arithmetic Example
// @chapter basic
// @example fhe-arithmetic-add-sub
// @description Demonstrates encrypted addition and subtraction using FHEVM.
contract FHEArithmetic is ZamaEthereumConfig {
    euint32 public result;

    function add(externalEuint32 a, bytes calldata proofA, externalEuint32 b, bytes calldata proofB) public {
        euint32 encA = FHE.fromExternal(a, proofA);
        euint32 encB = FHE.fromExternal(b, proofB);
        result = FHE.add(encA, encB);
        FHE.allowThis(result);
        FHE.allow(result, msg.sender);
    }

    function sub(externalEuint32 a, bytes calldata proofA, externalEuint32 b, bytes calldata proofB) public {
        euint32 encA = FHE.fromExternal(a, proofA);
        euint32 encB = FHE.fromExternal(b, proofB);
        result = FHE.sub(encA, encB);
        FHE.allowThis(result);
        FHE.allow(result, msg.sender);
    }
}

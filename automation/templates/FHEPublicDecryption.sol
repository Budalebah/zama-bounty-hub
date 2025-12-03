// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {GatewayCaller, Gateway} from "@fhevm/solidity/GatewayCaller.sol";

// @title FHE Public Decryption Example
// @chapter decryption
// @example fhe-public-decryption
// @description Demonstrates how to decrypt data on-chain using the Gateway.
contract FHEPublicDecryption is GatewayCaller {
    euint32 private secureData;
    uint32 public publicData;
    bool public isRevealed;

    function setSecureData(externalEuint32 input, bytes calldata proof) public {
        secureData = FHE.fromExternal(input, proof);
        FHE.allowThis(secureData);
        isRevealed = false;
    }

    function reveal() public {
        uint256[] memory cts = new uint256[](1);
        cts[0] = Gateway.toUint256(secureData);
        
        Gateway.requestDecryption(cts, this.revealCallback.selector, 0, block.timestamp + 100, false);
    }

    function revealCallback(uint256 /*requestID*/, bool success, bytes memory result) public onlyGateway {
        require(success, "Decryption failed");
        publicData = abi.decode(result, (uint32));
        isRevealed = true;
    }
}

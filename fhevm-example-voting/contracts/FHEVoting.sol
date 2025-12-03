// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

// @title FHE Voting Example
// @chapter advanced
// @example fhe-voting
// @description Confidential voting where individual votes are encrypted and only the sum is revealed.
contract FHEVoting is ZamaEthereumConfig {
    euint32 public totalVotes;
    address public owner;

    constructor() {
        owner = msg.sender;
        totalVotes = FHE.asEuint32(0);
        FHE.allowThis(totalVotes);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function vote(externalEuint32 encryptedVote, bytes calldata proof) public {
        euint32 vote = FHE.fromExternal(encryptedVote, proof);
        
        // Add vote to total
        totalVotes = FHE.add(totalVotes, vote);
        FHE.allowThis(totalVotes);
    }

    // Grant access to owner to see the final count
    function revealToOwner() public onlyOwner {
        FHE.allow(totalVotes, owner);
    }

    function getResult() public view onlyOwner returns (euint32) {
        return totalVotes;
    }
}

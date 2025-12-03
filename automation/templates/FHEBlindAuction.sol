// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint32, ebool, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

// @title FHE Blind Auction Example
// @chapter advanced
// @example fhe-blind-auction
// @description Tracks the highest encrypted bid without revealing amounts.
contract FHEBlindAuction is ZamaEthereumConfig {
    euint32 public highestBid;
    
    // Keeps track if a user's *last* bid was the highest at the time of submission
    mapping(address => ebool) public isWinning;

    constructor() {
        // Initialize highest bid to 0
        highestBid = FHE.asEuint32(0);
        FHE.allowThis(highestBid);
    }

    function bid(externalEuint32 amount, bytes calldata proof) public {
        euint32 encAmount = FHE.fromExternal(amount, proof);
        
        // Check if new amount > highestBid
        ebool isNewHighest = FHE.gt(encAmount, highestBid);
        
        // Update highestBid: if isNewHighest ? encAmount : highestBid
        highestBid = FHE.select(isNewHighest, encAmount, highestBid);
        
        // Store the status for the user
        // Note: This only tells if they were winning *at the moment of bid*.
        isWinning[msg.sender] = isNewHighest;

        // Allow contract to manage these handles
        FHE.allowThis(highestBid);
        FHE.allowThis(isWinning[msg.sender]);
        
        // Allow user to see their own status
        FHE.allow(isWinning[msg.sender], msg.sender);
    }
    
    function getHighestBid() public view returns (euint32) {
        return highestBid;
    }
}

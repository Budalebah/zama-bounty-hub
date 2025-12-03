// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint32, ebool, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

// @title FHE ERC20 Example
// @chapter advanced
// @example fhe-erc20
// @description A confidential ERC20 token where balances and transfer amounts are encrypted.
contract FHEERC20 is ZamaEthereumConfig {
    mapping(address => euint32) internal _encBalances;
    uint256 public totalSupply;
    string public name;
    string public symbol;

    constructor(string memory _name, string memory _symbol) {
        name = _name;
        symbol = _symbol;
    }

    function mint(address to, externalEuint32 amount, bytes calldata proof) public {
        euint32 encAmount = FHE.fromExternal(amount, proof);
        if (!FHE.isInitialized(_encBalances[to])) {
            _encBalances[to] = encAmount;
        } else {
            _encBalances[to] = FHE.add(_encBalances[to], encAmount);
        }
        FHE.allowThis(_encBalances[to]);
        FHE.allow(_encBalances[to], to);
    }

    function transfer(address to, externalEuint32 amount, bytes calldata proof) public {
        _transfer(msg.sender, to, FHE.fromExternal(amount, proof));
    }

    function _transfer(address from, address to, euint32 amount) internal {
        // Ensure sender has enough balance
        // Note: In FHE, we can't simply revert if balance < amount because the condition is encrypted.
        // We use FHE.select to perform the transfer conditionally.
        
        euint32 currentBalance = _encBalances[from];
        ebool canTransfer = FHE.le(amount, currentBalance);
        
        // If canTransfer is true:
        // newSenderBalance = currentBalance - amount
        // newReceiverBalance = receiverBalance + amount
        // If canTransfer is false:
        // balances remain unchanged (or we subtract 0)
        
        euint32 amountToTransfer = FHE.select(canTransfer, amount, FHE.asEuint32(0));
        
        _encBalances[from] = FHE.sub(currentBalance, amountToTransfer);
        
        if (!FHE.isInitialized(_encBalances[to])) {
            _encBalances[to] = amountToTransfer;
        } else {
            _encBalances[to] = FHE.add(_encBalances[to], amountToTransfer);
        }

        FHE.allowThis(_encBalances[from]);
        FHE.allow(_encBalances[from], from);
        
        FHE.allowThis(_encBalances[to]);
        FHE.allow(_encBalances[to], to);
    }

    function balanceOf(address wallet) public view returns (euint32) {
        return _encBalances[wallet];
    }
}

# Zama FHEVM Example Generator

This tool automates the creation of FHEVM examples based on Zama's official templates.

## Usage

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Create a new example:**
    ```bash
    npx ts-node src/create-fhevm-example.ts <project-name> --template <TemplateName>
    ```

    **Available Templates:**
    *   `EncryptedValue`: Basic encryption and storage.
    *   `FHEArithmetic`: Encrypted addition and subtraction.
    *   `FHEEquality`: Encrypted equality checks (`FHE.eq`).
    *   `FHEAccessControl`: Managing access with `FHE.allow`.
    *   `FHEAntiPatterns`: Common mistakes and best practices.
    *   `FHEReencryption`: User decryption (re-encryption).
    *   `FHEERC20`: Confidential ERC20 token.
    *   `FHEBlindAuction`: Blind auction using `FHE.select` and `FHE.gt`.
    *   `FHEVoting`: Encrypted voting aggregation.

3.  **Run the example:**
    The script will automatically generate the project, install dependencies, and run tests.
    You can also manually run:
    ```bash
    cd ../<project-name>
    npm install
    npx hardhat test
    ```

## Features

*   **Template Injection:** Automatically injects Solidity contracts and TypeScript tests.
*   **Auto-Documentation:** Generates `README.md` from code comments (`// @title`, `// @description`).
*   **Clean Setup:** Removes default template files to provide a clean slate.


## Understanding FHE Concepts

### What are Input Proofs?

When a user wants to send encrypted data to a smart contract, they must provide two things:

1. **Encrypted Data (`externalEuint32`)**: The actual encrypted value
2. **Input Proof (`bytes calldata proof`)**: A zero-knowledge proof that the user knows the plaintext value

**Why are input proofs needed?**

Input proofs prevent malicious users from:
- Sending random encrypted data they don't understand
- Replaying encrypted values from other users
- Manipulating the encrypted state without knowing the underlying values

**Example:**
```solidity
function setValue(externalEuint32 input, bytes calldata proof) public {
    // The proof verifies that msg.sender actually encrypted this value
    secureData = FHE.fromExternal(input, proof);
    FHE.allowThis(secureData);
}
```

On the client side (using `fhevmjs`):
```typescript
const fhevm = await createFheInstance();
const encrypted = fhevm.encrypt32(42); // Generates both data and proof
await contract.setValue(encrypted.data, encrypted.proof);
```

### Understanding Encrypted Handles

When you create an encrypted value in FHEVM, you don't get the actual encrypted bytes. Instead, you get a **handle** (a unique identifier).

**Think of it like a safety deposit box:**
- The handle is the box number
- The encrypted data is inside the box
- Only authorized addresses (via `FHE.allow`) can access the box

**Example:**
```solidity
euint32 private balance; // This stores a HANDLE, not the encrypted bytes

function getBalance() public {
    FHE.allow(balance, msg.sender); // Grant permission
    // User can now decrypt off-chain using their private key
}
```

### Access Control Patterns

**1. Contract Access (`FHE.allowThis`)**
```solidity
euint32 data = FHE.asEuint32(100);
FHE.allowThis(data); // Contract can now operate on this data
```

**2. User Access (`FHE.allow`)**
```solidity
FHE.allow(data, msg.sender); // User can decrypt this data
```

**3. Temporary Access (`FHE.allowTransient`)**
```solidity
FHE.allowTransient(tempData, address(this)); // Only for this transaction
```

### Common Anti-Patterns

❌ **WRONG: Trying to decrypt in a view function**
```solidity
function getPlaintext() public view returns (uint32) {
    return FHE.decrypt(data); // ERROR: Not allowed in view
}
```

✅ **CORRECT: Use re-encryption**
```solidity
function allowUserToDecrypt() public {
    FHE.allow(data, msg.sender); // User decrypts off-chain
}
```

❌ **WRONG: Forgetting FHE.allowThis()**
```solidity
function setData(externalEuint32 input, bytes calldata proof) public {
    data = FHE.fromExternal(input, proof);
    // Missing: FHE.allowThis(data);
    // Future operations on 'data' will fail!
}
```

✅ **CORRECT: Always call allowThis for state variables**
```solidity
function setData(externalEuint32 input, bytes calldata proof) public {
    data = FHE.fromExternal(input, proof);
    FHE.allowThis(data); // ✓ Contract can now use this data
}
```

For more details, see the `FHEAntiPatterns` template.

## Requirements

*   Node.js >= 20
*   Git

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

## Requirements

*   Node.js >= 20
*   Git

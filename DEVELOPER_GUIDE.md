# 🛠️ Developer Guide

This guide explains how to add new examples, update dependencies, and maintain the Zama FHEVM Example Hub.

## Table of Contents

1. [Adding a New Example Template](#adding-a-new-example-template)
2. [Updating Dependencies](#updating-dependencies)
3. [Testing Your Changes](#testing-your-changes)
4. [Documentation Standards](#documentation-standards)
5. [Troubleshooting](#troubleshooting)

---

## Adding a New Example Template

### Step 1: Create the Solidity Contract

Create a new file in `automation/templates/YourExample.sol`:

```solidity
// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

// @title Your Example Title
// @chapter category-name (e.g., basic, security, advanced)
// @example your-example-id
// @description A clear description of what this example demonstrates.
contract YourExample is ZamaEthereumConfig {
    euint32 private data;

    constructor() {
        data = FHE.asEuint32(0);
        FHE.allowThis(data);
    }

    // Add your functions with clear comments
    function yourFunction(externalEuint32 input, bytes calldata proof) public {
        data = FHE.fromExternal(input, proof);
        FHE.allowThis(data);
    }
}
```

**Important Annotations:**
- `@title`: Human-readable name (used in README)
- `@chapter`: Category for organization (basic/security/advanced/decryption)
- `@example`: Unique identifier (kebab-case)
- `@description`: What the example teaches

### Step 2: Create the Test File

Create `automation/templates/YourExample.ts`:

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";
import { YourExample } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { createFheInstance } from "../utils/fhevm";

describe("YourExample", function () {
  let contract: YourExample;
  let owner: HardhatEthersSigner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("YourExample");
    contract = await factory.deploy();
    await contract.waitForDeployment();
  });

  it("should demonstrate the main concept", async function () {
    const fhevm = await createFheInstance();
    const encrypted = fhevm.encrypt32(42);
    
    await contract.yourFunction(encrypted.data, encrypted.proof);
    
    // Add assertions
    expect(true).to.be.true;
  });
});
```

### Step 3: Update the Automation Script

Add your template to `automation/src/create-fhevm-example.ts`:

```typescript
const TEMPLATES: Record<string, string> = {
  // ... existing templates
  YourExample: 'YourExample',
};
```

### Step 4: Update the Playground

Add your template to `playground/app/page.tsx`:

```typescript
const templates = [
  // ... existing templates
  { 
    id: 'fhevm-example-yourexample', 
    title: 'Your Example', 
    description: 'Brief description.', 
    complexity: 'Basic', // or Security, Advanced, Decryption
    icon: YourIcon, // Import from lucide-react
    templateName: 'YourExample' 
  },
];
```

### Step 5: Test the Template

```bash
cd automation
npx ts-node src/create-fhevm-example.ts test-yourexample --template YourExample
cd ../test-yourexample
npm test
```

### Step 6: Verify Documentation

Check that `README.md` was auto-generated:

```bash
cat README.md
```

It should include your `@title`, `@description`, and code examples.

---

## Updating Dependencies

### Updating FHEVM Library

When a new version of `@fhevm/solidity` is released:

1. **Update base-template:**
   ```bash
   cd base-template
   npm install @fhevm/solidity@latest
   npm install @fhevm/hardhat-plugin@latest
   ```

2. **Test all templates:**
   ```bash
   cd ../automation
   ./test-all-templates.sh  # (Create this script if needed)
   ```

3. **Update documentation:**
   - Update version numbers in `README.md`
   - Note any breaking changes in `CHANGELOG.md`

### Updating Hardhat

```bash
cd base-template
npm install hardhat@latest
npm install @nomicfoundation/hardhat-toolbox@latest
```

### Updating Playground Dependencies

```bash
cd playground
npm update
npm audit fix
```

---

## Testing Your Changes

### Local Testing Workflow

1. **Test a single template:**
   ```bash
   cd automation
   npx ts-node src/create-fhevm-example.ts test-project --template YourExample
   cd ../test-project
   npm test
   ```

2. **Test documentation generation:**
   ```bash
   cd automation
   npx ts-node src/generate-docs.ts ../test-project
   cat ../test-project/README.md
   ```

3. **Test the playground:**
   ```bash
   cd playground
   npm run dev
   # Open localhost:3000 and test the new template card
   ```

### Automated Testing (Future Enhancement)

Create `automation/test-all-templates.sh`:

```bash
#!/bin/bash
TEMPLATES=("EncryptedValue" "FHEArithmetic" "FHEEquality" "YourExample")

for template in "${TEMPLATES[@]}"; do
  echo "Testing $template..."
  npx ts-node src/create-fhevm-example.ts "test-$template" --template "$template"
  cd "../test-$template"
  npm test || exit 1
  cd ../automation
  rm -rf "../test-$template"
done

echo "All templates passed!"
```

---

## Documentation Standards

### Code Comments

Use JSDoc-style comments for auto-generation:

```solidity
/// @notice Stores an encrypted value
/// @param input The encrypted input from the user
/// @param proof The zero-knowledge proof for the input
function setValue(externalEuint32 input, bytes calldata proof) public {
    // Implementation
}
```

### Test Comments

Explain **why** something is tested, not just **what**:

```typescript
it("should reject transfers with insufficient balance", async function () {
  // This test ensures the contract enforces balance checks
  // using FHE.select() to prevent negative balances.
  
  // ... test code
});
```

### README Structure

Auto-generated READMEs should include:
- Title and description
- Installation instructions
- Usage examples
- Key concepts explained
- Common pitfalls

---

## Troubleshooting

### Common Issues

#### 1. "Cannot find module '@fhevm/solidity'"

**Solution:**
```bash
cd base-template
npm install
```

#### 2. "ts-node: command not found"

**Solution:**
```bash
cd automation
npm install
```

#### 3. Tests fail with "FHE is not defined"

**Solution:** Ensure `hardhat.config.ts` includes:
```typescript
import "@fhevm/hardhat-plugin";
```

#### 4. Documentation not generating

**Solution:** Check that your contract has proper annotations:
```solidity
// @title Must be present
// @description Must be present
```

### Getting Help

- **Zama Docs:** https://docs.zama.org/protocol
- **GitHub Issues:** https://github.com/Budalebah/zama-bounty-hub/issues
- **Zama Discord:** https://discord.fhe.org

---

## Best Practices

### Security

- ✅ Always use `FHE.allowThis()` for state variables
- ✅ Use `FHE.allow(handle, address)` before returning handles
- ✅ Never try to decrypt in view functions
- ✅ Use `FHE.req()` for encrypted conditional checks

### Performance

- ✅ Minimize encrypted operations (they're expensive)
- ✅ Use `FHE.allowTransient()` for temporary data
- ✅ Batch operations when possible

### Code Quality

- ✅ Write comprehensive tests (aim for >80% coverage)
- ✅ Document all public functions
- ✅ Use meaningful variable names
- ✅ Follow Solidity style guide

---

## Maintenance Checklist

### Monthly

- [ ] Update dependencies
- [ ] Run all tests
- [ ] Check for FHEVM library updates
- [ ] Review and merge community PRs

### Before Major Releases

- [ ] Test all templates end-to-end
- [ ] Update documentation
- [ ] Create changelog
- [ ] Tag release in Git

---

## Contributing

We welcome contributions! To add a new example:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-example`)
3. Follow the steps in "Adding a New Example Template"
4. Submit a pull request

**PR Requirements:**
- All tests must pass
- Documentation must be auto-generated
- Code must follow existing style
- Include a brief description of what the example teaches

---

**Questions?** Open an issue or reach out to [@budavlebac1](https://x.com/budavlebac1).

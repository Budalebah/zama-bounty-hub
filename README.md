# 🔐 Zama FHEVM Example Hub

> **A comprehensive collection of production-ready FHEVM examples with automated scaffolding, interactive playground, and self-contained documentation.**

Built for the [Zama Bounty Program December 2025](https://www.zama.ai/bounty-program), this project provides developers with everything needed to learn and implement privacy-preserving smart contracts using Fully Homomorphic Encryption (FHE).

## ✨ Features

### 🚀 Interactive Web Playground
- **Live Demo:** [https://playground-beryl-two-88.vercel.app/](https://playground-beryl-two-88.vercel.app/)
- Visual FHE simulator demonstrating encrypted computations
- One-click command generation for all examples
- Beautiful dark-themed UI with smooth animations

### 🛠️ Automated Project Generation
```bash
npx ts-node automation/src/create-fhevm-example.ts my-project --template EncryptedValue
```
- CLI tool for instant project scaffolding
- Auto-generated tests and documentation
- Category-based organization (Basic, Security, Advanced)

### 📚 Comprehensive Examples
- **Basic:** Encrypted values, arithmetic operations, equality checks
- **Security:** Access control, anti-patterns, best practices
- **Advanced:** Blind auctions, confidential voting, encrypted ERC20
- **Decryption:** User re-encryption patterns

### 📖 Auto-Generated Documentation
Every example includes:
- GitBook-compatible README
- Inline code annotations
- Usage examples and test patterns
- Common pitfalls and solutions

## 🎯 Quick Start

```bash
# Clone the repository
git clone https://github.com/Budalebah/zama-bounty-hub.git
cd zama-bounty-hub

# Install dependencies
npm install

# Run the playground
npm run dev

# Generate a new example
cd automation
npm install
npx ts-node src/create-fhevm-example.ts my-auction --template FHEBlindAuction
```

## 📦 Available Templates

| Template | Category | Description |
|----------|----------|-------------|
| `EncryptedValue` | Basic | Store and retrieve encrypted integers |
| `FHEArithmetic` | Basic | Encrypted addition and subtraction |
| `FHEEquality` | Basic | Compare encrypted values |
| `FHEAccessControl` | Security | Permission management with FHE.allow |
| `FHEAntiPatterns` | Security | Common mistakes and how to avoid them |
| `FHEReencryption` | Decryption | User-side decryption patterns |
| `FHEERC20` | Advanced | Confidential token with encrypted balances |
| `FHEBlindAuction` | Advanced | Secret bid auction |
| `FHEVoting` | Advanced | Privacy-preserving voting system |

## 🏗️ Project Structure

```
zama-bounty-hub/
├── automation/          # CLI tools and templates
│   ├── src/
│   │   ├── create-fhevm-example.ts
│   │   └── generate-docs.ts
│   └── templates/       # Solidity contract templates
├── playground/          # Next.js web interface
├── base-template/       # Hardhat project template
└── fhevm-example-*/     # Generated example projects
```

## 🎥 Demo Video

[Coming soon - Video showcasing all features]

## 🏆 Bounty Compliance

This project fulfills all requirements of the Zama Bounty Program:
- ✅ Hardhat-based standalone examples
- ✅ TypeScript automation scripts
- ✅ Auto-generated documentation
- ✅ Category-based organization
- ✅ Anti-patterns and best practices
- ✅ Comprehensive test coverage
- ✅ Interactive web playground (bonus)

## 🤝 Contributing

Contributions are welcome! See our [Developer Guide](./DEVELOPER_GUIDE.md) for adding new examples.

## 📄 License

BSD-3-Clause-Clear

## 👤 Author

**Built by [HALO](https://x.com/budavlebac1)**

---

*Powered by Zama's FHEVM technology for confidential smart contracts on Ethereum.*

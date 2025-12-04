#!/bin/bash

# 🎬 Zama FHEVM Demo - Automated Setup Script (No Playground Version)
# This script automates the demo process WITHOUT starting the playground
# Use this for Linux/Codespaces environments

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

DEMO_DIR="$HOME/Desktop/zama-demo"
REPO_URL="https://github.com/Budalebah/zama-bounty-hub.git"

pause() {
    echo -e "${YELLOW}⏸  Press ENTER to continue...${NC}"
    read -r
}

show_step() {
    echo ""
    echo -e "${CYAN}╔════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║  $1${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════╝${NC}"
    echo ""
}

clear

echo -e "${BLUE}"
cat << "EOF"
╔═══════════════════════════════════════════════════╗
║   🎥 ZAMA FHEVM - CLI DEMO (No Playground)       ║
╚═══════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${YELLOW}⚠️  This version skips the playground (for Linux/Codespaces)${NC}"
echo -e "${CYAN}💡 For full demo with playground, use macOS${NC}"
echo ""
pause

# Clean
if [ -d "$DEMO_DIR" ]; then
    rm -rf "$DEMO_DIR"
fi
mkdir -p "$DEMO_DIR"
cd "$DEMO_DIR"

show_step "STEP 1: Cloning Repository"
echo -e "${BLUE}$ git clone $REPO_URL${NC}"
git clone "$REPO_URL"
cd zama-bounty-hub
echo -e "${GREEN}✓ Repository cloned!${NC}"
echo ""
echo -e "${BLUE}$ ls -la${NC}"
ls -la
pause

show_step "STEP 2: Project Overview"
echo -e "${BLUE}$ cat README.md | head -30${NC}"
cat README.md | head -30
pause

show_step "STEP 3: Generating Example Project"
cd automation
echo -e "${BLUE}$ npm install${NC}"
npm install --silent
echo ""
echo -e "${BLUE}$ npx ts-node src/create-fhevm-example.ts my-auction --template FHEBlindAuction${NC}"
npx ts-node src/create-fhevm-example.ts my-auction --template FHEBlindAuction
echo -e "${GREEN}✓ Project created!${NC}"
pause

show_step "STEP 4: Exploring Project"
cd ../my-auction
echo -e "${BLUE}$ ls -la${NC}"
ls -la
pause

echo -e "${BLUE}$ cat README.md | head -30${NC}"
cat README.md | head -30
pause

echo -e "${BLUE}$ cat contracts/FHEBlindAuction.sol | head -25${NC}"
cat contracts/FHEBlindAuction.sol | head -25
pause

show_step "STEP 5: Running Tests"
echo -e "${BLUE}$ npm test${NC}"
npm test
echo -e "${GREEN}✓ All tests passed!${NC}"
pause

show_step "STEP 6: Available Templates"
cd ../automation
echo -e "${BLUE}$ ls templates/${NC}"
ls templates/
pause

echo -e "${BLUE}$ cat templates/FHEAntiPatterns.sol | head -50${NC}"
cat templates/FHEAntiPatterns.sol | head -50
pause

show_step "Demo Complete!"
echo -e "${GREEN}✓ CLI demo completed!${NC}"
echo ""
echo -e "${CYAN}📦 Demo files: $DEMO_DIR${NC}"
echo -e "${CYAN}🌐 Live playground: https://playground-beryl-two-88.vercel.app/${NC}"
echo ""
echo -e "${YELLOW}Note: Show the live playground in browser separately${NC}"
echo ""

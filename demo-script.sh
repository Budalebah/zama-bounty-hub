#!/bin/bash

# 🎬 Zama FHEVM Demo - Automated Setup Script
# This script automates the entire demo process for video recording

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
DEMO_DIR="$HOME/Desktop/zama-demo"
REPO_URL="https://github.com/Budalebah/zama-bounty-hub.git"

# Helper function to pause and wait for user
pause() {
    echo -e "${YELLOW}⏸  Press ENTER to continue...${NC}"
    read -r
}

# Helper function to show step
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
║                                                   ║
║   🎥 ZAMA FHEVM EXAMPLE HUB - DEMO SCRIPT        ║
║                                                   ║
║   This script will guide you through the demo    ║
║   Perfect for screen recording!                  ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${GREEN}This script will:${NC}"
echo "  1. Clone the repository"
echo "  2. Install dependencies"
echo "  3. Generate a sample project"
echo "  4. Run tests"
echo "  5. Show documentation"
echo ""
echo -e "${YELLOW}⚠️  Make sure you're recording your screen!${NC}"
echo ""
pause

# ============================================
# STEP 1: Clean and prepare
# ============================================
show_step "STEP 1: Preparing Demo Environment"

if [ -d "$DEMO_DIR" ]; then
    echo -e "${YELLOW}⚠️  Demo directory exists. Cleaning up...${NC}"
    rm -rf "$DEMO_DIR"
fi

mkdir -p "$DEMO_DIR"
cd "$DEMO_DIR"

echo -e "${GREEN}✓ Demo directory ready: $DEMO_DIR${NC}"
pause

# ============================================
# STEP 2: Clone repository
# ============================================
show_step "STEP 2: Cloning Repository"

echo -e "${BLUE}$ git clone $REPO_URL${NC}"
git clone "$REPO_URL"

cd zama-bounty-hub
echo -e "${GREEN}✓ Repository cloned successfully!${NC}"
echo ""
echo -e "${BLUE}$ ls -la${NC}"
ls -la
pause

# ============================================
# STEP 3: Show README
# ============================================
show_step "STEP 3: Project Overview"

echo -e "${BLUE}$ cat README.md | head -30${NC}"
cat README.md | head -30
echo ""
echo -e "${YELLOW}... (README continues)${NC}"
pause

# ============================================
# STEP 4: Install root dependencies
# ============================================
show_step "STEP 4: Installing Dependencies"

echo -e "${BLUE}$ npm install${NC}"
npm install --silent

echo -e "${GREEN}✓ Dependencies installed!${NC}"
pause

# ============================================
# STEP 5: Show Live Playground
# ============================================
show_step "STEP 5: Exploring the Web Playground"

echo -e "${CYAN}🌐 Opening the live playground in your browser...${NC}"
echo ""
echo -e "${BLUE}Live Demo: https://playground-beryl-two-88.vercel.app/${NC}"
echo ""
echo -e "${YELLOW}In your browser:${NC}"
echo "  1. Visit the link above"
echo "  2. Try the FHE Simulator (encrypt, compute, decrypt)"
echo "  3. Scroll to 'Blind Auction' template card"
echo "  4. Click 'Copy Command' button"
echo "  5. See the toast notification"
echo ""
echo -e "${CYAN}💡 The playground is already deployed and running!${NC}"
echo -e "${CYAN}   No local setup needed.${NC}"
echo ""
pause

# ============================================
# STEP 6: Show Playground and Copy Command
# ============================================
show_step "STEP 6: Using the Playground"

echo -e "${CYAN}🌐 Now, in your browser:${NC}"
echo "  1. Go to http://localhost:3000"
echo "  2. Scroll to 'Blind Auction' template card"
echo "  3. Click 'Copy Command' button"
echo "  4. Come back to terminal"
echo ""
echo -e "${YELLOW}⚠️  The command will be in your clipboard!${NC}"
pause

# ============================================
# STEP 7: Paste and run the copied command
# ============================================
show_step "STEP 7: Running Copied Command"

echo -e "${CYAN}📋 Now paste the command from your clipboard:${NC}"
echo -e "${BLUE}   (Press Cmd+V and then ENTER)${NC}"
echo ""
echo -e "${YELLOW}Expected command:${NC}"
echo -e "${BLUE}# Clone the Zama FHEVM Example Hub${NC}"
echo -e "${BLUE}git clone https://github.com/Budalebah/zama-bounty-hub.git${NC}"
echo -e "${BLUE}cd zama-bounty-hub/automation${NC}"
echo -e "${BLUE}npm install${NC}"
echo -e "${BLUE}${NC}"
echo -e "${BLUE}# Generate your project${NC}"
echo -e "${BLUE}npx ts-node src/create-fhevm-example.ts my-blindauction --template FHEBlindAuction${NC}"
echo ""
echo -e "${YELLOW}⚠️  Since we already cloned, just run the generation part:${NC}"
echo ""

cd automation

echo -e "${BLUE}$ npm install${NC}"
npm install --silent

echo ""
echo -e "${BLUE}$ npx ts-node src/create-fhevm-example.ts my-auction --template FHEBlindAuction${NC}"
echo ""

npx ts-node src/create-fhevm-example.ts my-auction --template FHEBlindAuction

echo ""
echo -e "${GREEN}✓ Project 'my-auction' created from playground command!${NC}"
pause

# ============================================
# STEP 7: Explore generated project
# ============================================
show_step "STEP 7: Exploring Generated Project"

cd ../my-auction

echo -e "${BLUE}$ ls -la${NC}"
ls -la
echo ""
pause

echo -e "${BLUE}$ cat README.md | head -30${NC}"
cat README.md | head -30
echo ""
echo -e "${YELLOW}... (README continues)${NC}"
pause

echo -e "${BLUE}$ cat contracts/FHEBlindAuction.sol | head -25${NC}"
cat contracts/FHEBlindAuction.sol | head -25
echo ""
echo -e "${YELLOW}... (Contract continues)${NC}"
pause

# ============================================
# STEP 8: Run tests
# ============================================
show_step "STEP 8: Running Tests"

# Ensure dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing test dependencies...${NC}"
    npm install --silent
fi

echo -e "${BLUE}$ npm test${NC}"
echo ""

npm test

echo ""
echo -e "${GREEN}✓ All tests passed!${NC}"
pause

# ============================================
# STEP 9: Show templates
# ============================================
show_step "STEP 9: Available Templates"

cd ../automation

echo -e "${BLUE}$ ls templates/${NC}"
ls templates/
echo ""
pause

echo -e "${BLUE}$ cat templates/FHEAntiPatterns.sol | head -50${NC}"
cat templates/FHEAntiPatterns.sol | head -50
echo ""
echo -e "${YELLOW}... (Anti-patterns continue)${NC}"
pause

# ============================================
# STEP 10: Cleanup
# ============================================
show_step "STEP 10: Demo Complete!"

echo -e "${GREEN}╔═══════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                   ║${NC}"
echo -e "${GREEN}║   ✓ Demo completed successfully!                 ║${NC}"
echo -e "${GREEN}║                                                   ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}📦 Demo files location: $DEMO_DIR${NC}"
echo -e "${CYAN}🌐 Live Playground: https://playground-beryl-two-88.vercel.app/${NC}"
echo ""
echo -e "${YELLOW}Don't forget to:${NC}"
echo "  1. Stop screen recording"
echo "  2. Upload video to YouTube/Loom"
echo "  3. Run ./add-video-link.sh to add the link to README"
echo ""
echo -e "${BLUE}To clean up demo files:${NC}"
echo "  $ rm -rf $DEMO_DIR"
echo ""
echo -e "${GREEN}Thank you for using Zama FHEVM Example Hub!${NC}"
echo ""

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
# STEP 5: Start playground (in background)
# ============================================
show_step "STEP 5: Starting Web Playground"

echo -e "${BLUE}$ npm run dev${NC}"
echo -e "${YELLOW}Starting Next.js server...${NC}"

# Start in background
npm run dev > /tmp/playground.log 2>&1 &
PLAYGROUND_PID=$!

# Wait for server to start
echo -e "${YELLOW}Waiting for server to start...${NC}"
sleep 5

if ps -p $PLAYGROUND_PID > /dev/null; then
    echo -e "${GREEN}✓ Playground running at http://localhost:3000${NC}"
    echo ""
    echo -e "${CYAN}🌐 Open http://localhost:3000 in your browser now!${NC}"
    echo -e "${YELLOW}   (Show the FHE Simulator and template cards)${NC}"
else
    echo -e "${YELLOW}⚠️  Playground failed to start. Check /tmp/playground.log${NC}"
fi

pause

# ============================================
# STEP 6: Generate example project
# ============================================
show_step "STEP 6: Generating Example Project"

cd automation

echo -e "${BLUE}$ npm install${NC}"
npm install --silent

echo ""
echo -e "${BLUE}$ npx ts-node src/create-fhevm-example.ts my-auction --template FHEBlindAuction${NC}"
echo ""

npx ts-node src/create-fhevm-example.ts my-auction --template FHEBlindAuction

echo ""
echo -e "${GREEN}✓ Project 'my-auction' created successfully!${NC}"
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
echo -e "${CYAN}🌐 Playground: http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}Don't forget to:${NC}"
echo "  1. Stop screen recording"
echo "  2. Show the playground in browser"
echo "  3. Stop the playground server (kill $PLAYGROUND_PID)"
echo ""
echo -e "${BLUE}To stop the playground:${NC}"
echo "  $ kill $PLAYGROUND_PID"
echo ""
echo -e "${BLUE}To clean up demo files:${NC}"
echo "  $ rm -rf $DEMO_DIR"
echo ""
echo -e "${GREEN}Thank you for using Zama FHEVM Example Hub!${NC}"
echo ""

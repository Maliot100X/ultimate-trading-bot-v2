#!/bin/bash

# ULTIMATE TRADING BOT - COMPLETE INSTALLATION
echo "=========================================="
echo "ULTIMATE TRADING BOT - INSTALLING EVERYTHING"
echo "=========================================="

# Update system
echo "[1/10] Updating system..."
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl wget git build-essential python3-dev python3-pip python3-venv nodejs npm redis-server postgresql postgresql-contrib

# Install Node.js 20.x
echo "[2/10] Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python 3.11
echo "[3/10] Installing Python 3.11..."
sudo apt install -y python3.11 python3.11-venv python3.11-dev
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1

# Install Solana CLI
echo "[4/10] Installing Solana CLI..."
sh -c "$(curl -sSfL https://release.solana.com/v1.18.6/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc

# Create virtual environment
echo "[5/10] Setting up Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install ALL Python dependencies
echo "[6/10] Installing Python dependencies..."
pip install --upgrade pip

# Core trading stack
pip install solana solders anchorpy base58
pip install pumpfun-sdk
pip install gmgn-python-sdk
pip install jupiter-api
pip install dexscreener-api
pip install birdeye-so

# Web3 and blockchain
pip install web3 eth-account eth-typing
pip install moralis
pip install pycoingecko
pip install ccxt

# Data processing
pip install pandas numpy scipy scikit-learn
pip install ta
pip install yfinance
pip install plotly dash
pip install streamlit

# Async and networking
pip install aiohttp websockets asyncio
pip install requests httpx
pip install redis celery

# Telegram bot
pip install python-telegram-bot telethon
pip install aiogram

# Web framework
pip install fastapi uvicorn sqlalchemy alembic
pip install pydantic pydantic-settings

# Monitoring and logging
pip install prometheus-client grafana-client
pip install structlog python-json-logger
pip install sentry-sdk

# Development tools
pip install jupyter ipython
pip install black flake8 mypy pylint
pip install pytest pytest-asyncio pytest-cov
pip install pre-commit

# Install ALL skills from skills.sh
echo "[7/10] Installing ALL skills from skills.sh..."
npm install -g @skills.sh/cli

# GMGN Skills
npx skills add https://github.com/gmgnai/gmgn-skills --skill gmgn-market
npx skills add https://github.com/gmgnai/gmgn-skills --skill gmgn-token
npx skills add https://github.com/gmgnai/gmgn-skills --skill gmgn-portfolio
npx skills add https://github.com/gmgnai/gmgn-skills --skill gmgn-track
npx skills add https://github.com/gmgnai/gmgn-skills --skill gmgn-swap
npx skills add https://github.com/gmgnai/gmgn-skills --skill gmgn-cooking

# Pump.fun Skills
npx skills add https://github.com/sendaifun/skills --skill pumpfun
npx skills add https://github.com/alsk1992/cloddsbot --skill pumpfun

# Solana Skills
npx skills add https://github.com/sendaifun/skills --skill solana-kit
npx skills add https://github.com/solana-foundation/solana-dev-skill --skill solana-dev
npx skills add https://github.com/solanaguide/solana-cli --skill solana-cli
npx skills add https://github.com/sendaifun/skills --skill solana-agent-kit

# Trading Bot Skills
npx skills add https://github.com/sanctifiedops/solana-skills --skill trading-bot-architecture

# Token Launcher
npx skills add https://github.com/tomi204/clawpump-skill --skill solana-token-launcher

# Install GMGN CLI
echo "[8/10] Installing GMGN CLI..."
npm install -g gmgn-cli

# Install PumpFun SDK
echo "[9/10] Installing PumpFun SDK..."
npm install @pump-fun/pump-sdk @pump-fun/pump-swap-sdk

# Setup directories
echo "[10/10] Setting up directories..."
mkdir -p ~/.config/gmgn
mkdir -p ~/.config/solana
mkdir -p ~/.bot_data
mkdir -p ~/.bot_logs
mkdir -p ~/.bot_cache
mkdir -p ~/.bot_wallets

# Create default configs
cat > ~/.config/gmgn/.env << 'EOF'
GMGN_API_KEY=your_gmgn_api_key_here
EOF

cat > ~/.config/solana/cli/config.yml << 'EOF'
json_rpc_url: "https://api.mainnet-beta.solana.com"
websocket_url: "wss://api.mainnet-beta.solana.com"
keypair_path: ~/.config/solana/id.json
commitment: confirmed
EOF

echo "=========================================="
echo "INSTALLATION COMPLETE!"
echo "=========================================="
echo ""
echo "NEXT STEPS:"
echo "1. Activate virtual environment: source venv/bin/activate"
echo "2. Configure API keys (see below)"
echo "3. Run: python src/bot.py --setup"
echo ""
echo "REQUIRED API KEYS:"
echo "- GMGN API Key"
echo "- Solana Wallet Private Key"
echo "- Telegram Bot Token"
echo "- Jupiter API Key (optional)"
echo "- DexScreener API Key"
echo "- BirdEye API Key"
echo "- Moralis API Key"
echo ""
echo "The bot will prompt for these during setup."

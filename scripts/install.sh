#!/bin/bash

# Ultimate Trading Bot - Complete Installation Script
echo "Installing Ultimate Trading Bot - All Capabilities"

# Update system
sudo apt update
sudo apt upgrade -y

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs npm

# Install Python and pip
sudo apt install -y python3.11 python3-pip python3.11-venv
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install --upgrade pip

# Core trading dependencies
pip install solana
pip install solders
pip install anchorpy
pip install base58
pip install solders
pip install requests
pip install websockets
pip install asyncio
pip install aiohttp
pip install pandas
pip install numpy
pip install matplotlib
pip install seaborn
pip install sqlalchemy
pip install alembic
pip install pydantic
pip install fastapi
pip install uvicorn
pip install python-telegram-bot
pip install python-dotenv
pip install pyyaml
pip install redis
pip install celery
pip install prometheus-client
pip install grafana-client

# GMGN CLI
npm install -g gmgn-cli

# Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18.6/install)"

# PumpFun SDK
npm install @pump-fun/pump-sdk @pump-fun/pump-swap-sdk

# Additional utilities
pip install jupyter
pip install ipython
pip install black
pip install flake8
pip install pytest
pip install pytest-asyncio

# Create config directories
mkdir -p ~/.config/gmgn
mkdir -p ~/.config/solana
mkdir -p ~/.bot_data
mkdir -p ~/.bot_logs

echo "Installation complete!"
echo ""
echo "Next steps:"
echo "1. Set up API keys in configs/settings.yaml"
echo "2. Configure Telegram bot token"
echo "3. Set up GMGN API key"
echo "4. Configure Solana wallet"
echo "5. Run: source venv/bin/activate"
echo "6. Run: python src/bot.py --test"

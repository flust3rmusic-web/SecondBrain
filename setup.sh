#!/bin/bash

echo ""
echo "====================================="
echo "      SecondBrain Setup"
echo "====================================="
echo ""

echo "[1/5] Installing Node packages..."
npm install

echo ""
echo "[2/5] Creating folders..."

mkdir -p auth
mkdir -p temp/voice
mkdir -p services

echo ""
echo "[3/5] Checking .env..."

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo ".env created from .env.example"
else
    echo ".env already exists"
fi

echo ""
echo "[4/5] Checking Python..."

python3 --version

echo ""
echo "[5/5] Checking Ollama..."

ollama --version

echo ""
echo "====================================="
echo "Setup Complete"
echo "====================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Edit .env"
echo "2. Add Google credentials"
echo "3. Start Ollama"
echo "4. Run:"
echo ""
echo "npm start"
echo ""
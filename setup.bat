@echo off

echo ==========================
echo WhatsApp AI Agent Setup
echo ==========================

echo.

echo Installing Node packages...
call npm install

echo.

echo Creating folders...
mkdir temp 2>nul
mkdir temp\voice 2>nul
mkdir auth 2>nul

echo.

echo Pulling Gemma...
ollama pull gemma3:4b

echo.

echo Setup Complete!
pause
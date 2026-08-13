#!/bin/bash

set -e

echo "======================================"
echo " Instalación de Node.js + npm con NVM"
echo "======================================"

# Verificar curl
if ! command -v curl &> /dev/null; then
    echo "❌ No está instalado curl."
    echo "Necesitás pedirle al administrador que instale curl."
    exit 1
fi

# Instalar NVM si no existe
if [ ! -d "$HOME/.nvm" ]; then
    echo "📦 Instalando NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
else
    echo "✅ NVM ya está instalado."
fi

# Cargar NVM
export NVM_DIR="$HOME/.nvm"

if [ -s "$NVM_DIR/nvm.sh" ]; then
    source "$NVM_DIR/nvm.sh"
else
    echo "❌ No se pudo cargar NVM."
    exit 1
fi

# Instalar Node.js 22 si no existe
if ! nvm ls 22 &> /dev/null; then
    echo "📦 Instalando Node.js 22..."
    nvm install 22
else
    echo "✅ Node.js 22 ya está instalado."
fi

# Usar Node 22
nvm use 22

# Dejar Node 22 como versión predeterminada
nvm alias default 22

echo ""
echo "======================================"
echo " ✅ Instalación terminada"
echo "======================================"
echo ""
echo "Node:"
node -v

echo ""
echo "npm:"
npm -v

echo ""
echo "Ya podés usar:"
echo "  npm install"
echo "  npm run dev"
echo ""
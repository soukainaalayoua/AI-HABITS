#!/bin/sh

# Script de démarrage pour Fly.io
echo "🚀 Starting AI-HABITS Backend..."

# Vérifier que le port est défini
if [ -z "$PORT" ]; then
  export PORT=3000
fi

echo "📡 Server will run on port $PORT"

# Démarrer l'application
exec node server.js

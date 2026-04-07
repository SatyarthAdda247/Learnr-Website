#!/bin/bash

# Ensure we are in the script's directory
cd "$(dirname "$0")"

echo "🚀 Preparing Vercel Deployment for Learnr Website..."

# Check if Vercel CLI is installed globally
if ! command -v vercel &> /dev/null
then
    echo "📦 Vercel CLI not found. Installing globally..."
    npm i -g vercel
else
    echo "✅ Vercel CLI is already installed"
fi

# Navigate to the frontend directory where the app lives
cd frontend

echo "🛠️ Building the project..."
# Install dependencies to ensure local environment is clean (optional but recommended)
npm install

echo "☁️ Deploying to Vercel..."
# Deploy using the CLI. It will prompt for login if not authenticated.
vercel --prod

echo "🎉 Deployment initiated!"

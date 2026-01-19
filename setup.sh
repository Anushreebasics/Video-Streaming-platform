#!/bin/bash

# PulseStream - Quick Setup Script
# This script sets up both backend and frontend for development

echo "🎬 PulseStream - Quick Setup Script"
echo "===================================="
echo ""

# Check Node.js
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) found"

# Check MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found locally. You can:"
    echo "   1. Install MongoDB locally: https://www.mongodb.com/try/download/community"
    echo "   2. Use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas"
    echo ""
fi

echo ""
echo "📦 Setting up Backend..."
echo "========================"
cd backend

# Install backend dependencies
echo "Installing dependencies..."
npm install

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
PORT=5001
MONGO_URI=mongodb://localhost:27017/videostreaming
JWT_SECRET=your_super_secret_jwt_key_change_in_production
EOF
    echo "✅ Created .env file"
else
    echo "✅ .env file already exists"
fi

# Create uploads directory
if [ ! -d "uploads" ]; then
    mkdir uploads
    echo "✅ Created uploads directory"
else
    echo "✅ uploads directory already exists"
fi

# Build TypeScript
echo "Building TypeScript..."
npm run build

echo ""
echo "📦 Setting up Frontend..."
echo "========================="
cd ../frontend

# Install frontend dependencies
echo "Installing dependencies..."
npm install

echo ""
echo "✅ Setup Complete!"
echo "=================="
echo ""
echo "🚀 To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "📝 Note: Make sure MongoDB is running before starting the backend"
echo ""
echo "📚 Documentation:"
echo "  - Quick Start: README.md"
echo "  - Complete Guide: DOCUMENTATION.md"
echo "  - API Reference: API.md"
echo "  - Deployment: DEPLOYMENT.md"
echo ""
echo "🎉 Happy coding!"

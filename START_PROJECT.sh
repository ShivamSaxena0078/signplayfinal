#!/bin/bash

# SignPlay Project Startup Script
# This script helps you start all services

echo "🚀 Starting SignPlay Project..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if MongoDB is needed
echo -e "${YELLOW}📊 MongoDB Setup:${NC}"
echo "You have two options:"
echo "1. Use MongoDB Atlas (Cloud - Recommended):"
echo "   - Sign up at https://www.mongodb.com/cloud/atlas"
echo "   - Get your connection string"
echo "   - Update server/.env with: MONGODB_URI=mongodb+srv://..."
echo ""
echo "2. Use Local MongoDB:"
echo "   - Install MongoDB: brew install mongodb-community"
echo "   - Start it: brew services start mongodb-community"
echo ""
read -p "Press Enter when MongoDB is ready..."

echo ""
echo -e "${GREEN}✅ Starting services...${NC}"
echo ""

# Start Backend Server (Terminal 1)
echo "📦 Starting Backend Server (Port 8080)..."
cd server
npm start &
BACKEND_PID=$!
cd ..

sleep 2

# Start Frontend (Terminal 2)
echo "🎨 Starting Frontend (Port 3000)..."
npm run dev &
FRONTEND_PID=$!

sleep 2

# Start Flask Server (Terminal 3)
echo "🤖 Starting Flask Server (Port 5001)..."
source venv/bin/activate
python flask_app.py &
FLASK_PID=$!

echo ""
echo -e "${GREEN}✅ All services started!${NC}"
echo ""
echo "📍 Services running:"
echo "   - Backend:  http://localhost:8080"
echo "   - Frontend: http://localhost:3000"
echo "   - Flask:    http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID $FLASK_PID 2>/dev/null; exit" INT
wait

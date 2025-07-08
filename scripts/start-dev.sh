#!/bin/bash

echo "🚀 Starting InsightFlow CRM Development Environment"

# Start PostgreSQL and Redis
echo "📦 Starting database services..."
docker-compose up -d postgres redis

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5

# Install dependencies
echo "📥 Installing dependencies..."
cd shared && npm install && npm run build
cd ../backend && npm install
cd ../frontend && npm install

# Start backend
echo "🔧 Starting backend server..."
cd ../backend
npm run start:dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 10

# Start frontend
echo "🎨 Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ Development environment started!"
echo "📊 Frontend: http://localhost:3000"
echo "🔗 Backend: http://localhost:4000"
echo "📚 API Docs: http://localhost:4000/api-docs"
echo ""
echo "Default login:"
echo "Email: admin@insightflow.com"
echo "Password: admin123"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait $BACKEND_PID $FRONTEND_PID
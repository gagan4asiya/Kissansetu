#!/bin/bash

echo "Starting Kisan Setu Development Environment..."
echo

echo "Starting Backend Server..."
cd backend && npm start &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 3

echo "Starting Frontend (Expo)..."
cd ../Kisaan-setu && npm start &
FRONTEND_PID=$!

echo
echo "Both servers are starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: Check the Expo terminal for QR code and URLs"
echo
echo "Press Ctrl+C to stop both servers"

# Function to cleanup processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Trap Ctrl+C
trap cleanup INT

# Wait for user to stop
wait

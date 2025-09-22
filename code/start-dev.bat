@echo off
echo Starting Kisan Setu Development Environment...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm start"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend (Expo)...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: Check the Expo terminal for QR code and URLs
echo.
echo Press any key to exit...
pause > nul

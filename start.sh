#!/bin/bash
export OPENWEATHER_API_KEY="your_key_here"

# Activate the virtual environment
source /home/brady/desk-dashboard/venv/bin/activate

# cd into the folder where main.py is BEFORE starting uvicorn
cd /home/brady/desk-dashboard/backend

# Start backend
uvicorn main:app --host 0.0.0.0 --port 8000 &

# Start frontend file server
cd /home/brady/desk-dashboard/frontend
python3 -m http.server 3000 &

# Wait and launch browser
sleep 8
chromium-browser http://localhost:3000 --kiosk --incognito --noerrdialogs --disable-infobars

# Desk Dashboard

A personal **desktop dashboard** for Raspberry Pi, displaying the current time, weather, conditions, and a full **calendar/schedule** in a **dark theme**, designed for use with a Pi touchscreen in kiosk mode.

The dashboard consists of:

- **Backend**: Python + FastAPI serving weather and calendar event data
- **Frontend**: HTML, CSS, JavaScript (fetches data from the backend)
- **Designed for Raspberry Pi 3+** with Chromium in kiosk mode

---

## Features

- Real-time **weather updates** for a specified city
- **Clock** with current time
- **Calendar** with Day, Week, and Month views
- **Add and delete events** directly from the dashboard
- Events **persist across reboots** via local `events.json`
- **Dark theme** inspired by modern dashboards
- Kiosk mode — **no browser tabs, borders, or UI chrome**
- Auto-launches on boot via crontab
- Handles API errors gracefully (fallback values if weather API fails)
- Google Calendar support *(coming soon)*

---

## Folder Structure

```text
desk-dashboard/
├── backend/
│   └── main.py          # FastAPI backend (weather + events API)
├── frontend/
│   ├── index.html       # Main HTML page
│   ├── app.js           # JS for fetching data, calendar logic, DOM updates
│   └── styles.css       # Dark theme styling
├── events.json          # Local event storage (auto-created on first run)
├── start.sh             # Single startup script (backend + frontend + kiosk)
├── requirements.txt     # Python dependencies
└── README.md
```

---

## Prerequisites

- Raspberry Pi 3 or newer
- Raspberry Pi OS (32-bit recommended)
- Python 3.7+
- Chromium browser
- OpenWeatherMap API key ([Get one here](https://openweathermap.org/api))

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/woznia93/desk-dashboard.git
cd desk-dashboard
```

Make `start.sh` executable:

```bash
chmod +x start.sh
```

### 2. Set up Python virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

> **Important:** Always use the venv. The Pi will throw an "externally managed environment" error if you try to pip install outside of it.

### 3. Set your OpenWeatherMap API key

Add it to your `~/.bashrc` so it persists across reboots:

```bash
echo 'export OPENWEATHER_API_KEY="your_key_here"' >> ~/.bashrc
source ~/.bashrc
```

Or set it directly inside `start.sh` (already included in the script).

### 4. Run the dashboard

Everything is handled by a single script:

```bash
./start.sh
```

This will:
- Activate the virtual environment
- Start the FastAPI backend on port `8000`
- Start the frontend file server on port `3000`
- Wait for servers to be ready
- Launch Chromium in kiosk mode (fullscreen, no tabs, no borders)

### 5. Verify backend is running

```bash
curl http://127.0.0.1:8000/weather
curl http://127.0.0.1:8000/events
```

### 6. Auto-start on boot

Add to crontab so the dashboard launches automatically on every boot:

```bash
crontab -e
```

Add this line at the bottom:

```
@reboot /home/pi/desk-dashboard/start.sh
```

---

## start.sh

```bash
#!/bin/bash
export OPENWEATHER_API_KEY="your_key_here"

# Activate venv
source /home/pi/desk-dashboard/venv/bin/activate

# Start backend
cd /home/pi/desk-dashboard
uvicorn main:app --host 0.0.0.0 --port 8000 &

# Start frontend
cd /home/pi/desk-dashboard/frontend
python3 -m http.server 3000 &

# Wait for servers to be ready
sleep 5

# Launch Chromium fullscreen with no tabs/borders
DISPLAY=:0 chromium-browser http://localhost:3000 \
  --kiosk \
  --noerrdialogs \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-restore-session-state \
  --no-first-run \
  --incognito \
  --start-fullscreen \
  --window-position=0,0
```

---

## Stopping the Dashboard

Kill both servers:

```bash
fuser -k 8000/tcp && fuser -k 3000/tcp
```

Or:

```bash
pkill -f uvicorn
pkill -f "http.server"
```

---

## Calendar Usage

| Action | How |
|---|---|
| Switch views | Tap **Day / Week / Month** tabs |
| Add an event | Tap **+ Add Event**, enter title and date/time |
| Delete an event | Tap the **✕** next to any event |
| Browse months | Use **‹ ›** arrows in Month view |
| View a day's events | Tap any day cell in Month view |

Events are saved to `events.json` and persist across reboots.

---

## Troubleshooting

**`uvicorn: command not found`**  
Make sure the venv is activated, or use `python3 -m uvicorn` in `start.sh`.

**`could not import module main`**  
Ensure `start.sh` does `cd` into the folder containing `main.py` before starting uvicorn.

**`externally managed environment` error**  
Delete and recreate the venv:

```bash
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Chromium opens as a tab instead of fullscreen**  
Clear leftover session data and reboot:

```bash
rm -rf ~/.config/chromium/Default/Session\ Storage
rm -f ~/.config/chromium/Default/Last\ Session
rm -f ~/.config/chromium/Default/Last\ Tabs
sudo reboot
```

---

## Roadmap

- [ ] Google Calendar sync
- [ ] Weather forecast (multi-day)
- [ ] Custom city selection from dashboard
- [ ] Light theme toggle

# Desk Dashboard

A personal **desktop dashboard** for Raspberry Pi, displaying the current time, weather, and conditions in a **dark theme**, designed for use with a Pi touchscreen.  

The dashboard consists of:  

- **Backend**: Python + FastAPI serving weather data from OpenWeatherMap API  
- **Frontend**: HTML, CSS, JavaScript (fetches data from the backend)  
- **Designed for Raspberry Pi 3+** with Chromium or lightweight browsers  

---

## Features

- Real-time **weather updates** for a specified city  
- **Clock** with current time  
- **Dark theme** inspired by modern dashboards  
- Easy setup for **Pi touchscreen kiosk mode**  
- Handles API errors gracefully (fallback values if the weather API fails)  

---

## Folder Structure
desk-dashboard/
├─ backend/
│ └─ main.py # FastAPI backend
├─ frontend/
│ ├─ index.html # Main HTML page
│ ├─ app.js # JS for fetching data and updating DOM
│ └─ styles.css # Dark theme styling
├─ README.md
└─ requirements.txt

---

## Prerequisites

- Raspberry Pi 3 or newer  
- Raspberry Pi OS (32-bit recommended)  
- Python 3.7+  
- Chromium browser or Epiphany browser  
- OpenWeatherMap API key ([Get one here](https://openweathermap.org/api))  

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/desk-dashboard.git
cd desk-dashboard
```

### 2. Setup Python virtual enviroment for backend

```bash
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r backend/requirements.txt
```

### 3. Set your OpenWeatherMap API key

```bash
export OPENWEATHER_API_KEY=YOUR_API_KEY
```

### 4. Start Backend 

```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

Can verify with:
```bash
curl http://127.0.0.1:8000/weather
```

### 5. Start Frontend

```bash
cd ../frontend
python3 -m http.server 3000
```

View With: 
```bash
http://127.0.0.1:3000/index.html
```

### 6. Launch in Kiosk Mode

```bashchromium-browser http://127.0.0.1:3000/index.html \
  --incognito --start-fullscreen --disable-gpu --disable-software-rasterizer \
  --noerrdialogs --disable-infobars
```




from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import time
import os
import json
from pathlib import Path

API_KEY =os.getenv("OPENWEATHER_API_KEY")

if not API_KEY:
	raise RuntimeError("OPENWEATHER_API_KEY is not set")

CITY = "Lansing"
UNITS = "imperial"
EVENTS_FILE = Path("events.json")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/weather")
def get_weather():
    url =(
        f"https://api.openweathermap.org/data/2.5/weather"
        f"?q={CITY}&appid={API_KEY}&units={UNITS}"
    )

    r = requests.get(url)
    data = r.json()
    return {
        "temp": round(data["main"]["temp"]),
        "condition": data["weather"][0]["main"],
        "icon": data["weather"][0]["icon"],
        "city": CITY,
        "time": time.strftime("%I:%M %p")
    }

def load_events():
	if not EVENTS_FILE.exists():
		EVENTS_FILE.write_text("[]")
	return json.loads(EVENTS_FIlE.read_text())

def save_events(events):
	EVENTS_FILE.write_text(json.dumps(events, indent=2))

@app.get("/events")
def get_events():
	return load_events()

@app.post("/events")
def add_event(event: dict):
	events = load_events()
	events.append(event)
	save_events(events)
	return {"status": "ok"}

@app.delete("/events/{event_id}")
def delete_event(event_id: str):
	events = load_events()
	events = [e for e in events if e.get("id") != event_id]
	save_events(events)
	return {"status": "ok"} 


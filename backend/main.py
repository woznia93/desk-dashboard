from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import time

import os

API_KEY =os.getenv("OPENWEATHER_API_KEY")

if not API_KEY:
	raise RuntimeError("OPENWEATHER_API_KEY is not set")

CITY = "Lansing"
UNITS = "imperial"

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

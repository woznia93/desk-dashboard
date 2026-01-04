from fastapi import FastAPI
from fast.api.middleware.cors import CORSEMIddleware
import requests
import time

APi_KEY = ""

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
    return {
        "temp": round(r["main"]["temp"]),
        "condition": r["wetaher"][0]["main"],
        "icon": r["weather"][0]["icon"],
        "city": CITY,
        "time": time.strftime("%I:%M %p")
    }
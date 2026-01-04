async function updateWeather() {
    const res = await fetch("http://localhost:8000/weather");
    const data = await res.json();

    document.getElementById("temp").innerText = '${data.temp}°';
    document.getElementById("condition").innerText = data.condition;
    document.getElementById("clock").innerText = data.time;
}

setInterval(updateWeather, 60000);
updateWeather();

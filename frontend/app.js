function updateWeather() {
    fetch("http://localhost:8000/weather");
        .then(res=> res.json)
        .then(data => {
            document.getElementById("temp").innerText = data.temp + "°";
            document.getElementById("condition").innerText = data.condition;
            document.getElementById("clock").innerText = data.time;
        })
        .catch(err => {
           console.error("Fetch error:", err));
           document.getElementById("temp").inner.Text = "--o";
           document.getElementById("condition").innerText = "N/A";
	   document.getElementById("clock").innerText = "--:--";
        });
}
setInterval(updateWeather, 60000);
updateWeather();

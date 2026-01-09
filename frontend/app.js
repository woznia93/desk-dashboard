async function updateWeather() {
    try {
    	const res = await fetch("http://127.0.0.1:8000/weather");
    	const data = await res.json();
    	
        document.getElementById("temp").innerText = data.temp + "°";
        document.getElementById("condition").innerText = data.condition;
        document.getElementById("clock").innerText = data.time;
        }
    catch (err) {
           console.error("Fetch error:", err);
           document.getElementById("temp").inner.Text = "--°";
           document.getElementById("condition").innerText = "N/A";
	   document.getElementById("clock").innerText = "--:--";
        }
}

setInterval(updateWeather, 60000);
updateWeather();

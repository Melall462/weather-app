import { weatherCodeMap } from "./weather.js";

const x = document.querySelector('.cords')

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error)
  } else {
    x.innerHTML = "Geolocation is not supported by this computer."
  }
}

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
    .then(response => response.json())
    .then(data => {
      console.log(data); // All weather info
      const weather = data.current_weather;
      const weatherType = weather.weathercode
      console.log(`Temperature: ${weather.temperature}°C`);
      console.log(`Latitude: ${lat}`)
      console.log(`Longitude: ${lon}`)
      console.log(`Weather Code: ${weatherType}`)
      displayWeather(weatherType);
      getCityFromCoords(lat, lon);
    })
    .catch(error => {
      console.error('Error fetching weather:', error);
    });
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  x.innerHTML = `Error: ${err.message}`;
  alert("Sorry, no position available.");
}


function displayWeather(code) {
  const weatherCode = weatherCodeMap[code];

  if (weatherCode) {
    console.log(weatherCode.emoji);
    console.log(weatherCode.description);
  }
}

function getCityFromCoords(lat, lon) {
  fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
    .then(res => res.json())
    .then(data => {
      const country = data.address.country;
      const village = data.address.village
      const city = data.address.city;
      console.log("City:", country + ", " + village + ', ' + city);
      const parts = [country, village, city].filter(Boolean); // removes falsy values
      document.querySelector(".cords").innerHTML += `<br>City: ${parts.join(", ") || "Unknown"}`;
    })
    .catch(err => console.error("Error fetching city:", err));
}

getLocation();
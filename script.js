import { weatherCodeMap } from "./weather.js";

const spinner = document.getElementById("spinner");
const weatherInfo = document.querySelector(".weather-info");

const countryText = document.querySelector(".country");
const cityText = document.querySelector(".city");
const villageText = document.querySelector(".village");
const weatherTypeText = document.querySelector(".weather-type");
const weatherEmoji = document.querySelector(".weather-emoji");
const temperatureText = document.querySelector(".temperature");
const precipitationText = document.querySelector(".percipitation");
const humidityText = document.querySelector(".humidity");

function getLocation() {
  if (navigator.geolocation) {
    showSpinner();
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    alert("Geolocation is not supported by this computer.");
  }
}

function showSpinner() {
  spinner.style.display = "block";
  weatherInfo.classList.remove("visible");
}

function hideSpinnerAndShowInfo() {
  spinner.style.display = "none";
  weatherInfo.classList.add("visible");
}

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  // Fetch weather and city info in parallel
  const weatherPromise = fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=relative_humidity_2m,precipitation&current_weather=true`
  ).then((res) => res.json());

  const cityPromise = fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
  ).then((res) => res.json());

  Promise.all([weatherPromise, cityPromise])
    .then(([weatherData, cityData]) => {
      const weather = weatherData.current_weather;
      const weatherType = weather.weathercode;
      const humidityHourly = weatherData.hourly.relative_humidity_2m;
      const precipitationHourly = weatherData.hourly.precipitation;

      displayWeather(weatherType);

      countryText.innerHTML = cityData.address.country || "";
      villageText.innerHTML = cityData.address.village || "";
      cityText.innerHTML =
        cityData.address.city ||
        cityData.address.town ||
        cityData.address.hamlet ||
        "";

      temperatureText.innerHTML = `${weather.temperature}°C | ${(
        (weather.temperature * 9) /
        5 +
        32
      ).toFixed(1)}°F`;
      humidityText.innerHTML = `: ${humidityHourly[0]}%`;
      precipitationText.innerHTML = `: ${precipitationHourly[0]} mm`;

      hideSpinnerAndShowInfo();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      alert("Failed to load weather/location data.");
      hideSpinnerAndShowInfo();
    });
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  alert("Sorry, no position available.");
  hideSpinnerAndShowInfo();
}

function displayWeather(code) {
  const weatherCode = weatherCodeMap[code];

  if (weatherCode) {
    weatherTypeText.innerHTML = weatherCode.description;
    weatherEmoji.innerHTML = weatherCode.emoji;
  }
}

getLocation();

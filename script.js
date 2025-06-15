x = document.querySelector('.cords')

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
    })
    .catch(error => {
      console.error('Error fetching weather:', error);
    });
}

function error() {
  alert("Sorry, no position available.");
}

getLocation();
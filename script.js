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

  console.log(lat, lon)
}

function error() {
  alert("Sorry, no position available.");
}

getLocation();
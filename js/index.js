//Retrieving current date
let now = new Date();

//Creating day array to retrieve day in text
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];

//retrieving local AM/PM 12hr time
let time = now.toLocaleString("en-US", {
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});

//Injecting day/time into HTML
let currentDayTime = `${day} ${time}`;
let dayTime = document.querySelector("#date-time");
dayTime.innerHTML = `${currentDayTime}`;

//function to get temp for searched city
function getTemp(response) {
  let searchedCity = response.data.name;
  let currentTemp = Math.round(response.data.main.temp);
  let weatherDescr = response.data.weather[0].description;
  let humidity = Math.round(response.data.main.humidity);
  let wind = Math.round(response.data.wind.speed);

  let city = document.querySelector("#searched-city");
  city.innerHTML = searchedCity;
  let temp = document.querySelector("#temp");
  temp.innerHTML = `${currentTemp}ºF`;
  let description = document.querySelector("#descr");
  description.innerHTML = weatherDescr;
  let humid = document.querySelector("#humidity");
  humid.innerHTML = `Humidity: ${humidity}%`;
  let windSpeed = document.querySelector("#wind");
  windSpeed.innerHTML = `Wind: ${wind}mph`;
}

//Search city function
function searchCity(event) {
  event.preventDefault();
  let enteredCity = document.querySelector("#city-input");
  if (enteredCity.value) {
    //Make API call to WeatherAPI
    let apiKey = "7c14959beb7bd516c3f8d720b9f63f14";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${enteredCity.value}&appid=${apiKey}&units=imperial`;

    axios.get(apiUrl).then(getTemp);
  }
}
let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", searchCity);

//C|F Selection
function displayCelsius(event) {
  event.preventDefault();
  //Add active unit class to celsius link to show that link is selected
  let fLink = document.querySelector("#fahrenheit");
  fLink.classList.remove("activeUnitLink");
  let cLink = document.querySelector("#celsius");
  cLink.classList.add("activeUnitLink");

  let cTemp = document.querySelector("#temp");
  cTemp.innerHTML = 29;
}

function getCoordinates(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;

  let apiKey = "7c14959beb7bd516c3f8d720b9f63f14";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(getTemp);
}

let currentButton = document.querySelector("#current-button");
currentButton.addEventListener(
  "click",
  navigator.geolocation.getCurrentPosition(getCoordinates)
);

function displayFahrenheit(event) {
  event.preventDefault();
  //Add active unit class to fahrenheit link to show that link is selected
  let fLink = document.querySelector("#fahrenheit");
  fLink.classList.add("activeUnitLink");
  let cLink = document.querySelector("#celsius");
  cLink.classList.remove("activeUnitLink");

  let fTemp = document.querySelector("#temp");
  fTemp.innerHTML = 84;
}

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", displayCelsius);
let fahrenLink = document.querySelector("#fahrenheit");
fahrenLink.addEventListener("click", displayFahrenheit);

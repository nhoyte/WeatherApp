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

//Sets global variable value for fahrenheit temperature
let fahrenheitTempGlobal = null;

//function to get temp for searched city
function getTemp(response) {
  console.log(response);
  let searchedCity = response.data.name;
  let currentTemp = Math.round(response.data.main.temp);
  let weatherDescr = response.data.weather[0].description;
  let humidity = Math.round(response.data.main.humidity);
  let wind = Math.round(response.data.wind.speed);
  let iconCode = response.data.weather[0].icon;
  let country = response.data.sys.country;

  //Updating global variable
  fahrenheitTempGlobal = response.data.main.temp;

  let city = document.querySelector("#searched-city");
  city.innerHTML = `${searchedCity}, ${country}`;
  let temp = document.querySelector("#temp");
  temp.innerHTML = `${currentTemp}`;
  let description = document.querySelector("#descr");
  description.innerHTML = weatherDescr;
  let humid = document.querySelector("#humidity");
  humid.innerHTML = `Humidity: ${humidity}%`;
  let windSpeed = document.querySelector("#wind");
  windSpeed.innerHTML = `Wind: ${wind}mph`;
  let iconElement = document.querySelector("#weather-icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  ); //sets src HTML element attribute
  iconElement.setAttribute("alt", `${weatherDescr}`); //sets alt HTML element attribute

  //Sets fahrenheit link to active since fahrenheit temperature is displayed by default
  fahrenLink.classList.add("activeUnitLink");
  celsiusLink.classList.remove("activeUnitLink");

  getForecast();
}

function getForecast() {
  let forecastRow = document.querySelector("#forecast-row");

  let forecastSection = ``;

  let testDays = ["Mon", "Tues", "Wed", "Thurs", "Fri"];
  console.log(testDays);
  testDays.forEach(function (day) {
    forecastSection += `
    <div class="col">
          <div class="forecastDay">${day}</div>
          <div class="forecastIcon">
            <img src="https://openweathermap.org/img/wn/11d@2x.png" alt="40" />
          </div>
          <div class="forecastTemp">
            <span class="forecastMax">89º</span> /
            <span class="forecastMin">76º</span>
          </div>
    </div>
    `;
  });

  forecastRow.innerHTML = forecastSection;
  console.log(forecastSection);
}

//Retrieves input when search button is clicked
function searchSubmit(event) {
  //Recieves city input
  event.preventDefault();
  let cityElement = document.querySelector("#city-input");
  searchCity(cityElement.value);
}

//Search city function
function searchCity(city) {
  //Make API call to WeatherAPI
  let apiKey = "7c14959beb7bd516c3f8d720b9f63f14";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(getTemp);
}

//Function to search weather info by coordinates using Geolocation API
function getCoordinates(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;

  let apiKey = "7c14959beb7bd516c3f8d720b9f63f14";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(getTemp);
}

//C|F Selection
function displayCelsius(event) {
  event.preventDefault();
  //Add active unit class to celsius link to show that link is selected
  fahrenLink.classList.remove("activeUnitLink");
  celsiusLink.classList.add("activeUnitLink");

  let cTempElement = document.querySelector("#temp");
  let cTemp = (fahrenheitTempGlobal - 32) * (5 / 9);
  cTempElement.innerHTML = Math.round(cTemp);
}

function displayFahrenheit(event) {
  event.preventDefault();
  //Add active unit class to fahrenheit link to show that link is selected
  fahrenLink.classList.add("activeUnitLink");
  celsiusLink.classList.remove("activeUnitLink");

  let fTemp = document.querySelector("#temp");
  fTemp.innerHTML = Math.round(fahrenheitTempGlobal);
}

//Adding event listener to search button
let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", searchSubmit);

//Adding event listener to 'current location' button
let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(getCoordinates);
});

//Adding event listeners to unit links
let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", displayCelsius);
let fahrenLink = document.querySelector("#fahrenheit");
fahrenLink.addEventListener("click", displayFahrenheit);

//Adding event listeners to city links
let charlotte = document.querySelector("#charlotte-link");
charlotte.addEventListener("click", () => {
  searchCity("charlotte");
});
let concord = document.querySelector("#concord-link");
concord.addEventListener("click", () => {
  searchCity("concord");
});
let matthews = document.querySelector("#matthews-link");
matthews.addEventListener("click", () => {
  searchCity("matthews");
});

let rockHill = document.querySelector("#rockhill-link");
rockHill.addEventListener("click", () => {
  searchCity("rock hill");
});

//Default is to show weather info for Hollywood, CA
searchCity("hollywood");

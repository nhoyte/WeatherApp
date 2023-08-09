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

//Function to display current time
function displayCurrentTime() {
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
}

//Function to display formatted date
function displayDayFormatted(timestamp) {
  let dateObject = new Date(timestamp * 1000);
  let day = days[dateObject.getDay()];
  return day;
}

//function to get temp for searched city
function getTemp(response) {
  let searchedCity = response.data.city;
  let currentTemp = Math.round(response.data.temperature.current);
  let weatherDescr = response.data.condition.description;
  let humidity = Math.round(response.data.temperature.humidity);
  let wind = Math.round(response.data.wind.speed);
  let iconCode = response.data.condition.icon;
  let feelsLike = Math.round(response.data.temperature.feels_like);

  let city = document.querySelector("#searched-city");
  city.innerHTML = `${searchedCity}`;
  let temp = document.querySelector("#temp");
  temp.innerHTML = `${currentTemp}`;
  let description = document.querySelector("#descr");
  description.innerHTML = weatherDescr;
  let feelsLikeElement = document.querySelector("#feels-like");
  feelsLikeElement.innerHTML = `Feels Like: ${feelsLike}º`;
  let humid = document.querySelector("#humidity");
  humid.innerHTML = `Humidity: ${humidity}%`;
  let windSpeed = document.querySelector("#wind");
  windSpeed.innerHTML = `Wind: ${wind} mph`;
  let iconElement = document.querySelector("#weather-icon");
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${iconCode}.png`
  ); //sets src HTML element attribute
  iconElement.setAttribute("alt", `${weatherDescr}`); //sets alt HTML element attribute
  getForecast(response.data.coordinates);
}

//Make API call to retrieve forecast
function getForecast(coordinates) {
  let lat = coordinates.latitude;
  let lon = coordinates.longitude;
  let apiKey = "b00377005017b9aacft302b5od1aa426";
  let forecastApiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${lon}&lat=${lat}&key=${apiKey}&units=imperial`;

  axios.get(forecastApiUrl).then(displayForecast);
}

//Function to display forecast for next 5 days
function displayForecast(response) {
  let forecastRow = document.querySelector("#forecast-row");
  let forecastSection = ``;
  let nextDaysForecast = response.data.daily;
  for (let i = 1; i < 6; i++) {
    let day = displayDayFormatted(nextDaysForecast[i].time);
    let iconCode = nextDaysForecast[i].condition.icon;
    let max = Math.round(nextDaysForecast[i].temperature.maximum);
    let min = Math.round(nextDaysForecast[i].temperature.minimum);

    forecastSection += `
    <div class="col border rounded forecastCard">
      <div class="forecastDay">${day}</div>
          <div class="forecastIcon">
            <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${iconCode}.png" alt="" />
          </div>
          <div class="forecastTemp">
            <span class="forecastMax">${max}º</span> /
            <span class="forecastMin">${min}º</span>
          </div>
    </div>
    `;
  }

  forecastRow.innerHTML = forecastSection;
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
  //Make API call to SheCodes API
  let apiKey = "b00377005017b9aacft302b5od1aa426";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(getTemp);
}

//Function to make API call using Geolocation API
function getCoordinates(position) {
  const lat = position.coords.latitude;
  const long = position.coords.longitude;
  let apiKey = "b00377005017b9aacft302b5od1aa426";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${long}&lat=${lat}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(getTemp);
}

//Adding event listener to search button
let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", searchSubmit);

//Adding event listener to 'current location' button
let currentButton = document.querySelector("#current-button");
currentButton.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(getCoordinates);
});

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

//Display current day/time
displayCurrentTime();

//Default is to show weather info for Hollywood
searchCity("hollywood");

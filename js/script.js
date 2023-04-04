const apiKey = "ea120cfa79c64d251422157a2c338243";
const searchBtn = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");
const searchHistory = document.getElementById("search-history");
const currentWeather = document.getElementById("current-weather");
const forecast = document.getElementById("forecast");

searchBtn.addEventListener("click", () => {
    const cityName = searchInput.value.trim();
    if (cityName) {
        getWeatherData(cityName);
        addCityToHistory(cityName);
    }
});

function getWeatherData(cityName) {
    const coordUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
    
    fetch(coordUrl)
        .then(response => response.json())
        .then(data => {
            const { lat, lon } = data.coord;
            const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
            return fetch(weatherUrl);
        })
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            displayForecast(data);
        });
}

function displayCurrentWeather(data) {
    const { city, list } = data;
    const current = list[0];
    
    const weatherCard = `
        <div class="weather-card">
            <h2>${city.name} (${new Date(current.dt_txt).toLocaleDateString()})</h2>
            <img src="https://openweathermap.org/img/wn/${current.weather[0].icon}.png" alt="${current.weather[0].description}">
            <p>Temperature: ${current.main.temp}°C</p>
            <p>Humidity: ${current.main.humidity}%</p>
            <p>Wind Speed: ${current.wind.speed} m/s</p>
        </div>
    `;
    currentWeather.innerHTML = weatherCard;
}

function displayForecast(data) {
    const dailyData = data.list.filter(item => item.dt_txt.endsWith("12:00:00"));

    let forecastCards = '';
    dailyData.forEach(day => {
        forecastCards += `
            <div class="forecast-card">
                <h3>${new Date(day.dt_txt).toLocaleDateString()}</h3>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="${day.weather[0].description}">
                <p>Temperature: ${day.main.temp}°C</p>
                <p>Wind Speed: ${day.wind.speed} m/s</p>
                <p>Humidity: ${day.main.humidity}%</p>
            </div>
        `;
    });

    forecast.innerHTML = forecastCards;
}

function addCityToHistory(cityName) {
    const cityBtn = document.createElement("button");
    cityBtn.textContent = cityName;
    cityBtn.classList.add("search-history-btn");
    searchHistory.appendChild(cityBtn);

    cityBtn.addEventListener("click", () => {
        getWeatherData(cityName);
    });
}

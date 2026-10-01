const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const cityElement = document.querySelector(".city");
const tempElement = document.querySelector(".temp");
const conditionElement = document.querySelector(".condition");

const weatherIcon = document.getElementById("weatherIcon");

const humidityElement = document.getElementById("humidity");
const windElement = document.getElementById("wind");
const pressureElement = document.getElementById("pressure");
const visibilityElement = document.getElementById("visibility");
const feelsLikeElement = document.getElementById("feelsLike");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const weatherContent = document.getElementById("weatherContent");


async function getCoordinates(city) {

    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to find city.");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("City not found.");
    }

    return data.results[0];
}


async function checkWeather(city) {

    if (!city.trim()) {
        errorMessage.textContent = "Please enter a city name.";
        return;
    }

    loading.style.display = "block";
    weatherContent.style.display = "none";
    errorMessage.textContent = "";


    try {

        // First find city coordinates
        const location = await getCoordinates(city);


        // Get current weather
        const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,pressure_msl,wind_speed_10m,visibility&wind_speed_unit=kmh&timezone=auto`;

        const response = await fetch(weatherUrl);

        if (!response.ok) {
            throw new Error("Weather data unavailable.");
        }

        const data = await response.json();

        console.log(data);


        const current = data.current;


        // City
        cityElement.textContent = location.name;


        // Temperature
        tempElement.textContent =
            Math.round(current.temperature_2m) + "°";


        // Feels like
        feelsLikeElement.textContent =
            Math.round(current.apparent_temperature) + "°C";


        // Humidity
        humidityElement.textContent =
            current.relative_humidity_2m + "%";


        // Wind
        windElement.textContent =
            Math.round(current.wind_speed_10m) + " km/h";


        // Pressure
        pressureElement.textContent =
            Math.round(current.pressure_msl) + " hPa";


        // Visibility
        visibilityElement.textContent =
            (current.visibility / 1000).toFixed(1) + " km";


        // Weather condition
        const weather = getWeatherInfo(current.weather_code);

        conditionElement.textContent = weather.text;

        weatherIcon.textContent = weather.icon;


        // Show weather
        loading.style.display = "none";
        weatherContent.style.display = "block";

    }

    catch (error) {

        loading.style.display = "none";
        weatherContent.style.display = "none";

        errorMessage.textContent =
            error.message || "Something went wrong.";
    }
}


function getWeatherInfo(code) {

    if (code === 0) {
        return {
            text: "Clear Sky",
            icon: "☀️"
        };
    }

    if (code === 1 || code === 2) {
        return {
            text: "Partly Cloudy",
            icon: "🌤️"
        };
    }

    if (code === 3) {
        return {
            text: "Overcast",
            icon: "☁️"
        };
    }

    if ([45, 48].includes(code)) {
        return {
            text: "Foggy",
            icon: "🌫️"
        };
    }

    if ([51, 53, 55, 56, 57].includes(code)) {
        return {
            text: "Drizzle",
            icon: "🌦️"
        };
    }

    if ([61, 63, 65, 66, 67].includes(code)) {
        return {
            text: "Rain",
            icon: "🌧️"
        };
    }

    if ([71, 73, 75, 77].includes(code)) {
        return {
            text: "Snow",
            icon: "❄️"
        };
    }

    if ([80, 81, 82].includes(code)) {
        return {
            text: "Rain Showers",
            icon: "🌦️"
        };
    }

    if ([85, 86].includes(code)) {
        return {
            text: "Snow Showers",
            icon: "🌨️"
        };
    }

    if ([95, 96, 99].includes(code)) {
        return {
            text: "Thunderstorm",
            icon: "⛈️"
        };
    }

    return {
        text: "Unknown",
        icon: "🌡️"
    };
}


// Search button
searchBtn.addEventListener("click", () => {

    checkWeather(searchInput.value);

});


// Enter key
searchInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        checkWeather(searchInput.value);
    }

});


// Default city
checkWeather("Lahore");
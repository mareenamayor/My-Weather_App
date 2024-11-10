// script.js

const updateFiveDayForecast = (forecastData) => {
  const weatherCards = document.querySelectorAll(".weather-cards .card");

  forecastData.forEach((day, index) => {
    if (index <= 5) {
      const card = weatherCards[index];
      card.querySelector("h3").textContent = day.date;
      card.querySelector("h4:nth-of-type(1)").textContent = `Temperature: ${day.temperature}°C`;
      card.querySelector("h4:nth-of-type(2)").textContent = `Wind: ${day.wind} M/s`;
      card.querySelector("h4:nth-of-type(3)").textContent = `Humidity: ${day.humidity}%`;
    }
  });
};


const getFiveDayForecast = (cityName) => {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=b2355334a90e07b0f4b2ace73e49aa03&units=metric`)
    .then((res) => res.json())
    .then((data) => {
      const fiveDayForecast = [];

      data.list.forEach((forecast) => {
        const day = {
          date: forecast.dt_txt,
          temperature: forecast.main.temp,
          wind: forecast.wind.speed,
          humidity: forecast.main.humidity
        };
        fiveDayForecast.push(day);
      });

      updateFiveDayForecast(fiveDayForecast);
    })
    .catch((error) => {
      console.error("Error fetching 5-day forecast:", error);
      alert("An error occurred while fetching 5-day forecast");
    });
};

const updateCurrentWeather = (data) => {
  const currentwDataDiv = document.querySelector(".currentw-data");
  const iconCode = data.icon;
  const weatherImage = document.createElement('img');
  weatherImage.src = 'https://openweathermap.org/img/wn/' + iconCode + '@2x.png';
  weatherImage.alt = 'Weather Icon';

  currentwDataDiv.innerHTML = `
    <div class="details">
      <h2>${data.city} (${data.weather_when.split(" ")[0]})</h2>
      <h4>Temperature: ${data.weather_temperature}°C</h4>
      <h4>Wind: ${data.weather_wind} M/S</h4>
      <h4>Humidity: ${data.weather_humidity}%</h4>
    </div>
    <div class="weather-img">
      <img src="${weatherImage.src}" alt="${weatherImage.alt}">
    </div>
  `;
};


const getWeatherDetails = (cityName) => {
  fetch(`https://mi-linux.wlv.ac.uk/~2411779/my-api.php?city=${cityName}`)
    .then((res) => res.json())
    .then((data) => {
      updateCurrentWeather(data);
      getFiveDayForecast(cityName);
    })
    .catch((error) => {
      console.error("Error fetching weather details:", error);
      alert("An error occurred while fetching weather details");
    });
};

const locationButton = document.querySelector(".locate-button");
const searchButton = document.querySelector(".search-button");
const cityInput = document.querySelector(".city-input");

locationButton.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=b2355334a90e07b0f4b2ace73e49aa03`)
        .then((res) => res.json())
        .then((data) => {
          const cityName = data.name;
          getWeatherDetails(cityName);
        })
        .catch((error) => {
          console.error("Error fetching location-based weather:", error);
          alert("An error occurred while fetching location-based weather data");
        });
    });
  } else {
    console.error("Geolocation is not supported by this browser");
    alert("Geolocation is not supported by this browser");
  }
});

searchButton.addEventListener("click", () => {
  const cityName = cityInput.value.trim();
  if (!cityName) return;
  getWeatherDetails(cityName);
});

cityInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const cityName = cityInput.value.trim();
    if (!cityName) return;
    getWeatherDetails(cityName);
  }
});

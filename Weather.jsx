import React, { useState, useEffect } from 'react';
import './Weather.css';
import searchIcon from '../assets/search.png';
import clearIcon from '../assets/clear.png';
import cloudIcon from '../assets/cloud.png';
import drizzleIcon from '../assets/drizzle.png';
import rainIcon from '../assets/rain.png';
import snowIcon from '../assets/snow.png';
import windIcon from '../assets/wind.png';
import humidityIcon from '../assets/humidity.png';

// Step 1: Define the component
const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [inputCity, setInputCity] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Icons map
  const allIcons = {
    '01d': clearIcon,
    '01n': clearIcon,
    '02d': cloudIcon,
    '02n': cloudIcon,
    '03d': cloudIcon,
    '03n': cloudIcon,
    '09d': drizzleIcon,
    '09n': drizzleIcon,
    '10d': rainIcon,
    '10n': rainIcon,
    '13d': snowIcon,
    '13n': snowIcon,
  };

  // Step 2: Search weather data based on city
  const searchWeather = async (city) => {
    try {
      setErrorMessage(''); // Clear previous errors
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        const icon = allIcons[data.weather[0].icon] || clearIcon;

        setWeatherData({
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          temperature: Math.floor(data.main.temp),
          location: data.name,
          icon: icon,
        });
      } else {
        setErrorMessage(data.message || 'City not found');
      }
    } catch (error) {
      setErrorMessage('Error fetching weather data');
    }
  };

  // Step 3: Fetch multiple cities and their weather
  const fetchWeatherForCities = async (cities) => {
    try {
      const weatherResults = [];
      for (let city of cities) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok) {
          weatherResults.push(data);
        }
      }
      return weatherResults;
    } catch (error) {
      console.error("Error fetching weather for multiple cities:", error);
    }
  };

  // Step 4: Example usage of fetching cities
  useEffect(() => {
    const cities = ["Bengaluru", "Delhi", "Mumbai"]; // Example cities of a country
    fetchWeatherForCities(cities).then((results) => {
      console.log("Weather for multiple cities:", results);
    });
  }, []);

  // Step 5: Handle search input and city search
  const handleSearch = () => {
    if (inputCity.trim()) {
      searchWeather(inputCity);
      setInputCity(''); // Clear input field
    }
  };

  return (
    <div className='weather'>
      <div className="search-bar">
        <input
          type="text"
          placeholder='Search city'
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
        />
        <img src={searchIcon} alt="Search icon" onClick={handleSearch} />
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {weatherData && (
        <>
          <img src={weatherData.icon} alt="Weather icon" className='weather-icon' />
          <p className='temperature'>{weatherData.temperature}°C</p>
          <p className='location'>{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidityIcon} alt="Humidity icon" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={windIcon} alt="Wind icon" />
              <div>
                <p>{weatherData.windSpeed} km/hr</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;

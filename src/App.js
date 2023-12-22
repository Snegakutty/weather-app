import React, { useState } from 'react';
import './App.css';

const apiKey ='ba8daaf3638a0bd1d68274c949452d42';

const App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const fetchWeatherData = async (city) => {
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    try {
      const response = await fetch(apiUrl);

      // Check if the response is successful (status code in the range 200-299)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error fetching weather data');
      }

      const data = await response.json();

      return {
        city: data.name,
        temperature: (data.main.temp - 273.15).toFixed(2), // Convert from Kelvin to Celsius
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      };
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
      throw error;
    }
  };

  const getWeather = async () => {
    try {
      if (!city.trim()) {
        setError('Please enter a city name.');
        return;
      }

      const data = await fetchWeatherData(city);
      setWeatherData(data);
      setError(null); // Clear any previous errors
    } catch (error) {
      // Handle error (e.g., display an error message)
      setError(error.message || 'Error getting weather data. Please try again.');
      console.error('Error getting weather data:', error);
    }
  };

  return (
    <div className="App">
      <h1>Weather App</h1>
      <label htmlFor="city">Enter City:</label>
      <input
        type="text"
        id="city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        required
      />
      <button onClick={getWeather}>Get Weather</button>
      {error && (
        <div className="error-container">
          <p className="error">{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      {weatherData && (
        <div>
          <h2>Weather in {weatherData.city}</h2>
          <p>Temperature: {weatherData.temperature}°C</p>
          <p>Description: {weatherData.description}</p>
          <img src={`http://openweathermap.org/img/w/${weatherData.icon}.png`} alt="Weather Icon" />
          <button onClick={() => setWeatherData(null)}>Go back</button>
        </div>
      )}
    </div>
  );
};

export default App;

import React, { useEffect, useState } from "react";

export default function About() {
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude);
          setLong(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting geolocation: ", error);
        }
      );
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (lat !== null && long !== null) {
        try {
          const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&APPID=${bd50b9d71bd1a0a6ab5ce8c2ff0d3915}`
          );
          const weatherResult = await weatherResponse.json();
          setWeatherData(weatherResult);
        } catch (error) {
          console.error("Error fetching weather data: ", error);
        }
      }
    };
    fetchWeatherData();
  }, [lat, long]);

  useEffect(() => {
    const fetchAqiData = async () => {
      if (lat !== null && long !== null) {
        try {
          const aqiResponse = await fetch(
            `https://api.openaq.org/v1/latest?coordinates=${lat},${long}`
          );
          const aqiResult = await aqiResponse.json();
          setAqiData(aqiResult.results[0].measurements.find(measurement => measurement.parameter === 'pm25'));
        } catch (error) {
          console.error("Error fetching AQI data: ", error);
        }
      }
    };
    fetchAqiData();
  }, [lat, long]);

  const Pressed = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&APPID=${process.env.bd50b9d71bd1a0a6ab5ce8c2ff0d3915}`
      );
      const result = await response.json();
      setWeatherData(result);
    } catch (error) {
      console.error("Error fetching weather data: ", error);
    }
  };

  return (
    <div className="air">
      <div className="Search">
        <input
          type="text"
          placeholder="Enter the city name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={Pressed}>Search</button>
      </div>
      {weatherData && (
        <div>
          <p>Location: {weatherData.name}</p>
          <p>Temperature: {weatherData.main.temp} °C</p>
          <p>Description: {weatherData.weather[0].description}</p>
        </div>
      )}
      {aqiData && (
        <div>
          <p>Air Quality Index: {aqiData.value}</p>
          <p>Time: {new Date(aqiData.lastUpdated).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}

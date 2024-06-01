import { useState, useEffect } from "react";
import Flag from "react-world-flags";

const api = {
  key: "bd50b9d71bd1a0a6ab5ce8c2ff0d3915",
  base: "https://api.openweathermap.org/data/2.5/",
};

const weatherEmoji = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
  Smoke: "🌫️",
  Haze: "🌫️",
  Dust: "🌫️",
  Fog: "🌫️",
  Sand: "🌫️",
  Ash: "🌫️",
  Squall: "🌬️",
  Tornado: "🌪️",
};

const temperatureEmoji = (temp) => {
  if (temp < 0) return "❄️";
  if (temp < 10) return "🧥";
  if (temp < 20) return "🌼";
  if (temp < 30) return "🌞";
  return "🥵";
};

const cities = ["tumkur","New York", "London", "Paris", "nuuk", "jaipur","bengaluru","java","moscow","gaza"];

export default function App() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [multiCityWeather, setMultiCityWeather] = useState([]);

  const fetchWeatherData = (city) => {
    return fetch(`${api.base}weather?q=${city}&units=metric&APPID=${api.key}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Invalid entry: ${res.status}`);
        }
        return res.json();
      })
      .catch((error) => {
        console.error(`Error fetching weather for ${city}:`, error);
        return null;
      });
  };

  const Pressed = () => {
    fetchWeatherData(search)
      .then((result) => {
        if (result) {
          setWeather(result);
          setError(null);
        } else {
          setError("Failed to fetch weather data");
        }
      })
      .catch((error) => {
        setError(error.message);
        setWeather(null);
      });
  };

  useEffect(() => {
    const fetchAllCitiesWeather = async () => {
      const weatherData = await Promise.all(
        cities.map((city) => fetchWeatherData(city))
      );
      setMultiCityWeather(weatherData.filter((data) => data !== null));
    };

    fetchAllCitiesWeather();
  }, []);

  return (
    <div className="App">
      <h1>Lets see what's happening in your city..</h1>
      <div className="Search">
        <input
          type="text"
          placeholder="Enter the city name..."
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={Pressed}>Search</button>
      </div>
      <div className="whole">
      <div className="location">
        <p>
          {weather ? (
            <>
              Location: {weather.name}, {weather.sys.country}{" "}
              <Flag
                code={weather.sys.country}
                alt="country flag"
                style={{ width: "30px", height: "auto" }}
              />
            </>
          ) : (
            " "
          )}
        </p>
      </div>
      <div className="temp">
        <p>
          {weather
            ? `Temperature: ${weather.main.temp}°C ${temperatureEmoji(
                weather.main.temp
              )}`
            : ""}
        </p>
      </div>
      <div className="condition">
        <p>
          {weather ? (
            <>
              Condition: {weather.weather[0].description}{" "}
              {weatherEmoji[weather.weather[0].main] || ""}
            </>
          ) : (
            " "
          )}
        </p>
      </div>
      {error && (
        <div className="error">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
      <div className="Footer">
        <div className="ticker">
          {multiCityWeather.map((cityWeather, index) => (
            <span key={index} className="ticker-item">
              {cityWeather.name}<Flag
                code={cityWeather.sys.country}
                alt="country flag"
                style={{ width: "20px", height: "auto", marginLeft: "10px" }}
              />
              : {cityWeather.weather[0].description}{" "}
              {weatherEmoji[cityWeather.weather[0].main] || ""}{" "}
              {temperatureEmoji(cityWeather.main.temp)} |
             
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

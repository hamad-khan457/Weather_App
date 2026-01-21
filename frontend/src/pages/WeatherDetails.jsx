import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { weatherAPI } from '../services/api';

const WeatherDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.weatherData) {
      setWeatherData(location.state.weatherData);
      fetchForecast(location.state.weatherData.city);
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  const fetchForecast = async (city) => {
    setLoading(true);
    try {
      const response = await weatherAPI.getForecast(city);
      setForecast(response.data.data.forecast.slice(0, 8));
    } catch (err) {
      console.error('Error fetching forecast:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!weatherData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-6 bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
        >
          ← Back to Search
        </button>

        <div className="bg-white rounded-lg shadow-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {weatherData.city}, {weatherData.country}
            </h1>
            <p className="text-gray-600 text-lg">
              {weatherData.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <p className="text-gray-600 mb-2">Temperature</p>
              <p className="text-4xl font-bold text-blue-600">
                {Math.round(weatherData.temperature)}°C
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <p className="text-gray-600 mb-2">Feels Like</p>
              <p className="text-4xl font-bold text-blue-600">
                {Math.round(weatherData.feelsLike)}°C
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <p className="text-gray-600 mb-2">Humidity</p>
              <p className="text-4xl font-bold text-blue-600">
                {weatherData.humidity}%
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <p className="text-gray-600 mb-2">Wind Speed</p>
              <p className="text-4xl font-bold text-blue-600">
                {weatherData.windSpeed} m/s
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-1">Pressure</p>
              <p className="text-2xl font-semibold text-gray-800">
                {weatherData.pressure} hPa
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-1">Cloudiness</p>
              <p className="text-2xl font-semibold text-gray-800">
                {weatherData.clouds}%
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-600 mb-1">Condition</p>
              <p className="text-2xl font-semibold text-gray-800">
                {weatherData.weatherCondition}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-white text-xl">
            Loading forecast...
          </div>
        ) : forecast.length > 0 && (
          <div className="bg-white rounded-lg shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              3-Hour Forecast
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {forecast.map((item, index) => (
                <div
                  key={index}
                  className="bg-blue-50 p-4 rounded-lg text-center"
                >
                  <p className="text-sm text-gray-600 mb-2">
                    {new Date(item.date).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-2xl font-bold text-blue-600 mb-1">
                    {Math.round(item.temperature)}°C
                  </p>
                  <p className="text-sm text-gray-700">
                    {item.weatherCondition}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDetails;
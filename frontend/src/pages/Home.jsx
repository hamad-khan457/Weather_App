import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { weatherAPI } from '../services/api';

const Home = () => {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await weatherAPI.getSearchHistory();
      setHistory(response.data.data || []);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await weatherAPI.getCurrentWeather(city);
      navigate('/weather', { 
        state: { weatherData: response.data.data } 
      });
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to fetch weather data'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = async (cityName) => {
    setCity(cityName);
    try {
      const response = await weatherAPI.getCurrentWeather(cityName);
      navigate('/weather', { 
        state: { weatherData: response.data.data } 
      });
    } catch (err) {
      setError('Failed to fetch weather data');
    }
  };

  const handleDeleteHistory = async (id) => {
    try {
      await weatherAPI.deleteHistory(id);
      fetchHistory();
    } catch (err) {
      console.error('Error deleting history:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Weather App
          </h1>
          <p className="text-xl text-blue-100">
            Get real-time weather information for any city
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-2xl p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="city" 
                className="block text-gray-700 font-semibold mb-2"
              >
                Enter City Name
              </label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., London, New York, Tokyo"
              />
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Get Weather'}
            </button>
          </form>
        </div>

        {history.length > 0 && (
          <div className="bg-white rounded-lg shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Recent Searches
            </h2>
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div 
                    onClick={() => handleHistoryClick(item.city)}
                    className="flex-1 cursor-pointer"
                  >
                    <p className="font-semibold text-gray-800">
                      {item.city}, {item.country}
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.temperature ? `${Math.round(item.temperature)}°C` : 'N/A'} - {item.weatherCondition || 'Unknown'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteHistory(item._id)}
                    className="ml-4 text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
const axios = require('axios');
const SearchHistory = require('../models/SearchHistory');

// Function to get current weather data
exports.getCurrentWeather = async (req, res) => {
    try {
        const {city} = req.query;

        if(!city) {
            return res.status(400).json(
                {
                    success: false,
                    message: 'City name is required'
                }
            );
        }

        const response = await axios.get(`${process.env.WEATHER_API_URL}/weather`, 
            {
                params: {
                    q: city, 
                    appid: process.env.WEATHER_API_KEY ,
                    units: 'metric'
                }
            }
        );

        const weatherData = {
            city: response.data.name,
            country: response.data.sys.country,
            temperature: response.data.main.temp,
            feelsLike : response.data.main.feels_like,
            humidity: response.data.main.humidity,
            pressure: response.data.main.pressure,
            weatherCondition: response.data.weather[0].description,
            description: response.data.weather[0].description,
            icon : response.data.weather[0].icon,
            windSpeed: response.data.wind.speed,
            clouds: response.data.clouds.all
        };
            
        
       await SearchHistory.findOneAndUpdate(
        { city: weatherData.city },
        {
            city: weatherData.city,
            country: weatherData.country,
            temperature: weatherData.temperature,
            weatherCondition: weatherData.weatherCondition,
            searchedAt: new Date()
        },
        { upsert: true, new: true }
        );

        res.status(200).json(
            {
                success: true,
                data: weatherData
            });

    } catch (error) {
        if(error.response && error.response.status === 404) {
            return res.status(404).json(
                {
                    success: false,
                    message: 'City not found'
                }
            );
        }

        res.status(500).json(
            {
                success: false,
                message: 'Server Error fetching the weather data',
                error: error.message
            }
        );
    }
};
exports.getForecast = async (req, res) => {
    try {
        const {city} = req.query;   

        if(!city) {
            return res.status(400).json(
                {
                    success: false,
                    message: 'City name is required'
                }
            );
        }   
        const response = await axios.get(`${process.env.WEATHER_API_URL}/forecast`,
            {
                params: {
                    q: city,
                    appid: process.env.WEATHER_API_KEY,
                    units: 'metric'
                }
            }
        );  
        const forecastData = response.data.list.map(item => ({
            date : item.dt_txt,
            temperature: item.main.temp,
            weatherCondition: item.weather[0].main,
            description: item.weather[0].description,
            icon : item.weather[0].icon,

        }));

        res.status(200).json(
            {
                success: true,
                data: {
                    city: response.data.city.name,
                    country: response.data.city.country,
                    forecast: forecastData
                }
            }
        );

    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: 'Server Error fetching the forecast data',
                error: error.message
            }
        );
    }
};

exports.getSearchHistory = async (req, res) => {
    try {
        const history = await SearchHistory.find().sort({searchedAt: -1}).limit(10);    

        res.status(200).json(
            {
                success: true,
                data: history
            }
        );

    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: ' Error fetching the search history',
                error: error.message
            }
        );
    }
};

exports.deleteHistory = async (req, res) => {
    try {
        const {id} = req.params;

        await SearchHistory.findByIdAndDelete(id);

        res.status(200).json(
            {
                success: true,
                message: 'history deleted successfully'
            }
        );
    
    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: 'Error deleting the history',
                error: error.message
            }
        );
    }
};


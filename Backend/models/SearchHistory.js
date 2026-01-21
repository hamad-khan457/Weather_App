const mongoose = require('mongoose');

const SearchHistorySchema = new mongoose.Schema({
    city: {
        type: String,
        required: true,
        trim: true
    },
    country : {
        type: String,
        trim : true
    },
    Temperature: {
        type: Number,
    },
    WeatherCondition: {
        type: String,
    },
    searchedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SearchHistory', SearchHistorySchema);
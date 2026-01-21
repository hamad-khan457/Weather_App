const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  temperature: {
    type: Number
  },
  weatherCondition: {
    type: String
  },
  searchedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
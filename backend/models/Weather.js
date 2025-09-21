const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  location: {
    name: { type: String, required: true },
    country: { type: String, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true }
  },
  current: {
    temperature: { type: Number, required: true },
    feels_like: { type: Number, required: true },
    humidity: { type: Number, required: true },
    pressure: { type: Number, required: true },
    wind_speed: { type: Number, required: true },
    wind_direction: { type: Number, required: true },
    visibility: { type: Number, required: true },
    uv_index: { type: Number, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }
  },
  forecast: [{
    date: { type: Date, required: true },
    temperature: {
      min: { type: Number, required: true },
      max: { type: Number, required: true }
    },
    humidity: { type: Number, required: true },
    wind_speed: { type: Number, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }
  }],
  farming_advice: {
    crop_suitability: { type: String, required: true },
    irrigation_needed: { type: Boolean, required: true },
    pest_risk: { type: String, required: true },
    harvest_recommendation: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
weatherSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Weather', weatherSchema);

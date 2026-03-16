const mongoose = require('mongoose');

const crewSchema = new mongoose.Schema({
  name: String,
  role: { type: String, enum: ['driver', 'conductor'], required: true },
  status: { type: String, enum: ['available', 'resting', 'onDuty'], default: 'available' },
  trainedRoutes: [String],
  lastAssignedTime: {
    type: Date,
    default: null // or Date.now if needed
  }
});

module.exports = mongoose.model('Crew', crewSchema);


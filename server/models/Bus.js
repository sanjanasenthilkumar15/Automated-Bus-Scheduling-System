const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: String,
  status: {
    type: String,
    enum: ['active', 'maintenance'],
    default: 'active'
  },
  depot: String
});

module.exports = mongoose.model('Bus', busSchema);

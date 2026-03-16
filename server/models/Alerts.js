const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  message: { type: String, required: true },
  date: { type: String, required: true } // format: 'YYYY-MM-DD'
});

module.exports = mongoose.model('Alert', alertSchema);

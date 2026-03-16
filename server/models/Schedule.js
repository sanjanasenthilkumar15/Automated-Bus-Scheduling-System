const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  route: String,
  bus: String,
  driver: String,
  conductor: String,
  shift: String,
  time: String,
  // add other fields as needed
});

const ScheduleSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },  // ISO format date string, e.g. "2025-07-29"
  assignments: [AssignmentSchema],
});

module.exports = mongoose.model('Schedule', ScheduleSchema);

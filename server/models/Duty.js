const mongoose = require('mongoose');

const dutySchema = new mongoose.Schema({
  crew: { type: mongoose.Schema.Types.ObjectId, ref: 'Crew', required: true },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  type: { type: String, enum: ['Linked', 'Unlinked'], required: true },
  date: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Duty', dutySchema);

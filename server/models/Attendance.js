const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  uid: { type: String, required: true, index: true },
  email: { type: String, required: true },
  displayName: { type: String },
  date: { type: String, required: true }, // YYYY-MM-DD
  inTime: { type: Date },
  outTime: { type: Date },
  locationType: {
    type: String,
    enum: ['in-office', 'outside-office', 'remote'],
    default: 'in-office',
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'half-day', 'leave'],
    default: 'present',
  },
  notes: { type: String, default: '' },
  totalHours: { type: Number, default: 0 },
}, { timestamps: true });

attendanceSchema.index({ uid: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  displayName: { type: String },
  photoURL: { type: String },
  department: { type: String, default: '' },
  role: { type: String, default: 'employee' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

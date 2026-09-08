const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // no two users can share an email
  },
  password: {
    type: String,
    required: true, // will store a HASHED password, never plain text
  },
  role: {
    type: String,
    enum: ['student', 'instructor'], // only these two values allowed
    default: 'student',
  },
}, { timestamps: true }); // auto-adds createdAt and updatedAt

module.exports = mongoose.model('User', userSchema);
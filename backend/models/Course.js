const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  lessons: [
    {
      title: String,
      videoUrl: String,
    },
  ],
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // links this course to a User document
    required: true,
  },
  enrolledStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
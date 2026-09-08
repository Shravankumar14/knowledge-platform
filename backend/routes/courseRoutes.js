const express = require('express');
const Course = require('../models/Course');
const { protect, instructorOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// GET all courses (public)
router.get('/', async (req, res) => {
  const courses = await Course.find().populate('instructor', 'name email');
  res.json(courses);
});

// GET single course by ID (public)
router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id).populate('instructor', 'name email');
  if (!course) return res.status(404).json({ message: 'Course not found' });
  res.json(course);
});

// CREATE a course (instructor only)
router.post('/', protect, instructorOnly, async (req, res) => {
  const { title, description, lessons } = req.body;
  const course = await Course.create({
    title,
    description,
    lessons,
    instructor: req.user.id, // comes from decoded JWT, not from client input — never trust client for this
  });
  res.status(201).json(course);
});

// ENROLL in a course (any logged-in student)
router.post('/:id/enroll', protect, async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  if (course.enrolledStudents.includes(req.user.id)) {
    return res.status(400).json({ message: 'Already enrolled' });
  }

  course.enrolledStudents.push(req.user.id);
  await course.save();
  res.json({ message: 'Enrolled successfully', course });
});

// GET courses the logged-in student is enrolled in
router.get('/student/my-courses', protect, async (req, res) => {
  const courses = await Course.find({ enrolledStudents: req.user.id });
  res.json(courses);
});

module.exports = router;

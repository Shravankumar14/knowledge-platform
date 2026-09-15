require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://knowledge-platform-xi-six.vercel.app'
  ],
}));
app.use(express.json()); // lets us read JSON from request bodies
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Connect to MongoDB, then start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
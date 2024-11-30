const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./api/routes/UserRoute');
const cors = require('cors');
require('dotenv').config();  // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Allow CORS for your frontend's origin
app.use(cors({
    origin: 'http://localhost:3001', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON bodies
app.use(express.json()); 

// Routes
app.use('/user', userRoutes); // User routes

// MongoDB connection
const uri = process.env.MONGO_URI; // Using the environment variable

mongoose.connect(uri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));

// Generic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

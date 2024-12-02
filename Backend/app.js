const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./api/routes/UserRoute');
const forgotPasswordRoutes = require('./api/routes/forgotPasswordRoutes');
const ResetPasswordRoutes = require('./api/routes/resetPasswordRoute');
const cors = require('cors');
require('dotenv').config();  // Load environment variables
const creditCardRoutes = require('./api/routes/CreditCardRoutes');
const transactionRoutes = require('./api/routes/transactionRoutes');



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
app.use('/user', userRoutes);  // User-related routes
app.use('/api', forgotPasswordRoutes); // Forgot password route
app.use('/api', ResetPasswordRoutes); // Forgot password route
app.use('/api/credit-cards', creditCardRoutes);
app.use('/api', transactionRoutes);

// MongoDB connection (ensure write concern is set)
const uri = process.env.MONGO_URI; // Mongo URI from .env file

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: { w: "majority" }, // Ensure write concern mode is 'majority'
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);  // Exit the process in case of connection failure
});

// Generic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

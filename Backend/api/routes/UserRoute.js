const express = require('express');
const router = express.Router();
const { register, login, getUser, editUser } = require('../controllers/UserController');

// Register a new user
router.post('/register', register);

// Login a user
router.post('/login', login);

// Get user details by username
router.get('/getUser/:username', getUser);

// Edit user details by username
router.put('/editUser/:username', editUser);

module.exports = router;

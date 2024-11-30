const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/UserController');  // Updated import path

router.post('/register', register);
router.post('/login', login);

module.exports = router;

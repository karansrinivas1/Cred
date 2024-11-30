const { registerUser, loginUser } = require('../services/UserService');

// Handle user registration
async function register(req, res) {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Handle user login
async function login(req, res) {
  try {
    const { username, password } = req.body;
    const { token, user } = await loginUser(username, password);
    res.json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { register, login };

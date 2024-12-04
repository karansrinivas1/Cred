const { registerUser, loginUser, getUserByUsername, editUserByUsername } = require('../services/UserService');

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

// Get user details by username
async function getUser(req, res) {
  try {
    const username = req.params.username;
    const user = await getUserByUsername(username);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Edit user details by username
async function editUser(req, res) {
  try {
    const username = req.params.username;
    const updatedData = req.body;
    const updatedUser = await editUserByUsername(username, updatedData);
    res.json({ message: 'User details updated successfully', updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { register, login, getUser, editUser };

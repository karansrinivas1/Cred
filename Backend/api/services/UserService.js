const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/User');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
async function registerUser(userData) {
  const { firstName, lastName, username, email, password, userType } = userData;
  const user = new User({ firstName, lastName, username, email, password, userType });
  await user.save({ writeConcern: { w: 'majority' } });
  return user;
}

// Login user and generate JWT
async function loginUser(username, password) {
  const user = await User.findOne({ username });
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  // Generate JWT token
  const token = jwt.sign(
    { id: user._id, username: user.username, userType: user.userType },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token, user };
}

module.exports = { registerUser, loginUser };

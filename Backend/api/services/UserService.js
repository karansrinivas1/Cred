const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
async function registerUser(userData) {
  const { firstName, lastName, username, email, password, userType } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ firstName, lastName, username, email, password: hashedPassword, userType });
  await user.save();
  return user;
}

// Login user and generate JWT
async function loginUser(username, password) {
  const user = await User.findOne({ username });
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { id: user._id, username: user.username, userType: user.userType },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token, user };
}

// Get user details by username
async function getUserByUsername(username) {
  const user = await User.findOne({ username }).select('-password');  // Exclude password field
  return user;
}

// Edit user details by username
async function editUserByUsername(username, updatedData) {
  const user = await User.findOne({ username });
  if (!user) throw new Error('User not found');

  const { firstName, lastName, email, userType, password } = updatedData;

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (email) user.email = email;
  if (userType) user.userType = userType;
  
  if (password) user.password = await bcrypt.hash(password, 10);  // Hash the password if it's updated

  await user.save();
  return user;
}

module.exports = { registerUser, loginUser, getUserByUsername, editUserByUsername };

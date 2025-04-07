const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const authController = require('../controllers/authController');

const router = express.Router();

// User data file path
const usersFilePath = path.join(__dirname, '../../data/users.json');

// Ensure users file exists
if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, JSON.stringify([]));
}

// Register new user
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    if (users.some(user => user.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword
    };

    // Save user
    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, userId: newUser.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    const user = users.find(user => user.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
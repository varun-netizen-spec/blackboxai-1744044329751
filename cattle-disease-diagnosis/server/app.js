const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const authRoutes = require('./routes/auth');
const predictRoutes = require('./routes/predict');
const reportRoutes = require('./routes/reports');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload configuration
const upload = multer({ dest: 'public/uploads/' });
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/predict', upload.single('image'), predictRoutes);
app.use('/api/reports', reportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
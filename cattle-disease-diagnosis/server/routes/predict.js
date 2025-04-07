const express = require('express');
const predictController = require('../controllers/predictController');

const router = express.Router();

// Predict disease
router.post('/', predictController.predictDisease);

module.exports = router;
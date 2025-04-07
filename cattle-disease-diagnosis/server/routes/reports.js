const express = require('express');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Reports data file path
const reportsFilePath = path.join(__dirname, '../../data/reports.json');

// Ensure reports file exists
if (!fs.existsSync(reportsFilePath)) {
  fs.writeFileSync(reportsFilePath, JSON.stringify([]));
}

// Get all reports for authenticated user
router.get('/', authMiddleware, (req, res) => {
  try {
    const reports = JSON.parse(fs.readFileSync(reportsFilePath));
    const userReports = reports.filter(report => report.userId === req.userId);
    res.json(userReports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save new report
router.post('/', authMiddleware, (req, res) => {
  try {
    const { symptoms, prediction, confidence, treatment, severity } = req.body;
    const reports = JSON.parse(fs.readFileSync(reportsFilePath));

    const newReport = {
      id: Date.now().toString(),
      userId: req.userId,
      symptoms,
      prediction,
      confidence,
      treatment,
      severity,
      timestamp: new Date().toISOString()
    };

    reports.push(newReport);
    fs.writeFileSync(reportsFilePath, JSON.stringify(reports, null, 2));

    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
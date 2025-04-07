const fs = require('fs');
const path = require('path');

const reportsFilePath = path.join(__dirname, '../../data/reports.json');

// Ensure reports file exists
if (!fs.existsSync(reportsFilePath)) {
  fs.writeFileSync(reportsFilePath, JSON.stringify([]));
}

class Report {
  static create({ userId, symptoms, prediction, confidence, treatment, severity }) {
    const reports = JSON.parse(fs.readFileSync(reportsFilePath));

    const newReport = {
      id: Date.now().toString(),
      userId,
      symptoms,
      prediction,
      confidence,
      treatment,
      severity,
      timestamp: new Date().toISOString()
    };

    reports.push(newReport);
    fs.writeFileSync(reportsFilePath, JSON.stringify(reports, null, 2));

    return newReport;
  }

  static findByUserId(userId) {
    const reports = JSON.parse(fs.readFileSync(reportsFilePath));
    return reports.filter(report => report.userId === userId);
  }

  static findById(id) {
    const reports = JSON.parse(fs.readFileSync(reportsFilePath));
    return reports.find(report => report.id === id);
  }
}

module.exports = Report;
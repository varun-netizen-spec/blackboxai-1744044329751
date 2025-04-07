const predictDisease = (symptoms, imagePath) => {
  // Mock prediction logic - replace with actual ML model integration
  const diseases = {
    'Foot-and-Mouth Disease': {
      confidence: 0.92,
      treatment: ['Administer antibiotic X', 'Isolate the cattle', 'Monitor temperature daily'],
      severity: 'high'
    },
    'Bovine Respiratory Disease': {
      confidence: 0.85,
      treatment: ['Provide anti-inflammatory', 'Ensure proper ventilation', 'Administer vitamin supplements'],
      severity: 'medium'
    },
    'Mastitis': {
      confidence: 0.78,
      treatment: ['Apply topical antibiotics', 'Use warm compresses', 'Milk the affected quarter frequently'],
      severity: 'medium'
    }
  };

  // Simple matching based on symptoms
  let bestMatch = null;
  let highestConfidence = 0;

  for (const [disease, data] of Object.entries(diseases)) {
    if (data.confidence > highestConfidence) {
      bestMatch = {
        disease,
        confidence: data.confidence,
        treatment: data.treatment,
        severity: data.severity
      };
      highestConfidence = data.confidence;
    }
  }

  return bestMatch;
};

module.exports = {
  predictDisease: (req, res) => {
    try {
      const { symptoms } = req.body;
      const imagePath = req.file ? req.file.path : null;

      const prediction = predictDisease(symptoms, imagePath);
      
      res.json({
        success: true,
        prediction
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};
const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  resumeText: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    required: true
  },
  overallScore: {
    type: Number,
    required: true
  },
  metrics: [{
    name: String,
    score: Number
  }],
  matchedKeywords: [String],
  missingKeywords: [String],
  suggestions: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analysis', analysisSchema);
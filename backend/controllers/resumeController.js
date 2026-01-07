const Analysis = require('../models/Analysis');
const atsService = require('../services/atsService');
const { extractTextFromFile } = require('../utils/pdfParser');
const fs = require('fs').promises;

exports.analyzeResume = async (req, res, next) => {
  try {
    const { jobDescription } = req.body;
    const resumeFile = req.file;

    if (!resumeFile || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'Resume file and job description are required'
      });
    }

    // Extract text from resume
    const resumeText = await extractTextFromFile(resumeFile.path);

    // Analyze resume
    const analysis = await atsService.analyzeResume(resumeText, jobDescription);

    // Save analysis to database
    const savedAnalysis = await Analysis.create({
      resumeText,
      jobDescription,
      ...analysis
    });

    // Delete uploaded file
    await fs.unlink(resumeFile.path);

    res.status(200).json({
      success: true,
      data: analysis
    });

  } catch (error) {
    next(error);
  }
};
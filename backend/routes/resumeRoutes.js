const express = require("express");
const multer = require("multer");
const fs = require("fs");

const extractText = require("../utils/resumeParser");
const analyzeWithGemini = require("../services/geminiAnalyzer");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/analyze", upload.single("resume"), async (req, res, next) => {
  try {
    const resumeFile = req.file;
    const { jobDescription } = req.body;

    if (!resumeFile || !jobDescription) {
      return res.status(400).json({ message: "Missing resume or job description" });
    }

    console.log("Resume MIME:", resumeFile.mimetype);
    console.log("JD length:", jobDescription.length);

    // 1️⃣ Extract resume text
    const resumeText = await extractText(
      resumeFile.path,
      resumeFile.mimetype
    );

    console.log("Resume text length:", resumeText.length);

    if (!resumeText || resumeText.length < 50) {
      fs.unlinkSync(resumeFile.path);
      return res.status(400).json({
        message: "Could not extract text from resume. Please upload a text-based PDF or DOCX."
      });
    }

    // 2️⃣ Gemini ATS-style analysis
    const analysis = await analyzeWithGemini(resumeText, jobDescription);

    console.log("Gemini analysis result:", analysis);

    // 3️⃣ Cleanup uploaded file
    fs.unlinkSync(resumeFile.path);

    res.json(analysis);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

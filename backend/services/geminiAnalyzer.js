const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ✅ EXACT model from your list
const GEMINI_MODEL = "models/gemini-2.5-flash";

const GEMINI_URL =
  `https://generativelanguage.googleapis.com/v1beta/${GEMINI_MODEL}:generateContent`;

async function analyzeWithGemini(resumeText, jobDescription) {
  const prompt = `
You are a professional Applicant Tracking System (ATS).

Analyze the resume against the job description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Return ONLY valid JSON. No markdown. No explanation.

JSON format:
{
  "overallScore": number,
  "metrics": [
    { "name": "Skills Match", "score": number },
    { "name": "Experience Match", "score": number },
    { "name": "Keyword Relevance", "score": number },
    { "name": "Role Alignment", "score": number }
  ],
  "matchedKeywords": [string],
  "missingKeywords": [string],
  "suggestions": [string]
}
`;

  const response = await axios.post(
    `${GEMINI_URL}?key=${GEMINI_API_KEY}`,
    {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const text =
    response.data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  function extractJSON(rawText) {
    rawText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("No valid JSON found in Gemini response");
    }

    return JSON.parse(match[0]);
  }

  return extractJSON(text);
}

// ✅ EXPORT MUST BE OUTSIDE THE FUNCTION
module.exports = analyzeWithGemini;

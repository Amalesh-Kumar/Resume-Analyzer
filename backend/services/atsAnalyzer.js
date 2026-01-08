function analyzeResume(resumeText, jobDescription) {
  const jd = jobDescription.toLowerCase();

  // Extract keywords from JD (basic but effective)
  const keywords = [
  ...new Set(
    jd
      .replace(/[^a-zA-Z ]/g, " ")
      .split(/\s+/)
      .filter(word => word.length >= 2)
  )
];


  const matchedKeywords = [];
  const missingKeywords = [];

  keywords.forEach(keyword => {
    if (resumeText.includes(keyword)) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  const matchPercentage =
  keywords.length === 0
    ? 20
    : Math.round((matchedKeywords.length / keywords.length) * 100);


  return {
    overallScore: matchPercentage,
    metrics: [
      { name: "Keyword Match", score: matchPercentage },
      { name: "Resume Length", score: resumeText.length > 1000 ? 80 : 50 },
      { name: "Skill Coverage", score: matchedKeywords.length > 10 ? 75 : 55 },
      { name: "Formatting", score: 70 }
    ],
    matchedKeywords: matchedKeywords.slice(0, 20),
    missingKeywords: missingKeywords.slice(0, 20),
    suggestions: [
      "Add missing job-specific keywords",
      "Use stronger action verbs",
      "Include measurable achievements",
      "Match resume terminology with job description"
    ]
  };
}

module.exports = analyzeResume;

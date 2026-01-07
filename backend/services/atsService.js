const natural = require('natural');
const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();

class ATSService {
  // Extract keywords from text
  extractKeywords(text, topN = 20) {
    const tfidf = new TfIdf();
    tfidf.addDocument(text.toLowerCase());
    
    const keywords = [];
    tfidf.listTerms(0).slice(0, topN).forEach(item => {
      if (item.term.length > 2) { // Filter out very short words
        keywords.push(item.term);
      }
    });
    
    return keywords;
  }

  // Calculate keyword match percentage
  calculateKeywordMatch(resumeText, jobDescription) {
    const resumeKeywords = this.extractKeywords(resumeText, 50);
    const jobKeywords = this.extractKeywords(jobDescription, 50);
    
    const matchedKeywords = resumeKeywords.filter(keyword => 
      jobKeywords.includes(keyword)
    );
    
    const missingKeywords = jobKeywords.filter(keyword => 
      !resumeKeywords.includes(keyword)
    ).slice(0, 15);
    
    const matchPercentage = (matchedKeywords.length / jobKeywords.length) * 100;
    
    return {
      matchPercentage: Math.round(matchPercentage),
      matchedKeywords: matchedKeywords.slice(0, 20),
      missingKeywords
    };
  }

  // Check for ATS-friendly formatting
  checkFormatting(resumeText) {
    let score = 100;
    const issues = [];

    // Check for special characters
    const specialChars = /[#$%^&*()+=\[\]{};':"\\|<>?]/g;
    if (specialChars.test(resumeText)) {
      score -= 10;
      issues.push('Avoid special characters that may confuse ATS systems');
    }

    // Check length
    const wordCount = resumeText.split(/\s+/).length;
    if (wordCount < 200) {
      score -= 15;
      issues.push('Resume appears too short. Aim for 400-800 words');
    } else if (wordCount > 1000) {
      score -= 5;
      issues.push('Resume might be too long. Keep it concise');
    }

    // Check for common sections
    const sections = ['experience', 'education', 'skills'];
    const lowerText = resumeText.toLowerCase();
    sections.forEach(section => {
      if (!lowerText.includes(section)) {
        score -= 10;
        issues.push(`Consider adding a "${section}" section`);
      }
    });

    return { score: Math.max(0, score), issues };
  }

  // Check contact information
  checkContactInfo(resumeText) {
    let score = 100;
    const issues = [];

    // Check for email
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
    if (!emailRegex.test(resumeText)) {
      score -= 30;
      issues.push('Add a valid email address');
    }

    // Check for phone
    const phoneRegex = /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/;
    if (!phoneRegex.test(resumeText)) {
      score -= 20;
      issues.push('Add a contact phone number');
    }

    return { score: Math.max(0, score), issues };
  }

  // Main analysis function
  async analyzeResume(resumeText, jobDescription) {
    // Keyword matching
    const keywordAnalysis = this.calculateKeywordMatch(resumeText, jobDescription);
    
    // Formatting check
    const formattingAnalysis = this.checkFormatting(resumeText);
    
    // Contact info check
    const contactAnalysis = this.checkContactInfo(resumeText);

    // Calculate metrics
    const metrics = [
      {
        name: 'Keyword Match',
        score: keywordAnalysis.matchPercentage
      },
      {
        name: 'ATS Formatting',
        score: formattingAnalysis.score
      },
      {
        name: 'Contact Information',
        score: contactAnalysis.score
      },
      {
        name: 'Content Quality',
        score: this.assessContentQuality(resumeText)
      }
    ];

    // Calculate overall score
    const overallScore = Math.round(
      metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length
    );

    // Generate suggestions
    const suggestions = [
      ...formattingAnalysis.issues,
      ...contactAnalysis.issues
    ];

    if (keywordAnalysis.matchPercentage < 60) {
      suggestions.push('Incorporate more keywords from the job description');
    }

    if (suggestions.length === 0) {
      suggestions.push('Great job! Your resume is well-optimized for ATS systems');
    }

    return {
      overallScore,
      metrics,
      matchedKeywords: keywordAnalysis.matchedKeywords,
      missingKeywords: keywordAnalysis.missingKeywords,
      suggestions: suggestions.slice(0, 8)
    };
  }

  // Assess overall content quality
  assessContentQuality(resumeText) {
    let score = 70;
    const lowerText = resumeText.toLowerCase();

    // Check for action verbs
    const actionVerbs = ['led', 'managed', 'developed', 'created', 'improved', 'increased', 'decreased', 'achieved'];
    const foundVerbs = actionVerbs.filter(verb => lowerText.includes(verb));
    score += Math.min(foundVerbs.length * 3, 20);

    // Check for quantifiable achievements
    const numberRegex = /\d+%|\$\d+|\d+\+/g;
    const numbers = resumeText.match(numberRegex);
    if (numbers && numbers.length > 3) {
      score += 10;
    }

    return Math.min(score, 100);
  }
}

module.exports = new ATSService();
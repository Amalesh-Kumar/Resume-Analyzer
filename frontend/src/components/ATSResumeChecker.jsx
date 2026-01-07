import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, TrendingUp, Award, Target, Zap } from 'lucide-react';

export default function ATSResumeChecker() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const analyzeResume = async () => {
    if (!file || !jobDescription) {
      alert('Please upload a resume and enter a job description');
      return;
    }

    setLoading(true);
    
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error analyzing resume. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black bg-opacity-30 backdrop-blur-sm border-b border-purple-500 border-opacity-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ATS Resume Checker
              </h1>
              <p className="text-purple-300 text-sm">Optimize your resume for Applicant Tracking Systems</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Upload Section */}
          <div className="space-y-6">
            {/* File Upload */}
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500 border-opacity-20 shadow-2xl">
              <div className="flex items-center space-x-2 mb-4">
                <Upload className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">Upload Resume</h2>
              </div>
              
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive
                    ? 'border-purple-500 bg-purple-500 bg-opacity-10'
                    : 'border-purple-500 border-opacity-30 hover:border-opacity-50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="resume-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <FileText className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <p className="text-white font-medium mb-2">
                    {file ? file.name : 'Drop your resume here or click to browse'}
                  </p>
                  <p className="text-purple-300 text-sm">Supports PDF, DOC, DOCX</p>
                </label>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500 border-opacity-20 shadow-2xl">
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">Job Description</h2>
              </div>
              
              <textarea
                className="w-full h-64 bg-slate-900 bg-opacity-50 border border-purple-500 border-opacity-30 rounded-xl px-4 py-3 text-white placeholder-purple-300 placeholder-opacity-50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 resize-none"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            {/* Analyze Button */}
            <button
              onClick={analyzeResume}
              disabled={loading || !file || !jobDescription}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Analyze Resume</span>
                </>
              )}
            </button>
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-6">
            {analysis ? (
              <>
                {/* Overall Score */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500 border-opacity-20 shadow-2xl text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Award className="w-6 h-6 text-purple-400" />
                    <h2 className="text-2xl font-bold text-white">ATS Score</h2>
                  </div>
                  
                  <div className="relative inline-block">
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-slate-700"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 88}`}
                        strokeDashoffset={`${2 * Math.PI * 88 * (1 - analysis.overallScore / 100)}`}
                        className={getScoreBgColor(analysis.overallScore)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div>
                        <div className={`text-6xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                          {analysis.overallScore}
                        </div>
                        <div className="text-purple-300 text-sm">out of 100</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-purple-300 mt-4">
                    {analysis.overallScore >= 80 ? 'Excellent! Your resume is well-optimized.' :
                     analysis.overallScore >= 60 ? 'Good, but there\'s room for improvement.' :
                     'Needs significant improvement for ATS compatibility.'}
                  </p>
                </div>

                {/* Detailed Metrics */}
                <div className="bg-slate-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500 border-opacity-20 shadow-2xl">
                  <div className="flex items-center space-x-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    <h2 className="text-xl font-semibold text-white">Detailed Analysis</h2>
                  </div>

                  <div className="space-y-4">
                    {analysis.metrics.map((metric, idx) => (
                      <div key={idx} className="bg-slate-900 bg-opacity-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{metric.name}</span>
                          <span className={`font-bold ${getScoreColor(metric.score)}`}>
                            {metric.score}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getScoreBgColor(metric.score)}`}
                            style={{ width: `${metric.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Matched Keywords */}
                <div className="bg-slate-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500 border-opacity-20 shadow-2xl">
                  <div className="flex items-center space-x-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <h2 className="text-xl font-semibold text-white">Matched Keywords</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.matchedKeywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="bg-green-500 bg-opacity-20 text-green-300 px-3 py-1 rounded-full text-sm border border-green-500 border-opacity-30"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="bg-slate-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500 border-opacity-20 shadow-2xl">
                  <div className="flex items-center space-x-2 mb-4">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <h2 className="text-xl font-semibold text-white">Missing Keywords</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="bg-red-500 bg-opacity-20 text-red-300 px-3 py-1 rounded-full text-sm border border-red-500 border-opacity-30"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                <div className="bg-slate-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 border border-purple-500 border-opacity-20 shadow-2xl">
                  <div className="flex items-center space-x-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <h2 className="text-xl font-semibold text-white">Recommendations</h2>
                  </div>
                  <ul className="space-y-3">
                    {analysis.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <div className="bg-yellow-500 bg-opacity-20 rounded-full p-1 mt-0.5">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                        </div>
                        <span className="text-purple-200">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="bg-slate-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-12 border border-purple-500 border-opacity-20 shadow-2xl text-center">
                <Target className="w-24 h-24 text-purple-400 mx-auto mb-6 opacity-50" />
                <h3 className="text-2xl font-semibold text-white mb-2">Ready to Analyze</h3>
                <p className="text-purple-300">
                  Upload your resume and paste the job description to get started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
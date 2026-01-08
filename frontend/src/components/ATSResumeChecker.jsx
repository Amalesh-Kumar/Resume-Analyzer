import React, { useState } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Award,
  Target,
  Zap,
} from "lucide-react";

// Backend URL (works for local + deployment)
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ATSResumeChecker() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // ---------------- FILE HANDLERS ----------------
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
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

  // ---------------- ANALYZE RESUME ----------------
  const analyzeResume = async () => {
    if (!file || !jobDescription) {
      alert("Please upload a resume and enter a job description");
      return;
    }

    setLoading(true);
    setAnalysis(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Analysis failed");
      }

      const data = await response.json();

      // ✅ Gemini-safe normalization
      setAnalysis({
        overallScore: Number(data.overallScore) || 0,
        metrics: Array.isArray(data.metrics) ? data.metrics : [],
        matchedKeywords: Array.isArray(data.matchedKeywords)
          ? data.matchedKeywords
          : [],
        missingKeywords: Array.isArray(data.missingKeywords)
          ? data.missingKeywords
          : [],
        suggestions: Array.isArray(data.suggestions)
          ? data.suggestions
          : [],
      });
    } catch (error) {
      console.error("Gemini analysis error:", error);
      alert(
        error.message ||
          "AI analysis failed. Please try again with a different resume."
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI HELPERS ----------------
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ATS Resume Checker
              </h1>
              <p className="text-purple-300 text-sm">
                AI-powered ATS-style resume analysis (Gemini)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT PANEL */}
        <div className="space-y-6">
          {/* Upload */}
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-purple-500/20 shadow-2xl">
            <div className="flex items-center space-x-2 mb-4">
              <Upload className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">
                Upload Resume
              </h2>
            </div>

            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-purple-500/30"
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
                <p className="text-white font-medium">
                  {file ? file.name : "Drop resume or click to browse"}
                </p>
                <p className="text-purple-300 text-sm">
                  PDF or DOCX (text-based)
                </p>
              </label>
            </div>
          </div>

          {/* Job Description */}
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-purple-500/20 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-4">
              Job Description
            </h2>
            <textarea
              className="w-full h-64 bg-slate-900/50 border border-purple-500/30 rounded-xl p-4 text-white resize-none"
              placeholder="Paste job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {/* Analyze Button */}
          <button
            type="button"
            onClick={analyzeResume}
            disabled={loading || !file || !jobDescription}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 rounded-xl shadow-lg hover:scale-105 transition"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-6">
          {analysis ? (
            <>
              {/* Score */}
              <div className="bg-slate-800/50 rounded-2xl p-8 text-center border border-purple-500/20">
                <h2 className="text-2xl font-bold text-white mb-4">
                  ATS Score
                </h2>
                <div
                  className={`text-6xl font-bold ${getScoreColor(
                    analysis.overallScore
                  )}`}
                >
                  {analysis.overallScore}
                </div>
                <p className="text-purple-300">out of 100</p>
              </div>

              {/* Metrics */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-purple-500/20">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Detailed Analysis
                </h2>
                {analysis.metrics.map((m, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between text-white">
                      <span>{m.name}</span>
                      <span>{m.score}</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded">
                      <div
                        className={`${getScoreBgColor(
                          m.score
                        )} h-2 rounded`}
                        style={{ width: `${m.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Keywords */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-purple-500/20">
                <h2 className="text-white font-semibold mb-2">
                  Matched Keywords
                </h2>
                <div className="flex flex-wrap gap-2">
                  {analysis.matchedKeywords.map((k, i) => (
                    <span
                      key={i}
                      className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-2xl p-6 border border-purple-500/20">
                <h2 className="text-white font-semibold mb-2">
                  Missing Keywords
                </h2>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((k, i) => (
                    <span
                      key={i}
                      className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-purple-500/20">
                <h2 className="text-white font-semibold mb-2">
                  Recommendations
                </h2>
                <ul className="list-disc pl-5 text-purple-200">
                  {analysis.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="bg-slate-800/50 rounded-2xl p-12 text-center border border-purple-500/20">
              <Target className="w-24 h-24 text-purple-400 mx-auto mb-4 opacity-50" />
              <p className="text-purple-300">
                Upload resume and job description to begin
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

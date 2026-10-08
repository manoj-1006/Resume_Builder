import React, { useState } from 'react';
import { Target, CheckCircle2, AlertTriangle, Loader2, Wand2, ShieldCheck } from 'lucide-react';
import { scanAts, tailorResume } from '../api';

export default function AtsScannerTab({ resume, onUpdateResume, layoutRatio = 'balanced' }) {
  const isCompact = layoutRatio === 'focus-preview';
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [scanning, setScanning] = useState(false);
  const [tailoring, setTailoring] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description first.');
      return;
    }
    setError('');
    setScanning(true);
    try {
      const data = await scanAts(resume, jobTitle, company, jobDescription);
      setScanResult(data);
    } catch (err) {
      setError(err.message || 'Failed to scan ATS');
    } finally {
      setScanning(false);
    }
  };

  const handleTailor = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description first.');
      return;
    }
    setError('');
    setTailoring(true);
    try {
      const tailored = await tailorResume(resume, jobTitle, jobDescription);
      onUpdateResume(tailored);
      // Re-scan with tailored resume
      const updatedScan = await scanAts(tailored, jobTitle, company, jobDescription);
      setScanResult(updatedScan);
    } catch (err) {
      setError(err.message || 'Failed to tailor resume');
    } finally {
      setTailoring(false);
    }
  };

  const applySuggestedSummary = () => {
    if (scanResult?.suggestedTailoredSummary) {
      onUpdateResume({
        ...resume,
        professionalSummary: scanResult.suggestedTailoredSummary
      });
    }
  };

  const addMissingSkill = (skill) => {
    const existingCategories = [...(resume.skillCategories || [])];
    if (existingCategories.length === 0) {
      existingCategories.push({ category: 'Key Technical Skills', skills: [skill] });
    } else {
      if (!existingCategories[0].skills.includes(skill)) {
        existingCategories[0].skills.push(skill);
      }
    }
    onUpdateResume({
      ...resume,
      skillCategories: existingCategories
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-700 border-emerald-300 bg-emerald-50';
    if (score >= 60) return 'text-amber-800 border-amber-300 bg-amber-50';
    return 'text-rose-700 border-rose-300 bg-rose-50';
  };

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="p-4 rounded-xl bg-[#5CB338]/10 border border-[#5CB338]/20 flex items-start justify-between shadow-2xs">
        <div>
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-[#5CB338]" />
            ATS Keyword Scanner & Job Description Matcher
          </h3>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            Beat Applicant Tracking Systems (Workday, Taleo, Greenhouse). Paste any job posting to calculate match percentage, reveal missing keywords, and automatically tailor your resume.
          </p>
        </div>
      </div>

      {/* Target Job Inputs */}
      <div className={isCompact ? 'grid grid-cols-1 gap-3.5' : 'grid grid-cols-1 sm:grid-cols-2 gap-4'}>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job Title</label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Backend Engineer"
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338] shadow-2xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Company (Optional)</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Stripe, Google, Microsoft"
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338] shadow-2xs"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Paste Job Description</label>
        <textarea
          rows={5}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste requirements, responsibilities, and qualifications here..."
          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#5CB338] focus:ring-1 focus:ring-[#5CB338] font-mono text-xs shadow-2xs"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleScan}
          disabled={scanning || tailoring || !jobDescription.trim()}
          className="px-5 py-2.5 bg-[#5CB338] hover:bg-[#4ea02e] disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-xs cursor-pointer"
        >
          {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
          Run ATS Match Scan
        </button>

        <button
          onClick={handleTailor}
          disabled={scanning || tailoring || !jobDescription.trim()}
          className="px-5 py-2.5 bg-slate-900 hover:bg-black disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-xs"
        >
          {tailoring ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
          1-Click Auto-Tailor Resume
        </button>
      </div>

      {/* ATS Results View */}
      {scanResult && (
        <div className="mt-6 space-y-6 pt-6 border-t border-slate-200 animate-fade-in">
          {/* Match Score Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center text-center shadow-xs ${getScoreColor(scanResult.matchScore)}`}>
              <div className="text-4xl font-extrabold tracking-tight">
                {scanResult.matchScore}%
              </div>
              <div className="text-xs font-bold uppercase tracking-wider mt-1">
                ATS Match Score
              </div>
            </div>

            <div className="sm:col-span-2 p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-center shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#5CB338]" />
                Recruiter & ATS Assessment
              </span>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                {scanResult.assessment}
              </p>
            </div>
          </div>

          {/* Missing Keywords Gap Analysis */}
          <div className="p-5 bg-white border border-rose-200 rounded-2xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Missing Crucial Keywords (Add these to pass ATS)
              </h4>
              <span className="text-[11px] text-slate-500">Click a keyword to add to your Skills</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {scanResult.missingKeywords?.map((kw, i) => (
                <button
                  key={i}
                  onClick={() => addMissingSkill(kw)}
                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-lg text-xs font-mono font-medium transition flex items-center gap-1 shadow-2xs"
                  title="Click to add to skills"
                >
                  <span>+</span> {kw}
                </button>
              ))}
              {(!scanResult.missingKeywords || scanResult.missingKeywords.length === 0) && (
                <span className="text-xs text-slate-500 italic">No missing keywords found! Great alignment.</span>
              )}
            </div>
          </div>

          {/* Matching Keywords */}
          <div className="p-5 bg-white border border-emerald-200 rounded-2xl space-y-3 shadow-xs">
            <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Matching Keywords Detected in Resume
            </h4>
            <div className="flex flex-wrap gap-2">
              {scanResult.matchingKeywords?.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-mono font-medium"
                >
                  ✓ {kw}
                </span>
              ))}
            </div>
          </div>

          {/* High Priority Recommendations */}
          {scanResult.highPriorityRecommendations?.length > 0 && (
            <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900">
                Actionable Recommendations to Improve Score
              </h4>
              <ul className="space-y-2">
                {scanResult.highPriorityRecommendations.map((rec, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                    <span className="text-[#5CB338] font-bold shrink-0">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggested Summary */}
          {scanResult.suggestedTailoredSummary && (
            <div className="p-5 bg-white border border-[#5CB338]/30 rounded-2xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">
                  Recommended Tailored Summary for This Job
                </h4>
                <button
                  onClick={applySuggestedSummary}
                  className="px-3 py-1 bg-[#5CB338] hover:bg-[#4ea02e] text-white rounded-lg text-xs font-semibold transition shadow-xs cursor-pointer"
                >
                  Apply to Resume
                </button>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                "{scanResult.suggestedTailoredSummary}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


import React, { useState } from 'react';
import { extractTextFromPdf } from '../services/pdfUtils';
import { analyzeResume } from '../services/geminiService';
import { ResumeAnalysisResult } from '../types';

const IconFile = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 mx-auto mb-2 opacity-40">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
  </svg>
);

const IconTarget = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 opacity-20 mb-4">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);

const PlacementPrefect: React.FC = () => {
  const [resumeText, setResumeText] = useState<string>('');
  const [jdText, setJdText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [deepAnalysis, setDeepAnalysis] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        const text = await extractTextFromPdf(file);
        setResumeText(text);
        setFileName(file.name);
      } catch (err) {
        alert("Failed to read PDF. Please ensure it is a valid PDF.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText || !jdText) return;
    setLoading(true);
    try {
      const data = await analyzeResume(resumeText, jdText, deepAnalysis);
      setResult(data);
    } catch (err) {
      alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 tracking-tighter flex items-center gap-2">
          The Placement Prefect
          <span className="text-xs font-black bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full uppercase tracking-widest border border-orange-200 dark:border-orange-800/50 shadow-sm">Beta</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400">Beat the ATS. Get brutal, actionable feedback on your resume tailored to the job description.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">1. Upload Resume (PDF)</label>
            <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-xl p-8 text-center hover:border-orange-500 transition-colors bg-slate-50 dark:bg-white/5 group">
              <input 
                type="file" 
                accept=".pdf,.txt" 
                onChange={handleFileUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <IconFile />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {fileName ? <span className="text-orange-600 dark:text-orange-400 font-semibold">{fileName}</span> : "Drop PDF here or click to upload"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">2. Paste Job Description</label>
            <textarea 
              className="w-full h-40 bg-white dark:bg-black border border-slate-300 dark:border-white/5 rounded-xl p-3 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none transition-colors"
              placeholder="Paste the full JD here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2 py-2">
            <input 
              type="checkbox" 
              id="deepMode"
              checked={deepAnalysis}
              onChange={(e) => setDeepAnalysis(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="deepMode" className="text-sm text-slate-700 dark:text-slate-300 select-none">
              Enable <span className="font-bold text-indigo-600 dark:text-indigo-400">Deep Analysis</span> (Pro)
            </label>
          </div>

          <button 
            onClick={handleAnalyze}
            disabled={!resumeText || !jdText || loading}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.98]
              ${(!resumeText || !jdText) ? 'bg-slate-400 dark:bg-slate-800 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-orange-600 to-red-700 hover:shadow-orange-600/30'}
            `}
          >
            {loading ? 'Analyzing...' : `Analyze Match`}
          </button>
        </div>

        {/* Result Section */}
        <div className="space-y-6">
          {!result && !loading && (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center glass-panel rounded-2xl p-6 text-slate-400 dark:text-slate-600">
              <IconTarget />
              <p className="font-medium">Upload details to see your score</p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[300px] flex items-center justify-center glass-panel rounded-2xl">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-orange-500 border-t-transparent"></div>
            </div>
          )}

          {result && (
            <div className="animate-fade-in space-y-6">
              {/* Score Card */}
              <div className="glass-panel p-6 rounded-2xl flex items-center justify-between relative overflow-hidden">
                <div className="z-10">
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest">Match Score</p>
                  <p className={`text-5xl font-black mt-2 tracking-tighter ${
                    result.matchScore > 75 ? 'text-green-500' : result.matchScore > 50 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {result.matchScore}%
                  </p>
                </div>
                <div className="z-10 text-right max-w-[60%]">
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium italic">"{result.summary.slice(0, 120)}..."</p>
                </div>
                {/* Background Decor */}
                <div className={`absolute right-0 top-0 w-32 h-32 blur-3xl opacity-10 rounded-full ${
                    result.matchScore > 75 ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
              </div>

              {/* Missing Keywords */}
              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-4">Missing Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.length > 0 ? (
                    result.missingKeywords.map((kw, idx) => (
                      <span key={idx} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full text-[10px] font-black uppercase tracking-wider">
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-green-500 text-sm font-medium">Great job! No major keywords missing.</span>
                  )}
                </div>
              </div>

              {/* Advice */}
              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-4">Actionable Advice</h3>
                <ul className="space-y-3">
                  {result.phrasingAdvice.map((advice, idx) => (
                    <li key={idx} className="flex items-start text-sm text-slate-600 dark:text-slate-300">
                      <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                      <span>{advice}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Project Feedback */}
              <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-blue-600 bg-blue-500/5">
                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-2">Project Review</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{result.projectFeedback}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlacementPrefect;

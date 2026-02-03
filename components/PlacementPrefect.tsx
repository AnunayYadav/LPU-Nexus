
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

const AuditSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="glass-panel p-8 rounded-[40px] flex items-center justify-between bg-white dark:bg-slate-950/40 border dark:border-white/5">
      <div className="space-y-3">
        <div className="h-3 w-20 bg-slate-200 dark:bg-white/5 rounded shimmer" />
        <div className="h-12 w-24 bg-slate-200 dark:bg-white/5 rounded shimmer" />
      </div>
      <div className="h-10 w-40 bg-slate-200 dark:bg-white/5 rounded shimmer" />
    </div>
    <div className="glass-panel p-6 rounded-[32px] bg-white dark:bg-slate-950/40 border dark:border-white/5">
      <div className="h-3 w-32 bg-slate-200 dark:bg-white/5 rounded mb-4 shimmer" />
      <div className="flex flex-wrap gap-2">
        <div className="h-8 w-16 bg-slate-200 dark:bg-white/5 rounded-xl shimmer" />
        <div className="h-8 w-24 bg-slate-200 dark:bg-white/5 rounded-xl shimmer" />
        <div className="h-8 w-20 bg-slate-200 dark:bg-white/5 rounded-xl shimmer" />
      </div>
    </div>
    <div className="glass-panel p-6 rounded-[32px] bg-white dark:bg-slate-950/40 border dark:border-white/5">
      <div className="h-3 w-40 bg-slate-200 dark:bg-white/5 rounded mb-4 shimmer" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-slate-200 dark:bg-white/5 rounded shimmer" />
        <div className="h-4 w-5/6 bg-slate-200 dark:bg-white/5 rounded shimmer" />
      </div>
    </div>
  </div>
);

const INDUSTRY_ROLES = [
  { id: 'swe', name: 'Software Engineer', keywords: 'Algorithms, System Design, Java/Python/C++, Git, Problem Solving, Unit Testing' },
  { id: 'frontend', name: 'Frontend Developer', keywords: 'React.js, TypeScript, Tailwind CSS, Web Performance, State Management (Zustand/Redux), Next.js' },
  { id: 'backend', name: 'Backend Developer', keywords: 'Node.js, Microservices, SQL/NoSQL, API Security, Cloud Deployment, Redis/Kafka' },
  { id: 'ai', name: 'AI/ML Engineer', keywords: 'Python, PyTorch/TensorFlow, LLMs, RAG, Data Pipelines, Model Fine-tuning, Vector Databases' },
  { id: 'data', name: 'Data Scientist', keywords: 'Statistical Analysis, SQL, Data Visualization, Scikit-learn, Machine Learning, Business Intelligence' },
  { id: 'ux', name: 'UI/UX Designer', keywords: 'Figma, Design Systems, User Research, Wireframing, Prototyping, Accessibility (WCAG)' },
  { id: 'cloud', name: 'DevOps/Cloud', keywords: 'Docker, Kubernetes, AWS/Azure, Terraform, CI/CD, SRE, Infrastructure as Code' },
  { id: 'pm', name: 'Product Manager', keywords: 'Product Strategy, Agile/Scrum, User Stories, Roadmapping, Stakeholder Management, Market Analysis' }
];

const PlacementPrefect: React.FC = () => {
  const [resumeText, setResumeText] = useState<string>('');
  const [jdText, setJdText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [deepAnalysis, setDeepAnalysis] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'custom' | 'trend'>('trend');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');

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

  const handleRoleSelect = (roleId: string) => {
    setSelectedRoleId(roleId);
    const role = INDUSTRY_ROLES.find(r => r.id === roleId);
    if (role) {
      setJdText(`Analyze against 2025 Industry Trends for: ${role.name}. \nFocus on: ${role.keywords}`);
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
        <p className="text-slate-600 dark:text-slate-400">Beat the ATS. Get brutal, actionable feedback on your resume tailored to specific job roles or latest industry trends.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="glass-panel p-6 rounded-[32px] space-y-6 shadow-sm border dark:border-white/5 bg-white dark:bg-slate-950/50">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 ml-1 tracking-[0.2em]">1. Upload Resume (PDF)</label>
            <div className="relative border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl p-6 text-center hover:border-orange-500 transition-colors bg-slate-50 dark:bg-black/40 group">
              <input 
                type="file" 
                accept=".pdf,.txt" 
                onChange={handleFileUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <IconFile />
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                  {fileName ? <span className="text-orange-600 dark:text-orange-400">{fileName}</span> : "Drop PDF or Click"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-black uppercase text-slate-400 ml-1 tracking-[0.2em]">2. Analysis Target</label>
              <div className="flex bg-slate-100 dark:bg-black p-1 rounded-xl">
                <button 
                  onClick={() => setAnalysisMode('trend')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${analysisMode === 'trend' ? 'bg-white dark:bg-white/10 text-orange-600 shadow-sm' : 'text-slate-400'}`}
                >
                  Trends
                </button>
                <button 
                  onClick={() => setAnalysisMode('custom')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${analysisMode === 'custom' ? 'bg-white dark:bg-white/10 text-orange-600 shadow-sm' : 'text-slate-400'}`}
                >
                  Custom JD
                </button>
              </div>
            </div>

            {analysisMode === 'trend' ? (
              <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto no-scrollbar p-1">
                {INDUSTRY_ROLES.map(role => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${selectedRoleId === role.id ? 'bg-orange-600 border-orange-700 text-white shadow-lg' : 'bg-white dark:bg-black/40 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:border-orange-500/50'}`}
                  >
                    <p className="text-xs font-black uppercase tracking-tight line-clamp-1">{role.name}</p>
                    <p className={`text-[9px] mt-1 line-clamp-1 opacity-60 ${selectedRoleId === role.id ? 'text-white' : ''}`}>Market Trends 2025</p>
                  </button>
                ))}
              </div>
            ) : (
              <textarea 
                className="w-full h-[220px] bg-white dark:bg-black/60 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-orange-500 outline-none resize-none transition-all font-medium"
                placeholder="Paste the target job description here..."
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
              />
            )}
          </div>

          <div className="flex items-center space-x-3 p-3 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
            <input 
              type="checkbox" 
              id="deepMode"
              checked={deepAnalysis}
              onChange={(e) => setDeepAnalysis(e.target.checked)}
              className="w-4 h-4 rounded-lg border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
            />
            <label htmlFor="deepMode" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 cursor-pointer select-none">
              Deep <span className="opacity-60">Critical</span> Analysis (Pro)
            </label>
          </div>

          <button 
            onClick={handleAnalyze}
            disabled={!resumeText || !jdText || loading}
            className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-white shadow-xl transition-all transform hover:scale-[1.01] active:scale-[0.98]
              ${(!resumeText || !jdText) ? 'bg-slate-400 dark:bg-slate-800 cursor-not-allowed opacity-50' : 'bg-gradient-to-r from-orange-600 to-red-700 hover:shadow-orange-600/30'}
            `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                Analyzing Integrity...
              </span>
            ) : `Start Audit`}
          </button>
        </div>

        {/* Result Section */}
        <div className="space-y-6">
          {!result && !loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center glass-panel rounded-[40px] p-10 text-slate-400 dark:text-slate-600 border dark:border-white/5">
              <IconTarget />
              <p className="font-black uppercase tracking-[0.2em] text-[10px]">Initialize registry to see score</p>
            </div>
          )}

          {loading && <AuditSkeleton />}

          {result && !loading && (
            <div className="animate-fade-in space-y-6">
              {/* Score Card */}
              <div className="glass-panel p-8 rounded-[40px] flex items-center justify-between relative overflow-hidden shadow-2xl border-none">
                <div className="z-10">
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">Market Relevance</p>
                  <p className={`text-6xl font-black mt-2 tracking-tighter ${
                    result.matchScore > 75 ? 'text-green-500' : result.matchScore > 50 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {result.matchScore}%
                  </p>
                </div>
                <div className="z-10 text-right max-w-[55%]">
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-bold leading-relaxed">"{result.summary}"</p>
                </div>
                <div className={`absolute right-0 top-0 w-40 h-40 blur-[80px] opacity-10 rounded-full ${
                    result.matchScore > 75 ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
              </div>

              {/* Missing Keywords */}
              <div className="glass-panel p-6 rounded-[32px] border dark:border-white/5">
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Trend Gap Analysis</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.length > 0 ? (
                    result.missingKeywords.map((kw, idx) => (
                      <span key={idx} className="px-4 py-2 bg-red-500/10 border border-red-500/10 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-wider">
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-green-500 text-xs font-black uppercase tracking-widest">Optimized for Industry Pulse</span>
                  )}
                </div>
              </div>

              {/* Advice */}
              <div className="glass-panel p-6 rounded-[32px] border dark:border-white/5">
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Brutal Phrasing Advice</h3>
                <ul className="space-y-4">
                  {result.phrasingAdvice.map((advice, idx) => (
                    <li key={idx} className="flex items-start text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed group">
                      <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-1.5 mr-4 flex-shrink-0 group-hover:scale-150 transition-transform" />
                      <span>{advice}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Project Feedback */}
              <div className="glass-panel p-6 rounded-[32px] border-l-4 border-l-blue-600 bg-blue-500/5 shadow-sm">
                <h3 className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2">Project Scrutiny</h3>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-relaxed">{result.projectFeedback}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlacementPrefect;
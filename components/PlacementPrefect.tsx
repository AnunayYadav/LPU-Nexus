
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { extractTextFromPdf } from '../services/pdfUtils';
import { analyzeResume } from '../services/geminiService';
import { ResumeAnalysisResult, UserProfile, AnnotatedFragment } from '../types';

const IconFile = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 mx-auto mb-2 opacity-40">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
  </svg>
);

const INDUSTRY_ROLES = [
  { id: 'swe', name: 'Software Engineer', keywords: 'Algorithms, System Design, Java/Python/C++, Git, Problem Solving, Unit Testing' },
  { id: 'frontend', name: 'Frontend Developer', keywords: 'React.js, TypeScript, Tailwind CSS, Web Performance, State Management (Zustand/Redux), Next.js' },
  { id: 'backend', name: 'Backend Developer', keywords: 'Node.js, Microservices, SQL/NoSQL, API Security, Cloud Deployment, Redis/Kafka' },
  { id: 'ai', name: 'AI/ML Engineer', keywords: 'Python, PyTorch/TensorFlow, LLMs, RAG, Data Pipelines, Model Fine-tuning, Vector Databases' },
  { id: 'data', name: 'Data Scientist', keywords: 'Statistical Analysis, SQL, Data Visualization, Scikit-learn, Machine Learning, Business Intelligence' },
  { id: 'pm', name: 'Product Manager', keywords: 'Product Strategy, Agile/Scrum, User Stories, Roadmapping, Stakeholder Management, Market Analysis' }
];

const CATEGORIES = [
  { id: 'keywordAnalysis', label: 'Keyword Analysis' },
  { id: 'jobFit', label: 'Job Fit' },
  { id: 'achievements', label: 'Achievements and Impact' },
  { id: 'formatting', label: 'Formatting and ATS Readiness' },
  { id: 'language', label: 'Language and Communication' },
  { id: 'branding', label: 'Personal Branding' }
] as const;

type CategoryID = typeof CATEGORIES[number]['id'];

interface PlacementPrefectProps {
  userProfile?: UserProfile | null;
}

const ScoreAura = ({ score, label, meaningScore }: { score: number; label: string; meaningScore: number }) => {
  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center group">
      <div className={`absolute inset-0 bg-orange-600/10 blur-[60px] rounded-full transition-all duration-1000 ${score > 70 ? 'opacity-100 scale-110' : 'opacity-40 scale-100'}`} />
      
      <svg height="300" width="300" className="transform -rotate-90 relative z-10">
        <circle
          cx="150" cy="150" r="90"
          stroke="currentColor" strokeWidth="12" fill="transparent"
          className="text-slate-100 dark:text-white/5"
        />
        <circle
          cx="150" cy="150" r="90"
          stroke="url(#scoreGradient)" strokeWidth="12" fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-[2500ms] ease-out drop-shadow-[0_0_12px_rgba(249,115,22,0.4)]"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
      </svg>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-20">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1">{label}</p>
        <p className="text-7xl font-black tracking-tighter text-slate-900 dark:text-white">{score}%</p>
      </div>
    </div>
  );
};

interface FragmentProps {
  fragment: AnnotatedFragment;
  onHover: (fragment: AnnotatedFragment | null, rect: DOMRect | null) => void;
}

const FragmentHighlight: React.FC<FragmentProps> = ({ fragment, onHover }) => {
  if (fragment.type === 'neutral') return <span className="text-slate-400 dark:text-slate-500">{fragment.text}</span>;

  const colorClass = fragment.type === 'good' 
    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
    : 'text-red-700 dark:text-red-400 bg-red-500/10 border-red-500/20';

  return (
    <span 
      className={`inline px-0.5 rounded-md border-b-2 cursor-help transition-all duration-200 ${colorClass}`}
      onMouseEnter={(e) => onHover(fragment, (e.target as HTMLElement).getBoundingClientRect())}
      onMouseLeave={() => onHover(null, null)}
    >
      {fragment.text}
    </span>
  );
};

interface SavedReport extends ResumeAnalysisResult {
  label?: string;
}

const PlacementPrefect: React.FC<PlacementPrefectProps> = ({ userProfile }) => {
  const [resumeText, setResumeText] = useState<string>('');
  const [jdText, setJdText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [deepAnalysis, setDeepAnalysis] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'custom' | 'trend'>('trend');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<CategoryID>('keywordAnalysis');
  const [savedReports, setSavedReports] = useState<SavedReport[]>([]);

  // Rename & Delete UI state
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renamingIdx, setRenamingIdx] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // Stable Tooltip State
  const [hoveredFragment, setHoveredFragment] = useState<AnnotatedFragment | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, flipped: false });
  const hoverTimer = useRef<number | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('nexus_resume_reports');
    if (saved) setSavedReports(JSON.parse(saved));
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        const text = await extractTextFromPdf(file);
        setResumeText(text);
        setFileName(file.name);
      } catch (err) {
        alert("Failed to read PDF artifact.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRoleSelect = (roleId: string) => {
    setSelectedRoleId(roleId);
    const role = INDUSTRY_ROLES.find(r => r.id === roleId);
    if (role) {
      setJdText(`Target Role: ${role.name}. Expected Competencies: ${role.keywords}`);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText || !jdText) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeResume(resumeText, jdText, deepAnalysis);
      setResult(data);
    } catch (err) {
      alert("Analysis failed. Gateway Congested.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = () => {
    if (!result) return;
    const reportToSave: SavedReport = {
      ...result,
      label: fileName || `Report ${new Date().toLocaleDateString()}`
    };
    const updated = [reportToSave, ...savedReports].slice(0, 10);
    setSavedReports(updated);
    localStorage.setItem('nexus_resume_reports', JSON.stringify(updated));
    alert("Report archived in your local vault.");
  };

  const handleDeleteReport = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Remove this diagnostic report from history?")) return;
    const updated = savedReports.filter((_, i) => i !== idx);
    setSavedReports(updated);
    localStorage.setItem('nexus_resume_reports', JSON.stringify(updated));
  };

  const initRename = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingIdx(idx);
    setRenameValue(savedReports[idx].label || '');
    setShowRenameModal(true);
  };

  const handleRenameExecute = () => {
    if (renamingIdx === null || !renameValue.trim()) return;
    const updated = [...savedReports];
    updated[renamingIdx] = { ...updated[renamingIdx], label: renameValue.trim() };
    setSavedReports(updated);
    localStorage.setItem('nexus_resume_reports', JSON.stringify(updated));
    setShowRenameModal(false);
    setRenamingIdx(null);
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  // Fixed hover handler with stable rect calculation
  const handleFragmentHover = (fragment: AnnotatedFragment | null, rect: DOMRect | null) => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);

    if (fragment && rect) {
      const tooltipHeight = 140;
      const margin = 12;
      const spaceAbove = rect.top;
      const shouldFlip = spaceAbove < (tooltipHeight + 40);

      // Lock position to the rect immediately to prevent jitter
      setTooltipPos({
        x: rect.left + rect.width / 2,
        y: shouldFlip ? rect.bottom + margin : rect.top - margin,
        flipped: shouldFlip
      });
      setHoveredFragment(fragment);
    } else {
      // Small delay on exit to prevent flickering when mouse passes gaps between words
      hoverTimer.current = window.setTimeout(() => {
        setHoveredFragment(null);
      }, 50);
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-10 animate-fade-in">
        <div className="relative">
          <div className="w-24 h-24 border-8 border-orange-500/10 rounded-full" />
          <div className="absolute inset-0 w-24 h-24 border-8 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-orange-600 animate-pulse">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-black uppercase tracking-[0.3em] text-slate-800 dark:text-white">Synthesizing X-Ray</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">Mapping complete semantic clusters...</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div ref={reportRef} className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20 px-4 md:px-0 print:p-0 print:m-0 print:max-w-none print:bg-white print:text-black relative">
        
        {/* Fixed Diagnostic Tooltip */}
        {hoveredFragment && (
          <div 
            className={`fixed z-[9999] p-5 bg-black border border-white/20 rounded-2xl shadow-[0_32px_128px_rgba(0,0,0,0.9)] pointer-events-none transform -translate-x-1/2 w-[300px] transition-all duration-75 ${tooltipPos.flipped ? '' : '-translate-y-full'}`}
            style={{ left: tooltipPos.x, top: tooltipPos.y }}
          >
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500 mb-1.5 flex items-center gap-2">
                   <span className="w-1 h-1 bg-orange-600 rounded-full" />
                   Diagnostic Insight
                </p>
                <p className="text-[11px] font-bold text-white leading-relaxed">{hoveredFragment.reason || "Semantic signal detected by Nexus Intelligence."}</p>
              </div>
              {hoveredFragment.suggestion && (
                <div className="pt-3 border-t border-white/10">
                  <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500 mb-1">Nexus Recommended Fix</p>
                  <p className="text-[10px] font-medium text-slate-300 leading-relaxed italic">"{hoveredFragment.suggestion}"</p>
                </div>
              )}
            </div>
            {/* Tooltip Arrow */}
            <div className={`absolute left-1/2 -translate-x-1/2 border-[8px] border-transparent ${tooltipPos.flipped ? 'bottom-full border-b-black' : 'top-full border-t-black'}`} />
          </div>
        )}

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase mb-1">ATS Diagnostic Report</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Source Artifact: {fileName}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={handleSaveReport} className="px-5 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-all hover:border-orange-500 flex items-center gap-2 shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/></svg>
              Vault Sync
            </button>
            <button onClick={handleDownloadPdf} className="px-5 py-2.5 bg-orange-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-orange-600/10 active:scale-95 transition-all flex items-center gap-2 border-none">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export PDF
            </button>
            <button onClick={() => setResult(null)} className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all border-none">Reset</button>
          </div>
        </header>

        <div className="glass-panel p-10 md:p-14 rounded-[56px] border border-slate-100 dark:border-white/5 bg-white dark:bg-black/40 shadow-2xl flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
          <ScoreAura score={result.totalScore} meaningScore={result.meaningScore} label="ATS Match" />
          
          <div className="flex-1 space-y-6">
             <div className="inline-block px-4 py-1.5 bg-orange-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full">
               System Verdict
             </div>
             <p className="text-lg md:text-xl font-bold text-slate-800 dark:text-white leading-relaxed italic opacity-90">
               "{result.summary}"
             </p>
             <div className="h-px bg-slate-100 dark:bg-white/5 w-full" />
             <div className="space-y-3">
                {result.flags.map((flag, idx) => (
                  <div key={idx} className={`p-4 rounded-2xl border flex items-start gap-3 ${flag.type === 'critical' ? 'bg-red-500/10 border-red-500/20 text-red-500' : flag.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
                     <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-current" />
                     <p className="text-[11px] font-black uppercase leading-tight">{flag.message}</p>
                  </div>
                ))}
             </div>
          </div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-600/5 blur-[100px] rounded-full pointer-events-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="glass-panel p-8 md:p-10 rounded-[48px] border border-slate-100 dark:border-white/5 bg-white dark:bg-black/40 shadow-xl">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><circle cx="12" cy="12" r="10"/><path d="m12 16 4-4-4-4"/><path d="M8 12h8"/></svg>
                 Keyword Quality Analysis
              </h3>
              <div className="grid grid-cols-3 gap-4">
                 <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl text-center">
                    <p className="text-3xl font-black text-emerald-500">{result.keywordQuality?.contextual || 0}</p>
                    <p className="text-[8px] font-black uppercase text-slate-400 mt-1">Contextual</p>
                 </div>
                 <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-3xl text-center">
                    <p className="text-3xl font-black text-amber-500">{result.keywordQuality?.weak || 0}</p>
                    <p className="text-[8px] font-black uppercase text-slate-400 mt-1">Weak</p>
                 </div>
                 <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-3xl text-center">
                    <p className="text-3xl font-black text-red-500">{result.keywordQuality?.stuffed || 0}</p>
                    <p className="text-[8px] font-black uppercase text-slate-400 mt-1">Stuffed</p>
                 </div>
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center mt-6 opacity-60">"ATS systems penalize blatant keyword stuffing."</p>
           </div>

           <div className="glass-panel p-8 md:p-10 rounded-[48px] border border-slate-100 dark:border-white/5 bg-white dark:bg-black/40 shadow-xl flex flex-col justify-center">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Meaning Score</h3>
                 <span className={`text-[9px] font-black uppercase ${result.meaningScore > 70 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {result.meaningScore > 70 ? 'Strong Context' : 'Weak Credibility'}
                 </span>
              </div>
              <div className="h-4 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mb-3 relative">
                 <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 opacity-20" />
                 <div 
                   className={`h-full transition-all duration-1000 ${result.meaningScore > 70 ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]' : result.meaningScore > 40 ? 'bg-amber-500' : 'bg-red-500'}`} 
                   style={{ width: `${result.meaningScore}%` }} 
                 />
              </div>
              <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tighter text-right">{result.meaningScore}% Document Integrity</p>
           </div>
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-[56px] border border-slate-100 dark:border-white/5 bg-white dark:bg-black/60 shadow-2xl space-y-8 animate-fade-in relative overflow-visible">
           <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-white/5 pb-8">
              <div>
                 <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-800 dark:text-white">Extracted Resume Text Analysis</h3>
                 <p className="text-[9px] font-black text-orange-600 uppercase tracking-[0.4em] mt-1.5">Full Reconstructed Document Semantic Map</p>
              </div>
              <div className="flex flex-wrap gap-3">
                 <div className="flex items-center gap-2 bg-emerald-500/5 px-3 py-1.5 rounded-full border border-emerald-500/10">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">🟢 Optimized</span>
                 </div>
                 <div className="flex items-center gap-2 bg-red-500/5 px-3 py-1.5 rounded-full border border-red-500/10">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-red-600">🔴 Needs Fixing</span>
                 </div>
              </div>
           </header>

           <div className="relative overflow-visible">
              <div className="max-h-[700px] overflow-y-auto no-scrollbar p-8 md:p-12 bg-black rounded-[40px] border border-white/5 shadow-inner">
                 <div className="text-sm md:text-base text-slate-300 font-medium leading-relaxed whitespace-pre-wrap font-mono">
                    {result.annotatedContent.map((fragment, i) => (
                      <FragmentHighlight key={i} fragment={fragment} onHover={handleFragmentHover} />
                    ))}
                 </div>
              </div>
           </div>

           <div className="p-6 bg-orange-600/5 border border-orange-600/20 rounded-[32px]">
              <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 leading-relaxed text-center">
                <strong className="text-orange-600">Protocol:</strong> This X-ray displays the entirety of your extracted data. Highlighted sections indicate areas of high or low recruiter impact.
              </p>
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 print:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const catData = result.categories?.[cat.id] || { score: 0 };
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`p-5 rounded-[32px] border text-left transition-all h-full flex flex-col justify-between group print:border-slate-200 ${isActive ? 'bg-orange-600 border-orange-500 shadow-xl shadow-orange-600/20 text-white scale-[1.02]' : 'bg-white dark:bg-black border-slate-100 dark:border-white/10 text-slate-500 hover:border-orange-500/30'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className={`text-xl font-black ${isActive ? 'text-white' : 'text-slate-900 dark:text-white group-hover:text-orange-600'}`}>{catData.score}%</p>
                  <div className={`w-1.5 h-1.5 rounded-full ${catData.score > 80 ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : catData.score > 50 ? 'bg-orange-500' : 'bg-red-500 animate-pulse'}`} />
                </div>
                <p className={`text-[8px] font-black uppercase tracking-tight leading-tight ${isActive ? 'text-white/80' : 'text-slate-400'}`}>{cat.label}</p>
              </button>
            );
          })}
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-[56px] border border-slate-100 dark:border-white/5 bg-white dark:bg-black/60 shadow-sm animate-fade-in relative overflow-hidden print:shadow-none print:border-none print:p-8">
           <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-12">
              <div className="flex-1 space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-1.5 h-10 bg-orange-600 rounded-full" />
                    <div>
                       <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-slate-800 dark:text-white">
                         {CATEGORIES.find(c => c.id === activeCategory)?.label}
                       </h3>
                       <p className="text-[9px] font-black text-orange-600 uppercase tracking-[0.4em] mt-1.5">Segment Analysis</p>
                    </div>
                 </div>
                 <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-3xl">
                    {result.categories?.[activeCategory]?.description || "Comprehensive analysis of this resume segment is complete."}
                 </p>
              </div>
              <div className="flex flex-col items-center p-8 bg-slate-50 dark:bg-white/5 rounded-[40px] border dark:border-white/5 shadow-inner min-w-[140px]">
                 <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Score</p>
                 <p className="text-5xl font-black text-orange-600 tracking-tighter">{result.categories?.[activeCategory]?.score || 0}%</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 print:gap-10">
              <div className="space-y-4">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Validated signals</h4>
                 </div>
                 <div className="space-y-2">
                   {(result.categories?.[activeCategory]?.found && result.categories[activeCategory].found.length > 0) ? result.categories[activeCategory].found.map((item, i) => (
                     <div key={i} className="p-4 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-[22px] flex items-start gap-3 hover:bg-emerald-500/[0.05] transition-colors">
                        <span className="text-emerald-500 font-black text-[10px] mt-0.5">•</span>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{item}</p>
                     </div>
                   )) : (
                     <div className="p-4 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-[22px] flex items-start gap-3 italic">
                        <p className="text-xs text-slate-500 font-medium">Registry indicates baseline compliance in this segment.</p>
                     </div>
                   )}
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="w-7 h-7 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-red-500">Critical Gaps</h4>
                 </div>
                 <div className="space-y-2">
                   {(result.categories?.[activeCategory]?.missing && result.categories[activeCategory].missing.length > 0) ? result.categories[activeCategory].missing.map((item, i) => (
                     <div key={i} className="p-4 bg-red-500/[0.03] border border-red-500/10 rounded-[22px] flex items-start gap-3 hover:bg-red-500/[0.05] transition-colors">
                        <span className="text-red-500 font-black text-[10px] mt-0.5">•</span>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{item}</p>
                     </div>
                   )) : (
                     <div className="p-4 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-[22px] flex items-start gap-3">
                        <p className="text-xs text-emerald-600 font-black uppercase tracking-widest">No optimization gaps detected.</p>
                     </div>
                   )}
                 </div>
              </div>
           </div>

           {activeCategory === 'keywordAnalysis' && result.categories?.keywordAnalysis?.missingKeywordsExtended && result.categories.keywordAnalysis.missingKeywordsExtended.length > 0 && (
             <div className="mt-12 space-y-6 animate-fade-in print:mt-10">
                <div className="p-6 bg-orange-600/5 border border-orange-600/20 rounded-[32px] flex items-start gap-4">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5 text-orange-600 mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                   <div>
                      <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight mb-1">ATS Optimization Guide</p>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Implement these semantic signals to satisfy recruiter search heuristics.</p>
                   </div>
                </div>
                <div className="overflow-hidden rounded-[32px] border border-slate-200 dark:border-white/5 bg-white dark:bg-black/30">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="bg-slate-50 dark:bg-white/5">
                            <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-white/5">Required Signal</th>
                            <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-white/5">Example Implementation</th>
                            <th className="px-6 py-4 text-[9px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-white/5 text-right">Priority</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                         {result.categories.keywordAnalysis.missingKeywordsExtended.map((k, i) => (
                           <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                              <td className="px-6 py-5">
                                 <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight">{k.name}</p>
                              </td>
                              <td className="px-6 py-5 max-w-xs md:max-w-md">
                                 <p className="text-[11px] text-slate-500 dark:text-slate-400 italic leading-relaxed">"{k.example}"</p>
                              </td>
                              <td className="px-6 py-5 text-right">
                                 <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${k.importance === 'High' ? 'bg-red-500/5 border-red-500/20 text-red-500' : 'bg-orange-500/5 border-orange-500/20 text-orange-500'}`}>
                                   {k.importance}
                                 </span>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
           )}

           <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/5 blur-[120px] rounded-full pointer-events-none" />
        </div>

        <div className="hidden print:block text-center mt-12 pt-6 border-t border-slate-100">
           <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.5em]">AI-Synthesized Document by LPU-Nexus • Verify at nexus.verto.ai</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20 px-4 md:px-0">
      <header className="text-center space-y-4">
        <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Placement Prefect</h2>
        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Registry Hub for Professional Diagnostics</p>
      </header>

      <div className="glass-panel p-8 md:p-12 rounded-[64px] border border-slate-100 dark:border-white/5 bg-white dark:bg-black/60 shadow-2xl space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           <div className="space-y-5">
              <div className="flex items-center gap-3">
                 <div className="w-7 h-7 rounded-xl bg-orange-600/10 flex items-center justify-center text-orange-600 font-black text-[10px]">1</div>
                 <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] block">Source Artifact</label>
              </div>
              <div className="relative border-4 border-dashed border-slate-100 dark:border-white/5 rounded-[40px] p-12 text-center hover:border-orange-500/40 transition-all bg-slate-50 dark:bg-white/[0.02] group cursor-pointer shadow-inner">
                <input type="file" accept=".pdf" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <IconFile />
                <p className="text-sm font-black uppercase tracking-widest text-slate-400 group-hover:text-orange-600 transition-colors">
                  {fileName ? fileName : "Inject Resume (PDF)"}
                </p>
                {!fileName && <p className="text-[8px] font-bold text-slate-400 uppercase mt-4 tracking-widest opacity-40">System accepts PDF & TXT protocols</p>}
              </div>
           </div>

           <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-7 h-7 rounded-xl bg-orange-600/10 flex items-center justify-center text-orange-600 font-black text-[10px]">2</div>
                   <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] block">Target Parameter</label>
                </div>
                <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-[16px]">
                  <button onClick={() => setAnalysisMode('trend')} className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${analysisMode === 'trend' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500'}`}>Presets</button>
                  <button onClick={() => setAnalysisMode('custom')} className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${analysisMode === 'custom' ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500'}`}>Raw JD</button>
                </div>
              </div>
              {analysisMode === 'trend' ? (
                <div className="grid grid-cols-2 gap-2">
                  {INDUSTRY_ROLES.map(role => (
                    <button key={role.id} onClick={() => handleRoleSelect(role.id)} className={`p-4 rounded-2xl border text-left transition-all ${selectedRoleId === role.id ? 'bg-orange-600/10 border-orange-600 text-orange-500 scale-[1.02]' : 'bg-slate-50 dark:bg-black border-slate-100 dark:border-white/5 text-slate-500 hover:border-orange-500/30'}`}>
                      <p className="text-[9px] font-black uppercase tracking-tight leading-tight">{role.name}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <textarea 
                  className="w-full h-[184px] bg-slate-50 dark:bg-black/60 border border-slate-100 dark:border-white/10 rounded-[32px] p-6 text-xs text-slate-800 dark:text-white focus:ring-4 focus:ring-orange-600/10 outline-none resize-none transition-all font-bold placeholder:opacity-30 shadow-inner" 
                  placeholder="Paste official job description or market requirements..." 
                  value={jdText} 
                  onChange={(e) => setJdText(e.target.value)} 
                />
              )}
           </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-100 dark:border-white/5">
           <button 
             onClick={() => setDeepAnalysis(!deepAnalysis)}
             className={`flex items-center gap-4 px-6 py-3 rounded-[24px] border transition-all cursor-pointer group ${deepAnalysis ? 'bg-red-600 border-red-500 shadow-xl shadow-red-600/30' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 hover:border-red-500/50'}`}
           >
              <div className={`w-3 h-3 rounded-full transition-all ${deepAnalysis ? 'bg-white shadow-[0_0_10px_#fff]' : 'bg-slate-400 group-hover:bg-red-500'}`} />
              <div className="text-left">
                <span className={`text-[9px] font-black uppercase tracking-widest block ${deepAnalysis ? 'text-white' : 'text-slate-400 group-hover:text-red-500'}`}>Deep Scrutiny</span>
                <span className={`text-[7px] font-bold uppercase opacity-60 ${deepAnalysis ? 'text-white' : 'text-slate-400'}`}>Hyper-critical vetting</span>
              </div>
           </button>
           <button 
             onClick={handleAnalyze} 
             disabled={!resumeText || !jdText || loading} 
             className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-orange-600/30 hover:scale-[1.03] active:scale-95 transition-all border-none disabled:opacity-30"
           >
             Synthesize Report
           </button>
        </div>
      </div>

      {/* History Grid */}
      {savedReports.length > 0 && (
        <section className="space-y-6">
           <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 text-center">Historical Archives</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {savedReports.map((report, idx) => (
                <div key={idx} onClick={() => setResult(report)} className="p-5 bg-white dark:bg-black/40 border border-slate-100 dark:border-white/5 rounded-[32px] cursor-pointer hover:border-orange-500/50 transition-all group flex items-center justify-between">
                   <div className="min-w-0 flex-1 pr-4">
                      <p className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-tighter truncate">{report.label || `Report ${idx + 1}`}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[8px] font-black text-orange-600 uppercase tracking-widest">Match: {report.totalScore}%</span>
                        <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">{new Date(report.analysisDate || Date.now()).toLocaleDateString()}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => initRename(idx, e)}
                        className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-orange-500 transition-all border-none shadow-sm"
                      >
                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button 
                        onClick={(e) => handleDeleteReport(idx, e)}
                        className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all border-none shadow-sm"
                      >
                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </section>
      )}

      {/* Rename Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in overflow-hidden">
          <div className="bg-[#0a0a0a] rounded-[48px] w-full max-w-sm border border-white/10 shadow-[0_32px_128px_rgba(0,0,0,0.8)] overflow-hidden">
            <div className="p-10 text-center">
              <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">Rename Report</h3>
              <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em]">Personalize the archive label</p>
              <div className="mt-8">
                <input 
                  autoFocus
                  type="text" 
                  value={renameValue} 
                  onChange={e => setRenameValue(e.target.value)} 
                  placeholder="Enter label..."
                  onKeyDown={e => e.key === 'Enter' && handleRenameExecute()}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-black text-white outline-none focus:ring-4 focus:ring-orange-600/10 transition-all"
                />
              </div>
              <div className="flex gap-4 mt-8">
                <button onClick={() => setShowRenameModal(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors border-none bg-transparent">Cancel</button>
                <button onClick={handleRenameExecute} className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all border-none">Update</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementPrefect;

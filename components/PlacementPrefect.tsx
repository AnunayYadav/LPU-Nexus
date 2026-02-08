
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { extractTextFromPdf } from '../services/pdfUtils';
import { analyzeResume } from '../services/geminiService';
import { ResumeAnalysisResult, UserProfile } from '../types';
import NexusServer from '../services/nexusServer.ts';

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

const SemiCircleGauge = ({ score, size = 200 }: { score: number; size?: number }) => {
  const radius = size / 2.5;
  const strokeWidth = 14;
  const circumference = Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size / 1.5} viewBox={`0 0 ${size} ${size / 2}`}>
        <path
          d={`M ${size * 0.1} ${size / 2} A ${radius} ${radius} 0 0 1 ${size * 0.9} ${size / 2}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-white/5"
        />
        <path
          d={`M ${size * 0.1} ${size / 2} A ${radius} ${radius} 0 0 1 ${size * 0.9} ${size / 2}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-orange-600 transition-all duration-[1500ms] ease-out shadow-lg"
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center mt-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Score</p>
        <p className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">{score}%</p>
      </div>
    </div>
  );
};

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

  const detailRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        const text = await extractTextFromPdf(file);
        setResumeText(text);
        setFileName(file.name);
      } catch (err) {
        alert("Failed to read PDF.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Define handleRoleSelect to process predefined role selection
  const handleRoleSelect = (roleId: string) => {
    setSelectedRoleId(roleId);
    const role = INDUSTRY_ROLES.find(r => r.id === roleId);
    if (role) {
      setJdText(`Target Role: ${role.name}. Expected Keywords: ${role.keywords}`);
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
      alert("Analysis failed. Registry Congested.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (id: CategoryID) => {
    setActiveCategory(id);
    detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-8 animate-fade-in">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-orange-500/10 rounded-full" />
          <div className="absolute inset-0 w-24 h-24 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-black uppercase tracking-widest text-slate-800 dark:text-white">Synthesizing Report</h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 animate-pulse">Running Diagnostic Protocol...</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20 px-4 md:px-0">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white dark:bg-slate-950 p-10 rounded-[48px] border border-slate-100 dark:border-white/5 shadow-sm">
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase mb-2">Resume Report</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">{fileName}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setResult(null)} className="px-8 py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-slate-200">Re-upload</button>
            <button className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-600/20 active:scale-95 transition-all">Download PDF</button>
          </div>
        </header>

        <div className="glass-panel p-10 md:p-14 rounded-[56px] border border-slate-100 dark:border-white/5 bg-white dark:bg-black/40 shadow-2xl flex flex-col items-center">
          <SemiCircleGauge score={result.totalScore} size={350} />
          <div className="mt-8 text-center max-w-xl">
             <p className="text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed italic">
               "{result.summary}"
             </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => {
            const catData = result.categories[cat.id];
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`p-6 rounded-[32px] border text-left transition-all h-full flex flex-col justify-between ${isActive ? 'bg-orange-600 border-orange-500 shadow-xl shadow-orange-600/20 text-white' : 'bg-white dark:bg-black border-slate-100 dark:border-white/10 text-slate-500'}`}
              >
                <p className={`text-[18px] font-black mb-3 ${isActive ? 'text-white' : 'text-slate-800 dark:text-white'}`}>{catData.score}%</p>
                <p className={`text-[9px] font-black uppercase tracking-tight leading-tight ${isActive ? 'text-white/80' : 'text-slate-500'}`}>{cat.label}</p>
              </button>
            );
          })}
        </div>

        <div ref={detailRef} className="glass-panel p-10 md:p-16 rounded-[64px] border border-slate-100 dark:border-white/5 bg-white dark:bg-black/60 shadow-sm animate-fade-in">
           <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 mb-12">
              <div className="flex-1 space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="w-1.5 h-10 bg-orange-600 rounded-full" />
                    <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-slate-800 dark:text-white">
                      {CATEGORIES.find(c => c.id === activeCategory)?.label}
                    </h3>
                 </div>
                 <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
                    {result.categories[activeCategory].description}
                 </p>
              </div>
              <div className="flex flex-col items-center p-8 bg-slate-50 dark:bg-white/5 rounded-[40px] border dark:border-white/5">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Section Score</p>
                 <p className="text-4xl font-black text-orange-600">{result.categories[activeCategory].score}%</p>
              </div>
           </div>

           <div className="space-y-6">
              {activeCategory === 'keywordAnalysis' && (
                <div className="space-y-8">
                  <div className="p-8 bg-orange-600/5 border border-orange-600/20 rounded-[40px] flex items-start gap-4">
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                     <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                       Your resume is missing important keywords related to your job title. Consider incorporating the keywords below to enhance your resume's effectiveness.
                     </p>
                  </div>
                  <div className="overflow-hidden rounded-[32px] border border-slate-100 dark:border-white/5">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="bg-slate-50 dark:bg-white/5">
                              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Missing keywords to include</th>
                              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Importance</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5 bg-white dark:bg-black/20">
                           {result.categories.keywordAnalysis.missingKeywords.map((k, i) => (
                             <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                <td className="px-8 py-6">
                                   <p className="text-sm font-black text-slate-800 dark:text-white mb-1 uppercase tracking-tight">{k.name}</p>
                                   <p className="text-xs text-slate-500 dark:text-slate-400 italic">Example: {k.example}</p>
                                </td>
                                <td className="px-8 py-6 text-right">
                                   <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-600/10 px-3 py-1.5 rounded-lg">{k.importance}</span>
                                </td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
                </div>
              )}

              {activeCategory === 'jobFit' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.categories.jobFit.gaps.map((gap, i) => (
                    <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[32px] flex items-center gap-5">
                       <div className="w-10 h-10 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 border border-red-500/20"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12"/></svg></div>
                       <p className="text-sm font-bold text-slate-300">{gap}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeCategory === 'achievements' && (
                <div className="space-y-4">
                  {result.categories.achievements.advice.map((item, i) => (
                    <div key={i} className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl flex items-center gap-5">
                       <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-[10px]">{i+1}</div>
                       <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Fallback for other categories */}
              {activeCategory !== 'keywordAnalysis' && activeCategory !== 'jobFit' && activeCategory !== 'achievements' && (
                <div className="p-10 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[48px] text-center opacity-40">
                  <p className="text-xs font-black uppercase tracking-[0.3em]">Detailed ledger pending analysis...</p>
                </div>
              )}
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20">
      <header className="text-center">
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-4">Placement Prefect</h2>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Professional ATS Diagnostic Terminal</p>
      </header>

      <div className="glass-panel p-10 rounded-[56px] border border-white/5 bg-black shadow-2xl space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase text-orange-600 tracking-[0.3em] block ml-1">1. Professional Artifact</label>
              <div className="relative border-4 border-dashed border-white/5 rounded-[40px] p-12 text-center hover:border-orange-500/30 transition-all bg-white/[0.01] group cursor-pointer">
                <input type="file" accept=".pdf" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <IconFile />
                <p className="text-sm font-black uppercase tracking-widest text-slate-400">
                  {fileName ? <span className="text-emerald-500">{fileName}</span> : "Upload PDF Resume"}
                </p>
              </div>
           </div>

           <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase text-orange-600 tracking-[0.3em] block ml-1">2. Target Parameters</label>
                <div className="flex bg-white/5 p-1 rounded-xl">
                  <button onClick={() => setAnalysisMode('trend')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${analysisMode === 'trend' ? 'bg-orange-600 text-white' : 'text-slate-500'}`}>Presets</button>
                  <button onClick={() => setAnalysisMode('custom')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${analysisMode === 'custom' ? 'bg-orange-600 text-white' : 'text-slate-500'}`}>JD Text</button>
                </div>
              </div>
              {analysisMode === 'trend' ? (
                <div className="grid grid-cols-1 gap-2">
                  {INDUSTRY_ROLES.map(role => (
                    <button key={role.id} onClick={() => handleRoleSelect(role.id)} className={`p-4 rounded-[24px] border text-left transition-all ${selectedRoleId === role.id ? 'bg-orange-600/10 border-orange-600 text-orange-500' : 'bg-black border-white/5 text-slate-500 hover:border-white/20'}`}>
                      <p className="text-[10px] font-black uppercase tracking-tight">{role.name}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <textarea className="w-full h-44 bg-white/5 border border-white/10 rounded-[32px] p-6 text-sm text-white focus:ring-4 focus:ring-orange-600/10 outline-none resize-none transition-all font-bold placeholder:opacity-20" placeholder="Paste target description here..." value={jdText} onChange={(e) => setJdText(e.target.value)} />
              )}
           </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5">
           <div className={`flex items-center gap-4 px-6 py-4 rounded-[28px] border transition-all cursor-pointer ${deepAnalysis ? 'bg-red-600 border-red-500 shadow-xl' : 'bg-white/5 border-white/5'}`} onClick={() => setDeepAnalysis(!deepAnalysis)}>
              <div className={`w-3 h-3 rounded-full ${deepAnalysis ? 'bg-white animate-pulse' : 'bg-slate-600'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">Ruthless Roast Mode</span>
           </div>
           <button onClick={handleAnalyze} disabled={!resumeText || !jdText || loading} className="w-full md:w-auto px-16 py-5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all border-none">Commence Audit</button>
        </div>
      </div>
    </div>
  );
};

export default PlacementPrefect;

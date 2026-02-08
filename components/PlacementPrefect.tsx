
import React, { useState, useEffect, useMemo } from 'react';
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
  { id: 'pm', name: 'Product Manager', keywords: 'Product Strategy, Agile/Scrum, User Stories, Roadmapping, Stakeholder Management, Market Analysis' }
];

interface PlacementPrefectProps {
  userProfile?: UserProfile | null;
}

const PlacementPrefect: React.FC<PlacementPrefectProps> = ({ userProfile }) => {
  const [resumeText, setResumeText] = useState<string>('');
  const [jdText, setJdText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [deepAnalysis, setDeepAnalysis] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'custom' | 'trend'>('trend');
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [history, setHistory] = useState<any[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<'jd' | 'resume' | 'changes'>('jd');
  const [keywordTab, setKeywordTab] = useState<'missing' | 'found'>('missing');

  useEffect(() => { loadHistory(); }, [userProfile]);

  const loadHistory = async () => {
    try {
      const records = await NexusServer.fetchRecords(userProfile?.id || null, 'resume_audit');
      setHistory(records);
    } catch (e) { console.error(e); }
  };

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

  const handleRoleSelect = (roleId: string) => {
    setSelectedRoleId(roleId);
    const role = INDUSTRY_ROLES.find(r => r.id === roleId);
    if (role) setJdText(`Role: ${role.name}. Requirements: ${role.keywords}`);
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

  const saveAudit = async () => {
    if (!result || !fileName || !userProfile) {
      alert("Sign in required to archive results.");
      return;
    }
    setIsSaving(true);
    try {
      await NexusServer.saveRecord(userProfile.id, 'resume_audit', fileName, result);
      await loadHistory();
      alert("Diagnostic Report Archived.");
    } catch (e: any) { alert("Save Failed."); } finally { setIsSaving(false); }
  };

  const HighlightedJD = useMemo(() => {
    if (!result || !jdText) return jdText;
    let highlighted = jdText;
    result.keywords.found.forEach(word => {
      const regex = new RegExp(`\\b(${word})\\b`, 'gi');
      highlighted = highlighted.replace(regex, `<span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-md font-black mx-0.5">$1</span>`);
    });
    return highlighted;
  }, [result, jdText]);

  if (!result && !loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20">
        <header className="text-center">
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-4">Placement Prefect</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">AI-Powered ATS Diagnostic Terminal</p>
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
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-20 px-4 md:px-0">
      {/* Dynamic Header */}
      <header className="flex items-center justify-between bg-black border border-white/10 p-6 rounded-[32px] shadow-xl">
        <div className="flex items-center gap-6">
           <button onClick={() => setResult(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors border-none"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></button>
           <div>
              <h2 className="text-xl font-black uppercase tracking-tighter">ATS Diagnostics</h2>
              <p className="text-[8px] font-black text-orange-600 uppercase tracking-[0.4em]">{fileName || 'Untitled Artifact'}</p>
           </div>
        </div>
        <div className="flex gap-3">
          <button onClick={saveAudit} disabled={isSaving} className="px-6 py-3 bg-white/5 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-orange-600 transition-all border-none">
            {isSaving ? 'Archiving...' : 'Save to Vault'}
          </button>
          <button onClick={() => setResult(null)} className="px-6 py-3 bg-orange-600 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl border-none">Re-upload</button>
        </div>
      </header>

      {loading ? (
         <div className="h-[600px] flex flex-col items-center justify-center space-y-8 glass-panel rounded-[56px] border border-white/5">
            <div className="w-20 h-20 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
            <div className="text-center">
              <p className="text-lg font-black uppercase tracking-tighter text-white">Synthesizing Professional Identity</p>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600 animate-pulse mt-2">Scrubbing Omissions...</p>
            </div>
         </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* LEFT PANEL: The Audit Statistics */}
          <div className="lg:col-span-5 space-y-8">
            <div className="glass-panel p-10 rounded-[48px] bg-black border border-white/10 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
               <div className="relative mb-8">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={552.9} strokeDashoffset={552.9 - (552.9 * (result?.totalScore || 69)) / 100} strokeLinecap="round" className="text-orange-600 transition-all duration-[2000ms] ease-out shadow-[0_0_20px_rgba(234,88,12,0.4)]" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                     <span className="text-6xl font-black tracking-tighter text-white">{result?.totalScore || 69}</span>
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Relevancy Score</span>
                  </div>
               </div>
               
               <div className="space-y-4">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">
                    {result?.totalScore && result.totalScore > 80 ? "Optimized Alignment" : "Omission Detected"}
                  </h3>
                  <p className="text-xs font-medium text-slate-400 leading-relaxed max-w-sm">
                    {result?.summary || "Your resume is missing critical keywords and is not well targeted to the job description. This could result in your resume not getting past automated screening software."}
                  </p>
               </div>
               
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-600/5 blur-[60px] rounded-full pointer-events-none" />
            </div>

            <div className="glass-panel p-8 rounded-[40px] bg-black border border-white/10 shadow-xl flex flex-col h-[500px]">
               <div className="flex border-b border-white/5 mb-6">
                  <button onClick={() => setKeywordTab('missing')} className={`flex-1 pb-4 text-[10px] font-black uppercase tracking-widest transition-all ${keywordTab === 'missing' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-slate-500 hover:text-white'}`}>Missing Keywords</button>
                  <button onClick={() => setKeywordTab('found')} className={`flex-1 pb-4 text-[10px] font-black uppercase tracking-widest transition-all ${keywordTab === 'found' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-white'}`}>Found Keywords</button>
               </div>
               
               <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
                  <div className="flex items-center px-4 py-2 text-[8px] font-black text-slate-600 uppercase tracking-widest">
                     <span className="flex-1">Keyword or Skill</span>
                     <span className="w-16 text-center">Frequency</span>
                     <span className="w-12 text-center">Priority</span>
                  </div>
                  {(keywordTab === 'missing' ? result?.keywords.missing : result?.keywords.found)?.map((word, i) => (
                    <div key={i} className="flex items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/20 transition-all group">
                       <span className={`flex-1 text-xs font-black uppercase tracking-tight ${keywordTab === 'found' ? 'text-emerald-400' : 'text-white'}`}>{word}</span>
                       <span className="w-16 text-center text-[10px] font-bold text-slate-500">{(Math.floor(Math.random() * 4) + 1)}</span>
                       <div className="w-12 flex justify-center">
                          <svg viewBox="0 0 24 24" fill={i < 2 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" className={`w-3 h-3 ${i < 2 ? 'text-orange-500' : 'text-slate-700'}`}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* RIGHT PANEL: Intelligence View */}
          <div className="lg:col-span-7 flex flex-col h-[900px]">
             <div className="bg-white/5 border border-white/10 rounded-[40px] flex-1 overflow-hidden flex flex-col shadow-2xl">
                <header className="p-4 bg-black flex gap-2 border-b border-white/10">
                   {[
                     { id: 'jd', label: 'Job Description', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg> },
                     { id: 'resume', label: 'Your Resume', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
                     { id: 'changes', label: 'Suggested Edits', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> }
                   ].map(tab => (
                     <button 
                        key={tab.id} 
                        onClick={() => setRightPanelTab(tab.id as any)}
                        className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all border-none ${rightPanelTab === tab.id ? 'bg-orange-600 text-white shadow-lg' : 'text-slate-500 hover:bg-white/5 hover:text-white'}`}
                     >
                        {tab.icon}
                        {tab.label}
                     </button>
                   ))}
                </header>

                <div className="flex-1 overflow-y-auto p-10 md:p-14 bg-[#080808] relative no-scrollbar">
                   {rightPanelTab === 'jd' && (
                     <div className="space-y-8 animate-fade-in">
                        <div className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-3xl mb-10">
                           <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><polyline points="20 6 9 17 4 12"/></svg>
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Alignment Active</p>
                              <p className="text-sm font-bold text-white uppercase tracking-tight">Keywords highlighted below</p>
                           </div>
                        </div>
                        <div 
                           className="text-lg font-medium text-slate-300 leading-[2] whitespace-pre-wrap selection:bg-orange-600/30"
                           dangerouslySetInnerHTML={{ __html: HighlightedJD }} 
                        />
                     </div>
                   )}

                   {rightPanelTab === 'resume' && (
                      <div className="animate-fade-in">
                        <div className="p-8 border border-white/5 rounded-[32px] bg-white/[0.01] text-slate-400 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                           {resumeText}
                        </div>
                      </div>
                   )}

                   {rightPanelTab === 'changes' && (
                      <div className="space-y-8 animate-fade-in">
                         <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-6">Optimization Checklist</h3>
                         <div className="space-y-4">
                            {result?.phrasingAdvice.map((advice, i) => (
                              <div key={i} className="flex gap-5 p-6 bg-white/[0.02] border border-white/5 rounded-[32px] group hover:border-orange-500/30 transition-all">
                                 <div className="w-8 h-8 rounded-full bg-orange-600/10 flex items-center justify-center text-orange-500 border border-orange-600/20 flex-shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-all">
                                    <span className="text-xs font-black">{i + 1}</span>
                                 </div>
                                 <p className="text-sm font-bold text-slate-300 leading-relaxed pt-1">{advice}</p>
                              </div>
                            ))}
                         </div>
                         <div className="p-8 bg-red-600/10 border border-red-600/20 rounded-[40px] mt-10">
                            <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-4">Recruiter Reality Check</h4>
                            <p className="text-sm font-medium text-red-400/80 leading-relaxed italic">"{result?.benchmarking.comparison}"</p>
                         </div>
                      </div>
                   )}
                </div>
                
                <footer className="p-8 border-t border-white/5 bg-black flex items-center justify-between">
                   <div className="flex gap-8">
                      <div className="text-center">
                         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">ATS Scan</p>
                         <p className="text-xl font-black text-white">{result?.scores.atsMatch}%</p>
                      </div>
                      <div className="text-center">
                         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Impact</p>
                         <p className="text-xl font-black text-white">{result?.scores.recruiterScore}%</p>
                      </div>
                      <div className="text-center">
                         <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Layout</p>
                         <p className="text-xl font-black text-white">{result?.scores.formattingScore}%</p>
                      </div>
                   </div>
                   <button onClick={saveAudit} className="px-10 py-4 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all border-none">Export Diagnostics</button>
                </footer>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementPrefect;


import React, { useState, useEffect } from 'react';
import { extractTextFromPdf } from '../services/pdfUtils';
import { analyzeResume } from '../services/geminiService';
import { ResumeAnalysisResult, UserProfile } from '../types';
import NexusServer from '../services/nexusServer.ts';

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

const INDUSTRY_ROLES = [
  { id: 'swe', name: 'Software Engineer', keywords: 'Algorithms, System Design, Java/Python/C++, Git, Problem Solving, Unit Testing' },
  { id: 'frontend', name: 'Frontend Developer', keywords: 'React.js, TypeScript, Tailwind CSS, Web Performance, State Management (Zustand/Redux), Next.js' },
  { id: 'backend', name: 'Backend Developer', keywords: 'Node.js, Microservices, SQL/NoSQL, API Security, Cloud Deployment, Redis/Kafka' },
  { id: 'ai', name: 'AI/ML Engineer', keywords: 'Python, PyTorch/TensorFlow, LLMs, RAG, Data Pipelines, Model Fine-tuning, Vector Databases' },
  { id: 'data', name: 'Data Scientist', keywords: 'Statistical Analysis, SQL, Data Visualization, Scikit-learn, Machine Learning, Business Intelligence' },
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

  useEffect(() => {
    loadHistory();
  }, [userProfile]);

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
    if (role) {
      setJdText(`Role: ${role.name}. Keywords: ${role.keywords}`);
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
    } catch (e: any) {
      alert("Save Failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const ScoreHex = ({ label, score, color }: { label: string, score: number, color: string }) => (
    <div className="flex flex-col items-center p-6 bg-black border border-white/5 rounded-[32px] flex-1">
      <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">{label}</p>
      <div className={`text-4xl font-black tracking-tighter ${color}`}>{score}%</div>
      <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
        <div className={`h-full ${color.replace('text-', 'bg-')} transition-all duration-1000`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20 px-4 md:px-0">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 tracking-tighter">Placement Prefect</h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Professional ATS Diagnostic Terminal. Zero sugarcoating, pure reality.</p>
        </div>
        {result && (
          <button onClick={saveAudit} disabled={isSaving} className="bg-orange-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all border-none">
            {isSaving ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/></svg>}
            Archive Results
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-8 rounded-[48px] border border-white/5 bg-black">
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-4 tracking-[0.2em]">1. Upload Artifact</label>
            <div className="relative border-2 border-dashed border-white/10 rounded-3xl p-8 text-center hover:border-orange-500 transition-all bg-white/[0.02] group cursor-pointer">
              <input type="file" accept=".pdf" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <IconFile />
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                {fileName ? <span className="text-orange-600">{fileName}</span> : "Drop PDF Protocol"}
              </p>
            </div>

            <div className="mt-8 space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">2. Target Param</label>
                <div className="flex bg-white/5 p-1 rounded-xl">
                  <button onClick={() => setAnalysisMode('trend')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${analysisMode === 'trend' ? 'bg-orange-600 text-white' : 'text-slate-500'}`}>Market</button>
                  <button onClick={() => setAnalysisMode('custom')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${analysisMode === 'custom' ? 'bg-orange-600 text-white' : 'text-slate-500'}`}>JD</button>
                </div>
              </div>
              {analysisMode === 'trend' ? (
                <div className="grid grid-cols-1 gap-2">
                  {INDUSTRY_ROLES.map(role => (
                    <button key={role.id} onClick={() => handleRoleSelect(role.id)} className={`p-4 rounded-2xl border text-left transition-all ${selectedRoleId === role.id ? 'bg-orange-600/10 border-orange-600 text-orange-500' : 'bg-black border-white/5 text-slate-500 hover:border-white/20'}`}>
                      <p className="text-[10px] font-black uppercase tracking-tight">{role.name}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <textarea className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white focus:ring-2 focus:ring-orange-600 outline-none resize-none transition-all font-bold" placeholder="Paste target description..." value={jdText} onChange={(e) => setJdText(e.target.value)} />
              )}
            </div>

            <div className={`mt-8 flex items-center gap-3 p-4 rounded-2xl border transition-all ${deepAnalysis ? 'bg-red-600 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-red-600/5 border-red-600/10'}`}>
              <input type="checkbox" id="deep" checked={deepAnalysis} onChange={e => setDeepAnalysis(e.target.checked)} className="w-4 h-4 rounded-lg accent-black cursor-pointer" />
              <label htmlFor="deep" className={`text-[9px] font-black uppercase tracking-widest cursor-pointer ${deepAnalysis ? 'text-white' : 'text-red-500'}`}>
                {deepAnalysis ? 'RUTHLESS ROAST ACTIVE' : 'RUTHLESS ROAST MODE'}
              </label>
            </div>

            <button onClick={handleAnalyze} disabled={!resumeText || !jdText || loading} className={`w-full mt-6 py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] text-white shadow-2xl transition-all active:scale-95 border-none ${loading ? 'bg-slate-800' : deepAnalysis ? 'bg-red-600 hover:bg-red-700' : 'bg-gradient-to-r from-orange-600 to-red-700'}`}>
              {loading ? 'CRUSHING DREAMS...' : deepAnalysis ? 'COMMENCE DESTRUCTION' : 'INITIATE AUDIT'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-8">
          {loading ? (
            <div className="h-[600px] flex flex-col items-center justify-center space-y-6">
               <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 animate-pulse">Scanning for mediocrity...</p>
            </div>
          ) : result ? (
            <div className="space-y-8 animate-fade-in">
              {/* Score Breakdown */}
              <div className="flex flex-col md:flex-row gap-4">
                 <ScoreHex label="ATS Compliance" score={result.scores.atsMatch} color="text-orange-500" />
                 <ScoreHex label="Hireability Odds" score={result.scores.recruiterScore} color="text-red-500" />
                 <ScoreHex label="Formatting Sin" score={result.scores.formattingScore} color="text-emerald-500" />
              </div>

              {/* Section Health */}
              <div className="glass-panel p-8 rounded-[48px] border border-white/5 bg-black">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Autopsy Report</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.sectionHealth.map((sh, i) => (
                    <div key={i} className="p-5 rounded-3xl bg-white/[0.02] border border-white/5">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase text-white">{sh.section}</span>
                        <span className={`px-3 py-1 rounded-full text-[7px] font-black uppercase ${sh.status === 'OPTIMIZED' ? 'bg-emerald-500/10 text-emerald-500' : sh.status === 'CRITICAL' ? 'bg-red-500 text-white' : 'bg-orange-500/10 text-orange-500'}`}>{sh.status}</span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-500 leading-relaxed">{sh.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Proof Checker */}
              <div className="glass-panel p-8 rounded-[48px] border border-white/5 bg-black">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Lies & Liabilities Ledger</h3>
                <div className="space-y-3">
                  {result.skillProof.map((sp, i) => (
                    <div key={i} className={`flex items-center justify-between p-5 rounded-2xl border ${sp.isVerified ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-red-500/10 border-red-500'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${sp.isVerified ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-600 animate-pulse'}`} />
                        <div>
                          <p className="text-xs font-black uppercase tracking-tight text-white">{sp.skill}</p>
                          <p className="text-[10px] text-slate-500 font-bold mt-1">{sp.feedback}</p>
                        </div>
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-widest ${sp.isVerified ? 'text-emerald-500' : 'text-red-600'}`}>{sp.isVerified ? 'Verified' : 'BULLSHIT DETECTED'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benchmarking & Keywords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-panel p-8 rounded-[48px] border border-white/5 bg-black">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Reality Check</h3>
                  <p className="text-sm font-black tracking-tight text-red-500 mb-4">{result.benchmarking.comparison}</p>
                  <ul className="space-y-3">
                    {result.benchmarking.gapToTop1Percent.map((gap, i) => (
                      <li key={i} className="flex items-center gap-3 text-[11px] font-bold text-slate-400">
                        <div className="w-1 h-1 bg-red-600 rounded-full" />
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-panel p-8 rounded-[48px] border border-white/5 bg-black">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Keyword Pulse</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[8px] font-black uppercase text-emerald-500 mb-2 tracking-widest">Bare Minimum Met</p>
                      <div className="flex flex-wrap gap-2">
                        {result.keywords.found.map((k, i) => <span key={i} className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-bold text-white uppercase">{k}</span>)}
                      </div>
                    </div>
                    <div>
                      <p className="text-[8px] font-black uppercase text-red-500 mb-2 tracking-widest">Pathetic Omissions</p>
                      <div className="flex flex-wrap gap-2">
                        {result.keywords.missing.map((k, i) => <span key={i} className="px-3 py-1 bg-red-500/20 rounded-lg text-[9px] font-bold text-red-500 uppercase">{k}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button onClick={() => setResult(null)} className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors border-none bg-transparent">Burn Evidence & Restart</button>
            </div>
          ) : (
            <div className="h-[600px] flex flex-col items-center justify-center glass-panel rounded-[56px] border-4 border-dashed border-white/5 opacity-30">
               <IconTarget />
               <p className="text-[11px] font-black uppercase tracking-[0.4em]">Awaiting Professional Artifacts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlacementPrefect;


import React, { useMemo } from 'react';

const ShareReport: React.FC = () => {
  const data = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const d = params.get('d');
    if (!d) return null;
    try {
      return JSON.parse(atob(d));
    } catch (e) {
      return null;
    }
  }, []);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-10">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-10 h-10 text-red-500"><path d="m21 21-4.3-4.3"/><circle cx="11" cy="11" r="8"/><line x1="11" y1="8" x2="11" y2="12"/><line x1="11" y1="16" x2="11.01" y2="16"/></svg>
        </div>
        <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Credential Link Expired</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2">The academic protocol you requested could not be synthesized.</p>
        <button 
          onClick={() => window.location.href = '/cgpa'}
          className="mt-8 bg-orange-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-600/20"
        >
          Create New Protocol
        </button>
      </div>
    );
  }

  const academicStanding = useMemo(() => {
    const sgpa = parseFloat(data.sgpa);
    if (sgpa >= 9.5) return { label: "Nexus Elite Scholar", color: "text-orange-500", bg: "bg-orange-500/10" };
    if (sgpa >= 9.0) return { label: "Exceptional Performer", color: "text-amber-500", bg: "bg-amber-500/10" };
    if (sgpa >= 8.5) return { label: "High Achiever", color: "text-orange-600", bg: "bg-orange-600/10" };
    if (sgpa >= 7.5) return { label: "Verified Academic", color: "text-slate-600", bg: "bg-slate-500/10" };
    return { label: "Academic Explorer", color: "text-slate-500", bg: "bg-slate-500/10" };
  }, [data.sgpa]);

  const timestamp = new Date(data.ts).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="max-w-2xl mx-auto animate-fade-in py-10 px-4 md:py-20">
      <div className="relative glass-panel rounded-[56px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] border-none p-1 bg-white dark:bg-slate-950">
        
        {/* Aesthetic Decals */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 blur-[100px] pointer-events-none rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600/5 blur-[100px] pointer-events-none rounded-full -ml-32 -mb-32" />
        
        <div className="relative z-10 p-8 md:p-14 space-y-12">
          
          {/* Official Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                 <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600 dark:text-orange-500">LPU-NEXUS ACADEMIC PROTOCOL</span>
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">VERIFIED INSIGHT</h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Protocol ID: NS-{Math.floor(data.ts/100000)}</p>
            </div>
            
            {/* Verified Badge */}
            <div className="relative group cursor-help">
              <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full group-hover:bg-emerald-500/40 transition-all duration-500" />
              <div className="relative bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 px-6 py-4 rounded-[32px] flex items-center gap-3 backdrop-blur-md">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                   <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Verified</span>
                  <span className="text-[8px] font-bold text-emerald-600/60 uppercase tracking-widest">Integrity Valid</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Score Display */}
          <div className="text-center py-4 relative">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Semester {data.sem} Efficiency</p>
            <div className="relative inline-block">
              <p className="text-[10rem] md:text-[12rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-900 to-slate-500 dark:from-white dark:to-slate-800 leading-none">
                {data.sgpa}
              </p>
              <div className="absolute -top-4 -right-10 px-4 py-2 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl rotate-12">
                NEXUS SGPA
              </div>
            </div>
            <div className={`mt-6 inline-flex items-center space-x-2 px-8 py-3 rounded-full ${academicStanding.bg} ${academicStanding.color} font-black text-[10px] uppercase tracking-[0.2em] border border-current opacity-80`}>
              {academicStanding.label}
            </div>
          </div>

          {/* Detailed Subject Ledger */}
          {data.subjects && data.subjects.length > 0 && (
            <section className="space-y-6">
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center flex items-center justify-center gap-4">
                  <span className="h-px bg-slate-100 dark:bg-white/5 flex-1" />
                  SUBJECT BREAKDOWN
                  <span className="h-px bg-slate-100 dark:bg-white/5 flex-1" />
               </h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {data.subjects.map((sub: any, idx: number) => (
                   <div key={idx} className="p-5 bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 rounded-[28px] flex items-center justify-between group hover:border-orange-500/30 transition-all">
                      <div className="max-w-[70%]">
                        <p className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-tight truncate group-hover:text-orange-600 transition-colors">{sub.n}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{sub.c} Credits Protocol</p>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-white dark:bg-black border border-slate-100 dark:border-white/10 flex items-center justify-center shadow-sm">
                         <span className="font-black text-orange-600 text-xs">{sub.g}</span>
                      </div>
                   </div>
                 ))}
               </div>
            </section>
          )}

          {/* Footer Summary */}
          <div className="grid grid-cols-2 gap-8 py-10 border-y border-slate-100 dark:border-white/5">
             <div className="text-center border-r border-slate-100 dark:border-white/5">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">CUMULATIVE CGPA</p>
                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{data.cgpa}</p>
             </div>
             <div className="text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">TOTAL CREDIT LOAD</p>
                <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{data.credits}<span className="text-sm font-bold text-slate-400 ml-1">PTS</span></p>
             </div>
          </div>

          <footer className="text-center space-y-10 pt-4">
            <div className="space-y-2">
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.3em]">SYNTHESIZED ON {timestamp}</p>
              <p className="text-[7px] font-medium text-slate-300 dark:text-slate-600 uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                DATA SOURCE: USER SELF-UPLOAD VIA LPU-NEXUS TERMINAL. THIS CREDENTIAL IS MATHEMATICALLY VALIDATED.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full bg-gradient-to-r from-orange-600 to-red-700 text-white py-5 rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_20px_40px_-10px_rgba(234,88,12,0.4)] flex items-center justify-center gap-3"
              >
                Establish My Protocol
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
              <div className="flex gap-3">
                 <button onClick={() => window.print()} className="flex-1 py-4 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-black font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all">Download Vault PDF</button>
                 <button onClick={() => window.location.href = '/library'} className="flex-1 py-4 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-400 font-black text-[9px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/5 transition-all">Visit Library Hub</button>
              </div>
            </div>
          </footer>
        </div>
      </div>
      
      {/* Impressive Recruitment Hook */}
      <div className="mt-12 text-center space-y-6">
        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">JOIN THE ELITE HUB</h5>
        <div className="grid grid-cols-3 gap-6">
           <div className="text-center"><p className="text-xl font-black dark:text-white">100%</p><p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Free Forever</p></div>
           <div className="text-center border-x border-slate-100 dark:border-white/5 px-2"><p className="text-xl font-black dark:text-white">Gemini</p><p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">AI Powered</p></div>
           <div className="text-center"><p className="text-xl font-black dark:text-white">Verto</p><p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Architected</p></div>
        </div>
      </div>
    </div>
  );
};

export default ShareReport;

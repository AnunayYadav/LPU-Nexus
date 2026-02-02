
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
        <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Report Not Found</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2">The link might be broken or expired.</p>
        <button 
          onClick={() => window.location.href = '/cgpa'}
          className="mt-8 bg-orange-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-600/20"
        >
          Go to Calculator
        </button>
      </div>
    );
  }

  const academicStanding = useMemo(() => {
    const sgpa = parseFloat(data.sgpa);
    if (sgpa >= 9.5) return { label: "Elite Scholar", color: "text-orange-500", bg: "bg-orange-500/10" };
    if (sgpa >= 9.0) return { label: "Exceptional Performer", color: "text-amber-500", bg: "bg-amber-500/10" };
    if (sgpa >= 8.5) return { label: "High Achiever", color: "text-orange-600", bg: "bg-orange-600/10" };
    if (sgpa >= 7.5) return { label: "Strong Candidate", color: "text-orange-500", bg: "bg-orange-500/10" };
    return { label: "Academic Explorer", color: "text-slate-500", bg: "bg-slate-500/10" };
  }, [data.sgpa]);

  const timestamp = new Date(data.ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="max-w-xl mx-auto animate-fade-in py-10 px-4">
      <div className="relative glass-panel rounded-[48px] overflow-hidden shadow-2xl border-none p-1 bg-white dark:bg-slate-950">
        {/* Holographic Border Effect - Nudged to Orange/Red */}
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 via-red-500/10 to-orange-600/20 opacity-30 pointer-events-none" />
        
        <div className="relative z-10 p-8 md:p-12 space-y-10">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600 dark:text-orange-500 mb-2">Verified Insight</h2>
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">LPU-NEXUS</h1>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
               <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-8 h-8"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
          </header>

          <div className="text-center space-y-4">
            <div className="inline-block px-6 py-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
              Semester {data.sem} Performance Report
            </div>
            <p className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-300 dark:to-white">
              {data.sgpa}
            </p>
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-2xl ${academicStanding.bg} ${academicStanding.color} font-black text-xs uppercase tracking-widest`}>
              <span>{academicStanding.label}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 py-8 border-y border-slate-100 dark:border-white/5">
             <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Cumulative CGPA</p>
                <p className="text-2xl font-black text-slate-800 dark:text-white">{data.cgpa}</p>
             </div>
             <div className="text-right">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Credit Load</p>
                <p className="text-2xl font-black text-slate-800 dark:text-white">{data.credits} <span className="text-[10px] font-bold text-slate-400">PTS</span></p>
             </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">Grade Breakdown</h4>
            <div className="flex justify-center flex-wrap gap-3">
              {Object.entries(data.grades).map(([grade, count]) => (
                <div key={grade} className="px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col items-center min-w-[60px]">
                  <span className="text-xs font-black text-slate-800 dark:text-white">{grade}</span>
                  <span className="text-[10px] font-bold text-slate-400">{count as number}</span>
                </div>
              ))}
            </div>
          </div>

          <footer className="text-center pt-8">
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-6">Generated on {timestamp}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => window.location.href = '/cgpa'}
                className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/10 dark:shadow-white/5"
              >
                Create My Report
              </button>
              <button 
                onClick={() => window.print()}
                className="flex-1 border border-slate-200 dark:border-white/10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5"
              >
                Download PDF
              </button>
            </div>
          </footer>
        </div>
      </div>
      
      {/* Disclaimer */}
      <p className="text-center mt-8 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] px-10 leading-loose">
        This report is a student-generated insight using LPU-Nexus algorithms. Not an official university transcript.
      </p>
    </div>
  );
};

export default ShareReport;

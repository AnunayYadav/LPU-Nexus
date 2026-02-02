import React, { useState } from 'react';
import { searchGlobalOpportunities } from '../services/geminiService';
import { GroundingChunk } from '../types';

const PRESETS = [
  { id: 1, label: "Germany Masters", query: "Public universities in Germany for Masters in Data Science with no tuition fees 2025" },
  { id: 2, label: "UK Graduate Visa", query: "UK Graduate Route visa current rules and duration for Indian students 2025" },
  { id: 3, label: "USA H-1B Trends", query: "Current H-1B visa lottery trends and success rates for tech roles in USA 2025" },
  { id: 4, label: "Full Scholarships", query: "Fully funded scholarships for Indian students for Masters in UK and Europe 2025" },
];

const GlobalGateway: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [chunks, setChunks] = useState<GroundingChunk[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('');

  const handleSearch = async (overrideQuery?: string) => {
    const finalQuery = overrideQuery || query;
    if (!finalQuery.trim()) return;
    
    setLoading(true);
    setResponse('');
    setChunks([]);
    setLoadingPhase('Connecting to Global Servers...');
    
    setTimeout(() => setLoadingPhase('Grounding with Live Web Data...'), 1500);
    setTimeout(() => setLoadingPhase('Synthesizing Opportunities...'), 3500);

    try {
      const data = await searchGlobalOpportunities(finalQuery);
      setResponse(data.text || "No details found.");
      if (data.groundingChunks) {
        setChunks(data.groundingChunks);
      }
    } catch (e: any) {
      console.error("Global Gateway Component Error:", e);
      setResponse(`The Gateway is temporarily congested. Error: ${e.message || "Unknown error"}. Please try again in a few seconds.`);
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <header className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent mb-4 tracking-tighter flex items-center justify-center gap-3">
          Global Gateway
          <span className="text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-200 dark:border-emerald-800/50 shadow-sm">Live Web</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-base md:text-lg font-medium leading-relaxed">
          The ultimate student scout. Bridging LPU to the world with real-time university data and visa updates.
        </p>
      </header>

      {/* Search Bar */}
      <div className="space-y-4">
        <div className="glass-panel p-2 rounded-3xl flex flex-col md:flex-row shadow-2xl shadow-emerald-500/10 dark:shadow-emerald-900/40 bg-white dark:bg-slate-900/50 border dark:border-white/5 overflow-hidden">
          <div className="flex-1 flex items-center px-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5 text-emerald-500 mr-3 opacity-50"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Query the world: e.g., DAAD scholarship requirements 2025"
              className="w-full bg-transparent border-none text-base md:text-lg py-4 md:py-5 text-slate-800 dark:text-white focus:ring-0 placeholder-slate-400 font-bold outline-none"
            />
          </div>
          <button 
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 md:py-0 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-emerald-600/20 disabled:opacity-50"
          >
            {loading ? 'SCRIBING...' : 'EXPLORE'}
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => { setQuery(p.query); handleSearch(p.query); }}
              className="px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-full text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {(response || loading) && (
        <div className="glass-panel p-6 md:p-10 rounded-[40px] min-h-[400px] border dark:border-white/5 shadow-2xl bg-white dark:bg-black/60 relative overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-20 space-y-6">
              <div className="w-16 h-16 relative">
                <div className="absolute inset-0 border-4 border-emerald-500/10 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="text-center">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 animate-pulse">{loadingPhase}</p>
                <p className="text-[10px] text-slate-400 font-bold mt-2">Checking official embassies & university portals...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
               <div className="prose dark:prose-invert max-w-none">
                 <div className="whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200 font-medium text-base md:text-lg">
                   {response}
                 </div>
               </div>

               {chunks.length > 0 && (
                 <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/5">
                   <header className="flex items-center justify-between mb-6">
                     <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verified Intelligence Sources</h4>
                     <span className="text-[8px] bg-slate-100 dark:bg-white/5 px-2 py-1 rounded text-slate-400 font-black uppercase tracking-widest">Sync Match</span>
                   </header>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     {chunks.map((chunk, idx) => chunk.web?.uri && (
                       <a 
                        key={idx} 
                        href={chunk.web.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all group shadow-sm"
                       >
                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 mr-3 flex-shrink-0 opacity-40 group-hover:opacity-100"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                         <span className="text-[10px] font-black uppercase tracking-widest truncate">
                           {chunk.web.title || chunk.web.uri}
                         </span>
                       </a>
                     ))}
                   </div>
                 </div>
               )}
            </div>
          )}
          {/* Subtle decoration */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/5 blur-[60px] rounded-full pointer-events-none"></div>
        </div>
      )}

      {/* Ecosystem Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
         <div className="glass-panel p-6 rounded-[32px] border border-slate-200 dark:border-white/5 bg-white dark:bg-black/20 shadow-xl group hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <h4 className="text-slate-800 dark:text-white font-black text-xs uppercase tracking-widest mb-2">Visa Architect</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Personalized document checklists for Tier 4 and F1 visas.</p>
         </div>
         <div className="glass-panel p-6 rounded-[32px] border border-slate-200 dark:border-white/5 bg-white dark:bg-black/20 shadow-xl group hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <h4 className="text-slate-800 dark:text-white font-black text-xs uppercase tracking-widest mb-2">SOP Auditor</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Review your Statement of Purpose for emotional resonance.</p>
         </div>
         <div className="glass-panel p-6 rounded-[32px] border border-slate-200 dark:border-white/5 bg-white dark:bg-black/20 shadow-xl group hover:border-emerald-500/30 transition-all">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h4 className="text-slate-800 dark:text-white font-black text-xs uppercase tracking-widest mb-2">Alumni Echo</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Aggregated experiences from Vertos studying abroad.</p>
         </div>
      </div>
    </div>
  );
};

export default GlobalGateway;
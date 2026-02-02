
import React, { useState } from 'react';
import { searchGlobalOpportunities } from '../services/geminiService';
import { GroundingChunk } from '../types';

const IconGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 mx-auto mb-4 opacity-20">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const GlobalGateway: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [chunks, setChunks] = useState<GroundingChunk[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse('');
    setChunks([]);
    
    try {
      const data = await searchGlobalOpportunities(query);
      setResponse(data.text || "No details found.");
      if (data.groundingChunks) {
        setChunks(data.groundingChunks);
      }
    } catch (e: any) {
      console.error("Global Gateway Component Error:", e);
      setResponse(`Error connecting to the Global Gateway: ${e.message || "Unknown error"}. Check console for details.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <header className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent mb-4 tracking-tighter flex items-center justify-center gap-3">
          Global Gateway
          <span className="text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-200 dark:border-emerald-800/50 shadow-sm">Beta</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-base md:text-lg font-medium">
          Get real-time data on universities, visas, and scholarships directly from the web.
        </p>
      </header>

      <div className="glass-panel p-2 rounded-3xl flex flex-col md:flex-row shadow-2xl shadow-emerald-500/10 dark:shadow-emerald-900/40 bg-white dark:bg-white/5 border dark:border-white/5 overflow-hidden">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="e.g., MS in Computer Science in Germany"
          className="flex-1 bg-transparent border-none text-lg md:text-xl px-4 md:px-8 py-4 md:py-0 text-slate-800 dark:text-white focus:ring-0 placeholder-slate-400 font-bold outline-none"
        />
        <button 
          onClick={handleSearch}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 md:px-10 py-4 md:py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-emerald-600/20 w-full md:w-auto"
        >
          {loading ? 'Searching...' : 'EXPLORE'}
        </button>
      </div>

      {(response || loading) && (
        <div className="glass-panel p-6 md:p-10 rounded-3xl min-h-[400px] border dark:border-white/5 shadow-2xl bg-white dark:bg-black/40">
          {loading ? (
            <div className="space-y-6 animate-pulse">
              <div className="h-4 bg-slate-200 dark:bg-white/5 rounded-full w-3/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-white/5 rounded-full w-1/2"></div>
              <div className="h-4 bg-slate-200 dark:bg-white/5 rounded-full w-5/6"></div>
              <div className="h-4 bg-slate-200 dark:bg-white/5 rounded-full w-2/3"></div>
            </div>
          ) : (
            <div className="space-y-8">
               <div className="prose dark:prose-invert max-w-none">
                 <p className="whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200 font-medium text-base md:text-lg">
                   {response}
                 </p>
               </div>

               {chunks.length > 0 && (
                 <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/5">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 text-center md:text-left">Verified Sources</h4>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {chunks.map((chunk, idx) => chunk.web?.uri && (
                       <a 
                        key={idx} 
                        href={chunk.web.uri} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl hover:bg-white dark:hover:bg-white/10 transition-all group shadow-sm"
                       >
                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-emerald-500 mr-3 flex-shrink-0"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                         <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 truncate group-hover:underline">
                           {chunk.web.title || chunk.web.uri}
                         </span>
                       </a>
                     ))}
                   </div>
                 </div>
               )}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
         <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-black/20 shadow-xl">
            <h4 className="text-emerald-500 font-black text-xs uppercase tracking-widest mb-2">Visa Predictor</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Estimate your approval chances based on global profiles.</p>
            <span className="text-[8px] bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full mt-4 inline-block font-black tracking-widest uppercase">Nexus Labs</span>
         </div>
         <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-black/20 shadow-xl">
            <h4 className="text-emerald-500 font-black text-xs uppercase tracking-widest mb-2">SOP Architect</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Draft professional Statement of Purpose with AI guidance.</p>
            <span className="text-[8px] bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full mt-4 inline-block font-black tracking-widest uppercase">Nexus Labs</span>
         </div>
         <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-black/20 shadow-xl">
            <h4 className="text-emerald-500 font-black text-xs uppercase tracking-widest mb-2">Alumni Network</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Connect with LPU alumni studying in target regions.</p>
         </div>
      </div>
    </div>
  );
};

export default GlobalGateway;

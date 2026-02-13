
import React, { useState } from 'react';
import { searchGlobalOpportunities } from '../services/geminiService';
import { GroundingChunk } from '../types';

const PRESETS = [
  { id: 1, label: "Germany Masters", query: "Public universities in Germany for Masters in Data Science with no tuition fees 2025" },
  { id: 2, label: "UK Graduate Visa", query: "UK Graduate Route visa current rules and duration for Indian students 2025" },
  { id: 3, label: "USA H-1B Trends", query: "Current H-1B visa lottery trends and success rates for tech roles in USA 2025" },
  { id: 4, label: "Full Scholarships", query: "Fully funded scholarships for Indian students for Masters in UK and Europe 2025" },
];

const ResultSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="space-y-4">
      <div className="h-4 w-full bg-slate-200 dark:bg-white/5 rounded shimmer" />
      <div className="h-4 w-5/6 bg-slate-200 dark:bg-white/5 rounded shimmer" />
      <div className="h-4 w-4/5 bg-slate-200 dark:bg-white/5 rounded shimmer" />
      <div className="h-4 w-full bg-slate-200 dark:bg-white/5 rounded shimmer" />
    </div>
    <div className="pt-8 border-t border-slate-100 dark:border-white/5">
      <div className="h-3 w-32 bg-slate-200 dark:bg-white/5 rounded mb-6 shimmer" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="h-14 bg-slate-200 dark:bg-white/5 rounded-2xl shimmer" />
        <div className="h-14 bg-slate-200 dark:bg-white/5 rounded-2xl shimmer" />
      </div>
    </div>
  </div>
);

const GlobalGateway: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [chunks, setChunks] = useState<GroundingChunk[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (overrideQuery?: string) => {
    const finalQuery = overrideQuery || query;
    if (!finalQuery.trim()) return;

    setLoading(true);
    setError(null);
    setResponse('');
    setChunks([]);
    setLoadingPhase('Searching globally...');

    setTimeout(() => setLoadingPhase('Getting latest info...'), 1500);
    setTimeout(() => setLoadingPhase('Finding opportunities...'), 3500);

    try {
      const data = await searchGlobalOpportunities(finalQuery);
      setResponse(data.text || "No details found.");
      if (data.groundingChunks) {
        setChunks(data.groundingChunks);
      }
    } catch (e: any) {
      console.error("Global Gateway Component Error:", e);
      setError(e.message || "The system is temporarily busy. Please try again in a few moments.");
    } finally {
      setLoading(false);
      setLoadingPhase('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <header className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white mb-2 tracking-tighter">
          Global Gateway
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-base md:text-lg font-medium leading-relaxed">
          The ultimate student scout. Bridging LPU to the world with real-time university data and visa updates.
        </p>
      </header>

      {/* Search Bar */}
      <div className="space-y-4">
        <div className="glass-panel p-2 rounded-3xl flex flex-col md:flex-row shadow-2xl shadow-emerald-500/10 dark:shadow-emerald-900/40 bg-white dark:bg-black border dark:border-white/5 overflow-hidden">
          <div className="flex-1 flex items-center px-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5 text-emerald-500 mr-3 opacity-50"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
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
            {loading ? 'SEARCHING...' : 'EXPLORE'}
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

      {error && (
        <div className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-[40px] text-center space-y-4 animate-fade-in max-w-2xl mx-auto shadow-xl shadow-amber-500/5">
          <div className="w-14 h-14 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto text-amber-500">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-7 h-7"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase text-amber-600 tracking-[0.2em]">Search Error</h4>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">"{error}"</p>
          </div>
          <button onClick={() => handleSearch()} className="px-8 py-2.5 bg-amber-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg active:scale-95 transition-all border-none">Try Search Again</button>
        </div>
      )}

      {(response || loading) && !error && (
        <div className="glass-panel p-6 md:p-10 rounded-[40px] min-h-[400px] border dark:border-white/5 shadow-2xl bg-white dark:bg-black/60 relative overflow-hidden">
          {loading ? (
            <div className="flex flex-col h-full space-y-8">
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <div className="w-12 h-12 relative">
                  <div className="absolute inset-0 border-2 border-emerald-500/10 rounded-full"></div>
                  <div className="absolute inset-0 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500 animate-pulse">{loadingPhase}</p>
              </div>
              <ResultSkeleton />
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
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Official Sources</h4>
                    <span className="text-[8px] bg-slate-100 dark:bg-white/5 px-2 py-1 rounded text-slate-400 font-black uppercase tracking-widest">Direct Link</span>
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
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 mr-3 flex-shrink-0 opacity-40 group-hover:opacity-100"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
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
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/5 blur-[60px] rounded-full pointer-events-none"></div>
        </div>
      )}
    </div>
  );
};

export default GlobalGateway;

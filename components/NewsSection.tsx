
import React, { useState, useEffect } from 'react';
import { fetchCampusNews } from '../services/geminiService';
import { GroundingChunk } from '../types';

const NEWS_PRESETS = [
  { id: 1, label: "Placements", query: "Latest LPU placement news and companies visiting Phagwara March 2025" },
  { id: 2, label: "Fests & Events", query: "Upcoming LPU cultural fests, One India 2025, or Youth Vibe schedules" },
  { id: 3, label: "UMS Updates", query: "LPU official UMS notices and academic calendar announcements 2025" },
  { id: 4, label: "Sports Hub", query: "Recent LPU sports achievements and upcoming inter-university trials" },
];

const NewsSection: React.FC = () => {
  const [query, setQuery] = useState('');
  const [newsText, setNewsText] = useState('');
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleSearch = async (overrideQuery?: string) => {
    const finalQuery = overrideQuery || query || "Latest general LPU announcements and campus news";
    setLoading(true);
    setNewsText('');
    setSources([]);
    setStatus('Scouting Campus Pulse...');

    try {
      const data = await fetchCampusNews(finalQuery);
      setNewsText(data.text || "No recent updates detected for this query.");
      setSources(data.groundingChunks || []);
    } catch (e: any) {
      setNewsText(`Failed to connect to Pulse servers. Error: ${e.message}`);
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  useEffect(() => {
    // Load initial general news
    handleSearch("Latest LPU Phagwara campus news and official announcements 2025");
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20 px-4 md:px-0">
      <header className="mb-10 text-center md:text-left">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter uppercase">
          LPU <span className="text-orange-600">Pulse</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg font-medium leading-relaxed">
          The official news scout for Vertos. AI-aggregated announcements, events, and trending updates.
        </p>
      </header>

      {/* Search Bar */}
      <div className="space-y-4">
        <div className="glass-panel p-2 rounded-3xl flex flex-col md:flex-row shadow-2xl border dark:border-white/5 bg-white dark:bg-slate-950/50 overflow-hidden">
          <div className="flex-1 flex items-center px-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5 text-orange-500 mr-3 opacity-50">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Scout for: e.g. One India 2025 dates"
              className="w-full bg-transparent border-none py-4 text-slate-800 dark:text-white focus:ring-0 placeholder-slate-400 font-bold outline-none text-sm md:text-base"
            />
          </div>
          <button 
            onClick={() => handleSearch()}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-orange-600/20 disabled:opacity-50"
          >
            {loading ? 'SCOUTING...' : 'UPDATE PULSE'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {NEWS_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => { setQuery(p.label); handleSearch(p.query); }}
              className="px-4 py-2 bg-orange-500/5 border border-orange-500/10 rounded-full text-[9px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400 hover:bg-orange-500 hover:text-white transition-all"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Hub */}
      <div className="glass-panel p-6 md:p-10 rounded-[40px] border dark:border-white/5 bg-white dark:bg-black/40 min-h-[400px] relative overflow-hidden shadow-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full py-20 space-y-6">
            <div className="w-14 h-14 relative">
              <div className="absolute inset-0 border-4 border-orange-600/10 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600 animate-pulse">{status}</p>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {newsText ? (
              <div className="prose dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-slate-800 dark:text-slate-200 text-sm md:text-base leading-relaxed font-medium">
                  {newsText}
                </div>
              </div>
            ) : (
              <div className="py-20 text-center opacity-30">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16 mx-auto mb-4">
                  <path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/>
                </svg>
                <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Pulse Signal...</p>
              </div>
            )}

            {sources.length > 0 && (
              <div className="pt-8 border-t border-slate-100 dark:border-white/5">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Verification Sources</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sources.map((chunk, idx) => chunk.web?.uri && (
                    <a 
                      key={idx} 
                      href={chunk.web.uri} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center p-4 bg-orange-600/5 border border-orange-500/10 rounded-2xl hover:bg-orange-600 hover:text-white transition-all group"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 mr-3 flex-shrink-0 opacity-40 group-hover:opacity-100">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                      </svg>
                      <span className="text-[9px] font-black uppercase tracking-widest truncate">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl border dark:border-white/5 bg-slate-50 dark:bg-slate-900/40">
          <h4 className="text-xs font-black text-orange-600 uppercase tracking-widest mb-2">Fest Watch</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Automatic tracking for One India, One World, and Youth Vibe 2025.</p>
        </div>
        <div className="glass-panel p-6 rounded-3xl border dark:border-white/5 bg-slate-50 dark:bg-slate-900/40">
          <h4 className="text-xs font-black text-orange-600 uppercase tracking-widest mb-2">Official Sync</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Grounding with official LPU social channels and university websites.</p>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;

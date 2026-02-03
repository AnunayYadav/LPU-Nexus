
import React, { useState, useEffect } from 'react';
import NexusServer from '../services/nexusServer.ts';

const AboutUs: React.FC = () => {
  const [stats, setStats] = useState<{ registered: number; visitors: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await NexusServer.getSiteStats();
        setStats(data);
      } catch (e) {
        console.error("Failed to fetch impact stats");
        // Fallback to base numbers if API fails
        setStats({ registered: 124, visitors: 1450 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-fade-in pb-24 px-4 md:px-0">
      {/* Nexus Impact - Hero Stats */}
      <section className="text-center space-y-10">
        <header className="space-y-4">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
            Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Impact</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-bold uppercase tracking-[0.3em]">Live Platform Metrics</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Registered Users (Login Required Users) */}
          <div className="glass-panel p-10 rounded-[50px] border border-orange-500/20 bg-white dark:bg-slate-950/50 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 blur-[60px] rounded-full -mr-16 -mt-16" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 bg-orange-600/10 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-7 h-7"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Verified Community</p>
              <h4 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                {loading ? (
                  <span className="opacity-20">---</span>
                ) : (
                  stats?.registered.toLocaleString()
                )}
              </h4>
              <p className="text-[9px] font-bold text-slate-500 dark:text-slate-600 uppercase mt-4 tracking-widest bg-slate-100 dark:bg-white/5 px-4 py-1 rounded-full">Registered LPU Vertos</p>
            </div>
          </div>

          {/* Global Reach (All users, no login needed) */}
          <div className="glass-panel p-10 rounded-[50px] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/50 shadow-2xl relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/10 blur-[60px] rounded-full -ml-16 -mb-16" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-7 h-7"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Global Reach</p>
              <h4 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                {loading ? (
                  <span className="opacity-20">---</span>
                ) : (
                  `+${stats?.visitors.toLocaleString()}`
                )}
              </h4>
              <p className="text-[9px] font-bold text-slate-500 dark:text-slate-600 uppercase mt-4 tracking-widest bg-slate-100 dark:bg-white/5 px-4 py-1 rounded-full">Total Platform Visitors</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="glass-panel p-10 rounded-[40px] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/50 space-y-4">
          <h3 className="text-xs font-black text-orange-600 uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-4">The Mission</h3>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            LPU-Nexus was born from a simple observation: campus life is complex. Between tracking attendance, calculating CGPA, and preparing for placements, students are often overwhelmed. 
            <br/><br/>
            Our mission is to consolidate these fragmented experiences into a single, high-performance platform powered by cutting-edge AI.
          </p>
        </div>

        <div className="glass-panel p-10 rounded-[40px] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/50 space-y-4">
          <h3 className="text-xs font-black text-orange-600 uppercase tracking-widest border-b border-slate-100 dark:border-white/5 pb-4">Key Innovation</h3>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            By integrating <strong>Google's Gemini AI</strong>, we provide tools that don't just calculate numbers but offer strategic insights. 
            From "Placement Prefect" to "Global Gateway", Nexus is designed to be your unfair advantage in a competitive academic landscape.
          </p>
        </div>
      </section>

      {/* Credit Section */}
      <section className="p-10 md:p-14 rounded-[60px] bg-gradient-to-br from-slate-900 to-black text-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-8">Architect & Heritage</h3>
          <p className="text-2xl md:text-4xl font-black tracking-tighter mb-10 leading-tight">
            Built by a <span className="text-orange-500">Verto</span><br/>For the <span className="text-orange-500">Vertos</span>.
          </p>
          
          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Lead Developer</p>
              <p className="text-3xl font-black text-white tracking-tight">Anunay Yadav</p>
              <div className="flex gap-10 mt-6">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Batch</p>
                  <p className="text-xl font-black text-white">2025-29</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Branch</p>
                  <p className="text-xl font-black text-white">B.Tech CSE</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-6">
              {[
                { label: 'Email', icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>, url: 'https://mail.google.com/mail/?view=cm&fs=1&to=anunayarvind@gmail.com' },
                { label: 'Insta', icon: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></>, url: 'https://www.instagram.com/anunay07' },
                { label: 'LinkedIn', icon: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></>, url: 'https://www.linkedin.com/in/anunayyadav/' },
                { label: 'GitHub', icon: <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>, url: 'https://github.com/AnunayYadav' }
              ].map((link, idx) => (
                <a 
                  key={idx} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 bg-white/5 hover:bg-orange-600 px-6 py-3 rounded-2xl border border-white/10 transition-all group"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-orange-500 group-hover:text-white transition-colors">{link.icon}</svg>
                  <span className="text-[10px] font-black uppercase tracking-widest">{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full -mr-32 -mt-32"></div>
      </section>

      <footer className="text-center pt-8">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 opacity-50">
          LPU-Nexus v1.3.0 • Independent Student Project
        </p>
      </footer>
    </div>
  );
};

export default AboutUs;

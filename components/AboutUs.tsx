import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20">
      <header className="text-center md:text-left">
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">LPU-Nexus</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
          The all-in-one intelligence hub designed to streamline the academic and professional journey of students at Lovely Professional University.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-[40px] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/50">
          <h3 className="text-xs font-black text-orange-600 uppercase tracking-widest mb-4">The Mission</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-loose">
            LPU-Nexus was born from a simple observation: campus life is complex. Between tracking attendance, calculating CGPA, preparing for placements, and finding reliable study materials, students are often overwhelmed. 
            <br/><br/>
            Our mission is to consolidate these fragmented experiences into a single, high-performance platform powered by cutting-edge AI.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-[40px] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/50">
          <h3 className="text-xs font-black text-orange-600 uppercase tracking-widest mb-4">Key Innovation</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-loose">
            By integrating <strong>Google's Gemini AI</strong>, we provide tools that don't just calculate numbers but offer strategic insights. 
            From "Placement Prefect" which ruthlessly analyzes resumes against JDs, to "Global Gateway" which crawls the live web for opportunities, Nexus is your unfair advantage.
          </p>
        </div>
      </section>

      <section className="p-8 md:p-12 rounded-[50px] bg-gradient-to-br from-slate-900 to-black text-white shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-6">Credits & Heritage</h3>
          <p className="text-xl md:text-2xl font-bold tracking-tight mb-8">
            "This app is built by an <span className="text-orange-500">LPU Verto</span> for the <span className="text-orange-500">Vertos of LPU</span>."
          </p>
          
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Architect</p>
              <p className="text-2xl font-black">Anunay Yadav</p>
              <div className="flex gap-10 mt-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Batch</p>
                  <p className="text-lg font-black text-orange-100">2025-29</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Branch</p>
                  <p className="text-lg font-black text-orange-100">B.Tech CSE</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=anunayarvind@gmail.com" 
                target="_blank" 
                className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl border border-white/10 transition-all group"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-orange-500"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span className="text-xs font-black uppercase tracking-widest">Email</span>
              </a>
              <a 
                href="https://www.instagram.com/anunay07" 
                target="_blank" 
                className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl border border-white/10 transition-all group"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-orange-500"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                <span className="text-xs font-black uppercase tracking-widest">Instagram</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/anunayyadav/" 
                target="_blank" 
                className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl border border-white/10 transition-all group"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-orange-500"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                <span className="text-xs font-black uppercase tracking-widest">LinkedIn</span>
              </a>
              <a 
                href="https://github.com/AnunayYadav" 
                target="_blank" 
                className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl border border-white/10 transition-all group"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 text-orange-500"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                <span className="text-xs font-black uppercase tracking-widest">GitHub</span>
              </a>
            </div>
          </div>
        </div>
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
      </section>

      <footer className="text-center pt-8">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
          LPU-Nexus v1.3.0 • Independent Student Project
        </p>
      </footer>
    </div>
  );
};

export default AboutUs;
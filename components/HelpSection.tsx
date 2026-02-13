
import React from 'react';

const HelpSection: React.FC = () => {
  const faqs = [
    {
      category: 'Attendance & CGPA',
      questions: [
        { q: "How does the 'Safe to Skip' calculation work?", a: "It calculates the difference between your current attendance and your target percentage (e.g., 75%) to determine how many upcoming lectures you can miss without dropping below your goal. It's accurate to the nearest session." },
        { q: "Does the CGPA calculator support LPU's relative grading?", a: "The calculator uses the standard LPU 10-point scale. Since relative grading varies by batch performance, use this as a 'Target Minimum'. If you match these grades, you're guaranteed that CGPA regardless of the curve." }
      ]
    },
    {
      category: 'Placement Prefect (Flash)',
      questions: [
        { q: "What are 'Industry Trends' in the Prefect?", a: "Instead of pasting a JD, you can select 'Trends' to evaluate your resume against 2025 technology standards for specific roles like AI Engineer or Frontend Dev. It checks for the latest high-demand keywords." },
        { q: "What does 'Deep Scrutiny' do?", a: "It switches the AI model to a more 'ruthless' technical recruiter persona. It won't just look for words; it will judge your project complexity and phrasing impact. Be prepared for harsh feedback." }
      ]
    },
    {
      category: 'Campus Navigator',
      questions: [
        { q: "Why can't I see the 'Powered by' text on the map?", a: "We've optimized the map viewport for a cleaner, immersive 3D experience. The map is updated periodically to reflect new blocks and auditorium locations." },
        { q: "How do I report a wrong mess menu?", a: "Use the 'Report Issue' button at the bottom. You can even upload a photo of the physical menu board to help us verify and update the database for everyone." }
      ]
    },
    {
      category: 'Privacy & Data',
      questions: [
        { q: "Is my resume stored on your servers?", a: "Resumes are processed in volatile memory for analysis and are not stored permanently. Files uploaded to the 'Content Library' are stored securely in our Nexus Vault for the community." },
        { q: "Who manages the content library?", a: "Verified 'Admin Vertos' review every contribution to ensure notes are relevant and accurate. Your 'Personal Vault' allows you to track your own contributions." }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 tracking-tighter uppercase">
          Knowledge Base
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed">Master the LPU-Nexus ecosystem with verified intel.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((cat, idx) => (
          <div key={idx} className="glass-panel p-8 rounded-[40px] border border-slate-200 dark:border-white/5 bg-white dark:bg-black flex flex-col h-full shadow-sm hover:shadow-xl transition-all">
            <h3 className="text-[10px] font-black text-orange-600 dark:text-orange-500 uppercase tracking-[0.3em] mb-6 border-b border-slate-100 dark:border-white/5 pb-4">{cat.category}</h3>
            <div className="space-y-8 flex-1">
              {cat.questions.map((item, qIdx) => (
                <div key={qIdx} className="space-y-3">
                  <h4 className="font-black text-slate-800 dark:text-white leading-tight flex items-start text-sm md:text-base">
                    <span className="text-orange-500 mr-2 flex-shrink-0">Q.</span>
                    {item.q}
                  </h4>
                  <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium pl-6 border-l-2 border-slate-100 dark:border-white/10">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-10 bg-slate-900 dark:bg-black border border-slate-800 dark:border-white/5 rounded-[40px] text-center shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none transition-transform duration-1000 group-hover:scale-110">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
          </svg>
        </div>
        <h3 className="text-white text-2xl font-black mb-4 relative z-10 uppercase tracking-tight">Still have questions?</h3>
        <p className="text-slate-400 mb-8 max-w-md mx-auto relative z-10 text-sm font-medium">Our student support team is ready to help you navigate through your campus journey.</p>
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=anunayarvind@gmail.com&su=LPU-Nexus%20Support%20Request"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-3 bg-white text-black px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white hover:scale-105 active:scale-95 transition-all shadow-xl relative z-10"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
          <span>Get Direct Help</span>
        </a>
      </div>
    </div>
  );
};

export default HelpSection;


import React from 'react';

const HelpSection: React.FC = () => {
  const faqs = [
    {
      category: 'Attendance & CGPA',
      questions: [
        { q: "How does the 'Safe to Skip' calculation work?", a: "It calculates the difference between your current attendance and your target percentage (e.g., 75%) to determine how many upcoming lectures you can miss without dropping below your goal." },
        { q: "Does the CGPA calculator support LPU's relative grading?", a: "The calculator uses the standard LPU 10-point scale (O, A+, A, etc.). While relative grading depends on the class average, this tool helps you estimate your minimum expected grade based on your marks." }
      ]
    },
    {
      category: 'Placement Prefect (Beta)',
      questions: [
        { q: "What is 'Deep Analysis' mode?", a: "Deep Analysis uses more intensive AI reasoning to provide a ruthless, point-by-point critique of your resume's phrasing and project descriptions, whereas Standard mode focuses on ATS keyword matching." },
        { q: "Will this guarantee an interview?", a: "While we can't guarantee interviews, optimizing your resume for a high match score ensures you aren't filtered out by automated ATS systems used by top recruiters." }
      ]
    },
    {
      category: 'Global Gateway (Beta)',
      questions: [
        { q: "How accurate is the scholarship and visa data?", a: "The Global Gateway uses real-time Google Search Grounding to fetch the latest official data. We always provide the verified source links so you can double-check the details." },
        { q: "Can I search for any country?", a: "Yes! You can query for specific programs, scholarships, or visa requirements across any global region." }
      ]
    },
    {
      category: 'Campus Navigator',
      questions: [
        { q: "How do I toggle between Mess Week 1 and Week 2?", a: "The Mess Menu section has a toggle at the top. The university usually follows a bi-weekly cycle; you can check with your hostel warden for the current cycle week." },
        { q: "Is the 3D Map real-time?", a: "The map is a highly detailed interactive 3D model of the LPU campus powered by iViewd, helping you locate blocks, gates, and auditoriums easily." }
      ]
    },
    {
      category: 'Privacy & Data',
      questions: [
        { q: "Where is my attendance data stored?", a: "Your attendance records and CGPA inputs are stored locally in your browser's storage. They are never uploaded to our servers, keeping your personal academic data completely private." },
        { q: "Do I need a Nexus Pro subscription?", a: "LPU-Nexus is currently free for all students. Advanced features like 'Deep Analysis' and 'Nexus Vault' (Content Library) are part of the Pro Labs development." }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
       <header className="mb-10">
        <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white mb-3 tracking-tighter">Knowledge Base</h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">Everything you need to know about LPU-Nexus.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((cat, idx) => (
          <div key={idx} className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/50 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xs font-black text-orange-600 dark:text-orange-500 uppercase tracking-[0.2em] mb-6 border-b border-slate-100 dark:border-white/5 pb-4">{cat.category}</h3>
            <div className="space-y-8 flex-1">
              {cat.questions.map((item, qIdx) => (
                <div key={qIdx} className="space-y-2">
                  <h4 className="font-bold text-slate-800 dark:text-white leading-tight flex items-start">
                    <span className="text-orange-500 mr-2">Q.</span>
                    {item.q}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium pl-6 border-l-2 border-slate-100 dark:border-white/10">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 p-10 bg-gradient-to-br from-slate-900 to-black rounded-[40px] text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
            </svg>
        </div>
        <h3 className="text-white text-2xl font-black mb-4 relative z-10">Still have questions?</h3>
        <p className="text-slate-400 mb-8 max-w-md mx-auto relative z-10">Our student support team is ready to help you navigate through your campus journey.</p>
        <a 
          href="https://mail.google.com/mail/?view=cm&fs=1&to=anunayarvind@gmail.com&su=LPU-Nexus%20Support%20Request" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-3 bg-white text-black px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl relative z-10"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span>Get Direct Help</span>
        </a>
      </div>
    </div>
  );
};

export default HelpSection;

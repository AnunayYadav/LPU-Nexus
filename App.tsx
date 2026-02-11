
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar.tsx';
import PlacementPrefect from './components/PlacementPrefect.tsx';
import ContentLibrary from './components/ContentLibrary.tsx';
import CampusNavigator from './components/CampusNavigator.tsx';
import HelpSection from './components/HelpSection.tsx';
import FreshersKit from './components/FreshersKit.tsx';
import CGPACalculator from './components/CGPACalculator.tsx';
import AttendanceTracker from './components/AttendanceTracker.tsx';
import ShareReport from './components/ShareReport.tsx';
import AboutUs from './components/AboutUs.tsx';
import AuthModal from './components/AuthModal.tsx';
import ProfileSection from './components/ProfileSection.tsx';
import TimetableHub from './components/TimetableHub.tsx';
import QuizTaker from './components/QuizTaker.tsx';
import { ModuleType, UserProfile } from './types.ts';
import NexusServer from './services/nexusServer.ts';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const getModuleFromPath = (path: string): ModuleType => {
  const p = path.toLowerCase();
  if (p.includes('/share-cgpa')) return ModuleType.SHARE_CGPA;
  if (p.endsWith('/attendance')) return ModuleType.ATTENDANCE;
  if (p.endsWith('/timetable')) return ModuleType.TIMETABLE;
  if (p.endsWith('/quiz')) return ModuleType.QUIZ;
  if (p.endsWith('/cgpa')) return ModuleType.CGPA;
  if (p.endsWith('/placement')) return ModuleType.PLACEMENT;
  if (p.endsWith('/library')) return ModuleType.LIBRARY;
  if (p.endsWith('/campus')) return ModuleType.CAMPUS;
  if (p.endsWith('/freshers')) return ModuleType.FRESHERS;
  if (p.endsWith('/help')) return ModuleType.HELP;
  if (p.endsWith('/about')) return ModuleType.ABOUT;
  if (p.endsWith('/profile')) return ModuleType.PROFILE;
  return ModuleType.DASHBOARD;
};

const getPathFromModule = (module: ModuleType): string => {
  switch (module) {
    case ModuleType.ATTENDANCE: return '/attendance';
    case ModuleType.TIMETABLE: return '/timetable';
    case ModuleType.QUIZ: return '/quiz';
    case ModuleType.CGPA: return '/cgpa';
    case ModuleType.PLACEMENT: return '/placement';
    case ModuleType.LIBRARY: return '/library';
    case ModuleType.CAMPUS: return '/campus';
    case ModuleType.FRESHERS: return '/freshers';
    case ModuleType.HELP: return '/help';
    case ModuleType.ABOUT: return '/about';
    case ModuleType.PROFILE: return '/profile';
    case ModuleType.DASHBOARD: return '/';
    case ModuleType.SHARE_CGPA: return '/share-cgpa';
    default: return '/';
  }
};

const Dashboard: React.FC<{ setModule: (m: ModuleType) => void }> = ({ setModule }) => {
  const cards = [
    { 
      id: ModuleType.TIMETABLE, 
      title: "Timetable Hub", 
      desc: "Sync schedules with friends and find common gaps.", 
      color: "from-orange-500/10 to-red-500/10",
      accent: "text-orange-500",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    },
    { 
      id: ModuleType.QUIZ, 
      title: "Quiz Taker", 
      desc: "Targeted MCQs from subject syllabus using Gemini AI.", 
      color: "from-orange-500/10 to-red-500/10",
      accent: "text-orange-500",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
    },
    { 
      id: ModuleType.CGPA, 
      title: "CGPA Calculator", 
      desc: "Precision SGPA & CGPA forecasting based on LPU standards.", 
      color: "from-emerald-500/10 to-teal-500/10",
      accent: "text-emerald-500",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
    },
    { 
      id: ModuleType.PLACEMENT, 
      title: "Placement Prefect", 
      desc: "AI Resume optimization tailored for LPU campus drives.", 
      color: "from-blue-500/10 to-indigo-500/10",
      accent: "text-blue-500",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
    },
    { 
      id: ModuleType.LIBRARY, 
      title: "Content Library", 
      desc: "Centralized registry for notes, pyqs and study materials.", 
      color: "from-amber-500/10 to-orange-500/10",
      accent: "text-amber-500",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 8h10M8 12h10"/></svg>
    },
    { 
      id: ModuleType.CAMPUS, 
      title: "Campus Navigator", 
      desc: "Interactive 3D maps and latest mess menu cycles.", 
      color: "from-purple-500/10 to-pink-500/10",
      accent: "text-purple-500",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
    },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-20 px-4">
      <div className="mb-14 text-center py-10 space-y-4">
        <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
          Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Terminal</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-500 text-sm md:text-base font-black uppercase tracking-[0.4em]">System Operational • AI Core Loaded</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(card => (
          <div 
            key={card.id} 
            onClick={() => setModule(card.id)} 
            className="group relative p-10 rounded-[48px] bg-slate-50 dark:bg-dark-900/40 border border-slate-200/50 dark:border-white/[0.03] backdrop-blur-sm transition-all duration-500 cursor-pointer hover:bg-white dark:hover:bg-dark-800/60 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_40px_100px_-20px_rgba(234,88,12,0.15)] hover:border-orange-500/20 overflow-hidden flex flex-col items-center text-center"
          >
            {/* Background Decal */}
            <div className={`absolute -right-20 -bottom-20 w-64 h-64 bg-gradient-to-br ${card.color} blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
            
            {/* Ghost Icon */}
            <div className="absolute -right-6 -top-6 w-40 h-40 text-slate-200/20 dark:text-white/[0.02] transform rotate-12 group-hover:rotate-6 group-hover:scale-125 transition-all duration-1000 pointer-events-none">
              {card.icon}
            </div>

            <div className="relative z-10 space-y-6">
              <div className="w-20 h-20 rounded-[28px] bg-white dark:bg-dark-950 flex items-center justify-center text-slate-400 dark:text-slate-600 group-hover:text-orange-500 group-hover:bg-orange-500/10 transition-all duration-500 shadow-sm mx-auto">
                <div className="w-10 h-10">{card.icon}</div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-none group-hover:text-orange-600 transition-colors uppercase">
                  {card.title}
                </h3>
                <div className="h-0.5 w-8 bg-slate-200 dark:bg-white/10 mx-auto rounded-full group-hover:w-16 group-hover:bg-orange-600 transition-all duration-500" />
              </div>

              <p className="text-slate-500 dark:text-slate-500 text-xs font-bold leading-relaxed max-w-[240px] mx-auto uppercase tracking-widest opacity-80 group-hover:opacity-100">
                {card.desc}
              </p>
              
              <div className={`pt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500`}>
                 <span className={`text-[9px] font-black uppercase tracking-widest ${card.accent} flex items-center gap-2`}>
                   Access Module 
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                 </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats Decal */}
      <div className="mt-20 border-t border-slate-100 dark:border-white/5 pt-10 flex flex-wrap justify-center gap-12 opacity-40">
         <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] dark:text-white">Neural Load</p>
            <p className="text-lg font-black dark:text-slate-400">Optimal</p>
         </div>
         <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] dark:text-white">Registry</p>
            <p className="text-lg font-black dark:text-slate-400">Synced</p>
         </div>
         <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] dark:text-white">Identity</p>
            <p className="text-lg font-black dark:text-slate-400">Verified</p>
         </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentModule, setCurrentModule] = useState<ModuleType>(() => getModuleFromPath(window.location.pathname));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    NexusServer.recordVisit();
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
    const unsubscribeAuth = NexusServer.onAuthStateChange(async (user) => {
      if (user) {
        const profile = await NexusServer.getProfile(user.id);
        setUserProfile(profile || { id: user.id, email: user.email!, is_admin: false });
      } else { 
        setUserProfile(null); 
        if (!window.location.pathname.includes('/share-cgpa')) {
          setShowAuthModal(true);
        }
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const handlePopState = () => setCurrentModule(getModuleFromPath(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToModule = (module: ModuleType) => {
    setCurrentModule(module);
    const newPath = getPathFromModule(module);
    if (window.location.pathname !== newPath) window.history.pushState({ module }, '', newPath);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const renderModule = () => {
    switch (currentModule) {
      case ModuleType.PLACEMENT: return <PlacementPrefect userProfile={userProfile} />;
      case ModuleType.TIMETABLE: return <TimetableHub userProfile={userProfile} />;
      case ModuleType.QUIZ: return <QuizTaker userProfile={userProfile} />;
      case ModuleType.LIBRARY: return <ContentLibrary userProfile={userProfile} />;
      case ModuleType.CAMPUS: return <CampusNavigator />;
      case ModuleType.HELP: return <HelpSection />;
      case ModuleType.FRESHERS: return <FreshersKit />;
      case ModuleType.CGPA: return <CGPACalculator userProfile={userProfile} />;
      case ModuleType.ATTENDANCE: return <AttendanceTracker />;
      case ModuleType.SHARE_CGPA: return <ShareReport />;
      case ModuleType.ABOUT: return <AboutUs />;
      case ModuleType.PROFILE: return <ProfileSection userProfile={userProfile} setUserProfile={setUserProfile} navigateToModule={navigateToModule} />;
      default: return <Dashboard setModule={navigateToModule} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-dark-950 text-slate-900 dark:text-slate-200 transition-colors duration-300">
      <Sidebar currentModule={currentModule} setModule={navigateToModule} isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} userProfile={userProfile} />
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-white dark:bg-dark-950">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-dark-950 z-10">
          <div className="flex items-center">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-slate-600 dark:text-slate-400 mr-4 border-none bg-transparent">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <span className="md:hidden font-black text-orange-500 cursor-pointer uppercase tracking-tighter" onClick={() => navigateToModule(ModuleType.DASHBOARD)}>LPU-Nexus</span>
          </div>
          <div className="flex items-center space-x-3 ml-auto">
             <button onClick={toggleTheme} className="p-2 rounded-full bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-all border-none">
               {theme === 'dark' ? (
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
               ) : (
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
               )}
             </button>
             <div className="relative">
               {userProfile ? (
                 <>
                   <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="w-10 h-10 rounded-full bg-insta-gradient p-[1.5px] border-none shadow-lg hover:scale-110 transition-all overflow-hidden cursor-pointer group">
                     <div className="w-full h-full bg-dark-950 rounded-full overflow-hidden flex items-center justify-center text-white font-black">
                       {userProfile.avatar_url ? (
                         <img src={userProfile.avatar_url} className="w-full h-full object-cover" alt="" />
                       ) : (
                         <span>{userProfile.username?.[0]?.toUpperCase() || userProfile.email[0].toUpperCase()}</span>
                       )}
                     </div>
                   </button>
                   {isProfileMenuOpen && (
                     <>
                       <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsProfileMenuOpen(false)} />
                       <div className="absolute right-0 mt-3 w-48 bg-dark-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 z-50 animate-fade-in">
                          <button 
                            onClick={() => { navigateToModule(ModuleType.PROFILE); setIsProfileMenuOpen(false); }}
                            className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5 border-none bg-transparent flex items-center gap-3 transition-all"
                          >
                             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                             View Profile
                          </button>
                          <button 
                            onClick={async () => { await NexusServer.signOut(); navigateToModule(ModuleType.DASHBOARD); setIsProfileMenuOpen(false); }}
                            className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 border-none bg-transparent flex items-center gap-3 transition-all"
                          >
                             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                             Sign Out
                          </button>
                       </div>
                     </>
                   )}
                 </>
               ) : (
                 <button onClick={() => setShowAuthModal(true)} className="w-10 h-10 rounded-full border-none bg-slate-100 dark:bg-dark-800 flex items-center justify-center text-slate-400 hover:text-orange-500 transition-all shadow-sm active:scale-95">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                 </button>
               )}
             </div>
          </div>
        </div>
        <div id="main-content-area" className="flex-1 overflow-y-auto relative scroll-smooth p-4 md:p-8 bg-white dark:bg-dark-950">
           <div className="relative z-0 max-w-7xl mx-auto">{renderModule()}</div>
           {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </div>
      </main>
      <Analytics />
      <SpeedInsights />
    </div>
  );
};

export default App;

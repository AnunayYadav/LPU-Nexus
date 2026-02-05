
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar.tsx';
import PlacementPrefect from './components/PlacementPrefect.tsx';
import ContentLibrary from './components/ContentLibrary.tsx';
import CampusNavigator from './components/CampusNavigator.tsx';
import GlobalGateway from './components/GlobalGateway.tsx';
import HelpSection from './components/HelpSection.tsx';
import FreshersKit from './components/FreshersKit.tsx';
import CGPACalculator from './components/CGPACalculator.tsx';
import AttendanceTracker from './components/AttendanceTracker.tsx';
import ShareReport from './components/ShareReport.tsx';
import AboutUs from './components/AboutUs.tsx';
import AuthModal from './components/AuthModal.tsx';
import ProfileSection from './components/ProfileSection.tsx';
import { ModuleType, UserProfile } from './types.ts';
import NexusServer from './services/nexusServer.ts';
import { Analytics } from "@vercel/analytics/react";

const getModuleFromPath = (path: string): ModuleType => {
  const p = path.toLowerCase();
  if (p.includes('/share-cgpa')) return ModuleType.SHARE_CGPA;
  if (p.endsWith('/attendance')) return ModuleType.ATTENDANCE;
  if (p.endsWith('/cgpa')) return ModuleType.CGPA;
  if (p.endsWith('/placement')) return ModuleType.PLACEMENT;
  if (p.endsWith('/library')) return ModuleType.LIBRARY;
  if (p.endsWith('/campus')) return ModuleType.CAMPUS;
  if (p.endsWith('/global')) return ModuleType.GLOBAL;
  if (p.endsWith('/freshers')) return ModuleType.FRESHERS;
  if (p.endsWith('/help')) return ModuleType.HELP;
  if (p.endsWith('/about')) return ModuleType.ABOUT;
  if (p.endsWith('/profile')) return ModuleType.PROFILE;
  return ModuleType.DASHBOARD;
};

const getPathFromModule = (module: ModuleType): string => {
  switch (module) {
    case ModuleType.ATTENDANCE: return '/attendance';
    case ModuleType.CGPA: return '/cgpa';
    case ModuleType.PLACEMENT: return '/placement';
    case ModuleType.LIBRARY: return '/library';
    case ModuleType.CAMPUS: return '/campus';
    case ModuleType.GLOBAL: return '/global';
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
      id: ModuleType.CGPA, 
      title: "CGPA Calculator", 
      desc: "Precision SGPA & CGPA forecasting based on LPU standards.", 
      color: "from-orange-500/20 to-red-500/20",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
    },
    { 
      id: ModuleType.ATTENDANCE, 
      title: "Attendance Tracker", 
      desc: "Monitor sessions and hit that 75% threshold with ease.", 
      color: "from-emerald-500/20 to-teal-500/20",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    },
    { 
      id: ModuleType.PLACEMENT, 
      title: "Placement Prefect", 
      desc: "AI Resume optimization tailored for LPU campus drives.", 
      color: "from-blue-500/20 to-indigo-500/20",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
    },
    { 
      id: ModuleType.LIBRARY, 
      title: "Content Library", 
      desc: "Centralized registry for notes, pyqs and study materials.", 
      color: "from-amber-500/20 to-orange-500/20",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 8h10M8 12h10"/></svg>
    },
    { 
      id: ModuleType.CAMPUS, 
      title: "Campus Navigator", 
      desc: "Interactive 3D maps and latest mess menu cycles.", 
      color: "from-purple-500/20 to-pink-500/20",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
    },
    { 
      id: ModuleType.GLOBAL, 
      title: "Global Gateway", 
      desc: "Explore international masters and scholarship protocols.", 
      color: "from-cyan-500/20 to-blue-500/20",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
    }
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-20 px-4">
      <div className="mb-10 text-center py-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tighter">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">LPU-Nexus</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium">Your AI-Powered Campus Assistant</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(card => (
          <div 
            key={card.id} 
            onClick={() => setModule(card.id)} 
            className="group relative p-8 rounded-[40px] bg-white dark:bg-black border border-slate-100 dark:border-white/5 transition-all cursor-pointer hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_20px_50px_rgba(234,88,12,0.1)] hover:border-orange-500/30 overflow-hidden flex flex-col"
          >
            {/* Background Glow */}
            <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-br ${card.color} blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            {/* Background Icon */}
            <div className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-100 dark:text-white/[0.03] transform rotate-12 group-hover:rotate-6 group-hover:scale-110 transition-all duration-700 pointer-events-none">
              {card.icon}
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-orange-500 group-hover:bg-orange-500/10 transition-all duration-300">
                  <div className="w-5 h-5">{card.icon}</div>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-none group-hover:text-orange-600 transition-colors">
                  {card.title}
                </h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold leading-relaxed max-w-[90%]">{card.desc}</p>
            </div>
          </div>
        ))}
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
      case ModuleType.LIBRARY: return <ContentLibrary userProfile={userProfile} />;
      case ModuleType.CAMPUS: return <CampusNavigator />;
      case ModuleType.GLOBAL: return <GlobalGateway />;
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
    <div className="flex min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-200 transition-colors duration-300">
      <Sidebar 
        currentModule={currentModule} 
        setModule={navigateToModule} 
        isMobileMenuOpen={isMobileMenuOpen} 
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        userProfile={userProfile}
      />
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-black z-10">
          <div className="flex items-center">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-slate-600 dark:text-slate-400 mr-4 border-none bg-transparent">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <span className="md:hidden font-bold text-orange-500 cursor-pointer" onClick={() => navigateToModule(ModuleType.DASHBOARD)}>LPU-Nexus</span>
          </div>
          <div className="flex items-center space-x-3 ml-auto">
             <button onClick={toggleTheme} className="p-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-all border-none">
               {theme === 'dark' ? (
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
               ) : (
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
               )}
             </button>
             <div className="relative">
               {userProfile ? (
                 <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="w-10 h-10 rounded-full bg-insta-gradient p-[1.5px] border-none shadow-lg hover:scale-110 transition-all overflow-hidden cursor-pointer group">
                   <div className="w-full h-full bg-black rounded-full overflow-hidden flex items-center justify-center text-white font-black">
                     {userProfile.avatar_url ? (
                       <img src={userProfile.avatar_url} className="w-full h-full object-cover" alt="" />
                     ) : (
                       <span>{userProfile.username?.[0]?.toUpperCase() || userProfile.email[0].toUpperCase()}</span>
                     )}
                   </div>
                 </button>
               ) : (
                 <button onClick={() => setShowAuthModal(true)} className="w-10 h-10 rounded-full border-none bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-orange-500 transition-all shadow-sm active:scale-95">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                 </button>
               )}
               {isProfileMenuOpen && userProfile && (
                 <>
                   <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
                   <div className="absolute top-full right-0 mt-3 w-64 glass-panel rounded-3xl border border-slate-200 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden animate-fade-in z-50 bg-white dark:bg-black">
                     <div className="p-5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-black flex items-center justify-center font-black text-lg border border-white/10">
                          {userProfile.avatar_url ? (
                            <img src={userProfile.avatar_url} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <span className="text-orange-600">{userProfile.username?.[0]?.toUpperCase()}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase text-orange-600 tracking-[0.2em]">Verified Identity</p>
                          <p className="text-sm font-black truncate dark:text-white uppercase tracking-tight">{userProfile.username || 'Citizen Verto'}</p>
                          <p className="text-[9px] font-bold text-slate-400 truncate">{userProfile.email}</p>
                        </div>
                     </div>
                     <div className="py-2">
                       <button onClick={() => { navigateToModule(ModuleType.PROFILE); setIsProfileMenuOpen(false); }} className="w-full text-left px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-orange-600/10 hover:text-orange-600 flex items-center space-x-3 transition-all border-none bg-transparent">
                         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                         <span>Profile Terminal</span>
                       </button>
                       <div className="mx-4 my-2 h-px bg-slate-100 dark:bg-white/5" />
                       <button onClick={async () => { await NexusServer.signOut(); setIsProfileMenuOpen(false); }} className="w-full text-left px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-900/10 flex items-center space-x-3 transition-all border-none bg-transparent">
                         De-authenticate
                       </button>
                     </div>
                   </div>
                 </>
               )}
             </div>
          </div>
        </div>
        <div id="main-content-area" className="flex-1 overflow-y-auto relative scroll-smooth p-4 md:p-8">
           <div className="relative z-0 max-w-7xl mx-auto">{renderModule()}</div>
           {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </div>
      </main>
      <Analytics />
    </div>
  );
};

export default App;


import React, { useState, useEffect } from 'react';
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
import AuthModal from './components/AuthModal.tsx';
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
    case ModuleType.DASHBOARD: return '/';
    case ModuleType.SHARE_CGPA: return '/share-cgpa';
    default: return '/';
  }
};

const Dashboard: React.FC<{ setModule: (m: ModuleType) => void }> = ({ setModule }) => (
  <div className="max-w-6xl mx-auto animate-fade-in pb-20">
    <div className="mb-10 text-center py-10">
      <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tighter">
        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">LPU-Nexus</span>
      </h2>
      <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium">Your AI-Powered Campus Assistant</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div onClick={() => setModule(ModuleType.CGPA)} className="group relative p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/50 hover:border-orange-500/50 transition-all cursor-pointer hover:shadow-2xl overflow-hidden min-h-[160px]"><h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">CGPA Calculator</h3><p className="text-slate-600 dark:text-slate-400 text-sm">Calculate your SGPA and CGPA based on LPU grading standards.</p></div>
      <div onClick={() => setModule(ModuleType.ATTENDANCE)} className="group relative p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/50 hover:border-green-500/50 transition-all cursor-pointer hover:shadow-2xl overflow-hidden min-h-[160px]"><h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Attendance Tracker</h3><p className="text-slate-600 dark:text-slate-400 text-sm">Monitor your attendance and hit that 75% threshold with ease.</p></div>
      <div onClick={() => setModule(ModuleType.PLACEMENT)} className="group relative p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/50 hover:border-orange-500/50 transition-all cursor-pointer hover:shadow-2xl overflow-hidden min-h-[160px]"><h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Placement Prefect</h3><p className="text-slate-600 dark:text-slate-400 text-sm">Resume ATS matching & optimization tailored for campus drives.</p></div>
      <div onClick={() => setModule(ModuleType.LIBRARY)} className="group relative p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/50 hover:border-orange-500/50 transition-all cursor-pointer hover:shadow-2xl overflow-hidden min-h-[160px]"><h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Content Library</h3><p className="text-slate-600 dark:text-slate-400 text-sm">Centralized hub for all your lectures, question banks and notes.</p></div>
      <div onClick={() => setModule(ModuleType.CAMPUS)} className="group relative p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/50 hover:border-indigo-500/50 transition-all cursor-pointer hover:shadow-2xl overflow-hidden min-h-[160px]"><h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Campus Navigator</h3><p className="text-slate-600 dark:text-slate-400 text-sm">Mess menu checker and interactive 3D map.</p></div>
      <div onClick={() => setModule(ModuleType.GLOBAL)} className="group relative p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/50 hover:border-emerald-500/50 transition-all cursor-pointer hover:shadow-2xl overflow-hidden min-h-[160px]"><h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Global Gateway</h3><p className="text-slate-600 dark:text-slate-400 text-sm">Real-time study abroad info using Google Search Grounding.</p></div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentModule, setCurrentModule] = useState<ModuleType>(() => getModuleFromPath(window.location.pathname));
  const [libraryInitialView, setLibraryInitialView] = useState<'browse' | 'my-uploads'>('browse');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
    
    const unsubscribe = NexusServer.onAuthStateChange(async (user) => {
      if (user) {
        const profile = await NexusServer.getProfile(user.id);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handlePopState = () => setCurrentModule(getModuleFromPath(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToModule = (module: ModuleType) => {
    setCurrentModule(module);
    const newPath = getPathFromModule(module);
    if (window.location.pathname !== newPath) {
      window.history.pushState({ module }, '', newPath);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const renderModule = () => {
    switch (currentModule) {
      case ModuleType.PLACEMENT: return <PlacementPrefect />;
      case ModuleType.LIBRARY: return <ContentLibrary userProfile={userProfile} initialView={libraryInitialView} />;
      case ModuleType.CAMPUS: return <CampusNavigator />;
      case ModuleType.GLOBAL: return <GlobalGateway />;
      case ModuleType.HELP: return <HelpSection />;
      case ModuleType.FRESHERS: return <FreshersKit />;
      case ModuleType.CGPA: return <CGPACalculator />;
      case ModuleType.ATTENDANCE: return <AttendanceTracker />;
      case ModuleType.SHARE_CGPA: return <ShareReport />;
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
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/5 bg-white dark:bg-black z-10 transition-colors">
          <div className="flex items-center">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-slate-600 dark:text-slate-400 mr-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <span className="md:hidden font-bold text-orange-500" onClick={() => navigateToModule(ModuleType.DASHBOARD)}>LPU-Nexus</span>
          </div>

          <div className="flex items-center space-x-3 ml-auto">
             <button onClick={toggleTheme} className="p-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-all">
               {theme === 'dark' ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
             </button>
             
             <div className="relative">
                {userProfile ? (
                  <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 flex items-center justify-center text-white font-black border-2 border-white dark:border-slate-800 shadow-lg group">
                    {userProfile.email[0].toUpperCase()}
                  </button>
                ) : (
                  <button onClick={() => setShowAuthModal(true)} className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:border-orange-500 hover:text-orange-500 transition-all shadow-sm active:scale-95">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </button>
                )}

                {isProfileMenuOpen && userProfile && (
                  <div className="absolute top-full right-0 mt-2 w-56 glass-panel rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden animate-fade-in z-50 bg-white dark:bg-slate-900">
                    <div className="p-4 border-b border-slate-100 dark:border-white/5">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Signed in as</p>
                      <p className="text-xs font-bold truncate dark:text-white">{userProfile.email}</p>
                    </div>
                    <div className="py-2">
                       <button onClick={() => { setLibraryInitialView('my-uploads'); navigateToModule(ModuleType.LIBRARY); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center space-x-2">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          <span>My Uploads</span>
                       </button>
                       <button onClick={async () => { await NexusServer.signOut(); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center space-x-2">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                          <span>Sign Out</span>
                       </button>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>

        <div id="main-content-area" className="flex-1 overflow-y-auto p-4 md:p-8 relative scroll-smooth">
           <div className="fixed top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>
           <div className="relative z-0 max-w-7xl mx-auto">{renderModule()}</div>
           {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
        </div>
      </main>
      <Analytics />
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const cards = [
    {
      id: ModuleType.TIMETABLE,
      path: '/timetable',
      title: "Timetable Hub",
      desc: "Sync schedules with friends and find common break windows.",
      color: "from-orange-500/20 to-red-500/20",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
    },
    {
      id: ModuleType.QUIZ,
      path: '/quiz',
      title: "Quiz Taker",
      desc: "Generate targeted MCQs from subject syllabus using Gemini AI.",
      color: "from-orange-500/20 to-red-500/20",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
    },
    {
      id: ModuleType.CGPA,
      path: '/cgpa',
      title: "CGPA Calculator",
      desc: "Precision SGPA & CGPA forecasting based on LPU standards.",
      color: "from-emerald-500/20 to-teal-500/20",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="16" y1="14" x2="16" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M12 18h.01" /><path d="M8 18h.01" /></svg>
    },
    {
      id: ModuleType.PLACEMENT,
      path: '/placement',
      title: "Placement Prefect",
      desc: "AI Resume optimization tailored for LPU campus drives.",
      color: "from-blue-500/20 to-indigo-500/20",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
    },
    {
      id: ModuleType.LIBRARY,
      path: '/library',
      title: "Content Library",
      desc: "Centralized registry for notes, pyqs and study materials.",
      color: "from-amber-500/20 to-orange-500/20",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /><path d="M8 8h10M8 12h10" /></svg>
    },
    {
      id: ModuleType.CAMPUS,
      path: '/campus',
      title: "Campus Navigator",
      desc: "Interactive 3D maps and latest mess menu cycles.",
      color: "from-purple-500/20 to-pink-500/20",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>
    },
    {
      id: ModuleType.FRESHERS,
      path: '/freshers',
      title: "Freshmen Kit",
      desc: "Essential guides and resources for new students.",
      color: "from-cyan-500/20 to-blue-500/20",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><path d="M4 20V10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" /><path d="M9 6V4a3 3 0 0 1 6 0v2" /><path d="M8 21v-5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5" /></svg>
    },
    {
      id: ModuleType.HELP,
      path: '/help',
      title: "Help & FAQ",
      desc: "Find answers and support for your queries.",
      color: "from-rose-500/20 to-pink-500/20",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
    },
    {
      id: ModuleType.ABOUT,
      path: '/about',
      title: "About Us",
      desc: "Learn more about the LPU-Nexus team and mission.",
      color: "from-slate-500/20 to-gray-500/20",
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
    }
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-20 px-4">
      <div className="mb-10 text-center py-10">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tighter">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">LPU-Nexus</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium">Your AI-Powered Campus Assistant</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => navigate(card.path)}
            className="group glass-panel relative p-8 rounded-[40px] border-slate-200 dark:border-white/5 transition-all cursor-pointer hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_100px_rgba(234,88,12,0.15)] hover:border-orange-500/30 overflow-hidden flex flex-col"
          >
            <div className={`absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-br ${card.color} blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-100 dark:text-white/[0.03] transform rotate-12 group-hover:rotate-6 group-hover:scale-110 transition-all duration-700 pointer-events-none">
              {card.icon}
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-orange-500 group-hover:bg-orange-500/10 transition-all duration-300">
                  <div className="w-5 h-5">{card.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tighter leading-none group-hover:text-orange-600 transition-colors">
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


const RegistrationPrompt: React.FC<{ userProfile: UserProfile, onComplete: (profile: UserProfile) => void }> = ({ userProfile, onComplete }) => {
  const [regNo, setRegNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regNo.length < 8) {
      setError("Please enters a valid 8-digit Registration Number.");
      return;
    }
    setLoading(true);
    try {
      await NexusServer.updateProfile(userProfile.id, { registration_number: regNo });
      onComplete({ ...userProfile, registration_number: regNo });
    } catch (e: any) {
      // Check for Supabase Unique Constraint Violation (Error Code 23505)
      if (e.message?.includes('unique_registration_number') || e.code === '23505') {
        setError("This Registration Number is already associated with another identity.");
      } else {
        setError(e.message || "Failed to establish identity registration.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-3xl bg-black/60">
      <div className="bg-white dark:bg-[#0a0a0a] rounded-[48px] w-full max-w-md shadow-3xl border border-slate-200 dark:border-white/10 p-10 animate-fade-in relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-600/10 blur-[64px] rounded-full pointer-events-none" />

        <div className="w-20 h-20 bg-orange-600/10 rounded-[32px] flex items-center justify-center mb-8 border border-orange-600/20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-10 h-10 text-orange-600"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><path d="M7 21v-4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" /><circle cx="12" cy="11" r="3" /></svg>
        </div>

        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter uppercase leading-none">Identity Check</h3>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Establish your Registration Number to continue to Nexus.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Registration Number</label>
            <div className="relative group">
              <input
                type="text" required value={regNo}
                onChange={e => setRegNo(e.target.value.replace(/[^0-9]/g, '').slice(0, 8))}
                className="w-full bg-slate-50 dark:bg-black pl-6 pr-4 py-5 rounded-[24px] text-sm font-bold border border-slate-200 dark:border-white/10 focus:ring-4 focus:ring-orange-600/10 dark:text-white transition-all shadow-inner outline-none"
                placeholder="Candidate Registration (8 Digits)"
              />
            </div>
            {error && <p className="text-[10px] font-black text-red-500 uppercase mt-4 text-center">{error}</p>}
          </div>

          <button
            type="submit" disabled={loading || regNo.length < 8}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-orange-600/20 active:scale-95 transition-all disabled:opacity-50 border-none"
          >
            {loading ? 'Synchronizing...' : 'Authorize Signature'}
          </button>
        </form>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const currentModule = getModuleFromPath(location.pathname);

  useEffect(() => {
    NexusServer.recordVisit();
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
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

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const navigateToModule = (module: ModuleType) => {
    const path = getPathFromModule(module);
    navigate(path);
  };

  const showRegPrompt = userProfile && !userProfile.registration_number;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-200 transition-colors duration-300">
      <Sidebar
        currentModule={currentModule}
        setModule={navigateToModule}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        userProfile={userProfile}
      />
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-slate-50 dark:bg-black transition-colors duration-500">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10 transition-colors duration-500">
          <div className="flex items-center">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-slate-600 dark:text-slate-400 mr-4 border-none bg-transparent">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <span className="md:hidden font-bold text-orange-500 cursor-pointer" onClick={() => navigate('/')}>LPU-Nexus</span>
          </div>
          <div className="flex items-center space-x-3 ml-auto">
            <button onClick={toggleTheme} className="p-2.5 rounded-full bg-slate-100 dark:bg-[#0a0a0a] text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-white transition-all border border-transparent dark:border-white/5 shadow-sm active:scale-90">
              {theme === 'dark' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
              )}
            </button>
            <div className="relative">
              {userProfile ? (
                <>
                  <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="w-11 h-11 rounded-full bg-gradient-to-tr from-orange-600 to-red-600 p-[1.5px] border-none shadow-[0_8px_20px_rgba(234,88,12,0.2)] hover:scale-105 active:scale-95 transition-all overflow-hidden cursor-pointer group">
                    <div className="w-full h-full bg-white dark:bg-[#0a0a0a] rounded-full overflow-hidden flex items-center justify-center text-slate-900 dark:text-orange-600 font-black text-sm">
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
                      <div className="absolute right-0 mt-3 w-56 bg-[#0a0a0a] border border-white/10 rounded-[32px] shadow-[0_32px_64px_rgba(0,0,0,0.8)] overflow-hidden py-3 z-50 animate-fade-in backdrop-blur-xl">
                        <div className="px-5 py-3 border-b border-white/5 mb-2">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">Identity Active</p>
                          <p className="text-[11px] font-bold text-white/40 truncate">{userProfile.email}</p>
                        </div>
                        <button
                          onClick={() => { navigate('/profile'); setIsProfileMenuOpen(false); }}
                          className="w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/70 hover:text-white hover:bg-white/5 border-none bg-transparent flex items-center gap-3 transition-all"
                        >
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-600/20 transition-colors">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                          </div>
                          View Terminal
                        </button>
                        <button
                          onClick={async () => { await NexusServer.signOut(); navigate('/'); setIsProfileMenuOpen(false); }}
                          className="w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-red-500 hover:bg-red-500/10 border-none bg-transparent flex items-center gap-3 transition-all"
                        >
                          <div className="w-8 h-8 rounded-full bg-red-500/5 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                          </div>
                          De-authenticate
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <button onClick={() => setShowAuthModal(true)} className="w-10 h-10 rounded-full border-none bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-slate-400 hover:text-orange-500 transition-all shadow-sm active:scale-95">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                </button>
              )}
            </div>
          </div>
        </div>
        <div id="main-content-area" className="flex-1 overflow-y-auto relative scroll-smooth p-4 md:p-8 bg-white dark:bg-black">
          <div className="relative z-0 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/placement" element={<PlacementPrefect userProfile={userProfile} />} />
              <Route path="/timetable" element={<TimetableHub userProfile={userProfile} />} />
              <Route path="/quiz" element={<QuizTaker userProfile={userProfile} />} />
              <Route path="/library" element={<ContentLibrary userProfile={userProfile} />} />
              <Route path="/campus" element={<CampusNavigator />} />
              <Route path="/help" element={<HelpSection />} />
              <Route path="/freshers" element={<FreshersKit />} />
              <Route path="/cgpa" element={<CGPACalculator userProfile={userProfile} />} />
              <Route path="/attendance" element={<AttendanceTracker />} />
              <Route path="/share-cgpa" element={<ShareReport />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/profile" element={<ProfileSection userProfile={userProfile} setUserProfile={setUserProfile} navigateToModule={(m) => navigate(getPathFromModule(m))} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
          {showRegPrompt && <RegistrationPrompt userProfile={userProfile} onComplete={(p) => setUserProfile(p)} />}
        </div>
      </main>
      <Analytics />
      <SpeedInsights />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

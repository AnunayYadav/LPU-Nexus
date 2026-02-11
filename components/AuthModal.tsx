
import React, { useState, useEffect } from 'react';
import NexusServer from '../services/nexusServer.ts';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState(''); 
  const [email, setEmail] = useState(''); 
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  useEffect(() => {
    if (!isLogin && username.length >= 3) {
      const timer = setTimeout(async () => {
        setUsernameStatus('checking');
        try {
          const available = await NexusServer.checkUsernameAvailability(username);
          setUsernameStatus(available ? 'available' : 'taken');
        } catch (e) {
          setUsernameStatus('idle');
        }
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setUsernameStatus('idle');
    }
  }, [username, isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!NexusServer.isConfigured()) {
      setError("Registry Offline: Database credentials missing.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        if (!identifier.trim() || !password.trim()) throw new Error("Credentials required.");
        const result = await NexusServer.signIn(identifier, password);
        if (result.error) throw result.error;
        onClose();
      } else {
        if (!email.trim() || username.length < 3) throw new Error("Invalid parameters.");
        if (usernameStatus === 'taken') throw new Error("Username unavailable.");
        const result = await NexusServer.signUp(email, password, username);
        if (result.error) throw result.error;
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col md:flex-row bg-dark-950 animate-fade-in overflow-hidden h-full w-full">
      {/* Immersive Left Side (Desktop Hero) */}
      <div className="hidden md:flex md:w-1/2 bg-dark-900 border-r border-white/5 flex-col justify-center p-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/5 blur-[140px] rounded-full -mr-32 -mt-32 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-600/5 blur-[120px] rounded-full -ml-32 -mb-32" />
        
        <div className="relative z-10 space-y-10">
          <div className="space-y-4">
             <div className="w-16 h-16 bg-insta-gradient p-[1.5px] rounded-2xl shadow-2xl shadow-orange-600/20">
                <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center">
                   <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-8 h-8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
             </div>
             <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">
               Access <br/>The <span className="text-orange-600">Nexus</span>
             </h1>
          </div>
          
          <div className="space-y-6 max-w-md">
             <p className="text-slate-400 text-lg font-medium leading-relaxed">
               Sync with the ultimate student ecosystem. Track attendance, optimize resumes, and master your academic journey.
             </p>
             <div className="flex gap-4">
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Live Pulse</span>
                </div>
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Verto Built</span>
                </div>
             </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-20">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700">LPU-NEXUS SYSTEM V2.5.0</p>
        </div>
      </div>

      {/* Auth Content Area (Right side / Full mobile) */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-20 bg-dark-950 relative">
        <div className="w-full max-w-sm space-y-12 animate-fade-in">
          {/* Mobile Header */}
          <div className="md:hidden text-center space-y-4">
             <div className="w-12 h-12 bg-orange-600/10 rounded-2xl flex items-center justify-center mx-auto border border-orange-600/20">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6 text-orange-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
             </div>
             <h2 className="text-3xl font-black text-white uppercase tracking-tighter">LPU-Nexus</h2>
          </div>

          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">{isLogin ? 'Welcome Back' : 'Join the Registry'}</h3>
            <p className="text-slate-500 text-sm font-medium">{isLogin ? 'Provide your credentials to re-authenticate.' : 'Create a new Verto identity in the hub.'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase rounded-2xl text-center flex flex-col gap-1">
                <span>Protocol Breach Detected</span>
                <p className="normal-case opacity-70">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                  <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold group-focus-within:text-orange-500">@</span>
                    <input 
                      type="text" required value={username} onChange={e => setUsername(e.target.value.toLowerCase())}
                      className="w-full bg-dark-900 border border-white/5 rounded-2xl pl-10 pr-4 py-4 text-sm font-bold text-white outline-none focus:ring-4 focus:ring-orange-600/10 transition-all shadow-inner"
                      placeholder="verto_id"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                       {usernameStatus === 'checking' && <div className="w-3 h-3 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />}
                       {usernameStatus === 'available' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3.5 h-3.5 text-emerald-500"><polyline points="20 6 9 17 4 12"/></svg>}
                       {usernameStatus === 'taken' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3.5 h-3.5 text-red-500"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{isLogin ? 'Email or User' : 'Official Email'}</label>
                <input 
                  type={isLogin ? "text" : "email"} required value={isLogin ? identifier : email} 
                  onChange={e => isLogin ? setIdentifier(e.target.value) : setEmail(e.target.value)}
                  className="w-full bg-dark-900 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-4 focus:ring-orange-600/10 transition-all shadow-inner"
                  placeholder={isLogin ? "user@lpu.in or username" : "official.name@lpu.in"}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <input 
                  type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-dark-900 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold text-white outline-none focus:ring-4 focus:ring-orange-600/10 transition-all shadow-inner"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" disabled={loading || (!isLogin && usernameStatus === 'taken')}
              className="w-full py-5 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-orange-600/20 active:scale-95 transition-all border-none disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              ) : (isLogin ? 'Authenticate Instance' : 'Create Identity')}
            </button>

            <div className="pt-8 text-center space-y-4">
               <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-orange-500 transition-colors border-none bg-transparent">
                 {isLogin ? "Don't have an instance? Create Protocol" : "Existing Verto Identity? Re-auth"}
               </button>
            </div>
          </form>
        </div>

        {/* Floating Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-10 right-10 p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-500 hover:text-white hover:bg-white/10 transition-all border-none shadow-xl"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  );
};

export default AuthModal;

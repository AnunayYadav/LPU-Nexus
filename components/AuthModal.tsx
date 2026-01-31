
import React, { useState } from 'react';
import NexusServer from '../services/nexusServer.ts';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        const { error: signInErr } = await NexusServer.signIn(email, password);
        if (signInErr) throw signInErr;
      } else {
        const { error: signUpErr } = await NexusServer.signUp(email, password);
        if (signUpErr) throw signUpErr;
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Auth failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-400/40 dark:bg-black/80 backdrop-blur-md animate-fade-in overflow-hidden">
      <div className="bg-white dark:bg-slate-950 rounded-[40px] w-full max-w-sm shadow-2xl border border-slate-200 dark:border-white/10 relative overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-slate-900 to-black p-8 text-white text-center relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <h3 className="text-2xl font-black tracking-tighter uppercase">{isLogin ? 'Welcome Back' : 'Create Account'}</h3>
          <p className="text-white/50 text-[10px] font-black mt-1 uppercase tracking-widest">LPU-Nexus Gateway</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase rounded-xl text-center">{error}</div>}
          
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Email Address</label>
            <input 
              type="email" required value={email} onChange={e => setEmail(e.target.value)} 
              className="w-full bg-slate-100 dark:bg-black/40 p-4 rounded-2xl text-sm font-bold outline-none border border-transparent focus:ring-2 focus:ring-orange-500 shadow-inner dark:text-white" 
              placeholder="e.g. user@lpu.in"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Password</label>
            <input 
              type="password" required value={password} onChange={e => setPassword(e.target.value)} 
              className="w-full bg-slate-100 dark:bg-black/40 p-4 rounded-2xl text-sm font-bold outline-none border border-transparent focus:ring-2 focus:ring-orange-500 shadow-inner dark:text-white" 
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>

          <button type="button" onClick={() => setIsLogin(!isLogin)} className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-500 transition-colors py-2">
            {isLogin ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;

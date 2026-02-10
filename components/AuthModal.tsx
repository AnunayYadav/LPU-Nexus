
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        const result = await NexusServer.signIn(identifier, password);
        if (result.error) throw result.error;
      } else {
        const result = await NexusServer.signUp(email, password, username);
        if (result.error) throw result.error;
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Auth protocol interrupted.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-xl animate-fade-in overflow-hidden">
      <div className="bg-white dark:bg-dark-900 rounded-[48px] w-full max-w-sm shadow-[0_32px_128px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-white/10 relative overflow-hidden flex flex-col group">
        
        <div className="bg-dark-950 p-10 text-white text-center relative rounded-t-[48px]">
          <button onClick={onClose} className="absolute top-8 right-8 p-2 text-white/30 hover:text-white transition-colors border-none bg-transparent">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <div className="w-16 h-16 bg-orange-600/10 rounded-[28px] flex items-center justify-center mx-auto mb-6 border border-orange-600/20 shadow-xl">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8 text-orange-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3 className="text-3xl font-black tracking-tighter uppercase leading-none">Nexus Gate</h3>
          <p className="text-white/40 text-[9px] font-black mt-3 uppercase tracking-[0.4em]">{isLogin ? 'Establish Session' : 'Identity Protocol'}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase rounded-2xl text-center animate-fade-in">{error}</div>}
          
          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Verto Username</label>
                <input type="text" required value={username} onChange={e => setUsername(e.target.value.toLowerCase())} className="w-full bg-slate-100 dark:bg-dark-950 border border-transparent dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-orange-600/10 transition-all shadow-inner" placeholder="verto_id" />
              </div>
            )}
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">{isLogin ? 'Email / User' : 'Official Email'}</label>
              <input type={isLogin ? "text" : "email"} required value={isLogin ? identifier : email} onChange={e => isLogin ? setIdentifier(e.target.value) : setEmail(e.target.value)} className="w-full bg-slate-100 dark:bg-dark-950 border border-transparent dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-orange-600/10 transition-all shadow-inner" placeholder="protocol@lpu.in" />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Cipher</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-100 dark:bg-dark-950 border border-transparent dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-orange-600/10 transition-all shadow-inner" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-600/20 active:scale-95 transition-all border-none">
            {loading ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin mx-auto" /> : 'Execute Protocol'}
          </button>

          <button type="button" onClick={() => setIsLogin(!isLogin)} className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-orange-500 transition-colors border-none bg-transparent">{isLogin ? "New Identity? Initialise" : "Existing Entry? Re-auth"}</button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;

import React, { useState, useEffect } from 'react';
import { UserProfile, ModuleType } from '../types.ts';
import NexusServer from '../services/nexusServer.ts';

interface ProfileSectionProps {
  userProfile: UserProfile | null;
  setUserProfile: (p: UserProfile | null) => void;
  navigateToModule: (m: ModuleType) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ userProfile, setUserProfile, navigateToModule }) => {
  const [username, setUsername] = useState(userProfile?.username || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (userProfile?.username) {
      setUsername(userProfile.username);
    }
  }, [userProfile]);

  const handleUpdateUsername = async () => {
    if (!userProfile || !username.trim() || username === userProfile.username) return;
    
    // Simple validation
    if (username.length < 3 || username.length > 15) {
      setMessage({ text: "Username must be 3-15 characters.", type: 'error' });
      return;
    }

    setIsUpdating(true);
    setMessage(null);
    try {
      await NexusServer.updateUsername(userProfile.id, username.trim());
      setUserProfile({ ...userProfile, username: username.trim() });
      setMessage({ text: "Username updated successfully.", type: 'success' });
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (e: any) {
      setMessage({ text: e.message || "Failed to update username.", type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="w-20 h-20 bg-black rounded-3xl flex items-center justify-center text-orange-600 mb-6 shadow-xl">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-10 h-10"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter mb-2">Access Denied</h2>
        <p className="text-slate-500 text-sm mb-8">You must be authenticated to view this node.</p>
        <button 
          onClick={() => navigateToModule(ModuleType.DASHBOARD)}
          className="bg-black text-orange-600 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-xl"
        >
          Return Home
        </button>
      </div>
    );
  }

  const isChanged = username.trim() !== '' && username !== userProfile.username;
  const isTooShort = username.length > 0 && username.length < 3;

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-20 px-4 md:px-0">
      <header className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-[32px] bg-black flex items-center justify-center text-orange-600 text-4xl font-black mb-6 shadow-2xl relative group overflow-hidden border border-white/5">
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10 drop-shadow-lg">
            {userProfile.username ? userProfile.username[0].toUpperCase() : userProfile.email[0].toUpperCase()}
          </span>
          <div className="absolute -bottom-1 -right-1 bg-orange-600 w-8 h-8 rounded-full border-4 border-white dark:border-black flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" className="w-3 h-3"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none">
          {userProfile.username || 'Citizen Verto'}
        </h2>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">
          {userProfile.email}
        </p>
      </header>

      {/* Identity Terminal Box */}
      <div className="glass-panel p-8 rounded-[40px] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/50 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-500 to-red-600 opacity-0 group-focus-within:opacity-100 transition-opacity" />
        
        <header className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600 dark:text-orange-500 mb-1">Identity Terminal</h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Protocol: Account Management</p>
          </div>
          <div className="bg-slate-100 dark:bg-black px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/5 flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${userProfile.is_admin ? 'bg-emerald-500 shadow-[0_0_8px_emerald]' : 'bg-blue-500 shadow-[0_0_8px_blue]'}`} />
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{userProfile.is_admin ? 'MODERATOR' : 'VERTO'}</span>
          </div>
        </header>

        <div className="space-y-6">
          <div className="relative">
            <div className="flex justify-between items-center mb-2 px-1">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Username</label>
              <span className={`text-[9px] font-black tracking-widest ${username.length > 15 || isTooShort ? 'text-red-500' : 'text-slate-500'}`}>
                {username.length}/15
              </span>
            </div>
            
            <div className={`relative flex items-center transition-all duration-300 rounded-2xl border ${isChanged ? 'border-orange-500/50' : 'border-transparent'} group-focus-within:border-orange-600/50`}>
              <input 
                type="text" 
                value={username}
                onChange={(e) => {
                  const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                  if (val.length <= 15) setUsername(val);
                }}
                placeholder="new_username"
                className="w-full bg-slate-100 dark:bg-black p-5 rounded-2xl font-black text-sm dark:text-white outline-none focus:ring-4 focus:ring-orange-600/10 shadow-inner transition-all placeholder:text-slate-300 dark:placeholder:text-slate-800"
              />
              <button 
                onClick={handleUpdateUsername}
                disabled={isUpdating || !isChanged || isTooShort}
                className={`
                  absolute right-3 px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] transition-all
                  ${!isChanged || isTooShort 
                    ? 'bg-slate-200 dark:bg-white/5 text-slate-400 cursor-not-allowed' 
                    : 'bg-orange-600 text-white shadow-xl shadow-orange-600/20 hover:scale-105 active:scale-95'
                  }
                `}
              >
                {isUpdating ? '...' : 'SAVE CHANGES'}
              </button>
            </div>
            
            <div className="mt-3 flex items-start gap-2 px-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3 text-slate-400 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                Lowercase alphanumeric & underscores only. This username is your public identity in the Nexus Hub.
              </p>
            </div>
          </div>
          
          {message && (
            <div className={`p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest text-center animate-fade-in border flex items-center justify-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`} />
              {message.text}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div 
          onClick={() => navigateToModule(ModuleType.ATTENDANCE)} 
          className="glass-panel p-6 rounded-[32px] text-center shadow-lg hover:border-orange-500/50 transition-all cursor-pointer bg-white dark:bg-slate-950/30 border border-slate-200 dark:border-white/5 flex flex-col items-center group"
        >
          <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400 mb-3 group-hover:text-orange-500 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Protocol Status</p>
          <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tighter">Active Verto</p>
        </div>
        
        <div 
          onClick={() => navigateToModule(ModuleType.LIBRARY)} 
          className="glass-panel p-6 rounded-[32px] text-center shadow-lg hover:border-orange-500/50 transition-all cursor-pointer bg-white dark:bg-slate-950/30 border border-slate-200 dark:border-white/5 flex flex-col items-center group"
        >
          <div className="w-10 h-10 bg-slate-100 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400 mb-3 group-hover:text-orange-500 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Contributions</p>
          <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tighter">Personal Vault</p>
        </div>
      </div>

      <div className="pt-10 flex flex-col items-center space-y-4">
         <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">System Version: Nexus v1.3.0</p>
         <button 
           onClick={async () => { await NexusServer.signOut(); navigateToModule(ModuleType.DASHBOARD); }}
           className="text-red-500 font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity flex items-center gap-2 px-6 py-2 rounded-xl hover:bg-red-500/5"
         >
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
           De-authenticate Session
         </button>
      </div>
    </div>
  );
};

export default ProfileSection;
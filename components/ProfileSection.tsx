
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
      setMessage({ text: "Profile identity established.", type: 'success' });
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

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-20">
      <header className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-[32px] bg-black flex items-center justify-center text-orange-600 text-4xl font-black mb-6 shadow-2xl relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {userProfile.username ? userProfile.username[0].toUpperCase() : userProfile.email[0].toUpperCase()}
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none">
          {userProfile.username || 'Citizen Verto'}
        </h2>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
          {userProfile.email}
        </p>
      </header>

      <div className="glass-panel p-8 rounded-[40px] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/50 space-y-6 shadow-2xl">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 mb-4 ml-1">Identity Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[8px] font-black uppercase text-slate-400 mb-2 ml-4">Unique Username</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="set_username"
                  className="flex-1 bg-slate-100 dark:bg-black p-4 rounded-2xl font-bold border-none text-sm dark:text-white outline-none focus:ring-2 focus:ring-orange-600 shadow-inner"
                />
                <button 
                  onClick={handleUpdateUsername}
                  disabled={isUpdating || !username.trim() || username === userProfile.username}
                  className="bg-black text-orange-600 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed hover:bg-orange-600 hover:text-white active:scale-95 transition-all shadow-xl"
                >
                  {isUpdating ? '...' : 'Commit'}
                </button>
              </div>
              <p className="mt-2 text-[8px] font-bold text-slate-400 ml-4">Only lowercase, numbers and underscores allowed. This will be shown on your contributions.</p>
            </div>
            
            {message && (
              <div className={`p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-fade-in ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                {message.text}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="p-6 bg-black rounded-3xl text-center shadow-lg hover:scale-105 transition-transform cursor-pointer border-none" onClick={() => navigateToModule(ModuleType.ATTENDANCE)}>
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Status</p>
            <p className="text-xl font-black text-white uppercase">Verto</p>
          </div>
          <div className="p-6 bg-black rounded-3xl text-center shadow-lg hover:scale-105 transition-transform cursor-pointer border-none" onClick={() => navigateToModule(ModuleType.LIBRARY)}>
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Contributions</p>
            <p className="text-xl font-black text-white">Vault</p>
          </div>
        </div>
      </div>

      <div className="pt-10 flex flex-col items-center">
         <button 
           onClick={async () => { await NexusServer.signOut(); navigateToModule(ModuleType.DASHBOARD); }}
           className="text-red-500 font-black text-[10px] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity flex items-center gap-2"
         >
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
           De-authenticate Session
         </button>
      </div>
    </div>
  );
};

export default ProfileSection;

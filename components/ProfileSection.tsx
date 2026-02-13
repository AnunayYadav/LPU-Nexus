
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { UserProfile, ModuleType } from '../types.ts';
import NexusServer from '../services/nexusServer.ts';

interface ProfileSectionProps {
  userProfile: UserProfile | null;
  setUserProfile: (p: UserProfile | null) => void;
  navigateToModule: (m: ModuleType) => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ userProfile, setUserProfile, navigateToModule }) => {
  const [form, setForm] = useState({
    username: userProfile?.username || '',
    program: userProfile?.program || '',
    batch: userProfile?.batch || '',
    registration_number: userProfile?.registration_number || '',
    bio: userProfile?.bio || '',
    is_public: userProfile?.is_public || false
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [changeHistory, setChangeHistory] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userProfile) {
      setForm({
        username: userProfile.username || '',
        program: userProfile.program || '',
        batch: userProfile.batch || '',
        registration_number: userProfile.registration_number || '',
        bio: userProfile.bio || '',
        is_public: userProfile.is_public || false
      });
      fetchHistory();
    }
  }, [userProfile]);

  const fetchHistory = async () => {
    if (!userProfile) return;
    const records = await NexusServer.fetchRecords(userProfile.id, 'username_change');
    setChangeHistory(records);
  };

  const recentChanges = useMemo(() => {
    const now = Date.now();
    const TWO_WEEKS = 14 * 24 * 60 * 60 * 1000;
    return changeHistory.filter(h => (now - new Date(h.created_at).getTime()) < TWO_WEEKS);
  }, [changeHistory]);

  const handleUpdate = async () => {
    if (!userProfile) return;
    setIsUpdating(true);
    setMessage(null);
    try {
      if (form.username !== userProfile.username && recentChanges.length >= 2) {
        throw new Error("Username change limit reached (2/14 days).");
      }

      await NexusServer.updateProfile(userProfile.id, {
        username: form.username.trim().toLowerCase(),
        program: form.program.trim(),
        batch: form.batch.trim(),
        registration_number: form.registration_number.trim(),
        bio: form.bio.trim(),
        is_public: form.is_public
      });

      if (form.username !== userProfile.username) {
        await NexusServer.saveRecord(userProfile.id, 'username_change', `Changed to ${form.username}`, { username: form.username });
      }

      setUserProfile({ ...userProfile, ...form });
      setMessage({ text: "Profile protocol synchronized.", type: 'success' });
      fetchHistory();
      setTimeout(() => setMessage(null), 3000);
    } catch (e: any) {
      setMessage({ text: e.message || "Failed to update profile.", type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userProfile) return;

    setIsUploading(true);
    try {
      const url = await NexusServer.uploadAvatar(userProfile.id, file);
      setUserProfile({ ...userProfile, avatar_url: url });
      setMessage({ text: "Identity visual updated.", type: 'success' });
    } catch (err: any) {
      setMessage({ text: "Upload failed: " + err.message, type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter mb-2">Access Denied</h2>
        <p className="text-slate-500 text-sm mb-8">Authenticate to manage your Verto identity.</p>
        <button onClick={() => navigateToModule(ModuleType.DASHBOARD)} className="bg-black text-orange-600 px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-xl border-none">Return Home</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-20 px-4 md:px-0">
      <header className="flex flex-col items-center text-center">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative group cursor-pointer"
        >
          <div className="w-28 h-28 rounded-full bg-insta-gradient p-[3px] shadow-2xl transition-transform group-hover:scale-105 active:scale-95">
            <div className="w-full h-full bg-black rounded-full p-[2px]">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center overflow-hidden relative">
                {userProfile.avatar_url ? (
                  <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-orange-600 text-4xl font-black">{userProfile.username?.[0]?.toUpperCase() || userProfile.email[0].toUpperCase()}</span>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 bg-orange-600 w-8 h-8 rounded-full border-4 border-black flex items-center justify-center shadow-lg group-hover:bg-orange-500 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-4 h-4"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
        </div>

        <div className="mt-6">
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none">{userProfile.username || 'Citizen Verto'}</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">{userProfile.email}</p>
        </div>
      </header>

      <div className="glass-panel p-8 rounded-[40px] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/50 shadow-xl space-y-8">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-6">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600 mb-1">Public Discovery</h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Visibility in Verto Directory</p>
          </div>
          <button
            onClick={() => setForm({ ...form, is_public: !form.is_public })}
            className={`relative w-14 h-7 rounded-full transition-all border-none outline-none ${form.is_public ? 'bg-orange-600' : 'bg-slate-200 dark:bg-white/5'}`}
          >
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-md ${form.is_public ? 'left-8' : 'left-1'}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Username</label>
              <input
                type="text" value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full bg-slate-100 dark:bg-black p-4 rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-orange-600 dark:text-white shadow-inner"
              />
              <p className="text-[8px] text-slate-400 mt-2 font-bold uppercase">{recentChanges.length}/2 Identity shifts used</p>
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Academic Program</label>
              <input
                type="text" value={form.program} placeholder="e.g. B.Tech CSE"
                onChange={(e) => setForm({ ...form, program: e.target.value })}
                className="w-full bg-slate-100 dark:bg-black p-4 rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-orange-600 dark:text-white shadow-inner"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Registration No</label>
              <input
                type="text" value={form.registration_number} placeholder="e.g. 12415309"
                onChange={(e) => setForm({ ...form, registration_number: e.target.value.replace(/[^0-9]/g, '').slice(0, 8) })}
                className="w-full bg-slate-100 dark:bg-black p-4 rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-orange-600 dark:text-white shadow-inner"
              />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Batch Year</label>
              <input
                type="text" value={form.batch} placeholder="e.g. 2021-25"
                onChange={(e) => setForm({ ...form, batch: e.target.value })}
                className="w-full bg-slate-100 dark:bg-black p-4 rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-orange-600 dark:text-white shadow-inner"
              />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">About / Bio</label>
              <textarea
                value={form.bio} placeholder="Tech enthusiast, Verto since '21..."
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full bg-slate-100 dark:bg-black p-4 rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-orange-600 dark:text-white shadow-inner h-[54px] resize-none"
              />
            </div>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-2xl text-[9px] font-black uppercase tracking-widest text-center border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
            {message.text}
          </div>
        )}

        <button
          onClick={handleUpdate} disabled={isUpdating}
          className="w-full bg-black text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl active:scale-95 disabled:opacity-50 border-none"
        >
          {isUpdating ? 'SYNCHRONIZING...' : 'UPDATE PROFILE TERMINAL'}
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={async () => { await NexusServer.signOut(); navigateToModule(ModuleType.DASHBOARD); }}
          className="text-red-500 font-black text-[10px] uppercase tracking-widest hover:opacity-70 transition-opacity flex items-center gap-2 mx-auto border-none bg-transparent"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          De-authenticate Session
        </button>
      </div>
    </div>
  );
};

export default ProfileSection;

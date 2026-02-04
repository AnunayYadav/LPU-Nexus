
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage } from '../types.ts';
import NexusServer from '../services/nexusServer.ts';

interface SocialHubProps {
  userProfile: UserProfile | null;
}

const SocialHub: React.FC<SocialHubProps> = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'directory'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [publicProfiles, setPublicProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadInitialData();
    const unsubscribe = NexusServer.subscribeToSocialChat((newMsg) => {
      setMessages(prev => [...prev, newMsg]);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [msgs, profiles] = await Promise.all([
        NexusServer.fetchSocialMessages(),
        NexusServer.fetchPublicProfiles()
      ]);
      setMessages(msgs);
      setPublicProfiles(profiles);
    } catch (e) {
      console.error("Failed to load social data", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !userProfile || isSending) return;
    
    setIsSending(true);
    try {
      await NexusServer.sendSocialMessage(userProfile.id, userProfile.username || 'Anonymous Verto', inputText);
      setInputText('');
    } catch (e) {
      alert("Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-140px)] animate-fade-in px-4 md:px-0">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase leading-none">Nexus Social</h2>
          <p className="text-orange-600 text-[10px] font-black uppercase tracking-widest mt-1">Live Verto Ecosystem</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-black p-1 rounded-2xl border border-slate-200 dark:border-white/5 shadow-inner">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'chat' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Verto Lounge
          </button>
          <button 
            onClick={() => setActiveTab('directory')}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'directory' ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Directory
          </button>
        </div>
      </header>

      <div className="flex-1 flex gap-6 min-h-0">
        {activeTab === 'chat' ? (
          <div className="flex-1 flex flex-col glass-panel rounded-[40px] border border-slate-200 dark:border-white/5 overflow-hidden shadow-2xl bg-white dark:bg-slate-950/40">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
              {isLoading ? (
                <div className="flex items-center justify-center h-full opacity-30 text-[10px] font-black uppercase tracking-widest animate-pulse">Syncing Lounge Protocol...</div>
              ) : messages.map((msg, i) => {
                const isMe = msg.sender_id === userProfile?.id;
                return (
                  <div key={msg.id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-fade-in`}>
                    <div className="flex items-center gap-2 mb-1 px-2">
                       {!isMe && <span className="text-[9px] font-black text-orange-600 uppercase tracking-tight">@{msg.sender_name}</span>}
                       <span className="text-[8px] font-bold text-slate-400">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className={`px-5 py-3 rounded-3xl text-sm font-medium shadow-sm max-w-[80%] ${isMe ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-white dark:bg-black text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-white/5 rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
            
            <form onSubmit={handleSendMessage} className="p-6 bg-slate-50 dark:bg-black border-t border-slate-100 dark:border-white/5 flex gap-3">
              <input 
                type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
                placeholder={userProfile ? "Say something to the lounge..." : "Authenticate to chat"}
                disabled={!userProfile || isSending}
                className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-orange-600 shadow-inner"
              />
              <button 
                type="submit" disabled={!userProfile || isSending || !inputText.trim()}
                className="bg-orange-600 hover:bg-orange-700 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-600/20 active:scale-90 transition-all disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            {isLoading ? (
               Array.from({length: 6}).map((_, i) => <div key={i} className="h-40 rounded-[32px] bg-slate-100 dark:bg-white/5 animate-pulse" />)
            ) : publicProfiles.length === 0 ? (
              <div className="col-span-full py-20 text-center opacity-30 text-[10px] font-black uppercase tracking-widest">Directory is currently vacant.</div>
            ) : publicProfiles.map(profile => (
              <div key={profile.id} className="glass-panel p-6 rounded-[32px] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/40 hover:border-orange-500/50 transition-all group shadow-sm flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-orange-600 font-black text-xl border border-white/5 group-hover:scale-110 transition-transform">
                    {profile.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">@{profile.username}</h4>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{profile.batch || 'Batch TBD'}</p>
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                   <div className="px-3 py-1 bg-orange-600/10 rounded-lg inline-block">
                      <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{profile.program || 'Program TBD'}</span>
                   </div>
                   <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed italic">
                     "{profile.bio || "This Verto prefers the shadows..."}"
                   </p>
                </div>
                <button className="mt-6 w-full py-3 bg-black text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-orange-600 transition-colors border-none opacity-0 group-hover:opacity-100">
                  Wave 
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialHub;

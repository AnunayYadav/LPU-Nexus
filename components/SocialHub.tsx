
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { UserProfile, ChatMessage } from '../types.ts';
import NexusServer from '../services/nexusServer.ts';

type SocialView = 'lounge' | 'dms' | 'groups' | 'directory';

const SocialHub: React.FC<{ userProfile: UserProfile | null }> = ({ userProfile }) => {
  const [activeView, setActiveView] = useState<SocialView>('lounge');
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [publicProfiles, setPublicProfiles] = useState<UserProfile[]>([]);
  
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial Load
  useEffect(() => {
    loadLounge();
    if (userProfile) loadConversations();
  }, [userProfile]);

  // Real-time subscriptions
  useEffect(() => {
    let unsubscribe: () => void = () => {};
    if (activeView === 'lounge') {
      unsubscribe = NexusServer.subscribeToSocialChat((newMsg) => setMessages(prev => [...prev, newMsg]));
    } else if (activeConversation) {
      unsubscribe = NexusServer.subscribeToConversation(activeConversation.id, (newMsg) => setMessages(prev => [...prev, newMsg]));
    }
    return () => unsubscribe();
  }, [activeView, activeConversation]);

  // Selective auto-scroll: only when messages array actually grows
  const prevMsgLength = useRef(messages.length);
  useEffect(() => {
    if (messages.length > prevMsgLength.current) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMsgLength.current = messages.length;
  }, [messages]);

  const loadLounge = async () => {
    setIsLoading(true);
    const msgs = await NexusServer.fetchSocialMessages();
    setMessages(msgs);
    setIsLoading(false);
    const profiles = await NexusServer.fetchPublicProfiles();
    setPublicProfiles(profiles);
  };

  const loadConversations = async () => {
    if (!userProfile) return;
    const convos = await NexusServer.fetchConversations(userProfile.id);
    setConversations(convos);
  };

  const selectConversation = async (convo: any) => {
    setActiveConversation(convo);
    setIsLoading(true);
    const msgs = await NexusServer.fetchMessages(convo.id);
    setMessages(msgs);
    setIsLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !userProfile || isSending) return;
    setIsSending(true);
    try {
      if (activeView === 'lounge') {
        await NexusServer.sendSocialMessage(userProfile.id, userProfile.username || 'Anonymous Verto', inputText);
      } else if (activeConversation) {
        await NexusServer.sendMessage(userProfile.id, activeConversation.id, inputText);
      }
      setInputText('');
    } catch (e) { console.error(e); } finally { setIsSending(false); }
  };

  const handleUserSearch = async (val: string) => {
    setSearchQuery(val);
    if (val.length < 2) { setSearchResults([]); return; }
    const results = await NexusServer.searchProfiles(val);
    setSearchResults(results.filter(r => r.id !== userProfile?.id));
  };

  const startDM = async (otherUser: UserProfile) => {
    if (!userProfile) return;
    const existing = conversations.find(c => !c.is_group && c.name === null); // Simplification
    if (existing) {
      selectConversation(existing);
      setActiveView('dms');
    } else {
      const convo = await NexusServer.createConversation(userProfile.id, null, false, [otherUser.id]);
      if (convo) {
        await loadConversations();
        selectConversation(convo);
        setActiveView('dms');
      }
    }
  };

  const handleCreateGroup = async () => {
    if (!userProfile || !newGroupName.trim() || selectedUsers.length === 0) return;
    const convo = await NexusServer.createConversation(userProfile.id, newGroupName, true, selectedUsers);
    if (convo) {
      await loadConversations();
      selectConversation(convo);
      setActiveView('groups');
      setShowGroupModal(false);
      setNewGroupName('');
      setSelectedUsers([]);
    }
  };

  const copyInvite = () => {
    navigator.clipboard.writeText(`${window.location.origin}`);
    alert("Invitation uplink copied! Share it with your squad.");
  };

  return (
    <div className="flex h-full w-full animate-fade-in bg-white dark:bg-black overflow-hidden border-none shadow-none">
      {/* Navigation Rail - Joined flush to main sidebar */}
      <div className="w-16 md:w-20 bg-slate-50 dark:bg-[#050505] border-r border-slate-200 dark:border-white/5 flex flex-col items-center py-8 space-y-6">
        {[
          { id: 'lounge', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, label: 'Lounge' },
          { id: 'dms', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, label: 'Direct' },
          { id: 'groups', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, label: 'Squads' },
          { id: 'directory', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>, label: 'Find' }
        ].map(item => (
          <button 
            key={item.id} 
            onClick={() => { setActiveView(item.id as SocialView); if (item.id === 'lounge') loadLounge(); }}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${activeView === item.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30 scale-110' : 'text-slate-400 hover:text-orange-500 hover:bg-orange-500/5'}`}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={copyInvite} className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:text-orange-600 transition-all border-none" title="Recruit Verto">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </button>
      </div>

      {/* Middle List Area */}
      {activeView !== 'directory' && activeView !== 'lounge' && (
        <div className="w-64 md:w-80 bg-slate-50 dark:bg-[#080808] border-r border-slate-200 dark:border-white/5 flex flex-col hidden md:flex">
          <div className="p-6 border-b border-slate-200 dark:border-white/5">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">{activeView === 'dms' ? 'Transmissions' : 'Squads'}</h3>
            <button 
              onClick={() => activeView === 'groups' ? setShowGroupModal(true) : setActiveView('directory')}
              className="mt-4 w-full py-2.5 bg-black text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all border-none"
            >
              {activeView === 'groups' ? '+ Deploy Squad' : '+ Encrypted Link'}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
            {conversations.filter(c => activeView === 'groups' ? c.is_group : !c.is_group).map(convo => (
              <button 
                key={convo.id} 
                onClick={() => selectConversation(convo)}
                className={`w-full p-4 rounded-3xl text-left transition-all flex items-center gap-3 ${activeConversation?.id === convo.id ? 'bg-orange-600 text-white shadow-xl' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${activeConversation?.id === convo.id ? 'bg-white/20' : 'bg-black text-orange-500'}`}>
                  {convo.is_group ? (convo.name?.[0]?.toUpperCase() || 'G') : (convo.name?.[0]?.toUpperCase() || 'U')}
                </div>
                <div className="flex-1 truncate">
                  <p className="text-xs font-black uppercase tracking-tight">{convo.name || "Verto Encryption"}</p>
                  <p className={`text-[8px] font-bold uppercase tracking-widest opacity-60 ${activeConversation?.id === convo.id ? 'text-white' : ''}`}>{convo.is_group ? 'Active Squad' : 'Direct Signal'}</p>
                </div>
              </button>
            ))}
            {conversations.length === 0 && (
              <div className="py-10 text-center opacity-20 text-[9px] font-black uppercase tracking-widest">Awaiting Uplink...</div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-black">
        {activeView === 'directory' ? (
          <div className="flex-1 flex flex-col p-8 md:p-12 overflow-y-auto no-scrollbar">
            <header className="mb-12">
               <h2 className="text-3xl font-black tracking-tighter uppercase mb-4 dark:text-white">Verto Directory</h2>
               <div className="relative max-w-xl">
                 <input 
                  type="text" placeholder="Search by username..." value={searchQuery} onChange={(e) => handleUserSearch(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-2xl px-12 py-4 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-orange-600 transition-all shadow-inner"
                 />
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
               </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
              {(searchQuery ? searchResults : publicProfiles).map(profile => (
                <div key={profile.id} className="glass-panel p-6 rounded-[32px] border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#050505] hover:border-orange-500/50 transition-all group flex flex-col relative overflow-hidden">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-orange-600 font-black text-xl border border-white/5 group-hover:scale-110 transition-transform">
                      {profile.username?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight truncate max-w-[120px]">@{profile.username}</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{profile.batch || 'Batch TBD'}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed mb-6 italic">
                    "{profile.bio || "Maintaining radio silence..."}"
                  </p>
                  <button 
                    onClick={() => startDM(profile)}
                    className="mt-auto w-full py-3 bg-black text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-orange-600 transition-all border-none shadow-lg active:scale-95"
                  >
                    Establish Link
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <header className="px-8 py-5 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white dark:bg-black">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-600/10 flex items-center justify-center text-orange-600">
                  {activeView === 'lounge' ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  ) : (
                    <span className="font-black">{activeConversation?.name?.[0]?.toUpperCase() || 'E'}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">{activeView === 'lounge' ? 'The Lounge' : (activeConversation?.name || 'Encrypted Channel')}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Protocol Active</span>
                  </div>
                </div>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar bg-white dark:bg-black" ref={scrollRef}>
              {isLoading ? (
                <div className="flex items-center justify-center h-full opacity-30 text-[10px] font-black uppercase tracking-widest animate-pulse">Synchronizing Buffers...</div>
              ) : messages.map((msg, i) => {
                const isMe = msg.sender_id === userProfile?.id;
                return (
                  <div key={msg.id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-fade-in group`}>
                    <div className="flex items-center gap-2 mb-1.5 px-3">
                       {!isMe && <span className="text-[9px] font-black text-orange-600 uppercase tracking-tight">@{msg.sender_name}</span>}
                       <span className="text-[8px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className={`px-6 py-3.5 rounded-[24px] text-sm font-medium shadow-sm max-w-[85%] md:max-w-[70%] leading-relaxed ${isMe ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-[#111111] text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-white/5 rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
            
            <div className="p-6 bg-white dark:bg-black border-t border-slate-200 dark:border-white/5">
              <form onSubmit={handleSendMessage} className="flex gap-3 bg-slate-50 dark:bg-[#080808] p-2 rounded-[28px] border border-slate-200 dark:border-white/5 focus-within:border-orange-500/50 transition-all shadow-inner">
                <input 
                  type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
                  placeholder={userProfile ? (activeView === 'lounge' ? "Broadcast to the lounge..." : "Transmit data pulse...") : "Authenticate to interact"}
                  disabled={!userProfile || isSending}
                  className="flex-1 bg-transparent border-none px-6 py-4 text-sm font-bold dark:text-white outline-none placeholder-slate-400"
                />
                <button 
                  type="submit" disabled={!userProfile || isSending || !inputText.trim()}
                  className="bg-orange-600 hover:bg-orange-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl shadow-orange-600/20 active:scale-90 transition-all disabled:opacity-50"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </form>
            </div>
          </>
        )}
      </div>

      {/* Group Creation Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
          <div className="bg-white dark:bg-[#0a0a0a] rounded-[48px] w-full max-w-md shadow-2xl border border-white/10 overflow-hidden flex flex-col p-10">
            <header className="mb-8 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white leading-none">Deploy Squad</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-orange-600 mt-2">New Tactical Study Unit</p>
              </div>
              <button onClick={() => setShowGroupModal(false)} className="text-slate-400 hover:text-white border-none bg-transparent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </header>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Squad Designation</label>
                <input 
                  type="text" placeholder="e.g., Section K21-Study" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-black rounded-2xl p-4 text-sm font-bold dark:text-white border-none outline-none focus:ring-2 focus:ring-orange-600 shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Add Vertos</label>
                <div className="max-h-40 overflow-y-auto no-scrollbar space-y-2 p-1">
                  {publicProfiles.map(p => (
                    <button 
                      key={p.id} onClick={() => setSelectedUsers(prev => prev.includes(p.id) ? prev.filter(uid => uid !== p.id) : [...prev, p.id])}
                      className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-all ${selectedUsers.includes(p.id) ? 'bg-orange-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500'}`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-tight">@{p.username}</span>
                      {selectedUsers.includes(p.id) && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3"><polyline points="20 6 9 17 4 12"/></svg>}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleCreateGroup} disabled={!newGroupName.trim() || selectedUsers.length === 0}
                className="w-full bg-orange-600 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 disabled:opacity-50 transition-all border-none"
              >
                Initiate Deployment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialHub;

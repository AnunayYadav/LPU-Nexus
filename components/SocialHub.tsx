
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { UserProfile, ChatMessage, FriendRequest } from '../types.ts';
import NexusServer from '../services/nexusServer.ts';

type SocialView = 'lounge' | 'dms' | 'groups' | 'directory' | 'requests';

const SocialHub: React.FC<{ userProfile: UserProfile | null }> = ({ userProfile }) => {
  const [activeView, setActiveView] = useState<SocialView>('lounge');
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<UserProfile[]>([]);
  
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial Load
  useEffect(() => {
    loadLounge();
    if (userProfile) {
      loadConversations();
      loadFriendData();
    }
  }, [userProfile]);

  // Real-time subscriptions
  useEffect(() => {
    let unsubscribe: () => void = () => {};
    if (activeView === 'lounge') {
      unsubscribe = NexusServer.subscribeToSocialChat((newMsg) => {
        setMessages(prev => {
          if (prev.some(m => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      });
    } else if (activeConversation) {
      unsubscribe = NexusServer.subscribeToConversation(activeConversation.id, (newMsg) => {
        setMessages(prev => {
          if (prev.some(m => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      });
    }
    return () => unsubscribe();
  }, [activeView, activeConversation]);

  const prevMsgLength = useRef(messages.length);
  useEffect(() => {
    if (messages.length > prevMsgLength.current) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMsgLength.current = messages.length;
  }, [messages]);

  const loadLounge = async () => {
    setIsLoading(true);
    try {
      const msgs = await NexusServer.fetchSocialMessages();
      setMessages(msgs);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFriendData = async () => {
    if (!userProfile) return;
    try {
      const [reqs, frnds] = await Promise.all([
        NexusServer.getFriendRequests(userProfile.id),
        NexusServer.getFriends(userProfile.id)
      ]);
      setFriendRequests(reqs);
      setFriends(frnds);
    } catch (e) {
      console.error(e);
    }
  };

  const loadConversations = async () => {
    if (!userProfile) return;
    try {
      const convos = await NexusServer.fetchConversations(userProfile.id);
      setConversations(convos);
    } catch (e) {
      console.error(e);
    }
  };

  const selectConversation = async (convo: any) => {
    setActiveConversation(convo);
    setIsLoading(true);
    try {
      const msgs = await NexusServer.fetchMessages(convo.id);
      setMessages(msgs);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !userProfile || isSending) return;
    setIsSending(true);
    const tempText = inputText;
    setInputText('');
    try {
      if (activeView === 'lounge') {
        await NexusServer.sendSocialMessage(userProfile.id, userProfile.username || 'Anonymous Verto', tempText);
      } else if (activeConversation) {
        await NexusServer.sendMessage(userProfile.id, activeConversation.id, tempText);
      }
    } catch (e) { 
      console.error(e);
      setInputText(tempText);
    } finally { 
      setIsSending(false); 
    }
  };

  const handleUserSearch = async (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) { 
      setSearchResults([]); 
      setIsSearching(false);
      return; 
    }
    setIsSearching(true);
    try {
      const results = await NexusServer.searchProfiles(val);
      setSearchResults(results.filter(r => r.id !== userProfile?.id));
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const sendRequest = async (targetId: string) => {
    if (!userProfile) return;
    try {
      await NexusServer.sendFriendRequest(userProfile.id, targetId);
      loadFriendData();
      alert("Signal transmitted. Awaiting verification.");
    } catch (e) {
      alert("Transmission failed. Verto might already be in your registry.");
    }
  };

  const respondToRequest = async (id: string, status: 'accepted' | 'declined') => {
    try {
      await NexusServer.updateFriendRequest(id, status);
      await loadFriendData();
      await loadConversations();
    } catch (e) {
      console.error(e);
    }
  };

  const startDM = async (otherUser: UserProfile) => {
    if (!userProfile) return;
    
    // Privacy Logic: If private and NOT friends, require request
    const isFriend = friends.some(f => f.id === otherUser.id);
    if (!otherUser.is_public && !isFriend) {
      alert("This channel is encrypted. Send a friend request to unlock direct transmissions.");
      return;
    }

    setIsLoading(true);
    try {
      // Look for existing DM in server
      const existing = await NexusServer.findExistingDM(userProfile.id, otherUser.id);
      if (existing) {
        // We need to inject the display name manually if it's missing from the fresh server lookup
        existing.display_name = otherUser.username || "Verto Peer";
        selectConversation(existing);
        setActiveView('dms');
      } else {
        const convo = await NexusServer.createConversation(userProfile.id, null, false, [otherUser.id]);
        if (convo) {
          await loadConversations();
          convo.display_name = otherUser.username || "Verto Peer";
          selectConversation(convo);
          setActiveView('dms');
        }
      }
    } catch (e) {
      console.error("DM Protocol failure:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!userProfile || !newGroupName.trim() || selectedUsers.length === 0) return;
    setIsLoading(true);
    const convo = await NexusServer.createConversation(userProfile.id, newGroupName, true, selectedUsers);
    if (convo) {
      await loadConversations();
      selectConversation(convo);
      setActiveView('groups');
      setShowGroupModal(false);
      setNewGroupName('');
      setSelectedUsers([]);
    }
    setIsLoading(false);
  };

  const inboundRequests = friendRequests.filter(r => r.receiver_id === userProfile?.id && r.status === 'pending');
  const outboundRequests = friendRequests.filter(r => r.sender_id === userProfile?.id && r.status === 'pending');

  return (
    <div className="flex h-full w-full animate-fade-in bg-white dark:bg-black overflow-hidden border-none shadow-none">
      <style>{`
        @keyframes msgInRight {
          from { opacity: 0; transform: translateX(12px) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes msgInLeft {
          from { opacity: 0; transform: translateX(-12px) scale(0.95); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        .msg-animate-right { animation: msgInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .msg-animate-left { animation: msgInLeft 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
      `}</style>

      {/* Navigation Rail */}
      <div className="w-16 md:w-20 bg-slate-50 dark:bg-[#050505] border-r border-slate-200 dark:border-white/5 flex flex-col items-center py-8 space-y-6">
        {[
          { id: 'lounge', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, label: 'Lounge' },
          { id: 'dms', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, label: 'Direct' },
          { id: 'groups', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, label: 'Squads' },
          { id: 'directory', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>, label: 'Find' },
          { id: 'requests', icon: (
            <div className="relative">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8l2 2-2 2"/><path d="M22 10h-6"/></svg>
              {inboundRequests.length > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-600 rounded-full border-2 border-slate-50 dark:border-black" />}
            </div>
          ), label: 'Signals' }
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
      </div>

      {/* Sidebars for different views */}
      {activeView !== 'directory' && activeView !== 'lounge' && activeView !== 'requests' && (
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
                   {convo.is_group ? (convo.name?.[0]?.toUpperCase() || 'G') : (convo.display_name?.[0]?.toUpperCase() || 'U')}
                </div>
                <div className="flex-1 truncate">
                  <p className="text-xs font-black uppercase tracking-tight">{convo.display_name || "Verto Peer"}</p>
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
                  type="text" placeholder="Scout by username..." value={searchQuery} onChange={(e) => handleUserSearch(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-2xl px-12 py-4 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-orange-600 transition-all shadow-inner"
                 />
                 <div className="absolute left-4 top-1/2 -translate-y-1/2">
                   {isSearching ? (
                     <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                   ) : (
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5 text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                   )}
                 </div>
               </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
              {searchQuery && searchResults.map(profile => {
                const isFriend = friends.some(f => f.id === profile.id);
                const isPending = outboundRequests.some(r => r.receiver_id === profile.id);
                
                return (
                  <div key={profile.id} className="glass-panel p-6 rounded-[32px] border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#050505] hover:border-orange-500/50 transition-all group flex flex-col relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-orange-600 font-black text-xl border border-white/5 group-hover:scale-110 transition-transform">
                        {profile.username?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight truncate max-w-[120px]">@{profile.username}</h4>
                        {profile.is_public ? (
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{profile.batch || 'Batch TBD'}</p>
                        ) : (
                          <div className="flex items-center gap-1">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5 text-slate-500"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Private</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="min-h-[48px] mb-6">
                      {profile.is_public ? (
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed italic">
                          "{profile.bio || "Maintaining radio silence..."}"
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black opacity-30">Details Redacted by Protocol</p>
                      )}
                    </div>

                    <div className="mt-auto flex gap-2">
                      {profile.is_public || isFriend ? (
                        <button 
                          onClick={() => startDM(profile)}
                          className="flex-1 py-3 bg-black text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-orange-600 transition-all border-none shadow-lg active:scale-95"
                        >
                          Message
                        </button>
                      ) : (
                        <button 
                          onClick={() => !isPending && sendRequest(profile.id)}
                          disabled={isPending}
                          className={`flex-1 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all border-none shadow-lg active:scale-95 ${isPending ? 'bg-slate-200 dark:bg-white/5 text-slate-400' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
                        >
                          {isPending ? 'Request Sent' : 'Add Friend'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {!searchQuery && (
                <div className="col-span-full py-20 text-center opacity-30">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16 mx-auto mb-4"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  <p className="text-xs font-black uppercase tracking-widest">Awaiting Username Input...</p>
                </div>
              )}
              {searchQuery && searchResults.length === 0 && !isSearching && (
                <div className="col-span-full py-20 text-center opacity-20 text-xs font-black uppercase tracking-widest">No Vertos found matching criteria.</div>
              )}
            </div>
          </div>
        ) : activeView === 'requests' ? (
          <div className="flex-1 flex flex-col p-8 md:p-12 overflow-y-auto no-scrollbar bg-slate-50 dark:bg-black">
            <header className="mb-10">
              <h2 className="text-3xl font-black tracking-tighter uppercase mb-2 dark:text-white">Active Signals</h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Verify and establish incoming peer connections.</p>
            </header>

            <div className="space-y-12">
              <section>
                <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-orange-600/20" />
                  Inbound Requests ({inboundRequests.length})
                </h3>
                {inboundRequests.length === 0 ? (
                  <div className="p-10 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[40px] text-center opacity-20 text-[10px] font-black uppercase tracking-widest">Zero pending signals.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {inboundRequests.map(req => (
                      <div key={req.id} className="glass-panel p-6 rounded-[32px] bg-white dark:bg-[#050505] border border-slate-200 dark:border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-black text-orange-500 flex items-center justify-center font-black text-xl">
                             {req.sender?.username?.[0]?.toUpperCase()}
                           </div>
                           <div>
                             <p className="text-sm font-black dark:text-white uppercase tracking-tight">@{req.sender?.username}</p>
                             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Awaiting Verification</p>
                           </div>
                         </div>
                         <div className="flex gap-2">
                            <button onClick={() => respondToRequest(req.id, 'declined')} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-red-500 transition-all border-none"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
                            <button onClick={() => respondToRequest(req.id, 'accepted')} className="w-10 h-10 rounded-xl bg-orange-600 text-white shadow-lg shadow-orange-600/20 transition-all border-none"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg></button>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-slate-500/20" />
                  Sent Transmissions ({outboundRequests.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {outboundRequests.map(req => (
                    <div key={req.id} className="p-6 rounded-[32px] border border-slate-100 dark:border-white/5 flex items-center gap-4 opacity-60">
                       <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 flex items-center justify-center font-black">
                         {req.receiver?.username?.[0]?.toUpperCase()}
                       </div>
                       <div className="flex-1">
                          <p className="text-xs font-black dark:text-white uppercase tracking-tight">@{req.receiver?.username}</p>
                          <p className="text-[7px] font-bold text-slate-400 uppercase tracking-[0.2em]">Signal status: Transmitted</p>
                       </div>
                    </div>
                  ))}
                </div>
              </section>
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
                    <span className="font-black">{activeConversation?.display_name?.[0]?.toUpperCase() || 'E'}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">{activeView === 'lounge' ? 'The Lounge' : (activeConversation?.display_name || 'Encrypted Channel')}</h3>
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
                  <div key={msg.id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${isMe ? 'msg-animate-right' : 'msg-animate-left'} group`}>
                    <div className={`flex items-center gap-2 mb-1.5 px-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                       {!isMe && <span className="text-[9px] font-black text-orange-600 uppercase tracking-tight">@{msg.sender_name}</span>}
                       <span className="text-[8px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                    <div className={`relative px-6 py-3.5 rounded-[24px] text-sm font-medium shadow-sm max-w-[85%] md:max-w-[70%] leading-relaxed ${isMe ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-[#111111] text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-white/5 rounded-tl-none'}`}>
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
                  {isSending ? (
                    <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  )}
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
                <p className="text-[10px] font-black uppercase tracking-widest text-orange-600 mt-2">New Tactical Unit</p>
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
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Add Friends</label>
                <div className="max-h-40 overflow-y-auto no-scrollbar space-y-2 p-1">
                  {friends.map(p => (
                    <button 
                      key={p.id} onClick={() => setSelectedUsers(prev => prev.includes(p.id) ? prev.filter(uid => uid !== p.id) : [...prev, p.id])}
                      className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-all ${selectedUsers.includes(p.id) ? 'bg-orange-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500'}`}
                    >
                      <span className="text-[10px] font-black uppercase tracking-tight">@{p.username}</span>
                      {selectedUsers.includes(p.id) && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3"><polyline points="20 6 9 17 4 12"/></svg>}
                    </button>
                  ))}
                  {friends.length === 0 && <p className="text-[9px] text-slate-500 uppercase tracking-widest text-center py-4">No peers verified in registry.</p>}
                </div>
              </div>

              <button 
                onClick={handleCreateGroup} disabled={!newGroupName.trim() || selectedUsers.length === 0 || isLoading}
                className="w-full bg-orange-600 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 disabled:opacity-50 transition-all border-none flex items-center justify-center gap-3"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : 'Initiate Deployment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialHub;

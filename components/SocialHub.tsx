
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage, FriendRequest, MessageReaction } from '../types.ts';
import NexusServer from '../services/nexusServer.ts';

type SocialView = 'lounge' | 'dms' | 'groups' | 'directory';

const EMOJIS = ['❤️', '😂', '😮', '😢', '🔥', '👍', '🙏'];

const filterProfanity = (text: string) => {
  const EXPLICIT = ['fuck', 'shit', 'asshole', 'bitch', 'porn', 'sex', 'bastard', 'cunt', 'dick', 'pussy', 'bc', 'mc'];
  let filtered = text;
  EXPLICIT.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    filtered = filtered.replace(regex, '***');
  });
  return filtered;
};

const ReadReceipt = ({ isRead }: { isRead: boolean }) => (
  <div className={`flex items-center ml-1 ${isRead ? 'text-orange-500' : 'text-white/20'}`}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5">
      <polyline points="20 6 9 17 4 12" />
      {isRead && <polyline points="20 12 11 21 6 16" className="-ml-1" />}
    </svg>
  </div>
);

const SocialHub: React.FC<{ userProfile: UserProfile | null; onUnreadChange?: () => void }> = ({ userProfile, onUnreadChange }) => {
  const [activeView, setActiveView] = useState<SocialView>('lounge');
  const [directorySubView, setDirectorySubView] = useState<'search' | 'requests'>('search');
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [memberReadStatus, setMemberReadStatus] = useState<Record<string, number>>({});
  
  const [inputText, setInputText] = useState('');
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<UserProfile[]>([]);

  // UI States
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [reactionMenuId, setReactionMenuId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentContextRef = useRef<string>('lounge');

  useEffect(() => {
    loadLounge();
    if (userProfile) {
      loadConversations();
      loadFriendData();
    }
  }, [userProfile]);

  useEffect(() => {
    if (userProfile && activeConversation) {
      NexusServer.markConversationAsRead(userProfile.id, activeConversation.id).then(() => {
        setConversations(prev => prev.map(c => c.id === activeConversation.id ? { ...c, unread_count: 0 } : c));
        onUnreadChange?.();
      });
    }
  }, [activeConversation, messages, userProfile]);

  useEffect(() => {
    let unsubscribe: () => void = () => {};
    const target = activeView === 'lounge' ? 'lounge' : activeConversation?.id;
    if (!target) return;

    const handlePayload = (payload: any) => {
      if (currentContextRef.current !== target) {
        if (payload.table === 'messages' && payload.eventType === 'INSERT') {
          loadConversations();
          onUnreadChange?.();
        }
        return;
      }
      if (payload.table === 'messages' || payload.table === 'social_messages') {
        fetchMessagesForContext(target);
      }
      if (payload.table === 'conversation_members' && activeConversation) {
        syncReadStatuses(activeConversation.id);
      }
    };

    if (activeView === 'lounge') unsubscribe = NexusServer.subscribeToSocialChat(handlePayload);
    else if (activeConversation) unsubscribe = NexusServer.subscribeToConversation(activeConversation.id, handlePayload);
    else if (userProfile) unsubscribe = NexusServer.subscribeToUserMessages(userProfile.id, handlePayload);

    return () => unsubscribe();
  }, [activeView, activeConversation, userProfile]);

  /**
   * Fix: Added missing handleViewChange function to switch between lounge, dms, and directory.
   */
  const handleViewChange = (view: SocialView) => {
    setActiveView(view);
    setOpenMenuId(null);
    setReactionMenuId(null);
    if (view === 'lounge') {
      loadLounge();
    } else if (view !== 'directory') {
      setActiveConversation(null);
      if (userProfile) loadConversations();
    }
  };

  const syncReadStatuses = async (cid: string) => {
    const statuses = await NexusServer.fetchMemberReadStatuses(cid);
    const map = statuses.reduce((acc: any, s: any) => ({ ...acc, [s.user_id]: s.last_read_at ? new Date(s.last_read_at).getTime() : 0 }), {});
    setMemberReadStatus(map);
  };

  const fetchMessagesForContext = async (ctx: string) => {
    const msgs = ctx === 'lounge' ? await NexusServer.fetchSocialMessages() : await NexusServer.fetchMessages(ctx);
    if (currentContextRef.current === ctx) setMessages(msgs);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const loadLounge = async () => {
    currentContextRef.current = 'lounge';
    setIsLoading(true);
    await fetchMessagesForContext('lounge');
    setIsLoading(false);
  };

  const loadConversations = async () => {
    if (!userProfile) return;
    const convos = await NexusServer.fetchConversations(userProfile.id);
    setConversations(convos);
  };

  const loadFriendData = async () => {
    if (!userProfile) return;
    const [reqs, frnds] = await Promise.all([NexusServer.getFriendRequests(userProfile.id), NexusServer.getFriends(userProfile.id)]);
    setFriendRequests(reqs);
    setFriends(frnds);
  };

  const selectConversation = async (convo: any) => {
    currentContextRef.current = convo.id;
    setActiveConversation(convo);
    setMessages([]);
    setIsLoading(true);
    await fetchMessagesForContext(convo.id);
    await syncReadStatuses(convo.id);
    setIsLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !userProfile) return;
    const text = activeView === 'lounge' ? filterProfanity(inputText) : inputText;
    const rId = replyTo?.id;
    setInputText('');
    setReplyTo(null);
    try {
      if (activeView === 'lounge') await NexusServer.sendSocialMessage(userProfile.id, userProfile.username || 'User', text);
      else if (activeConversation) await NexusServer.sendMessage(userProfile.id, activeConversation.id, text, rId);
    } catch (err) { alert("Signal blocked."); }
  };

  const handleReaction = async (msgId: string, emoji: string) => {
    if (!userProfile) return;
    await NexusServer.toggleReaction(msgId, userProfile.id, emoji);
    setReactionMenuId(null);
    fetchMessagesForContext(currentContextRef.current);
  };

  const deleteMsg = async (id: string) => {
    if (!userProfile) return;
    if (activeView === 'lounge') await NexusServer.deleteSocialMessage(id, userProfile.id);
    else await NexusServer.deleteMessageEveryone(id, userProfile.id);
    fetchMessagesForContext(currentContextRef.current);
  };

  const handleUserSearch = async (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) { setSearchResults([]); return; }
    setIsSearching(true);
    const results = await NexusServer.searchProfiles(val);
    setSearchResults(results.filter(r => r.id !== userProfile?.id));
    setIsSearching(false);
  };

  const startDM = async (other: UserProfile) => {
    if (!userProfile) return;
    let convo = await NexusServer.findExistingDM(userProfile.id, other.id);
    if (!convo) convo = await NexusServer.createConversation(userProfile.id, null, false, [other.id]);
    await loadConversations();
    setActiveView('dms');
    selectConversation({ ...convo, display_name: other.username });
  };

  return (
    <div className="flex h-full w-full bg-black text-white overflow-hidden animate-fade-in relative">
      <style>{`
        .msg-pop { animation: msgPop 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        @keyframes msgPop { from { opacity: 0; transform: scale(0.9) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .bg-insta-gradient { background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); }
      `}</style>

      {/* Primary Navigation Icon Bar */}
      <div className="w-16 md:w-20 border-r border-white/5 flex flex-col items-center py-10 space-y-8 flex-shrink-0 bg-black">
        {['lounge', 'dms', 'groups', 'directory'].map(v => (
          <button 
            key={v} 
            onClick={() => handleViewChange(v as SocialView)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border-none relative ${activeView === v ? 'bg-orange-600 shadow-[0_0_20px_rgba(234,88,12,0.4)] scale-110' : 'text-white/40 hover:text-orange-500'}`}
          >
            {v === 'lounge' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
            {v === 'dms' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>}
            {v === 'groups' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
            {v === 'directory' && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>}
          </button>
        ))}
      </div>

      {/* Chat Selection List */}
      {(activeView === 'dms' || activeView === 'groups') && (
        <div className="w-72 md:w-96 border-r border-white/5 hidden md:flex flex-col bg-black">
          <div className="p-8 flex items-center justify-between">
            <h3 className="text-2xl font-black uppercase tracking-tighter">{activeView === 'dms' ? 'Direct' : 'Squads'}</h3>
            <button onClick={loadConversations} className="p-2 hover:bg-white/5 rounded-full border-none bg-transparent text-white/40"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg></button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 space-y-1 no-scrollbar">
            {conversations.filter(c => activeView === 'groups' ? c.is_group : !c.is_group).map(convo => (
              <div key={convo.id} className="relative group/chat">
                <button 
                  onClick={() => selectConversation(convo)}
                  className={`w-full p-4 rounded-3xl flex items-center gap-4 transition-all border-none text-left ${activeConversation?.id === convo.id ? 'bg-white/5' : 'hover:bg-white/[0.02]'}`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black bg-gradient-to-br ${activeConversation?.id === convo.id ? 'from-orange-500 to-red-600' : 'from-white/10 to-white/5'} shadow-lg`}>
                    {convo.display_name?.[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <p className="text-sm font-black uppercase truncate">{convo.display_name}</p>
                      {convo.unread_count > 0 && <span className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(234,88,12,0.8)]" />}
                    </div>
                    <p className="text-[10px] font-bold text-white/30 truncate uppercase tracking-widest">{convo.unread_count > 0 ? `${convo.unread_count} New Signals` : 'Active Session'}</p>
                  </div>
                </button>
                <div className={`absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/chat:opacity-100 transition-all ${openMenuId === convo.id ? 'opacity-100 z-50' : ''}`}>
                  <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === convo.id ? null : convo.id); }} className="p-2 text-white/20 hover:text-white border-none bg-transparent">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                  </button>
                  {openMenuId === convo.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-black rounded-2xl border border-white/10 shadow-2xl overflow-hidden py-2 animate-fade-in">
                       <button onClick={() => NexusServer.deleteConversation(convo.id).then(loadConversations)} className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase text-red-500 hover:bg-red-500/10 border-none bg-transparent">Delete Chat</button>
                       <button onClick={() => setOpenMenuId(null)} className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase text-white/40 hover:bg-white/5 border-none bg-transparent">Archive</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col min-w-0 bg-black relative">
        {(activeView === 'lounge' || activeConversation) ? (
          <>
            <header className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-black/80 backdrop-blur-xl z-20">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-insta-gradient p-[2px] shadow-lg">
                  <div className="w-full h-full bg-black rounded-full flex items-center justify-center font-black">
                    {activeView === 'lounge' ? '#' : activeConversation?.display_name?.[0]?.toUpperCase()}
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight">{activeView === 'lounge' ? 'Nexus Lounge' : activeConversation?.display_name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Active Connection</span>
                  </div>
                </div>
              </div>
              <button className="p-3 text-white/40 hover:text-white border-none bg-transparent transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 no-scrollbar scroll-smooth">
              {messages.map((msg, i) => {
                const isMe = msg.sender_id === userProfile?.id;
                const isRead = activeView !== 'lounge' && Object.entries(memberReadStatus).some(([uid, time]) => uid !== msg.sender_id && time >= msg.timestamp);
                return (
                  <div key={msg.id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} msg-pop group/msg relative`}>
                    {!isMe && <span className="text-[9px] font-black text-orange-500 uppercase tracking-tighter mb-1.5 ml-1">@{msg.sender_name}</span>}
                    
                    <div className={`flex items-center gap-3 ${isMe ? 'flex-row-reverse' : ''} max-w-[85%] md:max-w-[70%]`}>
                      <div 
                        onContextMenu={(e) => { e.preventDefault(); setReactionMenuId(msg.id!); }}
                        className={`relative px-6 py-4 rounded-[32px] text-sm font-medium shadow-xl transition-all hover:scale-[1.01] ${isMe ? 'bg-orange-600 rounded-tr-none' : 'bg-white/5 rounded-tl-none border border-white/5'}`}
                      >
                        {msg.is_deleted_everyone ? <span className="italic opacity-50">Signal redacted</span> : <span>{msg.text}</span>}
                        {isMe && !msg.is_deleted_everyone && <div className="mt-1 flex justify-end"><ReadReceipt isRead={isRead} /></div>}
                        
                        {msg.reactions && msg.reactions.length > 0 && (
                          <div className={`absolute -bottom-3 ${isMe ? 'right-2' : 'left-2'} flex gap-1 bg-black border border-white/10 rounded-full px-2 py-0.5 shadow-2xl`}>
                            {msg.reactions.map((r, idx) => <span key={idx} className="text-[10px]">{r.emoji}</span>)}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 opacity-0 group-hover/msg:opacity-100 transition-opacity">
                         <button onClick={() => setReplyTo(msg)} className="p-2 text-white/20 hover:text-white border-none bg-transparent" title="Reply"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg></button>
                         {isMe && <button onClick={() => deleteMsg(msg.id!)} className="p-2 text-white/20 hover:text-red-500 border-none bg-transparent" title="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>}
                      </div>
                    </div>

                    {reactionMenuId === msg.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setReactionMenuId(null)} />
                        <div className={`absolute z-50 -top-12 ${isMe ? 'right-0' : 'left-0'} flex gap-2 bg-black border border-white/20 rounded-full px-4 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-fade-in`}>
                          {EMOJIS.map(e => <button key={e} onClick={() => handleReaction(msg.id!, e)} className="text-lg hover:scale-125 transition-transform border-none bg-transparent">{e}</button>)}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <footer className="p-6 md:p-10 border-t border-white/5 bg-black/80 backdrop-blur-xl z-20">
              {replyTo && (
                <div className="mb-4 p-4 bg-white/5 rounded-3xl border-l-4 border-orange-500 flex justify-between items-center animate-fade-in">
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Replying to @{replyTo.sender_name}</p>
                    <p className="text-xs truncate opacity-60">{replyTo.text}</p>
                  </div>
                  <button onClick={() => setReplyTo(null)} className="p-2 text-white/40 hover:text-white border-none bg-transparent"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
                </div>
              )}
              <form onSubmit={handleSendMessage} className="flex gap-4 bg-white/5 p-3 rounded-[40px] border border-white/10 group focus-within:ring-4 focus-within:ring-orange-600/10 transition-all max-w-5xl mx-auto w-full">
                <input 
                  type="text" value={inputText} onChange={e => setInputText(e.target.value)}
                  placeholder="Message Verto..."
                  className="flex-1 bg-transparent border-none px-6 py-4 text-sm font-bold text-white outline-none"
                />
                <button 
                  type="submit" disabled={!inputText.trim()}
                  className="w-14 h-14 bg-orange-600 rounded-full flex items-center justify-center shadow-xl shadow-orange-600/20 active:scale-90 transition-all disabled:opacity-30 border-none"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </form>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center animate-fade-in">
             <div className="w-24 h-24 bg-orange-600/10 rounded-[50px] flex items-center justify-center mb-10 text-orange-600 shadow-[0_32px_64px_rgba(234,88,12,0.1)] border border-orange-600/20"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
             <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Nexus Terminal Ready</h3>
             <p className="text-white/40 text-sm font-medium max-w-xs mx-auto leading-relaxed">Initialize a direct sync or join a squad to begin communication protocol.</p>
             <button onClick={() => setActiveView('directory')} className="mt-12 px-12 py-5 bg-orange-600 rounded-[32px] font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all border-none">Browse Vertos</button>
          </div>
        )}
      </div>

      {/* Directory Modal for User Search */}
      {activeView === 'directory' && (
        <div className="absolute inset-0 z-[100] bg-black animate-fade-in flex flex-col">
          <header className="p-8 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter">Directory</h2>
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mt-2">Connecting the Nexus</p>
            </div>
            <button onClick={() => setActiveView('lounge')} className="p-4 bg-white/5 rounded-full border-none bg-transparent text-white hover:bg-orange-600 transition-all"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
          </header>
          <div className="p-8 max-w-5xl mx-auto w-full flex-1 overflow-y-auto no-scrollbar">
            <div className="relative mb-12 group">
              <input 
                type="text" placeholder="Search Verto handles..." value={searchQuery} onChange={e => handleUserSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full px-14 py-6 text-xl font-black focus:ring-4 focus:ring-orange-600/10 transition-all outline-none"
              />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-orange-500 transition-colors"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map(p => (
                <div key={p.id} className="p-8 rounded-[40px] border border-white/5 bg-black flex flex-col items-center text-center group hover:border-orange-500/30 transition-all">
                  <div className="w-20 h-20 rounded-full bg-insta-gradient p-[3px] mb-6 shadow-xl">
                    <div className="w-full h-full bg-black rounded-full flex items-center justify-center font-black text-3xl">
                      {p.username?.[0]?.toUpperCase()}
                    </div>
                  </div>
                  <h4 className="text-xl font-black uppercase tracking-tighter mb-1">@{p.username}</h4>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-8">{p.program || 'Active Verto'}</p>
                  <button onClick={() => startDM(p)} className="w-full py-4 bg-orange-600 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all border-none">Message</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialHub;

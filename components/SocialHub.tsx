import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage, FriendRequest } from '../types.ts';
import NexusServer from '../services/nexusServer.ts';

type SocialView = 'lounge' | 'dms' | 'groups' | 'directory';

const EXPLICIT_WORDS = ['fuck', 'shit', 'asshole', 'bitch', 'porn', 'sex', 'bastard', 'cunt', 'dick', 'pussy', 'bc', 'mc'];

const filterProfanity = (text: string) => {
  let filtered = text;
  EXPLICIT_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    filtered = filtered.replace(regex, '***');
  });
  return filtered;
};

// Read Receipt Component
const ReadReceipt = ({ isRead }: { isRead: boolean }) => (
  <div className={`flex items-center ml-1 ${isRead ? 'text-orange-500' : 'text-slate-400'}`}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3">
      <polyline points="20 6 9 17 4 12" />
      {isRead && <polyline points="20 12 11 21 6 16" className="-ml-1" />}
    </svg>
  </div>
);

// Skeleton Loader Components
const ConvoSkeleton = () => (
  <div className="w-full p-4 rounded-3xl flex items-center gap-3 bg-slate-50/50 dark:bg-white/[0.02] animate-pulse">
    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/5 shimmer" />
    <div className="flex-1 space-y-2">
      <div className="h-3 w-24 bg-slate-200 dark:bg-white/5 rounded-md shimmer" />
      <div className="h-2 w-12 bg-slate-200 dark:bg-white/5 rounded-md shimmer" />
    </div>
  </div>
);

const MessageSkeleton = ({ isMe }: { isMe: boolean }) => (
  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-pulse w-full`}>
    <div className={`h-2 w-16 bg-slate-100 dark:bg-white/5 rounded mb-2 shimmer ${isMe ? 'mr-1' : 'ml-1'}`} />
    <div className={`h-12 w-2/3 md:w-1/2 bg-slate-100 dark:bg-white/5 rounded-[24px] shimmer ${isMe ? 'rounded-tr-none' : 'rounded-tl-none'}`} />
  </div>
);

const UserCardSkeleton = () => (
  <div className="p-6 rounded-[32px] border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] animate-pulse">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-white/5 shimmer" />
      <div className="space-y-2">
        <div className="h-3 w-20 bg-slate-200 dark:bg-white/5 rounded shimmer" />
        <div className="h-2 w-12 bg-slate-200 dark:bg-white/5 rounded shimmer" />
      </div>
    </div>
    <div className="h-3 w-full bg-slate-200 dark:bg-white/5 rounded mb-6 shimmer" />
    <div className="flex gap-2">
      <div className="h-10 flex-1 bg-slate-200 dark:bg-white/5 rounded-xl shimmer" />
      <div className="h-10 w-12 bg-slate-200 dark:bg-white/5 rounded-xl shimmer" />
    </div>
  </div>
);

const SocialHub: React.FC<{ userProfile: UserProfile | null }> = ({ userProfile }) => {
  const [activeView, setActiveView] = useState<SocialView>('lounge');
  const [directorySubView, setDirectorySubView] = useState<'search' | 'requests'>('search');
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConversation, setActiveConversation] = useState<any | null>(null);
  
  const [messageCache, setMessageCache] = useState<Record<string, ChatMessage[]>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [memberReadStatus, setMemberReadStatus] = useState<Record<string, number>>({});
  
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConvoLoading, setIsConvoLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<UserProfile[]>([]);
  
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial Load
  useEffect(() => {
    loadLounge();
    if (userProfile) {
      loadConversations();
      loadFriendData();
    }
  }, [userProfile]);

  // Mark active conversation as read
  useEffect(() => {
    if (userProfile && activeConversation) {
      NexusServer.markConversationAsRead(userProfile.id, activeConversation.id);
    }
  }, [activeConversation, messages, userProfile]);

  // Real-time subscriptions
  useEffect(() => {
    let unsubscribe: () => void = () => {};
    
    const currentContextId = activeView === 'lounge' ? 'lounge' : activeConversation?.id;

    const handlePayload = (payload: any) => {
      const eventType = payload.eventType;
      const newRecord = payload.new;
      const oldRecord = payload.old;
      
      // Handle message updates
      if (payload.table === 'messages' || payload.table === 'social_messages') {
        if (eventType === 'INSERT') {
          const newMsg: ChatMessage = { 
            id: newRecord.id, 
            role: 'user', 
            text: newRecord.text, 
            timestamp: new Date(newRecord.created_at).getTime(), 
            sender_id: newRecord.sender_id, 
            sender_name: newRecord.sender_name || 'User'
          };
          
          setMessages(prev => {
            // Remove optimistic duplicates: Filter out any temp message with the same text/sender if needed
            // But usually we just filter by ID
            if (prev.some(m => m.id === newMsg.id)) return prev;
            
            // Clean up any "temp-" messages that might be older versions of this real message
            const filtered = prev.filter(m => !(m.id?.startsWith('temp-') && m.text === newMsg.text && m.sender_id === newMsg.sender_id));
            return [...filtered, newMsg].sort((a, b) => a.timestamp - b.timestamp);
          });

          if (currentContextId) {
            setMessageCache(prev => {
              const prevConvoMsgs = prev[currentContextId] || [];
              if (prevConvoMsgs.some(m => m.id === newMsg.id)) return prev;
              const filtered = prevConvoMsgs.filter(m => !(m.id?.startsWith('temp-') && m.text === newMsg.text && m.sender_id === newMsg.sender_id));
              return {
                ...prev,
                [currentContextId]: [...filtered, newMsg].sort((a, b) => a.timestamp - b.timestamp)
              };
            });
          }
        } else if (eventType === 'DELETE') {
          const deletedId = oldRecord?.id || payload.old?.id;
          if (deletedId) {
            setMessages(prev => prev.filter(m => m.id !== deletedId));
            if (currentContextId) {
              setMessageCache(prev => ({
                ...prev,
                [currentContextId]: (prev[currentContextId] || []).filter(m => m.id !== deletedId)
              }));
            }
          }
        } else if (eventType === 'UPDATE') {
          const updatedId = newRecord?.id;
          if (updatedId) {
            const updater = (m: ChatMessage) => m.id === updatedId ? { ...m, text: newRecord.text } : m;
            setMessages(prev => prev.map(updater));
            if (currentContextId) {
              setMessageCache(prev => ({
                ...prev,
                [currentContextId]: (prev[currentContextId] || []).map(updater)
              }));
            }
          }
        }
      }

      // Handle read status updates
      if (payload.table === 'conversation_members' && eventType === 'UPDATE' && activeConversation) {
        NexusServer.fetchMemberReadStatuses(activeConversation.id).then(statuses => {
          const statusMap = statuses.reduce((acc: any, s: any) => ({
            ...acc,
            [s.user_id]: new Date(s.last_read_at).getTime()
          }), {});
          setMemberReadStatus(statusMap);
        });
      }
    };

    if (activeView === 'lounge') {
      unsubscribe = NexusServer.subscribeToSocialChat(handlePayload);
    } else if (activeConversation) {
      unsubscribe = NexusServer.subscribeToConversation(activeConversation.id, handlePayload);
      NexusServer.fetchMemberReadStatuses(activeConversation.id).then(statuses => {
        const statusMap = statuses.reduce((acc: any, s: any) => ({
          ...acc,
          [s.user_id]: new Date(s.last_read_at).getTime()
        }), {});
        setMemberReadStatus(statusMap);
      });
    }
    return () => unsubscribe();
  }, [activeView, activeConversation]);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current;
      scrollRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior
      });
    }
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages]);

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom('auto');
    }
  }, [isLoading, activeView, activeConversation]);

  const handleViewChange = (view: SocialView) => {
    setActiveView(view);
    setEditingMessageId(null);
    if (view === 'lounge') {
      setActiveConversation(null);
      loadLounge();
    } else if (view === 'dms' || view === 'groups') {
      setActiveConversation(null);
      setMessages([]);
    }
  };

  const loadLounge = async () => {
    if (messageCache['lounge']) {
      setMessages(messageCache['lounge']);
      setIsLoading(false);
      NexusServer.fetchSocialMessages().then(msgs => {
        setMessages(msgs);
        setMessageCache(prev => ({ ...prev, lounge: msgs }));
      });
      return;
    }

    setIsLoading(true);
    try {
      const msgs = await NexusServer.fetchSocialMessages();
      setMessages(msgs);
      setMessageCache(prev => ({ ...prev, lounge: msgs }));
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
    setIsConvoLoading(true);
    try {
      const convos = await NexusServer.fetchConversations(userProfile.id);
      setConversations(convos);
      return convos;
    } catch (e) {
      console.error(e);
      return [];
    } finally {
      setIsConvoLoading(false);
    }
  };

  const selectConversation = async (convo: any) => {
    setActiveConversation(convo);
    setEditingMessageId(null);
    
    if (messageCache[convo.id]) {
      setMessages(messageCache[convo.id]);
      setIsLoading(false);
      NexusServer.fetchMessages(convo.id).then(msgs => {
        setMessages(msgs);
        setMessageCache(prev => ({ ...prev, [convo.id]: msgs }));
      });
      return;
    }

    setIsLoading(true);
    try {
      const msgs = await NexusServer.fetchMessages(convo.id);
      setMessages(msgs);
      setMessageCache(prev => ({ ...prev, [convo.id]: msgs }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !userProfile || isSending) return;
    
    const tempText = inputText;
    const filtered = activeView === 'lounge' ? filterProfanity(tempText) : tempText;
    
    // Optimistic Update: Add message to UI immediately
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: ChatMessage = {
      id: tempId,
      role: 'user',
      text: filtered,
      timestamp: Date.now(),
      sender_id: userProfile.id,
      sender_name: userProfile.username || 'User'
    };

    setMessages(prev => [...prev, optimisticMsg]);
    setInputText('');
    
    try {
      if (activeView === 'lounge') {
        await NexusServer.sendSocialMessage(userProfile.id, userProfile.username || 'User', filtered);
      } else if (activeConversation) {
        await NexusServer.sendMessage(userProfile.id, activeConversation.id, filtered);
      }
    } catch (e) { 
      console.error("Failed to send:", e);
      // Remove the optimistic message if it failed
      setMessages(prev => prev.filter(m => m.id !== tempId));
      setInputText(tempText);
      alert("Nexus connection unstable. Message transmission failed.");
    }
  };

  const handleEditMessage = async (msgId: string) => {
    if (!editValue.trim() || !userProfile) return;
    const originalText = messages.find(m => m.id === msgId)?.text;
    const filtered = activeView === 'lounge' ? filterProfanity(editValue) : editValue;
    
    const contextId = activeView === 'lounge' ? 'lounge' : activeConversation?.id;

    const updater = (m: ChatMessage) => m.id === msgId ? { ...m, text: filtered } : m;
    setMessages(prev => prev.map(updater));
    if (contextId) {
      setMessageCache(prev => ({
        ...prev,
        [contextId]: (prev[contextId] || []).map(updater)
      }));
    }

    setEditingMessageId(null);

    try {
      if (activeView === 'lounge') {
        await NexusServer.updateSocialMessage(msgId, userProfile.id, filtered);
      } else {
        await NexusServer.updateMessage(msgId, userProfile.id, filtered);
      }
    } catch (e) {
      const resetter = (m: ChatMessage) => m.id === msgId ? { ...m, text: originalText! } : m;
      if (originalText) {
        setMessages(prev => prev.map(resetter));
        if (contextId) {
          setMessageCache(prev => ({ ...prev, [contextId]: (prev[contextId] || []).map(resetter) }));
        }
      }
      alert("Permission denied or error updating message.");
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (!userProfile || !confirm("Delete this message?")) return;
    
    const originalMessages = [...messages];
    const contextId = activeView === 'lounge' ? 'lounge' : activeConversation?.id;

    setMessages(prev => prev.filter(m => m.id !== msgId));
    if (contextId) {
      setMessageCache(prev => ({
        ...prev,
        [contextId]: (prev[contextId] || []).filter(m => m.id !== msgId)
      }));
    }

    try {
      if (activeView === 'lounge') {
        await NexusServer.deleteSocialMessage(msgId, userProfile.id);
      } else {
        await NexusServer.deleteMessage(msgId, userProfile.id);
      }
    } catch (e) {
      setMessages(originalMessages);
      if (contextId) {
        setMessageCache(prev => ({ ...prev, [contextId]: originalMessages }));
      }
      alert("Could not delete message. You must be the sender.");
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
      alert("Friend request sent.");
    } catch (e) {
      alert("Failed to send request.");
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
    if (!userProfile) { alert("Please sign in."); return; }
    if (otherUser.id === userProfile.id) return;
    setIsLoading(true);
    try {
      let targetConvo = await NexusServer.findExistingDM(userProfile.id, otherUser.id);
      if (!targetConvo) {
        targetConvo = await NexusServer.createConversation(userProfile.id, null, false, [otherUser.id]);
      }
      if (targetConvo) {
        await loadConversations();
        targetConvo.display_name = otherUser.username || "User";
        setActiveView('dms');
        await selectConversation(targetConvo);
      }
    } catch (e: any) {
      alert(`Error starting chat: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!userProfile || !newGroupName.trim() || selectedUsers.length === 0) return;
    setIsLoading(true);
    try {
      const convo = await NexusServer.createConversation(userProfile.id, newGroupName, true, selectedUsers);
      if (convo) {
        await loadConversations();
        setActiveView('groups');
        await selectConversation(convo);
        setShowGroupModal(false);
        setNewGroupName('');
        setSelectedUsers([]);
      }
    } catch (e: any) {
      alert(`Error creating group: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const inboundRequests = friendRequests.filter(r => r.receiver_id === userProfile?.id && r.status === 'pending');

  const conversationListContent = (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-[#080808]">
      <div className="p-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">
          {activeView === 'dms' ? 'Chats' : 'Groups'}
        </h3>
        <button onClick={loadConversations} className="p-1.5 hover:text-orange-500 transition-colors bg-transparent border-none">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
        </button>
      </div>
      <div className="p-4 border-b border-slate-200 dark:border-white/5">
        <button 
          onClick={() => activeView === 'groups' ? setShowGroupModal(true) : setActiveView('directory')}
          className="w-full py-2.5 bg-black text-orange-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all border-none shadow-sm"
        >
          {activeView === 'groups' ? '+ New Group' : '+ Find Friends'}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
        {isConvoLoading ? (
          Array.from({ length: 8 }).map((_, i) => <ConvoSkeleton key={i} />)
        ) : conversations.filter(c => activeView === 'groups' ? c.is_group : !c.is_group).map(convo => (
          <button 
            key={convo.id} 
            onClick={() => selectConversation(convo)}
            className={`w-full p-4 rounded-3xl text-left transition-all flex items-center gap-3 border-none bg-transparent ${activeConversation?.id === convo.id ? 'bg-orange-600 text-white shadow-xl' : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400'}`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${activeConversation?.id === convo.id ? 'bg-white/20' : 'bg-black text-orange-500'}`}>
               {convo.is_group ? (convo.name?.[0]?.toUpperCase() || 'G') : (convo.display_name?.[0]?.toUpperCase() || 'U')}
            </div>
            <div className="flex-1 truncate">
              <p className="text-xs font-black uppercase tracking-tight">{convo.display_name || "User"}</p>
              <p className={`text-[8px] font-bold uppercase tracking-widest opacity-60 ${activeConversation?.id === convo.id ? 'text-white' : ''}`}>{convo.is_group ? 'Squad' : 'Private'}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-full w-full animate-fade-in bg-white dark:bg-black overflow-hidden border-none shadow-none">
      <style>{`
        @keyframes messagePop {
          0% { opacity: 0; transform: translateY(10px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .msg-animate { animation: messagePop 0.3s ease-out forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Side Navigation */}
      <div className="w-16 md:w-20 bg-slate-50 dark:bg-[#050505] border-r border-slate-200 dark:border-white/5 flex flex-col items-center py-8 space-y-6 flex-shrink-0">
        {[
          { id: 'lounge', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, label: 'Lounge' },
          { id: 'dms', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, label: 'Direct' },
          { id: 'groups', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, label: 'Groups' },
          { id: 'directory', icon: (
            <div className="relative">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              {inboundRequests.length > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-600 rounded-full border-2 border-slate-50 dark:border-black" />}
            </div>
          ), label: 'Find' },
        ].map(item => (
          <button 
            key={item.id} 
            onClick={() => handleViewChange(item.id as SocialView)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all bg-transparent border-none ${activeView === item.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30 scale-110' : 'text-slate-400 hover:text-orange-500 hover:bg-orange-500/5'}`}
            title={item.label}
          >
            {item.icon}
          </button>
        ))}
      </div>

      {(activeView === 'dms' || activeView === 'groups') && (
        <div className="w-64 md:w-80 bg-slate-50 dark:bg-[#080808] border-r border-slate-200 dark:border-white/5 flex-col hidden md:flex">
          {conversationListContent}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-black min-w-0">
        {activeView === 'directory' ? (
          <div className="flex-1 flex flex-col p-8 md:p-12 overflow-y-auto no-scrollbar">
            <header className="mb-12">
               <h2 className="text-3xl font-black tracking-tighter uppercase mb-8 dark:text-white">Directory</h2>
               
               {/* Integrated Requests Toggle */}
               <div className="flex items-center gap-3 mb-8 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl w-fit">
                  <button 
                    onClick={() => setDirectorySubView('search')}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${directorySubView === 'search' ? 'bg-white dark:bg-white/10 text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
                  >
                    Find People
                  </button>
                  <button 
                    onClick={() => setDirectorySubView('requests')}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${directorySubView === 'requests' ? 'bg-white dark:bg-white/10 text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
                  >
                    Requests
                    {inboundRequests.length > 0 && <span className="bg-orange-600 text-white px-1.5 py-0.5 rounded-md text-[8px] font-black">{inboundRequests.length}</span>}
                  </button>
               </div>

               {directorySubView === 'search' ? (
                 <div className="relative max-w-xl animate-fade-in">
                   <input 
                    type="text" placeholder="Search by username..." value={searchQuery} onChange={(e) => handleUserSearch(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/5 rounded-2xl px-12 py-4 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-orange-600 transition-all shadow-inner"
                   />
                   <div className="absolute left-4 top-1/2 -translate-y-1/2">
                     {isSearching ? <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5 text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>}
                   </div>
                 </div>
               ) : (
                 <div className="animate-fade-in">
                    <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-3"><span className="w-8 h-px bg-orange-600/20" />Pending Signals</h3>
                    {inboundRequests.length === 0 ? <p className="text-slate-500 text-xs font-bold uppercase opacity-40">No incoming signals detected.</p> : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {inboundRequests.map(req => (
                          <div key={req.id} className="p-6 rounded-[32px] bg-white dark:bg-[#050505] border border-slate-200 dark:border-white/5 flex items-center justify-between shadow-sm">
                             <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-black text-orange-500 flex items-center justify-center font-black text-xl">{req.sender?.username?.[0]?.toUpperCase()}</div>
                               <p className="text-sm font-black dark:text-white uppercase">@{req.sender?.username}</p>
                             </div>
                             <div className="flex gap-2">
                                <button onClick={() => respondToRequest(req.id, 'declined')} className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-red-500 transition-all border-none"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
                                <button onClick={() => respondToRequest(req.id, 'accepted')} className="w-10 h-10 rounded-xl bg-orange-600 text-white shadow-lg shadow-orange-600/20 transition-all border-none"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg></button>
                             </div>
                          </div>
                        ))}
                      </div>
                    )}
                 </div>
               )}
            </header>

            {directorySubView === 'search' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                {isSearching ? (
                  Array.from({ length: 6 }).map((_, i) => <UserCardSkeleton key={i} />)
                ) : searchQuery && searchResults.map(profile => {
                  const isFriend = friends.some(f => f.id === profile.id);
                  const isPending = friendRequests.some(r => r.sender_id === userProfile?.id && r.receiver_id === profile.id && r.status === 'pending');
                  return (
                    <div key={profile.id} className="p-6 rounded-[32px] border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] hover:border-orange-500 transition-all group flex flex-col relative overflow-hidden">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-orange-600 font-black text-xl">{profile.username?.[0]?.toUpperCase()}</div>
                        <div>
                          <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tight truncate">@{profile.username}</h4>
                          {profile.is_public ? <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{profile.batch || 'Verto'}</p> : <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Private</p>}
                        </div>
                      </div>
                      <div className="min-h-[48px] mb-6"><p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed italic">{profile.is_public ? `"${profile.bio || "No bio set."}"` : "Details hidden."}</p></div>
                      <div className="mt-auto flex gap-2">
                        <button onClick={() => startDM(profile)} className="flex-1 py-3 bg-black text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-orange-600 transition-all border-none shadow-lg active:scale-95">Chat</button>
                        {!isFriend && !isPending && <button onClick={() => sendRequest(profile.id)} className="px-4 py-3 bg-orange-600/10 text-orange-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all border-none">Add</button>}
                        {isPending && <span className="px-4 py-3 bg-slate-100 dark:bg-white/5 text-slate-400 rounded-xl font-black text-[9px] uppercase tracking-widest">Sent</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (activeView === 'lounge' || activeConversation) ? (
          <div className="flex-1 flex flex-row min-h-0 bg-white dark:bg-black">
            {/* Chat Column */}
            <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200 dark:border-white/5">
              <header className="px-8 py-5 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white dark:bg-black flex-shrink-0">
                <div className="flex items-center gap-4">
                  {(activeView === 'dms' || activeView === 'groups') && (
                    <button onClick={() => setActiveConversation(null)} className="md:hidden p-2 -ml-2 text-slate-500 hover:text-orange-600 border-none bg-transparent transition-colors">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    </button>
                  )}
                  <div className="w-10 h-10 rounded-xl bg-orange-600/10 flex items-center justify-center text-orange-600 font-black">
                    {activeView === 'lounge' ? '#' : (activeConversation?.display_name?.[0]?.toUpperCase() || 'C')}
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest dark:text-white">{activeView === 'lounge' ? 'Lounge' : (activeConversation?.display_name || 'Chat')}</h3>
                    <div className="flex items-center gap-1.5"><span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" /><span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Live Now</span></div>
                  </div>
                </div>
              </header>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 no-scrollbar bg-white dark:bg-black scroll-smooth">
                {isLoading ? (
                  <div className="space-y-8">
                    <MessageSkeleton isMe={false} />
                    <MessageSkeleton isMe={true} />
                    <MessageSkeleton isMe={false} />
                    <MessageSkeleton isMe={false} />
                    <MessageSkeleton isMe={true} />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-20 text-center py-10"><p className="text-[10px] font-black uppercase tracking-widest">No messages yet.</p></div>
                ) : messages.map((msg, i) => {
                  const isMe = msg.sender_id === userProfile?.id;
                  const isEditing = editingMessageId === msg.id;
                  
                  // Read status logic: Message is read if any participant (besides sender) has a last_read_at >= msg timestamp
                  const isRead = activeView !== 'lounge' && Object.entries(memberReadStatus).some(([uid, time]) => 
                    uid !== msg.sender_id && time >= msg.timestamp
                  );

                  return (
                    <div key={msg.id || `temp-${i}`} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} msg-animate group`}>
                      <div className={`flex items-center gap-2 mb-1.5 px-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                         {!isMe && <span className="text-[9px] font-black text-orange-600 uppercase tracking-tight">@{msg.sender_name}</span>}
                         <span className="text-[8px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </span>
                      </div>
                      <div className={`flex items-center gap-2 ${isMe ? 'flex-row-reverse' : ''} max-w-[85%] lg:max-w-[70%]`}>
                        <div className={`relative px-5 py-3 rounded-[24px] text-sm font-medium shadow-sm transition-all ${isMe ? 'bg-orange-600 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-[#111111] text-slate-800 dark:text-slate-200 border border-transparent dark:border-white/5 rounded-tl-none'} ${msg.id?.startsWith('temp-') ? 'opacity-70 italic' : ''}`}>
                          {isEditing ? (
                            <div className="flex flex-col gap-2 min-w-[200px]">
                              <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-full bg-black/20 text-white border-none rounded-lg p-2 text-xs outline-none resize-none" rows={2} autoFocus />
                              <div className="flex justify-end gap-2">
                                <button onClick={() => setEditingMessageId(null)} className="text-[8px] uppercase font-black opacity-60 border-none bg-transparent text-white p-0">Cancel</button>
                                <button onClick={() => handleEditMessage(msg.id!)} className="text-[8px] uppercase font-black border-none bg-transparent text-white p-0">Update</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col">
                              <span>{msg.text}</span>
                              {isMe && activeView !== 'lounge' && (
                                <div className="self-end -mb-1 mt-1">
                                  <ReadReceipt isRead={isRead} />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {isMe && !isEditing && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button onClick={() => { setEditingMessageId(msg.id!); setEditValue(msg.text); }} className="p-1 text-slate-400 hover:text-orange-500 border-none bg-transparent transition-colors">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button onClick={() => handleDeleteMessage(msg.id!)} className="p-1 text-slate-400 hover:text-red-500 border-none bg-transparent transition-colors">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="p-6 bg-white dark:bg-black border-t border-slate-200 dark:border-white/5 flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-3 bg-slate-50 dark:bg-[#080808] p-2 rounded-[28px] border border-slate-200 dark:border-white/5 shadow-inner max-w-4xl mx-auto w-full">
                  <input 
                    type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
                    placeholder={userProfile ? "Type a message..." : "Sign in to chat"} disabled={!userProfile}
                    className="flex-1 bg-transparent border-none px-6 py-4 text-sm font-bold dark:text-white outline-none"
                  />
                  <button 
                    type="submit" disabled={!userProfile || !inputText.trim()}
                    className="bg-orange-600 hover:bg-orange-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all disabled:opacity-50 border-none"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </form>
              </div>
            </div>

            {/* Simple Sidebar (Visible on Lounge Only) */}
            {activeView === 'lounge' && (
              <div className="hidden lg:flex w-[260px] flex-col bg-slate-50 dark:bg-[#050505] p-8 border-l border-slate-200 dark:border-white/5 overflow-y-auto no-scrollbar">
                <header className="mb-8">
                  <h3 className="text-xl font-black tracking-tighter uppercase dark:text-white leading-none">Lounge</h3>
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-2">Guidelines</p>
                </header>

                <div className="relative p-7 rounded-[40px] shadow-2xl bg-black text-white overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600 opacity-20 blur-[50px] rounded-full -mr-16 -mt-16 group-hover:opacity-40 transition-opacity" />
                  
                  <ul className="relative z-10 space-y-5">
                    {[
                      "Be respectful to all fellow students.",
                      "Avoid sharing personal sensitive data.",
                      "Keep discussions helpful and positive.",
                      "Do not post spam or advertisements.",
                      "Only you can edit your own messages."
                    ].map((text, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="w-1 h-1 bg-orange-500 rounded-full mt-2.5 flex-shrink-0" />
                        <p className="text-[11px] font-bold leading-relaxed text-slate-300 uppercase tracking-tight">{text}</p>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center relative z-10">
                    <span className="text-[8px] font-black uppercase opacity-40">System Active</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 text-orange-600"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  </div>
                </div>

                <div className="mt-auto pt-8">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center opacity-50">LPU-Nexus v1.4</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="md:hidden h-full">{conversationListContent}</div>
            <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-12 bg-white dark:bg-black animate-fade-in">
               <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-[40px] flex items-center justify-center mb-8 text-slate-200 dark:text-slate-800"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-10 h-10"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
               <h3 className="text-xl font-black uppercase tracking-tight dark:text-white mb-2">Select a Conversation</h3>
               <button onClick={() => setActiveView('directory')} className="mt-8 px-8 py-3 bg-black text-orange-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all border-none">Browse People</button>
            </div>
          </div>
        )}
      </div>

      {/* Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-[#0a0a0a] rounded-[48px] w-full max-w-md shadow-2xl border border-white/10 p-10 flex flex-col">
            <header className="mb-8 flex justify-between items-center">
              <h3 className="text-2xl font-black uppercase tracking-tighter dark:text-white">Create Group</h3>
              <button onClick={() => setShowGroupModal(false)} className="text-slate-400 hover:text-white border-none bg-transparent p-0"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            </header>
            <div className="space-y-6">
              <input type="text" placeholder="Group Name..." value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} className="w-full bg-slate-100 dark:bg-black rounded-2xl p-4 text-sm font-bold dark:text-white border-none outline-none focus:ring-2 focus:ring-orange-600" />
              <div className="max-h-40 overflow-y-auto no-scrollbar space-y-2 p-1">
                {friends.map(p => (
                  <button key={p.id} onClick={() => setSelectedUsers(prev => prev.includes(p.id) ? prev.filter(uid => uid !== p.id) : [...prev, p.id])} className={`w-full p-3 rounded-xl flex items-center justify-between transition-all border-none ${selectedUsers.includes(p.id) ? 'bg-orange-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500'}`}>
                    <span className="text-[10px] font-black uppercase">@{p.username}</span>
                    {selectedUsers.includes(p.id) && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3"><polyline points="20 6 9 17 4 12"/></svg>}
                  </button>
                ))}
              </div>
              <button onClick={handleCreateGroup} disabled={!newGroupName.trim() || selectedUsers.length === 0 || isLoading} className="w-full bg-orange-600 text-white py-5 rounded-[24px] font-black text-xs uppercase shadow-2xl active:scale-95 disabled:opacity-50 border-none transition-all">Create Group</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialHub;
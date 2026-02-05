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
  <div className={`flex items-center ml-1 ${isRead ? 'text-orange-500' : 'text-white/20'}`}>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3">
      <polyline points="20 6 9 17 4 12" />
      {isRead && <polyline points="20 12 11 21 6 16" className="-ml-1" />}
    </svg>
  </div>
);

// Skeleton Loader Components
const ConvoSkeleton = () => (
  <div className="w-full p-4 rounded-3xl flex items-center gap-3 bg-slate-50/50 dark:bg-white/[0.01] animate-pulse">
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
  <div className="p-6 rounded-[32px] border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] animate-pulse">
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

const SocialHub: React.FC<{ userProfile: UserProfile | null; onUnreadChange?: () => void }> = ({ userProfile, onUnreadChange }) => {
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

  // Menu States
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportData, setReportData] = useState<{ type: 'user' | 'message' | 'group', id: string } | null>(null);
  const [reportReason, setReportReason] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentContextRef = useRef<string>('lounge');

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
      NexusServer.markConversationAsRead(userProfile.id, activeConversation.id).then(() => {
        setConversations(prev => prev.map(c => c.id === activeConversation.id ? { ...c, unread_count: 0 } : c));
        onUnreadChange?.();
      });
    }
  }, [activeConversation, messages, userProfile, onUnreadChange]);

  // Real-time subscriptions
  useEffect(() => {
    let unsubscribe: () => void = () => {};
    
    const targetContextId = activeView === 'lounge' ? 'lounge' : activeConversation?.id;
    if (!targetContextId) return;

    const handlePayload = (payload: any) => {
      if (currentContextRef.current !== targetContextId) {
        if (payload.table === 'messages' && payload.eventType === 'INSERT') {
          loadConversations();
          onUnreadChange?.();
        }
        return;
      }

      const eventType = payload.eventType;
      const newRecord = payload.new;
      const oldRecord = payload.old;
      
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
            const isOptimisticReplaced = prev.some(m => m.id?.startsWith('temp-') && m.text === newMsg.text && m.sender_id === newMsg.sender_id);
            if (isOptimisticReplaced) {
              return prev.map(m => (m.id?.startsWith('temp-') && m.text === newMsg.text && m.sender_id === newMsg.sender_id) ? newMsg : m);
            }
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg].sort((a, b) => a.timestamp - b.timestamp);
          });

          setMessageCache(prev => {
            const currentMsgs = prev[targetContextId] || [];
            const isOptimisticReplaced = currentMsgs.some(m => m.id?.startsWith('temp-') && m.text === newMsg.text && m.sender_id === newMsg.sender_id);
            let updatedMsgs;
            if (isOptimisticReplaced) {
              updatedMsgs = currentMsgs.map(m => (m.id?.startsWith('temp-') && m.text === newMsg.text && m.sender_id === newMsg.sender_id) ? newMsg : m);
            } else if (currentMsgs.some(m => m.id === newMsg.id)) {
              return prev;
            } else {
              updatedMsgs = [...currentMsgs, newMsg].sort((a, b) => a.timestamp - b.timestamp);
            }
            return { ...prev, [targetContextId]: updatedMsgs };
          });
        } else if (eventType === 'DELETE') {
          const deletedId = oldRecord?.id || payload.old?.id;
          if (deletedId) {
            setMessages(prev => prev.filter(m => m.id !== deletedId));
            setMessageCache(prev => ({
              ...prev,
              [targetContextId]: (prev[targetContextId] || []).filter(m => m.id !== deletedId)
            }));
          }
        } else if (eventType === 'UPDATE') {
          const updatedId = newRecord?.id;
          if (updatedId) {
            const updater = (m: ChatMessage) => m.id === updatedId ? { ...m, text: newRecord.text } : m;
            setMessages(prev => prev.map(updater));
            setMessageCache(prev => ({
              ...prev,
              [targetContextId]: (prev[targetContextId] || []).map(updater)
            }));
          }
        }
      }

      if (payload.table === 'conversation_members' && activeConversation) {
        NexusServer.fetchMemberReadStatuses(activeConversation.id).then(statuses => {
          if (currentContextRef.current !== activeConversation.id) return;
          const statusMap = statuses.reduce((acc: any, s: any) => ({
            ...acc,
            [s.user_id]: s.last_read_at ? new Date(s.last_read_at).getTime() : 0
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
        if (currentContextRef.current !== activeConversation.id) return;
        const statusMap = statuses.reduce((acc: any, s: any) => ({
          ...acc,
          [s.user_id]: s.last_read_at ? new Date(s.last_read_at).getTime() : 0
        }), {});
        setMemberReadStatus(statusMap);
      });
    } else if (userProfile) {
      unsubscribe = NexusServer.subscribeToUserMessages(userProfile.id, handlePayload);
    }
    return () => unsubscribe();
  }, [activeView, activeConversation, userProfile]);

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
  }, [messages.length]);

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom('auto');
    }
  }, [isLoading, activeView, activeConversation]);

  const handleViewChange = (view: SocialView) => {
    setActiveView(view);
    setEditingMessageId(null);
    setOpenMenuId(null);
    setMessages([]); 
    
    if (view === 'lounge') {
      currentContextRef.current = 'lounge';
      setActiveConversation(null);
      loadLounge();
    } else if (view === 'dms' || view === 'groups') {
      currentContextRef.current = ''; 
      setActiveConversation(null);
    } else if (view === 'directory') {
      setDirectorySubView('search');
    }
  };

  const loadLounge = async () => {
    const contextId = 'lounge';
    currentContextRef.current = contextId;

    if (messageCache[contextId]) {
      setMessages(messageCache[contextId]);
      setIsLoading(false);
      NexusServer.fetchSocialMessages().then(msgs => {
        if (currentContextRef.current === contextId) {
          setMessages(msgs);
          setMessageCache(prev => ({ ...prev, [contextId]: msgs }));
        }
      });
      return;
    }

    setIsLoading(true);
    try {
      const msgs = await NexusServer.fetchSocialMessages();
      if (currentContextRef.current === contextId) {
        setMessages(msgs);
        setMessageCache(prev => ({ ...prev, [contextId]: msgs }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (currentContextRef.current === contextId) setIsLoading(false);
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
    const contextId = convo.id;
    currentContextRef.current = contextId;
    setActiveConversation(convo);
    setEditingMessageId(null);
    setOpenMenuId(null);
    setShowHeaderMenu(false);
    setMessages([]); 

    if (messageCache[contextId]) {
      setMessages(messageCache[contextId]);
      setIsLoading(false);
      NexusServer.fetchMessages(contextId).then(msgs => {
        if (currentContextRef.current === contextId) {
          setMessages(msgs);
          setMessageCache(prev => ({ ...prev, [contextId]: msgs }));
        }
      });
      return;
    }

    setIsLoading(true);
    try {
      const msgs = await NexusServer.fetchMessages(contextId);
      if (currentContextRef.current === contextId) {
        setMessages(msgs);
        setMessageCache(prev => ({ ...prev, [contextId]: msgs }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      if (currentContextRef.current === contextId) setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !userProfile || isSending) return;
    
    const targetContextId = activeView === 'lounge' ? 'lounge' : activeConversation?.id;
    if (!targetContextId) return;

    const tempText = inputText;
    const filtered = activeView === 'lounge' ? filterProfanity(tempText) : tempText;
    
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
      setMessages(prev => prev.filter(m => m.id !== tempId));
      setInputText(tempText);
      alert("Message failed to send.");
    }
  };

  const handleEditMessage = async (msgId: string) => {
    if (!editValue.trim() || !userProfile) return;
    const contextId = activeView === 'lounge' ? 'lounge' : activeConversation?.id;
    if (!contextId) return;

    const originalText = messages.find(m => m.id === msgId)?.text;
    const filtered = activeView === 'lounge' ? filterProfanity(editValue) : editValue;
    
    const updater = (m: ChatMessage) => m.id === msgId ? { ...m, text: filtered } : m;
    setMessages(prev => prev.map(updater));
    setMessageCache(prev => ({
      ...prev,
      [contextId]: (prev[contextId] || []).map(updater)
    }));

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
        setMessageCache(prev => ({ ...prev, [contextId]: (prev[contextId] || []).map(resetter) }));
      }
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (!userProfile || !confirm("Delete this message?")) return;
    
    const contextId = activeView === 'lounge' ? 'lounge' : activeConversation?.id;
    if (!contextId) return;

    const originalMessages = [...messages];
    setMessages(prev => prev.filter(m => m.id !== msgId));
    setMessageCache(prev => ({
      ...prev,
      [contextId]: (prev[contextId] || []).filter(m => m.id !== msgId)
    }));

    try {
      if (activeView === 'lounge') {
        await NexusServer.deleteSocialMessage(msgId, userProfile.id);
      } else {
        await NexusServer.deleteMessage(msgId, userProfile.id);
      }
    } catch (e) {
      setMessages(originalMessages);
      setMessageCache(prev => ({ ...prev, [contextId]: originalMessages }));
    }
  };

  // Advanced Messaging Actions
  const deleteChat = async (convoId: string) => {
    if (!confirm("Permanently delete this chat history?")) return;
    try {
      await NexusServer.deleteConversation(convoId);
      if (activeConversation?.id === convoId) setActiveConversation(null);
      loadConversations();
    } catch (e) { alert("Action restricted."); }
  };

  const leaveGroup = async (convoId: string) => {
    if (!userProfile || !confirm("Leave this squad?")) return;
    try {
      await NexusServer.leaveGroup(userProfile.id, convoId);
      if (activeConversation?.id === convoId) setActiveConversation(null);
      loadConversations();
    } catch (e) { alert("Failed to leave group."); }
  };

  const report = async (type: 'user' | 'message' | 'group', id: string) => {
    setReportData({ type, id });
    setShowReportModal(true);
  };

  const submitReport = async () => {
    if (!userProfile || !reportData || !reportReason.trim()) return;
    try {
      await NexusServer.reportContent(userProfile.id, reportData.type, reportData.id, reportReason);
      alert("Report submitted. Community moderators will review this.");
      setShowReportModal(false);
      setReportReason('');
    } catch (e) { alert("Report failed."); }
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
      alert("Request sent.");
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
    if (!userProfile) { alert("Please sign in first."); return; }
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
      alert(`Failed to start chat: ${e.message}`);
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
      alert(`Failed to create group: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const inboundRequests = friendRequests.filter(r => r.receiver_id === userProfile?.id && r.status === 'pending');
  const dmUnreadTotal = conversations.filter(c => !c.is_group).reduce((acc, c) => acc + (c.unread_count || 0), 0);
  const groupUnreadTotal = conversations.filter(c => c.is_group).reduce((acc, c) => acc + (c.unread_count || 0), 0);

  const conversationListContent = (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-black">
      <div className="p-6 md:p-8 flex items-center justify-between">
        <h3 className="text-xl font-black uppercase tracking-tighter text-slate-800 dark:text-white">
          {activeView === 'dms' ? 'Directs' : 'Squads'}
        </h3>
        <div className="flex gap-2">
           <button onClick={loadConversations} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors bg-transparent border-none">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          </button>
          {activeView === 'groups' && (
            <button onClick={() => setShowGroupModal(true)} className="p-2 bg-orange-600/10 text-orange-600 rounded-full hover:bg-orange-600 hover:text-white transition-all border-none">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 space-y-1 no-scrollbar">
        {isConvoLoading ? (
          Array.from({ length: 8 }).map((_, i) => <ConvoSkeleton key={i} />)
        ) : conversations.filter(c => activeView === 'groups' ? c.is_group : !c.is_group).map(convo => (
          <div key={convo.id} className="relative group/convo">
            <button 
              onClick={() => selectConversation(convo)}
              className={`w-full p-4 rounded-[24px] text-left transition-all flex items-center gap-4 border-none bg-transparent relative ${activeConversation?.id === convo.id ? 'bg-slate-100 dark:bg-white/[0.05]' : 'hover:bg-slate-50 dark:hover:bg-white/[0.02]'}`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black flex-shrink-0 bg-gradient-to-tr ${activeConversation?.id === convo.id ? 'from-orange-500 to-red-600' : 'from-slate-200 to-slate-300 dark:from-white/10 dark:to-white/5'} text-white shadow-sm overflow-hidden`}>
                {convo.display_name?.[0]?.toUpperCase() || 'V'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black dark:text-white truncate uppercase tracking-tight">{convo.display_name || "User"}</p>
                <p className="text-[10px] font-bold text-slate-400 truncate tracking-wide">
                  {convo.unread_count > 0 ? `${convo.unread_count} new messages` : 'Tap to open chat'}
                </p>
              </div>
              {!!convo.unread_count && convo.unread_count > 0 && activeConversation?.id !== convo.id && (
                <span className="w-5 h-5 bg-orange-600 text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-black">
                  {convo.unread_count > 9 ? '9+' : convo.unread_count}
                </span>
              )}
            </button>
            
            <div className={`absolute right-4 top-1/2 -translate-y-1/2 flex transition-opacity duration-200 ${openMenuId === convo.id ? 'opacity-100 z-50' : 'opacity-0 group-hover/convo:opacity-100'}`}>
              <div className="relative">
                <button 
                  onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === convo.id ? null : convo.id); }}
                  className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white border-none bg-transparent"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                </button>
                {openMenuId === convo.id && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-black rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] border border-slate-100 dark:border-white/10 z-50 overflow-hidden animate-fade-in py-2">
                       <button onClick={(e) => { e.stopPropagation(); deleteChat(convo.id); setOpenMenuId(null); }} className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors border-none bg-transparent">Delete Chat</button>
                       <button onClick={(e) => { e.stopPropagation(); report(convo.is_group ? 'group' : 'user', convo.id); setOpenMenuId(null); }} className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-none bg-transparent">Report</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-full w-full animate-fade-in bg-white dark:bg-black overflow-hidden">
      <style>{`
        @keyframes messagePop {
          0% { opacity: 0; transform: translateY(10px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .msg-animate { animation: messagePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .chat-gradient {
          background: #000;
          position: relative;
          overflow: hidden;
        }
        .chat-gradient::before {
          content: "";
          position: absolute;
          top: -128px;
          right: -128px;
          width: 512px;
          height: 512px;
          background: radial-gradient(circle, rgba(234, 88, 12, 0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

      {/* Side Navigation - App Icon Bar */}
      <div className="w-16 md:w-20 bg-white dark:bg-black border-r border-slate-100 dark:border-white/5 flex flex-col items-center py-10 space-y-8 flex-shrink-0">
        {[
          { id: 'lounge', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, label: 'Lounge', unread: 0 },
          { id: 'dms', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, label: 'Directs', unread: dmUnreadTotal },
          { id: 'groups', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, label: 'Squads', unread: groupUnreadTotal },
          { id: 'directory', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>, label: 'People', unread: inboundRequests.length },
        ].map(item => (
          <button 
            key={item.id} 
            onClick={() => handleViewChange(item.id as SocialView)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border-none relative ${
              activeView === item.id 
                ? 'bg-orange-600 text-white shadow-xl scale-110' 
                : 'bg-transparent text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-white/5'
            }`}
            title={item.label}
          >
            {item.icon}
            {!!item.unread && item.unread > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-orange-600 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-black shadow-lg animate-fade-in">
                {item.unread > 9 ? '9+' : item.unread}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Second Column - Chat List */}
      {(activeView === 'dms' || activeView === 'groups') && (
        <div className="w-72 md:w-96 bg-white dark:bg-black border-r border-slate-100 dark:border-white/5 flex-col hidden md:flex">
          {conversationListContent}
        </div>
      )}

      {/* Main Column - Messages */}
      <div className="flex-1 flex flex-col bg-white dark:bg-black min-w-0 relative">
        {activeView === 'directory' ? (
          <div className="flex-1 flex flex-col p-8 md:p-16 overflow-y-auto no-scrollbar chat-gradient">
            <header className="mb-16 flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
               <div>
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase dark:text-white">Directory</h2>
                  <p className="text-[10px] font-bold text-orange-600 uppercase tracking-[0.4em] mt-2">Connecting the Nexus</p>
               </div>
               
               <div className="flex items-center gap-3">
                  {directorySubView === 'search' && (
                    <div className="relative w-full md:w-96 animate-fade-in group">
                      <input 
                        type="text" placeholder="Search handles..." value={searchQuery} onChange={(e) => handleUserSearch(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 rounded-full px-12 py-4 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-orange-600/10 transition-all shadow-inner"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        {isSearching ? <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5 text-slate-400 group-focus-within:text-orange-600"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>}
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => setDirectorySubView(directorySubView === 'requests' ? 'search' : 'requests')}
                    className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${directorySubView === 'requests' ? 'bg-orange-600 text-white shadow-xl' : 'bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-orange-600 border-none'}`}
                    title="Requests"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    {inboundRequests.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white rounded-full flex items-center justify-center text-[8px] font-black border-2 border-white dark:border-black animate-bounce">{inboundRequests.length}</span>
                    )}
                  </button>
               </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-24 relative z-10">
              {directorySubView === 'search' ? (
                isSearching ? (
                  Array.from({ length: 6 }).map((_, i) => <UserCardSkeleton key={i} />)
                ) : (searchQuery || searchResults.length > 0) ? searchResults.map(profile => {
                  const isFriend = friends.some(f => f.id === profile.id);
                  const isPending = friendRequests.some(r => r.sender_id === userProfile?.id && r.receiver_id === profile.id && r.status === 'pending');
                  return (
                    <div key={profile.id} className="p-8 rounded-[40px] border border-slate-100 dark:border-white/5 bg-white/80 dark:bg-white/[0.01] backdrop-blur-xl hover:border-orange-500/50 transition-all group flex flex-col relative overflow-hidden shadow-sm hover:shadow-2xl">
                      <div className="flex items-center gap-5 mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-500 to-red-600 text-white flex items-center justify-center font-black text-2xl shadow-xl">{profile.username?.[0]?.toUpperCase()}</div>
                        <div className="min-w-0">
                          <h4 className="font-black text-slate-800 dark:text-white uppercase tracking-tighter truncate text-lg">@{profile.username}</h4>
                          <p className="text-[10px] font-black text-orange-600/60 uppercase tracking-widest">{profile.program || 'Student'}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-3 leading-relaxed mb-8 h-12 italic opacity-80">
                        {profile.is_public ? (profile.bio || "Searching for connections...") : "Private Profile"}
                      </p>
                      <div className="mt-auto flex gap-2">
                        <button onClick={() => startDM(profile)} className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all border-none shadow-lg shadow-orange-600/20">Chat</button>
                        {!isFriend && !isPending && <button onClick={() => sendRequest(profile.id)} className="px-6 py-4 bg-white dark:bg-black text-slate-600 dark:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest border border-slate-100 dark:border-white/10 hover:border-orange-500 transition-all shadow-sm">Add</button>}
                        {isPending && <span className="px-6 py-4 bg-orange-600/5 text-orange-600/60 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center">Pending</span>}
                      </div>
                    </div>
                  );
                }) : (
                  <div className="col-span-full py-32 text-center opacity-40">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-24 h-24 mx-auto mb-8 text-orange-600"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <p className="text-sm font-black uppercase tracking-[0.4em]">Initialize Verto Search</p>
                  </div>
                )
              ) : (
                <div className="col-span-full animate-fade-in max-w-5xl">
                   <h3 className="text-xs font-black text-orange-600 uppercase tracking-[0.4em] mb-12 flex items-center gap-4"><span className="w-12 h-px bg-orange-600/20" />Pending Signals</h3>
                   {inboundRequests.length === 0 ? (
                     <div className="py-32 text-center bg-slate-50/50 dark:bg-white/[0.01] backdrop-blur-sm rounded-[60px] border-4 border-dashed border-slate-100 dark:border-white/5">
                       <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] opacity-60 italic">Zero signals incoming.</p>
                       <button onClick={() => setDirectorySubView('search')} className="mt-8 px-12 py-4 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-2xl transition-all border-none shadow-xl shadow-orange-600/20">Expand Discovery</button>
                     </div>
                   ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {inboundRequests.map(req => (
                         <div key={req.id} className="p-10 rounded-[60px] bg-white dark:bg-[#050505] border border-slate-100 dark:border-white/10 flex items-center justify-between shadow-2xl animate-fade-in group hover:border-orange-500/30 transition-all">
                            <div className="flex items-center gap-6">
                              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-500 to-red-600 text-white flex items-center justify-center font-black text-2xl shadow-xl">{req.sender?.username?.[0]?.toUpperCase()}</div>
                              <div>
                                 <p className="text-lg font-black dark:text-white uppercase tracking-tighter truncate w-32 md:w-48">@{req.sender?.username}</p>
                                 <p className="text-[10px] font-black text-orange-600/60 uppercase tracking-widest mt-1">{req.sender?.batch || 'Verto'}</p>
                              </div>
                            </div>
                            <div className="flex gap-4">
                               <button onClick={() => respondToRequest(req.id, 'declined')} className="w-14 h-14 rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all border-none"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
                               <button onClick={() => respondToRequest(req.id, 'accepted')} className="w-14 h-14 rounded-full bg-orange-600 text-white shadow-xl shadow-orange-600/30 hover:scale-110 active:scale-90 transition-all border-none"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><polyline points="20 6 9 17 4 12"/></svg></button>
                            </div>
                         </div>
                       ))}
                     </div>
                   )}
                </div>
              )}
            </div>
          </div>
        ) : (activeView === 'lounge' || activeConversation) ? (
          <div className="flex-1 flex flex-row min-h-0 bg-white dark:bg-black chat-gradient">
            <div className="flex-1 flex flex-col min-w-0 border-r border-slate-100 dark:border-white/5 relative z-10">
              <header className="px-8 py-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-white/80 dark:bg-black/80 backdrop-blur-xl flex-shrink-0 relative z-20">
                <div className="flex items-center gap-5">
                  {(activeView === 'dms' || activeView === 'groups') && (
                    <button onClick={() => setActiveConversation(null)} className="md:hidden p-2 -ml-2 text-slate-400 hover:text-orange-600 border-none bg-transparent transition-colors">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    </button>
                  )}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-500 to-red-600 text-white flex items-center justify-center font-black shadow-xl overflow-hidden text-lg">
                    {activeView === 'lounge' ? '#' : (activeConversation?.display_name?.[0]?.toUpperCase() || 'V')}
                  </div>
                  <div>
                    <h3 className="text-base font-black uppercase tracking-tight dark:text-white leading-none">
                      {activeView === 'lounge' ? 'Nexus Lounge' : (activeConversation?.display_name || 'Chat')}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Pulse</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {activeConversation && (
                    <div className="relative">
                      <button 
                        onClick={() => setShowHeaderMenu(!showHeaderMenu)}
                        className="p-3 text-slate-400 hover:text-orange-600 transition-colors border-none bg-transparent"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                      </button>
                      {showHeaderMenu && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowHeaderMenu(false)} />
                          <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-black rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-slate-100 dark:border-white/10 z-50 overflow-hidden animate-fade-in py-3">
                             {activeConversation.is_group ? (
                               <button onClick={() => { leaveGroup(activeConversation.id); setShowHeaderMenu(false); }} className="w-full text-left px-6 py-3 text-[10px] font-black uppercase text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors border-none bg-transparent">Leave Squad</button>
                             ) : (
                               <button onClick={() => { deleteChat(activeConversation.id); setShowHeaderMenu(false); }} className="w-full text-left px-6 py-3 text-[10px] font-black uppercase text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors border-none bg-transparent">End Session</button>
                             )}
                             <button onClick={() => { report(activeConversation.is_group ? 'group' : 'user', activeConversation.id); setShowHeaderMenu(false); }} className="w-full text-left px-6 py-3 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-none bg-transparent">Report Hub</button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </header>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 no-scrollbar bg-transparent scroll-smooth relative z-10">
                {isLoading ? (
                  <div className="space-y-10">
                    <MessageSkeleton isMe={false} />
                    <MessageSkeleton isMe={true} />
                    <MessageSkeleton isMe={false} />
                    <MessageSkeleton isMe={true} />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full opacity-20 text-center py-10 space-y-4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-20 h-20 text-orange-600"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Signal protocol empty</p>
                  </div>
                ) : messages.map((msg, i) => {
                  const isMe = msg.sender_id === userProfile?.id;
                  const isEditing = editingMessageId === msg.id;
                  const isRead = activeView !== 'lounge' && Object.entries(memberReadStatus).some(([uid, time]) => 
                    uid !== msg.sender_id && time >= msg.timestamp
                  );
                  const isOptimistic = msg.id?.startsWith('temp-');

                  return (
                    <div key={msg.id || `temp-${i}`} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} msg-animate group/msg`}>
                      <div className={`flex items-center gap-3 mb-2 px-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                         {!isMe && <span className="text-[10px] font-black text-orange-600 uppercase tracking-tighter">@{msg.sender_name}</span>}
                         <span className="text-[8px] font-bold text-slate-400 opacity-0 group-hover/msg:opacity-100 transition-opacity">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         </span>
                      </div>
                      <div className={`flex items-center gap-3 ${isMe ? 'flex-row-reverse' : ''} max-w-[90%] lg:max-w-[75%]`}>
                        <div className={`relative px-6 py-4 rounded-[32px] text-sm font-medium shadow-md transition-all ${isMe ? 'bg-gradient-to-tr from-orange-500 to-red-600 text-white rounded-tr-none' : 'bg-slate-100 dark:bg-[#111111] text-slate-800 dark:text-slate-200 border dark:border-white/5 rounded-tl-none'} ${isOptimistic ? 'opacity-50 scale-95' : 'hover:scale-[1.01]'}`}>
                          {isEditing ? (
                            <div className="flex flex-col gap-3 min-w-[240px]">
                              <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-full bg-black/20 text-white border-none rounded-2xl p-4 text-xs outline-none resize-none h-20 shadow-inner" rows={2} autoFocus />
                              <div className="flex justify-end gap-3">
                                <button onClick={() => setEditingMessageId(null)} className="text-[9px] uppercase font-black opacity-60 border-none bg-transparent text-white">Cancel</button>
                                <button onClick={() => handleEditMessage(msg.id!)} className="text-[9px] uppercase font-black bg-white text-orange-600 px-4 py-1.5 rounded-full border-none shadow-lg">Save</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col leading-relaxed">
                              <span>{msg.text}</span>
                              {isMe && activeView !== 'lounge' && !isOptimistic && (
                                <div className="self-end -mb-1 mt-1 transition-all">
                                  <ReadReceipt isRead={isRead} />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2 opacity-0 group-hover/msg:opacity-100 transition-opacity flex-shrink-0">
                           {isMe ? (
                             !isEditing && !isOptimistic && (
                               <>
                                 <button onClick={() => { setEditingMessageId(msg.id!); setEditValue(msg.text); }} className="p-2 text-slate-300 hover:text-orange-500 border-none bg-transparent transition-colors">
                                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                 </button>
                                 <button onClick={() => handleDeleteMessage(msg.id!)} className="p-2 text-slate-300 hover:text-red-500 border-none bg-transparent transition-colors">
                                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                                 </button>
                               </>
                             )
                           ) : (
                             <button onClick={() => report('message', msg.id!)} className="p-2 text-slate-300 hover:text-orange-500 border-none bg-transparent transition-colors" title="Report Content">
                               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                             </button>
                           )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="p-6 md:p-10 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-slate-100 dark:border-white/5 flex-shrink-0 relative z-20">
                <form onSubmit={handleSendMessage} className="flex gap-4 bg-slate-50 dark:bg-black p-3 rounded-[40px] border border-slate-200 dark:border-white/10 shadow-inner max-w-5xl mx-auto w-full group/input focus-within:ring-4 focus-within:ring-orange-600/10 transition-all">
                  <input 
                    type="text" value={inputText} onChange={(e) => setInputText(e.target.value)}
                    placeholder={userProfile ? "Message..." : "Identity required..."} disabled={!userProfile}
                    className="flex-1 bg-transparent border-none px-6 py-4 text-sm font-bold dark:text-white outline-none placeholder:text-slate-400"
                  />
                  <button 
                    type="submit" disabled={!userProfile || !inputText.trim()}
                    className="bg-orange-600 hover:bg-orange-700 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-orange-600/20 active:scale-90 transition-all disabled:opacity-30 border-none"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </form>
              </div>
            </div>

            {/* Side Sidebar - Lounge Guidelines */}
            {activeView === 'lounge' && (
              <div className="hidden xl:flex w-[320px] flex-col bg-slate-50/50 dark:bg-black p-10 border-l border-slate-100 dark:border-white/5 overflow-y-auto no-scrollbar backdrop-blur-sm relative z-10">
                <header className="mb-12">
                  <h3 className="text-2xl font-black tracking-tighter uppercase dark:text-white leading-none">Global</h3>
                  <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.4em] mt-3">LPU Common Core</p>
                </header>

                <div className="relative p-10 rounded-[60px] shadow-2xl bg-black text-white border border-white/5 overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600 opacity-20 blur-[80px] rounded-full -mr-24 -mt-24 group-hover:opacity-40 transition-opacity" />
                  
                  <ul className="relative z-10 space-y-6">
                    {[
                      "Civility protocol engaged.",
                      "Academic signal priority.",
                      "Spam filtering active.",
                      "Identify yourself clearly.",
                      "Report illicit packets."
                    ].map((text, idx) => (
                      <li key={idx} className="flex gap-4">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2.5 flex-shrink-0" />
                        <p className="text-[11px] font-black leading-relaxed text-slate-300 uppercase tracking-tight">{text}</p>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center relative z-10">
                    <span className="text-[9px] font-black uppercase opacity-40 tracking-widest">Nexus Pulse v2.0</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5 text-orange-600"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  </div>
                </div>

                <div className="mt-auto pt-10 text-center opacity-30">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">End-to-end Signal Hub</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col min-h-0 bg-transparent chat-gradient">
            <div className="md:hidden h-full">{conversationListContent}</div>
            <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-20 animate-fade-in relative z-10">
               <div className="w-24 h-24 bg-orange-600/10 rounded-[50px] flex items-center justify-center mb-10 text-orange-600 shadow-[0_32px_64px_rgba(234,88,12,0.1)] border border-orange-600/20"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
               <h3 className="text-3xl font-black uppercase tracking-tighter dark:text-white mb-4">Select Communication Hub</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-xs mx-auto leading-relaxed">Choose a direct session or squad to begin syncing with fellow Vertos.</p>
               <button onClick={() => setActiveView('directory')} className="mt-12 px-12 py-5 bg-orange-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-700 hover:shadow-2xl transition-all border-none shadow-xl shadow-orange-600/20 active:scale-95">Discover People</button>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Modals */}
      {showGroupModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="bg-white dark:bg-black rounded-[60px] w-full max-w-md shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/10 p-12 flex flex-col relative">
            <header className="mb-10 flex justify-between items-center">
              <h3 className="text-3xl font-black uppercase tracking-tighter dark:text-white">New Squad</h3>
              <button onClick={() => setShowGroupModal(false)} className="p-3 text-slate-400 hover:text-white border-none bg-transparent"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-7 h-7"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            </header>
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-2">Squad Identification</label>
                <input type="text" placeholder="e.g. CSE-Section-K22" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} className="w-full bg-slate-50 dark:bg-black border border-white/5 rounded-3xl p-5 text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-orange-600/10 shadow-inner" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-2">Member Matrix</label>
                <div className="max-h-48 overflow-y-auto no-scrollbar space-y-2 p-1 border-t border-slate-100 dark:border-white/5 pt-4">
                  {friends.length === 0 ? <p className="text-xs text-slate-400 font-bold uppercase py-6 text-center italic opacity-60">No connections linked yet.</p> : friends.map(p => (
                    <button key={p.id} onClick={() => setSelectedUsers(prev => prev.includes(p.id) ? prev.filter(uid => uid !== p.id) : [...prev, p.id])} className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all border-none ${selectedUsers.includes(p.id) ? 'bg-orange-600 text-white shadow-xl' : 'bg-slate-50 dark:bg-white/5 text-slate-500'}`}>
                      <span className="text-xs font-black uppercase tracking-tight">@{p.username}</span>
                      {selectedUsers.includes(p.id) && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleCreateGroup} disabled={!newGroupName.trim() || selectedUsers.length === 0 || isLoading} className="w-full bg-orange-600 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-orange-600/20 active:scale-95 disabled:opacity-30 border-none transition-all">Establish Squad</button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl animate-fade-in">
          <div className="bg-white dark:bg-black rounded-[50px] w-full max-w-sm shadow-2xl border border-red-500/20 p-10 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse" />
            <header className="mb-8">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-red-600">Integrity Breach</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Report Illicit Signal Hub</p>
            </header>
            <div className="space-y-6">
               <p className="text-xs font-bold text-slate-500 leading-relaxed italic opacity-80">"Community protocol requires reporting of spam, harassment, or harmful packets. Your report is verified by Verto mods."</p>
               <textarea 
                value={reportReason} onChange={(e) => setReportReason(e.target.value)}
                placeholder="Reason for report..." 
                className="w-full bg-slate-50 dark:bg-black p-5 rounded-3xl text-sm font-bold border-none outline-none focus:ring-4 focus:ring-red-600/10 shadow-inner dark:text-white h-32 resize-none"
               />
               <div className="flex gap-3">
                 <button onClick={() => setShowReportModal(false)} className="flex-1 py-4 text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors border-none bg-transparent">Cancel</button>
                 <button onClick={submitReport} disabled={!reportReason.trim()} className="flex-[2] bg-red-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 disabled:opacity-30 border-none">Commit Report</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialHub;


import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { LibraryFile, UserProfile, Folder, ChatMessage, FriendRequest } from '../types.ts';

const getEnvVar = (name: string): string => {
  try {
    const g = (typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : ({} as any));
    const processEnv = g.process?.env?.[name];
    if (processEnv) return processEnv;
    
    // Fallback for VITE environments
    const metaEnv = (import.meta as any).env;
    if (metaEnv) {
      if (metaEnv[`VITE_${name}`]) return metaEnv[`VITE_${name}`];
      if (metaEnv[name]) return metaEnv[name];
    }
  } catch (e) {}
  return '';
};

let supabaseInstance: SupabaseClient | null = null;

const getSupabase = () => {
  if (supabaseInstance) return supabaseInstance;
  const url = getEnvVar('SUPABASE_URL');
  const key = getEnvVar('SUPABASE_ANON_KEY');
  
  if (!url || !key) {
    console.warn("Nexus Registry Config Missing: SUPABASE_URL or SUPABASE_ANON_KEY is not defined.");
    return null;
  }
  
  try {
    supabaseInstance = createClient(url, key);
    return supabaseInstance;
  } catch (e) {
    console.error("Supabase Init Error:", e);
    return null;
  }
};

class NexusServer {
  static isConfigured(): boolean {
    return !!getSupabase();
  }

  static async recordVisit(): Promise<void> {
    const client = getSupabase();
    if (!client) return;
    const SESSION_KEY = 'nexus_session_logged';
    if (!sessionStorage.getItem(SESSION_KEY)) {
      try {
        await client.from('site_visits').insert([{}]);
        sessionStorage.setItem(SESSION_KEY, 'true');
      } catch (e) {}
    }
  }

  static async getSiteStats(): Promise<{ registered: number; visitors: number }> {
    const client = getSupabase();
    if (!client) return { registered: 0, visitors: 1450 };
    try {
      const { count: reg } = await client.from('profiles').select('*', { count: 'exact', head: true });
      const { count: vis } = await client.from('site_visits').select('*', { count: 'exact', head: true });
      return { registered: reg || 0, visitors: (vis || 0) + 1450 };
    } catch (e) { return { registered: 0, visitors: 1450 }; }
  }

  static async signIn(identifier: string, pass: string) {
    const client = getSupabase();
    if (!client) throw new Error("Registry is offline.");
    
    let email = identifier.trim();
    
    if (!identifier.includes('@')) {
      try {
        const { data, error } = await client
          .from('profiles')
          .select('email')
          .eq('username', identifier.toLowerCase().trim())
          .maybeSingle();
        
        if (error) {
          console.error("Identity lookup failed:", error);
        } else if (data?.email) {
          email = data.email;
        } else {
          throw new Error("No Verto found with that username.");
        }
      } catch (e: any) {
        if (e.message.includes("No Verto found")) throw e;
        throw new Error("Terminal connection failed. Please use your official email.");
      }
    }
    
    return await client.auth.signInWithPassword({ email, password: pass });
  }

  static async signUp(email: string, pass: string, username: string) {
    const client = getSupabase();
    if (!client) throw new Error("Registry is offline.");
    
    const cleanUsername = username.toLowerCase().trim();
    const response = await client.auth.signUp({ 
      email: email.trim(), 
      password: pass, 
      options: { 
        data: { username: cleanUsername },
        emailRedirectTo: window.location.origin 
      }
    });

    if (response.data.user) {
      try {
        await client.from('profiles')
          .update({ username: cleanUsername })
          .eq('id', response.data.user.id);
      } catch (e) {
        console.warn("Manual profile update failed, relying on trigger:", e);
      }
    }

    return response;
  }

  static async signOut() {
    const client = getSupabase();
    if (!client) return;
    await client.auth.signOut();
  }

  static onAuthStateChange(callback: (user: User | null) => void) {
    const client = getSupabase();
    if (!client) return () => {};
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      callback(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }

  static async getProfile(userId: string): Promise<UserProfile | null> {
    const client = getSupabase();
    if (!client) return null;
    try {
      const { data, error } = await client.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (error) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const client = getSupabase();
    if (!client) return;
    await client.from('profiles').update(updates).eq('id', userId);
  }

  static async searchProfiles(query: string): Promise<UserProfile[]> {
    const client = getSupabase();
    if (!client || !query.trim()) return [];
    try {
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .ilike('username', `%${query.trim()}%`)
        .limit(20);
      
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error("Directory search failure:", e);
      return [];
    }
  }

  static async sendFriendRequest(senderId: string, receiverId: string) {
    const client = getSupabase();
    if (!client) return;
    return await client.from('friend_requests').insert([{ sender_id: senderId, receiver_id: receiverId, status: 'pending' }]);
  }

  static async getFriendRequests(userId: string): Promise<FriendRequest[]> {
    const client = getSupabase();
    if (!client) return [];
    const { data } = await client
      .from('friend_requests')
      .select('*, sender:profiles!sender_id(*), receiver:profiles!receiver_id(*)')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
    return data || [];
  }

  static async updateFriendRequest(requestId: string, status: 'accepted' | 'declined') {
    const client = getSupabase();
    if (!client) return;
    return await client.from('friend_requests').update({ status }).eq('id', requestId);
  }

  static async getFriends(userId: string): Promise<UserProfile[]> {
    const client = getSupabase();
    if (!client) return [];
    const { data } = await client
      .from('friend_requests')
      .select('sender:profiles!sender_id(*), receiver:profiles!receiver_id(*)')
      .eq('status', 'accepted')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
    
    if (!data) return [];
    
    return data.map(item => {
      const s = item.sender as any as UserProfile;
      const r = item.receiver as any as UserProfile;
      return s.id === userId ? r : s;
    });
  }

  static async sendSocialMessage(senderId: string, senderName: string, text: string) {
    const client = getSupabase();
    if (!client) return;
    await client.from('social_messages').insert([{ sender_id: senderId, sender_name: senderName, text }]);
  }

  static async fetchSocialMessages(): Promise<ChatMessage[]> {
    const client = getSupabase();
    if (!client) return [];
    const { data } = await client.from('social_messages').select('*').order('created_at', { ascending: false }).limit(50);
    return (data || []).reverse().map(m => ({
      id: m.id, role: 'user', text: m.text, timestamp: new Date(m.created_at).getTime(), sender_name: m.sender_name, sender_id: m.sender_id
    }));
  }

  static subscribeToSocialChat(onMessage: (msg: ChatMessage) => void) {
    const client = getSupabase();
    if (!client) return () => {};
    const channel = client.channel('global-social').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'social_messages' }, (payload) => {
      onMessage({ id: payload.new.id, role: 'user', text: payload.new.text, timestamp: new Date(payload.new.created_at).getTime(), sender_name: payload.new.sender_name, sender_id: payload.new.sender_id });
    }).subscribe();
    return () => client.removeChannel(channel);
  }

  static async checkUsernameAvailability(username: string): Promise<boolean> {
    const client = getSupabase();
    if (!client) return true;
    try {
      const { data } = await client.from('profiles').select('username').eq('username', username.toLowerCase().trim()).maybeSingle();
      return !data;
    } catch (e) {
      return true;
    }
  }

  static async saveRecord(userId: string | null, type: string, label: string, content: any): Promise<void> {
    const client = getSupabase();
    if (userId && client) await client.from('user_history').insert([{ user_id: userId, type, label, content }]);
  }

  static async fetchRecords(userId: string | null, type: string): Promise<any[]> {
    const client = getSupabase();
    if (userId && client) {
      const { data } = await client.from('user_history').select('*').eq('user_id', userId).eq('type', type).order('created_at', { ascending: false });
      return data || [];
    }
    return [];
  }

  static async deleteRecord(id: string, _type: string, userId: string | null): Promise<void> {
    const client = getSupabase();
    if (userId && client) await client.from('user_history').delete().eq('id', id);
  }

  static async fetchConversations(userId: string) {
    const client = getSupabase();
    if (!client) return [];
    
    // Fetch conversations including participant info for DMs
    const { data, error } = await client
      .from('conversation_members')
      .select('conversation_id, conversations(*), user_id')
      .eq('user_id', userId);

    if (error) return [];

    const conversations = [];
    for (const item of data) {
      const convo = item.conversations;
      if (!convo.is_group) {
        // Find the other participant's profile
        const { data: otherMember } = await client
          .from('conversation_members')
          .select('profiles(id, username)')
          .eq('conversation_id', convo.id)
          .neq('user_id', userId)
          .single();
        
        convo.display_name = (otherMember?.profiles as any)?.username || "Verto Peer";
        convo.other_user_id = (otherMember?.profiles as any)?.id;
      } else {
        convo.display_name = convo.name || "Squad Channel";
      }
      conversations.push(convo);
    }
    return conversations;
  }

  static async findExistingDM(userId1: string, userId2: string) {
    const client = getSupabase();
    if (!client) return null;
    
    try {
      // Complex query to find a conversation shared by exactly these two users that is not a group
      const { data, error } = await client.rpc('get_dm_between_users', { user1: userId1, user2: userId2 });
      
      // If RPC isn't available or fails, we fallback to a manual check
      if (error || !data || data.length === 0) {
         const { data: user1Convos } = await client.from('conversation_members').select('conversation_id').eq('user_id', userId1);
         const { data: user2Convos } = await client.from('conversation_members').select('conversation_id').eq('user_id', userId2);
         
         if (!user1Convos || !user2Convos || user1Convos.length === 0 || user2Convos.length === 0) return null;
         
         const commonIds = user1Convos
          .filter(c1 => user2Convos.some(c2 => c2.conversation_id === c1.conversation_id))
          .map(c => c.conversation_id);
         
         if (commonIds.length === 0) return null;
         
         const { data: convos } = await client.from('conversations').select('*').in('id', commonIds).eq('is_group', false).limit(1);
         return convos?.[0] || null;
      }

      return data[0] || null;
    } catch (e) {
      console.error("Manual DM check failure:", e);
      return null;
    }
  }

  static async createConversation(userId: string, name: string | null, isGroup: boolean, participants: string[]) {
    const client = getSupabase();
    if (!client) return null;
    const { data: convo } = await client.from('conversations').insert([{ name, is_group: isGroup, created_by: userId }]).select().single();
    if (!convo) return null;
    const members = [...new Set([...participants, userId])].map(pid => ({ conversation_id: convo.id, user_id: pid }));
    await client.from('conversation_members').insert(members);
    return convo;
  }

  static async fetchMessages(conversationId: string): Promise<ChatMessage[]> {
    const client = getSupabase();
    if (!client) return [];
    const { data } = await client.from('messages').select('*, profiles(username)').eq('conversation_id', conversationId).order('created_at', { ascending: true });
    return (data || []).map(m => ({
      id: m.id, role: 'user', text: m.text, timestamp: new Date(m.created_at).getTime(), sender_id: m.sender_id, sender_name: m.profiles?.username
    }));
  }

  static async sendMessage(userId: string, conversationId: string, text: string) {
    const client = getSupabase();
    if (!client) return;
    await client.from('messages').insert([{ conversation_id: conversationId, sender_id: userId, text }]);
  }

  static subscribeToConversation(conversationId: string, onMessage: (msg: ChatMessage) => void) {
    const client = getSupabase();
    if (!client) return () => {};
    const channel = client.channel(`convo-${conversationId}`).on('postgres_changes', { 
      event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` 
    }, async (payload) => {
      const { data: profile } = await client.from('profiles').select('username').eq('id', payload.new.sender_id).single();
      onMessage({ id: payload.new.id, role: 'user', text: payload.new.text, timestamp: new Date(payload.new.created_at).getTime(), sender_id: payload.new.sender_id, sender_name: profile?.username });
    }).subscribe();
    return () => client.removeChannel(channel);
  }

  static async fetchFolders(): Promise<Folder[]> {
    const client = getSupabase();
    if (!client) return [];
    const { data } = await client.from('folders').select('*').order('name', { ascending: true });
    return data || [];
  }

  static async createFolder(name: string, type: string, parentId: string | null): Promise<Folder> {
    const client = getSupabase();
    if (!client) throw new Error("Database offline.");
    const { data, error } = await client.from('folders').insert([{ name, type, parent_id: parentId }]).select().single();
    if (error) throw error;
    return data;
  }

  static async renameFolder(id: string, newName: string): Promise<void> {
    const client = getSupabase();
    if (!client) throw new Error("Database offline.");
    const { error } = await client.from('folders').update({ name: newName }).eq('id', id);
    if (error) throw error;
  }

  static async deleteFolder(id: string): Promise<void> {
    const client = getSupabase();
    if (!client) throw new Error("Database offline.");
    await client.from('folders').delete().eq('id', id);
  }

  static async submitFeedback(text: string, userId?: string, email?: string) {
    const client = getSupabase();
    if (!client) throw new Error("Database offline.");
    await client.from('feedback').insert([{ text, user_id: userId || null, user_email: email || null }]);
  }

  static async fetchFiles(query?: string, _subject?: string): Promise<LibraryFile[]> {
    const client = getSupabase();
    if (!client) throw new Error("Database offline.");
    const { data } = await client.from('documents').select('*, profiles(username, email)').eq('status', 'approved').order('created_at', { ascending: false });
    let res = data || [];
    if (query) res = res.filter(d => d.name.toLowerCase().includes(query.toLowerCase()));
    return res.map(item => ({
      id: item.id, name: item.name, description: item.description, subject: item.subject, semester: item.semester || 'Other',
      type: item.type, status: item.status as any, uploadDate: new Date(item.created_at).getTime(), size: item.size,
      storage_path: item.storage_path, uploader_id: item.uploader_id, uploader_username: item.profiles?.username || "Anonymous Verto",
      admin_notes: item.admin_notes, isUserUploaded: true, pending_update: item.pending_update
    }));
  }

  /**
   * Fetches files that are pending moderation.
   */
  static async fetchPendingFiles(): Promise<LibraryFile[]> {
    const client = getSupabase();
    if (!client) throw new Error("Database offline.");
    const { data } = await client.from('documents').select('*, profiles(username, email)').eq('status', 'pending').order('created_at', { ascending: false });
    return (data || []).map(item => ({
      id: item.id, name: item.name, description: item.description, subject: item.subject, semester: item.semester || 'Other',
      type: item.type, status: item.status as any, uploadDate: new Date(item.created_at).getTime(), size: item.size,
      storage_path: item.storage_path, uploader_id: item.uploader_id, uploader_username: item.profiles?.username || "Anonymous Verto",
      admin_notes: item.admin_notes, isUserUploaded: true, pending_update: item.pending_update
    }));
  }

  /**
   * Fetches files uploaded by a specific user.
   */
  static async fetchUserFiles(userId: string): Promise<LibraryFile[]> {
    const client = getSupabase();
    if (!client) throw new Error("Database offline.");
    const { data } = await client.from('documents').select('*, profiles(username, email)').eq('uploader_id', userId).order('created_at', { ascending: false });
    return (data || []).map(item => ({
      id: item.id, name: item.name, description: item.description, subject: item.subject, semester: item.semester || 'Other',
      type: item.type, status: item.status as any, uploadDate: new Date(item.created_at).getTime(), size: item.size,
      storage_path: item.storage_path, uploader_id: item.uploader_id, uploader_username: item.profiles?.username || "Anonymous Verto",
      admin_notes: item.admin_notes, isUserUploaded: true, pending_update: item.pending_update
    }));
  }

  static async uploadFile(file: File, name: string, description: string, subject: string, semester: string, type: string, userId: string, isAdmin: boolean = false): Promise<void> {
    const client = getSupabase();
    if (!client) throw new Error('Database offline.');
    const fileName = `${Math.random().toString(36).substring(2)}.${file.name.split('.').pop()}`;
    const filePath = `community/${fileName}`;
    await client.storage.from('nexus-documents').upload(filePath, file);
    await client.from('documents').insert([{
      name, description, subject, semester, type, size: `${(file.size / 1024 / 1024).toFixed(2)} MB`, storage_path: filePath, uploader_id: userId, status: isAdmin ? 'approved' : 'pending'
    }]);
  }

  static async requestUpdate(id: string, metadata: any, isAdmin: boolean = false): Promise<void> {
    const client = getSupabase();
    if (!client) return;
    await client.from('documents').update(isAdmin ? { ...metadata, pending_update: null } : { pending_update: metadata }).eq('id', id);
  }

  static async approveFile(id: string): Promise<void> {
    const client = getSupabase();
    if (!client) return;
    const { data: record } = await client.from('documents').select('*').eq('id', id).single();
    const finalData = record.pending_update || record;
    await client.from('documents').update({ ...finalData, status: 'approved', pending_update: null }).eq('id', id);
  }

  static async rejectFile(id: string): Promise<void> {
    const client = getSupabase();
    if (!client) return;
    const { data: file } = await client.from('documents').select('storage_path').eq('id', id).single();
    if (file) {
      await client.from('documents').delete().eq('id', id);
      await client.storage.from('nexus-documents').remove([file.storage_path]);
    }
  }

  static async demoteFile(id: string): Promise<void> {
    const client = getSupabase();
    if (!client) return;
    await client.from('documents').update({ status: 'pending' }).eq('id', id);
  }

  static async getFileUrl(path: string): Promise<string> {
    const client = getSupabase();
    if (!client) return '';
    const { data } = client.storage.from('nexus-documents').getPublicUrl(path);
    return data.publicUrl;
  }

  static async deleteFile(id: string, storagePath: string): Promise<void> {
    const client = getSupabase();
    if (!client) return;
    await client.from('documents').delete().eq('id', id);
    await client.storage.from('nexus-documents').remove([storagePath]);
  }
}

export default NexusServer;

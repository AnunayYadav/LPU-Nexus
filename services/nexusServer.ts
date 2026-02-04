
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
    if (!client || !userId) return null;
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
    if (!client || !userId) return;
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
    if (!client || !senderId || !receiverId) return;
    return await client.from('friend_requests').insert([{ sender_id: senderId, receiver_id: receiverId, status: 'pending' }]);
  }

  static async getFriendRequests(userId: string): Promise<FriendRequest[]> {
    const client = getSupabase();
    if (!client || !userId) return [];
    
    const { data, error } = await client
      .from('friend_requests')
      .select(`
        *,
        sender:profiles!friend_requests_sender_id_fkey(*),
        receiver:profiles!friend_requests_receiver_id_fkey(*)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
    
    if (error) {
      console.error("Signal Fetch Error:", error);
      return [];
    }
    return data || [];
  }

  static async updateFriendRequest(requestId: string, status: 'accepted' | 'declined') {
    const client = getSupabase();
    if (!client || !requestId) return;
    return await client.from('friend_requests').update({ status }).eq('id', requestId);
  }

  static async getFriends(userId: string): Promise<UserProfile[]> {
    const client = getSupabase();
    if (!client || !userId) return [];
    
    const { data, error } = await client
      .from('friend_requests')
      .select(`
        sender:profiles!friend_requests_sender_id_fkey(*),
        receiver:profiles!friend_requests_receiver_id_fkey(*)
      `)
      .eq('status', 'accepted')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
    
    if (error) return [];
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

  static async deleteSocialMessage(messageId: string, userId: string) {
    const client = getSupabase();
    if (!client) return;
    await client.from('social_messages').delete().eq('id', messageId).eq('sender_id', userId);
  }

  static async updateSocialMessage(messageId: string, userId: string, text: string) {
    const client = getSupabase();
    if (!client) return;
    await client.from('social_messages').update({ text }).eq('id', messageId).eq('sender_id', userId);
  }

  static async fetchSocialMessages(): Promise<ChatMessage[]> {
    const client = getSupabase();
    if (!client) return [];
    const { data } = await client.from('social_messages').select('*').order('created_at', { ascending: false }).limit(50);
    return (data || []).reverse().map(m => ({
      id: m.id, role: 'user', text: m.text, timestamp: new Date(m.created_at).getTime(), sender_name: m.sender_name, sender_id: m.sender_id
    }));
  }

  static subscribeToSocialChat(onMessage: (msg: any) => void) {
    const client = getSupabase();
    if (!client) return () => {};
    const channel = client.channel('global-social')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'social_messages' }, (payload) => {
        onMessage(payload);
      })
      .subscribe();
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
    if (!client || !userId) return [];
    
    const { data: memberships, error: memError } = await client
      .from('conversation_members')
      .select('conversation_id')
      .eq('user_id', userId);

    if (memError || !memberships) {
      console.error("Fetch memberships failure:", memError);
      return [];
    }

    const conversationIds = memberships.map(m => m.conversation_id);
    if (conversationIds.length === 0) return [];

    const { data: convos, error: convError } = await client
      .from('conversations')
      .select('*')
      .in('id', conversationIds);

    if (convError || !convos) return [];

    const finalConvos = [];
    for (const convo of convos) {
      if (!convo.is_group) {
        const { data: otherMember } = await client
          .from('conversation_members')
          .select('user_id')
          .eq('conversation_id', convo.id)
          .neq('user_id', userId)
          .maybeSingle();
        
        if (otherMember?.user_id) {
          const { data: profile } = await client
            .from('profiles')
            .select('username')
            .eq('id', otherMember.user_id)
            .maybeSingle();
          
          convo.display_name = profile?.username || "Verto Peer";
          convo.other_user_id = otherMember.user_id;
        } else {
          convo.display_name = "Self Note Channel";
        }
      } else {
        convo.display_name = convo.name || "Squad Channel";
      }
      finalConvos.push(convo);
    }
    return finalConvos;
  }

  static async findExistingDM(userId1: string, userId2: string) {
    const client = getSupabase();
    if (!client || !userId1 || !userId2) return null;
    
    try {
      const { data, error } = await client.rpc('get_dm_between_users', { user1: userId1, user2: userId2 });
      if (!error && data && data.length > 0) return data[0];

      const { data: user1Members } = await client.from('conversation_members').select('conversation_id').eq('user_id', userId1);
      if (!user1Members) return null;

      const convoIds = user1Members.map(m => m.conversation_id);
      const { data: commonMembers } = await client
        .from('conversation_members')
        .select('conversation_id')
        .in('conversation_id', convoIds)
        .eq('user_id', userId2);
      
      if (!commonMembers || commonMembers.length === 0) return null;

      const matchedIds = commonMembers.map(m => m.conversation_id);
      const { data: dmConvo } = await client
        .from('conversations')
        .select('*')
        .in('id', matchedIds)
        .eq('is_group', false)
        .maybeSingle();
      
      return dmConvo || null;
    } catch (e) {
      return null;
    }
  }

  static async createConversation(userId: string, name: string | null, isGroup: boolean, participants: string[]) {
    const client = getSupabase();
    if (!client || !userId) throw new Error("Registry link offline.");
    
    const { data: convo, error: convoError } = await client
      .from('conversations')
      .insert([{ name, is_group: isGroup, created_by: userId }])
      .select()
      .maybeSingle();
      
    if (convoError || !convo) {
      throw new Error(`Deployment blocked: ${convoError?.message || "Check Registry"}`);
    }

    const membersList = [...new Set([...participants, userId])];
    const memberInserts = membersList.map(pid => ({ 
      conversation_id: convo.id, 
      user_id: pid 
    }));

    const { error: memberError } = await client.from('conversation_members').insert(memberInserts);
    if (memberError) {
      await client.from('conversations').delete().eq('id', convo.id);
      throw new Error(`Handshake failed: ${memberError.message}`);
    }

    return convo;
  }

  static async fetchMessages(conversationId: string): Promise<ChatMessage[]> {
    const client = getSupabase();
    if (!client || !conversationId) return [];
    
    // Using simple fetch to avoid relationship ambiguity
    const { data: msgs, error } = await client
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error || !msgs) return [];

    // Resolve profile info efficiently
    const senderIds = Array.from(new Set(msgs.map(m => m.sender_id)));
    const { data: profiles } = await client.from('profiles').select('id, username').in('id', senderIds);
    const profileMap = (profiles || []).reduce((acc: any, p: any) => ({ ...acc, [p.id]: p.username }), {});

    return msgs.map(m => ({
      id: m.id, role: 'user', text: m.text, timestamp: new Date(m.created_at).getTime(), sender_id: m.sender_id, sender_name: profileMap[m.sender_id] || 'Verto'
    }));
  }

  static async sendMessage(userId: string, conversationId: string, text: string) {
    const client = getSupabase();
    if (!client || !userId || !conversationId) return;
    const { error } = await client.from('messages').insert([{ conversation_id: conversationId, sender_id: userId, text }]);
    if (error) {
      console.error("Transmission error:", error);
      throw error;
    }
  }

  static async deleteMessage(messageId: string, userId: string) {
    const client = getSupabase();
    if (!client) return;
    await client.from('messages').delete().eq('id', messageId).eq('sender_id', userId);
  }

  static async updateMessage(messageId: string, userId: string, text: string) {
    const client = getSupabase();
    if (!client) return;
    await client.from('messages').update({ text }).eq('id', messageId).eq('sender_id', userId);
  }

  static subscribeToConversation(conversationId: string, onUpdate: (payload: any) => void) {
    const client = getSupabase();
    if (!client || !conversationId) return () => {};
    const channel = client.channel(`convo-${conversationId}`)
      .on('postgres_changes', { 
        event: '*', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` 
      }, (payload) => {
        onUpdate(payload);
      })
      .subscribe();
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

  static async fetchUserFiles(userId: string): Promise<LibraryFile[]> {
    const client = getSupabase();
    if (!client || !userId) throw new Error("Database offline.");
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
    if (!client || !userId) throw new Error('Database offline.');
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

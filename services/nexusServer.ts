
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { LibraryFile, UserProfile, Folder, ChatMessage, FriendRequest } from '../types.ts';

const getEnvVar = (name: string): string => {
  try {
    const g = (typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : ({} as any));
    const processEnv = g.process?.env?.[name];
    if (processEnv) return processEnv;
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
  if (!url || !key) return null;
  try {
    supabaseInstance = createClient(url, key);
    return supabaseInstance;
  } catch (e) { return null; }
};

class NexusServer {
  static isConfigured(): boolean { return !!getSupabase(); }

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
    if (!client) return { registered: 0, visitors: 0 };
    try {
      const { count: reg } = await client.from('profiles').select('*', { count: 'exact', head: true });
      const { count: vis } = await client.from('site_visits').select('*', { count: 'exact', head: true });
      return { registered: reg || 0, visitors: vis || 0 };
    } catch (e) { return { registered: 0, visitors: 0 }; }
  }

  static async signIn(identifier: string, pass: string) {
    const client = getSupabase();
    if (!client) throw new Error("Registry is offline.");
    let email = identifier.trim();
    if (!identifier.includes('@')) {
      const { data } = await client.from('profiles').select('email').eq('username', identifier.toLowerCase().trim()).maybeSingle();
      if (data?.email) email = data.email;
      else throw new Error("No Verto found with that username.");
    }
    return await client.auth.signInWithPassword({ email, password: pass });
  }

  static async signUp(email: string, pass: string, username: string) {
    const client = getSupabase();
    if (!client) throw new Error("Registry is offline.");
    const cleanUsername = username.toLowerCase().trim();
    return await client.auth.signUp({ 
      email: email.trim(), 
      password: pass, 
      options: { data: { username: cleanUsername }, emailRedirectTo: window.location.origin }
    });
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
    const { data } = await client.from('profiles').select('*').eq('id', userId).maybeSingle();
    return data;
  }

  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const client = getSupabase();
    if (!client || !userId) return;
    await client.from('profiles').update(updates).eq('id', userId);
  }

  static async uploadAvatar(userId: string, file: File): Promise<string> {
    const client = getSupabase();
    if (!client) throw new Error("Registry offline.");
    const fileExt = file.name.split('.').pop();
    const filePath = `avatars/${userId}/${Math.random()}.${fileExt}`;
    const { error: uploadError } = await client.storage.from('nexus-documents').upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = client.storage.from('nexus-documents').getPublicUrl(filePath);
    await this.updateProfile(userId, { avatar_url: publicUrl });
    return publicUrl;
  }

  static async fetchFolders(): Promise<Folder[]> {
    const client = getSupabase();
    if (!client) return [];
    const { data } = await client.from('folders').select('*').order('name', { ascending: true });
    return data || [];
  }

  static async createFolder(name: string, type: 'semester'|'subject'|'category', parentId: string|null) {
    const client = getSupabase();
    if (client) await client.from('folders').insert([{ name, type, parent_id: parentId }]);
  }

  static async renameFolder(id: string, name: string) {
    const client = getSupabase();
    if (client) await client.from('folders').update({ name }).eq('id', id);
  }

  static async deleteFolder(id: string) {
    const client = getSupabase();
    if (client) await client.from('folders').delete().eq('id', id);
  }

  static async fetchFiles(q?: string, sub?: string): Promise<LibraryFile[]> {
    const client = getSupabase();
    if (!client) return [];
    let query = client.from('documents').select('*, profiles!uploader_id(username)').eq('status', 'approved');
    if (q) query = query.ilike('name', `%${q}%`);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) { console.error("Database Select Error:", error); return []; }
    return (data || []).map(item => ({
      id: item.id, name: item.name, subject: item.subject, semester: item.semester, type: item.type,
      uploadDate: new Date(item.created_at).getTime(), size: item.size, status: item.status, storage_path: item.storage_path,
      uploader_username: item.profiles?.username,
      description: item.description,
      admin_notes: item.admin_notes
    }));
  }

  static async uploadFile(file: File, name: string, desc: string, sub: string, sem: string, type: string, uid: string, admin: boolean) {
    const client = getSupabase();
    if (!client) return;
    const path = `community/${Math.random().toString(36).substring(7)}_${file.name}`;
    const { error: storageErr } = await client.storage.from('nexus-documents').upload(path, file);
    if (storageErr) throw storageErr;
    const { error: dbErr } = await client.from('documents').insert([{ 
      name, description: desc, subject: sub, semester: sem, type, 
      size: `${(file.size/1024/1024).toFixed(2)} MB`, storage_path: path, 
      uploader_id: uid, status: admin ? 'approved' : 'pending' 
    }]);
    if (dbErr) throw dbErr;
  }

  static async fetchRecords(uid: string | null, type: string) {
    const client = getSupabase();
    if (client && uid) {
      const { data } = await client.from('user_history').select('*').eq('user_id', uid).eq('type', type).order('created_at', { ascending: false });
      return data || [];
    }
    return [];
  }

  static async saveRecord(uid: string | null, type: string, label: string, content: any) {
    const client = getSupabase();
    if (client && uid) await client.from('user_history').insert([{ user_id: uid, type, label, content }]);
  }

  static async deleteRecord(id: string, type: string, uid: string | null) {
    const client = getSupabase();
    if (client && uid) await client.from('user_history').delete().eq('id', id);
  }

  static async checkUsernameAvailability(username: string): Promise<boolean> {
    const client = getSupabase();
    if (!client) return true;
    const { data } = await client.from('profiles').select('username').eq('username', username.toLowerCase().trim()).maybeSingle();
    return !data;
  }

  static async submitFeedback(text: string, uid?: string, email?: string) {
    const client = getSupabase();
    if (client) await client.from('feedback').insert([{ text, user_id: uid, user_email: email }]);
  }

  static async getFileUrl(path: string) {
    const client = getSupabase();
    if (!client) return '';
    return client.storage.from('nexus-documents').getPublicUrl(path).data.publicUrl;
  }

  static async deleteFile(id: string, path: string) {
    const client = getSupabase();
    if (client) {
      await client.from('documents').delete().eq('id', id);
      await client.storage.from('nexus-documents').remove([path]);
    }
  }

  static async approveFile(id: string) {
    const client = getSupabase();
    if (client) await client.from('documents').update({ status: 'approved' }).eq('id', id);
  }

  static async rejectFile(id: string) {
    const client = getSupabase();
    if (client) await client.from('documents').delete().eq('id', id);
  }

  static async demoteFile(id: string) {
    const client = getSupabase();
    if (client) await client.from('documents').update({ status: 'pending' }).eq('id', id);
  }

  static async requestUpdate(id: string, metadata: any, admin: boolean) {
    const client = getSupabase();
    if (client) await client.from('documents').update(admin ? metadata : { pending_update: metadata }).eq('id', id);
  }

  static async fetchPendingFiles(q?: string): Promise<LibraryFile[]> {
    const client = getSupabase();
    if (!client) return [];
    let query = client.from('documents').select('*, profiles!uploader_id(username)').eq('status', 'pending');
    if (q) query = query.ilike('name', `%${q}%`);
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) { console.error("Database Select Error:", error); return []; }
    return (data || []).map(item => ({
      id: item.id, name: item.name, subject: item.subject, semester: item.semester, type: item.type,
      uploadDate: new Date(item.created_at).getTime(), size: item.size, status: item.status, storage_path: item.storage_path,
      uploader_username: item.profiles?.username,
      description: item.description,
      admin_notes: item.admin_notes
    }));
  }

  static async fetchUserFiles(uid: string): Promise<LibraryFile[]> {
    const client = getSupabase();
    if (!client) return [];
    const { data, error } = await client.from('documents').select('*, profiles!uploader_id(username)').eq('uploader_id', uid).order('created_at', { ascending: false });
    if (error) { console.error("Database Select Error:", error); return []; }
    return (data || []).map(item => ({
      id: item.id, name: item.name, subject: item.subject, semester: item.semester, type: item.type,
      uploadDate: new Date(item.created_at).getTime(), size: item.size, status: item.status, storage_path: item.storage_path,
      uploader_username: item.profiles?.username,
      description: item.description,
      admin_notes: item.admin_notes
    }));
  }

  static async markConversationAsRead(userId: string, conversationId: string) {
    const client = getSupabase();
    if (!client) return;
    await client.from('conversation_members').update({ last_read_at: new Date().toISOString() }).eq('conversation_id', conversationId).eq('user_id', userId);
  }

  static subscribeToSocialChat(callback: (payload: any) => void) {
    const client = getSupabase();
    if (!client) return () => {};
    const channel = client.channel('social_chat')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'social_messages' }, callback)
      .subscribe();
    return () => { client.removeChannel(channel); };
  }

  static subscribeToConversation(conversationId: string, callback: (payload: any) => void) {
    const client = getSupabase();
    if (!client) return () => {};
    const channel = client.channel(`convo_${conversationId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, callback)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversation_members', filter: `conversation_id=eq.${conversationId}` }, callback)
      .subscribe();
    return () => { client.removeChannel(channel); };
  }

  static subscribeToUserMessages(userId: string, callback: (payload: any) => void) {
    const client = getSupabase();
    if (!client) return () => {};
    const channel = client.channel(`user_msgs_${userId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, callback)
      .subscribe();
    return () => { client.removeChannel(channel); };
  }

  static async fetchMemberReadStatuses(conversationId: string) {
    const client = getSupabase();
    if (!client) return [];
    const { data } = await client.from('conversation_members').select('user_id, last_read_at').eq('conversation_id', conversationId);
    return data || [];
  }

  static async fetchSocialMessages(): Promise<ChatMessage[]> {
    const client = getSupabase();
    if (!client) return [];
    const { data } = await client.from('social_messages').select('*, profiles(username, avatar_url)').order('created_at', { ascending: true }).limit(100);
    return (data || []).map(m => ({
      id: m.id,
      role: 'user',
      text: m.text,
      timestamp: new Date(m.created_at).getTime(),
      sender_name: m.profiles?.username,
      sender_id: m.sender_id,
      sender_avatar_url: m.profiles?.avatar_url
    }));
  }

  static async fetchMessages(conversationId: string): Promise<ChatMessage[]> {
    const client = getSupabase();
    if (!client) return [];
    const { data } = await client.from('messages').select('*, profiles(username, avatar_url), reactions(*)').eq('conversation_id', conversationId).order('created_at', { ascending: true });
    return (data || []).map(m => ({
      id: m.id,
      role: 'user',
      text: m.text,
      timestamp: new Date(m.created_at).getTime(),
      sender_name: m.profiles?.username,
      sender_id: m.sender_id,
      sender_avatar_url: m.profiles?.avatar_url,
      is_deleted_everyone: m.is_deleted_everyone,
      reactions: m.reactions
    }));
  }

  static async fetchConversations(userId: string) {
    const client = getSupabase();
    if (!client) return [];
    const { data } = await client.from('conversations').select('*, conversation_members!inner(*)').eq('conversation_members.user_id', userId);
    return data || [];
  }

  static async getFriendRequests(userId: string): Promise<FriendRequest[]> {
    const client = getSupabase();
    if (!client) return [];
    const { data } = await client.from('friend_requests').select('*, sender:profiles!sender_id(*), receiver:profiles!receiver_id(*)').or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
    return data || [];
  }

  static async getFriends(userId: string): Promise<UserProfile[]> {
    const client = getSupabase();
    if (!client) return [];
    const { data } = await client.from('friends').select('friend_id, profiles!friend_id(*)').eq('user_id', userId);
    return (data || []).map(d => d.profiles);
  }

  static async updateSocialMessage(id: string, userId: string, text: string) {
    const client = getSupabase();
    if (client) await client.from('social_messages').update({ text }).eq('id', id).eq('sender_id', userId);
  }

  static async updateMessage(id: string, userId: string, text: string) {
    const client = getSupabase();
    if (client) await client.from('messages').update({ text }).eq('id', id).eq('sender_id', userId);
  }

  static async sendSocialMessage(userId: string, username: string, text: string) {
    const client = getSupabase();
    if (client) await client.from('social_messages').insert([{ sender_id: userId, text }]);
  }

  static async sendMessage(userId: string, conversationId: string, text: string, replyToId?: string) {
    const client = getSupabase();
    if (client) await client.from('messages').insert([{ sender_id: userId, conversation_id: conversationId, text, reply_to_id: replyToId }]);
  }

  static async toggleReaction(messageId: string, userId: string, emoji: string) {
    const client = getSupabase();
    if (!client) return;
    const { data } = await client.from('message_reactions').select('*').eq('message_id', messageId).eq('user_id', userId).eq('emoji', emoji).maybeSingle();
    if (data) await client.from('message_reactions').delete().eq('id', data.id);
    else await client.from('message_reactions').insert([{ message_id: messageId, user_id: userId, emoji }]);
  }

  static async reportContent(userId: string, type: string, targetId: string, details: string) {
    const client = getSupabase();
    if (client) await client.from('reports').insert([{ reporter_id: userId, type, target_id: targetId, details }]);
  }

  static async deleteSocialMessage(id: string, userId: string) {
    const client = getSupabase();
    if (client) await client.from('social_messages').delete().eq('id', id).eq('sender_id', userId);
  }

  static async deleteMessageEveryone(id: string, userId: string) {
    const client = getSupabase();
    if (client) await client.from('messages').update({ is_deleted_everyone: true, text: 'This message was deleted' }).eq('id', id).eq('sender_id', userId);
  }

  static async searchProfiles(query: string): Promise<UserProfile[]> {
    const client = getSupabase();
    if (!client) return [];
    const { data } = await client.from('profiles').select('*').ilike('username', `%${query}%`).limit(20);
    return data || [];
  }

  static async findExistingDM(user1Id: string, user2Id: string) {
    const client = getSupabase();
    if (!client) return null;
    const { data } = await client.from('conversations').select('*, conversation_members!inner(*)').eq('is_group', false).eq('conversation_members.user_id', user1Id).maybeSingle();
    return data;
  }

  static async createConversation(ownerId: string, name: string | null, isGroup: boolean, memberIds: string[]) {
    const client = getSupabase();
    if (!client) return null;
    const { data: convo, error } = await client.from('conversations').insert([{ name, is_group: isGroup }]).select().single();
    if (error) throw error;
    const members = [ownerId, ...memberIds].map(uid => ({ conversation_id: convo.id, user_id: uid }));
    await client.from('conversation_members').insert(members);
    return convo;
  }

  static async sendFriendRequest(senderId: string, receiverId: string) {
    const client = getSupabase();
    if (client) await client.from('friend_requests').insert([{ sender_id: senderId, receiver_id: receiverId, status: 'pending' }]);
  }

  static async updateFriendRequest(id: string, status: 'accepted' | 'declined') {
    const client = getSupabase();
    if (!client) return;
    await client.from('friend_requests').update({ status }).eq('id', id);
    if (status === 'accepted') {
      const { data: req } = await client.from('friend_requests').select('*').eq('id', id).single();
      if (req) {
        await client.from('friends').insert([
          { user_id: req.sender_id, friend_id: req.receiver_id },
          { user_id: req.receiver_id, friend_id: req.sender_id }
        ]);
      }
    }
  }

  static async deleteConversation(id: string) {
    const client = getSupabase();
    if (client) await client.from('conversations').delete().eq('id', id);
  }

  static async leaveGroup(userId: string, conversationId: string) {
    const client = getSupabase();
    if (client) await client.from('conversation_members').delete().eq('conversation_id', conversationId).eq('user_id', userId);
  }

  static async blockUser(userId: string, targetId: string) {
    const client = getSupabase();
    if (client) await client.from('blocked_users').insert([{ user_id: userId, blocked_user_id: targetId }]);
  }
}

export default NexusServer;

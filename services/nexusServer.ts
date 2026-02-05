
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { LibraryFile, UserProfile, Folder, ChatMessage, FriendRequest, MessageReaction } from '../types.ts';

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

  static async blockUser(myId: string, targetId: string) {
    const client = getSupabase();
    if (!client) return;
    const profile = await this.getProfile(myId);
    const blocked = [...(profile?.blocked_users || []), targetId];
    return await client.from('profiles').update({ blocked_users: Array.from(new Set(blocked)) }).eq('id', myId);
  }

  static async searchProfiles(query: string): Promise<UserProfile[]> {
    const client = getSupabase();
    if (!client || !query.trim()) return [];
    const { data } = await client.from('profiles').select('*').ilike('username', `%${query.trim()}%`).limit(20);
    return data || [];
  }

  static async sendFriendRequest(senderId: string, receiverId: string) {
    const client = getSupabase();
    if (!client) return;
    return await client.from('friend_requests').insert([{ sender_id: senderId, receiver_id: receiverId, status: 'pending' }]);
  }

  static async getFriendRequests(userId: string): Promise<FriendRequest[]> {
    const client = getSupabase();
    if (!client || !userId) return [];
    const { data } = await client.from('friend_requests').select('*, sender:profiles!friend_requests_sender_id_fkey(*), receiver:profiles!friend_requests_receiver_id_fkey(*)').or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
    return data || [];
  }

  static async updateFriendRequest(requestId: string, status: 'accepted' | 'declined') {
    const client = getSupabase();
    if (!client) return;
    return await client.from('friend_requests').update({ status }).eq('id', requestId);
  }

  static async getFriends(userId: string): Promise<UserProfile[]> {
    const client = getSupabase();
    if (!client || !userId) return [];
    const { data } = await client.from('friend_requests').select('sender:profiles!friend_requests_sender_id_fkey(*), receiver:profiles!friend_requests_receiver_id_fkey(*)').eq('status', 'accepted').or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
    return (data || []).map(item => {
      const s = item.sender as any as UserProfile;
      const r = item.receiver as any as UserProfile;
      return s.id === userId ? r : s;
    });
  }

  static async fetchConversations(userId: string) {
    const client = getSupabase();
    if (!client || !userId) return [];
    const { data: memberships } = await client.from('conversation_members').select('conversation_id, last_read_at, is_pinned, is_archived').eq('user_id', userId);
    if (!memberships || memberships.length === 0) return [];
    const ids = memberships.map(m => m.conversation_id);
    const { data: convos } = await client.from('conversations').select('*').in('id', ids);
    const final = [];
    for (const c of (convos || [])) {
      const mem = memberships.find(m => m.conversation_id === c.id);
      const entry = { ...c, ...mem };
      const { count } = await client.from('messages').select('*', { count: 'exact', head: true }).eq('conversation_id', c.id).gt('created_at', entry.last_read_at);
      entry.unread_count = count || 0;
      if (!c.is_group) {
        const { data: other } = await client.from('conversation_members').select('user_id').eq('conversation_id', c.id).neq('user_id', userId).maybeSingle();
        if (other) {
          const profile = await this.getProfile(other.user_id);
          entry.display_name = profile?.username || "Verto";
          entry.other_user_id = other.user_id;
        }
      } else { entry.display_name = c.name || "Squad"; }
      final.push(entry);
    }
    return final.sort((a, b) => (a.is_pinned ? -1 : 1));
  }

  static async createConversation(userId: string, name: string | null, isGroup: boolean, participants: string[]) {
    const client = getSupabase();
    if (!client) throw new Error("Registry offline.");
    const { data: convo } = await client.from('conversations').insert([{ name, is_group: isGroup, created_by: userId }]).select().single();
    if (!convo) throw new Error("Deployment failed.");
    const membersList = Array.from(new Set([...participants, userId]));
    await client.from('conversation_members').insert(membersList.map(pid => ({ conversation_id: convo.id, user_id: pid, last_read_at: new Date().toISOString() })));
    return convo;
  }

  static async sendMessage(userId: string, conversationId: string, text: string, replyToId?: string) {
    const client = getSupabase();
    if (!client) return;
    return await client.from('messages').insert([{ conversation_id: conversationId, sender_id: userId, text, reply_to_id: replyToId }]);
  }

  static async updateMessage(messageId: string, userId: string, text: string) {
    const client = getSupabase();
    if (!client) return;
    return await client.from('messages').update({ text, updated_at: new Date().toISOString() }).eq('id', messageId).eq('sender_id', userId);
  }

  static async toggleReaction(messageId: string, userId: string, emoji: string) {
    const client = getSupabase();
    if (!client) return;
    const { data: msg } = await client.from('messages').select('reactions').eq('id', messageId).single();
    let reactions: MessageReaction[] = msg?.reactions || [];
    const existing = reactions.find(r => r.user_id === userId && r.emoji === emoji);
    if (existing) reactions = reactions.filter(r => !(r.user_id === userId && r.emoji === emoji));
    else reactions.push({ emoji, user_id: userId });
    return await client.from('messages').update({ reactions }).eq('id', messageId);
  }

  static async deleteMessageEveryone(messageId: string, userId: string) {
    const client = getSupabase();
    if (!client) return;
    return await client.from('messages').update({ text: 'Message deleted', is_deleted_everyone: true }).eq('id', messageId).eq('sender_id', userId);
  }

  static async markConversationAsRead(userId: string, conversationId: string) {
    const client = getSupabase();
    if (!client) return;
    await client.from('conversation_members').update({ last_read_at: new Date().toISOString() }).eq('conversation_id', conversationId).eq('user_id', userId);
  }

  static async fetchMessages(conversationId: string): Promise<ChatMessage[]> {
    const client = getSupabase();
    if (!client) return [];
    const { data: msgs } = await client.from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true });
    if (!msgs) return [];
    const senderIds = Array.from(new Set(msgs.map(m => m.sender_id)));
    const { data: profiles } = await client.from('profiles').select('id, username').in('id', senderIds);
    const pMap = (profiles || []).reduce((acc: any, p: any) => ({ ...acc, [p.id]: p.username }), {});
    return msgs.map(m => ({
      id: m.id, role: 'user', text: m.text, timestamp: new Date(m.created_at).getTime(), sender_id: m.sender_id, sender_name: pMap[m.sender_id] || 'Verto',
      reactions: m.reactions, is_deleted_everyone: m.is_deleted_everyone
    }));
  }

  static async updateSocialMessage(id: string, uid: string, text: string) {
    const client = getSupabase();
    if (client) await client.from('social_messages').update({ text }).eq('id', id).eq('sender_id', uid);
  }

  static async deleteSocialMessage(id: string, uid: string) {
    const client = getSupabase();
    if (client) await client.from('social_messages').delete().eq('id', id).eq('sender_id', uid);
  }

  static async sendSocialMessage(uid: string, name: string, text: string) {
    const client = getSupabase();
    if (client) await client.from('social_messages').insert([{ sender_id: uid, sender_name: name, text }]);
  }

  static async fetchSocialMessages(): Promise<ChatMessage[]> {
    const client = getSupabase();
    if (!client) return [];
    const { data } = await client.from('social_messages').select('*').order('created_at', { ascending: false }).limit(50);
    return (data || []).reverse().map(m => ({ id: m.id, role: 'user', text: m.text, timestamp: new Date(m.created_at).getTime(), sender_name: m.sender_name, sender_id: m.sender_id }));
  }

  static subscribeToSocialChat(onMsg: (payload: any) => void) {
    const client = getSupabase();
    if (!client) return () => {};
    const ch = client.channel('global-social').on('postgres_changes', { event: '*', schema: 'public', table: 'social_messages' }, onMsg).subscribe();
    return () => client.removeChannel(ch);
  }

  static subscribeToConversation(id: string, onUpdate: (payload: any) => void) {
    const client = getSupabase();
    if (!client) return () => {};
    const ch = client.channel(`convo-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `conversation_id=eq.${id}` }, onUpdate)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'conversation_members', filter: `conversation_id=eq.${id}` }, onUpdate)
      .subscribe();
    return () => client.removeChannel(ch);
  }

  static subscribeToUserMessages(userId: string, onUpdate: (payload: any) => void) {
    const client = getSupabase();
    if (!client) return () => {};
    const ch = client.channel(`user-notif-${userId}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, onUpdate).subscribe();
    return () => client.removeChannel(ch);
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
    let query = client.from('documents').select('*, profiles(username)').eq('status', 'approved');
    if (q) query = query.ilike('name', `%${q}%`);
    const { data } = await query.order('created_at', { ascending: false });
    return (data || []).map(item => ({
      id: item.id, name: item.name, subject: item.subject, semester: item.semester, type: item.type,
      uploadDate: new Date(item.created_at).getTime(), size: item.size, status: item.status, storage_path: item.storage_path,
      uploader_username: item.profiles?.username
    }));
  }

  static async uploadFile(file: File, name: string, desc: string, sub: string, sem: string, type: string, uid: string, admin: boolean) {
    const client = getSupabase();
    if (!client) return;
    const path = `community/${Math.random().toString(36).substring(7)}_${file.name}`;
    await client.storage.from('nexus-documents').upload(path, file);
    await client.from('documents').insert([{ name, description: desc, subject: sub, semester: sem, type, size: `${(file.size/1024/1024).toFixed(2)} MB`, storage_path: path, uploader_id: uid, status: admin ? 'approved' : 'pending' }]);
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

  static async fetchPendingFiles(): Promise<LibraryFile[]> {
    const client = getSupabase();
    if (!client) return [];
    const { data } = await client.from('documents').select('*, profiles(username)').eq('status', 'pending');
    return (data || []).map(item => ({
      id: item.id, name: item.name, subject: item.subject, semester: item.semester, type: item.type,
      uploadDate: new Date(item.created_at).getTime(), size: item.size, status: item.status, storage_path: item.storage_path,
      uploader_username: item.profiles?.username
    }));
  }

  static async fetchUserFiles(uid: string): Promise<LibraryFile[]> {
    const client = getSupabase();
    if (!client) return [];
    const { data } = await client.from('documents').select('*, profiles(username)').eq('uploader_id', uid);
    return (data || []).map(item => ({
      id: item.id, name: item.name, subject: item.subject, semester: item.semester, type: item.type,
      uploadDate: new Date(item.created_at).getTime(), size: item.size, status: item.status, storage_path: item.storage_path,
      uploader_username: item.profiles?.username
    }));
  }

  static async findExistingDM(u1: string, u2: string) {
    const client = getSupabase();
    if (!client) return null;
    const { data, error } = await client.rpc('get_dm_between_users', { user1: u1, user2: u2 });
    return (!error && data?.length) ? data[0] : null;
  }

  static async deleteConversation(id: string) {
    const client = getSupabase();
    if (client) await client.from('conversations').delete().eq('id', id);
  }

  static async leaveGroup(uid: string, cid: string) {
    const client = getSupabase();
    if (client) await client.from('conversation_members').delete().eq('conversation_id', cid).eq('user_id', uid);
  }

  static async reportContent(uid: string, type: string, targetId: string, reason: string) {
    const client = getSupabase();
    if (client) await client.from('feedback').insert([{ text: `REPORT [${type}]: ${reason}`, user_id: uid }]);
  }

  static async fetchMemberReadStatuses(id: string) {
    const client = getSupabase();
    if (!client) return [];
    const { data } = await client.from('conversation_members').select('user_id, last_read_at').eq('conversation_id', id);
    return data || [];
  }
}

export default NexusServer;

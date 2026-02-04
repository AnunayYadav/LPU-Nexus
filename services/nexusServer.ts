
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { LibraryFile, UserProfile, Folder, ChatMessage } from '../types.ts';

const getEnvVar = (name: string): string => {
  // Try direct process.env first (for platform injected vars)
  try {
    if (typeof process !== 'undefined' && process.env && process.env[name]) {
      return process.env[name] as string;
    }
  } catch (e) {}

  // Try standard window/global check
  const g = (typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : ({} as any));
  if (g.process?.env?.[name]) return g.process.env[name];

  const vitePrefix = `VITE_${name}`;
  try {
    const metaEnv = (import.meta as any).env;
    if (metaEnv) {
      if (metaEnv[vitePrefix]) return metaEnv[vitePrefix];
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
    console.warn("NexusServer: Supabase connection parameters are missing. Verify SUPABASE_URL and SUPABASE_ANON_KEY.");
    return null;
  }

  try {
    supabaseInstance = createClient(url, key);
    return supabaseInstance;
  } catch (e) {
    console.error("Supabase Initialization Error:", e);
    return null;
  }
};

const BUCKET_NAME = 'nexus-documents';

class NexusServer {
  static async recordVisit(): Promise<void> {
    const client = getSupabase();
    if (!client) return;
    const SESSION_KEY = 'nexus_session_visit_logged';
    const alreadyLogged = sessionStorage.getItem(SESSION_KEY);
    if (!alreadyLogged) {
      try {
        const { error } = await client.from('site_visits').insert([{}]);
        if (!error) sessionStorage.setItem(SESSION_KEY, 'true');
      } catch (e) {}
    }
  }

  static async getSiteStats(): Promise<{ registered: number; visitors: number }> {
    const client = getSupabase();
    if (!client) return { registered: 0, visitors: 0 };
    try {
      const { count: registeredCount } = await client.from('profiles').select('*', { count: 'exact', head: true });
      const { count: visitorCount } = await client.from('site_visits').select('*', { count: 'exact', head: true });
      const baseHistoricalReach = 1450; 
      return { registered: registeredCount || 0, visitors: (visitorCount || 0) + baseHistoricalReach };
    } catch (e) {
      return { registered: 0, visitors: 1450 };
    }
  }

  static async signIn(identifier: string, pass: string) {
    const client = getSupabase();
    if (!client) throw new Error("Connection Failure: Database terminal configuration is missing.");
    
    let email = identifier;
    // If user enters a username instead of email
    if (!identifier.includes('@')) {
      const { data: profile, error: profileErr } = await client
        .from('profiles')
        .select('email')
        .eq('username', identifier.toLowerCase())
        .maybeSingle();
      
      if (profileErr) throw new Error(`Registry lookup failed: ${profileErr.message}`);
      if (!profile) throw new Error("No Verto found with this username. Use your official email if this is your first login.");
      email = profile.email;
    }
    
    return await client.auth.signInWithPassword({ email, password: pass });
  }

  static async signUp(email: string, pass: string, username: string) {
    const client = getSupabase();
    if (!client) throw new Error("Connection Failure: Database terminal configuration is missing.");
    const { data: authData, error: signUpErr } = await client.auth.signUp({ 
      email, 
      password: pass, 
      options: { 
        data: { username: username.toLowerCase() },
        emailRedirectTo: window.location.origin
      }
    });
    if (signUpErr) throw signUpErr;
    return { data: authData, error: null };
  }

  static async signOut() {
    const client = getSupabase();
    if (!client) return;
    await client.auth.signOut();
  }

  static onAuthStateChange(callback: (user: User | null) => void) {
    const client = getSupabase();
    if (!client) return () => {};
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => callback(session?.user ?? null));
    return () => subscription.unsubscribe();
  }

  static async getProfile(userId: string): Promise<UserProfile | null> {
    const client = getSupabase();
    if (!client) return null;
    try {
      const { data, error } = await client.from('profiles').select('*').eq('id', userId).single();
      if (error) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  static async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const client = getSupabase();
    if (!client) throw new Error("Database offline.");
    const { error } = await client.from('profiles').update(updates).eq('id', userId);
    if (error) throw error;
  }

  static async fetchPublicProfiles(): Promise<UserProfile[]> {
    const client = getSupabase();
    if (!client) return [];
    const { data } = await client.from('profiles').select('*').eq('is_public', true).order('username');
    return data || [];
  }

  static async sendSocialMessage(senderId: string, senderName: string, text: string) {
    const client = getSupabase();
    if (!client) return;
    const { error } = await client.from('social_messages').insert([{
      sender_id: senderId, sender_name: senderName, text
    }]);
    if (error) throw error;
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
    const channel = client.channel('global-social')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'social_messages' }, (payload) => {
        onMessage({
          id: payload.new.id, role: 'user', text: payload.new.text, timestamp: new Date(payload.new.created_at).getTime(), sender_name: payload.new.sender_name, sender_id: payload.new.sender_id
        });
      })
      .subscribe();
    return () => client.removeChannel(channel);
  }

  static async checkUsernameAvailability(username: string): Promise<boolean> {
    const client = getSupabase();
    if (!client) return true;
    try {
      const { data } = await client.from('profiles').select('username').eq('username', username.toLowerCase()).maybeSingle();
      return !data;
    } catch (e) {
      return true;
    }
  }

  static async saveRecord(userId: string | null, type: string, label: string, content: any): Promise<void> {
    const client = getSupabase();
    if (userId && client) {
      await client.from('user_history').insert([{ user_id: userId, type, label, content }]);
    }
  }

  static async fetchRecords(userId: string | null, type: string): Promise<any[]> {
    const client = getSupabase();
    if (userId && client) {
      const { data } = await client.from('user_history').select('*').eq('user_id', userId).eq('type', type).order('created_at', { ascending: false });
      return data || [];
    }
    return [];
  }

  static async deleteRecord(id: string, type: string, userId: string | null): Promise<void> {
    const client = getSupabase();
    if (userId && client) await client.from('user_history').delete().eq('id', id);
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
    if (!client) throw new Error("Database connection unavailable.");
    await client.from('feedback').insert([{ text, user_id: userId || null, user_email: email || null }]);
  }

  static async fetchFiles(query?: string, subject?: string): Promise<LibraryFile[]> {
    const client = getSupabase();
    if (!client) throw new Error("Database connection unavailable.");
    const { data } = await client.from('documents').select('*, profiles(username, email)').eq('status', 'approved').order('created_at', { ascending: false });
    let res = data || [];
    if (subject && subject !== 'All') res = res.filter(d => d.subject === subject);
    if (query) res = res.filter(d => d.name.toLowerCase().includes(query.toLowerCase()));
    return res.map(item => ({
      id: item.id, name: item.name, description: item.description, subject: item.subject, semester: item.semester || 'Other',
      type: item.type, status: item.status, uploadDate: new Date(item.created_at).getTime(), size: item.size,
      storage_path: item.storage_path, uploader_id: item.uploader_id, uploader_username: item.profiles?.username || "Anonymous Verto",
      admin_notes: item.admin_notes, isUserUploaded: true, pending_update: item.pending_update
    }));
  }

  static async fetchPendingFiles(): Promise<LibraryFile[]> {
    const client = getSupabase();
    if (!client) throw new Error("Database connection unavailable.");
    const { data } = await client.from('documents').select('*, profiles(username, email)').eq('status', 'pending').order('created_at', { ascending: false });
    return (data || []).map(item => ({
      id: item.id, name: item.name, description: item.description, subject: item.subject, semester: item.semester || 'Other',
      type: item.type, status: item.status, uploadDate: new Date(item.created_at).getTime(), size: item.size,
      storage_path: item.storage_path, uploader_id: item.uploader_id, uploader_username: item.profiles?.username || "Anonymous Verto",
      admin_notes: item.admin_notes, isUserUploaded: true, pending_update: item.pending_update
    }));
  }

  static async fetchUserFiles(userId: string): Promise<LibraryFile[]> {
    const client = getSupabase();
    if (!client) throw new Error("Database connection unavailable.");
    const { data } = await client.from('documents').select('*, profiles(username, email)').eq('uploader_id', userId).order('created_at', { ascending: false });
    return (data || []).map(item => ({
      id: item.id, name: item.name, description: item.description, subject: item.subject, semester: item.semester || 'Other',
      type: item.type, status: item.status, uploadDate: new Date(item.created_at).getTime(), size: item.size,
      storage_path: item.storage_path, uploader_id: item.uploader_id, uploader_username: item.profiles?.username || "Anonymous Verto",
      admin_notes: item.admin_notes, isUserUploaded: true, pending_update: item.pending_update
    }));
  }

  static async uploadFile(file: File, name: string, description: string, subject: string, semester: string, type: string, userId: string, isAdmin: boolean = false): Promise<void> {
    const client = getSupabase();
    if (!client) throw new Error('Database connection unavailable.');
    const fileName = `${Math.random().toString(36).substring(2)}.${file.name.split('.').pop()}`;
    const filePath = `community/${fileName}`;
    await client.storage.from(BUCKET_NAME).upload(filePath, file);
    await client.from('documents').insert([{
      name, description, subject, semester, type, size: `${(file.size / 1024 / 1024).toFixed(2)} MB`, storage_path: filePath, uploader_id: userId, status: isAdmin ? 'approved' : 'pending'
    }]);
  }

  static async requestUpdate(id: string, metadata: any, isAdmin: boolean = false): Promise<void> {
    const client = getSupabase();
    if (!client) throw new Error('Database connection unavailable.');
    await client.from('documents').update(isAdmin ? { ...metadata, pending_update: null } : { pending_update: metadata }).eq('id', id);
  }

  static async approveFile(id: string): Promise<void> {
    const client = getSupabase();
    if (!client) throw new Error('Database connection unavailable.');
    const { data: record } = await client.from('documents').select('*').eq('id', id).single();
    const finalData = record.pending_update || record;
    await client.from('documents').update({ ...finalData, status: 'approved', pending_update: null }).eq('id', id);
  }

  static async rejectFile(id: string): Promise<void> {
    const client = getSupabase();
    if (!client) throw new Error('Database connection unavailable.');
    const { data: file } = await client.from('documents').select('storage_path').eq('id', id).single();
    if (file) {
      await client.from('documents').delete().eq('id', id);
      await client.storage.from(BUCKET_NAME).remove([file.storage_path]);
    }
  }

  static async demoteFile(id: string): Promise<void> {
    const client = getSupabase();
    if (!client) throw new Error('Database connection unavailable.');
    await client.from('documents').update({ status: 'pending' }).eq('id', id);
  }

  static async getFileUrl(path: string): Promise<string> {
    const client = getSupabase();
    if (!client) throw new Error('Database connection unavailable.');
    const { data } = client.storage.from(BUCKET_NAME).getPublicUrl(path);
    return data.publicUrl;
  }

  static async deleteFile(id: string, storagePath: string): Promise<void> {
    const client = getSupabase();
    if (!client) throw new Error('Database connection unavailable.');
    await client.from('documents').delete().eq('id', id);
    await client.storage.from(BUCKET_NAME).remove([storagePath]);
  }
}

export default NexusServer;


import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { LibraryFile, UserProfile, Folder } from '../types.ts';

const getEnvVar = (name: string): string => {
  const vitePrefix = `VITE_${name}`;
  try {
    const metaEnv = (import.meta as any).env;
    if (metaEnv) {
      if (metaEnv[vitePrefix]) return metaEnv[vitePrefix];
      if (metaEnv[name]) return metaEnv[name];
    }
  } catch (e) {}
  try {
    if (typeof process !== 'undefined' && process.env) {
      if (process.env[vitePrefix]) return process.env[vitePrefix] as string;
      if (process.env[name]) return process.env[name] as string;
    }
  } catch (e) {}
  return '';
};

const supabaseUrl = getEnvVar('SUPABASE_URL');
const supabaseAnonKey = getEnvVar('SUPABASE_ANON_KEY');

let supabaseInstance: SupabaseClient | null = null;

const getSupabase = () => {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    } catch (e) {
      console.error("Supabase Initialization Error:", e);
      return null;
    }
  }
  return supabaseInstance;
};

const BUCKET_NAME = 'nexus-documents';

class NexusServer {
  /**
   * Records a new site visit if it hasn't been recorded in this session.
   */
  static async recordVisit(): Promise<void> {
    const client = getSupabase();
    if (!client) return;

    const SESSION_KEY = 'nexus_session_visit_logged';
    const alreadyLogged = sessionStorage.getItem(SESSION_KEY);

    if (!alreadyLogged) {
      try {
        const { error } = await client.from('site_visits').insert([{}]);
        if (!error) {
          sessionStorage.setItem(SESSION_KEY, 'true');
        }
      } catch (e) {
        console.error("Failed to record authentic visit:", e);
      }
    }
  }

  static async getSiteStats(): Promise<{ registered: number; visitors: number }> {
    const client = getSupabase();
    if (!client) return { registered: 0, visitors: 0 };
    
    // 1. Fetch real-time count of registered profiles
    const { count: registeredCount, error: regError } = await client
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    // 2. Fetch authentic count of site visits from the database
    const { count: visitorCount, error: visError } = await client
      .from('site_visits')
      .select('*', { count: 'exact', head: true });

    if (regError) console.error("Registered stats fetch error:", regError);
    if (visError) console.error("Visitor stats fetch error:", visError);

    /**
     * Legacy Base: 1450
     * We add the authentic database count to our historical base reach 
     * to show the total cumulative impact of the platform.
     */
    const baseHistoricalReach = 1450; 
    const totalAuthenticVisitors = (visitorCount || 0) + baseHistoricalReach;

    return { 
      registered: registeredCount || 0, 
      visitors: totalAuthenticVisitors 
    };
  }

  static async checkUsernameAvailability(username: string): Promise<boolean> {
    const client = getSupabase();
    if (!client) return true;
    const { data } = await client
      .from('profiles')
      .select('username')
      .eq('username', username.toLowerCase())
      .maybeSingle();
    return !data;
  }

  static async signUp(email: string, pass: string, username: string) {
    const client = getSupabase();
    if (!client) throw new Error("Supabase connection not established.");
    const isAvailable = await this.checkUsernameAvailability(username);
    if (!isAvailable) throw new Error("This username is already taken by another Verto.");

    const { data: authData, error: signUpErr } = await client.auth.signUp({ 
      email, 
      password: pass,
      options: { data: { username: username.toLowerCase() } }
    });

    if (signUpErr) throw signUpErr;
    if (authData.user) {
      await client.from('profiles').update({ username: username.toLowerCase() }).eq('id', authData.user.id);
    }
    return { data: authData, error: null };
  }

  static async signIn(identifier: string, pass: string) {
    const client = getSupabase();
    if (!client) throw new Error("Supabase connection not established.");
    let email = identifier;
    if (!identifier.includes('@')) {
      const { data: profile, error: profileErr } = await client
        .from('profiles')
        .select('email')
        .eq('username', identifier.toLowerCase())
        .maybeSingle();
      if (profileErr || !profile) throw new Error("No Verto found with this username.");
      email = profile.email;
    }
    return await client.auth.signInWithPassword({ email, password: pass });
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
    const { data, error } = await client.from('profiles').select('*').eq('id', userId).single();
    if (error) return null;
    return data;
  }

  static async updateUsername(userId: string, username: string): Promise<void> {
    const client = getSupabase();
    if (!client) throw new Error("Database connection unavailable.");
    const { error } = await client.from('profiles').update({ username: username.toLowerCase() }).eq('id', userId);
    if (error) {
      if (error.message.includes('unique')) throw new Error("This username is already taken.");
      throw error;
    }
    // Log change to enforce limit
    await this.saveRecord(userId, 'username_change', `Changed to ${username}`, { username });
  }

  // --- HISTORY MANAGEMENT ---
  static async saveRecord(userId: string | null, type: 'resume_audit' | 'cgpa_snapshot' | 'username_change', label: string, content: any): Promise<void> {
    const client = getSupabase();
    if (userId && client) {
      const { error } = await client.from('user_history').insert([{ user_id: userId, type, label, content }]);
      if (error) throw error;
    } else {
      // Local Storage Fallback
      const key = `nexus_history_${type}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      const newRecord = { id: Math.random().toString(36).substr(2, 9), type, label, content, created_at: new Date().toISOString() };
      localStorage.setItem(key, JSON.stringify([newRecord, ...existing].slice(0, 10)));
    }
  }

  static async fetchRecords(userId: string | null, type: 'resume_audit' | 'cgpa_snapshot' | 'username_change'): Promise<any[]> {
    const client = getSupabase();
    if (userId && client) {
      const { data, error } = await client.from('user_history').select('*').eq('user_id', userId).eq('type', type).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } else {
      return JSON.parse(localStorage.getItem(`nexus_history_${type}`) || '[]');
    }
  }

  static async deleteRecord(id: string, type: string, userId: string | null): Promise<void> {
    const client = getSupabase();
    if (userId && client) {
      await client.from('user_history').delete().eq('id', id);
    } else {
      const key = `nexus_history_${type}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      localStorage.setItem(key, JSON.stringify(existing.filter((r: any) => r.id !== id)));
    }
  }

  // --- LIBRARY & FEEDBACK ---
  static async fetchFolders(): Promise<Folder[]> {
    const client = getSupabase();
    if (!client) return [];
    try {
      const { data, error } = await client.from('folders').select('*').order('name', { ascending: true });
      if (error) throw error;
      return data as Folder[];
    } catch (e) { return []; }
  }

  static async createFolder(name: string, type: 'semester' | 'subject' | 'category', parentId: string | null): Promise<Folder> {
    const client = getSupabase();
    if (!client) throw new Error("Database offline.");
    const { data, error } = await client.from('folders').insert([{ name, type, parent_id: parentId }]).select().single();
    if (error) throw error;
    return data as Folder;
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
    const { error } = await client.from('folders').delete().eq('id', id);
    if (error) throw error;
  }

  static async submitFeedback(text: string, userId?: string, email?: string) {
    const client = getSupabase();
    if (!client) throw new Error("Database connection unavailable.");
    const { error } = await client.from('feedback').insert([{ text, user_id: userId || null, user_email: email || null }]);
    if (error) throw error;
  }

  private static mapFileResult(item: any): LibraryFile {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      subject: item.subject,
      semester: item.semester || 'Other',
      type: item.type,
      status: item.status,
      uploadDate: new Date(item.created_at).getTime(),
      size: item.size,
      storage_path: item.storage_path,
      uploader_id: item.uploader_id,
      uploader_username: item.profiles?.username || item.profiles?.email?.split('@')[0] || "Anonymous Verto",
      admin_notes: item.admin_notes,
      isUserUploaded: true,
      pending_update: item.pending_update
    };
  }

  static async fetchFiles(query?: string, subject?: string): Promise<LibraryFile[]> {
    const client = getSupabase();
    if (!client) throw new Error("Database connection unavailable.");
    let result = await client.from('documents').select('*, profiles(username, email)').eq('status', 'approved').order('created_at', { ascending: false });
    if (result.error) result = await client.from('documents').select('*').eq('status', 'approved').order('created_at', { ascending: false });
    if (result.error) throw result.error;
    let data = result.data || [];
    if (subject && subject !== 'All') data = data.filter(d => d.subject === subject);
    if (query) {
      const q = query.toLowerCase();
      data = data.filter(d => d.name.toLowerCase().includes(q));
    }
    return data.map(this.mapFileResult);
  }

  static async fetchUserFiles(userId: string): Promise<LibraryFile[]> {
    const client = getSupabase();
    if (!client) throw new Error("Database connection unavailable.");
    let result = await client.from('documents').select('*, profiles(username, email)').eq('uploader_id', userId).order('created_at', { ascending: false });
    if (result.error) result = await client.from('documents').select('*').eq('uploader_id', userId).order('created_at', { ascending: false });
    if (result.error) throw result.error;
    return (result.data || []).map(this.mapFileResult);
  }

  static async fetchPendingFiles(): Promise<LibraryFile[]> {
    const client = getSupabase();
    if (!client) throw new Error("Database connection unavailable.");
    let result = await client.from('documents').select('*, profiles(username, email)').or('status.eq.pending,pending_update.not.is.null').order('created_at', { ascending: true });
    if (result.error) result = await client.from('documents').select('*').or('status.eq.pending,pending_update.not.is.null').order('created_at', { ascending: true });
    if (result.error) throw result.error;
    return (result.data || []).map(this.mapFileResult);
  }

  static async uploadFile(file: File, name: string, description: string, subject: string, semester: string, type: string, userId: string, isAdmin: boolean = false): Promise<void> {
    const client = getSupabase();
    if (!client) throw new Error('Database connection unavailable.');
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `community/${fileName}`;
    const { error: storageError } = await client.storage.from(BUCKET_NAME).upload(filePath, file);
    if (storageError) throw new Error(`Upload failed: ${storageError.message}`);
    const fileSize = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
    const { error: dbError } = await client.from('documents').insert([{
      name, description, subject, semester, type, size: fileSize, storage_path: filePath, uploader_id: userId, status: isAdmin ? 'approved' : 'pending'
    }]);
    if (dbError) {
      await client.storage.from(BUCKET_NAME).remove([filePath]);
      throw new Error(`Database record failed: ${dbError.message}`);
    }
  }

  static async requestUpdate(id: string, metadata: { name: string; description: string; subject: string; semester: string; type: string }, isAdmin: boolean = false): Promise<void> {
    const client = getSupabase();
    if (!client) throw new Error('Database connection unavailable.');
    try {
      if (isAdmin) {
        const { error } = await client.from('documents').update({ ...metadata, pending_update: null }).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await client.from('documents').update({ pending_update: metadata }).eq('id', id);
        if (error) throw error;
      }
    } catch (e: any) { throw new Error(`Update request failed: ${e.message}`); }
  }

  static async approveFile(id: string): Promise<void> {
    const client = getSupabase();
    if (!client) throw new Error('Database connection unavailable.');
    try {
      const { data: record, error: fetchError } = await client.from('documents').select('*').eq('id', id).single();
      if (fetchError || !record) throw new Error("Could not find document record.");
      const finalData = record.pending_update || { name: record.name, description: record.description, subject: record.subject, semester: record.semester, type: record.type };
      let { data: semFolder } = await client.from('folders').select('id').eq('type', 'semester').eq('name', finalData.semester).maybeSingle();
      if (!semFolder) {
        const { data: newSem } = await client.from('folders').insert({ type: 'semester', name: finalData.semester, parent_id: null }).select().single();
        semFolder = newSem;
      }
      let { data: subFolder } = await client.from('folders').select('id').eq('type', 'subject').eq('name', finalData.subject).eq('parent_id', semFolder!.id).maybeSingle();
      if (!subFolder) {
        const { data: newSub } = await client.from('folders').insert({ type: 'subject', name: finalData.subject, parent_id: semFolder!.id }).select().single();
        subFolder = newSub;
      }
      let { data: catFolder } = await client.from('folders').select('id').eq('type', 'category').eq('name', finalData.type).eq('parent_id', subFolder!.id).maybeSingle();
      if (!catFolder) {
        const { data: newCat } = await client.from('folders').insert({ type: 'category', name: finalData.type, parent_id: subFolder!.id }).select().single();
        catFolder = newCat;
      }
      const { error } = await client.from('documents').update({
        name: finalData.name, description: finalData.description, subject: finalData.subject, semester: finalData.semester, type: finalData.type, status: 'approved', pending_update: null
      }).eq('id', id);
      if (error) throw error;
    } catch (e: any) { throw new Error(`Approval failed: ${e.message}`); }
  }

  static async demoteFile(id: string): Promise<void> {
    const client = getSupabase();
    if (!client) throw new Error('Database connection unavailable.');
    try {
      const { error } = await client.from('documents').update({ status: 'pending' }).eq('id', id);
      if (error) throw error;
    } catch (e: any) { throw new Error(`Demotion failed: ${e.message}`); }
  }

  static async rejectFile(id: string): Promise<void> {
    const client = getSupabase();
    if (!client) throw new Error('Database connection unavailable.');
    try {
      const { data: record, error: fetchError } = await client.from('documents').select('status, storage_path').eq('id', id).single();
      if (fetchError || !record) throw new Error("Could not find record.");
      if (record.status === 'pending') await this.deleteFile(id, record.storage_path);
      else await this.rejectUpdate(id);
    } catch (e: any) { throw new Error(`Rejection failed: ${e.message}`); }
  }

  static async rejectUpdate(id: string): Promise<void> {
    const client = getSupabase();
    if (!client) throw new Error('Database connection unavailable.');
    try {
      const { error } = await client.from('documents').update({ pending_update: null }).eq('id', id);
      if (error) throw error;
    } catch (e: any) { throw new Error(`Rejection failed: ${e.message}`); }
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
    try {
      const { error: dbError } = await client.from('documents').delete().eq('id', id);
      if (dbError) throw dbError;
      const { error: storageError } = await client.storage.from(BUCKET_NAME).remove([storagePath]);
      if (storageError) console.warn("Storage removal failed:", storageError.message);
    } catch (e: any) { throw new Error(`Deletion failed: ${e.message}`); }
  }
}

export default NexusServer;

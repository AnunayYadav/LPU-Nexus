
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { LibraryFile } from '../types.ts';

/**
 * Robust environment variable resolution for Supabase.
 * Checks for Vite-specific (import.meta.env), standard (process.env), and window locations.
 */
const getEnvVar = (name: string): string => {
  const vitePrefix = `VITE_${name}`;
  
  // 1. Try import.meta.env (Vite standard)
  try {
    // @ts-ignore - Vite environment variable access
    const metaEnv = (import.meta as any).env;
    if (metaEnv) {
      if (metaEnv[vitePrefix]) return metaEnv[vitePrefix];
      if (metaEnv[name]) return metaEnv[name];
    }
  } catch (e) {}

  // 2. Try process.env (Node/Webpack standard)
  try {
    if (typeof process !== 'undefined' && process.env) {
      if (process.env[vitePrefix]) return process.env[vitePrefix] as string;
      if (process.env[name]) return process.env[name] as string;
    }
  } catch (e) {}

  // 3. Try window properties (Injected or global fallback)
  try {
    const win = window as any;
    if (win.process?.env?.[vitePrefix]) return win.process.env[vitePrefix];
    if (win.process?.env?.[name]) return win.process.env[name];
    if (win[`__${vitePrefix}__`]) return win[`__${vitePrefix}__`];
    if (win[`__${name}__`]) return win[`__${name}__`];
  } catch (e) {}

  return '';
};

const supabaseUrl = getEnvVar('SUPABASE_URL');
const supabaseAnonKey = getEnvVar('SUPABASE_ANON_KEY');

// Lazy initialization of Supabase client to prevent crashes if env vars are missing during early bundle execution
let supabaseInstance: SupabaseClient | null = null;

const getSupabase = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('NexusServer: Configuration Missing or Inaccessible.', {
      urlPresent: !!supabaseUrl,
      keyPresent: !!supabaseAnonKey,
      checked: ['VITE_SUPABASE_URL', 'SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'SUPABASE_ANON_KEY']
    });
    return null;
  }
  
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    } catch (e) {
      console.error('NexusServer: Initialization Failed:', e);
      return null;
    }
  }
  return supabaseInstance;
};

// NOTE: Bucket IDs in Supabase are case-sensitive. 
// If your bucket is named "NEXUS-DOCUMENTS", change this to match exactly.
const BUCKET_NAME = 'nexus-documents';

class NexusServer {
  /**
   * Fetches document records from Supabase 'documents' table
   */
  static async fetchFiles(query?: string, subject?: string): Promise<LibraryFile[]> {
    const client = getSupabase();
    if (!client) {
      throw new Error(`Nexus Registry Connectivity Error: Supabase URL or Anon Key is undefined. Ensure you have set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.`);
    }

    try {
      let supabaseQuery = client
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (subject && subject !== 'All') {
        supabaseQuery = supabaseQuery.eq('subject', subject);
      }

      if (query) {
        supabaseQuery = supabaseQuery.ilike('name', `%${query}%`);
      }

      const { data, error } = await supabaseQuery;

      if (error) {
        if (error.code === '42P01') {
          throw new Error('Database table "documents" not found. Please run the SQL setup script from the README.');
        }
        throw new Error(`Registry Sync Error: ${error.message}`);
      }

      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        subject: item.subject,
        type: item.type,
        uploadDate: new Date(item.created_at).getTime(),
        size: item.size,
        storage_path: item.storage_path,
        isUserUploaded: true
      }));
    } catch (e: any) {
      console.error('NexusServer.fetchFiles failed:', e);
      throw e;
    }
  }

  static async uploadFile(file: File, subject: string, type: LibraryFile['type']): Promise<LibraryFile> {
    const client = getSupabase();
    if (!client) throw new Error('Cannot upload: Nexus configuration missing.');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `community/${fileName}`;

    const { error: storageError } = await client.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (storageError) {
      if (storageError.message.includes('not found')) {
        throw new Error(`Storage bucket "${BUCKET_NAME}" not found. Ensure it is created and set to Public.`);
      }
      throw new Error(`Upload Failed: ${storageError.message}`);
    }

    const fileSize = `${(file.size / 1024 / 1024).toFixed(2)} MB`;

    const { data, error: dbError } = await client
      .from('documents')
      .insert([
        {
          name: file.name,
          subject: subject,
          type: type,
          size: fileSize,
          storage_path: filePath,
        }
      ])
      .select()
      .single();

    if (dbError) {
      await client.storage.from(BUCKET_NAME).remove([filePath]);
      throw new Error(`Database Record Creation Failed: ${dbError.message}`);
    }

    return {
      id: data.id,
      name: data.name,
      subject: data.subject,
      type: data.type,
      uploadDate: new Date(data.created_at).getTime(),
      size: data.size,
      isUserUploaded: true
    };
  }

  static async getFileUrl(path: string): Promise<string> {
    const client = getSupabase();
    if (!client) throw new Error('Registry offline.');
    const { data } = client.storage.from(BUCKET_NAME).getPublicUrl(path);
    return data.publicUrl;
  }

  static async deleteFile(id: string, storagePath: string): Promise<void> {
    const client = getSupabase();
    if (!client) throw new Error('Registry offline.');

    const { error: dbError } = await client
      .from('documents')
      .delete()
      .eq('id', id);

    if (dbError) throw new Error(`Failed to delete record: ${dbError.message}`);

    const { error: storageError } = await client.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);
  }
}

export default NexusServer;

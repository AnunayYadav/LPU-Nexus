
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { LibraryFile } from '../types.ts';

// Environment variables for Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Lazy initialization of Supabase client to prevent top-level crashes
let supabaseInstance: SupabaseClient | null = null;

const getSupabase = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('NexusServer: Supabase configuration missing. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in the environment.');
    return null;
  }
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    } catch (e) {
      console.error('NexusServer: Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return supabaseInstance;
};

const BUCKET_NAME = 'nexus-documents';

class NexusServer {
  /**
   * Fetches document records from Supabase 'documents' table
   */
  static async fetchFiles(query?: string, subject?: string): Promise<LibraryFile[]> {
    const client = getSupabase();
    if (!client) throw new Error('Nexus distributed database is currently offline. Missing cloud configuration.');

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
      console.error('Supabase Fetch Error:', error);
      throw error;
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
  }

  /**
   * Uploads file to Storage and creates database record
   */
  static async uploadFile(file: File, subject: string, type: LibraryFile['type']): Promise<LibraryFile> {
    const client = getSupabase();
    if (!client) throw new Error('Cannot upload: Nexus distributed database is offline.');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `community/${fileName}`;

    // 1. Upload to Storage
    const { error: storageError } = await client.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (storageError) {
      console.error('Supabase Storage Error:', storageError);
      throw storageError;
    }

    const fileSize = `${(file.size / 1024 / 1024).toFixed(2)} MB`;

    // 2. Insert into Database
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
      // Cleanup storage if db insert fails
      await client.storage.from(BUCKET_NAME).remove([filePath]);
      console.error('Supabase DB Error:', dbError);
      throw dbError;
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

  /**
   * Gets a public URL for a file
   */
  static async getFileUrl(path: string): Promise<string> {
    const client = getSupabase();
    if (!client) throw new Error('Database offline.');
    const { data } = client.storage.from(BUCKET_NAME).getPublicUrl(path);
    return data.publicUrl;
  }

  /**
   * Deletes file from both storage and database
   */
  static async deleteFile(id: string, storagePath: string): Promise<void> {
    const client = getSupabase();
    if (!client) throw new Error('Database offline.');

    // 1. Delete from DB
    const { error: dbError } = await client
      .from('documents')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    // 2. Delete from Storage
    const { error: storageError } = await client.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);

    if (storageError) console.warn('File record deleted but storage cleanup failed:', storageError);
  }
}

export default NexusServer;

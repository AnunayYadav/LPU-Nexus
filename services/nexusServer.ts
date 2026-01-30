
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { LibraryFile } from '../types.ts';

// Environment variables for Supabase - Trying common prefixes used in different environments
const supabaseUrl = process.env.SUPABASE_URL || 
                    (window as any).process?.env?.SUPABASE_URL || 
                    '';

const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 
                        (window as any).process?.env?.SUPABASE_ANON_KEY || 
                        '';

// Lazy initialization of Supabase client to prevent top-level crashes
let supabaseInstance: SupabaseClient | null = null;

const getSupabase = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    const errorMsg = 'NexusServer: Supabase configuration missing. Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in your environment variables.';
    console.error(errorMsg, {
      urlPresent: !!supabaseUrl,
      keyPresent: !!supabaseAnonKey
    });
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

// NOTE: Bucket IDs in Supabase are case-sensitive. 
// If your bucket is named "NEXUS-DOCUMENTS", change this to match exactly.
const BUCKET_NAME = 'nexus-documents';

class NexusServer {
  /**
   * Fetches document records from Supabase 'documents' table
   */
  static async fetchFiles(query?: string, subject?: string): Promise<LibraryFile[]> {
    const client = getSupabase();
    if (!client) throw new Error('Nexus Distributed Registry is currently offline. Please check your Supabase Environment Variables (URL and ANON_KEY).');

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
        // Handle "Table not found" error specifically (Postgres code 42P01)
        if (error.code === '42P01') {
          throw new Error('Database table "documents" not found. Please run the SQL setup script from the README in your Supabase SQL Editor.');
        }
        console.error('Supabase Fetch Error:', error);
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

  /**
   * Uploads file to Storage and creates database record
   */
  static async uploadFile(file: File, subject: string, type: LibraryFile['type']): Promise<LibraryFile> {
    const client = getSupabase();
    if (!client) throw new Error('Cannot upload: Nexus configuration missing.');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `community/${fileName}`;

    // 1. Upload to Storage
    const { error: storageError } = await client.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (storageError) {
      console.error('Supabase Storage Error:', storageError);
      if (storageError.message.includes('not found')) {
        throw new Error(`Storage bucket "${BUCKET_NAME}" not found. Please create it in your Supabase Storage dashboard and set it to Public.`);
      }
      throw new Error(`Upload Failed: ${storageError.message}`);
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

  /**
   * Gets a public URL for a file
   */
  static async getFileUrl(path: string): Promise<string> {
    const client = getSupabase();
    if (!client) throw new Error('Registry offline.');
    const { data } = client.storage.from(BUCKET_NAME).getPublicUrl(path);
    return data.publicUrl;
  }

  /**
   * Deletes file from both storage and database
   */
  static async deleteFile(id: string, storagePath: string): Promise<void> {
    const client = getSupabase();
    if (!client) throw new Error('Registry offline.');

    // 1. Delete from DB
    const { error: dbError } = await client
      .from('documents')
      .delete()
      .eq('id', id);

    if (dbError) throw new Error(`Failed to delete record: ${dbError.message}`);

    // 2. Delete from Storage
    const { error: storageError } = await client.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);

    if (storageError) {
      console.warn('File record deleted but storage cleanup failed:', storageError);
    }
  }
}

export default NexusServer;


export enum ModuleType {
  DASHBOARD = 'DASHBOARD',
  PLACEMENT = 'PLACEMENT',
  LIBRARY = 'LIBRARY',
  CAMPUS = 'CAMPUS',
  GLOBAL = 'GLOBAL',
  FRESHERS = 'FRESHERS',
  HELP = 'HELP',
  CGPA = 'CGPA',
  ATTENDANCE = 'ATTENDANCE',
  SHARE_CGPA = 'SHARE_CGPA',
  ABOUT = 'ABOUT',
  PROFILE = 'PROFILE',
  SOCIAL = 'SOCIAL'
}

export interface UserProfile {
  id: string;
  email: string;
  is_admin: boolean;
  username?: string;
  program?: string;
  batch?: string;
  bio?: string;
  is_public?: boolean;
}

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
  sender?: UserProfile;
  receiver?: UserProfile;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'model' | 'system';
  text: string;
  isError?: boolean;
  timestamp: number;
  sender_name?: string;
  sender_id?: string;
}

export interface ResumeAnalysisResult {
  matchScore: number;
  missingKeywords: string[];
  phrasingAdvice: string[];
  projectFeedback: string;
  summary: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export type FileStatus = 'pending' | 'approved' | 'rejected';

export interface LibraryFile {
  id: string;
  name: string;
  description?: string;
  subject: string;
  semester: string;
  type: string;
  uploadDate: number;
  size: string;
  status: FileStatus;
  storage_path: string;
  uploader_id?: string;
  uploader_username?: string;
  admin_notes?: string;
  isUserUploaded?: boolean;
  pending_update?: {
    name: string;
    description: string;
    subject: string;
    semester: string;
    type: string;
    admin_notes?: string;
  } | null;
}

export interface Folder {
  id: string;
  name: string;
  type: 'semester' | 'subject' | 'category';
  parent_id: string | null;
}

export interface Flashcard {
  front: string;
  back: string;
}

declare global {
  interface Window {
    pdfjsLib: any;
    mermaid: any;
  }
}

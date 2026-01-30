
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
  SHARE_CGPA = 'SHARE_CGPA'
}

export interface UserProfile {
  id: string;
  email: string;
  is_admin: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
  isError?: boolean;
  timestamp: number;
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
  type: string;
  uploadDate: number;
  size: string;
  status: FileStatus;
  storage_path: string;
  isUserUploaded?: boolean;
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

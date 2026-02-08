
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
  TIMETABLE = 'TIMETABLE'
}

export interface UserProfile {
  id: string;
  email: string;
  is_admin: boolean;
  username?: string;
  program?: string;
  batch?: string;
  bio?: string;
  avatar_url?: string;
  is_public?: boolean;
  last_seen?: string;
  blocked_users?: string[];
}

export interface TimetableSlot {
  id: string;
  subject: string;
  room: string;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  type: 'class' | 'break' | 'lab';
}

export interface DaySchedule {
  day: string;
  slots: TimetableSlot[];
}

export interface TimetableData {
  ownerName: string;
  ownerId: string;
  schedule: DaySchedule[];
}

export interface ResumeAnalysisResult {
  totalScore: number;
  categories: {
    keywordAnalysis: { score: number; description: string; missingKeywords: { name: string; example: string; importance: string }[] };
    jobFit: { score: number; description: string; gaps: string[] };
    achievements: { score: number; description: string; advice: string[] };
    formatting: { score: number; description: string; issues: string[] };
    language: { score: number; description: string; tone: string };
    branding: { score: number; description: string; onlinePresence: string };
  };
  summary: string;
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

export interface MessageReaction {
  id?: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at?: string;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'model' | 'system';
  text: string;
  isError?: boolean;
  timestamp: number;
  sender_name?: string;
  sender_id?: string;
  sender_avatar_url?: string;
  reply_to?: ChatMessage;
  reactions?: MessageReaction[];
  is_deleted_everyone?: boolean;
  forwarded?: boolean;
}

export interface LibraryFile {
  id: string;
  name: string;
  description?: string;
  subject: string;
  semester: string;
  type: string;
  uploadDate: number;
  size: string;
  status: 'pending' | 'approved' | 'rejected';
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

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  maps?: {
    uri?: string;
    title?: string;
  };
}

declare global {
  interface Window {
    pdfjsLib: any;
    mermaid: any;
  }
}

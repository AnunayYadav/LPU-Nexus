
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

export interface MessMenuItem {
  day: string;
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface LibraryFile {
  id: string;
  name: string;
  subject: string;
  type: 'Lecture' | 'Question Bank' | 'Lab Manual' | 'Assignment';
  uploadDate: number;
  size: string;
  isUserUploaded?: boolean;
}

// Global declaration for PDF.js loaded via CDN
declare global {
  interface Window {
    pdfjsLib: any;
    mermaid: any;
  }
}

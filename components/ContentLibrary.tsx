
import React, { useState, useEffect } from 'react';
import { LibraryFile } from '../types';
import { GoogleGenAI } from "@google/genai";

const SUBJECTS = ['CSE326', 'CSE408', 'MTH166', 'PEL121', 'INT213', 'Other'];
const CATEGORIES: LibraryFile['type'][] = ['Lecture', 'Question Bank', 'Lab Manual', 'Assignment'];

const ContentLibrary: React.FC = () => {
  const [files, setFiles] = useState<LibraryFile[]>(() => {
    const saved = localStorage.getItem('nexus_library');
    if (saved) return JSON.parse(saved);
    return []; // Start with an empty library
  });

  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [aiSummary, setAiSummary] = useState<{ id: string, text: string } | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    localStorage.setItem('nexus_library', JSON.stringify(files));
  }, [files]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Disabled in locked state
    return;
  };

  const deleteFile = (id: string) => {
    if (window.confirm("Delete this document from your library?")) {
      setFiles(files.filter(f => f.id !== id));
      if (aiSummary?.id === id) setAiSummary(null);
    }
  };

  const getAiSummary = async (file: LibraryFile) => {
    setIsSummarizing(true);
    setAiSummary(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Based on the document metadata: Name: ${file.name}, Subject: ${file.subject}, Type: ${file.type}. 
      Act as an academic expert. Provide a concise 3-sentence summary of what this document likely covers and 2 key topics to study. 
      Keep it high-level since you only see the title.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setAiSummary({ id: file.id, text: response.text || "Could not generate summary." });
    } catch (e) {
      alert("AI Scan failed. Check your connection.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const filteredFiles = files.filter(f => {
    const matchesSubject = selectedSubject === 'All' || f.subject === selectedSubject;
    const matchesCategory = selectedCategory === 'All' || f.type === selectedCategory;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20 relative">
      {/* Locked Overlay - Removed unintended blue tints */}
      <div className="absolute inset-0 z-20 backdrop-blur-md bg-white/40 dark:bg-black/60 flex items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-white/10">
         <div className="glass-panel p-10 rounded-3xl text-center max-w-sm shadow-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 animate-fade-in">
           <div className="w-20 h-20 bg-orange-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8 text-orange-600"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
           </div>
           <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 tracking-tighter uppercase">Nexus Vault Locked</h3>
           <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-8">
             The decentralized content library is currently in maintenance. This feature will be available exclusively to <strong>Nexus Pro</strong> members soon.
           </p>
           <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
             Notify Me
           </button>
         </div>
      </div>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 opacity-50 pointer-events-none">
        <div className="flex-1">
          <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-2 tracking-tighter">Content Library</h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Your decentralized vault for academic excellence.</p>
        </div>
        
        <div className="relative group w-full md:w-72">
          <input 
            type="file" 
            className="hidden" 
            id="lib-upload"
            accept=".pdf,.doc,.docx,.txt"
          />
          <label 
            className="flex items-center justify-center space-x-3 px-8 py-4 bg-orange-600 text-white rounded-2xl cursor-not-allowed"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span className="font-black text-xs uppercase tracking-widest">Upload to DB</span>
          </label>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-3xl flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 opacity-50 pointer-events-none">
        <div className="relative flex-1 w-full">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text" 
            readOnly
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-2xl text-sm outline-none"
          />
        </div>
      </div>

      {/* Cloud Quota Section */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-br from-indigo-600 to-purple-800 text-white shadow-2xl opacity-50 pointer-events-none">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl font-black tracking-tight">Nexus Cloud Storage</h3>
          <p className="text-xs text-indigo-100 font-medium">LPU Students get 5GB free academic storage. Stay organized, stay ahead.</p>
        </div>
      </div>
    </div>
  );
};

export default ContentLibrary;


import React, { useState, useEffect, useRef } from 'react';
import { LibraryFile } from '../types.ts';
import NexusServer from '../services/nexusServer.ts';

const SUBJECTS = ['CSE326', 'CSE408', 'MTH166', 'PEL121', 'INT213', 'Other'];
const CATEGORIES: LibraryFile['type'][] = ['Lecture', 'Question Bank', 'Lab Manual', 'Assignment'];

const ContentLibrary: React.FC = () => {
  const [files, setFiles] = useState<LibraryFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  
  // Server Status
  const [serverStatus, setServerStatus] = useState({ online: true, latency: '---', users: 'Global' });
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] Initializing Nexus Connection...', '[AUTH] Checking Registry Nodes']);

  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploadMeta, setUploadMeta] = useState({ subject: 'CSE326', type: 'Lecture' as LibraryFile['type'] });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFromDatabase = async () => {
    setIsLoading(true);
    setErrorState(null);
    const startTime = Date.now();
    addLog(`[QUERY] Syncing with cloud nodes...`);
    try {
      const data = await NexusServer.fetchFiles(searchQuery, selectedSubject);
      setFiles(data);
      const latency = Date.now() - startTime;
      setServerStatus(prev => ({ ...prev, online: true, latency: `${latency}ms` }));
      addLog(`[SUCCESS] Registry synced successfully.`);
    } catch (e: any) {
      setServerStatus(prev => ({ ...prev, online: false, latency: 'ERROR' }));
      const msg = e.message || "Nexus Cloud connection failed.";
      addLog(`[ERROR] ${msg}`);
      setErrorState(msg);
      console.error('Library Sync Failure:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFromDatabase();
  }, [selectedSubject]);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 5));
  };

  const handleUpload = async () => {
    if (!pendingFile) return;
    setIsUploading(true);
    addLog(`[PUSH] Streaming "${pendingFile.name}" to global storage...`);
    
    try {
      await NexusServer.uploadFile(pendingFile, uploadMeta.subject, uploadMeta.type);
      addLog(`[SUCCESS] Block confirmed. Record added to Nexus.`);
      setShowUploadModal(false);
      setPendingFile(null);
      fetchFromDatabase();
    } catch (e: any) {
      addLog(`[ERROR] ${e.message || "Upload failed."}`);
      alert(e.message || "Upload failed. Please ensure the 'nexus-documents' bucket exists and RLS policies are set.");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (file: LibraryFile) => {
    if (window.confirm("CRITICAL: Delete this shared record from the global database?")) {
      addLog(`[DELETE] Purging record ${file.id}...`);
      try {
        await NexusServer.deleteFile(file.id, (file as any).storage_path);
        addLog(`[SUCCESS] Record purged from registry.`);
        fetchFromDatabase();
      } catch (e: any) {
        addLog(`[ERROR] ${e.message || "Delete failed."}`);
        alert(`Delete failed: ${e.message}`);
      }
    }
  };

  const openFile = async (file: LibraryFile) => {
    addLog(`[GET] Requesting access URL for ${file.name}...`);
    try {
      const url = await NexusServer.getFileUrl((file as any).storage_path);
      window.open(url, '_blank');
    } catch (e: any) {
      addLog(`[ERROR] ${e.message || "File access denied."}`);
      alert(`Access denied: ${e.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-20">
      {/* Server Status Header */}
      <div className={`flex flex-col md:flex-row items-center justify-between p-6 glass-panel rounded-[32px] border shadow-2xl transition-colors duration-500 ${serverStatus.online ? 'border-blue-500/20 bg-blue-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="relative">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-colors ${serverStatus.online ? 'bg-blue-600 shadow-blue-600/30' : 'bg-red-600 shadow-red-600/30'}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-4 border-white dark:border-slate-950 rounded-full animate-pulse transition-colors ${serverStatus.online ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">Nexus Cloud Registry</h2>
            <div className={`flex items-center space-x-3 text-[9px] font-black uppercase tracking-widest ${serverStatus.online ? 'text-blue-500' : 'text-red-500'}`}>
              <span>Cloud: {serverStatus.online ? 'Supabase Synchronized' : 'Registry Connection Failed'}</span>
              <span>•</span>
              <span>Lat: {serverStatus.latency}</span>
              <span>•</span>
              <span>Shared Storage</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
           <div className="font-mono text-[9px] text-slate-400 bg-black/40 p-3 rounded-xl border border-white/5 w-64 h-16 overflow-hidden">
              {logs.map((log, i) => <div key={i} className="truncate">{log}</div>)}
           </div>
        </div>
      </div>

      {/* Directory Search & Filter */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text" 
            placeholder="Search the global database..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchFromDatabase()}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <select 
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="w-full px-5 py-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none appearance-none"
        >
          <option value="All">DATABASE/ALL</option>
          {SUBJECTS.map(s => <option key={s} value={s}>DB/{s}</option>)}
        </select>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!serverStatus.online}
        >
          Share New File
        </button>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => { setPendingFile(e.target.files?.[0] || null); setShowUploadModal(true); }} />

      {/* Centralized File Explorer */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Syncing Node Clusters...</p>
          </div>
        ) : errorState ? (
          <div className="col-span-full py-16 text-center bg-red-500/5 dark:bg-red-500/[0.02] rounded-[40px] border border-dashed border-red-500/30 px-10">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-16 h-16 mx-auto mb-4 text-red-500/40"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <p className="text-red-500 font-black uppercase tracking-widest text-sm mb-4">Node Connection Error</p>
            <div className="max-w-md mx-auto p-4 bg-red-500/10 rounded-2xl border border-red-500/20 mb-6">
              <p className="text-red-600 dark:text-red-400 text-xs font-bold leading-relaxed">{errorState}</p>
            </div>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold max-w-sm mx-auto">
              Please double check your SUPABASE_URL and SUPABASE_ANON_KEY. Also ensure the "documents" table and "nexus-documents" bucket exist.
            </p>
            <button 
              onClick={fetchFromDatabase}
              className="mt-6 px-6 py-2 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-slate-700 transition-colors"
            >
              Retry Sync
            </button>
          </div>
        ) : (
          files.map(file => (
            <div key={file.id} className="group glass-panel p-6 rounded-[32px] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/50 hover:shadow-2xl transition-all relative overflow-hidden flex flex-col h-full">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-blue-500/10 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <button onClick={() => deleteFile(file)} className="p-2 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                  </button>
               </div>
               
               <h3 className="text-sm font-black text-slate-800 dark:text-white mb-2 line-clamp-2" title={file.name}>{file.name}</h3>
               
               <div className="flex flex-wrap gap-2 mb-8">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg text-[9px] font-black uppercase tracking-widest">{file.subject}</span>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest">{file.type}</span>
               </div>

               <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase text-slate-400">Cloud Size</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{file.size}</span>
                  </div>
                  <button onClick={() => openFile(file)} className="flex items-center space-x-2 text-blue-600 hover:scale-105 transition-transform">
                    <span className="text-[10px] font-black uppercase tracking-widest">Access Resource</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </button>
               </div>
            </div>
          ))
        )}

        {!isLoading && !errorState && files.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 dark:bg-black/20 rounded-[40px] border border-dashed border-slate-300 dark:border-white/10">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-700 opacity-20"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
            <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Registry partition is currently empty.</p>
          </div>
        )}
      </div>

      {/* Database Submission Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
           <div className="bg-white dark:bg-slate-950 rounded-[40px] p-8 w-full max-w-md shadow-2xl border border-blue-500/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2 tracking-tighter uppercase">Commit to Nexus DB</h3>
              <p className="text-sm text-slate-500 font-medium mb-8 italic">Staging: "{pendingFile?.name}"</p>
              
              <div className="space-y-6 mb-10">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Subject Partition</label>
                  <select value={uploadMeta.subject} onChange={(e) => setUploadMeta({...uploadMeta, subject: e.target.value})} className="w-full bg-slate-100 dark:bg-black p-4 rounded-2xl text-sm font-bold outline-none border border-transparent dark:border-white/5 focus:ring-2 focus:ring-blue-500 transition-all">
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Resource Type</label>
                  <select value={uploadMeta.type} onChange={(e) => setUploadMeta({...uploadMeta, type: e.target.value as LibraryFile['type']})} className="w-full bg-slate-100 dark:bg-black p-4 rounded-2xl text-sm font-bold outline-none border border-transparent dark:border-white/5 focus:ring-2 focus:ring-blue-500 transition-all">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setShowUploadModal(false)} className="flex-1 text-[10px] font-black uppercase tracking-widest text-slate-500">Abort</button>
                <button 
                  onClick={handleUpload} 
                  disabled={isUploading} 
                  className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
                >
                  {isUploading ? 'Pushing Data...' : 'Commit Upload'}
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ContentLibrary;

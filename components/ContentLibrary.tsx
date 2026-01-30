
import React, { useState, useEffect, useRef } from 'react';
import { LibraryFile } from '../types.ts';
import NexusServer from '../services/nexusServer.ts';

const SUBJECTS = ['CSE326', 'CSE408', 'MTH166', 'PEL121', 'INT213', 'Other'];
const CATEGORIES: string[] = ['Lecture', 'Question Bank', 'Lab Manual', 'Assignment', 'Syllabus', 'Other'];

const ContentLibrary: React.FC = () => {
  const [files, setFiles] = useState<LibraryFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  
  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploadMeta, setUploadMeta] = useState({
    name: '',
    description: '',
    subject: 'CSE326',
    customSubject: '',
    type: 'Lecture',
    customType: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFromDatabase = async () => {
    setIsLoading(true);
    setErrorState(false);
    try {
      const data = await NexusServer.fetchFiles(searchQuery, selectedSubject);
      setFiles(data);
    } catch (e: any) {
      setErrorState(true);
      console.error('Library Sync Failure (Technical details hidden from UI)');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFromDatabase();
  }, [selectedSubject]);

  useEffect(() => {
    if (pendingFile) {
      setUploadMeta({
        ...uploadMeta,
        name: pendingFile.name,
        description: '',
        customSubject: '',
        customType: ''
      });
    }
  }, [pendingFile]);

  const handleUpload = async () => {
    if (!pendingFile || !uploadMeta.name.trim()) return;
    
    setIsUploading(true);
    
    const finalSubject = uploadMeta.subject === 'Other' ? (uploadMeta.customSubject || 'Other') : uploadMeta.subject;
    const finalType = uploadMeta.type === 'Other' ? (uploadMeta.customType || 'Other') : uploadMeta.type;

    try {
      await NexusServer.uploadFile(
        pendingFile, 
        uploadMeta.name, 
        uploadMeta.description, 
        finalSubject, 
        finalType
      );
      setShowUploadModal(false);
      setPendingFile(null);
      fetchFromDatabase();
    } catch (e: any) {
      alert("Upload failed. The library service is currently unavailable.");
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (file: LibraryFile) => {
    if (window.confirm("Remove this resource from the library?")) {
      try {
        await NexusServer.deleteFile(file.id, (file as any).storage_path);
        fetchFromDatabase();
      } catch (e: any) {
        alert(`Delete failed. Please try again.`);
      }
    }
  };

  const openFile = async (file: LibraryFile) => {
    try {
      const url = await NexusServer.getFileUrl((file as any).storage_path);
      window.open(url, '_blank');
    } catch (e: any) {
      alert(`Unable to access file.`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20 px-4 md:px-0">
      {/* Simplified Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase flex items-center gap-3">
            Content Library
            <span className="text-[10px] font-black bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full uppercase tracking-widest border border-orange-200 dark:border-orange-800/50">Shared</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium mt-1">Access verified academic resources shared by the LPU community.</p>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-gradient-to-r from-orange-600 to-red-700 hover:shadow-orange-600/30 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 group"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Upload New Resource
        </button>
      </header>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text" 
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchFromDatabase()}
            className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/40 transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-4">
          <div className="relative group min-w-[180px]">
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full pl-6 pr-12 py-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-orange-500/40 transition-all shadow-sm hover:border-orange-500/30"
            >
              <option value="All">All Subjects</option>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-orange-500 transition-colors group-focus-within:text-red-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3.5 h-3.5"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <button 
            onClick={fetchFromDatabase}
            className="p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-600 dark:text-white hover:bg-orange-500/10 hover:text-orange-500 transition-colors shadow-sm"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
          </button>
        </div>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => { setPendingFile(e.target.files?.[0] || null); setShowUploadModal(true); }} />

      {/* File Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-32 animate-pulse">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">Syncing Library Data...</p>
          </div>
        ) : errorState ? (
          <div className="col-span-full py-20 text-center glass-panel rounded-[40px] border-dashed border-red-500/30 px-10 bg-red-500/[0.02]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-16 h-16 mx-auto mb-4 text-red-500/40"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p className="text-red-500 font-black uppercase tracking-widest text-sm mb-4">Library Connection Failed</p>
            <p className="text-slate-500 text-xs font-bold max-w-sm mx-auto mb-8 leading-relaxed">We're having trouble connecting to the document library. Please check your internet or try again later.</p>
            <button onClick={fetchFromDatabase} className="px-8 py-3 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-slate-700 transition-colors shadow-lg">Retry Connection</button>
          </div>
        ) : (
          files.map(file => (
            <div key={file.id} className="group glass-panel p-6 rounded-[32px] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/50 hover:shadow-2xl transition-all relative overflow-hidden flex flex-col h-full border-t-4 border-t-transparent hover:border-t-orange-500">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-orange-500/10 dark:bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <button onClick={() => deleteFile(file)} className="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                  </button>
               </div>
               
               <h3 className="text-sm font-black text-slate-800 dark:text-white mb-2 line-clamp-2 leading-snug" title={file.name}>{file.name}</h3>
               {file.description && (
                 <p className="text-[10px] text-slate-500 mb-4 line-clamp-2 italic">{file.description}</p>
               )}
               
               <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                  <span className="px-3 py-1 bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 rounded-lg text-[8px] font-black uppercase tracking-widest border border-orange-100 dark:border-orange-900/40">{file.subject}</span>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-lg text-[8px] font-black uppercase tracking-widest">{file.type}</span>
               </div>

               <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase text-slate-400">File Size</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{file.size}</span>
                  </div>
                  <button onClick={() => openFile(file)} className="flex items-center space-x-2 text-orange-600 group/btn">
                    <span className="text-[10px] font-black uppercase tracking-widest group-hover/btn:mr-1 transition-all">Access</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </button>
               </div>
            </div>
          ))
        )}

        {!isLoading && !errorState && files.length === 0 && (
          <div className="col-span-full py-20 text-center glass-panel rounded-[40px] border-dashed border-slate-300 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.01]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-700 opacity-20"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
            <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">No resources found matching your search.</p>
          </div>
        )}
      </div>

      {/* Redesigned Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
           <div className="bg-white dark:bg-slate-950 rounded-[40px] w-full max-w-md shadow-2xl border border-white/10 relative overflow-hidden flex flex-col my-8">
              {/* Header Gradient */}
              <div className="bg-gradient-to-r from-orange-600 to-red-700 p-8 text-white relative">
                 <button onClick={() => setShowUploadModal(false)} className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                 </button>
                 <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-7 h-7"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                 </div>
                 <h3 className="text-2xl font-black tracking-tighter uppercase leading-none">Publish Resource</h3>
                 <p className="text-white/70 text-[10px] font-black mt-2 uppercase tracking-widest">Share knowledge with Nexus Hub</p>
              </div>
              
              <div className="p-8 space-y-5">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Display Name</label>
                  <input 
                    type="text"
                    value={uploadMeta.name}
                    onChange={(e) => setUploadMeta({...uploadMeta, name: e.target.value})}
                    className="w-full bg-slate-100 dark:bg-black/40 p-4 rounded-2xl text-sm font-bold outline-none border border-transparent dark:border-white/5 focus:ring-2 focus:ring-orange-500 transition-all shadow-inner"
                    placeholder="Enter resource title..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Short Description (Optional)</label>
                  <textarea 
                    value={uploadMeta.description}
                    onChange={(e) => setUploadMeta({...uploadMeta, description: e.target.value})}
                    className="w-full bg-slate-100 dark:bg-black/40 p-4 rounded-2xl text-sm font-bold outline-none border border-transparent dark:border-white/5 focus:ring-2 focus:ring-orange-500 transition-all resize-none h-20 shadow-inner"
                    placeholder="Brief details about the resource..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Academic Subject</label>
                    <div className="relative group">
                      <select 
                        value={uploadMeta.subject} 
                        onChange={(e) => setUploadMeta({...uploadMeta, subject: e.target.value})} 
                        className="w-full bg-slate-100 dark:bg-black/40 pl-5 pr-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none border border-transparent dark:border-white/5 focus:ring-2 focus:ring-orange-500 transition-all appearance-none cursor-pointer shadow-inner"
                      >
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-orange-500 transition-colors group-focus-within:text-red-500">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3.5 h-3.5"><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Document Type</label>
                    <div className="relative group">
                      <select 
                        value={uploadMeta.type} 
                        onChange={(e) => setUploadMeta({...uploadMeta, type: e.target.value})} 
                        className="w-full bg-slate-100 dark:bg-black/40 pl-5 pr-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none border border-transparent dark:border-white/5 focus:ring-2 focus:ring-orange-500 transition-all appearance-none cursor-pointer shadow-inner"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-orange-500 transition-colors group-focus-within:text-red-500">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3.5 h-3.5"><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                    </div>
                  </div>
                </div>

                {uploadMeta.subject === 'Other' && (
                  <div className="animate-fade-in">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Specify Subject</label>
                    <input 
                      type="text"
                      value={uploadMeta.customSubject}
                      onChange={(e) => setUploadMeta({...uploadMeta, customSubject: e.target.value})}
                      className="w-full bg-slate-100 dark:bg-black/40 p-4 rounded-2xl text-sm font-bold outline-none border border-transparent dark:border-white/5 focus:ring-2 focus:ring-orange-500 transition-all shadow-inner"
                      placeholder="e.g., PSY101"
                    />
                  </div>
                )}

                {uploadMeta.type === 'Other' && (
                  <div className="animate-fade-in">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Specify Type</label>
                    <input 
                      type="text"
                      value={uploadMeta.customType}
                      onChange={(e) => setUploadMeta({...uploadMeta, customType: e.target.value})}
                      className="w-full bg-slate-100 dark:bg-black/40 p-4 rounded-2xl text-sm font-bold outline-none border border-transparent dark:border-white/5 focus:ring-2 focus:ring-orange-500 transition-all shadow-inner"
                      placeholder="e.g., Thesis, Project Paper"
                    />
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setShowUploadModal(false)} 
                    className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                  >
                    Discard
                  </button>
                  <button 
                    onClick={handleUpload} 
                    disabled={isUploading || !uploadMeta.name.trim()} 
                    className="flex-[2] bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-600/20 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isUploading ? 'Uploading Data...' : 'Commit to Library'}
                  </button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ContentLibrary;

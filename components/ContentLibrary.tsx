
import React, { useState, useEffect, useRef } from 'react';
import { LibraryFile, UserProfile } from '../types.ts';
import NexusServer from '../services/nexusServer.ts';

const SUBJECTS = ['CSE326', 'CSE408', 'MTH166', 'PEL121', 'INT213', 'Other'];
const CATEGORIES: string[] = ['Lecture', 'Question Bank', 'Lab Manual', 'Assignment', 'Syllabus', 'Other'];

interface ContentLibraryProps {
  userProfile: UserProfile | null;
}

const ContentLibrary: React.FC<ContentLibraryProps> = ({ userProfile }) => {
  const [files, setFiles] = useState<LibraryFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  
  // View States
  const [isAdminView, setIsAdminView] = useState(false);
  
  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
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

  // Edit States
  const [editingFile, setEditingFile] = useState<LibraryFile | null>(null);
  const [editMeta, setEditMeta] = useState({
    name: '',
    description: '',
    subject: '',
    customSubject: '',
    type: '',
    customType: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFromDatabase = async () => {
    setIsLoading(true);
    setErrorState(false);
    try {
      const data = isAdminView 
        ? await NexusServer.fetchPendingFiles()
        : await NexusServer.fetchFiles(searchQuery, selectedSubject);
      setFiles(data);
    } catch (e: any) {
      setErrorState(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFromDatabase();
  }, [selectedSubject, isAdminView]);

  useEffect(() => {
    if (!userProfile?.is_admin && isAdminView) {
      setIsAdminView(false);
    }
  }, [userProfile]);

  const handleUpload = async () => {
    if (!pendingFile || !uploadMeta.name.trim()) return;
    setIsUploading(true);
    const finalSubject = uploadMeta.subject === 'Other' ? (uploadMeta.customSubject || 'Other') : uploadMeta.subject;
    const finalType = uploadMeta.type === 'Other' ? (uploadMeta.customType || 'Other') : uploadMeta.type;
    try {
      await NexusServer.uploadFile(pendingFile, uploadMeta.name, uploadMeta.description, finalSubject, finalType);
      setUploadSuccess(true);
      setTimeout(() => setShowUploadModal(false), 3000);
    } catch (e: any) {
      alert("Submission failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleApprove = async (file: LibraryFile) => {
    try {
      await NexusServer.approveFile(file.id);
      fetchFromDatabase();
    } catch (e: any) {
      alert("Approval failed.");
    }
  };

  const startEditing = (file: LibraryFile) => {
    const isSubjectCustom = !SUBJECTS.includes(file.subject);
    const isTypeCustom = !CATEGORIES.includes(file.type);
    setEditingFile(file);
    setEditMeta({
      name: file.name,
      description: file.description || '',
      subject: isSubjectCustom ? 'Other' : file.subject,
      customSubject: isSubjectCustom ? file.subject : '',
      type: isTypeCustom ? 'Other' : file.type,
      customType: isTypeCustom ? file.type : ''
    });
  };

  const deleteFile = async (file: LibraryFile) => {
    if (window.confirm("Permanently remove this resource?")) {
      try {
        await NexusServer.deleteFile(file.id, file.storage_path);
        fetchFromDatabase();
      } catch (e: any) {
        alert(`Request failed.`);
      }
    }
  };

  const openFile = async (file: LibraryFile) => {
    try {
      const url = await NexusServer.getFileUrl(file.storage_path);
      window.open(url, '_blank');
    } catch (e: any) {
      alert(`Access denied.`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20 px-4 md:px-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase flex items-center gap-3">
            Content Library
            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border shadow-sm ${
              isAdminView 
                ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/50' 
                : 'bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800/50'
            }`}>
              {isAdminView ? 'Moderation' : 'Verified'}
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium mt-1">
            {isAdminView ? 'Review and approve community contributions.' : 'Access trusted academic resources reviewed by the Nexus community.'}
          </p>
        </div>
        
        <div className="flex gap-4">
          {userProfile?.is_admin && (
            <button onClick={() => setIsAdminView(!isAdminView)} className={`px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 border ${isAdminView ? 'bg-slate-900 text-white' : 'bg-white dark:bg-white/5 dark:text-slate-400'}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              {isAdminView ? 'Exit Admin' : 'Admin View'}
            </button>
          )}
          
          {!isAdminView && (
            <button onClick={() => fileInputRef.current?.click()} className="bg-gradient-to-r from-orange-600 to-red-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 group">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Contribute
            </button>
          )}
        </div>
      </header>

      {!isAdminView && (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" placeholder="Search verified documents..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-bold outline-none shadow-sm focus:ring-2 focus:ring-orange-500/40 transition-all" />
          </div>
          <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="pl-6 pr-12 py-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-orange-500/40">
            <option value="All">All Subjects</option>
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}

      <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => { setPendingFile(e.target.files?.[0] || null); setShowUploadModal(true); }} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-32 animate-pulse">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">Syncing Records...</p>
          </div>
        ) : (
          files.map(file => (
            <div key={file.id} className="group glass-panel p-6 rounded-[32px] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/50 hover:shadow-2xl transition-all relative overflow-hidden flex flex-col h-full border-t-4 border-t-transparent hover:border-t-orange-500">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-orange-500/10 dark:bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-600">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {userProfile?.is_admin && (
                       <button onClick={() => startEditing(file)} className="p-2 text-slate-300 hover:text-orange-500 transition-colors">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                       </button>
                    )}
                    <button onClick={() => deleteFile(file)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                    </button>
                  </div>
               </div>
               <h3 className="text-sm font-black text-slate-800 dark:text-white mb-2 line-clamp-2">{file.name}</h3>
               {file.description && <p className="text-[10px] text-slate-500 mb-4 line-clamp-2 italic">{file.description}</p>}
               <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                  <span className="px-3 py-1 bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 rounded-lg text-[8px] font-black uppercase tracking-widest border border-orange-100 dark:border-orange-900/40">{file.subject}</span>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-lg text-[8px] font-black uppercase tracking-widest">{file.type}</span>
               </div>
               <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{file.size}</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => openFile(file)} className="flex items-center space-x-2 text-orange-600 group/btn">
                      <span className="text-[10px] font-black uppercase tracking-widest">View</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                    {isAdminView && <button onClick={() => handleApprove(file)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Approve</button>}
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
           <div className="bg-white dark:bg-slate-950 rounded-[40px] w-full max-w-md shadow-2xl border border-white/10 relative overflow-hidden flex flex-col my-8">
              {!uploadSuccess ? (
                <>
                  <div className="bg-gradient-to-r from-orange-600 to-red-700 p-8 text-white relative">
                    <button onClick={() => setShowUploadModal(false)} className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
                    <h3 className="text-2xl font-black tracking-tighter uppercase leading-none">Submit for Review</h3>
                    <p className="text-white/70 text-[10px] font-black mt-2 uppercase tracking-widest">Share knowledge with the LPU community</p>
                  </div>
                  <div className="p-8 space-y-5">
                    <input type="text" value={uploadMeta.name} onChange={(e) => setUploadMeta({...uploadMeta, name: e.target.value})} className="w-full bg-slate-100 dark:bg-black/40 p-4 rounded-2xl text-sm font-bold outline-none border border-transparent focus:ring-2 focus:ring-orange-500 shadow-inner" placeholder="Enter resource title..." />
                    <textarea value={uploadMeta.description} onChange={(e) => setUploadMeta({...uploadMeta, description: e.target.value})} className="w-full bg-slate-100 dark:bg-black/40 p-4 rounded-2xl text-sm font-bold outline-none border border-transparent focus:ring-2 focus:ring-orange-500 transition-all resize-none h-20 shadow-inner" placeholder="Brief details..." />
                    <div className="grid grid-cols-2 gap-4">
                      <select value={uploadMeta.subject} onChange={(e) => setUploadMeta({...uploadMeta, subject: e.target.value})} className="w-full bg-slate-100 dark:bg-black/40 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none border border-transparent focus:ring-2 focus:ring-orange-500 appearance-none shadow-inner">
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <select value={uploadMeta.type} onChange={(e) => setUploadMeta({...uploadMeta, type: e.target.value})} className="w-full bg-slate-100 dark:bg-black/40 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none border border-transparent focus:ring-2 focus:ring-orange-500 appearance-none shadow-inner">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    {uploadMeta.subject === 'Other' && <input type="text" value={uploadMeta.customSubject} onChange={(e) => setUploadMeta({...uploadMeta, customSubject: e.target.value})} className="w-full bg-slate-100 dark:bg-black/40 p-4 rounded-2xl text-sm font-bold outline-none shadow-inner" placeholder="Specify Subject..." />}
                    <div className="flex gap-4 pt-4">
                      <button onClick={() => setShowUploadModal(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Cancel</button>
                      <button onClick={handleUpload} disabled={isUploading || !uploadMeta.name.trim()} className="flex-[2] bg-orange-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 disabled:opacity-50">{isUploading ? 'Securing Data...' : 'Submit'}</button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center space-y-6">
                   <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-10 h-10"><polyline points="20 6 9 17 4 12"/></svg></div>
                   <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase">Submission Received!</h3>
                   <button onClick={() => setShowUploadModal(false)} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-widest">Done</button>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default ContentLibrary;

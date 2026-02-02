
import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { LibraryFile, UserProfile, Folder } from '../types.ts';
import NexusServer from '../services/nexusServer.ts';

const SORT_OPTIONS = [
  { label: 'NEWEST', value: 'newest' },
  { label: 'OLDEST', value: 'oldest' },
  { label: 'A-Z', value: 'az' },
  { label: 'SIZE', value: 'size_desc' }
];

interface ContentLibraryProps {
  userProfile: UserProfile | null;
  initialView?: 'browse' | 'my-uploads';
}

const FolderIcon = ({ type, size = "w-10 h-10" }: { type: 'semester' | 'subject' | 'category' | 'root', size?: string }) => {
  const colors = {
    root: 'text-slate-400',
    semester: 'text-orange-600',
    subject: 'text-blue-600',
    category: 'text-emerald-600'
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`${size} ${colors[type]} mb-4 transition-colors`}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
};

const ContentLibrary: React.FC<ContentLibraryProps> = ({ userProfile, initialView = 'browse' }) => {
  const [files, setFiles] = useState<LibraryFile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [viewMode, setViewMode] = useState<'browse' | 'my-uploads'>(initialView);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Navigation State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  
  const [activeSemester, setActiveSemester] = useState<Folder | null>(null);
  const [activeSubject, setActiveSubject] = useState<Folder | null>(null);
  const [activeCategory, setActiveCategory] = useState<Folder | null>(null);

  const [isAdminView, setIsAdminView] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processSuccess, setProcessSuccess] = useState(false);
  
  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [metaForm, setMetaForm] = useState({ name: '', description: '', semester: '', subject: '', type: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialView) setViewMode(initialView);
  }, [initialView]);

  const fetchRegistry = useCallback(async () => {
    setIsLoading(true);
    try {
      const folderList = await NexusServer.fetchFolders();
      setFolders(folderList);

      let data: LibraryFile[] = [];
      if (isAdminView) {
        data = await NexusServer.fetchPendingFiles();
      } else if (viewMode === 'my-uploads' && userProfile) {
        data = await NexusServer.fetchUserFiles(userProfile.id);
      } else {
        data = await NexusServer.fetchFiles(searchQuery, 'All');
      }

      if (selectedType !== 'All') data = data.filter(f => f.type === selectedType);
      
      // Filter based on hierarchy if not searching
      if (!searchQuery && !isAdminView && viewMode === 'browse') {
        if (activeSemester) data = data.filter(f => f.semester === activeSemester.name);
        if (activeSubject) data = data.filter(f => f.subject === activeSubject.name);
        if (activeCategory) data = data.filter(f => f.type === activeCategory.name);
      }

      data.sort((a, b) => {
        if (sortBy === 'newest') return b.uploadDate - a.uploadDate;
        if (sortBy === 'oldest') return a.uploadDate - b.uploadDate;
        if (sortBy === 'az') return a.name.localeCompare(b.name);
        return 0;
      });
      setFiles(data);
    } catch (e: any) { setError(e.message); } finally { setIsLoading(false); }
  }, [isAdminView, viewMode, userProfile, searchQuery, selectedType, sortBy, activeSemester, activeSubject, activeCategory]);

  useEffect(() => { fetchRegistry(); }, [fetchRegistry]);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    setIsProcessing(true);
    try {
      let type: 'semester' | 'subject' | 'category' = 'semester';
      let parentId: string | null = null;
      
      if (activeSubject) { type = 'category'; parentId = activeSubject.id; }
      else if (activeSemester) { type = 'subject'; parentId = activeSemester.id; }

      await NexusServer.createFolder(newFolderName, type, parentId);
      setNewFolderName('');
      setShowFolderModal(false);
      fetchRegistry();
    } catch (e: any) { alert(e.message); } finally { setIsProcessing(false); }
  };

  const handleUpload = async () => {
    if (!pendingFile || !metaForm.name.trim() || !userProfile || !metaForm.semester || !metaForm.subject || !metaForm.type) return;
    setIsProcessing(true);
    try {
      await NexusServer.uploadFile(
        pendingFile, 
        metaForm.name, 
        metaForm.description, 
        metaForm.subject, 
        metaForm.semester, 
        metaForm.type, 
        userProfile.id, 
        userProfile?.is_admin || false
      );
      setProcessSuccess(true);
      setTimeout(() => { setShowUploadModal(false); setProcessSuccess(false); fetchRegistry(); }, 1500);
    } catch (e: any) { alert(e.message); } finally { setIsProcessing(false); }
  };

  // Helper for hierarchical display in main view
  const currentFolders = folders.filter(f => {
    if (!activeSemester) return f.type === 'semester';
    if (!activeSubject) return f.type === 'subject' && f.parent_id === activeSemester.id;
    if (!activeCategory) return f.type === 'category' && f.parent_id === activeSubject.id;
    return false;
  });

  // Visual Path Selector Logic for Modal
  const modalAvailableSemesters = folders.filter(f => f.type === 'semester');
  const modalSelectedSemester = folders.find(f => f.name === metaForm.semester && f.type === 'semester');
  
  const modalAvailableSubjects = folders.filter(f => f.type === 'subject' && f.parent_id === modalSelectedSemester?.id);
  const modalSelectedSubject = folders.find(f => f.name === metaForm.subject && f.type === 'subject');
  
  const modalAvailableCategories = folders.filter(f => f.type === 'category' && f.parent_id === modalSelectedSubject?.id);

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-10 animate-fade-in pb-20 px-4 md:px-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tighter uppercase flex items-center gap-4">
            Library
            <span className="text-[10px] font-black px-3 py-1 rounded-lg border bg-orange-500/10 text-orange-600 border-orange-500/20 uppercase tracking-widest">Nexus FS</span>
          </h2>
          <nav className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
            <button onClick={() => { setActiveSemester(null); setActiveSubject(null); setActiveCategory(null); }} className="hover:text-orange-500">Root</button>
            {activeSemester && <><span className="opacity-30">/</span><button onClick={() => { setActiveSubject(null); setActiveCategory(null); }} className={!activeSubject ? 'text-orange-600' : 'hover:text-orange-500'}>{activeSemester.name}</button></>}
            {activeSubject && <><span className="opacity-30">/</span><button onClick={() => setActiveCategory(null)} className={!activeCategory ? 'text-orange-600' : 'hover:text-orange-500'}>{activeSubject.name}</button></>}
            {activeCategory && <><span className="opacity-30">/</span><span className="text-orange-600">{activeCategory.name}</span></>}
          </nav>
        </div>
        <div className="flex gap-3">
           {userProfile?.is_admin && viewMode === 'browse' && (
             <button 
              onClick={() => setShowFolderModal(true)}
              className="w-14 h-14 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center text-orange-600 hover:scale-110 active:scale-95 transition-all shadow-lg"
              title="Create Folder"
             >
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path d="M12 5v14M5 12h14"/></svg>
             </button>
           )}
           <button 
            onClick={() => { setViewMode(viewMode === 'browse' ? 'my-uploads' : 'browse'); setActiveSemester(null); setActiveSubject(null); setActiveCategory(null); }}
            className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all flex items-center gap-3 ${viewMode === 'my-uploads' ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-transparent' : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5'}`}
           >
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
             {viewMode === 'my-uploads' ? 'Exit My Hub' : 'My Uploads'}
           </button>
           <button onClick={() => { if (!userProfile) { alert("Please sign in to contribute."); return; } fileInputRef.current?.click(); }} className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Contribute
          </button>
        </div>
      </header>

      {viewMode === 'browse' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-8">
          <div className="md:col-span-12 relative">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" placeholder="Search library..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="col-span-full py-40 text-center animate-pulse text-slate-400 font-black uppercase text-xs tracking-widest">Syncing Registry...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {/* FOLDERS GRID */}
          {!searchQuery && !isAdminView && viewMode === 'browse' && (
            currentFolders.map(folder => (
              <div 
                key={folder.id} 
                onClick={() => {
                  if (folder.type === 'semester') setActiveSemester(folder);
                  else if (folder.type === 'subject') setActiveSubject(folder);
                  else if (folder.type === 'category') setActiveCategory(folder);
                }} 
                className="group p-8 rounded-[40px] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/40 hover:border-orange-500 hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden flex flex-col justify-center min-h-[180px]"
              >
                <FolderIcon type={folder.type} size="w-12 h-12" />
                <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">{folder.name}</h3>
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform"><FolderIcon type={folder.type} size="w-24 h-24" /></div>
              </div>
            ))
          )}

          {/* FILES GRID */}
          {files.map(file => (
            <FileCard 
              key={file.id} 
              file={file} 
              isAdmin={isAdminView} 
              isPersonal={viewMode === 'my-uploads'} 
              onApprove={() => NexusServer.approveFile(file.id).then(fetchRegistry)} 
              onAccess={() => NexusServer.getFileUrl(file.storage_path).then(url => window.open(url, '_blank'))} 
            />
          ))}

          {files.length === 0 && currentFolders.length === 0 && (
            <div className="col-span-full py-40 text-center text-slate-400 font-black uppercase text-xs tracking-[0.2em] opacity-40">This directory is empty.</div>
          )}
        </div>
      )}

      {/* CREATE FOLDER MODAL */}
      {showFolderModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-950 rounded-[40px] w-full max-w-sm shadow-2xl border border-white/10 overflow-hidden flex flex-col">
            <div className="bg-slate-900 p-8 text-white relative">
              <button onClick={() => setShowFolderModal(false)} className="absolute top-6 right-6 p-2 opacity-50 hover:opacity-100"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
              <h3 className="text-2xl font-black tracking-tighter uppercase">New Folder</h3>
              <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">
                Create in {activeSubject?.name || activeSemester?.name || 'Root'}
              </p>
            </div>
            <div className="p-8 space-y-4">
              <input 
                autoFocus
                placeholder="e.g. Sem 4, CSE310..."
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                className="w-full bg-slate-100 dark:bg-black/40 p-5 rounded-2xl font-bold border border-transparent focus:ring-2 focus:ring-orange-500 outline-none dark:text-white"
              />
              <button onClick={handleCreateFolder} disabled={isProcessing} className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 disabled:opacity-50 transition-all">
                {isProcessing ? 'Creating...' : 'Create Folder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ENHANCED UPLOAD MODAL WITH VISUAL SELECTOR */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-950 rounded-[40px] w-full max-w-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-orange-600 to-red-700 p-8 text-white relative flex-shrink-0">
              <button onClick={() => setShowUploadModal(false)} className="absolute top-6 right-6 p-2 opacity-50 hover:opacity-100 transition-opacity"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
              <h3 className="text-2xl font-black tracking-tighter uppercase leading-none">Contribute</h3>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-2">Document Registry</p>
            </div>
            <div className="p-8 space-y-8 overflow-y-auto no-scrollbar flex-1">
              {processSuccess ? (
                <div className="text-center py-20 animate-fade-in">
                   <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-10 h-10 text-green-500"><polyline points="20 6 9 17 4 12"/></svg>
                   </div>
                   <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Sync Successful</h3>
                   <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-2">File deployed to moderation.</p>
                </div>
              ) : (
                <>
                  <section className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">File Details</h4>
                    <div><label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Display Name</label><input value={metaForm.name} onChange={e => setMetaForm({...metaForm, name: e.target.value})} className="w-full bg-slate-100 dark:bg-black/40 p-4 rounded-2xl font-bold border border-transparent focus:ring-2 focus:ring-orange-500 outline-none dark:text-white transition-all" /></div>
                    <div><label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Short Description</label><textarea value={metaForm.description} onChange={e => setMetaForm({...metaForm, description: e.target.value})} className="w-full bg-slate-100 dark:bg-black/40 p-4 rounded-2xl font-bold border border-transparent focus:ring-2 focus:ring-orange-500 outline-none dark:text-white transition-all h-24 resize-none" /></div>
                  </section>

                  <section className="space-y-6">
                    <header className="flex items-center justify-between">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Destination Path</h4>
                      <div className="flex gap-2">
                         <div className={`w-2 h-2 rounded-full ${metaForm.semester ? 'bg-orange-500' : 'bg-slate-200'}`} />
                         <div className={`w-2 h-2 rounded-full ${metaForm.subject ? 'bg-blue-500' : 'bg-slate-200'}`} />
                         <div className={`w-2 h-2 rounded-full ${metaForm.type ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                      </div>
                    </header>

                    {/* Step 1: Semester Selector */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                        1. Select Semester {metaForm.semester && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3 text-orange-500"><polyline points="20 6 9 17 4 12"/></svg>}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {modalAvailableSemesters.map(sem => (
                          <button 
                            key={sem.id} 
                            onClick={() => setMetaForm({...metaForm, semester: sem.name, subject: '', type: ''})}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${metaForm.semester === sem.name ? 'bg-orange-600 border-orange-700 text-white shadow-lg' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 hover:border-orange-500'}`}
                          >
                            {sem.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Step 2: Subject Selector */}
                    {metaForm.semester && (
                      <div className="space-y-3 animate-fade-in">
                        <p className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                          2. Select Subject {metaForm.subject && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3 text-blue-500"><polyline points="20 6 9 17 4 12"/></svg>}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {modalAvailableSubjects.map(sub => (
                            <button 
                              key={sub.id} 
                              onClick={() => setMetaForm({...metaForm, subject: sub.name, type: ''})}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${metaForm.subject === sub.name ? 'bg-blue-600 border-blue-700 text-white shadow-lg' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 hover:border-blue-500'}`}
                            >
                              {sub.name}
                            </button>
                          ))}
                          {modalAvailableSubjects.length === 0 && <p className="text-[9px] font-black text-slate-400 uppercase">No subjects in this semester.</p>}
                        </div>
                      </div>
                    )}

                    {/* Step 3: Category Selector */}
                    {metaForm.subject && (
                      <div className="space-y-3 animate-fade-in">
                        <p className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                          3. Select Category {metaForm.type && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3 text-emerald-500"><polyline points="20 6 9 17 4 12"/></svg>}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {modalAvailableCategories.map(cat => (
                            <button 
                              key={cat.id} 
                              onClick={() => setMetaForm({...metaForm, type: cat.name})}
                              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${metaForm.type === cat.name ? 'bg-emerald-600 border-emerald-700 text-white shadow-lg' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 hover:border-emerald-500'}`}
                            >
                              {cat.name}
                            </button>
                          ))}
                          {modalAvailableCategories.length === 0 && <p className="text-[9px] font-black text-slate-400 uppercase">No categories defined for this subject.</p>}
                        </div>
                      </div>
                    )}
                  </section>
                </>
              )}
            </div>
            {!processSuccess && (
              <div className="p-8 pt-4 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between mb-4">
                   <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                     Ready to Sync?
                   </div>
                   <div className="text-[10px] font-black text-orange-600 uppercase">
                     {metaForm.semester && metaForm.subject && metaForm.type ? 'Path Validated' : 'Path Incomplete'}
                   </div>
                </div>
                <button 
                  onClick={handleUpload} 
                  disabled={isProcessing || !metaForm.name.trim() || !metaForm.semester || !metaForm.subject || !metaForm.type} 
                  className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 disabled:opacity-30 transition-all flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <div className="w-5 h-5 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Deploy to Registry</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <input type="file" ref={fileInputRef} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setPendingFile(f); setMetaForm(p => ({ ...p, name: f.name.replace(/\.[^/.]+$/, ""), semester: activeSemester?.name || '', subject: activeSubject?.name || '', type: activeCategory?.name || '' })); setShowUploadModal(true); } }} />
    </div>
  );
};

const FileCard: React.FC<{ 
  file: LibraryFile; 
  isAdmin: boolean; 
  isPersonal?: boolean;
  onApprove?: () => void; 
  onAccess: () => void; 
}> = ({ file, isAdmin, isPersonal, onApprove, onAccess }) => {
  const statusConfig = {
    pending: { label: 'Under Review', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    approved: { label: 'Approved', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    rejected: { label: 'Revision Required', color: 'text-red-500', bg: 'bg-red-500/10' }
  };

  const status = statusConfig[file.status] || statusConfig.pending;

  return (
    <div className="group p-6 rounded-[40px] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/40 hover:border-orange-500 hover:shadow-2xl transition-all relative overflow-hidden flex flex-col min-h-[220px]">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center group-hover:text-orange-500 transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        {isPersonal && <div className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${status.bg} ${status.color}`}>{status.label}</div>}
      </div>
      <h3 className="text-base md:text-lg font-black text-slate-800 dark:text-white tracking-tight leading-tight line-clamp-2 mb-2">{file.name}</h3>
      <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border border-orange-500/10 text-orange-600 bg-orange-500/5">{file.subject}</span>
        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border border-blue-500/10 text-blue-600 bg-blue-500/5">{file.type}</span>
      </div>
      <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{file.size}</span>
        {isAdmin ? (
          <button onClick={onApprove} className="bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Approve</button>
        ) : (
          <button onClick={onAccess} className="text-orange-600 font-black text-[11px] uppercase tracking-widest flex items-center gap-2">Access <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></button>
        )}
      </div>
    </div>
  );
};

export default ContentLibrary;

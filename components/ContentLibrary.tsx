
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LibraryFile, UserProfile, Folder } from '../types.ts';
import NexusServer from '../services/nexusServer.ts';

const FolderIcon = ({ type, size = "w-5 h-5" }: { type: 'semester' | 'subject' | 'category' | 'root', size?: string }) => {
  const colors = {
    root: 'text-slate-400',
    semester: 'text-orange-600',
    subject: 'text-blue-600',
    category: 'text-emerald-600'
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`${size} ${colors[type]} mb-1 transition-colors`}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
};

interface ContentLibraryProps {
  userProfile: UserProfile | null;
  initialView?: 'browse' | 'my-uploads';
}

const ContentLibrary: React.FC<ContentLibraryProps> = ({ userProfile, initialView = 'browse' }) => {
  const [files, setFiles] = useState<LibraryFile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [viewMode, setViewMode] = useState<'browse' | 'my-uploads'>(initialView);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Navigation State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  const [activeSemester, setActiveSemester] = useState<Folder | null>(null);
  const [activeSubject, setActiveSubject] = useState<Folder | null>(null);
  const [activeCategory, setActiveCategory] = useState<Folder | null>(null);

  const [isAdminView, setIsAdminView] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processSuccess, setProcessSuccess] = useState(false);
  
  // Modals
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [folderToManage, setFolderToManage] = useState<Folder | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [metaForm, setMetaForm] = useState({ name: '', description: '', semester: '', subject: '', type: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and Drop State
  const [draggingOverId, setDraggingOverId] = useState<string | null>(null);

  useEffect(() => {
    if (initialView) setViewMode(initialView);
  }, [initialView]);

  const fetchRegistry = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      // Parallel fetch for speed
      const [folderList, allFiles] = await Promise.all([
        NexusServer.fetchFolders(),
        isAdminView 
          ? NexusServer.fetchPendingFiles() 
          : (viewMode === 'my-uploads' && userProfile) 
            ? NexusServer.fetchUserFiles(userProfile.id) 
            : NexusServer.fetchFiles(searchQuery, 'All')
      ]);

      setFolders(folderList);

      let data = [...allFiles];
      
      // Strict hierarchical filtering
      if (!searchQuery && !isAdminView && viewMode === 'browse') {
        if (activeCategory) {
          data = data.filter(f => 
            f.semester === activeSemester?.name && 
            f.subject === activeSubject?.name && 
            f.type === activeCategory.name
          );
        } else if (activeSubject) {
          data = data.filter(f => 
            f.semester === activeSemester?.name && 
            f.subject === activeSubject.name && 
            (!f.type || f.type === '' || f.type === 'All')
          );
        } else if (activeSemester) {
          data = data.filter(f => 
            f.semester === activeSemester.name && 
            (!f.subject || f.subject === '' || f.subject === 'All')
          );
        } else {
          data = []; // Root only shows semesters
        }
      }

      data.sort((a, b) => {
        if (sortBy === 'newest') return b.uploadDate - a.uploadDate;
        if (sortBy === 'oldest') return a.uploadDate - b.uploadDate;
        if (sortBy === 'az') return a.name.localeCompare(b.name);
        return 0;
      });
      setFiles(data);
    } catch (e: any) { 
      console.error(e);
    } finally { 
      setIsLoading(false);
      setIsNavigating(false);
    }
  }, [isAdminView, viewMode, userProfile, searchQuery, sortBy, activeSemester, activeSubject, activeCategory]);

  // Handle navigation without flickering
  const navigateTo = (sem: Folder | null, subj: Folder | null, cat: Folder | null) => {
    setIsNavigating(true);
    setActiveSemester(sem);
    setActiveSubject(subj);
    setActiveCategory(cat);
  };

  useEffect(() => { 
    fetchRegistry(isNavigating); 
  }, [fetchRegistry, isNavigating]);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !userProfile?.is_admin) return;
    setIsProcessing(true);
    try {
      let type: 'semester' | 'subject' | 'category' = 'semester';
      let parentId: string | null = null;
      if (activeSubject) { type = 'category'; parentId = activeSubject.id; }
      else if (activeSemester) { type = 'subject'; parentId = activeSemester.id; }
      await NexusServer.createFolder(newFolderName, type, parentId);
      setNewFolderName('');
      setShowFolderModal(false);
      fetchRegistry(true);
    } catch (e: any) { alert(e.message); } finally { setIsProcessing(false); }
  };

  const handleRenameFolder = async () => {
    if (!folderToManage || !newFolderName.trim() || !userProfile?.is_admin) return;
    setIsProcessing(true);
    try {
      await NexusServer.renameFolder(folderToManage.id, newFolderName);
      setNewFolderName('');
      setFolderToManage(null);
      setShowRenameModal(false);
      fetchRegistry(true);
    } catch (e: any) { alert(e.message); } finally { setIsProcessing(false); }
  };

  const handleDeleteFolder = async (folder: Folder, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userProfile?.is_admin) return;
    if (!confirm(`Permanently delete node "${folder.name}"?`)) return;
    setIsProcessing(true);
    try {
      await NexusServer.deleteFolder(folder.id);
      fetchRegistry(true);
    } catch (e: any) { alert(e.message); } finally { setIsProcessing(false); }
  };

  const handleUpload = async () => {
    if (!pendingFile || !metaForm.name.trim() || !userProfile || !metaForm.semester || !metaForm.subject || !metaForm.type) return;
    setIsProcessing(true);
    try {
      await NexusServer.uploadFile(
        pendingFile, metaForm.name, metaForm.description, 
        metaForm.subject, metaForm.semester, metaForm.type, 
        userProfile.id, userProfile?.is_admin || false
      );
      setProcessSuccess(true);
      setTimeout(() => { setShowUploadModal(false); setProcessSuccess(false); fetchRegistry(true); }, 1500);
    } catch (e: any) { alert(e.message); } finally { setIsProcessing(false); }
  };

  const currentFolders = folders.filter(f => {
    if (!activeSemester) return f.type === 'semester';
    if (!activeSubject) return f.type === 'subject' && f.parent_id === activeSemester.id;
    if (!activeCategory) return f.type === 'category' && f.parent_id === activeSubject.id;
    return false;
  });

  const handleDragOver = (e: React.DragEvent, id: string) => {
    if (!userProfile?.is_admin) return;
    e.preventDefault();
    setDraggingOverId(id);
  };

  const handleDrop = (e: React.DragEvent, folder: Folder) => {
    if (!userProfile?.is_admin) return;
    e.preventDefault();
    setDraggingOverId(null);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      const file = droppedFiles[0];
      setPendingFile(file);
      setMetaForm({
        name: file.name.replace(/\.[^/.]+$/, ""),
        description: '',
        semester: folder.type === 'semester' ? folder.name : activeSemester?.name || '',
        subject: folder.type === 'subject' ? folder.name : activeSubject?.name || '',
        type: folder.type === 'category' ? folder.name : ''
      });
      setShowUploadModal(true);
    }
  };

  const modalAvailableSemesters = folders.filter(f => f.type === 'semester');
  const modalSelectedSemester = folders.find(f => f.name === metaForm.semester && f.type === 'semester');
  const modalAvailableSubjects = folders.filter(f => f.type === 'subject' && f.parent_id === modalSelectedSemester?.id);
  const modalSelectedSubject = folders.find(f => f.name === metaForm.subject && f.type === 'subject');
  const modalAvailableCategories = folders.filter(f => f.type === 'category' && f.parent_id === modalSelectedSubject?.id);

  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-fade-in pb-20 px-4 md:px-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tighter uppercase flex items-center gap-2">
            Registry
            <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md border bg-orange-500/10 text-orange-600 border-orange-500/20 uppercase tracking-widest">FS Node</span>
          </h2>
          <nav className="mt-1 flex flex-wrap items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400">
            <button onClick={() => navigateTo(null, null, null)} className="hover:text-orange-500 transition-colors">Root</button>
            {activeSemester && <><span className="opacity-30">/</span><button onClick={() => navigateTo(activeSemester, null, null)} className={!activeSubject ? 'text-orange-600' : 'hover:text-orange-500'}>{activeSemester.name}</button></>}
            {activeSubject && <><span className="opacity-30">/</span><button onClick={() => navigateTo(activeSemester, activeSubject, null)} className={!activeCategory ? 'text-orange-600' : 'hover:text-orange-500'}>{activeSubject.name}</button></>}
            {activeCategory && <><span className="opacity-30">/</span><span className="text-orange-600">{activeCategory.name}</span></>}
          </nav>
        </div>
        <div className="flex gap-1.5">
           {userProfile?.is_admin && viewMode === 'browse' && (
             <button 
              onClick={() => { setNewFolderName(''); setShowFolderModal(true); }}
              className="w-8 h-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg flex items-center justify-center text-orange-600 hover:scale-105 transition-all shadow-sm"
              title="Create Folder"
             >
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M12 5v14M5 12h14"/></svg>
             </button>
           )}
           <button 
            onClick={() => { setViewMode(viewMode === 'browse' ? 'my-uploads' : 'browse'); navigateTo(null, null, null); }}
            className={`px-3 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest border transition-all flex items-center gap-1.5 ${viewMode === 'my-uploads' ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-transparent' : 'bg-white dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5'}`}
           >
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
             {viewMode === 'my-uploads' ? 'Exit Hub' : 'My Vault'}
           </button>
           <button onClick={() => { if (!userProfile) { alert("Sign in required."); return; } fileInputRef.current?.click(); }} className="px-4 py-2 bg-orange-600 text-white rounded-lg font-black text-[9px] uppercase tracking-widest shadow-lg shadow-orange-600/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Sync
          </button>
        </div>
      </header>

      {viewMode === 'browse' && (
        <div className="flex gap-2 w-full">
          <div className="relative flex-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" placeholder="Filter registry..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
          </div>
          <button 
            onClick={() => fetchRegistry(false)}
            className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-slate-400 hover:text-orange-600 transition-colors shadow-sm"
            title="Refresh Registry"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          </button>
        </div>
      )}

      {isLoading && folders.length === 0 ? (
        <div className="col-span-full py-20 text-center animate-pulse text-slate-400 font-black uppercase text-[9px] tracking-[0.2em]">Pinging Server...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {!searchQuery && !isAdminView && viewMode === 'browse' && (
            currentFolders.map(folder => (
              <div 
                key={folder.id} 
                onDragOver={(e) => handleDragOver(e, folder.id)}
                onDragLeave={() => setDraggingOverId(null)}
                onDrop={(e) => handleDrop(e, folder)}
                onClick={() => {
                  if (folder.type === 'semester') navigateTo(folder, null, null);
                  else if (folder.type === 'subject') navigateTo(activeSemester, folder, null);
                  else if (folder.type === 'category') navigateTo(activeSemester, activeSubject, folder);
                }} 
                className={`
                  group p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-center min-h-[90px]
                  ${draggingOverId === folder.id 
                    ? 'border-orange-500 bg-orange-500/10 scale-105 shadow-xl z-10' 
                    : 'border-slate-100 dark:border-white/5 bg-white dark:bg-slate-950/40 hover:border-orange-500/50 hover:shadow-md'
                  }
                `}
              >
                {userProfile?.is_admin && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button onClick={(e) => { e.stopPropagation(); setFolderToManage(folder); setNewFolderName(folder.name); setShowRenameModal(true); }} className="p-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-white/10 text-blue-500 hover:bg-blue-50 transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                    <button onClick={(e) => handleDeleteFolder(folder, e)} className="p-1 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-white/10 text-red-500 hover:bg-red-50 transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
                  </div>
                )}
                <FolderIcon type={folder.type} />
                <h3 className="text-xs font-black text-slate-800 dark:text-white tracking-tight uppercase leading-none mt-1">{folder.name}</h3>
                <div className="absolute -right-1 -bottom-1 opacity-5 group-hover:scale-110 transition-transform"><FolderIcon type={folder.type} size="w-12 h-12" /></div>
              </div>
            ))
          )}

          {files.map(file => (
            <FileCard 
              key={file.id} 
              file={file} 
              isAdmin={isAdminView} 
              isPersonal={viewMode === 'my-uploads'} 
              onApprove={() => NexusServer.approveFile(file.id).then(() => fetchRegistry(true))} 
              onAccess={() => NexusServer.getFileUrl(file.storage_path).then(url => window.open(url, '_blank'))} 
            />
          ))}

          {files.length === 0 && currentFolders.length === 0 && (
            <div className="col-span-full py-10 text-center text-slate-400 font-black uppercase text-[8px] tracking-[0.2em] opacity-40">Empty Sub-Protocol</div>
          )}
        </div>
      )}

      {/* CREATE FOLDER MODAL */}
      {showFolderModal && userProfile?.is_admin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-950 rounded-2xl w-full max-w-xs shadow-2xl border border-white/10 overflow-hidden">
            <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-widest">New Node</h3>
              <button onClick={() => setShowFolderModal(false)} className="opacity-50 hover:opacity-100"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            </div>
            <div className="p-4 space-y-3">
              <input autoFocus placeholder="Name..." value={newFolderName} onChange={e => setNewFolderName(e.target.value)} className="w-full bg-slate-100 dark:bg-black/40 p-3 rounded-lg font-bold border-none text-xs dark:text-white" />
              <button onClick={handleCreateFolder} disabled={isProcessing} className="w-full bg-orange-600 text-white py-3 rounded-lg font-black text-[9px] uppercase tracking-widest">Deploy</button>
            </div>
          </div>
        </div>
      )}

      {/* RENAME MODAL */}
      {showRenameModal && userProfile?.is_admin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-950 rounded-2xl w-full max-w-xs shadow-2xl border border-white/10 overflow-hidden">
            <div className="bg-blue-900 p-4 text-white flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-widest">Rename</h3>
              <button onClick={() => setShowRenameModal(false)} className="opacity-50 hover:opacity-100"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            </div>
            <div className="p-4 space-y-3">
              <input autoFocus value={newFolderName} onChange={e => setNewFolderName(e.target.value)} className="w-full bg-slate-100 dark:bg-black/40 p-3 rounded-lg font-bold border-none text-xs dark:text-white" />
              <button onClick={handleRenameFolder} disabled={isProcessing} className="w-full bg-blue-600 text-white py-3 rounded-lg font-black text-[9px] uppercase tracking-widest">Sync</button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-950 rounded-3xl w-full max-w-md shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-orange-600 to-red-700 p-5 text-white flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-widest">Upload Protocol</h3>
              <button onClick={() => setShowUploadModal(false)} className="opacity-50 hover:opacity-100"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            </div>
            <div className="p-5 space-y-5 overflow-y-auto no-scrollbar">
              {processSuccess ? (
                <div className="text-center py-5 animate-fade-in flex flex-col items-center">
                  <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mb-3 text-green-500"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-5 h-5"><polyline points="20 6 9 17 4 12"/></svg></div>
                  <h3 className="text-sm font-black uppercase">Synced</h3>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <div className="bg-slate-50 dark:bg-black/40 p-3 rounded-xl border border-dashed border-slate-200 dark:border-white/10 text-center"><p className="text-[10px] font-bold truncate dark:text-white">{pendingFile?.name}</p></div>
                    <input value={metaForm.name} onChange={e => setMetaForm({...metaForm, name: e.target.value})} placeholder="Display Name" className="w-full bg-slate-100 dark:bg-black/40 p-3 rounded-xl font-bold border-none text-xs dark:text-white" />
                    <textarea value={metaForm.description} onChange={e => setMetaForm({...metaForm, description: e.target.value})} placeholder="Notes (Optional)" className="w-full bg-slate-100 dark:bg-black/40 p-3 rounded-xl font-bold border-none text-xs dark:text-white h-16 resize-none" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-[8px] font-black uppercase tracking-widest text-slate-400">Target Path</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {modalAvailableSemesters.map(sem => (
                        <button key={sem.id} onClick={() => setMetaForm({...metaForm, semester: sem.name, subject: '', type: ''})} className={`px-2.5 py-1.5 rounded-lg text-[8px] font-black uppercase border transition-all ${metaForm.semester === sem.name ? 'bg-orange-600 text-white' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'}`}>{sem.name}</button>
                      ))}
                    </div>
                    {metaForm.semester && (
                      <div className="flex flex-wrap gap-1.5">
                        {modalAvailableSubjects.map(sub => (
                          <button key={sub.id} onClick={() => setMetaForm({...metaForm, subject: sub.name, type: ''})} className={`px-2.5 py-1.5 rounded-lg text-[8px] font-black uppercase border transition-all ${metaForm.subject === sub.name ? 'bg-blue-600 text-white' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'}`}>{sub.name}</button>
                        ))}
                      </div>
                    )}
                    {metaForm.subject && (
                      <div className="flex flex-wrap gap-1.5">
                        {modalAvailableCategories.map(cat => (
                          <button key={cat.id} onClick={() => setMetaForm({...metaForm, type: cat.name})} className={`px-2.5 py-1.5 rounded-lg text-[8px] font-black uppercase border transition-all ${metaForm.type === cat.name ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'}`}>{cat.name}</button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button onClick={handleUpload} disabled={isProcessing || !metaForm.name.trim() || !metaForm.semester || !metaForm.subject || !metaForm.type} className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-black text-[9px] uppercase tracking-widest disabled:opacity-30 transition-all flex items-center justify-center gap-2">{isProcessing ? <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" /> : 'Deploy to Node'}</button>
                </>
              )}
            </div>
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
    pending: { label: 'Queued', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    approved: { label: 'Active', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    rejected: { label: 'Halt', color: 'text-red-500', bg: 'bg-red-500/10' }
  };
  const status = statusConfig[file.status] || statusConfig.pending;

  return (
    <div className="group p-3 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-950/40 hover:border-orange-500 hover:shadow-md transition-all relative overflow-hidden flex flex-col min-h-[110px]">
      <div className="flex items-start justify-between mb-1.5">
        <div className="w-6 h-6 bg-slate-50 dark:bg-white/5 rounded-lg flex items-center justify-center group-hover:text-orange-500 transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        {isPersonal && <div className={`px-1.5 py-0.5 rounded text-[6px] font-black uppercase tracking-widest ${status.bg} ${status.color}`}>{status.label}</div>}
      </div>
      <h3 className="text-[10px] font-black text-slate-800 dark:text-white tracking-tight leading-tight line-clamp-2 mb-1.5">{file.name}</h3>
      <div className="pt-2 mt-auto border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
        <span className="text-[7px] font-black text-slate-400 uppercase">{file.size}</span>
        {isAdmin ? (
          <button onClick={(e) => { e.stopPropagation(); onApprove?.(); }} className="bg-green-600 text-white px-2 py-1 rounded text-[7px] font-black uppercase">Approve</button>
        ) : (
          <button onClick={(e) => { e.stopPropagation(); onAccess(); }} className="text-orange-600 font-black text-[8px] uppercase tracking-widest flex items-center gap-1 hover:underline">Read <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2 h-2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></button>
        )}
      </div>
    </div>
  );
};

export default ContentLibrary;

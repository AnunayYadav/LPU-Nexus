
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { LibraryFile, UserProfile, Folder } from '../types.ts';
import NexusServer from '../services/nexusServer.ts';

const FolderIcon = ({ type, size = "w-7 h-7" }: { type: 'semester' | 'subject' | 'category' | 'root', size?: string }) => {
  const colors = {
    root: 'text-slate-400',
    semester: 'text-orange-600',
    subject: 'text-orange-500', 
    category: 'text-amber-600' 
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`${size} ${colors[type]} mb-2 transition-colors`}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
};

const SkeletonCard = () => (
  <div className="group p-5 rounded-[30px] border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-950/40 relative overflow-hidden flex flex-col min-h-[140px] animate-pulse">
    <div className="w-10 h-10 bg-slate-200 dark:bg-white/5 rounded-xl mb-4 shimmer" />
    <div className="h-4 w-3/4 bg-slate-200 dark:bg-white/5 rounded-md mb-2 shimmer" />
    <div className="h-3 w-1/2 bg-slate-200 dark:bg-white/5 rounded-md shimmer" />
  </div>
);

interface ContentLibraryProps {
  userProfile: UserProfile | null;
  initialView?: 'browse' | 'my-uploads';
}

const ContentLibrary: React.FC<ContentLibraryProps> = ({ userProfile, initialView = 'browse' }) => {
  const [allFiles, setAllFiles] = useState<LibraryFile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [viewMode, setViewMode] = useState<'browse' | 'my-uploads'>(initialView);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  const [activeSemester, setActiveSemester] = useState<Folder | null>(null);
  const [activeSubject, setActiveSubject] = useState<Folder | null>(null);
  const [activeCategory, setActiveCategory] = useState<Folder | null>(null);

  const [isAdminView, setIsAdminView] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processSuccess, setProcessSuccess] = useState(false);
  
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<LibraryFile | null>(null);
  const [folderToManage, setFolderToManage] = useState<Folder | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [metaForm, setMetaForm] = useState({ name: '', description: '', semester: '', subject: '', type: '' });
  const [isCustomSubject, setIsCustomSubject] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggingOverId, setDraggingOverId] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic to center modals in viewport
  useEffect(() => {
    if (showFolderModal || showRenameModal || showDetailsModal || showEditModal || showUploadModal) {
      modalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showFolderModal, showRenameModal, showDetailsModal, showEditModal, showUploadModal]);

  useEffect(() => {
    if (initialView) setViewMode(initialView);
  }, [initialView]);

  const fetchFromSource = useCallback(async (showSkeleton = true) => {
    if (showSkeleton) setIsLoading(true);
    try {
      const [folderList, filesFromDb] = await Promise.all([
        NexusServer.fetchFolders(),
        isAdminView 
          ? NexusServer.fetchPendingFiles(searchQuery) 
          : (viewMode === 'my-uploads' && userProfile) 
            ? NexusServer.fetchUserFiles(userProfile.id) 
            : NexusServer.fetchFiles(searchQuery, 'All')
      ]);

      setFolders(folderList);
      setAllFiles(filesFromDb);
    } catch (e: any) { 
      console.error("Registry load error:", e);
    } finally { 
      setIsLoading(false);
    }
  }, [isAdminView, viewMode, userProfile, searchQuery]);

  useEffect(() => {
    fetchFromSource(true);
  }, [fetchFromSource]);

  const displayFiles = useMemo(() => {
    let data = [...allFiles];
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
        data = []; 
      }
    }
    data.sort((a, b) => {
      if (sortBy === 'newest') return b.uploadDate - a.uploadDate;
      if (sortBy === 'oldest') return a.uploadDate - b.uploadDate;
      if (sortBy === 'az') return a.name.localeCompare(b.name);
      return 0;
    });
    return data;
  }, [allFiles, searchQuery, isAdminView, viewMode, activeSemester, activeSubject, activeCategory, sortBy]);

  const currentFolders = useMemo(() => {
    return folders.filter(f => {
      if (!activeSemester) return f.type === 'semester';
      if (!activeSubject) return f.type === 'subject' && f.parent_id === activeSemester.id;
      if (!activeCategory) return f.type === 'category' && f.parent_id === activeSubject.id;
      return false;
    });
  }, [folders, activeSemester, activeSubject, activeCategory]);

  const navigateTo = (sem: Folder | null, subj: Folder | null, cat: Folder | null) => {
    setActiveSemester(sem);
    setActiveSubject(subj);
    setActiveCategory(cat);
  };

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
      fetchFromSource(false);
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
      fetchFromSource(false);
    } catch (e: any) { alert(e.message); } finally { setIsProcessing(false); }
  };

  const handleDeleteFolder = async (folder: Folder, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userProfile?.is_admin) return;
    if (!confirm(`Permanently delete node "${folder.name}"?`)) return;
    setIsProcessing(true);
    try {
      await NexusServer.deleteFolder(folder.id);
      fetchFromSource(false);
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
      setTimeout(() => { 
        setShowUploadModal(false); 
        setProcessSuccess(false); 
        setIsCustomSubject(false);
        setIsCustomCategory(false);
        fetchFromSource(false); 
      }, 1500);
    } catch (e: any) { alert(e.message); } finally { setIsProcessing(false); }
  };

  const handleDirectEdit = async () => {
    if (!selectedFile || !metaForm.name.trim()) return;
    setIsProcessing(true);
    try {
      await NexusServer.requestUpdate(selectedFile.id, {
        name: metaForm.name,
        description: metaForm.description || '',
        subject: metaForm.subject,
        semester: metaForm.semester,
        type: metaForm.type
      }, true);
      setShowEditModal(false);
      fetchFromSource(false);
    } catch (e: any) { alert(e.message); } finally { setIsProcessing(false); }
  };

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

  const toggleAdminView = () => {
    const nextAdminState = !isAdminView;
    setIsAdminView(nextAdminState);
    setViewMode('browse');
    setSearchQuery(''); // Reset search to ensure full list of pending files shows up
    navigateTo(null, null, null);
  };

  const modalAvailableSemesters = folders.filter(f => f.type === 'semester');
  const modalSelectedSemester = folders.find(f => f.name === metaForm.semester && f.type === 'semester');
  const modalAvailableSubjects = folders.filter(f => f.type === 'subject' && f.parent_id === modalSelectedSemester?.id);
  const modalSelectedSubject = folders.find(f => f.name === metaForm.subject && f.type === 'subject');
  const modalAvailableCategories = folders.filter(f => f.type === 'category' && f.parent_id === modalSelectedSubject?.id);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-20 px-4 md:px-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-black text-slate-800 dark:text-white tracking-tighter uppercase flex items-center gap-3">
            Library
          </h2>
          {!isAdminView && (
            <nav className="mt-1 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <button onClick={() => navigateTo(null, null, null)} className="hover:text-orange-500 transition-colors">Root</button>
              {activeSemester && <><span className="opacity-30">/</span><button onClick={() => navigateTo(activeSemester, null, null)} className={!activeSubject ? 'text-orange-600' : 'hover:text-orange-500'}>{activeSemester.name}</button></>}
              {activeSubject && <><span className="opacity-30">/</span><button onClick={() => navigateTo(activeSemester, activeSubject, null)} className={!activeCategory ? 'text-orange-600' : 'hover:text-orange-500'}>{activeSubject.name}</button></>}
              {activeCategory && <><span className="opacity-30">/</span><span className="text-orange-600">{activeCategory.name}</span></>}
            </nav>
          )}
          {isAdminView && (
             <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-orange-600">Pending Review Hub</p>
          )}
        </div>
        <div className="flex gap-2">
           {userProfile?.is_admin && (
             <>
                <button 
                  onClick={toggleAdminView}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border-none ${isAdminView ? 'bg-orange-600 text-white shadow-lg' : 'bg-black text-slate-400'}`}
                  title={isAdminView ? "Exit Mod View" : "Enter Mod View"}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </button>
                <button 
                  onClick={() => { setNewFolderName(''); setShowFolderModal(true); }}
                  className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-orange-600 hover:scale-110 active:scale-95 transition-all shadow-sm border-none"
                  title="Create Folder"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M12 5v14M5 12h14"/></svg>
                </button>
             </>
           )}
           <button 
            onClick={() => { setViewMode(viewMode === 'browse' ? 'my-uploads' : 'browse'); navigateTo(null, null, null); setIsAdminView(false); }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border-none ${viewMode === 'my-uploads' ? 'bg-orange-600 text-white shadow-lg' : 'bg-black text-slate-400'}`}
            title={viewMode === 'my-uploads' ? "Exit Vault" : "My Vault"}
           >
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
           </button>
           <button onClick={() => { if (!userProfile) { alert("Sign in required."); return; } fileInputRef.current?.click(); }} className="px-5 py-2 bg-orange-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-600/20 border-none hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Contribute
          </button>
        </div>
      </header>

      {!isAdminView && (
        <div className="flex gap-2 w-full">
          <div className="relative flex-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" placeholder="Filter registry..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
          </div>
          <button 
            onClick={() => fetchFromSource(true)}
            className="w-12 h-12 flex items-center justify-center bg-black rounded-xl text-slate-400 hover:text-orange-600 transition-colors shadow-sm border-none"
            title="Refresh Registry"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
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
                  group p-5 rounded-[30px] border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-center min-h-[140px]
                  ${draggingOverId === folder.id 
                    ? 'border-orange-500 bg-orange-500/10 scale-105 shadow-xl z-10' 
                    : 'border-slate-100 dark:border-white/5 bg-white dark:bg-slate-950/40 hover:border-orange-500/50 hover:shadow-lg'
                  }
                `}
              >
                {userProfile?.is_admin && (
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setFolderToManage(folder); setNewFolderName(folder.name); setShowRenameModal(true); }} 
                      className="p-1.5 bg-black rounded-lg text-orange-600 hover:bg-orange-50 dark:hover:bg-slate-900 transition-colors shadow-sm border-none"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button 
                      onClick={(e) => handleDeleteFolder(folder, e)} 
                      className="p-1.5 bg-black rounded-lg text-red-500 hover:bg-red dark:hover:bg-slate-900 transition-colors shadow-sm border-none"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                    </button>
                  </div>
                )}
                <FolderIcon type={folder.type} size="w-10 h-10" />
                <h3 className="text-sm md:text-base font-black text-slate-800 dark:text-white tracking-tight uppercase leading-tight mt-1">{folder.name}</h3>
                <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:scale-110 transition-transform"><FolderIcon type={folder.type} size="w-24 h-24" /></div>
              </div>
            ))
          )}

          {displayFiles.map(file => (
            <FileCard 
              key={file.id} 
              file={file} 
              userProfile={userProfile}
              isAdminMode={isAdminView}
              isPersonal={viewMode === 'my-uploads'} 
              onApprove={() => {
                setIsProcessing(true);
                NexusServer.approveFile(file.id)
                  .then(() => fetchFromSource(false))
                  .finally(() => setIsProcessing(false));
              }}
              onReject={() => {
                if (confirm("Reject and remove this file?")) {
                  setIsProcessing(true);
                  NexusServer.rejectFile(file.id)
                    .then(() => fetchFromSource(false))
                    .finally(() => setIsProcessing(false));
                }
              }}
              onDemote={() => {
                 if (confirm("Send this file back to pending review?")) {
                  setIsProcessing(true);
                  NexusServer.demoteFile(file.id)
                    .then(() => fetchFromSource(false))
                    .finally(() => setIsProcessing(false));
                }
              }}
              onEdit={() => {
                 setSelectedFile(file);
                 setMetaForm({
                   name: file.name,
                   description: file.description || '',
                   semester: file.semester,
                   subject: file.subject,
                   type: file.type
                 });
                 setShowEditModal(true);
              }}
              onDelete={() => {
                if (confirm("Permanently delete this file from registry?")) {
                  setIsProcessing(true);
                  NexusServer.deleteFile(file.id, file.storage_path)
                    .then(() => fetchFromSource(false))
                    .finally(() => setIsProcessing(false));
                }
              }}
              onAccess={() => NexusServer.getFileUrl(file.storage_path).then(url => window.open(url, '_blank'))} 
              onShowDetails={() => { setSelectedFile(file); setShowDetailsModal(true); }}
            />
          ))}

          {displayFiles.length === 0 && (currentFolders.length === 0 || isAdminView) && !isLoading && (
            <div className="col-span-full py-20 text-center text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] opacity-40">Empty Protocol.</div>
          )}
        </div>
      )}

      {showFolderModal && userProfile?.is_admin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div ref={modalRef} className="bg-white dark:bg-slate-950 rounded-[30px] w-full max-w-sm shadow-2xl border border-white/10 overflow-hidden flex flex-col">
            <div className="bg-black p-6 text-white flex justify-between items-center">
              <h3 className="text-lg font-black uppercase tracking-widest">New Node</h3>
              <button onClick={() => setShowFolderModal(false)} className="opacity-50 hover:opacity-100 transition-opacity border-none"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            </div>
            <div className="p-6 space-y-4">
              <input autoFocus placeholder="Name..." value={newFolderName} onChange={e => setNewFolderName(e.target.value)} className="w-full bg-slate-100 dark:bg-black p-4 rounded-xl font-bold border-none text-sm dark:text-white outline-none focus:ring-2 focus:ring-orange-500" />
              <button onClick={handleCreateFolder} disabled={isProcessing} className="w-full bg-orange-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 disabled:opacity-50 transition-all border-none">
                {isProcessing ? 'Deploying...' : 'Create Folder'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showRenameModal && userProfile?.is_admin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div ref={modalRef} className="bg-white dark:bg-slate-950 rounded-[30px] w-full max-w-sm shadow-2xl border border-white/10 overflow-hidden flex flex-col">
            <div className="bg-black p-6 text-white flex justify-between items-center">
              <h3 className="text-lg font-black uppercase tracking-widest leading-none">Rename Node</h3>
              <button onClick={() => setShowRenameModal(false)} className="opacity-50 hover:opacity-100 transition-opacity border-none"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            </div>
            <div className="p-6 space-y-4">
              <input autoFocus value={newFolderName} onChange={e => setNewFolderName(e.target.value)} className="w-full bg-slate-100 dark:bg-black p-4 rounded-xl font-bold border-none text-sm dark:text-white outline-none focus:ring-2 focus:ring-orange-500" />
              <button onClick={handleRenameFolder} disabled={isProcessing} className="w-full bg-orange-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 disabled:opacity-50 transition-all border-none">
                {isProcessing ? 'Syncing...' : 'Update Name'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedFile && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div ref={modalRef} className="bg-white dark:bg-slate-950 rounded-[40px] w-full max-w-md shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-black p-6 text-white flex justify-between items-center">
              <h3 className="text-lg font-black uppercase tracking-widest">Edit Entry</h3>
              <button onClick={() => setShowEditModal(false)} className="opacity-50 hover:opacity-100 transition-opacity border-none"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto no-scrollbar flex-1">
              <div className="space-y-4">
                <input value={metaForm.name} onChange={e => setMetaForm({...metaForm, name: e.target.value})} placeholder="Display Alias" className="w-full bg-slate-100 dark:bg-black p-4 rounded-2xl font-bold border-none text-sm dark:text-white outline-none focus:ring-2 focus:ring-orange-500" />
                <textarea value={metaForm.description} onChange={e => setMetaForm({...metaForm, description: e.target.value})} placeholder="Registry Notes" className="w-full bg-slate-100 dark:bg-black p-4 rounded-2xl font-bold border-none text-sm dark:text-white h-24 resize-none outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Hierarchy Shift</h4>
                <div className="flex flex-wrap gap-2">
                  {modalAvailableSemesters.map(sem => (
                    <button key={sem.id} onClick={() => setMetaForm({...metaForm, semester: sem.name, subject: '', type: ''})} className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-none ${metaForm.semester === sem.name ? 'bg-orange-600 text-white shadow-lg' : 'bg-black text-slate-500 hover:text-orange-500'}`}>{sem.name}</button>
                  ))}
                </div>
                {metaForm.semester && (
                  <div className="flex flex-wrap gap-2 animate-fade-in">
                    {modalAvailableSubjects.map(sub => (
                      <button key={sub.id} onClick={() => setMetaForm({...metaForm, subject: sub.name, type: ''})} className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-none ${metaForm.subject === sub.name ? 'bg-orange-600/20 text-orange-600' : 'bg-black text-slate-500 hover:text-orange-500'}`}>{sub.name}</button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={handleDirectEdit} disabled={isProcessing} className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 disabled:opacity-30 transition-all flex items-center justify-center gap-3 border-none">
                {isProcessing ? <div className="w-5 h-5 border-2 border-white dark:border-white border-t-transparent rounded-full animate-spin" /> : 'Save Parameters'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && selectedFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div ref={modalRef} className="bg-white dark:bg-slate-950 rounded-[40px] w-full max-w-md shadow-2xl border border-white/10 overflow-hidden flex flex-col relative">
            <div className="bg-black p-8 text-white flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">{selectedFile.name}</h3>
                <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mt-2">{selectedFile.subject} • {selectedFile.semester}</p>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="opacity-50 hover:opacity-100 transition-opacity border-none"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Metadata Summary</h4>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedFile.description || "No registry description provided for this node."}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/5 dark:bg-black/40 p-4 rounded-2xl">
                  <h4 className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Contributor</h4>
                  <p className="text-xs font-bold dark:text-white truncate">{selectedFile.uploader_username || "Anonymous Verto"}</p>
                </div>
                <div className="bg-black/5 dark:bg-black/40 p-4 rounded-2xl">
                  <h4 className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Upload Date</h4>
                  <p className="text-xs font-bold dark:text-white">{new Date(selectedFile.uploadDate).toLocaleDateString()}</p>
                </div>
              </div>

              {selectedFile.admin_notes && (
                <div className="border-l-4 border-l-orange-600 bg-orange-600/5 p-4 rounded-r-2xl">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-1">Admin Notes</h4>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{selectedFile.admin_notes}</p>
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => { NexusServer.getFileUrl(selectedFile.storage_path).then(url => window.open(url, '_blank')); setShowDetailsModal(false); }}
                  className="flex-1 bg-orange-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-600/20 active:scale-95 transition-all border-none"
                >
                  Access File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div ref={modalRef} className="bg-white dark:bg-slate-950 rounded-[40px] w-full max-w-md shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-orange-600 to-red-700 p-6 text-white flex justify-between items-center">
              <h3 className="text-lg font-black uppercase tracking-widest">Registry Sync</h3>
              <button onClick={() => setShowUploadModal(false)} className="opacity-50 hover:opacity-100 transition-opacity border-none"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto no-scrollbar flex-1">
              {processSuccess ? (
                <div className="text-center py-10 animate-fade-in flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4 text-green-500 shadow-xl shadow-green-500/10">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-8 h-8"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Sync Established</h3>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-2">File deployed to moderation.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="bg-slate-50 dark:bg-black p-4 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 text-center"><p className="text-sm font-bold truncate dark:text-white">{pendingFile?.name}</p></div>
                    <input value={metaForm.name} onChange={e => setMetaForm({...metaForm, name: e.target.value})} placeholder="Display Alias" className="w-full bg-slate-100 dark:bg-black p-4 rounded-2xl font-bold border-none text-sm dark:text-white outline-none focus:ring-2 focus:ring-orange-500" />
                    <textarea value={metaForm.description} onChange={e => setMetaForm({...metaForm, description: e.target.value})} placeholder="Registry Notes (Optional)" className="w-full bg-slate-100 dark:bg-black p-4 rounded-2xl font-bold border-none text-sm dark:text-white h-24 resize-none outline-none focus:ring-2 focus:ring-orange-500" />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Path Configuration</h4>
                    
                    <div className="space-y-2">
                      <p className="text-[8px] font-black text-slate-500 uppercase ml-1">Semester</p>
                      <div className="flex flex-wrap gap-2">
                        {modalAvailableSemesters.map(sem => (
                          <button key={sem.id} onClick={() => { setMetaForm({...metaForm, semester: sem.name, subject: '', type: ''}); setIsCustomSubject(false); setIsCustomCategory(false); }} className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-none ${metaForm.semester === sem.name ? 'bg-orange-600 text-white shadow-lg' : 'bg-black text-slate-500 hover:text-orange-500'}`}>{sem.name}</button>
                        ))}
                      </div>
                    </div>

                    {metaForm.semester && (
                      <div className="space-y-2 animate-fade-in">
                        <div className="flex items-center justify-between px-1">
                          <p className="text-[8px] font-black text-slate-500 uppercase">Subject</p>
                          <button 
                            onClick={() => { setIsCustomSubject(!isCustomSubject); setMetaForm({...metaForm, subject: '', type: ''}); }} 
                            className={`p-1 rounded-md transition-all ${isCustomSubject ? 'bg-orange-600 text-white' : 'bg-black text-orange-600'}`}
                            title="Suggest New Subject"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3"><path d="M12 5v14M5 12h14"/></svg>
                          </button>
                        </div>
                        {isCustomSubject ? (
                          <input autoFocus placeholder="Enter New Subject Name..." value={metaForm.subject} onChange={e => setMetaForm({...metaForm, subject: e.target.value})} className="w-full bg-slate-100 dark:bg-black p-3 rounded-xl font-bold border-none text-xs dark:text-white outline-none focus:ring-2 focus:ring-orange-500" />
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {modalAvailableSubjects.map(sub => (
                              <button key={sub.id} onClick={() => { setMetaForm({...metaForm, subject: sub.name, type: ''}); setIsCustomCategory(false); }} className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-none ${metaForm.subject === sub.name ? 'bg-orange-600/20 text-orange-600' : 'bg-black text-slate-500 hover:text-orange-500'}`}>{sub.name}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {metaForm.subject && (
                      <div className="space-y-2 animate-fade-in">
                        <div className="flex items-center justify-between px-1">
                          <p className="text-[8px] font-black text-slate-500 uppercase">Category</p>
                          <button 
                            onClick={() => { setIsCustomCategory(!isCustomCategory); setMetaForm({...metaForm, type: ''}); }} 
                            className={`p-1 rounded-md transition-all ${isCustomCategory ? 'bg-orange-600 text-white' : 'bg-black text-orange-600'}`}
                            title="Suggest New Category"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3"><path d="M12 5v14M5 12h14"/></svg>
                          </button>
                        </div>
                        {isCustomCategory ? (
                          <input autoFocus placeholder="Enter New Category Name..." value={metaForm.type} onChange={e => setMetaForm({...metaForm, type: e.target.value})} className="w-full bg-slate-100 dark:bg-black p-3 rounded-xl font-bold border-none text-xs dark:text-white outline-none focus:ring-2 focus:ring-orange-500" />
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {modalAvailableCategories.map(cat => (
                              <button key={cat.id} onClick={() => setMetaForm({...metaForm, type: cat.name})} className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-none ${metaForm.type === cat.name ? 'bg-orange-600 text-white shadow-lg' : 'bg-black text-slate-500 hover:text-orange-500'}`}>{cat.name}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            {!processSuccess && (
              <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50">
                <button onClick={handleUpload} disabled={isProcessing || !metaForm.name.trim() || !metaForm.semester || !metaForm.subject || !metaForm.type} className="w-full bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 disabled:opacity-30 transition-all flex items-center justify-center gap-3 border-none">{isProcessing ? <div className="w-5 h-5 border-2 border-white dark:border-white border-t-transparent rounded-full animate-spin" /> : 'Deploy to Registry'}</button>
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
  userProfile: UserProfile | null; 
  isAdminMode: boolean;
  isPersonal?: boolean;
  onApprove?: () => void; 
  onReject?: () => void;
  onDemote?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAccess: () => void; 
  onShowDetails: () => void;
}> = ({ file, userProfile, isAdminMode, isPersonal, onApprove, onReject, onDemote, onEdit, onDelete, onAccess, onShowDetails }) => {
  const isAdmin = userProfile?.is_admin || false;
  const statusConfig = {
    pending: { label: 'Queued', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    approved: { label: 'Verified', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    rejected: { label: 'Redacted', color: 'text-red-500', bg: 'bg-red-500/10' }
  };
  const status = statusConfig[file.status] || statusConfig.pending;

  return (
    <div 
      onClick={onShowDetails}
      className="group p-5 rounded-[30px] border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-950/40 hover:border-orange-500 hover:shadow-xl transition-all relative overflow-hidden flex flex-col min-h-[160px] cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center group-hover:text-orange-500 transition-colors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </div>
        {(isPersonal || isAdmin) && <div className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${status.bg} ${status.color}`}>{status.label}</div>}
      </div>
      <h3 className="text-xs md:text-sm font-black text-slate-800 dark:text-white tracking-tight leading-tight line-clamp-2 mb-2">{file.name}</h3>
      <div className="pt-3 mt-auto border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{file.size}</span>
        
        <div className="flex gap-1.5">
          {isAdmin && (
            <div className="flex gap-1.5">
              {isAdminMode ? (
                 <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onReject?.(); }} 
                    className="w-8 h-8 bg-black text-red-500 rounded-lg flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all border-none"
                    title="Reject"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onApprove?.(); }} 
                    className="w-8 h-8 bg-black text-emerald-500 rounded-lg flex items-center justify-center shadow-lg hover:bg-emerald-500 hover:text-white transition-all border-none"
                    title="Approve"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>
                  </button>
                 </>
              ) : (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete?.(); }} 
                    className="w-8 h-8 bg-black text-red-500 rounded-lg flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all border-none"
                    title="Delete"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onEdit?.(); }} 
                    className="w-8 h-8 bg-black text-orange-600 rounded-lg flex items-center justify-center shadow-lg hover:bg-orange-600 hover:text-white transition-all border-none"
                    title="Edit"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  {file.status === 'approved' && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDemote?.(); }} 
                      className="w-8 h-8 bg-black text-slate-400 rounded-lg flex items-center justify-center shadow-lg hover:bg-slate-400 hover:text-black transition-all border-none"
                      title="Send to Pending"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M1 4v6h6"/><path d="M23 20v-6h-6"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {!isAdmin && (
            <button 
              onClick={(e) => { e.stopPropagation(); onAccess(); }} 
              className="bg-black text-orange-600 px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 hover:bg-orange-600 hover:text-white transition-all shadow-md border-none"
            >
              Access <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentLibrary;

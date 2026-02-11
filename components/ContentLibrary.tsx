
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
  <div className="group p-5 rounded-[30px] border border-slate-100 dark:border-white/5 bg-white dark:bg-black/40 relative overflow-hidden flex flex-col min-h-[140px] animate-pulse">
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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
      console.error("Library load error:", e);
    } finally { 
      setIsLoading(false);
    }
  }, [isAdminView, viewMode, userProfile, searchQuery]);

  useEffect(() => { fetchFromSource(true); }, [fetchFromSource]);

  const displayFiles = useMemo(() => {
    let data = [...allFiles];
    if (isAdminView || viewMode === 'my-uploads' || searchQuery.trim() !== '') { /* flat view */ } 
    else if (viewMode === 'browse') {
      if (activeCategory) data = data.filter(f => f.semester === activeSemester?.name && f.subject === activeSubject?.name && f.type === activeCategory.name);
      else if (activeSubject) data = data.filter(f => f.semester === activeSemester?.name && f.subject === activeSubject.name && (!f.type || f.type.trim() === '' || f.type === 'General' || f.type === activeSubject.name));
      else data = []; 
    }
    data.sort((a, b) => sortBy === 'newest' ? b.uploadDate - a.uploadDate : sortBy === 'oldest' ? a.uploadDate - b.uploadDate : a.name.localeCompare(b.name));
    return data;
  }, [allFiles, searchQuery, isAdminView, viewMode, activeSemester, activeSubject, activeCategory, sortBy]);

  const currentFolders = useMemo(() => {
    if (isAdminView || viewMode === 'my-uploads' || searchQuery.trim() !== '') return [];
    return folders.filter(f => {
      if (!activeSemester) return f.type === 'semester';
      if (!activeSubject) return f.type === 'subject' && f.parent_id === activeSemester.id;
      if (!activeCategory) return f.type === 'category' && f.parent_id === activeSubject.id;
      return false;
    });
  }, [folders, activeSemester, activeSubject, activeCategory, isAdminView, viewMode, searchQuery]);

  const navigateTo = (sem: Folder | null, subj: Folder | null, cat: Folder | null) => {
    setActiveSemester(sem); setActiveSubject(subj); setActiveCategory(cat);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-20 px-4 md:px-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tighter uppercase leading-none mb-1">Study Materials</h2>
          <nav className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <button onClick={() => navigateTo(null, null, null)} className="hover:text-orange-500 transition-colors border-none bg-transparent">Library</button>
            {activeSemester && <><span className="opacity-30">/</span><button onClick={() => navigateTo(activeSemester, null, null)} className="border-none bg-transparent">{activeSemester.name}</button></>}
            {activeSubject && <><span className="opacity-30">/</span><button onClick={() => navigateTo(activeSemester, activeSubject, null)} className="border-none bg-transparent">{activeSubject.name}</button></>}
          </nav>
        </div>
        <div className="flex gap-2">
           <button onClick={() => { setViewMode(viewMode === 'browse' ? 'my-uploads' : 'browse'); navigateTo(null, null, null); }} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border-none ${viewMode === 'my-uploads' ? 'bg-orange-600 text-white shadow-lg' : 'bg-black text-slate-400'}`} title="My Uploads"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></button>
           <button onClick={() => { if (!userProfile) { alert("Sign in required."); return; } fileInputRef.current?.click(); }} className="px-5 py-2 bg-orange-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-600/20 border-none hover:scale-105 active:scale-95 transition-all flex items-center gap-2">Upload File</button>
        </div>
      </header>

      <div className="relative flex-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="text" placeholder="Search for notes, papers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-orange-500 transition-all dark:text-white" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {isLoading ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />) : (
          <>
            {currentFolders.map(folder => (
              <div key={folder.id} onClick={() => { if (folder.type === 'semester') navigateTo(folder, null, null); else if (folder.type === 'subject') navigateTo(activeSemester, folder, null); else if (folder.type === 'category') navigateTo(activeSemester, activeSubject, folder); }} className="group p-5 rounded-[30px] border border-slate-100 dark:border-white/5 bg-white dark:bg-black/40 hover:border-orange-500/50 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-center min-h-[140px]">
                <FolderIcon type={folder.type} size="w-10 h-10" />
                <h3 className="text-sm md:text-base font-black text-slate-800 dark:text-white tracking-tight uppercase leading-tight mt-1">{folder.name}</h3>
              </div>
            ))}
            {displayFiles.map(file => (
              <FileCard key={file.id} file={file} userProfile={userProfile} onAccess={() => NexusServer.getFileUrl(file.storage_path).then(url => window.open(url, '_blank'))} onShowDetails={() => { setSelectedFile(file); setShowDetailsModal(true); }} />
            ))}
          </>
        )}
      </div>

      {showDetailsModal && selectedFile && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fade-in">
          <div ref={modalRef} className="bg-[#050505] rounded-[48px] w-full max-w-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <header className="p-8 md:p-12 border-b border-white/5 bg-black flex items-start justify-between">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-2xl bg-orange-600/10 flex items-center justify-center text-orange-500 border border-orange-600/20"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                     <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-600">File Info</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white leading-tight">{selectedFile.name}</h3>
               </div>
               <button onClick={() => setShowDetailsModal(false)} className="p-2 text-white/30 hover:text-white border-none bg-transparent transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            </header>
            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 no-scrollbar">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Semester', val: selectedFile.semester },
                    { label: 'Subject', val: selectedFile.subject },
                    { label: 'Type', val: selectedFile.type },
                    { label: 'Size', val: selectedFile.size }
                  ].map((item, i) => (
                    <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                       <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">{item.label}</p>
                       <p className="text-xs font-black uppercase tracking-tight text-white">{item.val || 'N/A'}</p>
                    </div>
                  ))}
               </div>
               <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Description</h4>
                  <p className="text-sm font-medium text-slate-300 leading-relaxed italic bg-white/5 p-6 rounded-3xl border border-white/5">{selectedFile.description || "Shared by the community."}</p>
               </div>
            </div>
            <footer className="p-8 md:p-12 bg-black border-t border-white/5 flex gap-4">
               <button onClick={() => setShowDetailsModal(false)} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Close</button>
               {selectedFile.status === 'approved' && (
                 <button onClick={() => { NexusServer.getFileUrl(selectedFile.storage_path).then(url => window.open(url, '_blank')); }} className="flex-[2] py-4 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all border-none font-black">Open File</button>
               )}
            </footer>
          </div>
        </div>
      )}
      <input type="file" ref={fileInputRef} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setPendingFile(f); setMetaForm(p => ({ ...p, name: f.name.replace(/\.[^/.]+$/, ""), semester: activeSemester?.name || '', subject: activeSubject?.name || '', type: activeCategory?.name || '' })); setShowUploadModal(true); } }} />
    </div>
  );
};

const FileCard: React.FC<{ file: LibraryFile; userProfile: UserProfile | null; onAccess: () => void; onShowDetails: () => void; }> = ({ file, onAccess, onShowDetails }) => {
  return (
    <div onClick={onShowDetails} className="group p-5 rounded-[30px] border border-slate-100 dark:border-white/5 bg-white dark:bg-black/40 hover:border-orange-500 hover:shadow-xl transition-all relative overflow-hidden flex flex-col min-h-[160px] cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center group-hover:text-orange-500 transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
        {file.status === 'approved' && <div className="px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500">Verified</div>}
      </div>
      <h3 className="text-xs md:text-sm font-black text-slate-800 dark:text-white tracking-tight leading-tight line-clamp-2 mb-2 group-hover:text-orange-500 transition-colors">{file.name}</h3>
      <div className="pt-3 mt-auto border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{file.size}</span>
        <button onClick={(e) => { e.stopPropagation(); onAccess(); }} className="bg-black text-orange-600 px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 hover:bg-orange-600 hover:text-white transition-all shadow-md border-none">View</button>
      </div>
    </div>
  );
};

export default ContentLibrary;


import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { LibraryFile, UserProfile } from '../types.ts';
import NexusServer from '../services/nexusServer.ts';

const SUBJECTS = ['CSE326', 'CSE408', 'MTH166', 'PEL121', 'INT213', 'CSE202', 'CSE310', 'Other'];
const CATEGORIES: string[] = ['Lecture', 'Question Bank', 'Lab Manual', 'Assignment', 'Syllabus', 'PYQ', 'Notes', 'Other'];
const SORT_OPTIONS = [
  { label: 'NEWEST', value: 'newest' },
  { label: 'OLDEST', value: 'oldest' },
  { label: 'A-Z', value: 'az' },
  { label: 'SIZE', value: 'size_desc' }
];

interface ContentLibraryProps {
  userProfile: UserProfile | null;
}

const CustomDropdown: React.FC<{
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
  className?: string;
  placeholder?: string;
}> = ({ label, value, options, onChange, className = "", placeholder = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, direction: 'down' as 'up' | 'down' });

  const updateCoords = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      const margin = 12;
      const estimatedHeight = 200; 

      let left = rect.left;
      let width = rect.width;

      if (left + width > winW - margin) {
        left = Math.max(margin, winW - width - margin);
      }
      
      let top = rect.bottom + 8;
      let direction: 'up' | 'down' = 'down';

      if (top + estimatedHeight > winH - margin) {
        const spaceAbove = rect.top - margin;
        if (spaceAbove > estimatedHeight) {
          top = rect.top - 8;
          direction = 'up';
        }
      }

      setCoords({ top, left, width, direction });
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener('scroll', updateCoords, true);
      window.addEventListener('resize', updateCoords);
    }
    return () => {
      window.removeEventListener('scroll', updateCoords, true);
      window.removeEventListener('resize', updateCoords);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInsideTrigger = dropdownRef.current && dropdownRef.current.contains(target);
      const isInsidePortal = portalRef.current && portalRef.current.contains(target);
      if (!isInsideTrigger && !isInsidePortal) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : (placeholder || label);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-3 md:px-5 py-2.5 md:py-3 rounded-xl md:rounded-2xl border transition-all duration-300 font-black text-[9px] md:text-[10px] uppercase tracking-widest ${
          isOpen
            ? 'bg-white dark:bg-white/10 border-orange-500 shadow-lg shadow-orange-500/10'
            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-white/5 text-slate-700 dark:text-white'
        }`}
      >
        <span className="truncate">{displayLabel}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className={`w-3 h-3 ml-1 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-orange-500' : 'text-slate-400'}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && coords.width > 0 && createPortal(
        <div 
          ref={portalRef}
          className={`fixed z-[999] glass-panel rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 animate-fade-in bg-white dark:bg-black transition-all ${
            coords.direction === 'up' ? '-translate-y-full' : ''
          }`}
          style={{ top: coords.top, left: coords.left, width: coords.width }}
        >
          <div className="py-1 max-h-48 overflow-y-auto no-scrollbar">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-5 py-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-colors ${
                  value === opt.value
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-orange-500'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

const FolderIcon = ({ size = "w-6 h-6 md:w-8 h-8" }: { size?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`${size} text-orange-600 mb-2 md:mb-3`}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const ContentLibrary: React.FC<ContentLibraryProps> = ({ userProfile }) => {
  const [files, setFiles] = useState<LibraryFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  
  const [isAdminView, setIsAdminView] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processSuccess, setProcessSuccess] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);

  const [metaForm, setMetaForm] = useState({
    name: '',
    description: '',
    subject: 'CSE326',
    customSubject: '',
    type: 'Lecture',
    customType: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFromDatabase = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data: LibraryFile[] = [];
      if (isAdminView) {
        data = await NexusServer.fetchPendingFiles();
      } else {
        data = await NexusServer.fetchFiles(searchQuery, 'All');
        
        if (selectedType !== 'All') {
          data = data.filter(f => f.type === selectedType);
        }

        data.sort((a, b) => {
          if (sortBy === 'newest') return b.uploadDate - a.uploadDate;
          if (sortBy === 'oldest') return a.uploadDate - b.uploadDate;
          if (sortBy === 'az') return a.name.localeCompare(b.name);
          if (sortBy === 'size_desc') {
            const sizeA = parseFloat(a.size) || 0;
            const sizeB = parseFloat(b.size) || 0;
            return sizeB - sizeA;
          }
          return 0;
        });
      }
      setFiles(data);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "An unexpected error occurred while fetching resources.");
    } finally {
      setIsLoading(false);
    }
  }, [isAdminView, searchQuery, selectedType, sortBy]);

  // Initial load and dependency updates
  useEffect(() => {
    fetchFromDatabase();
  }, [fetchFromDatabase]);

  useEffect(() => {
    if (!userProfile?.is_admin && isAdminView) {
      setIsAdminView(false);
    }
  }, [userProfile]);

  const handleUpload = async () => {
    if (!pendingFile || !metaForm.name.trim()) return;
    setIsProcessing(true);
    const finalSubject = metaForm.subject === 'Other' ? (metaForm.customSubject || 'Other') : metaForm.subject;
    const finalType = metaForm.type === 'Other' ? (metaForm.customType || 'Other') : metaForm.type;
    try {
      await NexusServer.uploadFile(pendingFile, metaForm.name, metaForm.description, finalSubject, finalType, userProfile?.is_admin || false);
      setProcessSuccess(true);
      setTimeout(() => {
        setShowUploadModal(false);
        setProcessSuccess(false);
        fetchFromDatabase();
        setMetaForm({ name: '', description: '', subject: 'CSE326', customSubject: '', type: 'Lecture', customType: '' });
      }, 1500);
    } catch (e: any) {
      alert(`Submission failed: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditRequest = async () => {
    if (!editingFileId || !metaForm.name.trim()) return;
    setIsProcessing(true);
    const finalSubject = metaForm.subject === 'Other' ? (metaForm.customSubject || 'Other') : metaForm.subject;
    const finalType = metaForm.type === 'Other' ? (metaForm.customType || 'Other') : metaForm.type;
    try {
      await NexusServer.requestUpdate(editingFileId, {
        name: metaForm.name,
        description: metaForm.description,
        subject: finalSubject,
        type: finalType
      }, userProfile?.is_admin || false);
      setProcessSuccess(true);
      setTimeout(() => {
        setShowEditModal(false);
        setProcessSuccess(false);
        fetchFromDatabase();
        setEditingFileId(null);
        setMetaForm({ name: '', description: '', subject: 'CSE326', customSubject: '', type: 'Lecture', customType: '' });
      }, 1500);
    } catch (e: any) {
      alert(`Update failed: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApprove = async (file: LibraryFile) => {
    setIsProcessing(true);
    try {
      await NexusServer.approveFile(file.id);
      fetchFromDatabase();
    } catch (e: any) {
      alert(`Approval failed: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectUpdate = async (file: LibraryFile) => {
    setIsProcessing(true);
    try {
      await NexusServer.rejectUpdate(file.id);
      fetchFromDatabase();
    } catch (e: any) {
      alert(`Rejection failed: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteFile = async (file: LibraryFile) => {
    if (window.confirm("Permanently remove this resource?")) {
      setIsProcessing(true);
      try {
        await NexusServer.deleteFile(file.id, file.storage_path);
        fetchFromDatabase();
      } catch (e: any) {
        alert(`Deletion failed: ${e.message}`);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const openFile = async (file: LibraryFile) => {
    try {
      const url = await NexusServer.getFileUrl(file.storage_path);
      window.open(url, '_blank');
    } catch (e: any) {
      alert(`Access denied: ${e.message}`);
    }
  };

  const startEdit = (file: LibraryFile) => {
    setEditingFileId(file.id);
    setMetaForm({
      name: file.name,
      description: file.description || '',
      subject: SUBJECTS.includes(file.subject) ? file.subject : 'Other',
      customSubject: SUBJECTS.includes(file.subject) ? '' : file.subject,
      type: CATEGORIES.includes(file.type) ? file.type : 'Other',
      customType: CATEGORIES.includes(file.type) ? '' : file.type
    });
    setShowEditModal(true);
  };

  const groupedBySubject = files.reduce((acc, file) => {
    if (!acc[file.subject]) acc[file.subject] = [];
    acc[file.subject].push(file);
    return acc;
  }, {} as Record<string, LibraryFile[]>);

  const subjectFolders = Object.keys(groupedBySubject).sort();
  const isSearchActive = searchQuery.trim() !== '' || selectedType !== 'All';

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6 animate-fade-in pb-20 px-4 md:px-0">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tighter flex items-center gap-2 md:gap-3 uppercase">
              Library
              <span className={`text-[9px] md:text-[10px] font-black px-1.5 md:px-2 py-0.5 rounded-md border uppercase tracking-widest ${
                isAdminView 
                  ? 'bg-red-500/10 text-red-600 border-red-500/20' 
                  : 'bg-orange-500/10 text-orange-600 border-orange-500/20'
              }`}>
                {isAdminView ? 'Mod' : 'Verified'}
              </span>
            </h2>
            {activeSubject && !isAdminView && !isSearchActive && (
              <button 
                onClick={() => setActiveSubject(null)}
                className="mt-2 md:mt-3 flex items-center gap-1.5 text-orange-600 hover:text-orange-500 transition-colors font-black text-[9px] md:text-[10px] uppercase tracking-widest"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 md:w-3 h-2.5 md:h-3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back to Folders
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {userProfile?.is_admin && (
              <button 
                onClick={() => setIsAdminView(!isAdminView)} 
                className={`p-2 md:p-2.5 rounded-xl transition-all ${isAdminView ? 'text-orange-500 bg-orange-500/10' : 'text-slate-400 hover:text-orange-500 bg-white dark:bg-white/5 border border-transparent dark:border-white/5'}`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 md:w-5 md:h-5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </button>
            )}
            
            {!isAdminView && (
              <button 
                onClick={() => {
                  if (!userProfile) { alert("Please sign in to contribute."); return; }
                  fileInputRef.current?.click();
                }} 
                className="flex-1 md:flex-none flex items-center justify-center gap-1.5 md:gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-orange-600 text-white rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-lg shadow-orange-600/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 md:w-3.5 h-3 md:h-3.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Contribute
              </button>
            )}
          </div>
        </header>

        {!isAdminView && (
          <div className="flex flex-col gap-2 md:grid md:grid-cols-12 md:gap-3 items-center">
            <div className="w-full md:col-span-6 relative group h-10 md:h-full">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-3.5 md:w-4 h-3.5 md:h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input 
                type="text" 
                placeholder="Search resources..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full pl-9 md:pl-11 pr-4 py-2 md:py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest outline-none focus:ring-1 focus:ring-orange-500 transition-all placeholder:text-slate-400 h-full shadow-sm" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2 w-full md:col-span-6">
              <CustomDropdown 
                label="CAT"
                value={selectedType}
                options={[{ label: 'ALL CAT', value: 'All' }, ...CATEGORIES.map(c => ({ label: c.toUpperCase().substring(0, 12), value: c }))]}
                onChange={setSelectedType}
                className="w-full"
              />

              <CustomDropdown 
                label="SORT"
                value={sortBy}
                options={SORT_OPTIONS}
                onChange={setSortBy}
                className="w-full"
              />
            </div>
          </div>
        )}

        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={(e) => { 
            const file = e.target.files?.[0];
            if (file) {
              setPendingFile(file);
              setMetaForm(prev => ({
                ...prev,
                name: file.name.replace(/\.[^/.]+$/, "") 
              }));
              setShowUploadModal(true); 
            }
          }} 
        />

        {error ? (
          <div className="col-span-full py-20 flex flex-col items-center text-center animate-fade-in">
             <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-8 h-8"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
             </div>
             <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white mb-2 tracking-widest">Synchronization Error</h3>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 max-w-sm">{error}</p>
             <button 
                onClick={() => fetchFromDatabase()} 
                className="px-8 py-3 bg-orange-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
             >
               Retry Connection
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
            {isLoading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-24 animate-pulse">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Scanning Nexus Registry...</p>
              </div>
            ) : files.length > 0 ? (
              (!isAdminView && !isSearchActive && !activeSubject) ? (
                subjectFolders.map(subject => (
                  <div 
                    key={subject} 
                    onClick={() => setActiveSubject(subject)}
                    className="group p-4 md:p-6 rounded-2xl md:rounded-[24px] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/40 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/5 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-center min-h-[110px] md:min-h-[140px]"
                  >
                    <FolderIcon />
                    <h3 className="text-[10px] md:text-[11px] font-black tracking-tight text-slate-800 dark:text-white mb-0.5 md:mb-1">{subject}</h3>
                    <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-500">
                      {groupedBySubject[subject].length} {groupedBySubject[subject].length === 1 ? 'Item' : 'Items'}
                    </p>
                    <div className="absolute -right-2 -bottom-2 opacity-0 group-hover:opacity-5 group-hover:scale-125 transition-all duration-700 pointer-events-none">
                      <FolderIcon size="w-12 h-12 md:w-16 md:h-16" />
                    </div>
                  </div>
                ))
              ) : (
                files
                  .filter(file => !activeSubject || file.subject === activeSubject || isAdminView || isSearchActive)
                  .map(file => {
                    const isUpdateReq = isAdminView && file.pending_update;
                    const displayFile = isUpdateReq ? { ...file, ...file.pending_update } : file;

                    return (
                      <div key={file.id} className="group p-3.5 md:p-5 rounded-2xl md:rounded-[24px] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/40 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/5 transition-all relative overflow-hidden flex flex-col min-h-[180px] md:min-h-[220px] animate-fade-in">
                        <div className="flex justify-between items-start mb-2 md:mb-3">
                            <div className={`w-8 h-8 md:w-9 md:h-9 ${isUpdateReq ? 'bg-indigo-500/10 text-indigo-500' : 'bg-slate-100 dark:bg-white/5 text-slate-400 group-hover:text-orange-500'} rounded-lg md:rounded-xl flex items-center justify-center transition-colors relative`}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 md:w-5 md:h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                              {file.pending_update && !isAdminView && <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-indigo-500 rounded-full border border-white dark:border-slate-950"></div>}
                            </div>
                            <div className="flex space-x-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                              {userProfile && !isAdminView && (
                                <button onClick={(e) => { e.stopPropagation(); startEdit(file); }} className="p-1.5 md:p-2 text-slate-400 hover:text-orange-500 transition-colors">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 md:w-3.5 h-3 md:h-3.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                              )}
                              {userProfile?.is_admin && (
                                <button onClick={(e) => { e.stopPropagation(); deleteFile(file); }} className="p-1.5 md:p-2 text-slate-400 hover:text-red-500 transition-colors">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 md:w-3.5 h-3 md:h-3.5"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                                </button>
                              )}
                            </div>
                        </div>

                        {isUpdateReq && <span className="text-[7px] font-black uppercase text-indigo-500 mb-0.5 md:mb-1 tracking-widest">Update Req</span>}
                        
                        <h3 className="text-[9px] md:text-[10px] font-black tracking-tight text-slate-800 dark:text-white mb-1 md:mb-1.5 line-clamp-2 leading-tight">
                          {displayFile.name}
                        </h3>
                        
                        {displayFile.description && <p className="text-[8px] md:text-[9px] text-slate-500 mb-2 md:mb-3 line-clamp-1 italic font-bold uppercase leading-tight opacity-70">{displayFile.description}</p>}
                        
                        <div className="flex flex-wrap gap-1 mb-3 md:mb-4 mt-auto">
                            <span className={`px-1.5 py-0.5 rounded-md text-[7px] md:text-[8px] font-black uppercase tracking-widest border ${isUpdateReq && file.subject !== file.pending_update.subject ? 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' : 'bg-orange-500/5 text-orange-600 border-orange-500/10'}`}>
                              {displayFile.subject}
                            </span>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-2 md:pt-3 border-t border-slate-100 dark:border-white/5">
                            <span className="text-[7px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[40%]">{file.size}</span>
                            <div className="flex items-center gap-1">
                              {!isAdminView && (
                                <button onClick={() => openFile(file)} className="flex items-center space-x-1 text-orange-600 hover:text-orange-500 transition-colors">
                                  <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">Access</span>
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2 md:w-2.5 h-2 md:h-2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                </button>
                              )}
                              {isAdminView && (
                                <div className="flex gap-1">
                                  {isUpdateReq && (
                                    <button onClick={() => handleRejectUpdate(file)} className="bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400 px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all">No</button>
                                  )}
                                  <button onClick={() => handleApprove(file)} className="bg-green-600 text-white px-2 py-0.5 md:py-1 rounded-md md:rounded-lg text-[7px] md:text-[8px] font-black uppercase tracking-widest shadow-md">OK</button>
                                </div>
                              )}
                            </div>
                        </div>
                      </div>
                    );
                  })
              )
            ) : (
              <div className="col-span-full py-24 text-center">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 text-slate-200 dark:text-slate-800"><circle cx="12" cy="12" r="10"/><path d="m16 16-4-4-4 4"/></svg>
                 <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Registry Empty</p>
              </div>
            )}
          </div>
        )}
      </div>

      {(showUploadModal || showEditModal) && (
        <div className="fixed top-[73px] left-0 md:left-64 bottom-0 right-0 z-[100] flex items-center justify-center p-4 bg-slate-400/40 dark:bg-black/80 backdrop-blur-md animate-fade-in overflow-hidden">
           <div className="bg-white dark:bg-slate-950 rounded-[32px] md:rounded-[40px] w-full max-w-md shadow-2xl border border-slate-200 dark:border-white/10 relative flex flex-col max-h-[90vh] overflow-hidden">
              {!processSuccess ? (
                <>
                  <div className="bg-gradient-to-r from-orange-600 to-red-700 p-6 md:p-8 text-white relative rounded-t-[32px] md:rounded-t-[40px] flex-shrink-0">
                    <button onClick={() => { setShowUploadModal(false); setShowEditModal(false); }} className="absolute top-5 right-5 p-2 text-white/50 hover:text-white transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
                    <h3 className="text-lg md:text-xl font-black tracking-tighter leading-none uppercase">{showEditModal ? 'Update Metadata' : 'Contribute'}</h3>
                    <p className="text-white/60 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-1">{showEditModal ? 'Refine details' : 'Nexus Registry'}</p>
                  </div>
                  
                  <div className="p-6 md:p-8 space-y-4 md:space-y-6 overflow-y-auto no-scrollbar flex-1 pb-10">
                    <div>
                      <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Title</label>
                      <input 
                        type="text" 
                        value={metaForm.name} 
                        onChange={(e) => setMetaForm({...metaForm, name: e.target.value})} 
                        className="w-full bg-slate-100 dark:bg-black/40 p-3.5 md:p-4 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold outline-none border border-transparent focus:ring-2 focus:ring-orange-500 shadow-inner dark:text-white" 
                        placeholder="File name" 
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Details</label>
                      <textarea 
                        value={metaForm.description} 
                        onChange={(e) => setMetaForm({...metaForm, description: e.target.value})} 
                        className="w-full bg-slate-100 dark:bg-black/40 p-3.5 md:p-4 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold outline-none border border-transparent focus:ring-2 focus:ring-orange-500 transition-all resize-none h-20 md:h-24 shadow-inner dark:text-white" 
                        placeholder="Context..." 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Subject</label>
                        <CustomDropdown 
                          label="Select"
                          value={metaForm.subject}
                          options={SUBJECTS.map(s => ({ label: s.toUpperCase(), value: s }))}
                          onChange={(val) => setMetaForm({...metaForm, subject: val})}
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Type</label>
                        <CustomDropdown 
                          label="Select"
                          value={metaForm.type}
                          options={CATEGORIES.map(c => ({ label: c.toUpperCase(), value: c }))}
                          onChange={(val) => setMetaForm({...metaForm, type: val})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 pt-0 flex-shrink-0 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-white/5">
                    <button 
                      onClick={showEditModal ? handleEditRequest : handleUpload} 
                      disabled={isProcessing || !metaForm.name.trim()} 
                      className="w-full bg-orange-600 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-xl active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>Submit</span>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-10 text-center space-y-6">
                   <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-7 h-7"><polyline points="20 6 9 17 4 12"/></svg></div>
                   <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tighter uppercase">Success</h3>
                   <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Resource updated in Nexus.</p>
                </div>
              )}
           </div>
        </div>
      )}

      {/* Global Processing Loader */}
      {isProcessing && !showUploadModal && !showEditModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/10 backdrop-blur-[2px] pointer-events-auto">
          <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-fade-in border border-slate-200 dark:border-white/5">
            <div className="w-5 h-5 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-white">Executing Sync...</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ContentLibrary;

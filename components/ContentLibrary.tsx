
import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { LibraryFile, UserProfile } from '../types.ts';
import NexusServer from '../services/nexusServer.ts';

const SUBJECTS = ['CSE326', 'CSE408', 'MTH166', 'PEL121', 'INT213', 'CSE202', 'CSE310', 'Other'];
const SEMESTERS = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8', 'Other'];
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
      if (left + width > winW - margin) left = Math.max(margin, winW - width - margin);
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
      if (dropdownRef.current && !dropdownRef.current.contains(target) && portalRef.current && !portalRef.current.contains(target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : (placeholder || label);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button type="button" onClick={() => setIsOpen(!isOpen)} className={`flex items-center justify-between w-full px-5 py-3 rounded-2xl border transition-all duration-300 font-black text-[11px] uppercase tracking-widest ${isOpen ? 'bg-white dark:bg-white/10 border-orange-500 shadow-lg' : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-white/5 text-slate-700 dark:text-white'}`}>
        <span className="truncate">{displayLabel}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`w-3.5 h-3.5 ml-2 transition-transform ${isOpen ? 'rotate-180 text-orange-500' : 'text-slate-400'}`}><polyline points="6 9 12 15 18 9" /></svg>
      </button>
      {isOpen && coords.width > 0 && createPortal(
        <div ref={portalRef} className={`fixed z-[999] glass-panel rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black ${coords.direction === 'up' ? '-translate-y-full' : ''}`} style={{ top: coords.top, left: coords.left, width: coords.width }}>
          <div className="py-1 max-h-48 overflow-y-auto no-scrollbar">
            {options.map((opt) => (
              <button key={opt.value} type="button" onClick={() => { onChange(opt.value); setIsOpen(false); }} className={`w-full text-left px-5 py-3 text-[11px] font-black uppercase tracking-widest transition-colors ${value === opt.value ? 'bg-orange-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-white/5 hover:text-orange-500'}`}>{opt.label}</button>
            ))}
          </div>
        </div>, document.body
      )}
    </div>
  );
};

const FolderIcon = ({ size = "w-10 h-10" }: { size?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`${size} text-orange-600 mb-4`}>
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
  const [activeSemester, setActiveSemester] = useState<string | null>(null);
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [isAdminView, setIsAdminView] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processSuccess, setProcessSuccess] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [metaForm, setMetaForm] = useState({ name: '', description: '', semester: 'Sem 1', customSemester: '', subject: 'CSE326', customSubject: '', type: 'Lecture', customType: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFromDatabase = useCallback(async () => {
    setIsLoading(true);
    try {
      let data: LibraryFile[] = isAdminView ? await NexusServer.fetchPendingFiles() : await NexusServer.fetchFiles(searchQuery, 'All');
      if (selectedType !== 'All') data = data.filter(f => f.type === selectedType);
      data.sort((a, b) => {
        if (sortBy === 'newest') return b.uploadDate - a.uploadDate;
        if (sortBy === 'oldest') return a.uploadDate - b.uploadDate;
        if (sortBy === 'az') return a.name.localeCompare(b.name);
        if (sortBy === 'size_desc') return (parseFloat(b.size) || 0) - (parseFloat(a.size) || 0);
        return 0;
      });
      setFiles(data);
    } catch (e: any) { setError(e.message); } finally { setIsLoading(false); }
  }, [isAdminView, searchQuery, selectedType, sortBy]);

  useEffect(() => { fetchFromDatabase(); }, [fetchFromDatabase]);

  const handleUpload = async () => {
    if (!pendingFile || !metaForm.name.trim()) return;
    setIsProcessing(true);
    try {
      await NexusServer.uploadFile(pendingFile, metaForm.name, metaForm.description, metaForm.subject === 'Other' ? metaForm.customSubject : metaForm.subject, metaForm.semester === 'Other' ? metaForm.customSemester : metaForm.semester, metaForm.type === 'Other' ? metaForm.customType : metaForm.type, userProfile?.is_admin || false);
      setProcessSuccess(true);
      setTimeout(() => { setShowUploadModal(false); setProcessSuccess(false); fetchFromDatabase(); }, 1500);
    } catch (e: any) { alert(e.message); } finally { setIsProcessing(false); }
  };

  const handleApprove = async (id: string) => {
    setIsProcessing(true);
    try { await NexusServer.approveFile(id); fetchFromDatabase(); } catch (e: any) { alert(e.message); } finally { setIsProcessing(false); }
  };

  const isSearchActive = searchQuery.trim() !== '' || selectedType !== 'All';

  // Hierarchical Logic
  const groupedData = files.reduce((acc, file) => {
    const sem = file.semester || 'Other';
    if (!acc[sem]) acc[sem] = {};
    if (!acc[sem][file.subject]) acc[sem][file.subject] = [];
    acc[sem][file.subject].push(file);
    return acc;
  }, {} as Record<string, Record<string, LibraryFile[]>>);

  const semesters = Object.keys(groupedData).sort();
  const subjects = activeSemester ? Object.keys(groupedData[activeSemester]).sort() : [];
  const activeFiles = (activeSemester && activeSubject) ? (groupedData[activeSemester][activeSubject] || []) : [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-10 animate-fade-in pb-20 px-4 md:px-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tighter uppercase flex items-center gap-4">
            Library
            <span className="text-[10px] font-black px-3 py-1 rounded-lg border bg-orange-500/10 text-orange-600 border-orange-500/20 uppercase tracking-widest">Verified</span>
          </h2>
          {(activeSemester || activeSubject) && !isSearchActive && !isAdminView && (
            <nav className="mt-4 flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
              <button onClick={() => { setActiveSemester(null); setActiveSubject(null); }} className="hover:text-orange-500">Root</button>
              {activeSemester && <><span className="opacity-30">/</span><button onClick={() => setActiveSubject(null)} className={!activeSubject ? 'text-orange-600' : 'hover:text-orange-500'}>{activeSemester}</button></>}
              {activeSubject && <><span className="opacity-30">/</span><span className="text-orange-600">{activeSubject}</span></>}
            </nav>
          )}
        </div>
        <button onClick={() => fileInputRef.current?.click()} className="px-8 py-4 bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Contribute
        </button>
      </header>

      {!isAdminView && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-6 relative">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" placeholder="Search resources..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="md:col-span-6 grid grid-cols-2 gap-4">
            <CustomDropdown label="Type" value={selectedType} options={[{ label: 'ALL TYPES', value: 'All' }, ...CATEGORIES.map(c => ({ label: c.toUpperCase(), value: c }))]} onChange={setSelectedType} />
            <CustomDropdown label="Sort" value={sortBy} options={SORT_OPTIONS} onChange={setSortBy} />
          </div>
        </div>
      )}

      <input type="file" ref={fileInputRef} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) { setPendingFile(f); setMetaForm(p => ({ ...p, name: f.name.replace(/\.[^/.]+$/, "") })); setShowUploadModal(true); } }} />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {isLoading ? <div className="col-span-full py-40 text-center animate-pulse text-slate-400 font-black uppercase text-xs">Syncing Registry...</div> : 
        (isSearchActive || isAdminView) ? (
          files.map(file => (
            <FileCard key={file.id} file={file} isAdmin={isAdminView} onApprove={() => handleApprove(file.id)} onAccess={() => NexusServer.getFileUrl(file.storage_path).then(url => window.open(url, '_blank'))} />
          ))
        ) : !activeSemester ? (
          semesters.map(sem => (
            <div key={sem} onClick={() => setActiveSemester(sem)} className="group p-8 rounded-[40px] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/40 hover:border-orange-500 hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden flex flex-col justify-center min-h-[180px]">
              <FolderIcon size="w-12 h-12" />
              <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">{sem}</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">{Object.keys(groupedData[sem]).length} Subjects</p>
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform"><FolderIcon size="w-24 h-24" /></div>
            </div>
          ))
        ) : !activeSubject ? (
          subjects.map(subj => (
            <div key={subj} onClick={() => setActiveSubject(subj)} className="group p-8 rounded-[40px] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/40 hover:border-orange-500 hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden flex flex-col justify-center min-h-[180px]">
              <FolderIcon size="w-12 h-12" />
              <h3 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tighter uppercase">{subj}</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">{groupedData[activeSemester!][subj].length} Files</p>
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform"><FolderIcon size="w-24 h-24" /></div>
            </div>
          ))
        ) : (
          activeFiles.map(file => (
            <FileCard key={file.id} file={file} isAdmin={false} onAccess={() => NexusServer.getFileUrl(file.storage_path).then(url => window.open(url, '_blank'))} />
          ))
        )}
      </div>

      {(showUploadModal || showEditModal) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-950 rounded-[40px] w-full max-w-lg shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gradient-to-r from-orange-600 to-red-700 p-8 text-white relative flex-shrink-0">
              <button onClick={() => { setShowUploadModal(false); setShowEditModal(false); }} className="absolute top-6 right-6 p-2 opacity-50 hover:opacity-100 transition-opacity"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
              <h3 className="text-2xl font-black tracking-tighter uppercase">Contribute</h3>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-1">Registry Entry</p>
            </div>
            <div className="p-8 space-y-6 overflow-y-auto no-scrollbar flex-1">
              <div><label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Name</label><input value={metaForm.name} onChange={e => setMetaForm({...metaForm, name: e.target.value})} className="w-full bg-slate-100 dark:bg-black/40 p-4 rounded-2xl font-bold border border-transparent focus:ring-2 focus:ring-orange-500 outline-none" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Semester</label><CustomDropdown label="Sem" value={metaForm.semester} options={SEMESTERS.map(s => ({ label: s.toUpperCase(), value: s }))} onChange={v => setMetaForm({...metaForm, semester: v})} /></div>
                <div><label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Subject</label><CustomDropdown label="Sub" value={metaForm.subject} options={SUBJECTS.map(s => ({ label: s.toUpperCase(), value: s }))} onChange={v => setMetaForm({...metaForm, subject: v})} /></div>
              </div>
              <div><label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Category</label><CustomDropdown label="Cat" value={metaForm.type} options={CATEGORIES.map(c => ({ label: c.toUpperCase(), value: c }))} onChange={v => setMetaForm({...metaForm, type: v})} /></div>
            </div>
            <div className="p-8 pt-0 flex-shrink-0">
              <button onClick={handleUpload} disabled={isProcessing || !metaForm.name.trim()} className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 disabled:opacity-50 transition-all">{isProcessing ? 'Syncing...' : 'Deploy'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Fixed FileCard component to support 'key' prop in JSX via React.FC and allowed void | Promise return types for callbacks to match usage.
const FileCard: React.FC<{ 
  file: LibraryFile; 
  isAdmin: boolean; 
  onApprove?: () => void | Promise<any>; 
  onAccess: () => void | Promise<any>; 
}> = ({ file, isAdmin, onApprove, onAccess }) => (
  <div className="group p-6 rounded-[40px] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-950/40 hover:border-orange-500 hover:shadow-2xl transition-all relative overflow-hidden flex flex-col min-h-[220px]">
    <div className="mb-4 w-12 h-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center group-hover:text-orange-500 transition-colors">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
    </div>
    <h3 className="text-base md:text-lg font-black text-slate-800 dark:text-white tracking-tight leading-tight line-clamp-2 mb-2">{file.name}</h3>
    <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
      <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border border-orange-500/10 text-orange-600 bg-orange-500/5">{file.subject}</span>
      <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border border-blue-500/10 text-blue-600 bg-blue-500/5">{file.semester}</span>
    </div>
    <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{file.size}</span>
      {isAdmin ? (
        <button onClick={() => onApprove && onApprove()} className="bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase">Approve</button>
      ) : (
        <button onClick={onAccess} className="text-orange-600 font-black text-[11px] uppercase tracking-widest flex items-center gap-2">Access <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></button>
      )}
    </div>
  </div>
);

export default ContentLibrary;

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { UserProfile } from '../types.ts';
import NexusServer from '../services/nexusServer.ts';

interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
  marks?: number;
}

const GRADE_POINTS: Record<string, number> = {
  'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0
};

const GRADELIST = ['O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F'];

const getGradeFromMarks = (marks: number): string => {
  if (marks === 0) return 'F';
  if (marks >= 90) return 'O';
  if (marks >= 80) return 'A+';
  if (marks >= 70) return 'A';
  if (marks >= 60) return 'B+';
  if (marks >= 50) return 'B';
  if (marks >= 45) return 'C';
  if (marks >= 40) return 'P';
  return 'F';
};

interface CGPACalculatorProps {
  userProfile?: UserProfile | null;
}

const CGPACalculator: React.FC<CGPACalculatorProps> = ({ userProfile }) => {
  const [inputMode, setInputMode] = useState<'marks' | 'grades'>('marks');
  const [currentSemester, setCurrentSemester] = useState<number>(1);
  const [prevCGPA, setPrevCGPA] = useState<number>(0);
  const [prevTotalCredits, setPrevTotalCredits] = useState<number>(0);
  const [targetCGPA, setTargetCGPA] = useState<number>(0);
  const [manualAdjustments, setManualAdjustments] = useState<Record<number, number>>({});
  const [courses, setCourses] = useState<Course[]>([]);
  
  const [isSemDropdownOpen, setIsSemDropdownOpen] = useState(false);
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const semDropdownRef = useRef<HTMLDivElement>(null);
  const modeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadHistory();
    const handleClickOutside = (event: MouseEvent) => {
      if (semDropdownRef.current && !semDropdownRef.current.contains(event.target as Node)) setIsSemDropdownOpen(false);
      if (modeDropdownRef.current && !modeDropdownRef.current.contains(event.target as Node)) setIsModeDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userProfile]);

  const loadHistory = async () => {
    try {
      const records = await NexusServer.fetchRecords(userProfile?.id || null, 'cgpa_snapshot');
      setHistory(records);
    } catch (e) { console.error(e); }
  };

  const saveSnapshot = async () => {
    setIsSaving(true);
    const content = {
      courses, prevCGPA, prevTotalCredits, targetCGPA, manualAdjustments, currentSemester, inputMode
    };
    try {
      await NexusServer.saveRecord(userProfile?.id || null, 'cgpa_snapshot', `Sem ${currentSemester} Ledger`, content);
      loadHistory();
      setIsHistoryOpen(true);
    } catch (e) { alert("Save failed"); } finally { setIsSaving(false); }
  };

  const loadSnapshot = (record: any) => {
    const c = record.content;
    setCourses(c.courses);
    setPrevCGPA(c.prevCGPA);
    setPrevTotalCredits(c.prevTotalCredits);
    setTargetCGPA(c.targetCGPA);
    setManualAdjustments(c.manualAdjustments);
    setCurrentSemester(c.currentSemester);
    setInputMode(c.inputMode);
    setIsHistoryOpen(false);
  };

  const deleteHistory = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await NexusServer.deleteRecord(id, 'cgpa_snapshot', userProfile?.id || null);
    loadHistory();
  };

  const addCourse = () => {
    setCourses([...courses, { id: Math.random().toString(36).substr(2, 9), name: '', credits: 2, grade: 'F', marks: 0 }]);
  };

  const removeCourse = (id: string) => { setCourses(courses.filter(c => c.id !== id)); };

  const updateCourse = (id: string, field: keyof Course, value: any) => {
    setCourses(courses.map(c => {
      if (c.id === id) {
        const updated = { ...c, [field]: value };
        if (field === 'marks') updated.grade = getGradeFromMarks(Number(value));
        return updated;
      }
      return c;
    }));
  };

  const currentStats = useMemo(() => {
    let totalPoints = 0, totalCredits = 0;
    const gradeCounts: Record<string, number> = {};
    GRADELIST.forEach(g => gradeCounts[g] = 0);
    courses.forEach(c => {
      totalPoints += (GRADE_POINTS[c.grade] || 0) * (Number(c.credits) || 0);
      totalCredits += Number(c.credits) || 0;
      gradeCounts[c.grade] = (gradeCounts[c.grade] || 0) + 1;
    });
    return { sgpa: totalCredits === 0 ? 0 : totalPoints / totalCredits, totalPoints, totalCredits, gradeCounts };
  }, [courses]);

  const overallCGPA = useMemo(() => {
    const combinedPoints = (Number(prevCGPA) * Number(prevTotalCredits)) + currentStats.totalPoints;
    const combinedCredits = Number(prevTotalCredits) + currentStats.totalCredits;
    return combinedCredits === 0 ? 0 : (combinedPoints / combinedCredits);
  }, [prevCGPA, prevTotalCredits, currentStats]).toFixed(2);

  const roadmapData = useMemo(() => {
    if (!targetCGPA || targetCGPA <= 0) return { roadmap: [], summary: null };
    const CREDITS_PER_SEM = 20, totalSems = 8;
    const archivedPoints = Number(prevCGPA) * Number(prevTotalCredits);
    const planSemIndices = [];
    for (let i = currentSemester; i <= totalSems; i++) planSemIndices.push(i);
    if (planSemIndices.length === 0) return { roadmap: [], summary: null };
    const plannedCreditsCount = planSemIndices.length * CREDITS_PER_SEM;
    const totalPointsRequired = (targetCGPA * (Number(prevTotalCredits) + plannedCreditsCount)) - archivedPoints;
    let pointGapToFill = totalPointsRequired;
    let manualCount = 0;
    Object.entries(manualAdjustments).forEach(([sem, val]) => {
      if (planSemIndices.includes(parseInt(sem))) { pointGapToFill -= (Number(val) * CREDITS_PER_SEM); manualCount++; }
    });
    const avgNeeded = pointGapToFill / ((planSemIndices.length - manualCount) * CREDITS_PER_SEM);
    return { roadmap: planSemIndices.map(s => ({ sem: s, isManual: manualAdjustments[s] !== undefined, sgpa: manualAdjustments[s] ?? avgNeeded })), summary: { archivedCredits: prevTotalCredits, plannedCredits: plannedCreditsCount, avgNeeded: totalPointsRequired / plannedCreditsCount } };
  }, [targetCGPA, prevCGPA, prevTotalCredits, currentSemester, manualAdjustments]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10 px-4 md:px-0">
      <header className="mb-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tighter">Academic Progress</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">LPU Precision CGPA Hub</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsHistoryOpen(!isHistoryOpen)} className="px-4 py-3 bg-white dark:bg-white/5 border dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-orange-500 transition-all flex items-center gap-2">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
               Vault {history.length > 0 && `(${history.length})`}
            </button>
            <button onClick={saveSnapshot} disabled={isSaving} className="px-6 py-3 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all">
               {isSaving ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 text-orange-600"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>}
               {isSaving ? 'Archiving...' : 'Snapshot'}
            </button>
            <button onClick={() => { 
                const data = { sgpa: currentStats.sgpa.toFixed(2), cgpa: overallCGPA, sem: currentSemester, credits: currentStats.totalCredits, subjects: courses.filter(c => c.name).map(c => ({n: c.name, c: c.credits, g: c.grade})), ts: Date.now() };
                const encoded = btoa(JSON.stringify(data));
                setShareUrl(`${window.location.origin}/share-cgpa?d=${encoded}`);
                setIsShareModalOpen(true);
            }} className="px-6 py-3 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-600/20 active:scale-95 transition-all flex items-center gap-2">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
               Share Report
            </button>
          </div>
        </div>

        {isHistoryOpen && (
          <div className="glass-panel p-6 rounded-[32px] border border-orange-500/20 bg-orange-500/[0.03] animate-fade-in">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Academic Archive</h3>
                <button onClick={() => setIsHistoryOpen(false)} className="text-[10px] font-black text-slate-400">Close</button>
             </div>
             {history.length === 0 ? <p className="text-xs text-slate-400 font-bold py-4 text-center">No snapshots in vault.</p> : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                 {history.map(h => (
                    <div key={h.id} onClick={() => loadSnapshot(h)} className="p-4 bg-white dark:bg-black/40 border border-slate-100 dark:border-white/5 rounded-2xl cursor-pointer hover:border-orange-500/50 transition-all group flex items-center justify-between">
                       <div>
                          <p className="text-xs font-black uppercase tracking-tight dark:text-white">{h.label}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase">{new Date(h.created_at).toLocaleDateString()}</p>
                       </div>
                       <button onClick={(e) => deleteHistory(h.id, e)} className="p-2 text-red-500/20 group-hover:text-red-500 transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
                    </div>
                 ))}
               </div>
             )}
          </div>
        )}
        
        <div className="flex flex-wrap items-center gap-4">
           <div className="relative" ref={semDropdownRef}>
              <button onClick={() => setIsSemDropdownOpen(!isSemDropdownOpen)} className={`flex items-center justify-between min-w-[160px] px-5 py-2.5 rounded-2xl border transition-all duration-300 font-black text-[10px] uppercase tracking-widest ${isSemDropdownOpen ? 'bg-white dark:bg-white/10 border-orange-500 shadow-lg' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white'}`}>
                <span>Semester {currentSemester}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`w-3 h-3 ml-2 transition-transform ${isSemDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {isSemDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-full z-[100] glass-panel rounded-2xl overflow-hidden shadow-2xl border dark:border-white/10 bg-white dark:bg-slate-900">
                  <div className="py-1 max-h-60 overflow-y-auto no-scrollbar">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <button key={sem} onClick={() => { setCurrentSemester(sem); setIsSemDropdownOpen(false); setManualAdjustments({}); }} className={`w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest ${currentSemester === sem ? 'bg-orange-600 text-white' : 'hover:bg-orange-500/10 dark:text-white'}`}>Semester {sem}</button>
                    ))}
                  </div>
                </div>
              )}
           </div>
           <div className="relative" ref={modeDropdownRef}>
            <button onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)} className={`flex items-center justify-between min-w-[160px] px-6 py-2.5 rounded-2xl border transition-all duration-300 font-black text-[10px] uppercase tracking-widest ${isModeDropdownOpen ? 'bg-white dark:bg-white/10 border-orange-500 shadow-lg' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white'}`}>
              <span>Input: {inputMode === 'marks' ? 'Marks' : 'Grades'}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`w-3 h-3 ml-2 transition-transform ${isModeDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {isModeDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full z-[100] glass-panel rounded-2xl overflow-hidden shadow-2xl border dark:border-white/10 bg-white dark:bg-slate-900">
                <div className="py-1"><button onClick={() => { setInputMode('marks'); setIsModeDropdownOpen(false); }} className="w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-orange-500/10 dark:text-white">By Marks</button><button onClick={() => { setInputMode('grades'); setIsModeDropdownOpen(false); }} className="w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-orange-500/10 dark:text-white">By Grades</button></div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-[32px] space-y-4 shadow-sm border dark:border-white/5 bg-white dark:bg-slate-950/50">
            <div className="flex items-center justify-between mb-4"><h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Courses</h3><button onClick={addCourse} className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-600/5 hover:bg-orange-600/10 px-6 py-2 rounded-xl border border-orange-600/20 transition-all">+ Add</button></div>
            {courses.length === 0 ? <div className="py-12 text-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[24px]"><p className="text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-40">No entries for Semester {currentSemester}.</p></div> : (
              <div className="space-y-3">{courses.map((c) => (
                <div key={c.id} className="flex flex-col md:flex-row items-center gap-4 bg-slate-50 dark:bg-black/40 p-4 rounded-[24px] border border-slate-100 dark:border-white/5 animate-fade-in">
                  <div className="flex-1 w-full"><input type="text" placeholder="CSE101" value={c.name} onChange={(e) => updateCourse(c.id, 'name', e.target.value)} className="w-full bg-white dark:bg-white/5 border dark:border-white/10 rounded-2xl px-4 py-2.5 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50" /></div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="w-20"><input type="number" min="0" max="20" value={c.credits} onChange={(e) => updateCourse(c.id, 'credits', parseInt(e.target.value) || 0)} className="w-full bg-white dark:bg-white/5 border dark:border-white/10 rounded-2xl px-3 py-2.5 text-xs text-center font-black dark:text-white outline-none" /></div>
                    <div className="w-24">{inputMode === 'marks' ? <input type="number" min="0" max="100" value={c.marks} onChange={(e) => updateCourse(c.id, 'marks', parseInt(e.target.value) || 0)} className="w-full bg-white dark:bg-white/5 border dark:border-white/10 rounded-2xl px-3 py-2.5 text-xs text-center font-black dark:text-white outline-none" /> : <select value={c.grade} onChange={(e) => updateCourse(c.id, 'grade', e.target.value)} className="w-full bg-white dark:bg-white/5 border dark:border-white/10 rounded-2xl px-3 py-2.5 text-xs text-center font-black dark:text-white outline-none appearance-none">{Object.keys(GRADE_POINTS).map(g => <option key={g} value={g}>{g}</option>)}</select>}</div>
                    <button onClick={() => removeCourse(c.id)} className="p-3 text-red-500/40 hover:text-red-500 transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
                  </div>
                </div>
              ))}</div>
            )}
          </div>
          {currentSemester > 1 && (
            <div className="glass-panel p-6 rounded-[32px] grid grid-cols-2 gap-4 border border-orange-500/10 bg-orange-500/[0.02]">
              <div><p className="text-[8px] font-black uppercase text-slate-400 mb-2 ml-1">Previous CGPA</p><input type="number" step="0.01" value={prevCGPA || ''} onChange={(e) => setPrevCGPA(parseFloat(e.target.value) || 0)} className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3 text-sm font-black dark:text-white outline-none focus:ring-2 focus:ring-orange-500" placeholder="8.45" /></div>
              <div><p className="text-[8px] font-black uppercase text-slate-400 mb-2 ml-1">Total Credits</p><input type="number" value={prevTotalCredits || ''} onChange={(e) => setPrevTotalCredits(parseInt(e.target.value) || 0)} className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3 text-sm font-black dark:text-white outline-none focus:ring-2 focus:ring-orange-500" placeholder="48" /></div>
            </div>
          )}
          <div className="glass-panel p-8 rounded-[40px] space-y-8 shadow-xl border border-blue-500/20 bg-blue-500/[0.03]">
            <header className="flex justify-between items-center"><div><h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Target Roadmap</h3></div><div className="text-right"><p className="text-[8px] font-black uppercase text-slate-400 mb-1">Degree Goal</p><input type="number" step="0.1" max="10" value={targetCGPA || ''} onChange={(e) => { setTargetCGPA(parseFloat(e.target.value) || 0); setManualAdjustments({}); }} className="w-24 bg-white dark:bg-black/60 border border-blue-500/20 rounded-xl px-3 py-2 text-sm text-center font-black text-blue-600 outline-none" placeholder="9.0" /></div></header>
            {targetCGPA > 0 && roadmapData.roadmap.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {roadmapData.roadmap.map((item: any) => (
                  <div key={item.sem} className={`p-4 rounded-3xl border transition-all ${item.isManual ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-black/40 border-slate-100 dark:border-white/5'}`}>
                    <p className="text-[8px] font-black uppercase tracking-widest mb-2 opacity-60">Sem {item.sem}</p>
                    <p className={`text-2xl font-black tracking-tighter ${item.sgpa > 10 ? 'text-red-400' : ''}`}>{item.sgpa > 10 ? '10.0+' : item.sgpa.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div className="glass-panel p-8 rounded-[40px] text-center shadow-2xl bg-gradient-to-br from-orange-600 to-red-700 text-white border-none relative overflow-hidden group">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-3">Current SGPA</h3>
            <p className="text-7xl font-black tracking-tighter mb-4">{currentStats.sgpa.toFixed(2)}</p>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-4"><div className="h-full bg-white transition-all duration-1000" style={{ width: `${(currentStats.sgpa / 10) * 100}%` }} /></div>
            <p className="text-[10px] font-black opacity-70 uppercase tracking-widest">Load: {currentStats.totalCredits} PTS</p>
          </div>
          <div className="glass-panel p-8 rounded-[40px] text-center shadow-2xl bg-gradient-to-br from-slate-800 to-slate-950 text-white border-none relative overflow-hidden group">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-3">Cumulative CGPA</h3>
            <p className="text-7xl font-black tracking-tighter mb-4">{overallCGPA}</p>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-4"><div className="h-full bg-orange-500 transition-all duration-1000" style={{ width: `${(parseFloat(overallCGPA) / 10) * 100}%` }} /></div>
            <p className="text-[10px] font-black opacity-70 uppercase tracking-widest">Standing till Sem {currentSemester}</p>
          </div>
          <div className="glass-panel p-6 rounded-[32px] bg-white dark:bg-slate-950 border dark:border-white/5">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(GRADE_POINTS).map(([g, p]) => (
                <div key={g} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-white/5"><span className="font-black text-slate-800 dark:text-white text-xs">{g}</span><span className="text-slate-400 font-mono text-xs">{p}.0</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-950 rounded-[40px] p-10 w-full max-w-lg shadow-2xl border border-white/10 relative text-center">
            <button onClick={() => setIsShareModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-10 h-10 text-green-500"><polyline points="20 6 9 17 4 12"/></svg></div>
            <h3 className="text-2xl font-black dark:text-white mb-2 uppercase tracking-tighter">Share Link Generated</h3>
            <div className="bg-slate-100 dark:bg-black p-4 rounded-2xl border dark:border-white/10 mb-8 truncate text-[10px] font-mono text-slate-400">{shareUrl}</div>
            <button onClick={() => { navigator.clipboard.writeText(shareUrl); setIsShareModalOpen(false); }} className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Copy & Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CGPACalculator;
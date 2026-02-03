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
      await NexusServer.saveRecord(userProfile?.id || null, 'cgpa_snapshot', `Snapshot: Sem ${currentSemester}`, content);
      loadHistory();
    } catch (e) { alert("Save failed"); } finally { setIsSaving(false); }
  };

  const loadSnapshot = (record: any) => {
    const c = record.content;
    setCourses(c.courses || []);
    setPrevCGPA(c.prevCGPA || 0);
    setPrevTotalCredits(c.prevTotalCredits || 0);
    setTargetCGPA(c.targetCGPA || 0);
    setManualAdjustments(c.manualAdjustments || {});
    setCurrentSemester(c.currentSemester || 1);
    setInputMode(c.inputMode || 'marks');
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
    
    const CREDITS_PER_SEM = 20; 
    const totalSems = 8;
    
    // archivedCredits are semesters strictly BEFORE currentSemester
    const archivedCredits = Number(prevTotalCredits);
    const archivedPoints = Number(prevCGPA) * Number(prevTotalCredits);
    
    // We include current semester and all future ones in the roadmap
    const planSemIndices = [];
    for (let i = currentSemester; i <= totalSems; i++) {
      planSemIndices.push(i);
    }
    
    if (planSemIndices.length === 0) return { roadmap: [], summary: null };

    const plannedCreditsTotal = planSemIndices.length * CREDITS_PER_SEM;
    const degreeTotalCredits = archivedCredits + plannedCreditsTotal;
    const totalPointsRequired = (targetCGPA * degreeTotalCredits) - archivedPoints;

    let pointGapToFill = totalPointsRequired;
    let manualCount = 0;

    Object.entries(manualAdjustments).forEach(([sem, val]) => {
      const s = parseInt(sem);
      if (planSemIndices.includes(s)) {
        pointGapToFill -= (Number(val) * CREDITS_PER_SEM);
        manualCount++;
      }
    });

    const unpinnedCount = planSemIndices.length - manualCount;
    const avgNeededForOthers = unpinnedCount > 0 ? pointGapToFill / (unpinnedCount * CREDITS_PER_SEM) : 0;

    const roadmap = planSemIndices.map(semNum => ({
      sem: semNum,
      isManual: manualAdjustments[semNum] !== undefined,
      sgpa: manualAdjustments[semNum] ?? avgNeededForOthers
    }));

    return { 
      roadmap, 
      summary: {
        archivedCredits: archivedCredits,
        plannedCredits: plannedCreditsTotal,
        avgNeeded: totalPointsRequired / plannedCreditsTotal
      }
    };
  }, [targetCGPA, prevCGPA, prevTotalCredits, currentSemester, manualAdjustments]);

  const adjustSem = (sem: number, delta: number) => {
    const currentVal = roadmapData.roadmap.find(r => r.sem === sem)?.sgpa || 0;
    const newVal = Math.min(10, Math.max(0, currentVal + delta));
    setManualAdjustments(prev => ({ ...prev, [sem]: newVal }));
  };

  const clearPins = () => setManualAdjustments({});

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10 px-4 md:px-0">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mb-2 tracking-tighter uppercase">Academic Pulse</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">LPU Precision Forecasting & Ledger</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsHistoryOpen(!isHistoryOpen)} 
            title="Registry Vault" 
            className={`p-3 rounded-2xl transition-all border-none bg-transparent ${isHistoryOpen ? 'text-orange-600' : 'text-slate-400 hover:text-orange-500'}`}
          >
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
          </button>
          
          <button 
            onClick={saveSnapshot} 
            disabled={isSaving} 
            title="Create Academic Snapshot" 
            className="p-3 rounded-2xl text-slate-400 hover:text-emerald-500 transition-all border-none bg-transparent disabled:opacity-30"
          >
            {isSaving ? <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>}
          </button>

          <button onClick={() => { 
              const data = { sgpa: currentStats.sgpa.toFixed(2), cgpa: overallCGPA, sem: currentSemester, credits: currentStats.totalCredits, subjects: courses.filter(c => c.name).map(c => ({n: c.name, c: c.credits, g: c.grade})), ts: Date.now() };
              const encoded = btoa(JSON.stringify(data));
              setShareUrl(`${window.location.origin}/share-cgpa?d=${encoded}`);
              setIsShareModalOpen(true);
          }} className="ml-2 px-6 py-3 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-600/20 active:scale-95 transition-all flex items-center gap-2 border-none">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
             Share Report
          </button>
        </div>
      </header>

      {isHistoryOpen && (
        <div className="glass-panel p-6 rounded-[32px] border border-orange-500/20 bg-orange-500/[0.03] animate-fade-in mb-8">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-widest flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                Sync Vault
              </h3>
              <button onClick={() => setIsHistoryOpen(false)} className="text-[9px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest border-none bg-transparent">Close Terminal</button>
           </div>
           {history.length === 0 ? <p className="text-xs text-slate-400 font-bold py-8 text-center uppercase tracking-widest opacity-40">Zero snapshots in registry.</p> : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {history.map(h => (
                  <div key={h.id} onClick={() => loadSnapshot(h)} className="p-5 bg-white dark:bg-black/40 border border-slate-100 dark:border-white/5 rounded-3xl cursor-pointer hover:border-orange-500/50 transition-all group flex items-center justify-between shadow-sm hover:shadow-xl">
                     <div>
                        <p className="text-xs font-black uppercase tracking-tight dark:text-white group-hover:text-orange-600 transition-colors">{h.label}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{new Date(h.created_at).toLocaleDateString()}</p>
                     </div>
                     <button onClick={(e) => deleteHistory(h.id, e)} className="p-2 text-red-500/20 group-hover:text-red-500 transition-colors border-none bg-transparent"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
                  </div>
               ))}
             </div>
           )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 mb-8">
         <div className="relative" ref={semDropdownRef}>
            <button onClick={() => setIsSemDropdownOpen(!isSemDropdownOpen)} className={`flex items-center justify-between min-w-[160px] px-6 py-3 rounded-2xl border transition-all duration-300 font-black text-[10px] uppercase tracking-widest ${isSemDropdownOpen ? 'bg-white dark:bg-white/10 border-orange-500 shadow-xl' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white'}`}>
              <span>Semester {currentSemester}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`w-3 h-3 ml-2 transition-transform ${isSemDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {isSemDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full z-[100] glass-panel rounded-2xl overflow-hidden shadow-2xl border dark:border-white/10 bg-white dark:bg-slate-900">
                <div className="py-1 max-h-60 overflow-y-auto no-scrollbar">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <button key={sem} onClick={() => { setCurrentSemester(sem); setIsSemDropdownOpen(false); setManualAdjustments({}); }} className={`w-full text-left px-6 py-3.5 text-[10px] font-black uppercase tracking-widest transition-colors border-none ${currentSemester === sem ? 'bg-orange-600 text-white' : 'hover:bg-orange-500/10 dark:text-white'}`}>Semester {sem}</button>
                  ))}
                </div>
              </div>
            )}
         </div>
         <div className="relative" ref={modeDropdownRef}>
          <button onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)} className={`flex items-center justify-between min-w-[160px] px-6 py-3 rounded-2xl border transition-all duration-300 font-black text-[10px] uppercase tracking-widest ${isModeDropdownOpen ? 'bg-white dark:bg-white/10 border-orange-500 shadow-xl' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white'}`}>
            <span>Input: {inputMode === 'marks' ? 'Marks' : 'Grades'}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`w-3 h-3 ml-2 transition-transform ${isModeDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          {isModeDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-full z-[100] glass-panel rounded-2xl overflow-hidden shadow-2xl border dark:border-white/10 bg-white dark:bg-slate-900">
              <div className="py-1">
                <button onClick={() => { setInputMode('marks'); setIsModeDropdownOpen(false); }} className="w-full text-left px-6 py-3.5 text-[10px] font-black uppercase tracking-widest hover:bg-orange-500/10 dark:text-white transition-colors border-none">By Marks</button>
                <button onClick={() => { setInputMode('grades'); setIsModeDropdownOpen(false); }} className="w-full text-left px-6 py-3.5 text-[10px] font-black uppercase tracking-widest hover:bg-orange-500/10 dark:text-white transition-colors border-none">By Grades</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-8 rounded-[40px] space-y-6 shadow-sm border dark:border-white/5 bg-white dark:bg-slate-950/50 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Semester Ledger</h3>
              <button onClick={addCourse} className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-600/5 hover:bg-orange-600/10 px-6 py-2.5 rounded-xl border border-orange-600/20 transition-all">+ Add Course</button>
            </div>
            {courses.length === 0 ? <div className="py-16 text-center border-4 border-dashed border-slate-100 dark:border-white/5 rounded-[40px]"><p className="text-[10px] font-black uppercase tracking-widest text-slate-400 opacity-40">Terminal ready... awaiting data entries.</p></div> : (
              <div className="space-y-4">{courses.map((c) => (
                <div key={c.id} className="flex flex-col md:flex-row items-center gap-4 bg-slate-50 dark:bg-black/40 p-5 rounded-[32px] border border-slate-100 dark:border-white/5 animate-fade-in group">
                  <div className="flex-1 w-full">
                    <p className="text-[8px] font-black uppercase text-slate-400 mb-1 ml-1 tracking-widest">Course Code</p>
                    <input type="text" placeholder="CSE408" value={c.name} onChange={(e) => updateCourse(c.id, 'name', e.target.value)} className="w-full bg-white dark:bg-white/5 border dark:border-white/10 rounded-2xl px-5 py-3 text-sm font-black dark:text-white outline-none focus:ring-4 focus:ring-orange-600/10 transition-all" />
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="w-24">
                      <p className="text-[8px] font-black uppercase text-slate-400 mb-1 ml-1 tracking-widest text-center">Credits</p>
                      <input type="number" min="0" max="20" value={c.credits} onChange={(e) => updateCourse(c.id, 'credits', parseInt(e.target.value) || 0)} className="w-full bg-white dark:bg-white/5 border dark:border-white/10 rounded-2xl px-3 py-3 text-xs text-center font-black dark:text-white outline-none" />
                    </div>
                    <div className="w-28">
                      <p className="text-[8px] font-black uppercase text-slate-400 mb-1 ml-1 tracking-widest text-center">{inputMode === 'marks' ? 'Marks %' : 'Grade'}</p>
                      {inputMode === 'marks' ? <input type="number" min="0" max="100" value={c.marks} onChange={(e) => updateCourse(c.id, 'marks', parseInt(e.target.value) || 0)} className="w-full bg-white dark:bg-white/5 border dark:border-white/10 rounded-2xl px-3 py-3 text-xs text-center font-black dark:text-white outline-none" /> : <select value={c.grade} onChange={(e) => updateCourse(c.id, 'grade', e.target.value)} className="w-full bg-white dark:bg-white/5 border dark:border-white/10 rounded-2xl px-3 py-3 text-xs text-center font-black dark:text-white outline-none appearance-none cursor-pointer">{Object.keys(GRADE_POINTS).map(g => <option key={g} value={g}>{g}</option>)}</select>}
                    </div>
                    <button onClick={() => removeCourse(c.id)} className="p-3 mt-4 text-red-500/20 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all border-none bg-transparent"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
                  </div>
                </div>
              ))}</div>
            )}
          </div>

          {currentSemester > 1 && (
            <div className="glass-panel p-8 rounded-[40px] grid grid-cols-2 gap-6 border border-orange-500/10 bg-orange-500/[0.02]">
              <div><p className="text-[9px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Archived CGPA (till Sem {currentSemester - 1})</p><input type="number" step="0.01" value={prevCGPA || ''} onChange={(e) => setPrevCGPA(parseFloat(e.target.value) || 0)} className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-4 text-sm font-black dark:text-white outline-none focus:ring-4 focus:ring-orange-600/10 transition-all shadow-inner" placeholder="8.45" /></div>
              <div><p className="text-[9px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Total Credits Archived</p><input type="number" value={prevTotalCredits || ''} onChange={(e) => setPrevTotalCredits(parseInt(e.target.value) || 0)} className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-4 text-sm font-black dark:text-white outline-none focus:ring-4 focus:ring-orange-600/10 transition-all shadow-inner" placeholder="48" /></div>
            </div>
          )}

          <div className="glass-panel p-10 rounded-[56px] space-y-10 shadow-2xl border border-blue-500/20 bg-blue-500/[0.03] relative overflow-hidden group">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] flex items-center gap-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Trajectory Architect
                </h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-60">Simulate remaining path to graduation</p>
              </div>
              <div className="flex items-center gap-4">
                {Object.keys(manualAdjustments).length > 0 && (
                  <button onClick={clearPins} className="text-[8px] font-black uppercase text-slate-400 hover:text-blue-600 tracking-[0.2em] transition-colors underline underline-offset-4 border-none bg-transparent">Reset All</button>
                )}
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">Degree Target</p>
                  <input type="number" step="0.1" max="10" value={targetCGPA || ''} onChange={(e) => { setTargetCGPA(parseFloat(e.target.value) || 0); setManualAdjustments({}); }} className="w-28 bg-white dark:bg-black/60 border border-blue-500/30 rounded-2xl px-4 py-3 text-base text-center font-black text-blue-600 outline-none shadow-xl" placeholder="9.0" />
                </div>
              </div>
            </header>

            {targetCGPA > 0 && roadmapData.summary ? (
              <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-white dark:bg-black/40 rounded-[32px] border border-slate-100 dark:border-white/5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Archived Weight</p>
                    <p className="text-2xl font-black dark:text-white tracking-tighter">{roadmapData.summary.archivedCredits} <span className="text-[10px] text-slate-400 font-bold">PTS</span></p>
                  </div>
                  <div className="p-6 bg-white dark:bg-black/40 rounded-[32px] border border-slate-100 dark:border-white/5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Planned Weight</p>
                    <p className="text-2xl font-black dark:text-white tracking-tighter">{roadmapData.summary.plannedCredits} <span className="text-[10px] text-slate-400 font-bold">PTS</span></p>
                  </div>
                  <div className="p-6 bg-blue-600 text-white rounded-[32px] shadow-2xl shadow-blue-600/30">
                    <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-80">Baseline Needs</p>
                    <p className="text-2xl font-black tracking-tighter">{roadmapData.summary.avgNeeded > 10 ? 'IMPOSSIBLE' : roadmapData.summary.avgNeeded.toFixed(2)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {roadmapData.roadmap.map((item: any) => {
                    const isImpossible = item.sgpa > 10;
                    return (
                      <div key={item.sem} className={`p-5 rounded-[32px] border transition-all relative overflow-hidden ${item.isManual ? 'bg-blue-600 text-white shadow-2xl border-blue-700' : 'bg-white dark:bg-black/40 border-slate-100 dark:border-white/5 hover:border-blue-500/30'}`}>
                        <div className="flex justify-between items-center mb-4">
                           <span className={`text-[9px] font-black uppercase tracking-widest ${item.isManual ? 'text-white' : 'text-slate-400'}`}>Sem {item.sem}</span>
                           {item.isManual && <span className="text-[7px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">Pinned</span>}
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                             <p className={`text-3xl font-black tracking-tighter ${isImpossible ? (item.isManual ? 'text-white' : 'text-red-400') : ''}`}>
                                {isImpossible ? (item.sgpa > 11 ? 'FAIL' : '10.0+') : item.sgpa.toFixed(2)}
                             </p>
                             {isImpossible && <p className={`text-[7px] font-bold uppercase ${item.isManual ? 'text-blue-200' : 'text-red-400/60'} tracking-widest mt-1`}>Critical</p>}
                          </div>
                          <div className="flex flex-col gap-1.5">
                             <button onClick={() => adjustSem(item.sem, 0.1)} className={`p-1.5 rounded-lg transition-all border-none bg-transparent ${item.isManual ? 'hover:bg-white/20 text-white' : 'hover:bg-blue-500/10 text-blue-500'}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3.5 h-3.5"><polyline points="18 15 12 9 6 15"/></svg></button>
                             <button onClick={() => adjustSem(item.sem, -0.1)} className={`p-1.5 rounded-lg transition-all border-none bg-transparent ${item.isManual ? 'hover:bg-white/20 text-white' : 'hover:bg-blue-500/10 text-blue-500'}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3.5 h-3.5"><polyline points="6 9 12 15 18 9"/></svg></button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-20 text-center opacity-30">
                <div className="w-16 h-16 bg-slate-200 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Launch roadmap simulations</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-10 rounded-[56px] text-center shadow-2xl bg-gradient-to-br from-orange-600 to-red-700 text-white border-none relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.5),transparent)]" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80 mb-4 relative z-10">Current SGPA</h3>
            <p className="text-8xl font-black tracking-tighter mb-6 relative z-10">{currentStats.sgpa.toFixed(2)}</p>
            <div className="h-2.5 bg-white/20 rounded-full overflow-hidden mb-6 relative z-10">
              <div className="h-full bg-white shadow-[0_0_20px_white] transition-all duration-1000 ease-out" style={{ width: `${(currentStats.sgpa / 10) * 100}%` }} />
            </div>
            <p className="text-[10px] font-black opacity-70 uppercase tracking-widest relative z-10">Load efficiency: {currentStats.totalCredits} PTS</p>
          </div>

          <div className="glass-panel p-10 rounded-[56px] text-center shadow-2xl bg-gradient-to-br from-slate-800 to-slate-950 text-white border-none relative overflow-hidden group">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80 mb-4 relative z-10">Cumulative CGPA</h3>
            <p className="text-8xl font-black tracking-tighter mb-6 relative z-10">{overallCGPA}</p>
            <div className="h-2.5 bg-white/20 rounded-full overflow-hidden mb-6 relative z-10">
              <div className="h-full bg-orange-600 shadow-[0_0_20px_rgba(234,88,12,0.8)] transition-all duration-1000 ease-out" style={{ width: `${(parseFloat(overallCGPA) / 10) * 100}%` }} />
            </div>
            <p className="text-[10px] font-black opacity-70 uppercase tracking-widest relative z-10">Sem {currentSemester} Standing</p>
          </div>

          <div className="glass-panel p-8 rounded-[40px] bg-white dark:bg-slate-950 border dark:border-white/5">
             <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 text-center">Reference Matrix</h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(GRADE_POINTS).map(([g, p]) => (
                <div key={g} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-orange-500/30 transition-all group">
                  <span className="font-black text-slate-800 dark:text-white text-xs group-hover:text-orange-600 transition-colors">{g}</span>
                  <span className="text-slate-400 font-mono text-xs">{p}.0</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="pt-10 pb-4 text-center">
        <div className="inline-flex items-start gap-4 p-6 bg-slate-100 dark:bg-white/5 rounded-[32px] border border-slate-200 dark:border-white/10 max-w-2xl text-left">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
           <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-widest">
             Note: LPU follows a relative grading system. This calculator utilizes the standard 10-point scale for estimation protocols. Actual results may vary based on your specific batch trajectory and the relative performance curve.
           </p>
        </div>
      </footer>

      {isShareModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-950 rounded-[48px] p-12 w-full max-w-lg shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 relative text-center">
            <button onClick={() => setIsShareModalOpen(false)} className="absolute top-10 right-10 text-slate-400 hover:text-slate-900 transition-all border-none bg-transparent"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-12 h-12 text-emerald-500"><polyline points="20 6 9 17 4 12"/></svg></div>
            <h3 className="text-3xl font-black dark:text-white mb-4 uppercase tracking-tighter">Academic ID Ready</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 leading-relaxed font-medium">Credential protocol synthesized for secure sharing.</p>
            <div className="bg-slate-100 dark:bg-black p-5 rounded-3xl border dark:border-white/10 mb-10 truncate text-[10px] font-mono text-slate-400 shadow-inner">{shareUrl}</div>
            <button onClick={() => { navigator.clipboard.writeText(shareUrl); setIsShareModalOpen(false); }} className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-5 rounded-[24px] font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl border-none">Copy & Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CGPACalculator;
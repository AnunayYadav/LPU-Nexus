
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

const LPU_STANDARDS = [
  { grade: 'O', points: 10, range: '90-100', label: 'Outstanding' },
  { grade: 'A+', points: 9, range: '80-89', label: 'Excellent' },
  { grade: 'A', points: 8, range: '70-79', label: 'Very Good' },
  { grade: 'B+', points: 7, range: '60-69', label: 'Good' },
  { grade: 'B', points: 6, range: '50-59', label: 'Above Avg' },
  { grade: 'C', points: 5, range: '45-49', label: 'Average' },
  { grade: 'P', points: 4, range: '40-44', label: 'Pass' },
  { grade: 'F', points: 0, range: '0-39', label: 'Fail' },
];

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
  const historyPanelRef = useRef<HTMLDivElement>(null);

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
      await NexusServer.saveRecord(userProfile?.id || null, 'cgpa_snapshot', `Saved: Sem ${currentSemester}`, content);
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
    
    // Total credits already earned (before the current semester range we are planning)
    const archivedCredits = Number(prevTotalCredits);
    const archivedPoints = Number(prevCGPA) * archivedCredits;
    
    // Semesters to be planned (from current up to 8)
    const planSemIndices = [];
    for (let i = currentSemester; i <= totalSems; i++) planSemIndices.push(i);
    
    if (planSemIndices.length === 0) return { roadmap: [], summary: null };

    // Total credits the student will have at graduation
    const finalTotalCredits = archivedCredits + (planSemIndices.length * CREDITS_PER_SEM);
    const totalPointsRequiredForTarget = targetCGPA * finalTotalCredits;
    
    let pointsStillNeeded = totalPointsRequiredForTarget - archivedPoints;

    // First pass: remove points from manually locked semesters
    let manualCount = 0;
    Object.entries(manualAdjustments).forEach(([sem, val]) => {
      const sNum = parseInt(sem);
      if (planSemIndices.includes(sNum)) {
        pointsStillNeeded -= (Number(val) * CREDITS_PER_SEM);
        manualCount++;
      }
    });

    const unpinnedCount = planSemIndices.length - manualCount;
    // Calculate required average for unpinned (auto) semesters
    const autoRequiredSGPA = unpinnedCount > 0 
      ? Math.max(0, Math.min(10, pointsStillNeeded / (unpinnedCount * CREDITS_PER_SEM))) 
      : 0;

    const roadmap = planSemIndices.map(semNum => {
      const isManual = manualAdjustments[semNum] !== undefined;
      return {
        sem: semNum,
        isManual,
        sgpa: isManual ? manualAdjustments[semNum] : autoRequiredSGPA
      };
    });

    return { 
      roadmap, 
      summary: {
        avgNeeded: autoRequiredSGPA,
        isImpossible: autoRequiredSGPA > 10 || autoRequiredSGPA < 0
      }
    };
  }, [targetCGPA, prevCGPA, prevTotalCredits, currentSemester, manualAdjustments]);

  const adjustSemTarget = (sem: number, delta: number) => {
    setManualAdjustments(prev => {
      // If semester is not manual yet, use the current auto value as base
      const currentVal = prev[sem] !== undefined ? prev[sem] : (roadmapData.summary?.avgNeeded || 0);
      const nextVal = Math.max(0, Math.min(10, currentVal + delta));
      return { ...prev, [sem]: Number(nextVal.toFixed(1)) };
    });
  };

  const resetManual = (sem: number) => {
    setManualAdjustments(prev => {
      const next = { ...prev };
      delete next[sem];
      return next;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20 px-4 md:px-0">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mb-2 tracking-tighter uppercase leading-none">SGPA & CGPA Hub</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">LPU Precision Grade Protocol</p>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsHistoryOpen(!isHistoryOpen)} 
            className={`p-3 rounded-2xl transition-all border-none bg-transparent flex items-center justify-center ${isHistoryOpen ? 'text-orange-600' : 'text-slate-400 hover:text-orange-500'}`}
            title="Archived Reports"
          >
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
          </button>
          
          <button 
            onClick={saveSnapshot} 
            disabled={isSaving} 
            className="p-3 rounded-2xl text-slate-400 hover:text-emerald-500 transition-all border-none bg-transparent flex items-center justify-center"
            title="Save to Vault"
          >
            {isSaving ? <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>}
          </button>

          <button onClick={() => { 
              const data = { sgpa: currentStats.sgpa.toFixed(2), cgpa: overallCGPA, sem: currentSemester, credits: currentStats.totalCredits, subjects: courses.filter(c => c.name).map(c => ({n: c.name, c: c.credits, g: c.grade})), ts: Date.now() };
              const encoded = btoa(JSON.stringify(data));
              setShareUrl(`${window.location.origin}/share-cgpa?d=${encoded}`);
              setIsShareModalOpen(true);
          }} className="ml-2 px-6 py-3 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-600/20 active:scale-95 transition-all flex items-center gap-2 border-none">
             Generate Link
          </button>
        </div>
      </header>

      {isHistoryOpen && (
        <div ref={historyPanelRef} className="glass-panel p-6 rounded-[32px] border border-orange-500/20 bg-orange-500/[0.03] animate-fade-in mb-8">
           <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-6">Saved Reports</h3>
           {history.length === 0 ? <p className="text-xs text-slate-400 font-bold py-8 text-center uppercase tracking-widest opacity-40">Vault empty.</p> : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {history.map(h => (
                  <div key={h.id} onClick={() => loadSnapshot(h)} className="p-5 bg-white dark:bg-black border border-slate-100 dark:border-white/5 rounded-3xl cursor-pointer hover:border-orange-500/50 transition-all flex items-center justify-between shadow-sm">
                     <div>
                        <p className="text-xs font-black uppercase tracking-tight dark:text-white">{h.label}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">{new Date(h.created_at).toLocaleDateString()}</p>
                     </div>
                     <button onClick={(e) => deleteHistory(h.id, e)} className="p-2 text-red-500/20 hover:text-red-500 border-none bg-transparent"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
                  </div>
               ))}
             </div>
           )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 mb-8">
         <div className="relative" ref={semDropdownRef}>
            <button onClick={() => setIsSemDropdownOpen(!isSemDropdownOpen)} className={`flex items-center justify-between min-w-[160px] px-6 py-3 rounded-2xl border transition-all duration-300 font-black text-[10px] uppercase tracking-widest ${isSemDropdownOpen ? 'bg-white dark:bg-black border-orange-500 shadow-xl' : 'bg-slate-100 dark:bg-black border-slate-200 dark:border-white/10 text-slate-700 dark:text-white'}`}>
              <span>Semester {currentSemester}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`w-3 h-3 ml-2 transition-transform ${isSemDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {isSemDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full z-[100] glass-panel rounded-2xl overflow-hidden shadow-2xl border dark:border-white/10 bg-white dark:bg-black">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <button key={sem} onClick={() => { setCurrentSemester(sem); setIsSemDropdownOpen(false); setManualAdjustments({}); }} className={`w-full text-left px-6 py-3.5 text-[10px] font-black uppercase tracking-widest transition-colors border-none ${currentSemester === sem ? 'bg-orange-600 text-white' : 'hover:bg-orange-500/10 dark:text-white'}`}>Semester {sem}</button>
                ))}
              </div>
            )}
         </div>
         <div className="relative" ref={modeDropdownRef}>
          <button onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)} className={`flex items-center justify-between min-w-[160px] px-6 py-3 rounded-2xl border transition-all duration-300 font-black text-[10px] uppercase tracking-widest ${isModeDropdownOpen ? 'bg-white dark:bg-black border-orange-500 shadow-xl' : 'bg-slate-100 dark:bg-black border-slate-200 dark:border-white/10 text-slate-700 dark:text-white'}`}>
            <span>Use: {inputMode === 'marks' ? 'Marks' : 'Grades'}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`w-3 h-3 ml-2 transition-transform ${isModeDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          {isModeDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-full z-[100] glass-panel rounded-2xl overflow-hidden shadow-2xl border dark:border-white/10 bg-white dark:bg-black">
              <button onClick={() => { setInputMode('marks'); setIsModeDropdownOpen(false); }} className={`w-full text-left px-6 py-3.5 text-[10px] font-black uppercase tracking-widest border-none ${inputMode === 'marks' ? 'bg-orange-600 text-white' : 'hover:bg-orange-500/10 dark:text-white'}`}>By Marks</button>
              <button onClick={() => { setInputMode('grades'); setIsModeDropdownOpen(false); }} className={`w-full text-left px-6 py-3.5 text-[10px] font-black uppercase tracking-widest border-none ${inputMode === 'grades' ? 'bg-orange-600 text-white' : 'hover:bg-orange-500/10 dark:text-white'}`}>By Grades</button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-8 rounded-[40px] space-y-6 shadow-sm border dark:border-white/5 bg-white dark:bg-black/40 relative">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Course Entries</h3>
              <button onClick={addCourse} className="text-[10px] font-black uppercase tracking-widest text-orange-600 bg-orange-600/5 hover:bg-orange-600/10 px-6 py-2.5 rounded-xl border border-orange-600/20 transition-all border-none">+ Add Field</button>
            </div>
            {courses.length === 0 ? <div className="py-16 text-center border-4 border-dashed border-slate-100 dark:border-white/5 rounded-[40px] opacity-40 uppercase font-black text-[10px] tracking-widest">Awaiting Registry Data</div> : (
              <div className="space-y-4">{courses.map((c) => (
                <div key={c.id} className="flex flex-col md:flex-row items-center gap-4 bg-slate-50 dark:bg-black/40 p-5 rounded-[32px] border border-slate-100 dark:border-white/5 transition-all hover:border-orange-500/20">
                  <div className="flex-1 w-full">
                    <input type="text" placeholder="Course Name" value={c.name} onChange={(e) => updateCourse(c.id, 'name', e.target.value)} className="w-full bg-white dark:bg-white/5 border dark:border-white/10 rounded-2xl px-5 py-3 text-sm font-black dark:text-white outline-none focus:ring-2 focus:ring-orange-600/50" />
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="space-y-1">
                       <p className="text-[7px] font-black text-slate-400 uppercase text-center">Credits</p>
                       <input type="number" min="0" max="20" value={c.credits} onChange={(e) => updateCourse(c.id, 'credits', parseInt(e.target.value) || 0)} className="w-16 bg-white dark:bg-white/5 border dark:border-white/10 rounded-2xl px-3 py-3 text-xs text-center font-black dark:text-white outline-none" />
                    </div>
                    <div className="space-y-1">
                       <p className="text-[7px] font-black text-slate-400 uppercase text-center">{inputMode === 'marks' ? 'Marks' : 'Grade'}</p>
                       {inputMode === 'marks' ? <input type="number" min="0" max="100" value={c.marks} onChange={(e) => updateCourse(c.id, 'marks', parseInt(e.target.value) || 0)} className="w-20 bg-white dark:bg-white/5 border dark:border-white/10 rounded-2xl px-3 py-3 text-xs text-center font-black dark:text-white outline-none" /> : <select value={c.grade} onChange={(e) => updateCourse(c.id, 'grade', e.target.value)} className="w-20 bg-white dark:bg-white/5 border dark:border-white/10 rounded-2xl px-3 py-3 text-xs text-center font-black dark:text-white outline-none">{Object.keys(GRADE_POINTS).map(g => <option key={g} value={g}>{g}</option>)}</select>}
                    </div>
                    <button onClick={() => removeCourse(c.id)} className="p-3 text-red-500/20 hover:text-red-500 border-none bg-transparent mt-4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
                  </div>
                </div>
              ))}</div>
            )}
          </div>

          {/* DEGREE TARGET SECTION - AUTO BALANCING Roadmap */}
          <div className="glass-panel p-10 rounded-[56px] space-y-10 shadow-2xl border border-blue-500/20 bg-blue-500/[0.03]">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em]">Degree Target</h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Forecast individual semester performance</p>
              </div>
              <div className="relative">
                 <input type="number" step="0.1" max="10" value={targetCGPA || ''} onChange={(e) => setTargetCGPA(parseFloat(e.target.value) || 0)} className="w-28 bg-white dark:bg-black/60 border border-blue-500/30 rounded-2xl px-4 py-3 text-base text-center font-black text-blue-600 outline-none focus:ring-4 focus:ring-blue-500/10" placeholder="9.0" />
                 <span className="absolute -top-2 -right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-[8px] font-black">!</span>
              </div>
            </header>

            {targetCGPA > 0 && roadmapData.summary ? (
              <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {roadmapData.roadmap.map((item) => (
                    <div key={item.sem} className={`p-5 rounded-[32px] border transition-all flex flex-col items-center justify-center text-center relative overflow-hidden ${item.isManual ? 'bg-orange-600/10 border-orange-600/30 shadow-lg' : 'bg-white dark:bg-black border-slate-100 dark:border-white/5'}`}>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3">Sem {item.sem}</p>
                      
                      <div className="flex items-center gap-3 relative z-10">
                        <button 
                          onClick={() => adjustSemTarget(item.sem, -0.1)} 
                          className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-white hover:bg-orange-600 hover:text-white transition-all border-none"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><path d="M5 12h14"/></svg>
                        </button>
                        <span className={`text-2xl font-black tracking-tighter ${item.isManual ? 'text-orange-600' : 'text-blue-600'}`}>
                          {item.sgpa.toFixed(1)}
                        </span>
                        <button 
                          onClick={() => adjustSemTarget(item.sem, 0.1)} 
                          className="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-white hover:bg-orange-600 hover:text-white transition-all border-none"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><path d="M12 5v14M5 12h14"/></svg>
                        </button>
                      </div>

                      {item.isManual ? (
                        <button 
                          onClick={() => resetManual(item.sem)} 
                          className="mt-3 text-[7px] font-black uppercase text-orange-600 tracking-widest hover:underline border-none bg-transparent flex items-center gap-1"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2 h-2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                          Locked • Reset
                        </button>
                      ) : (
                        <p className="mt-3 text-[7px] font-black uppercase text-slate-400 tracking-widest">Auto Balancing</p>
                      )}
                      
                      {item.isManual && <div className="absolute top-0 right-0 w-2 h-2 bg-orange-600 rounded-bl-lg" />}
                    </div>
                  ))}
                </div>

                <div className={`p-6 rounded-[32px] border flex items-center gap-4 ${roadmapData.summary.isImpossible ? 'bg-red-500/10 border-red-500/20' : 'bg-blue-600/5 border-blue-600/10'}`}>
                  <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center flex-shrink-0 font-black text-xs ${roadmapData.summary.isImpossible ? 'bg-red-500' : 'bg-blue-600'}`}>
                    {roadmapData.summary.isImpossible ? '!' : 'i'}
                  </div>
                  <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                    {roadmapData.summary.isImpossible 
                      ? "Target mathematically unreachable with current constraints. Reduce manual locks or lower target CGPA."
                      : <>Auto-balancing: Unlocked semesters now updated to require an average of <strong className="text-blue-600">{roadmapData.summary.avgNeeded.toFixed(2)} SGPA</strong> to maintain your <strong className="text-blue-600">{targetCGPA}</strong> goal.</>
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center border-4 border-dashed border-slate-100 dark:border-white/5 rounded-[48px] opacity-40">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Enter Target CGPA to run simulation</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-10 rounded-[56px] text-center shadow-2xl bg-gradient-to-br from-orange-600 to-red-700 text-white border-none relative overflow-hidden group">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80 mb-4 relative z-10">Current SGPA</h3>
            <p className="text-6xl font-black tracking-tighter mb-6 relative z-10">{currentStats.sgpa.toFixed(2)}</p>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden relative z-10">
              <div className="h-full bg-white transition-all duration-1000" style={{ width: `${(currentStats.sgpa / 10) * 100}%` }} />
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 blur-[60px] rounded-full group-hover:scale-125 transition-transform" />
          </div>

          <div className="glass-panel p-10 rounded-[56px] text-center shadow-2xl bg-black text-white border border-white/10 relative overflow-hidden group">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80 mb-4 relative z-10">Overall CGPA</h3>
            <p className="text-6xl font-black tracking-tighter mb-6 relative z-10">{overallCGPA}</p>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden relative z-10">
              <div className="h-full bg-orange-600 transition-all duration-1000" style={{ width: `${(parseFloat(overallCGPA) / 10) * 100}%` }} />
            </div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-600/5 blur-[60px] rounded-full group-hover:scale-125 transition-transform" />
          </div>

          <div className="glass-panel p-8 rounded-[40px] border border-slate-200 dark:border-white/5 bg-white dark:bg-black/20">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 dark:border-white/5 pb-4">Grade Pulse</h3>
             <div className="space-y-4">
                {Object.entries(currentStats.gradeCounts).filter(([_, count]) => count > 0).map(([grade, count]) => (
                  <div key={grade} className="flex items-center justify-between">
                    <span className="text-xs font-black dark:text-white uppercase">Grade {grade}</span>
                    <div className="flex items-center gap-3">
                       <div className="h-1.5 w-24 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-600" style={{ width: `${(count / courses.length) * 100}%` }} />
                       </div>
                       <span className="text-[10px] font-black text-orange-600">{count}</span>
                    </div>
                  </div>
                ))}
                {courses.length === 0 && <p className="text-[9px] font-bold text-slate-500 uppercase italic">Awaiting grade input...</p>}
             </div>
          </div>
        </div>
      </div>

      {/* LPU GRADING PROTOCOL */}
      <div className="glass-panel p-8 rounded-[40px] border border-slate-200 dark:border-white/5 bg-white dark:bg-black/60 shadow-sm overflow-hidden">
        <header className="flex items-center justify-between mb-8">
           <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">LPU Grading Standards</h3>
           <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full">Standard Reference</span>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {LPU_STANDARDS.map((s) => (
            <div key={s.grade} className="p-4 rounded-[28px] bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 flex flex-col items-center text-center group hover:border-orange-500/30 transition-all">
              <span className="text-xl font-black text-slate-900 dark:text-white mb-1 group-hover:scale-110 transition-transform">{s.grade}</span>
              <p className="text-[8px] font-black text-orange-600 uppercase tracking-widest mb-2">{s.points} Points</p>
              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-0.5">{s.range} Marks</p>
              <p className="text-[7px] font-black text-slate-400 uppercase tracking-tighter opacity-40">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 rounded-2xl bg-orange-600/5 border border-orange-600/10">
          <p className="text-[9px] font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong className="text-orange-600">Pro Tip:</strong> LPU uses relative grading based on class performance. These mark ranges are "Safe Estimates" to ensure you hit your target grade regardless of class average shifts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CGPACalculator;

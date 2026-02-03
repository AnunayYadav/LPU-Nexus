import React, { useState, useMemo, useRef, useEffect } from 'react';

interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
  marks?: number;
}

const GRADE_POINTS: Record<string, number> = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'P': 4,
  'F': 0
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

const CGPACalculator: React.FC = () => {
  const [inputMode, setInputMode] = useState<'marks' | 'grades'>('marks');
  const [currentSemester, setCurrentSemester] = useState<number>(1);
  const [prevCGPA, setPrevCGPA] = useState<number>(0);
  const [prevTotalCredits, setPrevTotalCredits] = useState<number>(0);
  
  // Target Achiever State - No defaults
  const [targetCGPA, setTargetCGPA] = useState<number>(0);
  const [manualAdjustments, setManualAdjustments] = useState<Record<number, number>>({});
  
  // Dropdown States
  const [isSemDropdownOpen, setIsSemDropdownOpen] = useState(false);
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  
  const semDropdownRef = useRef<HTMLDivElement>(null);
  const modeDropdownRef = useRef<HTMLDivElement>(null);
  
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: '', credits: 2, grade: 'F', marks: 0 },
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (semDropdownRef.current && !semDropdownRef.current.contains(event.target as Node)) setIsSemDropdownOpen(false);
      if (modeDropdownRef.current && !modeDropdownRef.current.contains(event.target as Node)) setIsModeDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addCourse = () => {
    setCourses([...courses, { id: Math.random().toString(36).substr(2, 9), name: '', credits: 2, grade: 'F', marks: 0 }]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) setCourses(courses.filter(c => c.id !== id));
  };

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
    let totalPoints = 0;
    let totalCredits = 0;
    const gradeCounts: Record<string, number> = {};
    GRADELIST.forEach(g => gradeCounts[g] = 0);
    courses.forEach(c => {
      const point = GRADE_POINTS[c.grade] || 0;
      const credits = Number(c.credits) || 0;
      totalPoints += point * credits;
      totalCredits += credits;
      gradeCounts[c.grade] = (gradeCounts[c.grade] || 0) + 1;
    });
    const maxGradeCount = Math.max(...Object.values(gradeCounts));
    const sgpa = totalCredits === 0 ? 0 : totalPoints / totalCredits;
    return { sgpa, totalPoints, totalCredits, gradeCounts, maxGradeCount };
  }, [courses]);

  const overallCGPA = useMemo(() => {
    if (currentSemester === 1) return currentStats.sgpa.toFixed(2);
    // Explicitly convert variables to numbers to ensure arithmetic operations are valid
    const prevPoints = Number(prevCGPA) * Number(prevTotalCredits);
    const combinedPoints = prevPoints + Number(currentStats.totalPoints);
    const combinedCredits = Number(prevTotalCredits) + Number(currentStats.totalCredits);
    // Fixed: Wrapped division in Number() conversion to satisfy arithmetic type constraints on line 130
    return combinedCredits === 0 ? "0.00" : (Number(combinedPoints) / Number(combinedCredits)).toFixed(2);
  }, [currentSemester, prevCGPA, prevTotalCredits, currentStats]);

  const roadmap = useMemo(() => {
    if (!targetCGPA) return [];
    
    const TOTAL_DEGREE_CREDITS = 160; 
    const CREDITS_PER_SEM = 20;
    const totalSems = 8;
    
    const finishedCredits = Number(prevTotalCredits);
    const finishedPoints = Number(prevCGPA) * finishedCredits;
    const totalPointsNeeded = Number(targetCGPA) * TOTAL_DEGREE_CREDITS;
    
    let remainingPointsNeeded = totalPointsNeeded - finishedPoints;
    const futureSems = Array.from({ length: totalSems - currentSemester + 1 }, (_, i) => currentSemester + i);
    
    let adjustedSemsCount = 0;
    Object.entries(manualAdjustments).forEach(([sem, val]) => {
      const semNum = parseInt(sem);
      if (futureSems.includes(semNum)) {
        remainingPointsNeeded -= (Number(val) * CREDITS_PER_SEM);
        adjustedSemsCount++;
      }
    });

    const unadjustedSemsCount = futureSems.length - adjustedSemsCount;
    const avgNeededForOthers = unadjustedSemsCount > 0 ? remainingPointsNeeded / (unadjustedSemsCount * CREDITS_PER_SEM) : 0;

    return futureSems.map(sem => ({
      sem,
      isManual: manualAdjustments[sem] !== undefined,
      sgpa: manualAdjustments[sem] ?? avgNeededForOthers
    }));
  }, [targetCGPA, prevCGPA, prevTotalCredits, currentSemester, manualAdjustments]);

  const adjustSem = (sem: number, delta: number) => {
    const currentVal = roadmap.find(r => r.sem === sem)?.sgpa || 0;
    const newVal = Math.min(10, Math.max(0, currentVal + delta));
    setManualAdjustments(prev => ({ ...prev, [sem]: newVal }));
  };

  const handleShare = () => {
    const data = { sgpa: currentStats.sgpa.toFixed(2), cgpa: overallCGPA, sem: currentSemester, credits: currentStats.totalCredits, grades: currentStats.gradeCounts, ts: Date.now() };
    const encoded = btoa(JSON.stringify(data));
    const url = `${window.location.origin}/share-cgpa?d=${encoded}`;
    setShareUrl(url);
    setIsShareModalOpen(true);
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
      <header className="mb-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tighter">Academic Progress</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Detailed SGPA/CGPA breakdown.</p>
          </div>
          <button onClick={handleShare} className="flex items-center justify-center space-x-2 px-6 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 text-orange-600"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            <span>Share Report</span>
          </button>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           <div className="relative" ref={semDropdownRef}>
              <button onClick={() => setIsSemDropdownOpen(!isSemDropdownOpen)} className={`flex items-center justify-between min-w-[160px] px-5 py-2.5 rounded-2xl border transition-all duration-300 font-black text-[10px] uppercase tracking-widest ${isSemDropdownOpen ? 'bg-white dark:bg-white/10 border-orange-500 shadow-lg' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white'}`}>
                <span>Semester {currentSemester}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`w-3 h-3 ml-2 transition-transform ${isSemDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {isSemDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-full z-[100] glass-panel rounded-2xl overflow-hidden shadow-2xl border dark:border-white/10">
                  <div className="py-1 max-h-60 overflow-y-auto no-scrollbar">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                      <button key={sem} onClick={() => { setCurrentSemester(sem); setIsSemDropdownOpen(false); }} className={`w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest ${currentSemester === sem ? 'bg-orange-600 text-white' : 'hover:bg-orange-500/10'}`}>Semester {sem}</button>
                    ))}
                  </div>
                </div>
              )}
           </div>

           <div className="relative" ref={modeDropdownRef}>
            <button onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)} className={`flex items-center justify-between min-w-[160px] px-6 py-2.5 rounded-2xl border transition-all duration-300 font-black text-[10px] uppercase tracking-widest ${isModeDropdownOpen ? 'bg-white dark:bg-white/10 border-orange-500 shadow-lg' : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white'}`}>
              <span>{inputMode === 'marks' ? 'By Marks' : 'By Grades'}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`w-3 h-3 ml-2 transition-transform ${isModeDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {isModeDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full z-[100] glass-panel rounded-2xl overflow-hidden shadow-2xl border dark:border-white/10">
                <div className="py-1">
                  <button onClick={() => { setInputMode('marks'); setIsModeDropdownOpen(false); }} className={`w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest ${inputMode === 'marks' ? 'bg-orange-600 text-white' : 'hover:bg-orange-500/10'}`}>By Marks</button>
                  <button onClick={() => { setInputMode('grades'); setIsModeDropdownOpen(false); }} className={`w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest ${inputMode === 'grades' ? 'bg-orange-600 text-white' : 'hover:bg-orange-500/10'}`}>By Grades</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-[32px] space-y-4 shadow-sm border dark:border-white/5 bg-white dark:bg-slate-950/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Semester Courses</h3>
              <button onClick={addCourse} className="text-[10px] font-black uppercase tracking-widest text-orange-600 hover:bg-orange-600/10 px-4 py-2 rounded-xl transition-all">Add Course</button>
            </div>
            <div className="space-y-3">
              {courses.map((course) => (
                <div key={course.id} className="flex flex-col md:flex-row items-center gap-4 bg-slate-50 dark:bg-black/40 p-4 rounded-[24px] border border-slate-100 dark:border-white/5 relative group animate-fade-in">
                  <div className="flex-1 w-full">
                    <p className="text-[8px] font-black uppercase text-slate-400 mb-1 ml-1">Subject</p>
                    <input type="text" placeholder="e.g. CSE326" value={course.name} onChange={(e) => updateCourse(course.id, 'name', e.target.value)} className="w-full bg-white dark:bg-white/5 border dark:border-white/10 rounded-2xl px-4 py-2.5 text-sm text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50 transition-all" />
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="w-24">
                      <p className="text-[8px] font-black uppercase text-slate-400 mb-1 ml-1">Credits</p>
                      <input type="number" min="0" max="20" value={course.credits} onChange={(e) => updateCourse(course.id, 'credits', parseInt(e.target.value) || 0)} className="w-full bg-white dark:bg-white/5 border dark:border-white/10 rounded-2xl px-4 py-2.5 text-sm text-center font-bold dark:text-white outline-none" />
                    </div>
                    {inputMode === 'marks' ? (
                      <div className="w-28">
                        <p className="text-[8px] font-black uppercase text-slate-400 mb-1 ml-1">Marks (%)</p>
                        <input type="number" min="0" max="100" value={course.marks} onChange={(e) => updateCourse(course.id, 'marks', parseInt(e.target.value) || 0)} className="w-full bg-white dark:bg-white/5 border dark:border-white/10 rounded-2xl px-4 py-2.5 text-sm text-center font-black dark:text-white outline-none" />
                      </div>
                    ) : (
                      <div className="w-28">
                        <p className="text-[8px] font-black uppercase text-slate-400 mb-1 ml-1">Grade</p>
                        <select value={course.grade} onChange={(e) => updateCourse(course.id, 'grade', e.target.value)} className="w-full bg-white dark:bg-white/5 border dark:border-white/10 rounded-2xl px-4 py-2.5 text-sm text-center font-black dark:text-white outline-none appearance-none">
                          {Object.keys(GRADE_POINTS).map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                    )}
                    <button onClick={() => removeCourse(course.id)} className="p-3 text-red-500/40 hover:text-red-500 transition-colors md:mt-4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {currentSemester > 1 && (
            <div className="glass-panel p-6 rounded-[32px] space-y-4 shadow-sm border border-orange-500/20 bg-orange-500/[0.03] animate-fade-in">
              <h3 className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-[0.2em] flex items-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 mr-2"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/></svg>
                Previous Academic Record
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[8px] font-black uppercase text-slate-400 mb-2 ml-1">CGPA till Sem {currentSemester - 1}</p>
                  <input type="number" step="0.01" value={prevCGPA || ''} onChange={(e) => setPrevCGPA(parseFloat(e.target.value) || 0)} className="w-full bg-white dark:bg-black/40 border dark:border-white/5 rounded-2xl px-5 py-3 text-sm font-bold dark:text-white outline-none" placeholder="e.g. 8.45" />
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-slate-400 mb-2 ml-1">Total Credits till Sem {currentSemester - 1}</p>
                  <input type="number" value={prevTotalCredits || ''} onChange={(e) => setPrevTotalCredits(parseInt(e.target.value) || 0)} className="w-full bg-white dark:bg-black/40 border dark:border-white/5 rounded-2xl px-5 py-3 text-sm font-bold dark:text-white outline-none" placeholder="e.g. 48" />
                </div>
              </div>
            </div>
          )}

          <div className="glass-panel p-8 rounded-[40px] space-y-8 shadow-xl border border-blue-500/20 bg-blue-500/[0.03] relative overflow-hidden group">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] flex items-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 mr-2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Target Roadmap
                </h3>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Interactive Milestone Adjuster</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-black uppercase text-slate-400 mb-1">Set Target CGPA</p>
                <input type="number" step="0.1" value={targetCGPA || ''} onChange={(e) => { setTargetCGPA(parseFloat(e.target.value) || 0); setManualAdjustments({}); }} className="w-24 bg-white dark:bg-black/60 border dark:border-white/10 rounded-xl px-3 py-2 text-sm text-center font-black text-blue-600 outline-none focus:ring-2 focus:ring-blue-500/50" placeholder="e.g. 9.0" />
              </div>
            </header>

            {targetCGPA > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                {roadmap.map((item) => (
                  <div key={item.sem} className={`p-4 rounded-3xl border transition-all ${item.isManual ? 'bg-blue-600 text-white border-blue-700 shadow-lg' : 'bg-white dark:bg-black/40 border-slate-100 dark:border-white/5'}`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Sem {item.sem}</span>
                      {item.isManual && <span className="text-[7px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">Pinned</span>}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-black tracking-tighter">{item.sgpa > 10 ? '10+' : item.sgpa.toFixed(2)}</p>
                      <div className="flex flex-col gap-1">
                        <button onClick={() => adjustSem(item.sem, 0.1)} className={`p-1 rounded-lg transition-colors ${item.isManual ? 'hover:bg-white/20 text-white' : 'hover:bg-blue-500/10 text-blue-500'}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3"><polyline points="18 15 12 9 6 15"/></svg></button>
                        <button onClick={() => adjustSem(item.sem, -0.1)} className={`p-1 rounded-lg transition-colors ${item.isManual ? 'hover:bg-white/20 text-white' : 'hover:bg-blue-500/10 text-blue-500'}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-3 h-3"><polyline points="6 9 12 15 18 9"/></svg></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!targetCGPA && (
              <div className="py-10 text-center opacity-30">
                <p className="text-[10px] font-black uppercase tracking-widest">Enter a target to see roadmap</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* MIN SEMESTER SGPA CARD */}
          <div className="glass-panel p-8 rounded-[40px] text-center shadow-2xl bg-gradient-to-br from-orange-600 to-red-700 text-white border-none relative overflow-hidden group">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-3 text-white">Min Semester SGPA</h3>
            <p className="text-7xl font-black tracking-tighter mb-4 text-white transition-transform group-hover:scale-105 duration-500">{currentStats.sgpa.toFixed(2)}</p>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-white shadow-[0_0_15px_white] transition-all duration-1000 ease-out" 
                style={{ width: `${(currentStats.sgpa / 10) * 100}%` }} 
              />
            </div>
            <p className="text-[10px] font-black opacity-70 uppercase tracking-widest text-white">Target: 8.0+ for placements</p>
          </div>

          {currentSemester > 1 && (
            /* OVERALL CGPA CARD - MATCHING STYLE */
            <div className="glass-panel p-8 rounded-[40px] text-center shadow-2xl bg-gradient-to-br from-orange-600 to-red-700 text-white border-none relative overflow-hidden animate-fade-in group">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-3 text-white">Overall CGPA</h3>
              <p className="text-7xl font-black tracking-tighter mb-4 text-white transition-transform group-hover:scale-105 duration-500">{overallCGPA}</p>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-6">
                <div 
                  className="h-full bg-white shadow-[0_0_15px_white] transition-all duration-1000 ease-out" 
                  style={{ width: `${(parseFloat(overallCGPA) / 10) * 100}%` }} 
                />
              </div>
              <p className="text-[10px] font-black opacity-70 uppercase tracking-widest text-white">Cumulative till Sem {currentSemester}</p>
            </div>
          )}

          <div className="glass-panel p-6 rounded-[32px] bg-white dark:bg-slate-950 border dark:border-white/5">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 text-center">LPU Grade Matrix</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(GRADE_POINTS).map(([g, p]) => (
                <div key={g} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-orange-500/30 transition-all group">
                  <span className="font-black text-slate-800 dark:text-white text-xs group-hover:text-orange-500">{g}</span>
                  <span className="text-slate-400 font-mono text-xs">{p}.0</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-[32px] border-l-4 border-l-orange-600 bg-orange-600/[0.03] flex items-start space-x-5 mt-10">
        <div className="w-12 h-12 rounded-full bg-orange-600/10 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6 text-orange-600"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          <p className="mb-2">
            LPU follows a <span className="text-orange-600 dark:text-orange-500 font-black">Relative Grading System</span>. This tool provides your <span className="font-black">Minimum Expected Performance</span>.
          </p>
          <p className="opacity-70 italic text-[10px]">
            Formula: Cumulative CGPA = Σ(SGPA × Credits) / Total Credits.
          </p>
        </div>
      </div>
      
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-950 rounded-[40px] p-10 w-full max-w-lg shadow-2xl border border-white/10 relative text-center">
            <button onClick={() => setIsShareModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-10 h-10 text-green-500"><polyline points="20 6 9 17 4 12"/></svg></div>
            <h3 className="text-2xl font-black dark:text-white mb-2 uppercase">Link Copied!</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Your report has been encoded.</p>
            <div className="bg-slate-100 dark:bg-black p-4 rounded-2xl border dark:border-white/10 mb-8 truncate text-[10px] font-mono text-slate-400">{shareUrl}</div>
            <button onClick={() => setIsShareModalOpen(false)} className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Got it</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CGPACalculator;
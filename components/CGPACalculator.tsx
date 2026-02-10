
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { UserProfile } from '../types.ts';
import NexusServer from '../services/nexusServer.ts';

const CourseEntry = ({ c, inputMode, updateCourse, removeCourse }: any) => (
  <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-50 dark:bg-dark-900 p-5 rounded-[32px] border border-slate-100 dark:border-white/5 transition-all hover:border-orange-500/20 shadow-sm">
    <div className="flex-1 w-full">
      <input type="text" placeholder="Course Name" value={c.name} onChange={(e) => updateCourse(c.id, 'name', e.target.value)} className="w-full bg-white dark:bg-dark-950 border border-transparent dark:border-white/10 rounded-2xl px-5 py-3 text-sm font-black dark:text-white outline-none focus:ring-2 focus:ring-orange-500/50 transition-all shadow-inner" />
    </div>
    <div className="flex items-center gap-3 w-full md:w-auto">
      <div className="space-y-1">
          <p className="text-[7px] font-black text-slate-400 uppercase text-center">Credits</p>
          <input type="number" min="0" max="20" value={c.credits} onChange={(e) => updateCourse(c.id, 'credits', parseInt(e.target.value) || 0)} className="w-16 bg-white dark:bg-dark-950 border dark:border-white/10 rounded-2xl px-3 py-3 text-xs text-center font-black dark:text-white outline-none shadow-inner" />
      </div>
      <div className="space-y-1">
          <p className="text-[7px] font-black text-slate-400 uppercase text-center">{inputMode === 'marks' ? 'Marks' : 'Grade'}</p>
          {inputMode === 'marks' ? <input type="number" min="0" max="100" value={c.marks} onChange={(e) => updateCourse(c.id, 'marks', parseInt(e.target.value) || 0)} className="w-20 bg-white dark:bg-dark-950 border dark:border-white/10 rounded-2xl px-3 py-3 text-xs text-center font-black dark:text-white outline-none shadow-inner" /> : <select value={c.grade} onChange={(e) => updateCourse(c.id, 'grade', e.target.value)} className="w-20 bg-white dark:bg-dark-950 border dark:border-white/10 rounded-2xl px-3 py-3 text-xs text-center font-black dark:text-white outline-none shadow-inner">{'O,A+,A,B+,B,C,P,F'.split(',').map(g => <option key={g} value={g}>{g}</option>)}</select>}
      </div>
      <button onClick={() => removeCourse(c.id)} className="p-3 text-red-500/20 hover:text-red-500 border-none bg-transparent mt-4"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>
    </div>
  </div>
);

const CGPACalculator: React.FC<{ userProfile: UserProfile | null }> = ({ userProfile }) => {
  const [inputMode, setInputMode] = useState<'marks' | 'grades'>('marks');
  const [currentSemester, setCurrentSemester] = useState<number>(1);
  const [prevCGPA, setPrevCGPA] = useState<number | string>('');
  const [prevTotalCredits, setPrevTotalCredits] = useState<number | string>('');
  const [targetCGPA, setTargetCGPA] = useState<number | string>('');
  const [manualAdjustments, setManualAdjustments] = useState<Record<number, number>>({});
  const [courses, setCourses] = useState<any[]>([]);
  const [isSemDropdownOpen, setIsSemDropdownOpen] = useState(false);
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const semDropdownRef = useRef<HTMLDivElement>(null);
  const modeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (semDropdownRef.current && !semDropdownRef.current.contains(e.target as Node)) setIsSemDropdownOpen(false);
      if (modeDropdownRef.current && !modeDropdownRef.current.contains(e.target as Node)) setIsModeDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addCourse = () => setCourses([...courses, { id: Math.random().toString(36).substr(2, 9), name: '', credits: 2, grade: 'F', marks: 0 }]);
  const removeCourse = (id: string) => setCourses(courses.filter(c => c.id !== id));
  const updateCourse = (id: string, field: string, value: any) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20 px-4 md:px-0">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 tracking-tighter uppercase">Academic Forecaster</h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">Strategic target modeling based on LPU standards.</p>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-4 mb-8">
         <div className="relative" ref={semDropdownRef}>
            <button onClick={() => setIsSemDropdownOpen(!isSemDropdownOpen)} className={`flex items-center justify-between min-w-[180px] px-6 py-4 rounded-2xl border transition-all duration-300 font-black text-[10px] uppercase tracking-widest ${isSemDropdownOpen ? 'bg-white dark:bg-dark-900 border-orange-500 shadow-xl' : 'bg-slate-100 dark:bg-dark-900 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white'}`}>
              <span>Semester {currentSemester}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`w-3 h-3 ml-2 transition-transform ${isSemDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {isSemDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full z-[100] bg-white dark:bg-dark-800 rounded-2xl overflow-hidden shadow-2xl border dark:border-white/10 animate-fade-in">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <button key={sem} onClick={() => { setCurrentSemester(sem); setIsSemDropdownOpen(false); }} className={`w-full text-left px-6 py-3.5 text-[10px] font-black uppercase tracking-widest border-none transition-colors ${currentSemester === sem ? 'bg-orange-600 text-white' : 'hover:bg-orange-500/10 dark:text-white'}`}>Semester {sem}</button>
                ))}
              </div>
            )}
         </div>
         <div className="relative" ref={modeDropdownRef}>
            <button onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)} className={`flex items-center justify-between min-w-[180px] px-6 py-4 rounded-2xl border transition-all duration-300 font-black text-[10px] uppercase tracking-widest ${isModeDropdownOpen ? 'bg-white dark:bg-dark-900 border-orange-500 shadow-xl' : 'bg-slate-100 dark:bg-dark-900 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white'}`}>
              <span>Mode: {inputMode.toUpperCase()}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`w-3 h-3 ml-2 transition-transform ${isModeDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {isModeDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full z-[100] bg-white dark:bg-dark-800 rounded-2xl overflow-hidden shadow-2xl border dark:border-white/10 animate-fade-in">
                <button onClick={() => { setInputMode('marks'); setIsModeDropdownOpen(false); }} className={`w-full text-left px-6 py-3.5 text-[10px] font-black uppercase tracking-widest border-none ${inputMode === 'marks' ? 'bg-orange-600 text-white' : 'hover:bg-orange-500/10 dark:text-white'}`}>By Marks</button>
                <button onClick={() => { setInputMode('grades'); setIsModeDropdownOpen(false); }} className={`w-full text-left px-6 py-3.5 text-[10px] font-black uppercase tracking-widest border-none ${inputMode === 'grades' ? 'bg-orange-600 text-white' : 'hover:bg-orange-500/10 dark:text-white'}`}>By Grades</button>
              </div>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-8 rounded-[40px] border dark:border-white/5 bg-white dark:bg-dark-900/60 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">Course Input Ledger</h3>
              <button onClick={addCourse} className="bg-orange-600 text-white text-[9px] font-black uppercase px-6 py-2.5 rounded-xl shadow-lg shadow-orange-600/20 border-none active:scale-95 transition-all">+ Add Course</button>
            </div>
            {courses.length === 0 ? <div className="py-20 text-center border-4 border-dashed dark:border-white/5 rounded-[40px] opacity-40 uppercase font-black text-[10px] tracking-widest">Protocol Ready • Add Entry</div> : (
              <div className="space-y-4">{courses.map(c => <CourseEntry key={c.id} c={c} inputMode={inputMode} updateCourse={updateCourse} removeCourse={removeCourse} />)}</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-10 rounded-[56px] text-center shadow-2xl bg-dark-900 border dark:border-white/5 relative overflow-hidden group">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-6 relative z-10">Historical Summary</h3>
            <div className="space-y-6 relative z-10 text-left">
              <div>
                <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1.5 ml-1">Archive CGPA</label>
                <input type="number" step="0.01" value={prevCGPA} onChange={e => setPrevCGPA(e.target.value)} placeholder="0.00" className="w-full bg-dark-950 border dark:border-white/10 rounded-2xl px-5 py-3 text-sm font-black dark:text-white outline-none focus:ring-2 focus:ring-orange-600 shadow-inner" />
              </div>
              <div>
                <label className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1.5 ml-1">Archive Credits</label>
                <input type="number" value={prevTotalCredits} onChange={e => setPrevTotalCredits(e.target.value)} placeholder="0" className="w-full bg-dark-950 border dark:border-white/10 rounded-2xl px-5 py-3 text-sm font-black dark:text-white outline-none focus:ring-2 focus:ring-orange-600 shadow-inner" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CGPACalculator;


import React, { useState, useMemo } from 'react';

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
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: '', credits: 0, grade: 'F', marks: 0 },
  ]);

  const addCourse = () => {
    setCourses([...courses, { 
      id: Math.random().toString(36).substr(2, 9), 
      name: '', 
      credits: 0, 
      grade: 'F', 
      marks: 0 
    }]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: any) => {
    setCourses(courses.map(c => {
      if (c.id === id) {
        const updated = { ...c, [field]: value };
        // If we updated marks, automatically update the grade
        if (field === 'marks') {
          updated.grade = getGradeFromMarks(Number(value));
        }
        return updated;
      }
      return c;
    }));
  };

  const sgpa = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach(c => {
      const point = GRADE_POINTS[c.grade] || 0;
      const credits = Number(c.credits) || 0;
      totalPoints += point * credits;
      totalCredits += credits;
    });
    return totalCredits === 0 ? "0.00" : (totalPoints / totalCredits).toFixed(2);
  }, [courses]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
      <header className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 tracking-tighter">CGPA Calculator</h2>
          <p className="text-slate-600 dark:text-slate-400">Estimate your SGPA with precision.</p>
        </div>
        
        <div className="flex bg-slate-200 dark:bg-white/5 p-1 rounded-xl w-fit border border-transparent dark:border-white/5">
          <button 
            onClick={() => setInputMode('marks')}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${inputMode === 'marks' ? 'bg-white dark:bg-white/10 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}
          >
            By Marks
          </button>
          <button 
            onClick={() => setInputMode('grades')}
            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${inputMode === 'grades' ? 'bg-white dark:bg-white/10 shadow text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}
          >
            By Grades
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-6 rounded-3xl space-y-4 shadow-sm border dark:border-white/5 bg-white dark:bg-slate-950/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Your Courses</h3>
              <button 
                onClick={addCourse}
                className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors flex items-center"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3 mr-1"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Course
              </button>
            </div>

            <div className="space-y-3">
              {courses.map((course) => (
                <div key={course.id} className="flex flex-col md:flex-row items-center gap-3 bg-slate-50 dark:bg-black/40 p-4 rounded-2xl border border-slate-100 dark:border-white/5 animate-fade-in relative group">
                  <div className="flex-1 w-full">
                    <p className="text-[8px] font-black uppercase text-slate-400 mb-1 ml-1">Subject</p>
                    <input 
                      type="text" 
                      placeholder="e.g. CSE326"
                      value={course.name}
                      onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                      className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="w-20">
                      <p className="text-[8px] font-black uppercase text-slate-400 mb-1 ml-1">Credits</p>
                      <input 
                        type="number" 
                        min="0" 
                        max="20"
                        value={course.credits}
                        onChange={(e) => updateCourse(course.id, 'credits', parseInt(e.target.value) || 0)}
                        className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-blue-500 text-center"
                      />
                    </div>

                    {inputMode === 'marks' ? (
                      <div className="w-24">
                        <p className="text-[8px] font-black uppercase text-slate-400 mb-1 ml-1">Marks (%)</p>
                        <div className="relative">
                          <input 
                            type="number" 
                            min="0" 
                            max="100"
                            value={course.marks}
                            onChange={(e) => updateCourse(course.id, 'marks', parseInt(e.target.value) || 0)}
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-blue-500 text-center font-bold"
                          />
                          <div className="absolute -top-10 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[8px] font-black px-2 py-1 rounded">
                            GRADE: {course.grade}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="w-24">
                        <p className="text-[8px] font-black uppercase text-slate-400 mb-1 ml-1">Grade</p>
                        <select 
                          value={course.grade}
                          onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                          className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-blue-500 appearance-none text-center font-bold"
                        >
                          {Object.keys(GRADE_POINTS).map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => removeCourse(course.id)}
                      className="p-2.5 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all md:mt-4"
                      title="Remove Course"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-8 rounded-3xl text-center shadow-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">Semester SGPA</h3>
              <p className="text-7xl font-black tracking-tighter mb-4">{sgpa}</p>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-white transition-all duration-1000 ease-out" 
                  style={{ width: `${(parseFloat(sgpa) / 10) * 100}%` }}
                />
              </div>
              <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">
                Target: 8.0+ for placements
              </p>
            </div>
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
          </div>

          <div className="glass-panel p-6 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">LPU Grading Scale</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(GRADE_POINTS).map(([g, p]) => (
                <div key={g} className="flex justify-between p-2.5 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-100 dark:border-white/5 hover:border-blue-500/30 transition-colors">
                  <span className="font-bold text-slate-800 dark:text-white text-xs">{g}</span>
                  <span className="text-slate-500 font-mono text-xs">{p}.0</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advisory Note - Moved to Bottom */}
      <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-indigo-600 bg-indigo-500/5 flex items-start space-x-4 mt-8">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          Note: LPU uses a <span className="text-indigo-600 dark:text-indigo-400 font-bold">Relative Grading System</span>. This calculation reflects your <span className="font-bold">Minimum Expected CGPA</span>; your actual result may be higher depending on the class average and distribution curve.
        </p>
      </div>
    </div>
  );
};

export default CGPACalculator;

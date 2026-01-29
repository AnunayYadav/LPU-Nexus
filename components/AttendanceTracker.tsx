
import React, { useState, useEffect, useCallback } from 'react';

interface Subject {
  id: string;
  name: string;
  present: number;
  total: number;
  goal: number;
  archived?: boolean;
}

interface HistoryItem {
  id: string;
  type: 'present' | 'absent';
  prevPresent: number;
  prevTotal: number;
  timestamp: number;
}

const AttendanceTracker: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('nexus_attendance');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((s: any) => ({ 
        ...s, 
        goal: s.goal || 75,
        archived: s.archived || false
      }));
    }
    return [];
  });

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showArchived, setShowArchived] = useState(false);

  const [newSub, setNewSub] = useState({
    name: '',
    present: '0',
    total: '0',
    goal: '75'
  });

  useEffect(() => {
    localStorage.setItem('nexus_attendance', JSON.stringify(subjects));
  }, [subjects]);

  const addSubject = () => {
    if (!newSub.name.trim()) return;
    
    const present = parseInt(newSub.present) || 0;
    const total = parseInt(newSub.total) || 0;
    const goal = parseInt(newSub.goal) || 75;

    setSubjects([...subjects, { 
      id: Math.random().toString(36).substr(2, 9), 
      name: newSub.name, 
      present: Math.min(present, total), 
      total: total,
      goal: goal,
      archived: false
    }]);

    setNewSub({ name: '', present: '0', total: '0', goal: '75' });
  };

  const deleteSubject = (id: string) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      setSubjects(subjects.filter(s => s.id !== id));
      const newSelected = new Set(selectedIds);
      newSelected.delete(id);
      setSelectedIds(newSelected);
      setHistory(history.filter(h => h.id !== id));
    }
  };

  const clearAll = () => {
    if (window.confirm("CRITICAL: Are you sure you want to delete ALL subjects? This will clear all your attendance records forever and cannot be undone.")) {
      setSubjects([]);
      setHistory([]);
      setSelectedIds(new Set());
    }
  };

  const archiveSubject = (id: string) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, archived: !s.archived } : s));
    const newSelected = new Set(selectedIds);
    newSelected.delete(id);
    setSelectedIds(newSelected);
  };

  const updateAttendance = (id: string, type: 'present' | 'absent') => {
    setSubjects(prevSubjects => {
      const subject = prevSubjects.find(s => s.id === id);
      if (subject) {
        setHistory(prev => [{
          id,
          type,
          prevPresent: subject.present,
          prevTotal: subject.total,
          timestamp: Date.now()
        }, ...prev].slice(0, 50)); 
      }
      
      return prevSubjects.map(s => {
        if (s.id === id) {
          return {
            ...s,
            present: type === 'present' ? s.present + 1 : s.present,
            total: s.total + 1
          };
        }
        return s;
      });
    });
  };

  const undoSubjectLastAction = (id: string) => {
    const actionIndex = history.findIndex(h => h.id === id);
    if (actionIndex === -1) return;

    const action = history[actionIndex];
    
    setSubjects(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          present: action.prevPresent,
          total: action.prevTotal
        };
      }
      return s;
    }));

    setHistory(prev => prev.filter((_, idx) => idx !== actionIndex));
  };

  const bulkUpdate = (type: 'present' | 'absent') => {
    if (selectedIds.size === 0) return;

    const actionVerb = type === 'present' ? 'PRESENT' : 'ABSENT';
    const confirmed = window.confirm(`Update ${selectedIds.size} subjects as ${actionVerb}?`);
    
    if (!confirmed) return;

    const now = Date.now();
    const newHistoryItems: HistoryItem[] = [];
    
    setSubjects(prevSubjects => {
      return prevSubjects.map(s => {
        if (selectedIds.has(s.id)) {
          newHistoryItems.push({
            id: s.id,
            type,
            prevPresent: s.present,
            prevTotal: s.total,
            timestamp: now
          });
          return {
            ...s,
            present: type === 'present' ? s.present + 1 : s.present,
            total: s.total + 1
          };
        }
        return s;
      });
    });

    setHistory(prev => [...newHistoryItems, ...prev].slice(0, 100));
    setSelectedIds(new Set());
  };

  const updateGoal = (id: string, newGoal: number) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, goal: Math.min(Math.max(newGoal, 0), 100) } : s));
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const calculateStats = (s: Subject) => {
    const goal = s.goal || 75;
    // Handle total classes being zero to avoid division by zero
    const percentage = s.total === 0 ? 0 : (s.present / s.total) * 100;
    
    let needed = 0;
    // Avoid division by zero when goal is 100 (1 - 100/100 = 0)
    if (percentage < goal && goal < 100) {
        needed = Math.ceil(( (goal/100) * s.total - s.present) / (1 - (goal/100)));
    } else if (percentage < goal && goal === 100) {
        // Technically infinity classes are needed to reach exactly 100% if even one class is missed,
        // but in practical terms, we just can't reach 100% anymore.
        needed = 999; 
    }
    
    let skippable = 0;
    // Avoid division by zero when goal is 0
    if (percentage >= goal && goal > 0) {
        skippable = Math.floor((100 * s.present - goal * s.total) / goal);
    } else if (percentage >= goal && goal === 0) {
        // If goal is 0%, all remaining classes can be skipped.
        // We can just represent this as a large number or current total classes.
        skippable = 999;
    }

    return { percentage, needed, skippable, goal };
  };

  const filteredSubjects = subjects.filter(s => showArchived ? s.archived : !s.archived);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-32 relative">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 tracking-tighter">Attendance Tracker</h2>
          <p className="text-slate-600 dark:text-slate-400">Track your attendance and hit your personalized goals.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {subjects.length > 0 && (
            <button 
              onClick={clearAll}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-500/20 shadow-sm"
              title="Clear all subjects"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              <span>Clear All</span>
            </button>
          )}

          <button 
            onClick={() => setShowArchived(!showArchived)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ${showArchived ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400'}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            <span>{showArchived ? 'Active List' : 'Archive'}</span>
          </button>
        </div>
      </header>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && !showArchived && (
        <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md z-50 glass-panel p-4 rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center justify-between w-full sm:w-auto sm:border-r sm:border-slate-200 dark:sm:border-white/10 sm:pr-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400">{selectedIds.size} Selected</span>
            <button 
              onClick={() => setSelectedIds(new Set())}
              className="sm:hidden p-1 text-slate-400 hover:text-red-500 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button 
              onClick={() => bulkUpdate('present')}
              className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-green-600/20"
            >
              Mark Present
            </button>
            <button 
              onClick={() => bulkUpdate('absent')}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-red-600/20"
            >
              Mark Absent
            </button>
            <button 
              onClick={() => setSelectedIds(new Set())}
              className="hidden sm:flex p-3 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
              title="Deselect All"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      )}

      <div className="glass-panel p-6 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/5 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <p className="text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Subject Name</p>
            <input 
              type="text" 
              placeholder="e.g. CSE408"
              value={newSub.name}
              onChange={(e) => setNewSub({...newSub, name: e.target.value})}
              className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-3 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
            />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Present / Total</p>
            <div className="flex items-center space-x-2">
              <input 
                type="number" 
                placeholder="P"
                value={newSub.present}
                onChange={(e) => setNewSub({...newSub, present: e.target.value})}
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-3 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm text-center"
              />
              <span className="text-slate-400">/</span>
              <input 
                type="number" 
                placeholder="T"
                value={newSub.total}
                onChange={(e) => setNewSub({...newSub, total: e.target.value})}
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-3 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm text-center"
              />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 mb-1 ml-1">Goal %</p>
            <input 
              type="number" 
              placeholder="Goal %"
              value={newSub.goal}
              onChange={(e) => setNewSub({...newSub, goal: e.target.value})}
              className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/5 rounded-2xl px-4 py-3 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm text-center"
            />
          </div>
          <div className="flex items-end">
            <button 
              onClick={addSubject}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-green-600/20"
            >
              Add Subject
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSubjects.map((sub) => {
          const { percentage, needed, skippable, goal } = calculateStats(sub);
          const isBelowGoal = percentage < goal;
          const isSelected = selectedIds.has(sub.id);
          const colorClass = isBelowGoal ? 'text-red-500' : 'text-green-500';
          const bgClass = isBelowGoal ? 'bg-red-500/10' : 'bg-green-500/10';
          const hasHistory = history.some(h => h.id === sub.id);

          return (
            <div 
              key={sub.id} 
              className={`
                glass-panel p-6 rounded-3xl border transition-all duration-300 group relative
                ${isSelected ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-orange-500/10' : 'border-slate-200 dark:border-white/5 shadow-sm'}
                bg-white dark:bg-slate-950/50 hover:shadow-xl
              `}
            >
              {/* Checkbox for Selection */}
              {!showArchived && (
                <div 
                  className="absolute -top-3 -left-3 z-10"
                  onClick={(e) => { e.stopPropagation(); toggleSelection(sub.id); }}
                >
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${isSelected ? 'bg-orange-600 border-orange-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-transparent'}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-start mb-6">
                <div className="max-w-[70%]">
                  <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight truncate">{sub.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 font-bold">{sub.present} / {sub.total} Classes Attended</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className={`px-4 py-2 rounded-2xl ${bgClass} ${colorClass} text-xl font-black tracking-tighter shadow-sm mb-1`}>
                    {percentage.toFixed(2)}%
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Goal:</span>
                    <input 
                      type="number" 
                      value={sub.goal}
                      onChange={(e) => updateGoal(sub.id, parseInt(e.target.value) || 0)}
                      className="bg-transparent text-[10px] font-black text-slate-500 w-8 outline-none border-b border-dashed border-slate-300 dark:border-slate-700 text-center"
                    />
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">%</span>
                  </div>
                </div>
              </div>

              <div className="h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mb-6 relative">
                 <div 
                   className="absolute top-0 bottom-0 w-0.5 bg-orange-500 z-10 opacity-50"
                   style={{ left: `${goal}%` }}
                   title={`Goal: ${goal}%`}
                 ></div>
                 
                <div 
                  className={`h-full transition-all duration-1000 ${!isBelowGoal ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {!showArchived && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button 
                    onClick={() => updateAttendance(sub.id, 'present')}
                    className="bg-slate-900 dark:bg-white text-white dark:text-black py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform shadow-lg"
                  >
                    Present
                  </button>
                  <button 
                    onClick={() => updateAttendance(sub.id, 'absent')}
                    className="bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
                  >
                    Absent
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest pt-4 border-t border-slate-100 dark:border-white/5">
                {isBelowGoal ? (
                  <span className="text-red-500 animate-pulse">Need {needed >= 999 ? '∞' : needed} more to hit {goal}%</span>
                ) : (
                  <span className="text-green-500">Safe to skip {skippable >= 999 ? '∞' : skippable} more classes</span>
                )}
                
                <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                   {hasHistory && (
                     <button 
                       onClick={() => undoSubjectLastAction(sub.id)}
                       className="text-slate-400 hover:text-orange-500 p-1 bg-slate-100 dark:bg-white/5 rounded-md transition-colors"
                       title="Undo last action for this subject"
                     >
                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3.5 h-3.5"><path d="M3 10h10a5 5 0 0 1 0 10H11"/><polyline points="8 5 3 10 8 15"/></svg>
                     </button>
                   )}
                   <button 
                    onClick={() => archiveSubject(sub.id)}
                    className="text-slate-400 hover:text-indigo-500"
                    title={sub.archived ? "Unarchive" : "Archive"}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/></svg>
                  </button>
                  <button 
                    onClick={() => deleteSubject(sub.id)}
                    className="text-slate-400 hover:text-red-500"
                    title="Delete"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-20 bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-700"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">
            {showArchived ? 'No archived subjects found.' : 'No active subjects tracked yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AttendanceTracker;

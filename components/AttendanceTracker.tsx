
import React, { useState, useEffect } from 'react';

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
  
  // State for Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

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

  const handleEdit = (sub: Subject) => {
    setEditingSubject({ ...sub });
    setIsEditModalOpen(true);
  };

  const saveEdit = () => {
    if (!editingSubject) return;
    setSubjects(subjects.map(s => s.id === editingSubject.id ? editingSubject : s));
    setIsEditModalOpen(false);
    setEditingSubject(null);
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

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const calculateStats = (s: Subject) => {
    const goal = s.goal || 75;
    const percentage = s.total === 0 ? 0 : (s.present / s.total) * 100;
    
    let needed = 0;
    if (percentage < goal && goal < 100) {
        needed = Math.ceil(( (goal/100) * s.total - s.present) / (1 - (goal/100)));
    } else if (percentage < goal && goal === 100) {
        needed = 999; 
    }
    
    let skippable = 0;
    if (percentage >= goal && goal > 0) {
        skippable = Math.floor((100 * s.present - goal * s.total) / goal);
    } else if (percentage >= goal && goal === 0) {
        skippable = 999;
    }

    return { percentage, needed, skippable, goal };
  };

  const filteredSubjects = subjects.filter(s => showArchived ? s.archived : !s.archived);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter uppercase">Attendance Tracker</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Precision tracking for campus compliance.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {subjects.length > 0 && (
            <button 
              onClick={clearAll}
              className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              <span>Wipe All</span>
            </button>
          )}

          <button 
            onClick={() => setShowArchived(!showArchived)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ${showArchived ? 'bg-orange-600 border-orange-700 text-white' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400'}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            <span>{showArchived ? 'Active List' : 'Archive Hub'}</span>
          </button>
        </div>
      </header>

      {/* Input Panel */}
      <div className="glass-panel p-8 rounded-[40px] bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-white/5 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
          <div className="md:col-span-4">
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Subject Name</label>
            <input 
              type="text" 
              placeholder="e.g. CSE408 (Cloud Computing)"
              value={newSub.name}
              onChange={(e) => setNewSub({...newSub, name: e.target.value})}
              className="w-full bg-slate-100 dark:bg-black/40 border border-transparent dark:border-white/5 rounded-2xl px-6 py-4 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-orange-600 transition-all font-bold text-sm shadow-inner"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Present / Total</label>
            <div className="flex items-center space-x-2">
              <input 
                type="number" placeholder="P" value={newSub.present}
                onChange={(e) => setNewSub({...newSub, present: e.target.value})}
                className="w-full bg-slate-100 dark:bg-black/40 border border-transparent dark:border-white/5 rounded-2xl px-4 py-4 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-orange-600 transition-all text-sm text-center font-bold shadow-inner"
              />
              <span className="text-slate-400 font-black">/</span>
              <input 
                type="number" placeholder="T" value={newSub.total}
                onChange={(e) => setNewSub({...newSub, total: e.target.value})}
                className="w-full bg-slate-100 dark:bg-black/40 border border-transparent dark:border-white/5 rounded-2xl px-4 py-4 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-orange-600 transition-all text-sm text-center font-bold shadow-inner"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 ml-1 tracking-widest">Target %</label>
            <input 
              type="number" placeholder="75" value={newSub.goal}
              onChange={(e) => setNewSub({...newSub, goal: e.target.value})}
              className="w-full bg-slate-100 dark:bg-black/40 border border-transparent dark:border-white/5 rounded-2xl px-6 py-4 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-orange-600 transition-all text-sm text-center font-bold shadow-inner"
            />
          </div>
          <div className="md:col-span-3">
            <button 
              onClick={addSubject}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-[1.15rem] rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-orange-600/20 active:scale-95 flex items-center justify-center whitespace-nowrap"
            >
              Add Subject
            </button>
          </div>
        </div>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredSubjects.map((sub) => {
          const { percentage, needed, skippable, goal } = calculateStats(sub);
          const isBelowGoal = percentage < goal;
          const isSelected = selectedIds.has(sub.id);
          const accentColor = isBelowGoal ? 'text-red-500' : 'text-emerald-500';
          const accentBg = isBelowGoal ? 'bg-red-500/10' : 'bg-emerald-500/10';
          const hasHistory = history.some(h => h.id === sub.id);

          return (
            <div 
              key={sub.id} 
              className={`
                glass-panel p-6 md:p-8 rounded-[40px] border transition-all duration-500 group relative overflow-hidden flex flex-col
                ${isSelected ? 'border-orange-500 ring-4 ring-orange-500/10 shadow-2xl' : 'border-slate-200 dark:border-white/5 shadow-sm'}
                bg-white dark:bg-slate-950/40 hover:border-orange-500/50
              `}
            >
              {/* Checkbox for Selection */}
              {!showArchived && (
                <div 
                  className="absolute top-6 left-6 z-10"
                  onClick={(e) => { e.stopPropagation(); toggleSelection(sub.id); }}
                >
                  <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${isSelected ? 'bg-orange-600 border-orange-600 text-white shadow-xl shadow-orange-600/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-transparent hover:border-orange-500'}`}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-5 h-5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                </div>
              )}

              <div className="flex flex-col items-center text-center mt-4 mb-8">
                <div className={`px-8 py-4 rounded-[28px] ${accentBg} ${accentColor} text-5xl md:text-6xl font-black tracking-tighter shadow-sm mb-4 transition-transform group-hover:scale-110 duration-500`}>
                  {percentage.toFixed(1)}<span className="text-2xl opacity-50 ml-1">%</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2 line-clamp-1">{sub.name}</h3>
                <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                   <span>{sub.present} / {sub.total} Sessions</span>
                   <span className="opacity-20">|</span>
                   <span className="text-orange-600">Goal: {sub.goal}%</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mb-8 relative">
                 <div 
                    className="absolute top-0 bottom-0 w-1 bg-orange-600 z-10 shadow-[0_0_10px_rgba(249,115,22,0.8)]" 
                    style={{ left: `${goal}%` }} 
                    title={`Goal Line: ${goal}%`}
                 />
                 <div 
                   className={`h-full transition-all duration-1000 ease-out ${!isBelowGoal ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'}`}
                   style={{ width: `${percentage}%` }}
                 />
              </div>

              {!showArchived && (
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button 
                    onClick={() => updateAttendance(sub.id, 'present')}
                    className="bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-[22px] font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-md"
                  >
                    Mark Present
                  </button>
                  <button 
                    onClick={() => updateAttendance(sub.id, 'absent')}
                    className="bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 py-4 rounded-[22px] font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Mark Absent
                  </button>
                </div>
              )}

              {/* Footer Actions */}
              <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
                <div className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${isBelowGoal ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                  {isBelowGoal ? (
                    <span>Needs {needed >= 999 ? '∞' : needed} lectures</span>
                  ) : (
                    <span>Safe for {skippable >= 999 ? '∞' : skippable} lectures</span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   {hasHistory && (
                     <button 
                       onClick={() => undoSubjectLastAction(sub.id)}
                       className="p-2 text-slate-400 hover:text-orange-500 transition-colors"
                       title="Undo last action"
                     >
                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M3 10h10a5 5 0 0 1 0 10H11"/><polyline points="8 5 3 10 8 15"/></svg>
                     </button>
                   )}
                   <button 
                    onClick={() => handleEdit(sub)}
                    className="p-2 text-slate-400 hover:text-orange-500 transition-colors"
                    title="Edit Subject"
                   >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                   </button>
                   <button 
                    onClick={() => archiveSubject(sub.id)}
                    className="p-2 text-slate-400 hover:text-indigo-500 transition-colors"
                    title={showArchived ? "Activate" : "Archive"}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/></svg>
                  </button>
                  <button 
                    onClick={() => deleteSubject(sub.id)}
                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-24 bg-slate-50 dark:bg-white/5 rounded-[48px] border-4 border-dashed border-slate-200 dark:border-white/5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-20 h-20 mx-auto mb-6 text-slate-200 dark:text-slate-800"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          <p className="font-black text-slate-400 uppercase tracking-[0.3em] text-xs">
            {showArchived ? 'Archive hub empty' : 'Registry initialized... waiting for courses'}
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingSubject && (
        <div className="fixed top-[73px] left-0 md:left-64 bottom-0 right-0 z-[110] flex items-center justify-center p-4 bg-slate-400/40 dark:bg-black/80 backdrop-blur-md animate-fade-in overflow-hidden">
          <div className="bg-white dark:bg-slate-950 rounded-[40px] w-full max-w-md shadow-2xl border border-slate-200 dark:border-white/10 relative overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-orange-600 to-red-700 p-8 text-white relative rounded-t-[40px] flex-shrink-0">
              <button onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
              <h3 className="text-xl font-black tracking-tighter uppercase leading-none mb-1">Modify Tracker</h3>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Adjust tracking parameters</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Subject Name</label>
                <input 
                  type="text" 
                  value={editingSubject.name} 
                  onChange={(e) => setEditingSubject({...editingSubject, name: e.target.value})} 
                  className="w-full bg-slate-100 dark:bg-black/40 p-4 rounded-2xl text-sm font-bold outline-none border border-transparent focus:ring-2 focus:ring-orange-500 shadow-inner dark:text-white" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Present Sessions</label>
                  <input 
                    type="number" 
                    value={editingSubject.present} 
                    onChange={(e) => setEditingSubject({...editingSubject, present: parseInt(e.target.value) || 0})} 
                    className="w-full bg-slate-100 dark:bg-black/40 p-4 rounded-2xl text-sm font-bold outline-none border border-transparent focus:ring-2 focus:ring-orange-500 shadow-inner dark:text-white text-center" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Total Sessions</label>
                  <input 
                    type="number" 
                    value={editingSubject.total} 
                    onChange={(e) => setEditingSubject({...editingSubject, total: parseInt(e.target.value) || 0})} 
                    className="w-full bg-slate-100 dark:bg-black/40 p-4 rounded-2xl text-sm font-bold outline-none border border-transparent focus:ring-2 focus:ring-orange-500 shadow-inner dark:text-white text-center" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Target Percentage (%)</label>
                <input 
                  type="number" 
                  value={editingSubject.goal} 
                  onChange={(e) => setEditingSubject({...editingSubject, goal: parseInt(e.target.value) || 0})} 
                  className="w-full bg-slate-100 dark:bg-black/40 p-4 rounded-2xl text-sm font-bold outline-none border border-transparent focus:ring-2 focus:ring-orange-500 shadow-inner dark:text-white text-center" 
                />
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveEdit} 
                  className="flex-[2] bg-orange-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                >
                  Update Registry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bulk Actions Bar */}
      {selectedIds.size > 0 && !showArchived && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] w-[90%] md:w-auto min-w-[320px] glass-panel p-2.5 rounded-[32px] border border-white/20 dark:border-white/10 bg-slate-900 dark:bg-white shadow-2xl flex items-center gap-2 animate-fade-in ring-8 ring-black/5 dark:ring-white/5">
          <div className="flex-1 flex items-center px-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-white dark:text-black">{selectedIds.size} Selected</span>
          </div>
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => bulkUpdate('present')}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
            >
              Batch Present
            </button>
            <button 
              onClick={() => bulkUpdate('absent')}
              className="px-6 py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
            >
              Batch Absent
            </button>
            <button 
              onClick={() => setSelectedIds(new Set())}
              className="p-3.5 text-slate-400 hover:text-red-500 transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTracker;

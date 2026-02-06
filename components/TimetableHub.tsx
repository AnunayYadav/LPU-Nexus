
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { UserProfile, TimetableData, DaySchedule, TimetableSlot } from '../types.ts';
import NexusServer from '../services/nexusServer.ts';
import { extractTimetableFromImage } from '../services/geminiService.ts';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Helper to convert HH:mm (24h or 12h) to minutes for comparison
const timeToMinutes = (time: string) => {
  if (!time) return 0;
  let [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const K25MX_SCHEDULE: DaySchedule[] = [
  {
    day: 'Monday',
    slots: [
      { id: 'm1', subject: 'MTH166', room: '27-407A', startTime: '09:00', endTime: '10:00', type: 'class' },
      { id: 'm2', subject: 'INT306', room: '27-407A', startTime: '10:00', endTime: '11:00', type: 'class' },
      { id: 'm3', subject: 'INT306', room: '27-407A', startTime: '11:00', endTime: '12:00', type: 'class' },
      { id: 'm4', subject: 'PEL130', room: '28-406', startTime: '13:00', endTime: '14:00', type: 'lab' },
      { id: 'm5', subject: 'CSE101', room: '27-101', startTime: '15:00', endTime: '16:00', type: 'lab' },
      { id: 'm6', subject: 'CSE101', room: '27-101', startTime: '16:00', endTime: '17:00', type: 'lab' },
    ]
  },
  {
    day: 'Tuesday',
    slots: [
      { id: 't1', subject: 'INT306', room: '37-906', startTime: '09:00', endTime: '10:00', type: 'lab' },
      { id: 't2', subject: 'INT306', room: '37-906', startTime: '10:00', endTime: '11:00', type: 'lab' },
      { id: 't3', subject: 'ECE279', room: '36-101', startTime: '11:00', endTime: '12:00', type: 'lab' },
      { id: 't4', subject: 'ECE279', room: '36-101', startTime: '12:00', endTime: '13:00', type: 'lab' },
      { id: 't5', subject: 'PEL130', room: '28-507A', startTime: '13:00', endTime: '14:00', type: 'class' },
      { id: 't6', subject: 'ECE249', room: '27-101', startTime: '15:00', endTime: '16:00', type: 'class' },
      { id: 't7', subject: 'CSE320', room: '27-101', startTime: '16:00', endTime: '17:00', type: 'class' },
    ]
  },
  {
    day: 'Wednesday',
    slots: [
      { id: 'w1', subject: 'PEL130', room: '37-708', startTime: '09:00', endTime: '10:00', type: 'lab' },
      { id: 'w2', subject: 'PEL130', room: '37-708', startTime: '10:00', endTime: '11:00', type: 'lab' },
      { id: 'w3', subject: 'CHE110', room: '37-609', startTime: '11:00', endTime: '12:00', type: 'class' },
      { id: 'w4', subject: 'MTH166', room: '28-308', startTime: '13:00', endTime: '14:00', type: 'class' },
      { id: 'w5', subject: 'CSE320', room: '27-101A', startTime: '14:00', endTime: '15:00', type: 'class' },
      { id: 'w6', subject: 'CSE121', room: '26-505', startTime: '16:00', endTime: '17:00', type: 'class' },
    ]
  },
  {
    day: 'Thursday',
    slots: [
      { id: 'th1', subject: 'INT306', room: '37-609', startTime: '09:00', endTime: '10:00', type: 'class' },
      { id: 'th2', subject: 'MTH166', room: '37-609', startTime: '10:00', endTime: '11:00', type: 'class' },
      { id: 'th3', subject: 'CSE101', room: '37-609', startTime: '11:00', endTime: '12:00', type: 'class' },
      { id: 'th4', subject: 'CSE101', room: '37-609', startTime: '12:00', endTime: '13:00', type: 'class' },
      { id: 'th5', subject: 'ECE249', room: '37-703', startTime: '14:00', endTime: '15:00', type: 'class' },
      { id: 'th6', subject: 'CSE320', room: '37-703', startTime: '15:00', endTime: '16:00', type: 'class' },
      { id: 'th7', subject: 'CSE121', room: '37-703', startTime: '16:00', endTime: '17:00', type: 'class' },
    ]
  },
  {
    day: 'Friday',
    slots: [
      { id: 'f1', subject: 'CSE101', room: '27-309', startTime: '11:00', endTime: '12:00', type: 'class' },
      { id: 'f2', subject: 'ECE249', room: '27-407A', startTime: '14:00', endTime: '15:00', type: 'class' },
      { id: 'f3', subject: 'CHE110', room: '27-407A', startTime: '15:00', endTime: '16:00', type: 'class' },
      { id: 'f4', subject: 'MTH166', room: '27-106', startTime: '16:00', endTime: '17:00', type: 'class' },
    ]
  }
];

const SECTION_325QB_SCHEDULE: DaySchedule[] = [
  {
    day: 'Monday',
    slots: [
      { id: 'qb-m1', subject: 'CSE320', room: '37-907', startTime: '09:00', endTime: '10:00', type: 'class' },
      { id: 'qb-m2', subject: 'CSE101', room: '37-907', startTime: '10:00', endTime: '11:00', type: 'class' },
      { id: 'qb-m3', subject: 'CSE101', room: '37-907', startTime: '11:00', endTime: '12:00', type: 'class' },
      { id: 'qb-m4', subject: 'PEL125', room: '29-305', startTime: '13:00', endTime: '14:00', type: 'lab' },
      { id: 'qb-m5', subject: 'ECE249', room: '37-708', startTime: '14:00', endTime: '15:00', type: 'class' },
      { id: 'qb-m6', subject: 'INT306', room: '37-707', startTime: '15:00', endTime: '16:00', type: 'lab' },
      { id: 'qb-m7', subject: 'INT306', room: '37-707', startTime: '16:00', endTime: '17:00', type: 'lab' },
    ]
  },
  {
    day: 'Tuesday',
    slots: [
      { id: 'qb-t1', subject: 'INT306', room: '37-902', startTime: '09:00', endTime: '10:00', type: 'class' },
      { id: 'qb-t2', subject: 'INT306', room: '37-902', startTime: '10:00', endTime: '11:00', type: 'class' },
      { id: 'qb-t3', subject: 'CSE320', room: '37-902', startTime: '11:00', endTime: '12:00', type: 'class' },
      { id: 'qb-t4', subject: 'PEL125', room: '34-508', startTime: '13:00', endTime: '14:00', type: 'class' },
      { id: 'qb-t5', subject: 'CHE110', room: '27-402', startTime: '14:00', endTime: '15:00', type: 'class' },
      { id: 'qb-t6', subject: 'CSE121', room: '37-702', startTime: '15:00', endTime: '16:00', type: 'class' },
      { id: 'qb-t7', subject: 'ECE249', room: '37-702', startTime: '16:00', endTime: '17:00', type: 'class' },
    ]
  },
  {
    day: 'Wednesday',
    slots: [
      { id: 'qb-w1', subject: 'PEL125', room: '34-506', startTime: '09:00', endTime: '10:00', type: 'lab' },
      { id: 'qb-w2', subject: 'PEL125', room: '34-506', startTime: '10:00', endTime: '11:00', type: 'lab' },
      { id: 'qb-w3', subject: 'CSE101', room: '37-607', startTime: '11:00', endTime: '12:00', type: 'class' },
      { id: 'qb-w4', subject: 'MTH166', room: '37-607', startTime: '12:00', endTime: '13:00', type: 'class' },
      { id: 'qb-w5', subject: 'CHE110', room: '27-101', startTime: '14:00', endTime: '15:00', type: 'class' },
      { id: 'qb-w6', subject: 'INT306', room: '27-101', startTime: '15:00', endTime: '16:00', type: 'class' },
      { id: 'qb-w7', subject: 'ECE249', room: '27-101', startTime: '16:00', endTime: '17:00', type: 'class' },
    ]
  },
  {
    day: 'Thursday',
    slots: [
      { id: 'qb-th1', subject: 'MTH166', room: '37-907', startTime: '09:00', endTime: '10:00', type: 'class' },
      { id: 'qb-th2', subject: 'CSE101', room: '37-907', startTime: '10:00', endTime: '11:00', type: 'lab' },
      { id: 'qb-th3', subject: 'CSE101', room: '37-907', startTime: '11:00', endTime: '12:00', type: 'lab' },
      { id: 'qb-th4', subject: 'MTH166', room: '37-908', startTime: '15:00', endTime: '16:00', type: 'class' },
    ]
  },
  {
    day: 'Friday',
    slots: [
      { id: 'qb-f1', subject: 'MTH166', room: '37-808', startTime: '11:00', endTime: '12:00', type: 'class' },
      { id: 'qb-f2', subject: 'ECE279', room: '36-104', startTime: '13:00', endTime: '14:00', type: 'lab' },
      { id: 'qb-f3', subject: 'ECE279', room: '36-104', startTime: '14:00', endTime: '15:00', type: 'lab' },
      { id: 'qb-f4', subject: 'CSE121', room: '37-907', startTime: '15:00', endTime: '16:00', type: 'class' },
      { id: 'qb-f5', subject: 'CSE320', room: '37-907', startTime: '16:00', endTime: '17:00', type: 'class' },
    ]
  }
];

const PRESET_BATCHES = [
  { id: '325qb-2026', name: '325QB - CSE 2nd Sem 2026', schedule: SECTION_325QB_SCHEDULE },
  { id: 'k25mx-2026', name: 'K25MX - CSE 2nd Sem 2026', schedule: K25MX_SCHEDULE },
];

const TimetableHub: React.FC<{ userProfile: UserProfile | null }> = ({ userProfile }) => {
  const [activeDay, setActiveDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }) === 'Sunday' ? 'Monday' : new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  const [myTimetable, setMyTimetable] = useState<TimetableData | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPresetsModal, setShowPresetsModal] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (userProfile) loadMyTimetable();
  }, [userProfile]);

  const loadMyTimetable = async () => {
    if (!userProfile) return;
    const records = await NexusServer.fetchRecords(userProfile.id, 'timetable_main');
    if (records && records.length > 0) {
      setMyTimetable(records[0].content);
    }
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingAI(true);
    const combinedSchedules: DaySchedule[] = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        setProcessingStatus(`Reading Day ${i + 1}/${files.length}...`);
        const base64 = await readFileAsDataURL(files[i]);
        const daySchedule = await extractTimetableFromImage(base64);
        
        // Merge this schedule into our accumulator
        daySchedule.forEach(newDay => {
          const existing = combinedSchedules.find(s => s.day === newDay.day);
          if (existing) {
            // Merge slots if day already exists (unlikely in one file but good for multi-upload)
            existing.slots = [...existing.slots, ...newDay.slots].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
          } else {
            combinedSchedules.push(newDay);
          }
        });
      }

      const data: TimetableData = { 
        ownerId: userProfile?.id || 'anon', 
        ownerName: userProfile?.username || 'Me', 
        schedule: combinedSchedules 
      };

      if (userProfile) {
        await NexusServer.saveRecord(userProfile.id, 'timetable_main', 'My Timetable', data);
      }
      
      setMyTimetable(data);
      setShowUploadModal(false);
    } catch (err) {
      alert("Failed to process images. Ensure you use clear screenshots.");
    } finally {
      setIsProcessingAI(false);
      setProcessingStatus('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const currentMinutes = useMemo(() => {
    return currentTime.getHours() * 60 + currentTime.getMinutes();
  }, [currentTime]);

  const isCurrentDay = useMemo(() => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return today === activeDay;
  }, [activeDay]);

  const daySlotsWithBreaks = useMemo(() => {
    if (!myTimetable) return [];
    const dayData = myTimetable.schedule.find(s => s.day === activeDay);
    if (!dayData || dayData.slots.length === 0) return [];

    const sorted = [...dayData.slots].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
    const result: TimetableSlot[] = [];

    for (let i = 0; i < sorted.length; i++) {
      result.push(sorted[i]);
      if (i < sorted.length - 1) {
        const currentEnd = timeToMinutes(sorted[i].endTime);
        const nextStart = timeToMinutes(sorted[i + 1].startTime);
        if (nextStart > currentEnd) {
          result.push({
            id: `break-${i}`,
            subject: 'Break',
            room: 'N/A',
            startTime: sorted[i].endTime,
            endTime: sorted[i + 1].startTime,
            type: 'break'
          });
        }
      }
    }
    return result;
  }, [myTimetable, activeDay]);

  const applyPreset = async (batch: typeof PRESET_BATCHES[0]) => {
    const data: TimetableData = { ownerId: userProfile?.id || 'anon', ownerName: userProfile?.username || 'Me', schedule: batch.schedule };
    if (userProfile) await NexusServer.saveRecord(userProfile.id, 'timetable_main', batch.name, data);
    setMyTimetable(data);
    setShowPresetsModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20 px-4 md:px-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 tracking-tighter">
            Timetable Hub
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">Daily schedule & synchronized break windows.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowPresetsModal(true)} className="px-6 py-3 bg-black border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all shadow-xl">Presets</button>
          <button onClick={() => setShowUploadModal(true)} className="px-8 py-3 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-600/20 active:scale-95 transition-all flex items-center gap-2 border-none">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Upload
          </button>
        </div>
      </header>

      <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar">
        {DAYS.map(day => (
          <button key={day} onClick={() => setActiveDay(day)} className={`flex-shrink-0 px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest transition-all border-none ${activeDay === day ? 'bg-orange-600 text-white shadow-2xl scale-105' : 'bg-white/5 text-slate-500 hover:text-white'}`}>{day}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          {!myTimetable ? (
            <div className="glass-panel p-16 rounded-[48px] border-4 border-dashed border-white/5 flex flex-col items-center justify-center text-center opacity-40 bg-black">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-20 h-20 mb-6"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <h3 className="text-xl font-black uppercase tracking-tighter">Empty Schedule</h3>
              <p className="text-xs font-bold mt-2">Pick a Preset or Upload from LPU Touch.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600">{activeDay} List</h3>
                <span className="text-[8px] font-bold text-slate-500 uppercase">{daySlotsWithBreaks.filter(s => s.type !== 'break').length} Classes Today</span>
              </div>
              <div className="space-y-3">
                {daySlotsWithBreaks.length === 0 ? (
                  <div className="p-10 bg-black border border-white/5 rounded-[32px] text-center"><p className="text-[10px] font-black uppercase tracking-widest text-slate-500">No events found for {activeDay}.</p></div>
                ) : (
                  daySlotsWithBreaks.map(slot => {
                    const startMin = timeToMinutes(slot.startTime);
                    const endMin = timeToMinutes(slot.endTime);
                    
                    const isActive = isCurrentDay && currentMinutes >= startMin && currentMinutes < endMin;
                    const isFinished = isCurrentDay && currentMinutes >= endMin;
                    const isUpcoming = isCurrentDay && currentMinutes < startMin;
                    const isBreak = slot.type === 'break';
                    
                    let statusLabel = 'Scheduled';
                    if (isCurrentDay) {
                      if (isActive) statusLabel = 'Current';
                      else if (isFinished) statusLabel = 'Finished';
                      else if (isUpcoming) statusLabel = 'Upcoming';
                    }

                    return (
                      <div key={slot.id} className={`group p-6 rounded-[32px] transition-all flex items-center justify-between border ${isActive ? 'bg-orange-600/10 border-orange-500/50 shadow-[0_0_30px_rgba(234,88,12,0.1)] scale-[1.01]' : isFinished ? 'bg-black border-white/5 opacity-40 grayscale' : isBreak ? 'bg-black border-white/5 opacity-70' : 'bg-black border-white/5 hover:border-orange-500/30'}`}>
                        <div className="flex items-center gap-6">
                          <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border shadow-inner ${isActive ? 'bg-orange-600 border-orange-400' : isFinished ? 'bg-slate-900 border-white/5' : 'bg-black border-white/5'}`}>
                            <span className={`text-[10px] font-black ${isActive ? 'text-white' : isFinished ? 'text-slate-600' : 'text-orange-600'}`}>{slot.startTime}</span>
                            <div className={`w-4 h-px my-1 ${isActive ? 'bg-white/30' : 'bg-white/10'}`} />
                            <span className={`text-[8px] font-bold ${isActive ? 'text-white/70' : 'text-slate-500'}`}>{slot.endTime}</span>
                          </div>
                          <div>
                            <h4 className={`text-lg font-black uppercase tracking-tight transition-colors ${isActive ? 'text-orange-500' : isFinished ? 'text-slate-600' : isBreak ? 'text-slate-400' : 'text-white group-hover:text-orange-500'}`}>{slot.subject}</h4>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">{isBreak ? 'Break Window' : `Room ${slot.room} • ${slot.type === 'lab' ? 'Practical' : 'Lecture'}`}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className={`px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-[0.2em] transition-all ${isActive ? 'bg-orange-600 text-white animate-pulse' : isFinished ? 'bg-white/5 text-slate-600' : 'bg-white/5 text-slate-500'}`}>
                            {statusLabel}
                          </div>
                          {isActive && <p className="text-[8px] font-bold text-orange-600 mt-2">Active now</p>}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="glass-panel p-8 rounded-[48px] bg-gradient-to-br from-orange-600 to-red-700 text-white border-none shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-6">Common Breaks</h3>
                <div className="py-4 text-center">
                  <p className="text-xs font-black uppercase opacity-60 tracking-widest">Connect with friends to see common gaps.</p>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 blur-[60px] rounded-full pointer-events-none" />
           </div>

           <div className="glass-panel p-8 rounded-[48px] border border-white/5 bg-black">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Connections</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-black rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center font-black text-[10px]">{userProfile?.username?.[0] || 'M'}</div>
                       <span className="text-[10px] font-black uppercase">My Profile</span>
                    </div>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                 </div>
                 <button className="w-full py-4 border-2 border-dashed border-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:border-orange-500 hover:text-white transition-all bg-transparent">+ Add Friend</button>
              </div>
           </div>
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="bg-[#0a0a0a] rounded-[56px] w-full max-w-md border border-white/10 shadow-[0_32px_128px_rgba(0,0,0,0.8)] overflow-hidden">
            <div className="bg-black p-10 text-center relative">
              <button onClick={() => setShowUploadModal(false)} className="absolute top-8 right-8 text-white/30 hover:text-white transition-colors border-none bg-transparent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
              <div className="w-16 h-16 bg-orange-600/10 rounded-[28px] flex items-center justify-center mx-auto mb-6 border border-orange-600/20">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8 text-orange-600"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </div>
              <h3 className="text-3xl font-black tracking-tighter uppercase">AI Scanner</h3>
              <p className="text-white/40 text-[9px] font-black mt-2 uppercase tracking-[0.3em]">Select screenshots for all 5 days</p>
            </div>
            <div className="p-10 space-y-6">
               {isProcessingAI ? (
                 <div className="py-10 text-center space-y-6">
                    <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 animate-pulse">{processingStatus}</p>
                 </div>
               ) : (
                 <>
                   <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 rounded-[32px] p-12 text-center hover:border-orange-500/50 transition-all cursor-pointer bg-white/[0.02] group">
                     <p className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">Select 5 Images</p>
                     <p className="text-[8px] font-bold uppercase text-slate-600 mt-2">Hold Shift/Ctrl to select multiple</p>
                   </div>
                   <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    multiple 
                    onChange={handleFileUpload} 
                  />
                 </>
               )}
            </div>
          </div>
        </div>
      )}

      {showPresetsModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="bg-[#0a0a0a] rounded-[56px] w-full max-lg border border-white/10 shadow-[0_32px_128px_rgba(0,0,0,0.8)] overflow-hidden">
            <div className="p-10 border-b border-white/5 flex items-center justify-between bg-black">
               <h3 className="text-2xl font-black uppercase tracking-tighter">Course Presets</h3>
               <button onClick={() => setShowPresetsModal(false)} className="text-white/30 hover:text-white transition-colors border-none bg-transparent"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            </div>
            <div className="p-10 grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto no-scrollbar bg-black">
               {PRESET_BATCHES.map(batch => (
                 <button key={batch.id} onClick={() => applyPreset(batch)} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-left hover:border-orange-500/50 hover:bg-white/[0.05] transition-all flex items-center justify-between group">
                   <div>
                     <p className="text-xs font-black uppercase tracking-tight">{batch.name}</p>
                     <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">Full 5-Day Schedule</p>
                   </div>
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5 text-white/20 group-hover:text-orange-600 transition-colors"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                 </button>
               ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableHub;

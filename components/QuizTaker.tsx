
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { UserProfile, Folder, QuizQuestion, LibraryFile } from '../types.ts';
import NexusServer from '../services/nexusServer.ts';
import { generateQuizFromSyllabus } from '../services/geminiService.ts';
import { extractTextFromPdf } from '../services/pdfUtils.ts';

const QuizTaker: React.FC<{ userProfile: UserProfile | null }> = ({ userProfile }) => {
  const [subjects, setSubjects] = useState<Folder[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Folder | null>(null);
  const [selectedUnits, setSelectedUnits] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isShowingExplanation, setIsShowingExplanation] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    const folders = await NexusServer.fetchFolders();
    setSubjects(folders.filter(f => f.type === 'subject'));
  };

  const toggleUnit = (unit: number) => {
    setSelectedUnits(prev => 
      prev.includes(unit) ? prev.filter(u => u !== unit) : [...prev, unit].sort((a, b) => a - b)
    );
  };

  const handleGenerate = async () => {
    if (!selectedSubject || selectedUnits.length === 0) return;
    
    setLoading(true);
    setStatus('Scouting Registry for Syllabus...');
    
    try {
      // 1. Find Syllabus file in Content Library
      const allFiles = await NexusServer.fetchFiles('', selectedSubject.name);
      const syllabusFile = allFiles.find(f => 
        f.name.toLowerCase().includes('syllabus') || 
        f.type.toLowerCase().includes('syllabus')
      );

      if (!syllabusFile) {
        throw new Error(`Registry Alert: No syllabus protocol found for ${selectedSubject.name}. Please upload one to the Content Library first.`);
      }

      setStatus('Extracting Semantic Tokens...');
      const url = await NexusServer.getFileUrl(syllabusFile.storage_path);
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], "syllabus.pdf", { type: "application/pdf" });
      const syllabusText = await extractTextFromPdf(file);

      setStatus('Gemini is synthesizing MCQs...');
      const questions = await generateQuizFromSyllabus(syllabusText, selectedUnits);
      
      setQuizQuestions(questions);
      setCurrentQuestionIdx(0);
      setUserAnswers({});
      setQuizCompleted(false);
    } catch (err: any) {
      alert(err.message || "Gateway Congestion: Failed to generate quiz.");
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  const handleAnswer = (optionIdx: number) => {
    if (isShowingExplanation) return;
    setUserAnswers(prev => ({ ...prev, [currentQuestionIdx]: optionIdx }));
    setIsShowingExplanation(true);
  };

  const nextQuestion = () => {
    setIsShowingExplanation(false);
    if (currentQuestionIdx < quizQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const score = useMemo(() => {
    return Object.entries(userAnswers).reduce((acc, [idx, ans]) => {
      return acc + (ans === quizQuestions[parseInt(idx)].correctAnswer ? 1 : 0);
    }, 0);
  }, [userAnswers, quizQuestions]);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-10 animate-fade-in">
        <div className="relative">
          <div className="w-24 h-24 border-8 border-orange-500/10 rounded-full" />
          <div className="absolute inset-0 w-24 h-24 border-8 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-orange-600 animate-pulse">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-black uppercase tracking-[0.3em] text-slate-800 dark:text-white">Synthesizing Protocol</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">{status}</p>
        </div>
      </div>
    );
  }

  if (quizQuestions.length > 0 && !quizCompleted) {
    const q = quizQuestions[currentQuestionIdx];
    const progress = ((currentQuestionIdx + 1) / quizQuestions.length) * 100;
    const currentAnswer = userAnswers[currentQuestionIdx];

    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-20">
        <header className="flex items-center justify-between">
           <div>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-600 mb-1">Nexus Exam Terminal</p>
              <h2 className="text-2xl font-black tracking-tighter uppercase text-white">Question {currentQuestionIdx + 1} of {quizQuestions.length}</h2>
           </div>
           <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Selected Subject</p>
              <p className="text-sm font-bold text-white uppercase">{selectedSubject?.name}</p>
           </div>
        </header>

        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
           <div className="h-full bg-orange-600 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-[48px] border border-white/5 bg-black/40 shadow-2xl space-y-10">
           <h3 className="text-xl md:text-2xl font-bold leading-relaxed text-white">{q.question}</h3>
           
           <div className="grid grid-cols-1 gap-4">
              {q.options.map((opt, i) => {
                let stateClass = "border-white/5 bg-white/5 hover:border-orange-500/50 hover:bg-orange-600/5";
                if (isShowingExplanation) {
                  if (i === q.correctAnswer) stateClass = "border-emerald-500 bg-emerald-500/10 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]";
                  else if (i === currentAnswer) stateClass = "border-red-500 bg-red-500/10 text-red-500";
                  else stateClass = "border-white/5 bg-white/5 opacity-40";
                }

                return (
                  <button 
                    key={i} 
                    onClick={() => handleAnswer(i)}
                    className={`p-6 rounded-[28px] border text-left transition-all duration-300 flex items-center gap-4 group ${stateClass}`}
                  >
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-[10px] transition-colors ${isShowingExplanation && i === q.correctAnswer ? 'bg-emerald-500 text-white' : 'bg-black text-slate-500 group-hover:text-orange-500'}`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="font-bold text-sm md:text-base">{opt}</span>
                  </button>
                );
              })}
           </div>

           {isShowingExplanation && (
             <div className="p-8 bg-orange-600/5 border border-orange-600/20 rounded-[32px] animate-fade-in space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                   <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-600">Nexus Insight</h4>
                </div>
                <p className="text-sm font-medium text-slate-300 leading-relaxed italic">"{q.explanation}"</p>
                <button 
                  onClick={nextQuestion}
                  className="w-full py-4 mt-4 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all border-none"
                >
                  {currentQuestionIdx === quizQuestions.length - 1 ? 'End Protocol' : 'Next Transmission'}
                </button>
             </div>
           )}
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = (score / quizQuestions.length) * 100;
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-10 animate-fade-in">
         <div className="relative inline-block">
            <div className="w-48 h-48 border-8 border-white/5 rounded-full flex items-center justify-center">
               <div className="text-6xl font-black tracking-tighter text-white">{score}<span className="text-2xl text-slate-500">/{quizQuestions.length}</span></div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-orange-600 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl">
               {percentage >= 70 ? 'Expert Verto' : percentage >= 40 ? 'Developing' : 'Registry Failure'}
            </div>
         </div>
         
         <div className="space-y-3">
            <h2 className="text-4xl font-black tracking-tighter uppercase text-white">Exam Synthesized</h2>
            <p className="text-slate-500 font-medium max-w-xs mx-auto">Protocol complete for <strong>{selectedSubject?.name}</strong>. Your mastery of the syllabus has been logged.</p>
         </div>

         <div className="flex gap-4">
            <button 
              onClick={() => { setQuizQuestions([]); setQuizCompleted(false); }}
              className="flex-1 py-4 bg-black border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-orange-500 transition-all border-none"
            >
              Main Menu
            </button>
            <button 
              onClick={handleGenerate}
              className="flex-[2] py-4 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-600/20 active:scale-95 transition-all border-none"
            >
              Re-Synthesize Quiz
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20 px-4 md:px-0">
      <header className="text-center space-y-4">
        <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Quiz Taker</h2>
        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">AI-Generated Mock Exams from Official Syllabus</p>
      </header>

      <div className="glass-panel p-8 md:p-12 rounded-[56px] border border-slate-100 dark:border-white/5 bg-white dark:bg-black/40 shadow-2xl space-y-10">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-600/10 flex items-center justify-center text-orange-600 font-black text-[10px]">1</div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Select Subject</label>
               </div>
               
               <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                  {subjects.map(s => (
                    <button 
                      key={s.id}
                      onClick={() => setSelectedSubject(s)}
                      className={`p-4 rounded-2xl border text-left transition-all ${selectedSubject?.id === s.id ? 'bg-orange-600 border-orange-500 text-white shadow-lg' : 'bg-black border-white/5 text-slate-500 hover:border-orange-500/30'}`}
                    >
                      <p className="text-xs font-black uppercase tracking-tight">{s.name}</p>
                    </button>
                  ))}
                  {subjects.length === 0 && <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest opacity-40">No subjects in Registry...</p>}
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-600/10 flex items-center justify-center text-orange-600 font-black text-[10px]">2</div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Select Target Units</label>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map(u => (
                    <button 
                      key={u}
                      onClick={() => toggleUnit(u)}
                      className={`p-6 rounded-[32px] border transition-all flex flex-col items-center justify-center group ${selectedUnits.includes(u) ? 'bg-orange-600/10 border-orange-600 shadow-xl scale-105' : 'bg-black border-white/5 hover:border-orange-500/30'}`}
                    >
                       <span className={`text-2xl font-black tracking-tighter ${selectedUnits.includes(u) ? 'text-orange-600' : 'text-slate-700'}`}>0{u}</span>
                       <span className={`text-[8px] font-black uppercase tracking-widest mt-1 ${selectedUnits.includes(u) ? 'text-orange-500' : 'text-slate-500 opacity-40'}`}>Unit Protocol</span>
                    </button>
                  ))}
               </div>
               
               <div className="pt-6 border-t border-white/5">
                  <button 
                    onClick={handleGenerate}
                    disabled={!selectedSubject || selectedUnits.length === 0}
                    className="w-full py-5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-orange-600/30 hover:scale-[1.02] active:scale-95 disabled:opacity-30 transition-all border-none"
                  >
                    Generate Quiz Protocol
                  </button>
               </div>
            </div>
         </div>
      </div>

      <div className="p-8 bg-orange-600/5 border border-orange-600/10 rounded-[40px] flex items-start gap-6">
         <div className="w-12 h-12 rounded-2xl bg-orange-600/20 flex items-center justify-center text-orange-600 flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="12" r="3"/></svg>
         </div>
         <div className="space-y-1">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">Nexus Intelligence Engine</h4>
            <p className="text-sm font-medium text-slate-400 leading-relaxed">The engine will scan the <strong>Content Library</strong> for the syllabus of your selected subject. Ensure you have contributed high-quality PDF syllabi to the registry for optimal generation.</p>
         </div>
      </div>
    </div>
  );
};

export default QuizTaker;

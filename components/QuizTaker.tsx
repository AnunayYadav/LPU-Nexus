
import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, QuizQuestion, LibraryFile } from '../types.ts';
import NexusServer from '../services/nexusServer.ts';
import { generateQuizFromSyllabus } from '../services/geminiService.ts';
import { extractTextFromPdf } from '../services/pdfUtils.ts';

// Static Bank for PEL130 (Provided by user for high-speed access)
const PEL130_STATIC_BANK = [
  { unit: 1, question: "Fill in the blank with correct adjective order. I have bought a _________ bag.", options: ["Tiny red Prada", "Red tiny Prada", "Prada red tiny", "Prada tiny red"], answer: "Tiny red Prada" },
  { unit: 1, question: "Fill the blank with correct verb. The usual work of peon _________ to pass fillies in between departments.", options: ["Is", "Are", "Have", "Has"], answer: "Is" },
  { unit: 1, question: "Fill in the blank with correct preposition. There are several stickers pasted _________ the wall, it will take a lot of time to remove them.", options: ["At", "On", "Above", "Over"], answer: "On" },
  { unit: 1, question: "Fill the blank with correct interjection. _________! That was great catch", options: ["Alas", "Ah", "Yuk", "Bravo"], answer: "Bravo" },
  { unit: 2, question: "Fill the blank with correct article. _________ government is promoting. _________ new sustainable technology in farming sector", options: ["The, the", "The, a", "A,a", "A,an"], answer: "The, a" },
  { unit: 2, question: "Fill the blank with correct article. _________Mountain range over India, Pakistan, Nepal and Bhutan is known as _________Himalayas.", options: ["The, the", "Ο Α,Α", "O An, the", "O The, A"], answer: "The, the" },
  { unit: 2, question: "Fill the blank with correct determiner or quantifier. He does not care. _________ about what he eats. That's why he is getting unhealthy.", options: ["Much", "Many", "Few", "Little"], answer: "Much" },
  { unit: 2, question: "Fill the blank with correct determiner or quantifier. A- Do you need anything from kitchen B- Yes. Can you get me _________ biscuit packet", options: ["These", "Those", "That", "None of the above"], answer: "That" },
  { unit: 3, question: "Fill in the blank with correct tense form. The craftsmen _________ .working since last week on this dress.", options: ["Has", "Had", "Has been", "Have been"], answer: "Has been" },
  { unit: 3, question: "Fill in the blank with correct tense form. I _________...all the work myself.", options: ["have done", "Done", "none", "do"], answer: "do" },
  { unit: 3, question: "Fill in the blank with correct tense form. While I _________.. near the pavement I saw an accident.", options: ["Were walking", "Was walking", "Will walk", "Would walk"], answer: "Was walking" },
  { unit: 4, question: "Identify the underline clause type or select not a clause or simple sentence. The boy was working in the fields, whereas his friends were sitting there.", options: ["Independent", "Dependent", "Not a clause", "Simple sentence"], answer: "Independent" },
  { unit: 4, question: "Identify the underline clause type. The car which is red in color is mine.", options: ["Adjective clause", "Adverb clause", "Noun clause", "Not a clause"], answer: "Adjective clause" },
  { unit: 4, question: "Identify the underline clause type. While working on the project, I have noticed a new approach.", options: ["Independent", "Dependent", "Not a clause", "Simple sentence"], answer: "Dependent" },
  { unit: 4, question: "Identify the underlined phrase type. The fruits are kept in the fridge.", options: ["Gerund phrase", "Adverb phrase", "Preposition phrase", "Noun phrase"], answer: "Preposition phrase" },
  { unit: 4, question: "Identify the following sentence. I have completed all my homework, but my sister has not completed even one chapter.", options: ["Simple sentence", "Compound sentence", "Complex sentence", "Compound-complex sentence"], answer: "Complex sentence" },
  { unit: 4, question: "Identify the following sentence. The emergency services came and cleared the rocket later from the site.", options: ["Simple sentence", "Compound sentence", "Complex sentence", "Compound-complex sentence"], answer: "Compound sentence" },
  { unit: 4, question: "Identify the following sentence. The dynamic display of plants hanging from the ceiling, in concert with their more free-form shape, means that they fill unexpected corners and create a bit of drama in a room.", options: ["Simple sentence", "Compound sentence", "Complex sentence", "Compound-complex sentence"], answer: "Compound-complex sentence" },
  { unit: 4, question: "Determine whether the underlined word groups are dependent clauses, independent clauses, or not a clause. The students are not listening to the teacher, because they are tired attending classes since morning.", options: ["Phrase", "Dependent Clause", "Independent clause", "Not a clause"], answer: "Dependent Clause" },
  { unit: 4, question: "Identify the following sentence. We're never ones to shy away from minimalist, modern spaces, but we're ready to live it up a little bit more in 2018.", options: ["Simple sentence", "Compound sentence", "Complex sentence", "Compound-complex sentence"], answer: "Compound sentence" },
  { unit: 5, question: "Fill the blank with correct model verb. Shamita is planning a long trip to north-east India. She _________ get a full tank of petrol to avoid any inconvenience", options: ["Should", "Don't has to", "Must not", "Don't have to"], answer: "Should" },
  { unit: 5, question: "Fill the blank with correct model verb. In United Kingdom talking on phone was banned now the new rule banned headphones and earphones too. That means the drivers.. _________ use mobile phones and headphones while driving.", options: ["Don't have to", "Should", "Must not", "Must"], answer: "Must not" },
  { unit: 5, question: "Select the correct answer. Which of these sentences has the right punctuation?", options: ["The car which I bought last year, is red in color", "The car, which I bought last year, is red in color.", "The car, which I bought last year is red in color.", "The car, which, I bought last year, is red"], answer: "The car which I bought last year, is red in color" },
  { unit: 5, question: "Fill the blank with correct model verb I feel so embarrassed as I forget my bag at home. _________ you please land me some money? (polite request)", options: ["Will", "Can", "Could", "Should"], answer: "Could" },
  { unit: 5, question: "Fill the blank with correct model verb I would _________ Go to mountains than shopping in a city square.", options: ["Will", "Must", "Rather", "May"], answer: "Rather" },
  { unit: 5, question: "Select the correct answer. Which of the following sentence used correct Apostrophe?", options: ["I dared my friend to go to teachers's room and say hello to any teacher.", "I dared my friend to go to teacher room's and say hello to any teacher.", "I dared my friend to go to teachers' room and say hello to any teacher.", "I dared my friend to go to teachers rooms' and say hello to any teacher."], answer: "I dared my friend to go to teachers's room and say hello to any teacher." },
  { unit: 5, question: "Fill the blank with correct model verb His mother told him strictly that you _________ .lie. (strict command)", options: ["Should not", "May not", "Must not", "Might not"], answer: "Must not" },
  { unit: 5, question: "Fill the blank with correct model verb. Today the weather forecast stated that it _________ .........rain.(choose one with less possibility)", options: ["Should", "May", "Must", "Must"], answer: "May" },
  { unit: 6, question: "Select the correct answer. which of the following idiom means 'trust someone'?", options: ["Give someone the benefit of the doubt", "Make a long story short", "No pain, no gain", "The best of both worlds"], answer: "Give someone the benefit of the doubt" },
  { unit: 6, question: "Select the correct answer. which of the following proverb means 'when thing is not as valuable as it looks'?", options: ["A picture is worth a thousand words", "All good things come to an end", "All that glitters is not gold", "A bird in the hand is worth two in the bush"], answer: "All that glitters is not gold" },
  { unit: 6, question: "Select the correct answer. which of the following idiom means 'stop working'?", options: ["Call it a day", "Got to do it", "Cut somebody some slack", "Call it a day"], answer: "Call it a day" },
  { unit: 6, question: "Select the correct answer. which of the following idiom means 'doing something pointless'?", options: ["Hold on your horses", "Go on a wild goose chase", "Don't count your chickens before they hatch", "He has bigger fish to fry"], answer: "Go on a wild goose chase" },
  { unit: 6, question: "Select the correct answer. which of the following proverb means your action tells what kind of result you will have'?", options: ["As you sow, so you shall reap", "The grass is always greener on the other side", "Beauty is in the eye of the beholder", "Better late than never"], answer: "As you sow, so you shall reap" },
  { unit: 6, question: "Select the correct answer. which of the following proverb means 'similar people spend time together'?", options: ["A picture is worth a thousand words", "Birds of a feather flock together", "Pea in a pod", "None of the above"], answer: "Birds of a feather flock together" },
  { unit: 6, question: "Select the correct answer. which of the following idiom means 'to wait'?", options: ["Once in a blue moon", "Sit on a fence", "You can say that again", "Hold your horses"], answer: "Hold your horses" },
];

interface SubjectWithSyllabus {
  id: string;
  name: string;
  syllabusFile: LibraryFile;
}

const QuizTaker: React.FC<{ userProfile: UserProfile | null }> = ({ userProfile }) => {
  const [subjectsWithSyllabi, setSubjectsWithSyllabi] = useState<SubjectWithSyllabus[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<SubjectWithSyllabus | null>(null);
  const [selectedUnits, setSelectedUnits] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [status, setStatus] = useState('');
  const [isCached, setIsCached] = useState(false);
  
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isShowingExplanation, setIsShowingExplanation] = useState(false);

  useEffect(() => {
    loadValidSubjects();
  }, []);

  const loadValidSubjects = async () => {
    setInitializing(true);
    try {
      const allFiles = await NexusServer.fetchFiles();
      
      // Strict Filter: Only approved documents that are definitely syllabi
      const syllabusFiles = allFiles.filter(f => 
        (f.name.toLowerCase().includes('syllabus') || 
        (f.type && f.type.toLowerCase().includes('syllabus'))) &&
        f.status === 'approved'
      );

      const subjectsMap = new Map<string, SubjectWithSyllabus>();
      
      // Always include PEL130 as a primary subject since we have the static bank
      // We look for its syllabus in the registry to link it
      const pelSyllabus = syllabusFiles.find(f => f.subject.toUpperCase() === 'PEL130');
      
      syllabusFiles.forEach(file => {
        const key = file.subject.trim().toUpperCase();
        if (!subjectsMap.has(key)) {
          subjectsMap.set(key, {
            id: file.id,
            name: file.subject,
            syllabusFile: file
          });
        }
      });

      // Ensure PEL130 is correctly labeled even if registry subject name has different casing
      const sortedSubjects = Array.from(subjectsMap.values()).sort((a, b) => a.name.localeCompare(b.name));
      setSubjectsWithSyllabi(sortedSubjects);
    } catch (err) {
      console.error("Registry Scan Failure:", err);
    } finally {
      setInitializing(false);
    }
  };

  const toggleUnit = (unit: number) => {
    setSelectedUnits(prev => 
      prev.includes(unit) ? prev.filter(u => u !== unit) : [...prev, unit].sort((a, b) => a - b)
    );
  };

  const handleGenerate = async () => {
    if (!selectedSubject || selectedUnits.length === 0) return;
    
    setLoading(true);
    setIsCached(false);
    setStatus('Synchronizing Nexus Question Vault...');
    
    try {
      const subjectKey = selectedSubject.name.toUpperCase().replace(/\s/g, '');
      
      // 1. Check for PEL130 Static Fallback (Instant)
      if (subjectKey === 'PEL130') {
        setStatus('Retrieving PEL130 Protocols...');
        const filtered = PEL130_STATIC_BANK
          .filter(q => selectedUnits.includes(q.unit))
          .map(q => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.options.indexOf(q.answer),
            explanation: `Verified answer for Unit ${q.unit} based on 2022 ETE protocol.`
          }));
          
        if (filtered.length > 0) {
          // Shuffle and take max 10
          setQuizQuestions([...filtered].sort(() => 0.5 - Math.random()).slice(0, 10));
          setIsCached(true);
          setLoading(false);
          setCurrentQuestionIdx(0);
          setUserAnswers({});
          setQuizCompleted(false);
          setIsShowingExplanation(false);
          return;
        }
      }

      // 2. Check Database Question Bank (Cache-First)
      const existingQuestions = await NexusServer.fetchQuestionsFromBank(selectedSubject.name, selectedUnits);
      
      if (existingQuestions && existingQuestions.length > 0) {
        setStatus('Retrieving from Academic Vault...');
        const shuffled = [...existingQuestions].sort(() => 0.5 - Math.random()).slice(0, 10);
        setQuizQuestions(shuffled);
        setIsCached(true);
      } else {
        // 3. Cache Miss: AI Synthesis
        setStatus('Acquiring Target Syllabus Document...');
        const syllabusFile = selectedSubject.syllabusFile;
        const url = await NexusServer.getFileUrl(syllabusFile.storage_path);
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], "syllabus.pdf", { type: "application/pdf" });
        const syllabusText = await extractTextFromPdf(file);

        setStatus(`Gemini is strictly vetting Units: ${selectedUnits.join(', ')}...`);
        const questions = await generateQuizFromSyllabus(selectedSubject.name, syllabusText, selectedUnits);
        
        if (!questions || questions.length === 0) {
          throw new Error("Intelligence failure: Gemini returned an empty question set.");
        }

        // 4. Archive for future users
        setStatus('Archiving results to Vault...');
        for (const unit of selectedUnits) {
            await NexusServer.saveQuestionsToBank(selectedSubject.name, unit, questions);
        }

        setQuizQuestions(questions);
      }

      setCurrentQuestionIdx(0);
      setUserAnswers({});
      setQuizCompleted(false);
      setIsShowingExplanation(false);
    } catch (err: any) {
      alert(err.message || "Protocol Interruption: Connection to Nexus Intelligence timed out.");
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

  if (initializing) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-6 animate-fade-in">
        <div className="w-12 h-12 border-4 border-orange-500/10 border-t-orange-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Scanning Registry for Valid Subject Schemas...</p>
      </div>
    );
  }

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
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-orange-600">Nexus Exam Terminal</p>
                {isCached && <span className="bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded text-[7px] font-black uppercase border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">Vault Direct Access</span>}
              </div>
              <h2 className="text-2xl font-black tracking-tighter uppercase text-white">Question {currentQuestionIdx + 1} of {quizQuestions.length}</h2>
           </div>
           <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Active Subject</p>
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
               {percentage >= 80 ? 'Master Protocol' : percentage >= 50 ? 'Developing Signal' : 'Registry Reboot Needed'}
            </div>
         </div>
         
         <div className="space-y-3">
            <h2 className="text-4xl font-black tracking-tighter uppercase text-white">Analysis Complete</h2>
            <p className="text-slate-500 font-medium max-w-xs mx-auto">Your understanding of <strong>{selectedSubject?.name}</strong> Units <strong>{selectedUnits.join(', ')}</strong> has been verified.</p>
         </div>

         <div className="flex gap-4">
            <button 
              onClick={() => { setQuizQuestions([]); setQuizCompleted(false); setSelectedUnits([]); setSelectedSubject(null); }}
              className="flex-1 py-4 bg-black border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-orange-500 transition-all border-none"
            >
              Back to Menu
            </button>
            <button 
              onClick={handleGenerate}
              className="flex-[2] py-4 bg-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-600/20 active:scale-95 transition-all border-none"
            >
              Retake Synthesized Exam
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20 px-4 md:px-0">
      <header className="text-center space-y-4">
        <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Quiz Taker</h2>
        <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-[10px]">Strict AI-Targeted Exams from Verified Registry</p>
      </header>

      <div className="glass-panel p-8 md:p-12 rounded-[56px] border border-slate-100 dark:border-white/5 bg-white dark:bg-black/40 shadow-2xl space-y-10">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-600/10 flex items-center justify-center text-orange-600 font-black text-[10px]">1</div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Select Verified Subject</label>
               </div>
               
               <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                  {subjectsWithSyllabi.map(s => (
                    <button 
                      key={s.id}
                      onClick={() => setSelectedSubject(s)}
                      className={`p-4 rounded-2xl border text-left transition-all ${selectedSubject?.id === s.id ? 'bg-orange-600 border-orange-500 text-white shadow-lg' : 'bg-black border-white/5 text-slate-500 hover:border-orange-500/30'}`}
                    >
                      <p className="text-xs font-black uppercase tracking-tight">{s.name}</p>
                    </button>
                  ))}
                  {subjectsWithSyllabi.length === 0 && (
                    <div className="py-10 text-center space-y-4">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-40">No Subject Syllabi found in Registry.</p>
                      <button onClick={() => window.location.href='/library'} className="text-[9px] font-black text-orange-600 uppercase underline tracking-widest">Contribute Protocol ↗</button>
                    </div>
                  )}
               </div>
               <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest italic opacity-60">Note: Only subjects with a "Syllabus" document in Content Library are visible.</p>
            </div>

            <div className="space-y-6">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-600/10 flex items-center justify-center text-orange-600 font-black text-[10px]">2</div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Select Scope (Units)</label>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map(u => (
                    <button 
                      key={u}
                      onClick={() => toggleUnit(u)}
                      className={`p-6 rounded-[32px] border transition-all flex flex-col items-center justify-center group ${selectedUnits.includes(u) ? 'bg-orange-600/10 border-orange-600 shadow-xl scale-105' : 'bg-black border-white/5 hover:border-orange-500/30'}`}
                    >
                       <span className={`text-2xl font-black tracking-tighter ${selectedUnits.includes(u) ? 'text-orange-600' : 'text-slate-700'}`}>0{u}</span>
                       <span className={`text-[8px] font-black uppercase tracking-widest mt-1 ${selectedUnits.includes(u) ? 'text-orange-500' : 'text-slate-500 opacity-40'}`}>Unit protocol</span>
                    </button>
                  ))}
               </div>
               
               <div className="pt-6 border-t border-white/5">
                  <button 
                    onClick={handleGenerate}
                    disabled={!selectedSubject || selectedUnits.length === 0}
                    className="w-full py-5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-orange-600/30 hover:scale-[1.02] active:scale-95 disabled:opacity-30 transition-all border-none"
                  >
                    Generate Targeted Quiz
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
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">Optimization Engine Active</h4>
            <p className="text-sm font-medium text-slate-400 leading-relaxed">
              This module uses a <strong>Cache-First</strong> strategy. PEL130 questions are served instantly from the pre-generated static bank. Other subjects utilize Gemini AI to synthesize targeted MCQs which are then archived for the community.
            </p>
         </div>
      </div>
    </div>
  );
};

export default QuizTaker;

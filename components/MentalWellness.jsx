
import {
  Bot,
  CheckSquare,
  ChevronRight,
  Edit3,
  Heart,
  Image as ImageIcon,
  Maximize2,
  Mic,
  Music,
  Paperclip,
  Pause,
  Phone,
  Play,
  Send,
  ShieldCheck,
  SkipBack,
  SkipForward,
  Sparkles,
  Star,
  Stethoscope,
  Trash2,
  User,
  Volume2,
  X
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AUDIO_LIBRARY, COLORS, EPDS_QUESTIONS, HELPLINES, STABILIZATION_TASKS } from '../constants';
import { getStructuredAIResponse } from '../services/geminiService';
import { translations } from '../translations';

const MentalWellness = ({ profile, messages, setMessages, onOpenJournal }) => {
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];
  const [showCheckin, setShowCheckin] = useState(false);
  const [chatInvolved, setChatInvolved] = useState([]); // Array of { role: 'assistant' | 'user', content: string, component?: JSX }
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showTriage, setShowTriage] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [playingMedia, setPlayingMedia] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const [checkedRituals, setCheckedRituals] = useState({});
  const [showReward, setShowReward] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const theme = COLORS[profile.accent] || COLORS.PINK;

  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showSuccess]);

  // Boundary check states
  const [showBoundaryCheck, setShowBoundaryCheck] = useState(false);
  const [boundaryQuestions, setBoundaryQuestions] = useState([]);
  const [currentBq, setCurrentBq] = useState(0);
  const [bAnswers, setBAnswers] = useState([]);

  const sectionIntros = {
    'Emotional Well-being': "Let's begin with your emotional landscape. These questions explore how you've been feeling lately.",
    'Anxiety & Fear': "Now let's talk about any anxiety or worries you may have been experiencing.",
    'Sleep & Energy': "Good. Let's check in on your sleep and energy — these are vital to your recovery.",
    'Bonding & Connection': "This section is about your connections — with your baby, partner, and support system.",
    'Physical Recovery': "Almost there. Let's look at how your body is healing physically.",
    'Safety & Support': "Finally, these last questions are about your overall safety and outlook. Please be as honest as you feel comfortable."
  };

  const startScreening = () => {
    const firstQ = EPDS_QUESTIONS[0];
    setChatInvolved([
      { role: 'assistant', content: isPostpartum ? "Hi mama, I'm your AfterMa Health Assistant. 🌸 I'm here to help you reflect on your emotional well-being over the past week." : "Hi there, I'm your Health Assistant. Let's check in on your bonding journey today." },
      { role: 'assistant', content: "This comprehensive screening covers 18 questions across emotional health, anxiety, sleep, bonding, physical recovery, and safety. Take your time — there are no right or wrong answers.", isPersona: true },
      { role: 'assistant', content: sectionIntros[firstQ.section], isSection: true, sectionName: firstQ.section },
      { role: 'assistant', content: firstQ.question }
    ]);
    setShowCheckin(true);
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const handleAnswer = (index) => {
    const question = EPDS_QUESTIONS[currentQuestion];
    const answerText = question.options[index];
    
    const newChat = [...chatInvolved, { role: 'user', content: answerText }];
    const newAnswers = [...answers, index];

    if (currentQuestion < EPDS_QUESTIONS.length - 1) {
      const nextQ = EPDS_QUESTIONS[currentQuestion + 1];
      // If next question is in a new section, inject a section transition
      if (nextQ.section !== question.section) {
        newChat.push({ role: 'assistant', content: sectionIntros[nextQ.section], isSection: true, sectionName: nextQ.section });
      }
      newChat.push({ role: 'assistant', content: nextQ.question });
      setChatInvolved(newChat);
      setCurrentQuestion(prev => prev + 1);
      setAnswers(newAnswers);
    } else {
      setAnswers([]);
      const epdsQuotes = [
        "Self-reflection is the first step toward profound emotional healing.",
        "Your feelings are valid, and your courage to express them is inspiring.",
        "Nurturing your mind is just as important as nurturing your body.",
        "You're doing excellent work in honoring your emotional journey."
      ];
      window._lastSuccessQuote = epdsQuotes[Math.floor(Math.random() * epdsQuotes.length)];
      setShowSuccess(true);
      setShowCheckin(false);
    }
  };

  const startBoundaryCheck = async () => {
    try {
      const res = await fetch('/api/wellness/questions');
      if (!res.ok) throw new Error("Failed to load questions");
      const data = await res.json();
      if (data.status === 'success') {
        const qs = data.data.map(q => ({
          question: q,
          options: ["Always / Very often", "Sometimes", "Rarely", "Never"]
        }));
        setBoundaryQuestions(qs);
        setChatInvolved([
          { role: 'assistant', content: "Setting boundaries is essential for your peace of mind. Let's look at your current boundaries." },
          { role: 'assistant', content: "Your Health Assistant", isPersona: true },
          { role: 'assistant', content: qs[0].question }
        ]);
        setShowBoundaryCheck(true);
        setCurrentBq(0);
        setBAnswers([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBAnswer = async (answerText) => {
    const newChat = [...chatInvolved, { role: 'user', content: answerText }];
    const newAns = [...bAnswers, { question_text: boundaryQuestions[currentBq].question, answer: answerText }];
    
    if (currentBq < boundaryQuestions.length - 1) {
      newChat.push({ role: 'assistant', content: boundaryQuestions[currentBq + 1].question });
      setChatInvolved(newChat);
      setBAnswers(newAns);
      setCurrentBq(prev => prev + 1);
    } else {
      const scoreMap = { "Always / Very often": 3, "Sometimes": 2, "Rarely": 1, "Never": 0 };
      const score = newAns.reduce((acc, a) => acc + scoreMap[a.answer], 0);
      try {
        await fetch('/api/wellness/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: profile._id,
            answers: newAns,
            wellness_score: score,
            timestamp: new Date()
          })
        });
        setShowBoundaryCheck(false);
        const bQuotes = [
          "Setting boundaries is an act of self-love and emotional preservation.",
          "Your inner peace is a priority, and today you've honored it well.",
          "Healthy boundaries create healthy hearts. Well done on checking in.",
          "Your emotional well-being matters. Thank you for making space for it."
        ];
        window._lastSuccessQuote = bQuotes[Math.floor(Math.random() * bQuotes.length)];
        setShowSuccess(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Real Audio Player State
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  // Handle Play/Pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Setup audio state when a new song is picked
  useEffect(() => {
    if (playingMedia?.type === 'audio' && audioRef.current) {
      audioRef.current.src = playingMedia.src;
      audioRef.current.load();

      if (isPlaying) {
        audioRef.current.play().catch(e =>
          console.log('Audio autoplay blocked:', e)
        );
      }
    }
  }, [playingMedia, isPlaying]);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const dur = audioRef.current.duration;
    setCurrentTime(current);
    if (dur > 0) {
      setAudioProgress((current / dur) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const handleProgressClick = (e) => {
    if (!progressBarRef.current || !audioRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const newTime = pct * audioDuration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return "0:00";
    const m = Math.floor(timeInSeconds / 60);
    const s = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
  const isPostpartum = profile.maternityStage === 'Postpartum';

  const suggestions = isPostpartum
    ? ['Postpartum Anxiety', 'Lactation Issues', 'Sleep Deprivation', 'Mood Swings']
    : ['Nausea Relief', 'Cramping in T1', 'Safe Exercises', 'Birth Planning'];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, chatInvolved]);

  const clearTriageHistory = () => {
    if (window.confirm("Are you sure you want to clear your AI Triage history? This action cannot be undone.")) {
      setMessages([]);
      localStorage.removeItem('afterma_triage_v4');
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() };
    // setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    try {
      const response = await getStructuredAIResponse(text, profile);
      // Build rich message object with full structured data
      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message || 'I am here to support you.',
        triage: response.triage,
        bullets: response.bullets || [],
        warnings: response.warnings || [],
        quickReplies: response.quick_replies || [],
        uiFlags: response.ui_flags || {},
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, userMsg, aiMsg]);
    } catch (error) {
      console.error("AI Triage Error:", error);
      const errMsg = { id: (Date.now() + 1).toString(), role: 'assistant', content: 'I had trouble connecting. If this is urgent, please call 112.', triage: 'mild', bullets: [], warnings: [], quickReplies: [], uiFlags: {}, timestamp: Date.now() };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // handleAnswer removed from here, moved up for startScreening flow

  const toggleRitual = (idx) => {
    const isNewCheck = !checkedRituals[idx];
    setCheckedRituals(p => ({ ...p, [idx]: isNewCheck }));
    if (isNewCheck) {
      setShowReward(true);
      setTimeout(() => setShowReward(false), 3000);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-slate-50/50 backdrop-blur-3xl animate-in fade-in duration-700">
        <div className="relative max-w-2xl w-full bg-white rounded-[5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.1)] animate-in zoom-in-95 duration-700 border border-white">
          <div className="h-[40vh] relative bg-slate-50 overflow-hidden">
            <img
              src="/wellness_celebration_figure.png"
              alt="Wellness Celebration"
              className="w-full h-full object-cover opacity-80 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
          </div>

          <div className="p-12 lg:p-16 text-center space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-rose-50 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100 shadow-sm">
                <Heart size={14} fill="currentColor" /> JOURNEY UPDATED
              </div>
              <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
                Reflection <span className="text-rose-500 underline decoration-rose-100 underline-offset-8">Complete</span>
              </h3>
            </div>

            <div className="relative p-10 bg-slate-50 rounded-[3.5rem] border border-slate-100 max-w-sm mx-auto shadow-inner">
              <p className="text-base font-bold text-slate-500 italic leading-relaxed">
                "{window._lastSuccessQuote || "Consistency in mental care is the foundation of lasting health."}"
              </p>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-white border border-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
                Support Insight
              </div>
            </div>

            <div className="space-y-6">
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full max-w-xs py-7 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:scale-105 active:scale-95 transition-all outline-none"
              >
                Return to Sanctuary
              </button>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] animate-pulse">Closing session in 5s</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 lg:space-y-16 pb-32 animate-in relative rounded-[5rem] p-1">
      {showReward && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none animate-in zoom-in-50 duration-500">
          <div className="bg-white/90 backdrop-blur-xl p-12 rounded-[5rem] border-4 border-rose-100 shadow-2xl flex flex-col items-center gap-6 scale-110">
            <div className="text-8xl animate-bounce-slow">🧸</div>
            <div className="text-center space-y-2">
              <h4 className="text-3xl font-black text-slate-900 tracking-tight">Warm Hug!</h4>
              <div className="flex gap-1 justify-center">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={24} className="text-amber-400 fill-amber-400 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />)}
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-4">{t.mental.ritualReward}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
        <div className="bg-white/80 backdrop-blur-2xl p-10 lg:p-14 rounded-[4rem] shadow-[0_10px_60px_rgba(0,0,0,0.03)]  col-span-1 lg:col-span-2 space-y-12">
          <div className="flex items-center justify-between border-b border-slate-50 pb-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
                 <ShieldCheck size={12} /> PRIVATE SANCTUARY
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">{isPostpartum ? "Inner Sanctuary" : "Prenatal Serenity"}</h2>
              <p className="text-slate-400 font-bold italic text-base lg:text-lg opacity-80 leading-relaxed">"{isPostpartum ? t.mental.subtitle : "A safe harbor for your mind during pregnancy."}"</p>
            </div>
            <div className="h-24 w-24 bg-slate-50/50 rounded-[3rem] text-slate-200 flex items-center justify-center shadow-inner border border-white"><ShieldCheck size={44} strokeWidth={1.5} /></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
            <MentalAction icon={<Heart className="text-rose-400" />} title={isPostpartum ? "EPDS Screening" : "Bonding Check-in"} subtitle="Guided Reflection" onClick={startScreening} />
            <MentalAction icon={<Stethoscope className="text-emerald-400" />} title="AI Triage" subtitle="Clinical Logic" onClick={() => setShowTriage(true)} />
            <MentalAction icon={<Sparkles className="text-amber-400" />} title="Grounding Loops" subtitle="Safe Audio" onClick={() => setShowMediaLibrary(true)} />
            <MentalAction icon={<Edit3 className="text-rose-400" />} title="Safe Journal" subtitle="Private Space" onClick={onOpenJournal} />
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-10 rounded-[4rem] text-white space-y-8 shadow-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #10B981, #064E3B)' }}>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-200 opacity-80">Safety First</p>
              <h4 className="text-2xl font-black tracking-tight">Support Available</h4>
            </div>
            <div className="flex items-center gap-4 p-5 bg-white/10 rounded-[2.5rem] border border-white/10 relative z-10 backdrop-blur-xl">
              <div className="p-3 bg-white/20 rounded-2xl"><Phone size={20} strokeWidth={2.5} /></div>
              <div>
                <p className="text-sm font-black">{HELPLINES.india.number}</p>
                <p className="text-[9px] uppercase tracking-widest text-emerald-100 opacity-70">Verified Helpline</p>
              </div>
            </div>
            <div className="absolute top-[-20%] right-[-20%] opacity-10 pointer-events-none scale-[1.5]"><ShieldCheck size={200} /></div>
          </div>

          <div className="bg-white p-10 rounded-[4rem] border-slate-90 shadow-sm space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300">{t.mental.ritualTitle}</h4>
            <div className="space-y-4">
              {STABILIZATION_TASKS.map((task, i) => (
                <button key={i} onClick={() => toggleRitual(i)} className="w-full flex gap-4 p-5 bg-slate-50 rounded-[2.5rem] border border-slate-50 items-center text-left hover:bg-slate-100 transition-all group active:scale-[0.98]">
                  <div className={`p-2.5 rounded-xl shadow-sm border transition-all ${checkedRituals[i] ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-100 text-slate-100'}`}>
                    {checkedRituals[i] ? <CheckSquare size={16} strokeWidth={3} /> : <div className="w-4 h-4" />}
                  </div>
                  <p className={`text-xs font-bold leading-tight transition-all ${checkedRituals[i] ? 'text-slate-400 line-through' : 'text-slate-600'}`}>"{task}"</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

          {showTriage && createPortal(
        <div className="fixed inset-0 z-[200] bg-white flex flex-col animate-in fade-in slide-in-from-bottom duration-700 overflow-hidden">
           {/* Header */}
          <div className="h-16 flex items-center justify-between px-6 lg:px-12 shrink-0 bg-white border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100/50">
                <Bot size={20} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">AI Clinical Triage</h3>
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em]">Verified Sanctuary Support</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {messages.length > 0 && (
                <button 
                  onClick={clearTriageHistory} 
                  className="flex items-center gap-2 px-4 py-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-full transition-all border border-transparent hover:border-rose-100"
                >
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Delete History</span>
                  <Trash2 size={16} strokeWidth={1.5} />
                </button>
              )}
              <div className="h-8 w-px bg-slate-100" />
              <button 
                onClick={() => setShowTriage(false)} 
                className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-white rounded-full transition-all border border-slate-100 flex items-center justify-center"
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#F9FBFC]/50 relative" ref={scrollRef}>
            <div className="max-w-3xl mx-auto px-6 lg:px-10 py-10 space-y-8">
              {messages.length === 0 && (
                <div className="max-w-2xl mx-auto text-center space-y-8 py-8 animate-in fade-in duration-500">
                  <div className="inline-flex p-8 bg-white rounded-full text-emerald-500 shadow-xl border border-emerald-50">
                    <Sparkles size={40} strokeWidth={1} />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">How can I help you <span className="text-emerald-500">heal</span>?</h2>
                    <p className="text-sm text-slate-400 font-bold leading-relaxed max-w-lg mx-auto">Describe your clinical symptoms or ask for recovery guidance.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                    {suggestions.map(s => (
                      <button 
                        key={s} 
                        onClick={() => handleSendMessage(s)} 
                        className="p-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 hover:border-emerald-400 hover:shadow-lg transition-all active:scale-[0.98] text-left flex items-center justify-between group"
                      >
                       <span className="px-2">{s}</span>
                       <div className="h-8 w-8 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all shrink-0">
                          <ChevronRight size={16} strokeWidth={2.5} />
                       </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(messages || []).map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                  <div className={`max-w-[85%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`h-9 w-9 rounded-full shrink-0 flex items-center justify-center shadow-md border-2 border-white ${msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-white text-emerald-500'}`}>
                      {msg.role === 'user' ? <User size={16} strokeWidth={2.5} /> : <Bot size={16} strokeWidth={1.5} />}
                    </div>
                    <div className="space-y-3 flex-1">
                      {/* Emergency Banner */}
                      {msg.uiFlags?.show_emergency_banner && (
                        <div className="px-5 py-3 bg-rose-500 text-white rounded-2xl flex items-center gap-3 shadow-lg animate-pulse">
                          <div className="p-1.5 bg-white/20 rounded-full"><Phone size={16} fill="white" /></div>
                          <span className="font-black text-sm uppercase tracking-tight">Immediate Attention — Call 112</span>
                        </div>
                      )}
                      
                      {/* Triage Badge */}
                      {msg.role === 'assistant' && msg.triage && (
                        <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${msg.triage === 'emergency' ? 'bg-rose-50 text-rose-600 border-rose-100'
                          : msg.triage === 'moderate' ? 'bg-amber-50 text-amber-600 border-amber-100'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          }`}>
                          <div className={`w-2 h-2 rounded-full ${msg.triage === 'emergency' ? 'bg-rose-500 animate-pulse'
                            : msg.triage === 'moderate' ? 'bg-amber-500'
                              : 'bg-emerald-500'
                            }`} />
                          Triage: {msg.triage}
                        </div>
                      )}

                      {/* Main Content Bubble */}
                      <div className={`p-5 rounded-2xl text-sm leading-relaxed font-bold shadow-sm whitespace-pre-wrap ${msg.role === 'user'
                        ? 'bg-slate-900 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}`}>
                        {msg.content}
                      </div>

                      {/* Bulleted Points */}
                      {msg.role === 'assistant' && msg.bullets?.length > 0 && (
                        <div className="grid grid-cols-1 gap-2 pt-2">
                          {msg.bullets.map((b, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-xl text-sm text-slate-600 shadow-sm">
                              <div className="w-6 h-6 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black">{i + 1}</div>
                              <span className="font-bold leading-relaxed">{b}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Warnings */}
                      {msg.role === 'assistant' && msg.warnings?.length > 0 && (
                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl space-y-2">
                          {msg.warnings.map((w, i) => (
                            <div key={i} className="flex items-start gap-3 text-sm text-amber-800 font-bold leading-relaxed">
                              <span className="text-lg shrink-0">⚠️</span><span>{w}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start animate-in fade-in duration-300 px-4">
                  <div className="bg-white p-8 rounded-[3.5rem] rounded-tl-none border border-slate-100 flex gap-3 items-center shadow-sm">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce" />
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:200ms]" />
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:400ms]" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
            <div className="max-w-3xl mx-auto relative flex items-center gap-3">
               <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage(input)} 
                    placeholder="Describe your feelings or symptoms..." 
                    className="w-full pl-5 pr-14 py-3.5 bg-slate-50 border border-slate-100 rounded-full font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:bg-white focus:border-emerald-200 transition-all text-sm placeholder:opacity-40" 
                  />
                  <button 
                    onClick={() => handleSendMessage(input)} 
                    disabled={!input.trim() || isTyping} 
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
                  >
                    <Send size={16} strokeWidth={2.5} />
                  </button>
               </div>
               <button className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all active:scale-90 border border-emerald-100 shrink-0"><Mic size={18} strokeWidth={2.5} /></button>
            </div>
          </div>
        </div>
      , document.body)}

      {showMediaLibrary && createPortal(
        <div className="fixed inset-0 z-[200] bg-white flex flex-col overflow-hidden">
          <div className="h-16 flex items-center justify-between px-6 lg:px-12 shrink-0 bg-white border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100/50"><Music size={20} strokeWidth={1.5} /></div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Grounding Library</h3>
                <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.3em]">Healing Frequencies & Rhythms</p>
              </div>
            </div>
            <button 
              onClick={() => setShowMediaLibrary(false)} 
              className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-white rounded-full transition-all border border-slate-100 flex items-center justify-center"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-white">
            <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10 space-y-16">
              {/* Audio Grid */}
              <div className="space-y-8">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="px-4 py-1 bg-amber-50 text-amber-600 rounded-full font-black text-[9px] uppercase tracking-widest border border-amber-100">Digital Sanctuary</div>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight">Audio Journeys</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {AUDIO_LIBRARY.map((item, i) => (
                    <div key={i} onClick={() => { setPlayingMedia(item); setIsPlaying(true); }} className="group relative bg-white p-3 rounded-2xl border border-slate-100 hover:shadow-xl transition-all cursor-pointer">
                      <div className="aspect-square rounded-xl overflow-hidden relative shadow-md bg-slate-100">
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                          <div className="w-14 h-14 bg-white/95 backdrop-blur-xl rounded-full flex items-center justify-center shadow-xl">
                            <Play size={24} className="text-amber-600 ml-1 fill-amber-600" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <div className="space-y-1">
                          <h5 className="font-black text-slate-900 text-base tracking-tight leading-none">{item.title}</h5>
                          <p className="text-[10px] text-amber-500 font-black uppercase tracking-[0.2em]">{item.mood} • {item.duration}</p>
                        </div>
                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-200 group-hover:bg-amber-500 group-hover:text-white transition-all border border-slate-100">
                           <Music size={16} strokeWidth={1.5} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Movie Grid */}
              <div className="space-y-8 pb-10">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="px-4 py-1 bg-indigo-50 text-indigo-600 rounded-full font-black text-[9px] uppercase tracking-widest border border-indigo-100">Visual Zen</div>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight">Cinematic Comfort</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { type: 'movie', title: "Nature's Rhythm", duration: "45m", mood: "Peaceful", img: "https://images.unsplash.com/photo-1501854140801-50d01674aa3e?auto=format&fit=crop&q=80&w=800" },
                    { type: 'movie', title: "Starlit Journey", duration: "60m", mood: "Dreamy", img: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&q=80&w=800" },
                    { type: 'movie', title: "Mountain Echo", duration: "30m", mood: "Majestic", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800" },
                    { type: 'movie', title: "Ocean Breeze", duration: "50m", mood: "Calm", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800" }
                  ].map((item, i) => (
                    <div key={i} onClick={() => { setPlayingMedia(item); setIsPlaying(true); }} className="group relative bg-white p-3 rounded-2xl border border-slate-100 hover:shadow-xl transition-all cursor-pointer">
                      <div className="aspect-[16/9] rounded-xl overflow-hidden relative shadow-md">
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms]" />
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-90" />
                        <div className="absolute top-4 left-4 py-1 px-3 bg-indigo-500/90 text-white rounded-full text-[8px] font-black uppercase tracking-[0.3em] border border-white/20 shadow-lg">High Fidelity OTT</div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 shadow-xl">
                            <Play size={28} className="text-white fill-white ml-1" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4 flex justify-between items-end">
                        <div className="space-y-1">
                          <h5 className="font-black text-slate-900 text-base tracking-tight leading-none">{item.title}</h5>
                          <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-[0.2em]">{item.mood} • {item.duration}</p>
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-all border border-slate-100">
                           <Maximize2 size={16} strokeWidth={1.5} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      , document.body)}

                {/* Media Player Overlay - Platinum Suite Light Theme */}
                {playingMedia && createPortal(
                  <div className="fixed inset-0 z-[250] bg-[#fff] flex flex-col items-center justify-center animate-in fade-in duration-700">
                    <button 
                      onClick={() => { setPlayingMedia(null); setIsPlaying(false); }} 
                      className="absolute top-12 right-12 p-4 bg-slate-50 text-slate-900 hover:rotate-90 transition-all duration-500 rounded-full border border-slate-200 shadow-sm"
                    >
                      <X size={32} strokeWidth={2} />
                    </button>
                    
                    {playingMedia.type === 'audio' && (
                      <audio
                        ref={audioRef}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={() => setIsPlaying(false)}
                      />
                    )}

                    <div className="w-full max-w-5xl px-8 space-y-16">
                      <div className="relative aspect-[16/10] rounded-[5rem] overflow-hidden shadow-2xl border border-slate-400 bg-slate-300 flex items-center justify-center group">
                        {/* High-Fidelity Music Picture Display */}
                        <img 
                          src={playingMedia.img || '/wellness_celebration_figure.png'} 
                          alt={playingMedia.title} 
                          className={`absolute inset-0 w-full h-full object-cover transition-all duration-[8000ms] ${isPlaying ? 'scale-110 opacity-30 blur-md' : 'scale-100 opacity-10 blur-none'}`} 
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/80 to-transparent" />
                        
                        <div className="relative z-10 flex flex-col items-center">
                           <div className={`w-96 h-96 rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.15)] border-4 border-white transition-all duration-1000 ${isPlaying ? 'scale-105' : 'scale-95 opacity-80'}`}>
                              <img src={playingMedia.img || '/wellness_celebration_figure.png'} className="w-full h-full object-cover" />
                           </div>
                        </div>

                        <div className="absolute inset-x-12 bottom-8 space-y-6 z-30 text-center">
                          <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-2 border border-amber-100 shadow-sm">
                               <Play size={10} fill="currentColor" /> {playingMedia.type === 'audio' ? 'PLATINUM AUDIO' : 'CINEMATIC SCOPE'}
                            </div>
                            <h3 className="text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-2 drop-shadow-[0_0_20px_rgba(255,255,255,1)]">
                              {playingMedia.title}
                            </h3>
                            <p className="text-slate-900 font-black uppercase tracking-[0.5em] text-[10px] font-mono drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">{playingMedia.mood || 'SOULFUL'} • {playingMedia.duration || 'SESSION'}</p>
                          </div>

                          <div className="space-y-6 max-w-3xl mx-auto">
                            <div
                               ref={progressBarRef}
                               onClick={handleProgressClick}
                               className="h-2 w-full bg-slate-200 rounded-full group cursor-pointer relative overflow-hidden shadow-inner"
                            >
                               <div
                                 className="h-full bg-gradient-to-r from-slate-900 to-slate-700 rounded-full transition-all group-hover:brightness-110"
                                 style={{ width: `${audioProgress}%` }}
                               />
                            </div>
                            <div className="flex justify-between text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">
                               <span>{formatTime(currentTime)}</span>
                               <span>{formatTime(audioDuration) !== "0:00" ? formatTime(audioDuration) : playingMedia.duration || '4:41'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-12">
                        <div className="flex items-center gap-16">
                          <button className="text-slate-900 hover:scale-110 transition-all transform hover:-translate-x-2"><SkipBack size={56} strokeWidth={1.5} /></button>
                          <button
                            onClick={playingMedia.type === 'audio' ? togglePlay : () => setIsPlaying(!isPlaying)}
                            className="w-32 h-32 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-[0_30px_60px_rgba(0,0,0,0.2)] hover:scale-110 active:scale-90 transition-all group"
                          >
                            {isPlaying ? <Pause size={56} fill="white" /> : <Play size={56} fill="white" className="ml-4" />}
                          </button>
                          <button className="text-slate-900 hover:scale-110 transition-all transform hover:translate-x-2"><SkipForward size={56} strokeWidth={1.5} /></button>
                        </div>

                        <div className="flex items-center gap-12 text-slate-900">
                           <div className="flex items-center gap-6">
                              <button 
                                onClick={() => setVolume(v => Math.max(0, v - 0.1))}
                                className="p-2 hover:bg-slate-100 rounded-full transition-all active:scale-90"
                              >
                                <Volume2 size={24} strokeWidth={2} className="opacity-50" />
                              </button>
                              <div className="relative w-48 h-2 bg-slate-200 rounded-full cursor-pointer group"
                                   onClick={(e) => {
                                     const rect = e.currentTarget.getBoundingClientRect();
                                     const pct = (e.clientX - rect.left) / rect.width;
                                     setVolume(Math.max(0, Math.min(1, pct)));
                                   }}>
                                 <div className="absolute inset-y-0 left-0 bg-slate-900 rounded-full" style={{ width: `${volume * 100}%` }} />
                                 <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-slate-900 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `calc(${volume * 100}% - 10px)` }} />
                              </div>
                              <button 
                                onClick={() => setVolume(v => Math.min(1, v + 0.1))}
                                className="p-2 hover:bg-slate-100 rounded-full transition-all active:scale-90"
                              >
                                <Volume2 size={24} strokeWidth={2.5} />
                              </button>
                           </div>
                           <div className="h-8 w-px bg-slate-200" />
                           <button className="hover:text-amber-500 transition-colors"><Maximize2 size={24} strokeWidth={2} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                , document.body)}


      {showCheckin && createPortal(
        <div className="fixed inset-0 z-[200] bg-white flex flex-col">
          {/* Compact Header */}
          <div className="h-16 flex items-center justify-between px-6 lg:px-12 shrink-0 bg-white border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-rose-50 text-rose-500 rounded-full border border-rose-100/50">
                <Heart size={20} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Clinical Reflection</h3>
                <p className="text-[9px] font-black text-rose-500 uppercase tracking-[0.3em]">Private Sanctuary Room</p>
              </div>
            </div>
            <button 
              onClick={() => setShowCheckin(false)} 
              className="w-10 h-10 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-white rounded-full transition-all border border-slate-100 flex items-center justify-center"
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="max-w-2xl mx-auto px-6 lg:px-8 py-10 space-y-8">
              {currentQuestion < EPDS_QUESTIONS.length ? (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-5 py-1.5 bg-slate-50 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-slate-100">
                      STEP <span className="text-slate-900">{currentQuestion + 1}</span> / {EPDS_QUESTIONS.length}
                    </div>
                    
                    <h2 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                      {EPDS_QUESTIONS[currentQuestion].question}
                    </h2>

                    {EPDS_QUESTIONS[currentQuestion].section && (
                       <div className="inline-flex px-5 py-1 bg-rose-50 text-rose-500 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-rose-100/50">
                          {EPDS_QUESTIONS[currentQuestion].section}
                       </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {EPDS_QUESTIONS[currentQuestion].options.map((choice, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => handleAnswer(idx)} 
                        className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 hover:border-rose-400 hover:bg-white hover:shadow-lg transition-all active:scale-[0.98] text-left flex items-center justify-between group"
                      >
                        <span className="leading-snug px-2">{choice}</span>
                        <div className="h-8 w-8 bg-white text-slate-200 rounded-full flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm border border-slate-100 group-hover:border-rose-400 shrink-0">
                          <ChevronRight size={16} strokeWidth={2.5} />
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Optional details */}
                  <div className="space-y-3 pt-4">
                     <p className="text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Deepen your reflection (Optional)</p>
                     <textarea 
                        className="w-full p-5 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-rose-50 focus:bg-white focus:border-rose-200 transition-all resize-none"
                        placeholder="Speak your heart here..."
                        rows={2}
                     />
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-8 py-12 animate-in fade-in duration-500">
                   <div className="inline-flex p-8 bg-white rounded-full text-rose-500 shadow-xl border border-rose-50">
                      <ShieldCheck size={48} strokeWidth={1} />
                   </div>
                   <div className="space-y-3">
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">Assessment Complete</h2>
                      <p className="text-sm text-slate-400 font-bold leading-relaxed max-w-md mx-auto">Your clinical reflection is held in safe sanctum.</p>
                   </div>
                   <button 
                     onClick={() => { setShowSuccess(true); setShowCheckin(false); }} 
                     className="px-10 py-4 bg-slate-900 text-white rounded-full font-black uppercase tracking-[0.3em] text-[11px] hover:scale-105 active:scale-95 transition-all shadow-xl"
                   >
                     Submit to Sanctuary
                   </button>
                </div>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 bg-slate-100 w-full shrink-0 relative">
            <div className="absolute inset-y-0 left-0 bg-rose-500 transition-all duration-700 ease-out" style={{ width: `${((currentQuestion + 1) / EPDS_QUESTIONS.length) * 100}%` }} />
          </div>
        </div>
      , document.body)}

      {showBoundaryCheck && createPortal(
        <div className="fixed inset-0 z-[200] bg-white flex flex-col animate-in slide-in-from-bottom duration-700 overflow-hidden font-outfit">
          {/* Header Area */}
          <div className="h-32 flex items-center justify-between px-12 lg:px-24 shrink-0 bg-white relative z-20">
            <div className="flex items-center gap-8">
              <div className="p-5 bg-blue-50 text-blue-500 rounded-full shadow-sm border border-blue-100/50">
                <ShieldCheck size={36} strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Boundary Scout</h3>
                <p className="text-[11px] font-black text-blue-500 uppercase tracking-[0.4em]">Energy Preservation Audit</p>
              </div>
            </div>
            <button 
              onClick={() => setShowBoundaryCheck(false)} 
              className="w-20 h-20 bg-slate-50 text-slate-300 hover:text-slate-900 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-100 shadow-sm flex items-center justify-center"
            >
              <X size={32} strokeWidth={1.5} />
            </button>
          </div>

          {/* Main Content Room */}
          <div className="flex-1 overflow-y-auto flex flex-col items-center px-8 lg:px-16 bg-white relative">
            <div className="w-full max-w-6xl py-24 space-y-16">
              {currentBq < boundaryQuestions.length ? (
                <div className="space-y-20 animate-in fade-in zoom-in-95 duration-1000">
                  <div className="text-center space-y-12">
                    <div className="inline-flex items-center gap-4 px-8 py-2.5 bg-slate-50 text-slate-400 rounded-full text-[11px] font-black uppercase tracking-[0.5em] border border-slate-100/50">
                      PHASE <span className="text-slate-900">{currentBq + 1}</span> <span className="text-slate-200">/</span> {boundaryQuestions.length}
                    </div>
                    
                    <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-[1.1] max-w-4xl mx-auto drop-shadow-sm">
                      {boundaryQuestions[currentBq].question}
                    </h2>

                    <div className="inline-flex px-8 py-2 bg-blue-50 text-blue-500 rounded-full text-[12px] font-black uppercase tracking-[0.4em] border border-blue-100/50">
                       PEACE PRESERVATION
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
                    {boundaryQuestions[currentBq].options.map((choice, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => handleBAnswer(choice)} 
                        className="p-8 bg-[#F9FBFC]/50 border border-slate-100 rounded-full text-lg font-black text-slate-700 hover:border-blue-400 hover:bg-white hover:shadow-[0_40px_100px_-20px_rgba(59,130,246,0.15)] transition-all transform hover:-translate-y-2 active:scale-95 text-left flex items-center justify-between group"
                      >
                        <span className="leading-tight px-4">{choice}</span>
                        <div className="h-12 w-12 bg-white text-slate-200 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-slate-100 group-hover:border-blue-400">
                          <ChevronRight size={24} strokeWidth={2.5} />
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="max-w-3xl mx-auto text-center pt-16">
                     <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.3em] leading-relaxed opacity-70 italic">"Protecting your energy is a prerequisite for healing. Every 'No' is a 'Yes' to yourself."</p>
                  </div>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto text-center space-y-16 animate-in fade-in zoom-in-95 duration-1000">
                   <div className="inline-flex p-16 bg-white rounded-full text-blue-500 shadow-[0_50px_100px_rgba(59,130,246,0.15)] border border-blue-50">
                      <ShieldCheck size={100} strokeWidth={1} />
                   </div>
                   <div className="space-y-8">
                      <h2 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none">Energy Vault Secured</h2>
                      <p className="text-xl text-slate-400 font-bold leading-relaxed max-w-2xl mx-auto tracking-tight">Your boundaries are now clinical law. Your sanctuary remains undisturbed.</p>
                   </div>
                   <button 
                     onClick={() => setShowBoundaryCheck(false)} 
                     className="px-24 py-10 bg-slate-900 text-white rounded-full font-black uppercase tracking-[0.5em] text-[13px] hover:scale-105 active:scale-95 transition-all shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)]"
                   >
                     Lock Sanctuary
                   </button>
                </div>
              )}
            </div>
          </div>

          <div className="h-4 bg-slate-50 w-full overflow-hidden shrink-0 relative">
            <div className="absolute inset-y-0 left-0 bg-blue-500 transition-all duration-[1500ms] ease-out shadow-[0_0_30px_rgba(59,130,246,0.8)]" style={{ width: `${((currentBq + 1) / boundaryQuestions.length) * 100}%` }} />
          </div>
        </div>
      , document.body)}
    </div>
  );
};

const MentalAction = ({ icon, title, subtitle, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center p-10 bg-white/50 backdrop-blur-xl border border-white/40 rounded-[4rem] hover:border-white shadow-sm hover:shadow-2xl transition-all duration-500 text-center group active:scale-[0.98]">
    <div className="p-6 bg-slate-50 rounded-3xl mb-6 group-hover:bg-white group-hover:scale-110 transition-all shadow-inner border border-transparent group-hover:border-slate-100">
      {React.cloneElement(icon, { size: 32, strokeWidth: 2.5 })}
    </div>
    <span className="font-bold text-slate-900 text-xl mb-1.5 tracking-tight leading-none">{title}</span>
    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{subtitle}</span>
  </button>
);

export default MentalWellness;

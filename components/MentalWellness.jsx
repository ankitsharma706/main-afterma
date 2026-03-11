
import {
  Bot,
  CheckSquare,
  ChevronRight,
  Edit3,
  Film,
  Headphones,
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
  User,
  Volume2,
  X
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { AUDIO_LIBRARY, COLORS, EPDS_QUESTIONS, HELPLINES, STABILIZATION_TASKS } from '../constants';
import { getStructuredAIResponse } from '../services/geminiService';
import { translations } from '../translations';

const MentalWellness = ({ profile, messages, setMessages, onOpenJournal }) => {
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];
  const [showCheckin, setShowCheckin] = useState(false);
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
        setShowBoundaryCheck(true);
        setCurrentBq(0);
        setBAnswers([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBAnswer = async (answerText) => {
    const newAns = [...bAnswers, { question_text: boundaryQuestions[currentBq].question, answer: answerText }];
    const scoreMap = {
      "Always / Very often": 3,
      "Sometimes": 2,
      "Rarely": 1,
      "Never": 0
    };
    const score = newAns.reduce((acc, a) => acc + scoreMap[a.answer], 0);
    if (currentBq < boundaryQuestions.length - 1) {
      setBAnswers(newAns);
      setCurrentBq(prev => prev + 1);
    } else {
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
  }, [messages]);

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

  const handleAnswer = (index) => {
    const newAnswers = [...answers, index];
    if (currentQuestion < EPDS_QUESTIONS.length - 1 && isPostpartum) {
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
    }
  };

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
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-white animate-in fade-in duration-700">
        <div className="relative max-w-2xl w-full bg-white rounded-[4rem] overflow-hidden animate-in zoom-in-95 duration-700">
          <div className="h-[35vh] relative bg-slate-50 border-b border-slate-100 overflow-hidden">
            <img
              src="/wellness_celebration_figure.png"
              alt="Wellness Figure"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          </div>

          <div className="p-10 lg:p-14 text-center space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-rose-50 text-rose-600 rounded-full text-xs font-black uppercase tracking-widest border border-rose-100 mb-2">
                <Heart size={14} /> Sanctuary Updated
              </div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Reflection <span style={{ color: theme.primary }}>Complete!</span>
              </h3>
            </div>

            <div className="relative p-7 bg-slate-50/80 rounded-[2.5rem] border border-slate-100 max-w-sm mx-auto">
              <p className="text-sm font-bold text-slate-500 italic leading-relaxed">
                "{window._lastSuccessQuote || "Consistency in mental care is the foundation of lasting health."}"
              </p>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-white border border-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Support Insight
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full max-w-xs py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all outline-none"
              >
                Return to Sanctuary
              </button>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest animate-pulse">Returning in 5 seconds...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 lg:space-y-16 pb-32 animate-in relative">
      {showReward && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none animate-in zoom-in-50 duration-500">
          <div className="bg-white/90 backdrop-blur-xl p-12 rounded-[4rem] border-4 border-rose-100 shadow-2xl flex flex-col items-center gap-6 scale-110">
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
        <div className="bg-white/80 backdrop-blur-2xl p-10 lg:p-14 rounded-[3.5rem] shadow-[0_10px_60px_rgba(0,0,0,0.03)] border border-white/60 col-span-1 lg:col-span-2 space-y-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">{isPostpartum ? "Emotional Sanctuary" : "Prenatal Serenity"}</h2>
              <p className="text-slate-400 font-medium italic text-base lg:text-lg opacity-80 leading-relaxed">"{isPostpartum ? t.mental.subtitle : "A safe harbor for your mind during pregnancy."}"</p>
            </div>
            <div className="h-20 w-20 bg-slate-50/50 rounded-[2rem] text-slate-200 flex items-center justify-center shadow-inner border border-white"><ShieldCheck size={40} /></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <MentalAction icon={<Heart className="text-rose-400" />} title={isPostpartum ? "EPDS Screening" : "Bonding Check-in"} subtitle="Guided Reflection" onClick={() => setShowCheckin(true)} />
            <MentalAction icon={<Stethoscope className="text-emerald-400" />} title="AI Triage" subtitle="Clinical Logic" onClick={() => setShowTriage(true)} />
            <MentalAction icon={<Sparkles className="text-amber-400" />} title="Grounding Loops" subtitle="Safe Audio" onClick={() => setShowMediaLibrary(true)} />
            <MentalAction icon={<Edit3 className="text-indigo-400" />} title="Safe Journal" subtitle="Private Space" onClick={onOpenJournal} />
          </div>

          {showTriage && (
            <div className="fixed inset-0 z-[130] bg-white/95 backdrop-blur-xl flex flex-col animate-in slide-in-from-bottom duration-500">
              <div className="h-20 border-b border-slate-100 flex items-center justify-between px-8 lg:px-12 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><Bot size={20} /></div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-none">AfterMa AI Triage</h3>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Clinical Support Active</p>
                  </div>
                </div>
                <button onClick={() => setShowTriage(false)} className="p-2 text-slate-300 hover:text-slate-900"><X size={24} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 lg:p-12 space-y-8 scrollbar-hide" ref={scrollRef}>
                {messages.length === 0 && (
                  <div className="max-w-2xl mx-auto text-center space-y-10 pt-10">
                    <h4 className="text-2xl font-bold text-slate-900 tracking-tight">How are you feeling today?</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {suggestions.map(s => <button key={s} onClick={() => handleSendMessage(s)} className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-xs font-bold text-slate-600 hover:bg-white hover:border-emerald-200 hover:shadow-lg transition-all">{s}</button>)}
                    </div>
                  </div>
                )}
                {(messages || []).map(msg => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] lg:max-w-[70%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`h-10 w-10 rounded-2xl shrink-0 flex items-center justify-center shadow-sm border ${msg.role === 'user' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-emerald-500'}`}>
                        {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                      </div>
                      <div className="space-y-3 flex-1">
                        {/* Emergency Banner */}
                        {msg.uiFlags?.show_emergency_banner && (
                          <div className="px-5 py-3 bg-rose-500 text-white rounded-2xl flex items-center gap-3 shadow-lg animate-pulse">
                            <Phone size={16} fill="white" />
                            <span className="font-bold text-sm">EMERGENCY — Call 112 now</span>
                          </div>
                        )}
                        {/* Triage Badge */}
                        {msg.role === 'assistant' && msg.triage && (
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${msg.triage === 'emergency' ? 'bg-rose-50 text-rose-600 border-rose-200'
                            : msg.triage === 'moderate' ? 'bg-amber-50 text-amber-600 border-amber-200'
                              : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                            }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${msg.triage === 'emergency' ? 'bg-rose-500 animate-pulse'
                              : msg.triage === 'moderate' ? 'bg-amber-500'
                                : 'bg-emerald-500'
                              }`} />
                            {msg.triage}
                          </div>
                        )}
                        {/* Main Content */}
                        <div className={`p-6 rounded-[2rem] text-sm leading-relaxed font-medium ${msg.role === 'user'
                          ? 'bg-slate-900 text-white rounded-tr-none shadow-xl'
                          : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'
                          }`}>
                          {msg.content}
                        </div>
                        {/* Bullets */}
                        {msg.role === 'assistant' && msg.bullets?.length > 0 && (
                          <div className="p-5 bg-white border border-slate-100 rounded-2xl space-y-2 shadow-sm">
                            {msg.bullets.map((b, i) => (
                              <div key={i} className="flex items-start gap-3 text-sm text-slate-600">
                                <div className="w-5 h-5 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black">{i + 1}</div>
                                <span className="font-medium leading-relaxed">{b}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Warnings */}
                        {msg.role === 'assistant' && msg.warnings?.length > 0 && (
                          <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl space-y-2">
                            {msg.warnings.map((w, i) => (
                              <div key={i} className="flex items-start gap-3 text-xs text-amber-700 font-medium">
                                <span>⚠️</span><span>{w}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Quick Replies */}
                        {msg.role === 'assistant' && msg.quickReplies?.length > 0 && (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {msg.quickReplies.map((qr, i) => (
                              <button
                                key={i}
                                onClick={() => handleSendMessage(qr)}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                              >
                                {qr}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-emerald-500"><Bot size={18} /></div>
                      <div className="bg-slate-50 p-6 rounded-[2rem] rounded-tl-none border border-slate-100 flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:200ms]" />
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:400ms]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 lg:p-10 border-t border-slate-100 bg-white shrink-0">
                <div className="max-w-4xl mx-auto relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-3 text-slate-300">
                    <button className="hover:text-slate-900"><ImageIcon size={20} /></button>
                    <button className="hover:text-slate-900"><Paperclip size={20} /></button>
                    <button className="hover:text-emerald-500"><Mic size={20} /></button>
                  </div>
                  <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage(input)} placeholder="Type your symptoms or questions here..." className="w-full pl-32 pr-20 py-5 bg-slate-50 border border-slate-100 rounded-full font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-100 focus:bg-white transition-all shadow-inner" />
                  <button onClick={() => handleSendMessage(input)} disabled={!input.trim() || isTyping} className="absolute right-3 top-1/2 -translate-y-1/2 h-12 w-12 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-20"><Send size={18} /></button>
                </div>
              </div>
            </div>
          )}

          {showMediaLibrary && (
            <div className="fixed inset-0 z-[140] bg-white/95 backdrop-blur-2xl flex flex-col animate-in slide-in-from-bottom duration-700 overflow-hidden">
              <div className="h-20 border-b border-slate-100 flex items-center justify-between px-8 lg:px-12 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl"><Music size={20} /></div>
                  <div>
                    <h3 className="font-bold text-slate-900 leading-none">Grounding Library</h3>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mt-1">Curated OTT Experience</p>
                  </div>
                </div>
                <button onClick={() => setShowMediaLibrary(false)} className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-20">
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shadow-inner"><Headphones size={24} /></div>
                    <div className="space-y-0.5">
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">Audio Sanctuaries</h4>
                      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Healing Frequencies</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {AUDIO_LIBRARY.map((item, i) => (
                      <div key={i} onClick={() => { setPlayingMedia(item); setIsPlaying(true); }} className="group cursor-pointer bg-white p-6 rounded-[2.5rem] border border-slate-100 hover:shadow-xl transition-all space-y-4">
                        <div className="aspect-square rounded-[2rem] overflow-hidden relative shadow-inner bg-slate-50 flex items-center justify-center">
                          <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                              <Headphones size={24} className="text-amber-600" />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center px-2">
                          <div>
                            <h5 className="font-bold text-slate-900">{item.title}</h5>
                            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">{item.mood} • {item.duration}</p>
                          </div>
                          <button className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-all"><Play size={16} fill="currentColor" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner"><Film size={24} /></div>
                    <div className="space-y-0.5">
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">Cinematic Comfort</h4>
                      <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Visual Grounding</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                      { type: 'movie', title: "Nature's Rhythm", duration: "45m", mood: "Peaceful", img: "https://images.unsplash.com/photo-1501854140801-50d01674aa3e?auto=format&fit=crop&q=80&w=400", src: "/music/batenkaitos.mp3", },
                      { type: 'movie', title: "Starlit Journey", duration: "60m", mood: "Dreamy", img: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&q=80&w=400" },
                      { type: 'movie', title: "Mountain Echo", duration: "30m", mood: "Majestic", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400" }
                    ].map((item, i) => (
                      <div key={i} onClick={() => { setPlayingMedia(item); setIsPlaying(true); }} className="group cursor-pointer space-y-4">
                        <div className="aspect-[16/9] rounded-[2.5rem] overflow-hidden relative shadow-2xl border-4 border-white">
                          <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                          <div className="absolute top-4 left-4 px-3 py-1 bg-indigo-500/90 backdrop-blur-md rounded-full text-[8px] font-bold uppercase tracking-widest text-white border border-white/20">Movie</div>
                          <div className="absolute bottom-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-bold uppercase tracking-widest text-slate-900">{item.duration}</div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30">
                              <Play size={40} className="text-white fill-white" />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center px-4">
                          <div>
                            <h5 className="font-bold text-slate-900 text-lg">{item.title}</h5>
                            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">{item.mood}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Media Player Overlay */}
                {playingMedia && (
                  <div className="fixed inset-0 z-[160] bg-slate-950 flex flex-col items-center justify-center animate-in fade-in duration-500">
                    <button onClick={() => { setPlayingMedia(null); setIsPlaying(false); }} className="absolute top-10 right-10 p-4 text-white/40 hover:text-white transition-colors"><X size={32} /></button>

                    {/* Hidden actual HTML5 Audio Element */}
                    {playingMedia.type === 'audio' && (
                      <audio
                        ref={audioRef}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onEnded={() => setIsPlaying(false)}
                      />
                    )}

                    <div className="max-w-4xl w-full px-8 space-y-12">
                      <div className={`aspect-video rounded-[3rem] overflow-hidden relative shadow-2xl border border-white/10 ${playingMedia.type === 'audio' ? 'bg-gradient-to-br from-amber-900/40 to-slate-900' : ''}`}>
                        {playingMedia.type === 'movie' ? (
                          <img src={playingMedia.img} alt={playingMedia.title} className="w-full h-full object-cover opacity-60" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative">
                              <div className={`w-64 h-64 bg-amber-500/20 rounded-full absolute inset-0 transition-opacity duration-1000 ${isPlaying ? 'animate-ping opacity-100' : 'opacity-0'}`} />
                              <div className={`w-64 h-64 bg-amber-500/30 rounded-full relative flex items-center justify-center transition-transform duration-[3000ms] ${isPlaying ? 'scale-110' : 'scale-100'}`}>
                                <Headphones size={80} className="text-amber-400" />
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-10 left-10 right-10 space-y-6">
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.3em]">{playingMedia.type === 'audio' ? 'Now Listening' : 'Now Watching'}</span>
                            <h3 className="text-4xl font-black text-white tracking-tight">{playingMedia.title}</h3>
                          </div>

                          {playingMedia.type === 'audio' && (
                            <>
                              {/* Progress Timeline Scrubber */}
                              <div
                                ref={progressBarRef}
                                onClick={handleProgressClick}
                                className="h-2 w-full bg-white/10 rounded-full group cursor-pointer relative"
                              >
                                <div
                                  className="h-full bg-amber-500 rounded-full transition-all group-hover:bg-amber-400"
                                  style={{ width: `${audioProgress}%` }}
                                />
                              </div>
                              {/* Time display */}
                              <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(audioDuration) !== "0:00" ? formatTime(audioDuration) : playingMedia.duration}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-10">
                        <div className="flex items-center gap-12">
                          <button className="p-4 text-white/40 hover:text-white transition-all hover:scale-110"><SkipBack size={32} /></button>
                          <button
                            onClick={playingMedia.type === 'audio' ? togglePlay : () => setIsPlaying(!isPlaying)}
                            className="w-24 h-24 bg-white text-slate-950 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
                          >
                            {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
                          </button>
                          <button className="p-4 text-white/40 hover:text-white transition-all hover:scale-110"><SkipForward size={32} /></button>
                        </div>

                        <div className="flex items-center gap-8 text-white/40">
                          <button className="hover:text-white transition-colors">
                            {volume > 0 ? <Volume2 size={24} /> : <X size={24} />}
                          </button>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={volume}
                            onChange={(e) => {
                              const v = parseFloat(e.target.value);
                              setVolume(v);
                              if (audioRef.current) audioRef.current.volume = v;
                            }}
                            className="w-32 h-1 accent-amber-500 bg-white/10 rounded-full cursor-pointer"
                          />
                          <button className="hover:text-white transition-colors"><Maximize2 size={24} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {showCheckin && (
            <div className="fixed inset-0 z-[120] bg-white/95 backdrop-blur-xl p-10 flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
              <button onClick={() => setShowCheckin(false)} className="absolute top-10 right-10 p-4 text-slate-400 hover:text-slate-900"><X size={32} /></button>
              <div className="max-w-xl w-full text-center space-y-12">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reflection {currentQuestion + 1} of {EPDS_QUESTIONS.length}</span>
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">{EPDS_QUESTIONS[currentQuestion].question}</h3>
                </div>
                <div className="grid grid-cols-1 gap-4 w-full">
                  {EPDS_QUESTIONS[currentQuestion].options.map((choice, idx) => (
                    <button key={choice} onClick={() => handleAnswer(idx)} className="p-6 bg-white rounded-3xl border-2 border-slate-100 hover:border-slate-900 hover:shadow-lg transition-all font-bold text-slate-700 text-left flex items-center justify-between group">
                      {choice} <ChevronRight size={18} className="text-slate-200 group-hover:text-slate-900" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {showBoundaryCheck && boundaryQuestions.length > 0 && (
            <div className="fixed inset-0 z-[120] bg-white/95 backdrop-blur-xl p-10 flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
              <button onClick={() => setShowBoundaryCheck(false)} className="absolute top-10 right-10 p-4 text-slate-400 hover:text-slate-900"><X size={32} /></button>
              <div className="max-w-xl w-full text-center space-y-12">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Boundary Check {currentBq + 1} of {boundaryQuestions.length}</span>
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">{boundaryQuestions[currentBq].question}</h3>
                </div>
                <div className="grid grid-cols-1 gap-4 w-full">
                  {boundaryQuestions[currentBq].options.map((choice) => (
                    <button key={choice} onClick={() => handleBAnswer(choice)} className="p-6 bg-white rounded-3xl border-2 border-slate-100 hover:border-blue-500 hover:shadow-lg transition-all font-bold text-slate-700 text-left flex items-center justify-between group">
                      {choice} <ChevronRight size={18} className="text-slate-200 group-hover:text-blue-500" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="p-10 rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #10B981, #064E3B)' }}>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-200 opacity-80">Safety First</p>
              <h4 className="text-2xl font-bold tracking-tight">Support Available</h4>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl border border-white/10 relative z-10">
              <div className="p-3 bg-white/20 rounded-xl"><Phone size={20} /></div>
              <div>
                <p className="text-xs font-bold">{HELPLINES.india.number}</p>
                <p className="text-[9px] uppercase tracking-widest text-emerald-100 opacity-70">Verified Helpline</p>
              </div>
            </div>
            <div className="absolute top-[-20%] right-[-20%] opacity-10 pointer-events-none scale-[1.5]"><ShieldCheck size={200} /></div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900">{t.mental.ritualTitle}</h4>
            <div className="space-y-4">
              {STABILIZATION_TASKS.map((task, i) => (
                <button key={i} onClick={() => toggleRitual(i)} className="w-full flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 items-center text-left hover:bg-slate-100 transition-colors group active:scale-[0.98]">
                  <div className={`p-2.5 rounded-xl shadow-sm border transition-all ${checkedRituals[i] ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-50 text-slate-100'}`}>
                    {checkedRituals[i] ? <CheckSquare size={16} /> : <div className="w-4 h-4" />}
                  </div>
                  <p className={`text-xs font-bold leading-tight transition-all ${checkedRituals[i] ? 'text-slate-400 line-through italic' : 'text-slate-700'}`}>"{task}"</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MentalAction = ({ icon, title, subtitle, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center p-10 bg-white/50 backdrop-blur-xl border border-white/40 rounded-[3rem] hover:border-white shadow-sm hover:shadow-2xl transition-all duration-500 text-center group active:scale-[0.98]">
    <div className="p-6 bg-slate-50 rounded-[1.75rem] mb-6 group-hover:bg-white group-hover:scale-110 transition-all shadow-inner border border-transparent group-hover:border-slate-100">
      {React.cloneElement(icon, { size: 32, strokeWidth: 2.5 })}
    </div>
    <span className="font-bold text-slate-900 text-xl mb-1.5 tracking-tight leading-none">{title}</span>
    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{subtitle}</span>
  </button>
);

export default MentalWellness;

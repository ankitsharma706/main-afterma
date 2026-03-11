
import {
    Calendar,
    CheckCircle2,
    Heart,
    History,
    PenTool,
    RefreshCw,
    Send, ShieldCheck,
    Sparkles,
    Trash2,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { COLORS } from '../constants';

const JOURNAL_PROMPTS = [
  "How did your day go today? Take a moment to reflect on your feelings.",
  "What is one small thing that brought you a moment of peace today?",
  "How did you show kindness to yourself in the last 24 hours?",
  "Describe a sensation in your body that feels grounded or calm.",
  "What are you most looking forward to in your healing journey?",
  "If your heart could speak today, what would it say in one sentence?",
  "Who is someone you felt supported by recently, and how did it feel?",
  "What is a strength you've discovered in yourself since becoming a mother?"
];

const Journal = ({ profile, setProfile, onClose }) => {
  const [view, setView] = useState('write');
  const [promptIndex, setPromptIndex] = useState(0);
  const [entry, setEntry] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [response, setResponse] = useState("");

  const theme = COLORS[profile.accent] || COLORS.PINK;

  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
        setView('history');
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showSuccess]);

  const handleNextPrompt = () => {
    setPromptIndex((prev) => (prev + 1) % JOURNAL_PROMPTS.length);
    setEntry("");
  };

  const handleSubmit = async () => {
    if (!entry.trim()) return;

    const newEntry = {
      id: Date.now().toString(),
      prompt: JOURNAL_PROMPTS[promptIndex],
      content: entry,
      timestamp: Date.now()
    };

    try {
      await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: profile._id,
          journal_text: entry,
          mood: 'reflective',
          timestamp: new Date()
        })
      });
    } catch (e) {
      console.error(e);
    }

    setProfile(prev => ({
      ...prev,
      journalEntries: [newEntry, ...(prev.journalEntries || [])]
    }));

    if (entry.toLowerCase() === 'nothing') {
      setResponse("It's perfectly okay to have moments where words don't come. Your presence here is enough. Take a deep breath—we're here whenever you're ready.");
    } else {
      setResponse("Thank you for sharing that piece of your heart. Every word you write is a step toward deeper healing. You are heard, you are seen, and you are doing so well.");
    }
    const journalQuotes = [
      "Your vulnerability is your strength. Each entry is a milestone in your growth.",
      "Writing your truth is a powerful medicine. Well done on taking this time for yourself.",
      "The seeds of healing are found in your reflections. Your heart is in safe hands.",
      "Expressing your inner world creates clarity for your outer world."
    ];
    window._lastSuccessQuote = journalQuotes[Math.floor(Math.random() * journalQuotes.length)];
    setShowSuccess(true);
  };

  const deleteEntry = (id) => {
    setProfile(prev => ({
      ...prev,
      journalEntries: (prev.journalEntries || []).filter(e => e.id !== id)
    }));
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
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100 mb-2">
                <CheckCircle2 size={14} /> Reflection Saved
              </div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Your Soul's <span style={{ color: theme.primary }}>Reflection!</span>
              </h3>
            </div>

            <div className="relative p-7 bg-slate-50/80 rounded-[2.5rem] border border-slate-100 max-w-sm mx-auto">
              <p className="text-sm font-bold text-slate-500 italic leading-relaxed">
                "{window._lastSuccessQuote || "Your private thoughts are safely held in this compassionate space."}"
              </p>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-white border border-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Safe Space Insight
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => { setShowSuccess(false); setView('history'); }}
                className="w-full max-w-xs py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all outline-none"
              >
                View History
              </button>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest animate-pulse">Returning in 5 seconds...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[150] bg-white/95 backdrop-blur-2xl flex flex-col animate-in slide-in-from-bottom duration-700">
      <div className="h-20 border-b border-slate-100 flex items-center justify-between px-8 lg:px-12 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><PenTool size={20} /></div>
          <div>
            <h3 className="font-bold text-slate-900 leading-none">Guided Reflection</h3>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">Private & Safe Space</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(view === 'write' ? 'history' : 'write')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${view === 'history' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-900'}`}
          >
            {view === 'write' ? <><History size={16} /> History</> : <><PenTool size={16} /> Write</>}
          </button>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><X size={24} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 lg:p-20 flex flex-col items-center">
        {view === 'write' ? (
          <div className="max-w-2xl w-full space-y-12 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center space-y-6">
              <div className="inline-flex p-4 bg-indigo-50 rounded-3xl text-indigo-500 mb-4">
                <Sparkles size={32} />
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {JOURNAL_PROMPTS[promptIndex]}
              </h2>
              <p className="text-slate-400 font-medium italic text-lg">
                Take your time. There are no wrong answers here.
              </p>
            </div>

            <div className="relative group">
              <textarea 
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder="Start typing your heart out..."
                className="w-full h-64 p-10 bg-slate-50 border border-slate-100 rounded-[3rem] font-medium text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all shadow-inner text-lg resize-none"
              />
              <div className="absolute bottom-6 right-6 flex gap-3">
                <button 
                  onClick={handleNextPrompt}
                  className="p-4 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:text-slate-900 hover:border-slate-200 transition-all shadow-sm"
                  title="Change Prompt"
                >
                  <RefreshCw size={20} />
                </button>
                <button 
                  onClick={handleSubmit}
                  className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                >
                  Save Reflection <Send size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2"><ShieldCheck size={14} /> End-to-End Private</div>
              <div className="flex items-center gap-2"><Heart size={14} /> Compassionate Space</div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl w-full space-y-10 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Your Reflections</h2>
              <p className="text-slate-400 font-medium italic">A timeline of your healing and growth.</p>
            </div>

            {(!profile.journalEntries || profile.journalEntries.length === 0) ? (
              <div className="text-center py-20 space-y-6">
                <div className="text-6xl opacity-20">🍃</div>
                <p className="text-slate-400 font-medium italic">Your history is a blank canvas. Start writing to fill it with light.</p>
                <button onClick={() => setView('write')} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest">Start Writing</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {profile.journalEntries.map((entry) => (
                  <div key={entry.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-6 group">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                          <Calendar size={12} />
                          {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 leading-tight">{entry.prompt}</h4>
                      </div>
                      <button 
                        onClick={() => deleteEntry(entry.id)}
                        className="p-2 text-slate-200 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-slate-600 leading-relaxed italic whitespace-pre-wrap">"{entry.content}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;

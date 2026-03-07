import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Play,
  Sparkles,
  X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import WordWellnessChallenge from '../components/games/WordWellnessChallenge';
import { COLORS, RECOVERY_DATABASE } from '../constants';

/* ── Timer ring constants ─────────────────────────── */
const R = 57;
const CIRC = 2 * Math.PI * R;

/* ══════════════════════════════════════════════════
   JourneySessionPage
   Route: /care-journey/session/:activityId
══════════════════════════════════════════════════ */
const JourneySessionPage = ({
  profile,
  activities,
  onToggleActivity,
  setExerciseLogs,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract activityId from pathname → /care-journey/session/<id>
  const activityId = location.pathname.replace(/^\/care-journey\/session\/?/, '') || null;

  // Find activity: first from passed activities prop, then from full DB
  const allActivities = activities?.length ? activities : RECOVERY_DATABASE;
  const activity = allActivities.find(a => a.id === activityId) || null;

  const theme = COLORS[profile?.accent] || COLORS.PINK;

  /* ── Session state ─────────────────────────────── */
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionSettings, setSessionSettings] = useState({ intensity: 'Light', environment: 'Alone' });
  const [sessionDuration, setSessionDuration] = useState(10);
  const [completed, setCompleted] = useState(false);
  const timerRef = useRef(null);

  /* ── Auto-start timer when page loads ─────────────────────────────── */
  useEffect(() => {
    setIsTimerRunning(true);
  }, []);

  /* ── Timer tick ─────────────────────────────────── */
  useEffect(() => {
    if (!isTimerRunning) {
      clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  /* ── Cleanup on unmount ───────────────────────────── */
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  /* ── Handlers ─────────────────────────────────────── */
  const handleComplete = () => {
    if (!activity) return;
    clearInterval(timerRef.current);
    setIsTimerRunning(false);
    setCompleted(true);

    const newLog = {
      id: Date.now().toString(),
      activityId: activity.id,
      duration: Math.floor(timer / 60),
      intensity: sessionSettings.intensity,
      environment: sessionSettings.environment,
      timestamp: Date.now(),
      completed: true,
    };

    if (typeof setExerciseLogs === 'function') {
      setExerciseLogs(prev => [...prev, newLog]);
    }
    if (typeof onToggleActivity === 'function') {
      onToggleActivity(activity.id);
    }

    // Redirect back after short success delay
    setTimeout(() => navigate('/carejourney'), 1800);
  };

  const handleCancel = () => {
    clearInterval(timerRef.current);
    navigate('/carejourney');
  };

  const timerProgress = Math.min(timer / (sessionDuration * 60), 1);

  /* ── 404 state ─────────────────────────────────────── */
  if (!activity) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-6 animate-in fade-in duration-500">
        <div className="text-6xl">🏃‍♀️</div>
        <h1 className="text-3xl font-black text-slate-900">Session Not Found</h1>
        <p className="text-slate-500 font-medium">
          We couldn't find the activity <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">{activityId}</code>.
          It may have been removed or doesn't match your current phase.
        </p>
        <button
          onClick={() => navigate('/carejourney')}
          className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm hover:opacity-90 transition-all shadow-md"
        >
          ← Back to Care Journey
        </button>
      </div>
    );
  }

/* ── Success overlay ────────────────────────── */
if (completed) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">

        <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-[#00d084] flex items-center justify-center mx-auto shadow-[0_0_60px_rgba(0,208,132,0.35)]">
          <CheckCircle2 size={48} className="text-[#00d084]" />
        </div>

        <h2 className="text-3xl font-black text-slate-900">
          Session Complete! 🌸
        </h2>

        <p className="text-slate-600 font-medium">
          You completed <span className="text-slate-900 font-bold">{activity.title}</span> in{' '}
          {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
        </p>

        <p className="text-slate-400 text-sm">
          Returning to Care Journey…
        </p>

      </div>
    </div>
  );
}

  /* ══════════════════════════════════════════════════
     Main Session Page Layout
  ══════════════════════════════════════════════════ */
  return (
    <div
      className="min-h-[calc(100vh-5rem)] animate-in fade-in duration-400 font-sans"
      style={{ backgroundColor: theme.bg }}
    >
      {/* ── Top Bar ───────────────────────────────── */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 border-b border-black/5 bg-white/60 backdrop-blur-xl">
        <button
          id="session-back-btn"
          onClick={handleCancel}
          aria-label="Back to Care Journey"
          className="flex items-center gap-2 px-4 py-2 bg-black/5 hover:bg-black/10 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-widest transition-all group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Care Journey
        </button>

        <div className="flex items-center gap-3">
          <span 
            className="px-3 py-1 rounded-full font-black text-[9px] uppercase tracking-widest border animate-pulse"
            style={{ backgroundColor: `${theme.primary}20`, color: theme.primary, borderColor: `${theme.primary}40` }}
          >
            Active Session
          </span>
          {/* Live timer in header */}
          <span className="text-slate-600 font-mono text-sm font-bold tabular-nums">
            {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
          </span>
        </div>

        <button
          id="session-close-btn"
          onClick={handleCancel}
          aria-label="Close session"
          className="p-2 bg-black/5 hover:bg-red-500/10 hover:text-red-500 text-slate-400 rounded-xl transition-all"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Page Body: two columns on desktop ──────── */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4.5rem-1px)]">

        {/* ════════════ LEFT PANE ════════════ */}
        <div className="flex-1 flex flex-col items-center gap-6 px-4 md:px-8 py-8 overflow-y-auto">

          {/* Session Title + Description */}
          <div className="text-center space-y-2 max-w-lg w-full">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-800 tracking-tight leading-tight">
              {activity.title}
            </h1>
            <p className="text-slate-600 italic text-sm font-medium leading-relaxed">
              "{activity.description}"
            </p>
            <div className="flex items-center justify-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest pt-1">
              <span>{activity.duration} Min</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>{activity.category}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>{activity.phase}</span>
            </div>
          </div>

          {/* Word Wellness Challenge Game */}
          <div className="w-full max-w-md">
            <WordWellnessChallenge />
          </div>

          {/* ── Circular Timer Ring ─────────────── */}
          <div className="relative flex-shrink-0 mt-4" style={{ width: 140, height: 140 }}>
            <svg
              width="140" height="140"
              viewBox="0 0 130 130"
              className="absolute inset-[5px]"
              style={{ transform: 'rotate(-90deg)' }}
            >
              <circle cx="65" cy="65" r={R} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="8" />
              <circle
                cx="65" cy="65" r={R}
                fill="none"
                stroke={theme.primary}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC * (1 - timerProgress)}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            {/* Water fill */}
            <div className="absolute inset-[5px] rounded-full overflow-hidden">
              <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-1000"
                style={{ height: `${timerProgress * 100}%`, backgroundColor: `${theme.primary}1A` }}
              />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-black text-slate-800 tabular-nums tracking-tighter drop-shadow-sm">
                {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
              </p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                / {sessionDuration}m
              </p>
            </div>
          </div>

          {/* ── Session Controls ─────────────────── */}
          <div className="flex items-center gap-3 w-full max-w-xs mt-2">
            <button
              id="btn-start-session"
              onClick={() => setIsTimerRunning(r => !r)}
              aria-label={isTimerRunning ? 'Pause timer' : 'Start timer'}
              className="h-14 w-14 bg-white text-slate-900 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:scale-105 active:scale-95 transition-all"
            >
              {isTimerRunning ? <Lock size={20} /> : <Play size={20} className="ml-0.5" />}
            </button>

            <button
              id="btn-complete-session"
              onClick={handleComplete}
              style={{ backgroundColor: theme.primary }}
              className="flex-1 h-14 text-white rounded-full font-black text-sm tracking-wide shadow-[0_8px_30px_rgba(0,0,0,0.12)] active:scale-[0.98] transition-all hover:brightness-110"
            >
              Complete Session
            </button>
          </div>

          <button
            id="btn-cancel-session"
            onClick={handleCancel}
            className="text-[9px] font-bold text-slate-600 hover:text-white uppercase tracking-widest transition-colors pb-4"
          >
            Cancel Session
          </button>
        </div>

        {/* ════════════ RIGHT PANE ════════════ */}
        <div className="lg:w-[360px] xl:w-[400px] flex-shrink-0 bg-white border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.02)] relative z-10">

          {/* Right Pane Header */}
          <div className="flex-shrink-0 px-6 lg:px-8 pt-6 pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Session Settings</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Customize your recovery rhythm.</p>
          </div>

          {/* Right Pane Body — scrollable */}
          <div className="flex-1 overflow-y-auto px-6 lg:px-8 py-5 space-y-6">

            {/* ── Intensity Selector ─────────────── */}
            <div className="space-y-3">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Intensity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Light', 'Moderate', 'Strong'].map(level => (
                  <button
                    key={level}
                    id={`intensity-${level.toLowerCase()}`}
                    onClick={() => setSessionSettings(prev => ({ ...prev, intensity: level }))}
                    style={
                      sessionSettings.intensity === level
                        ? { backgroundColor: theme.primary, color: 'white', borderColor: theme.primary }
                        : {}
                    }
                    className={`py-2.5 rounded-xl font-bold text-[9px] uppercase tracking-wider transition-all border ${
                      sessionSettings.intensity === level
                        ? 'shadow-lg shadow-black/5'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-800'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Duration Slider ─────────────────── */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  Duration
                </label>
                <span className="text-xs font-bold text-slate-800">{sessionDuration} min</span>
              </div>
              <input
                type="range"
                aria-label="Session duration"
                style={{ accentColor: theme.primary }}
                className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer"
                value={sessionDuration} min="5" max="30" step="5"
                onChange={e => { setSessionDuration(parseInt(e.target.value, 10)); setTimer(0); }}
              />
              <div className="flex justify-between text-[8px] font-bold text-slate-400 px-0.5">
                <span>5m</span><span>10m</span><span>15m</span><span>20m</span><span>25m</span><span>30m</span>
              </div>
            </div>

            {/* ── Environment Selector ─────────────── */}
            <div className="space-y-3 border-t border-slate-100 pt-5">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Support Environment
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Alone', 'With Partner', 'With Friend', 'With Family', 'With Support Worker', 'In a Group'].map(env => (
                  <button
                    key={env}
                    id={`env-${env.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => setSessionSettings(prev => ({ ...prev, environment: env }))}
                    style={
                      sessionSettings.environment === env
                        ? { backgroundColor: `${theme.primary}1A`, color: theme.primary, borderColor: theme.primary }
                        : {}
                    }
                    className={`py-2.5 px-2 rounded-xl font-bold text-[8px] uppercase tracking-wide transition-all border truncate ${
                      sessionSettings.environment === env
                        ? ''
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-800'
                    }`}
                  >
                    {env}
                  </button>
                ))}
              </div>
            </div>

            {/* ── AI Recommendation Box ────────────── */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-200/20 to-transparent rounded-bl-full" />
              <div className="flex items-center gap-2 text-amber-600 font-black text-[9px] uppercase tracking-widest relative">
                <Sparkles size={12} className="text-amber-500" /> AI Recommendation
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed relative">
                Based on your environment ({sessionSettings.environment}), a{' '}
                <span className="text-slate-900 font-bold">{sessionSettings.intensity} intensity</span>{' '}
                is recommended for this session.
              </p>
              <p className="text-[9px] text-slate-500 italic leading-relaxed relative opacity-80 mt-1">
                Listen to your body's whispers before they become shouts. Stay aware of your breath.
              </p>
            </div>

            {/* ── Activity Detail Panel ─────────────── */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Activity Details</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                  <p className="text-sm font-black text-slate-800">{activity.duration} min</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Frequency</p>
                  <p className="text-sm font-black text-slate-800">{activity.frequency}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Points</p>
                  <p className="text-sm font-black text-amber-500">+{activity.points} pts</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Intensity</p>
                  <p className="text-sm font-black text-slate-800">{activity.intensityScale}/10</p>
                </div>
              </div>
            </div>

            {/* ── Disclaimer ───────────────────────── */}
            <div className="pt-2 border-t border-slate-100 pb-6">
              <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed text-center">
                DISCLAIMER: ALL SUGGESTIONS ARE GUIDANCE ONLY AND NOT MEDICAL ADVICE.
                CONSULT YOUR OB-GYN FOR CLINICAL CLEARANCE BEFORE BEGINNING ANY EXERCISE PROGRAM.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default JourneySessionPage;

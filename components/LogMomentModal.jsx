
import { Activity, Award, CheckCircle2, Droplet, Flame, Loader2, Moon, Pill, ShieldCheck, Smile, Sparkles, Star, X, Zap } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { COLORS } from '../constants';
import { logsAPI, mapLogToBackend } from '../services/api';

/* ─── Wellness Score Calculator ─────────────────────────────────── */
const calcWellnessScore = ({ moodLevel, painLevel, energyLevel, sleepHours, waterIntake }) => {
  const moodScore    = (moodLevel / 10) * 25;
  const painScore    = ((10 - painLevel) / 10) * 20;
  const energyScore  = (energyLevel / 10) * 25;
  const sleepScore   = Math.min(sleepHours / 8, 1) * 20;
  const waterScore   = Math.min(waterIntake / 8, 1) * 10;
  return Math.round(moodScore + painScore + energyScore + sleepScore + waterScore);
};

const getWellnessLabel = (score) => {
  if (score < 30) return { label: 'Needs Care',  emoji: '🌱', color: '#f59e0b', bg: '#fffbeb' };
  if (score < 60) return { label: 'Balanced',    emoji: '🌿', color: '#10b981', bg: '#f0fdf4' };
  return            { label: 'Thriving',         emoji: '🌸', color: '#EC4899', bg: '#FFF5F7' };
};

const getMoodLabel = (v) => {
  if (v <= 2) return 'BAD';
  if (v <= 5) return 'NICE';
  if (v <= 7) return 'BALANCED';
  return 'GOOD';
};

/* ─── Progress Ring ──────────────────────────────────────────────── */
const ProgressRing = ({ score, size = 72, stroke = 7 }) => {
  const r   = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const pct  = Math.max(0, Math.min(score, 100)) / 100;
  const dash = circ * pct;
  const well = getWellnessLabel(score);
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={well.color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }}
      />
    </svg>
  );
};

/* ─── Animated Slider ────────────────────────────────────────────── */
const SliderCard = ({ label, icon, value, min, max, onChange, leftLabel, rightLabel, accentColor, extraLabel }) => {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div
      className="p-5 rounded-2xl border border-slate-100 bg-white group"
      style={{
        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 24px 0 ${accentColor}22`; e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px 0 rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'none'; }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl" style={{ background: `${accentColor}15`, color: accentColor }}>{icon}</div>
          <div>
            <span className="text-sm font-bold text-slate-800">{label}</span>
            {extraLabel && <span className="ml-2 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full" style={{ background: `${accentColor}18`, color: accentColor }}>{extraLabel}</span>}
          </div>
        </div>
        <span className="text-2xl font-black tabular-nums" style={{ color: accentColor }}>{value}</span>
      </div>

      {/* Custom slider track with fill */}
      <div className="relative mb-3">
        <div className="h-1.5 rounded-full bg-slate-100 relative overflow-visible">
          <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-200" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${accentColor}88, ${accentColor})` }} />
        </div>
        <input
          type="range" min={min} max={max} value={value}
          onChange={e => onChange(parseInt(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-1.5"
          style={{ margin: 0 }}
        />
        {/* Thumb indicator */}
        <div
          className="absolute top-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md -translate-y-1/2 pointer-events-none transition-all duration-200"
          style={{ left: `calc(${pct}% - 10px)`, background: accentColor, boxShadow: `0 2px 8px ${accentColor}66` }}
        />
      </div>

      <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-widest px-1">
        <span>{leftLabel}</span><span>{rightLabel}</span>
      </div>
    </div>
  );
};

/* ─── Number Stepper ─────────────────────────────────────────────── */
const StepperCard = ({ label, unit, value, onChange, icon, min = 0, max = 24, accentColor }) => (
  <div className="p-4 rounded-2xl border border-slate-100 bg-white" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
    <div className="flex items-center gap-2 mb-3 text-slate-400">
      <div style={{ color: accentColor }}>{icon}</div>
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <div className="flex items-center justify-between gap-2">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 text-slate-300 hover:text-slate-700 hover:border-slate-200 font-bold text-lg transition-all active:scale-90 flex items-center justify-center"
      >–</button>
      <div className="flex flex-col items-center min-w-[40px]">
        <span className="text-2xl font-black text-slate-900 tabular-nums leading-none">{value}</span>
        <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">{unit}</span>
      </div>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-8 h-8 rounded-xl border font-bold text-lg transition-all active:scale-90 flex items-center justify-center text-white"
        style={{ background: accentColor, borderColor: accentColor, boxShadow: `0 2px 8px ${accentColor}44` }}
      >+</button>
    </div>
  </div>
);

/* ─── Toggle Switch ──────────────────────────────────────────────── */
const ToggleSwitch = ({ checked, onChange, accentColor }) => (
  <button
    onClick={() => onChange(!checked)}
    className="relative flex-shrink-0 transition-all active:scale-95"
    style={{ width: 44, height: 24 }}
  >
    <div className="absolute inset-0 rounded-full transition-all duration-300" style={{ background: checked ? accentColor : '#e2e8f0' }} />
    <div
      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300"
      style={{ left: checked ? 24 : 4, boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
    />
  </button>
);

/* ─── Wellness Badge Overlay ─────────────────────────────────────── */
const WellnessBadge = ({ score, streak, onClose }) => {
  const well = getWellnessLabel(score);
  const xp = Math.round(score * 1.5) + (streak > 0 ? 20 : 0);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative overflow-hidden"
        style={{ boxShadow: `0 32px 64px ${well.color}33`, animation: 'badgeReveal 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Confetti dots */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 6 + (i % 3) * 4, height: 6 + (i % 3) * 4,
              background: [well.color, '#a78bfa', '#34d399', '#fbbf24'][i % 4],
              top: `${10 + (i * 31) % 80}%`, left: `${(i * 37) % 90}%`,
              opacity: 0.4,
              animation: `confettiFloat ${1.5 + (i % 3) * 0.5}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.12}s`
            }}
          />
        ))}

        <div className="relative z-10">
          <div className="flex justify-center mb-4">
            <div className="relative inline-flex items-center justify-center">
              <ProgressRing score={score} size={96} stroke={9} />
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-black tabular-nums" style={{ color: well.color }}>{score}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">/ 100</span>
              </div>
            </div>
          </div>

          <div className="text-4xl mb-3" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}>{well.emoji}</div>
          <h3 className="text-2xl font-black text-slate-900 mb-1">You're {well.label}</h3>
          <p className="text-sm text-slate-400 mb-6 font-medium">Your moment has been logged with care.</p>

          {/* XP Reward */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl border" style={{ background: `${well.color}10`, borderColor: `${well.color}30` }}>
              <Star size={14} style={{ color: well.color }} fill={well.color} />
              <span className="font-black text-sm" style={{ color: well.color }}>+{xp} XP earned</span>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-orange-50 border border-orange-100">
                <Flame size={14} className="text-orange-500" />
                <span className="font-black text-sm text-orange-600">{streak} day streak</span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl font-bold text-sm text-white transition-all active:scale-95"
            style={{ background: `linear-gradient(135deg, ${well.color}, ${well.color}cc)`, boxShadow: `0 8px 24px ${well.color}44` }}
          >
            View My Dashboard
          </button>
        </div>
      </div>

      <style>{`
        @keyframes badgeReveal {
          from { opacity:0; transform: scale(0.7) translateY(30px); }
          to   { opacity:1; transform: scale(1) translateY(0); }
        }
        @keyframes confettiFloat {
          from { transform: translateY(0) rotate(0deg); }
          to   { transform: translateY(-12px) rotate(20deg); }
        }
      `}</style>
    </div>
  );
};

/* ─── Main Modal ─────────────────────────────────────────────────── */
const LogMomentModal = ({ profile, onClose, onSave }) => {
  const theme = COLORS[profile?.accent] || COLORS.PINK;
  const accent = theme.primary; // e.g. #EC4899

  const [log, setLog] = useState({
    moodLevel: 5, painLevel: 2, energyLevel: 5,
    sleepHours: 6, waterIntake: 5,
    medicationsTaken: false,
    periodFlow: 'None',
    isOvulating: false,
    crampsLevel: 0,
    symptoms: [],
    notes: ''
  });

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showBadge, setShowBadge] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Wellness score (live)
  const wellnessScore = calcWellnessScore({
    moodLevel: log.moodLevel, painLevel: log.painLevel,
    energyLevel: log.energyLevel, sleepHours: log.sleepHours,
    waterIntake: log.waterIntake
  });
  const well = getWellnessLabel(wellnessScore);

  // Symptoms list based on stage
  const symptomsList = profile?.maternityStage === 'Postpartum'
    ? ['Lochia', 'Breast Pain', 'Pelvic Pressure', 'Fatigue', 'Headache']
    : profile?.maternityStage === 'TTC'
      ? ['Cramps', 'Bloating', 'Breast Tenderness', 'Acne', 'Mood Swings']
      : ['Nausea', 'Backache', 'Swelling', 'Insomnia', 'Dizziness'];

  // Fade-in modal
  useEffect(() => {
    requestAnimationFrame(() => setModalVisible(true));
  }, []);

  const toggleSymptom = useCallback((s) => {
    setLog(prev => {
      const curr = prev.symptoms || [];
      const next = curr.includes(s) ? curr.filter(x => x !== s) : [...curr, s];
      return { ...prev, symptoms: next };
    });
  }, []);

  const handleSave = async () => {
    const finalLog = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      moodLevel: log.moodLevel,
      painLevel: log.painLevel,
      energyLevel: log.energyLevel,
      sleepHours: log.sleepHours,
      waterIntake: log.waterIntake,
      medicationsTaken: !!log.medicationsTaken,
      kegelCount: 0,
      symptoms: log.symptoms || [],
      isSensitive: profile?.incognito,
      periodFlow: log.periodFlow || 'None',
      isOvulating: !!log.isOvulating,
      crampsLevel: log.crampsLevel || 0,
      notes: log.notes || '',
      wellnessScore,
    };

    setSaving(true);
    setSaveError('');
    try {
      const backendPayload = mapLogToBackend({ ...finalLog, isSensitive: profile?.incognito });
      await logsAPI.create(backendPayload);
    } catch (err) {
      if (err?.status === 409) {
        try {
          const todayStr = new Date().toISOString().split('T')[0];
          const existingLogsResp = await logsAPI.getAll();
          const logsArr = existingLogsResp?.data?.logs || existingLogsResp?.logs || [];
          const todayLog = logsArr.find(l => l.log_date?.startsWith(todayStr));
          if (todayLog?._id) {
            await logsAPI.update(todayLog._id, mapLogToBackend({ ...finalLog, isSensitive: profile?.incognito }));
            setSaving(false);
            setShowBadge(true);
            onSave?.(finalLog);
            return;
          }
        } catch {}
      }
      console.warn('⚠️ Log saved locally only:', err?.message);
      setSaveError('Saved offline. Will sync when connected.');
    } finally {
      setSaving(false);
    }
    setShowBadge(true);
    onSave?.(finalLog);
  };

  const handleBadgeClose = () => {
    setShowBadge(false);
    onClose();
  };

  /* ── FLOW OPTIONS ── */
  const flowOptions = ['None', 'Spotting', 'Light', 'Medium', 'Heavy'];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[150] flex items-center justify-center p-3 lg:p-8"
        style={{
          background: 'rgba(15,23,42,0.55)',
          backdropFilter: 'blur(10px)',
          opacity: modalVisible ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
      >
        {/* Modal card */}
        <div
          className="max-w-4xl w-full bg-white flex flex-col overflow-hidden"
          style={{
            borderRadius: 32,
            maxHeight: '92vh',
            boxShadow: '0 40px 80px rgba(15,23,42,0.22), 0 0 0 1px rgba(255,255,255,0.6)',
            transform: modalVisible ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(24px)',
            transition: 'transform 0.4s cubic-bezier(0.34,1.2,0.64,1), opacity 0.35s ease',
            opacity: modalVisible ? 1 : 0,
          }}
        >
          {/* ── Header ── */}
          <div className="px-7 pt-7 pb-5 flex items-start justify-between border-b border-slate-50 bg-white flex-shrink-0">
            <div className="flex items-start gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Log Your Moment</h2>
                <p className="text-xs text-slate-400 font-medium italic mt-1">Capturing your recovery pulse with clinical precision.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Live wellness score pill */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl transition-all duration-500"
                style={{ background: well.bg, border: `1.5px solid ${well.color}30` }}
              >
                <ProgressRing score={wellnessScore} size={24} stroke={3} />
                <span className="text-xs font-black" style={{ color: well.color }}>{wellnessScore}</span>
                <span className="text-[10px] font-bold text-slate-400 hidden sm:block">{well.label}</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-300 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-all active:scale-90"
              >
                <X size={22} />
              </button>
            </div>
          </div>

          {/* ── Streak indicator ── */}
          {profile?.streakCount > 0 && (
            <div className="px-7 py-2.5 flex items-center gap-2 bg-orange-50 border-b border-orange-100">
              <Flame size={14} className="text-orange-500" />
              <span className="text-xs font-bold text-orange-700">{profile.streakCount} day streak — keep going!</span>
              <Award size={14} className="text-orange-400 ml-auto" />
            </div>
          )}

          {/* ── Scrollable Body ── */}
          <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* ════ LEFT PANEL — MOOD ════ */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Emotional State</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>

                <SliderCard
                  label="Mood Balance"
                  icon={<Smile size={16} />}
                  value={log.moodLevel}
                  min={0} max={10}
                  onChange={v => setLog(p => ({ ...p, moodLevel: v }))}
                  leftLabel="Low"
                  rightLabel="Radiant"
                  extraLabel={getMoodLabel(log.moodLevel)}
                  accentColor={accent}
                />

                <SliderCard
                  label="Pain Intensity"
                  icon={<Activity size={16} />}
                  value={log.painLevel}
                  min={0} max={10}
                  onChange={v => setLog(p => ({ ...p, painLevel: v }))}
                  leftLabel="None"
                  rightLabel="Severe"
                  accentColor={log.painLevel > 6 ? '#ef4444' : log.painLevel > 3 ? '#f97316' : accent}
                />

                <SliderCard
                  label="Energy Vitality"
                  icon={<Zap size={16} />}
                  value={log.energyLevel}
                  min={0} max={10}
                  onChange={v => setLog(p => ({ ...p, energyLevel: v }))}
                  leftLabel="Drained"
                  rightLabel="Vibrant"
                  accentColor={log.energyLevel > 6 ? '#10b981' : accent}
                />

                {/* Live wellness score bar */}
                <div className="p-4 rounded-2xl border border-slate-100" style={{ background: well.bg }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: well.color }}>Daily Wellness Score</span>
                    <span className="text-lg font-black" style={{ color: well.color }}>{wellnessScore}<span className="text-xs font-bold text-slate-300">/100</span></span>
                  </div>
                  <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${wellnessScore}%`, background: `linear-gradient(90deg, ${well.color}88, ${well.color})` }}
                    />
                  </div>
                  <p className="text-[10px] font-bold mt-1.5" style={{ color: well.color }}>{well.emoji} {well.label}</p>
                </div>
              </div>

              {/* ════ RIGHT PANEL — HEALTH LOG ════ */}
              <div className="space-y-4">

                {/* Sleep + Water steppers */}
                <div className="grid grid-cols-2 gap-3">
                  <StepperCard
                    label="Sleep" unit="hrs" value={log.sleepHours} min={0} max={24}
                    onChange={v => setLog(p => ({ ...p, sleepHours: v }))}
                    icon={<Moon size={14} />}
                    accentColor={accent}
                  />
                  <StepperCard
                    label="Water" unit="cups" value={log.waterIntake} min={0} max={20}
                    onChange={v => setLog(p => ({ ...p, waterIntake: v }))}
                    icon={<Droplet size={14} />}
                    accentColor="#3b82f6"
                  />
                </div>

                {/* Daily Vitals — Medication */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Vitals</span>
                  <button
                    onClick={() => setLog(p => ({ ...p, medicationsTaken: !p.medicationsTaken }))}
                    className="w-full flex items-center justify-between p-4 rounded-2xl border transition-all active:scale-[0.98]"
                    style={log.medicationsTaken
                      ? { background: '#f0fdf4', borderColor: '#a7f3d0', color: '#065f46' }
                      : { background: '#f8fafc', borderColor: '#f1f5f9', color: '#94a3b8' }}
                  >
                    <div className="flex items-center gap-3">
                      <Pill size={16} />
                      <span className="text-xs font-bold">Medications / Supplements</span>
                    </div>
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                      style={log.medicationsTaken
                        ? { background: '#10b981', borderColor: '#10b981', color: 'white' }
                        : { borderColor: '#cbd5e1' }}
                    >
                      {log.medicationsTaken && <CheckCircle2 size={12} />}
                    </div>
                  </button>
                </div>

                {/* Period & Cycle Log */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Period &amp; Cycle Log</span>

                  {/* Flow Intensity */}
                  <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Flow Intensity</span>
                      <Droplet size={13} className="text-rose-400" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {flowOptions.map(f => (
                        <button
                          key={f}
                          onClick={() => setLog(p => ({ ...p, periodFlow: f }))}
                          className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all active:scale-95"
                          style={log.periodFlow === f
                            ? { background: accent, borderColor: accent, color: 'white', boxShadow: `0 4px 12px ${accent}44` }
                            : { background: 'white', borderColor: '#f1f5f9', color: '#94a3b8' }}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ovulation Window */}
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-amber-400" />
                      <span className="text-xs font-bold text-slate-700">Ovulation Window</span>
                    </div>
                    <ToggleSwitch
                      checked={log.isOvulating}
                      onChange={v => setLog(p => ({ ...p, isOvulating: v }))}
                      accentColor="#f59e0b"
                    />
                  </div>

                  {/* Cramps Severity */}
                  <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Cramps Severity</span>
                      <span className="text-xl font-black text-rose-500 tabular-nums">{log.crampsLevel}</span>
                    </div>
                    <div className="relative">
                      <div className="h-1.5 rounded-full bg-slate-200 relative overflow-visible">
                        <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-200" style={{ width: `${log.crampsLevel * 10}%`, background: log.crampsLevel > 6 ? 'linear-gradient(90deg, #fb7185, #ef4444)' : 'linear-gradient(90deg, #fda4af, #f43f5e)' }} />
                      </div>
                      <input type="range" min="0" max="10" value={log.crampsLevel}
                        onChange={e => setLog(p => ({ ...p, crampsLevel: parseInt(e.target.value) }))}
                        className="absolute inset-0 w-full opacity-0 cursor-pointer h-1.5" style={{ margin: 0 }}
                      />
                      <div
                        className="absolute top-1/2 w-4 h-4 rounded-full bg-white border-2 border-rose-400 shadow-md -translate-y-1/2 pointer-events-none transition-all"
                        style={{ left: `calc(${log.crampsLevel * 10}% - 8px)`, boxShadow: '0 2px 8px rgba(244,63,94,0.3)' }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                      <span>None</span><span>Severe</span>
                    </div>
                  </div>
                </div>

                {/* Associated Symptoms */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Associated Symptoms</span>
                  <div className="flex flex-wrap gap-2">
                    {symptomsList.map(s => (
                      <button
                        key={s}
                        onClick={() => toggleSymptom(s)}
                        className="px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all active:scale-95"
                        style={log.symptoms?.includes(s)
                          ? { background: '#0f172a', borderColor: '#0f172a', color: 'white', boxShadow: '0 2px 8px rgba(15,23,42,0.2)' }
                          : { background: 'white', borderColor: '#f1f5f9', color: '#94a3b8' }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Save Error ── */}
          {saveError && (
            <div className="mx-6 mb-2 px-4 py-2.5 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-semibold rounded-xl flex items-center gap-2">
              ⚠️ {saveError}
            </div>
          )}

          {/* ── Footer Actions ── */}
          <div className="px-6 pb-6 pt-4 border-t border-slate-50 bg-white flex-shrink-0 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-all active:scale-95"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-[2] py-4 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, #FF4D8D, #FF7AA8)`,
                boxShadow: `0 8px 24px rgba(255,77,141,0.4)`,
              }}
            >
              {saving ? (
                <><Loader2 size={14} className="animate-spin" /> Syncing...</>
              ) : (
                <>
                  <ShieldCheck size={14} />
                  Commit Log Entry
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Gamification Badge ── */}
      {showBadge && (
        <WellnessBadge
          score={wellnessScore}
          streak={profile?.streakCount || 0}
          onClose={handleBadgeClose}
        />
      )}
    </>
  );
};

export default LogMomentModal;

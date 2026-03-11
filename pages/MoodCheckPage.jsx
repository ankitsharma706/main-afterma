import {
  ArrowLeft, ArrowRight, Brain, Flame, Heart, Moon,
  Shield, Sparkles, Star, Trophy, X, Zap
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../constants';

/* ═══════════════════════════════════════════════════════════
   MOOD QUIZ DATA — 5 clinical-wellness questions
   ═══════════════════════════════════════════════════════════ */
const MOOD_QUESTIONS = [
  {
    id: 'emotional-state',
    question: 'How would you describe your emotional landscape right now?',
    subtitle: 'Be honest — there are no wrong answers here.',
    icon: <Heart size={22} />,
    iconColor: '#EC4899',
    iconBg: '#FFF0F6',
    options: [
      { label: 'Overwhelmed & Fragile', emoji: '😢', value: 1, detail: 'Everything feels like too much right now.' },
      { label: 'Uneasy & Restless', emoji: '😟', value: 3, detail: 'A sense of worry that won\'t settle.' },
      { label: 'Calm & Stable', emoji: '😌', value: 6, detail: 'I\'m managing and feeling okay.' },
      { label: 'Hopeful & Content', emoji: '😊', value: 8, detail: 'I see positive things ahead.' },
      { label: 'Radiant & Empowered', emoji: '🌟', value: 10, detail: 'I feel strong and full of light.' },
    ],
  },
  {
    id: 'energy-level',
    question: 'What\'s your body telling you about your energy today?',
    subtitle: 'Listen to your body\'s natural rhythm.',
    icon: <Zap size={22} />,
    iconColor: '#F59E0B',
    iconBg: '#FFFBEB',
    options: [
      { label: 'Completely Drained', emoji: '🪫', value: 1, detail: 'I can barely keep going.' },
      { label: 'Running Low', emoji: '🔋', value: 3, detail: 'I\'m functioning but tired.' },
      { label: 'Steady & Sustainable', emoji: '⚡', value: 6, detail: 'I have enough to get through.' },
      { label: 'Energized & Active', emoji: '💪', value: 8, detail: 'I feel alive and capable.' },
      { label: 'Vibrant & Unstoppable', emoji: '🔥', value: 10, detail: 'Maximum power mode.' },
    ],
  },
  {
    id: 'sleep-quality',
    question: 'How well did you rest last night?',
    subtitle: 'Sleep is the foundation of recovery.',
    icon: <Moon size={22} />,
    iconColor: '#6366F1',
    iconBg: '#EEF2FF',
    options: [
      { label: 'Barely Slept', emoji: '😵', value: 1, detail: 'Less than 3 hours of broken sleep.' },
      { label: 'Restless Night', emoji: '😴', value: 3, detail: 'Woke up multiple times, never deeply.' },
      { label: 'Average Sleep', emoji: '🛌', value: 5, detail: 'Got some rest, but not great.' },
      { label: 'Solid Rest', emoji: '💤', value: 8, detail: 'Slept well with minor interruptions.' },
      { label: 'Deep & Rejuvenating', emoji: '🌙', value: 10, detail: 'Woke up feeling genuinely refreshed.' },
    ],
  },
  {
    id: 'stress-coping',
    question: 'How are you handling stress and pressure right now?',
    subtitle: 'Your coping mechanisms reveal your inner strength.',
    icon: <Shield size={22} />,
    iconColor: '#10B981',
    iconBg: '#F0FDF4',
    options: [
      { label: 'Falling Apart', emoji: '💔', value: 1, detail: 'I feel like I can\'t cope anymore.' },
      { label: 'Struggling', emoji: '😰', value: 3, detail: 'Holding on but it\'s very hard.' },
      { label: 'Managing', emoji: '🧘', value: 5, detail: 'I have my ups and downs.' },
      { label: 'Resilient', emoji: '🛡️', value: 8, detail: 'I can handle what comes my way.' },
      { label: 'Thriving Under Any Pressure', emoji: '🦋', value: 10, detail: 'Stress fuels my growth.' },
    ],
  },
  {
    id: 'connection',
    question: 'How connected do you feel to yourself and your loved ones?',
    subtitle: 'Connection is the heartbeat of emotional wellness.',
    icon: <Brain size={22} />,
    iconColor: '#8B5CF6',
    iconBg: '#F5F3FF',
    options: [
      { label: 'Deeply Isolated', emoji: '🏝️', value: 1, detail: 'I feel alone in everything.' },
      { label: 'Somewhat Disconnected', emoji: '🌫️', value: 3, detail: 'Hard to reach out even when I want to.' },
      { label: 'Moderately Connected', emoji: '🤝', value: 5, detail: 'I have some support around me.' },
      { label: 'Well Supported', emoji: '💞', value: 8, detail: 'My people make me feel seen.' },
      { label: 'Deeply Bonded', emoji: '🫂', value: 10, detail: 'I feel loved and understood completely.' },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════
   MOOD PROFILES — computed from quiz total score
   ═══════════════════════════════════════════════════════════ */
const getMoodProfile = (score) => {
  if (score <= 10) return {
    title: 'The Quiet Warrior',
    subtitle: 'You\'re going through a lot, and just being here shows incredible courage.',
    emoji: '🌱',
    gradient: ['#f43f5e', '#fb7185'],
    advice: 'Reach out to someone you trust today. You don\'t have to carry everything alone.',
    color: '#f43f5e',
    xp: 50,
    badge: 'Courage Badge',
  };
  if (score <= 20) return {
    title: 'The Resilient Survivor',
    subtitle: 'You\'re building strength through adversity — every step counts.',
    emoji: '🌿',
    gradient: ['#f97316', '#fb923c'],
    advice: 'Try a 5-minute breathwork session. Small acts of self-care compound into transformation.',
    color: '#f97316',
    xp: 75,
    badge: 'Resilience Badge',
  };
  if (score <= 30) return {
    title: 'The Mindful Navigator',
    subtitle: 'You\'re aware of your challenges and actively working through them.',
    emoji: '🧭',
    gradient: ['#eab308', '#facc15'],
    advice: 'Journal 3 things you\'re grateful for. Gratitude rewires your neural pathways.',
    color: '#eab308',
    xp: 100,
    badge: 'Awareness Badge',
  };
  if (score <= 40) return {
    title: 'The Balanced Soul',
    subtitle: 'You\'re finding your center — keep nurturing this equilibrium.',
    emoji: '☯️',
    gradient: ['#10b981', '#34d399'],
    advice: 'Maintain your routines — consistency is your superpower right now.',
    color: '#10b981',
    xp: 150,
    badge: 'Balance Badge',
  };
  return {
    title: 'The Radiant Phoenix',
    subtitle: 'You\'re thriving! Your emotional intelligence is truly inspiring.',
    emoji: '🌸',
    gradient: ['#EC4899', '#FF7AA8'],
    advice: 'Share your light. Helping another mother can multiply your own wellness.',
    color: '#EC4899',
    xp: 200,
    badge: 'Radiance Badge',
  };
};

/* ═══════════════════════════════════════════════════════════
   PROGRESS RING COMPONENT
   ═══════════════════════════════════════════════════════════ */
const Ring = ({ pct, size = 120, stroke = 10, color, children }) => {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={`${circ * pct} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   Route: /mood-check
   ═══════════════════════════════════════════════════════════ */
const MoodCheckPage = ({ profile }) => {
  const navigate = useNavigate();
  const theme = COLORS[profile?.accent] || COLORS.PINK;

  /* ── State ── */
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const totalQuestions = MOOD_QUESTIONS.length;
  const isResultScreen = step >= totalQuestions;
  const currentQ = MOOD_QUESTIONS[step] || null;

  /* ── Score & profile ── */
  const totalScore = useMemo(() =>
    Object.values(answers).reduce((sum, v) => sum + v, 0),
    [answers]
  );
  const maxScore = totalQuestions * 10;
  const scorePct = totalScore / maxScore;
  const moodProfile = useMemo(() => getMoodProfile(totalScore), [totalScore]);

  /* ── Entrance animation ── */
  useEffect(() => {
    requestAnimationFrame(() => setFadeIn(true));
  }, []);

  /* ── Navigate between steps ── */
  const goNextStep = useCallback(() => {
    if (selectedOption === null) return;
    setTransitioning(true);
    setAnswers(prev => ({ ...prev, [currentQ.id]: selectedOption }));
    setTimeout(() => {
      setStep(s => s + 1);
      setSelectedOption(null);
      setTransitioning(false);
      if (step + 1 >= totalQuestions) {
        setTimeout(() => setShowConfetti(true), 600);
      }
    }, 400);
  }, [selectedOption, currentQ, step, totalQuestions]);

  const goPrevStep = useCallback(() => {
    if (step <= 0) return;
    setTransitioning(true);
    setTimeout(() => {
      setStep(s => s - 1);
      setSelectedOption(answers[MOOD_QUESTIONS[step - 1]?.id] ?? null);
      setTransitioning(false);
    }, 300);
  }, [step, answers]);

  const handleOptionSelect = useCallback((value) => {
    setSelectedOption(value);
  }, []);

  /* ═══════════════════════════════════════════════════════
     RESULT SCREEN
     ═══════════════════════════════════════════════════════ */
  if (isResultScreen) {
    return (
      <div
        className="min-h-screen font-sans flex flex-col"
        style={{
          background: `linear-gradient(180deg, ${moodProfile.gradient[0]}08 0%, #ffffff 30%, ${moodProfile.gradient[1]}06 100%)`,
          opacity: fadeIn ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        {/* Header */}
        <div className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-100/50">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-widest transition-all group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mood Profile</span>
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-xl transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div
            className="max-w-lg w-full text-center relative"
            style={{ animation: 'resultReveal 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
          >
            {/* Confetti */}
            {showConfetti && [...Array(18)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 6 + (i % 4) * 3,
                  height: 6 + (i % 4) * 3,
                  background: [moodProfile.color, '#a78bfa', '#34d399', '#fbbf24', '#60a5fa'][i % 5],
                  top: `${(i * 29 + 5) % 95}%`,
                  left: `${(i * 37 + 3) % 95}%`,
                  opacity: 0.5,
                  animation: `confettiDrift ${2 + (i%3)*0.5}s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}

            {/* Score Ring */}
            <div className="flex justify-center mb-6">
              <Ring pct={scorePct} size={140} stroke={12} color={moodProfile.color}>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-black tabular-nums" style={{ color: moodProfile.color }}>{totalScore}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">/ {maxScore}</span>
                </div>
              </Ring>
            </div>

            {/* Profile emoji */}
            <div
              className="text-6xl mb-4"
              style={{ filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.08))', animation: 'emojiPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s both' }}
            >
              {moodProfile.emoji}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
              {moodProfile.title}
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-medium mb-8 leading-relaxed max-w-sm mx-auto">
              {moodProfile.subtitle}
            </p>

            {/* XP + Badge Row */}
            <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
              <div
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border"
                style={{ background: `${moodProfile.color}10`, borderColor: `${moodProfile.color}30` }}
              >
                <Star size={16} style={{ color: moodProfile.color }} fill={moodProfile.color} />
                <span className="font-black text-sm" style={{ color: moodProfile.color }}>+{moodProfile.xp} XP</span>
              </div>
              <div
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl border"
                style={{ background: `${moodProfile.color}08`, borderColor: `${moodProfile.color}20` }}
              >
                <Trophy size={16} style={{ color: moodProfile.color }} />
                <span className="font-black text-sm text-slate-700">{moodProfile.badge}</span>
              </div>
              {(profile?.streakCount || 0) > 0 && (
                <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-orange-50 border border-orange-100">
                  <Flame size={16} className="text-orange-500" />
                  <span className="font-black text-sm text-orange-600">{profile.streakCount} day streak</span>
                </div>
              )}
            </div>

            {/* Advice Card */}
            <div
              className="p-5 rounded-2xl border text-left mb-8 mx-auto max-w-sm"
              style={{ background: `${moodProfile.color}06`, borderColor: `${moodProfile.color}18` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} style={{ color: moodProfile.color }} />
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: moodProfile.color }}>Clinical Insight</span>
              </div>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                {moodProfile.advice}
              </p>
            </div>

            {/* Question breakdown bars */}
            <div className="space-y-2.5 mb-8 max-w-sm mx-auto">
              {MOOD_QUESTIONS.map((q) => {
                const val = answers[q.id] || 0;
                const pctW = (val / 10) * 100;
                return (
                  <div key={q.id} className="flex items-center gap-3 text-left">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: q.iconBg, color: q.iconColor }}>
                      <div style={{ transform: 'scale(0.65)' }}>{q.icon}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] font-bold text-slate-500 truncate">
                          {q.id.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                        </span>
                        <span className="text-xs font-black tabular-nums ml-2" style={{ color: q.iconColor }}>{val}/10</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pctW}%`, background: q.iconColor, transition: 'width 0.8s ease' }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <button
                onClick={() => { setStep(0); setAnswers({}); setSelectedOption(null); setShowConfetti(false); }}
                className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-xs uppercase tracking-widest text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all active:scale-95"
              >
                Retake Quiz
              </button>
              <button
                onClick={() => navigate(-1)}
                className="flex-[2] py-4 text-white rounded-2xl font-bold text-xs uppercase tracking-widest transition-all active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${moodProfile.gradient[0]}, ${moodProfile.gradient[1]})`,
                  boxShadow: `0 8px 24px ${moodProfile.color}44`,
                }}
              >
                Continue to Log
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes resultReveal {
            from { opacity:0; transform: translateY(40px) scale(0.95); }
            to   { opacity:1; transform: translateY(0) scale(1); }
          }
          @keyframes emojiPop {
            from { opacity:0; transform: scale(0.3) rotate(-15deg); }
            to   { opacity:1; transform: scale(1) rotate(0deg); }
          }
          @keyframes confettiDrift {
            from { transform: translate(0,0) rotate(0deg) scale(1); }
            to   { transform: translate(8px,-16px) rotate(360deg) scale(0.7); }
          }
        `}</style>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════
     QUESTION SCREEN
     ═══════════════════════════════════════════════════════ */
  return (
    <div
      className="min-h-screen font-sans flex flex-col"
      style={{
        background: `linear-gradient(180deg, ${currentQ.iconBg} 0%, #ffffff 40%, #f8fafc 100%)`,
        opacity: fadeIn ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
    >
      {/* ── Top Bar ── */}
      <div className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-8 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-100/50">
        <button
          onClick={() => step > 0 ? goPrevStep() : navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-widest transition-all group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          {step > 0 ? 'Previous' : 'Back'}
        </button>

        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: currentQ.iconColor }}>
          Mood Check
        </span>

        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-xl transition-all"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Progress Bar ── */}
      <div className="px-4 md:px-8 pt-4">
        <div className="flex items-center gap-2 max-w-lg mx-auto">
          {MOOD_QUESTIONS.map((q, idx) => (
            <div
              key={q.id}
              className="flex-1 h-2 rounded-full overflow-hidden transition-all duration-300"
              style={{
                background: idx < step ? MOOD_QUESTIONS[idx].iconColor
                  : idx === step ? `${currentQ.iconColor}30`
                  : '#f1f5f9',
              }}
            >
              {idx === step && (
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: selectedOption !== null ? '100%' : '30%',
                    background: currentQ.iconColor,
                  }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-2 max-w-lg mx-auto">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            Question {step + 1} of {totalQuestions}
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: currentQ.iconColor }}>
            {Math.round(((step) / totalQuestions) * 100)}% Complete
          </span>
        </div>
      </div>

      {/* ── Question Card ── */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div
          className="max-w-lg w-full"
          style={{
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? 'translateX(40px)' : 'translateX(0)',
            transition: 'opacity 0.35s ease, transform 0.35s ease',
          }}
        >
          {/* Icon + Question */}
          <div className="text-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{
                background: currentQ.iconBg,
                color: currentQ.iconColor,
                boxShadow: `0 8px 24px ${currentQ.iconColor}22`,
              }}
            >
              {currentQ.icon}
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-snug mb-2">
              {currentQ.question}
            </h2>
            <p className="text-sm text-slate-400 font-medium italic">{currentQ.subtitle}</p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOption === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleOptionSelect(opt.value)}
                  className="w-full flex items-center gap-4 p-4 md:p-5 rounded-2xl border-2 text-left transition-all active:scale-[0.98] group"
                  style={{
                    background: isSelected ? `${currentQ.iconColor}08` : 'white',
                    borderColor: isSelected ? currentQ.iconColor : '#f1f5f9',
                    boxShadow: isSelected
                      ? `0 8px 24px ${currentQ.iconColor}18`
                      : '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  {/* Emoji */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-all"
                    style={{
                      background: isSelected ? `${currentQ.iconColor}15` : '#f8fafc',
                      transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {opt.emoji}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <span
                      className="block text-sm font-bold transition-colors"
                      style={{ color: isSelected ? currentQ.iconColor : '#334155' }}
                    >
                      {opt.label}
                    </span>
                    <span className="block text-xs text-slate-400 font-medium mt-0.5">
                      {opt.detail}
                    </span>
                  </div>

                  {/* Selection radio */}
                  <div
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                    style={{
                      borderColor: isSelected ? currentQ.iconColor : '#e2e8f0',
                      background: isSelected ? currentQ.iconColor : 'transparent',
                    }}
                  >
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Continue */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={goNextStep}
              disabled={selectedOption === null}
              className="w-full max-w-sm py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: selectedOption !== null
                  ? `linear-gradient(135deg, ${currentQ.iconColor}, ${currentQ.iconColor}cc)`
                  : '#e2e8f0',
                color: selectedOption !== null ? 'white' : '#94a3b8',
                boxShadow: selectedOption !== null ? `0 8px 24px ${currentQ.iconColor}44` : 'none',
              }}
            >
              {step < totalQuestions - 1 ? (
                <>
                  Continue
                  <ArrowRight size={16} />
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Reveal My Profile
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodCheckPage;

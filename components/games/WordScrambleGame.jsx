import { useEffect, useMemo, useReducer, useRef } from 'react';

/* ═══════════════════════════════════════════════════════════════════════
   Word Wellness Challenge — Scrabble-style word game for Care Journey
   Pure React + vanilla CSS animations. No external libraries.
   v2 — fixes: localStorage persistence, duplicate guard, animation key,
        safe backspace handling, dead-code removal.
═══════════════════════════════════════════════════════════════════════ */

/* ─── Letter frequency & point values (Scrabble-accurate) ──────────── */
const LETTER_POOL = [
  ...Array(9).fill('A'), ...Array(2).fill('B'), ...Array(2).fill('C'),
  ...Array(4).fill('D'), ...Array(12).fill('E'), ...Array(2).fill('F'),
  ...Array(3).fill('G'), ...Array(2).fill('H'), ...Array(9).fill('I'),
  ...Array(1).fill('J'), ...Array(1).fill('K'), ...Array(4).fill('L'),
  ...Array(2).fill('M'), ...Array(6).fill('N'), ...Array(8).fill('O'),
  ...Array(2).fill('P'), ...Array(1).fill('Q'), ...Array(6).fill('R'),
  ...Array(4).fill('S'), ...Array(6).fill('T'), ...Array(4).fill('U'),
  ...Array(2).fill('V'), ...Array(2).fill('W'), ...Array(1).fill('X'),
  ...Array(2).fill('Y'), ...Array(1).fill('Z'),
];

const LETTER_POINTS = {
  A: 1, E: 1, I: 1, O: 1, U: 1, L: 1, N: 1, S: 1, T: 1, R: 1,
  D: 2, G: 2,
  B: 3, C: 3, M: 3, P: 3,
  F: 4, H: 4, V: 4, W: 4, Y: 4,
  K: 5,
  J: 8, X: 8,
  Q: 10, Z: 10,
};

/* ─── Wellness word dictionary with insights ────────────────────────── */
const WELLNESS_WORDS = {
  // 3-letter
  JOY:  { insight: 'Moments of joy nurture your emotional recovery.', emoji: '✨' },
  ZEN:  { insight: "A calm mind supports your body's natural healing process.", emoji: '🧘' },
  AIR:  { insight: 'Deep breathing with fresh air reduces cortisol levels.', emoji: '🌬️' },
  HUG:  { insight: 'Hugs release oxytocin — the bonding hormone.', emoji: '🤗' },
  NAP:  { insight: 'Short naps restore energy and support hormonal balance.', emoji: '💤' },
  SIP:  { insight: 'Staying hydrated is key to postpartum wellness.', emoji: '💧' },
  SUN:  { insight: 'Sunlight regulates melatonin and supports mood.', emoji: '☀️' },
  TEA:  { insight: 'Herbal tea soothes the nervous system and aids sleep.', emoji: '🍵' },
  RUN:  { insight: 'Even a short run releases powerful mood-lifting endorphins.', emoji: '🏃‍♀️' },

  // 4-letter
  CALM: { insight: 'Taking time to calm your mind supports postpartum recovery.', emoji: '🌊' },
  REST: { insight: 'Adequate rest is essential for healing and hormonal balance.', emoji: '😴' },
  LOVE: { insight: "Self-love is not selfish — it's the root of good mothering.", emoji: '❤️' },
  CARE: { insight: 'Caring for yourself allows you to care better for your baby.', emoji: '🌸' },
  HEAL: { insight: 'Every day is a small step in your healing journey.', emoji: '🌿' },
  HOPE: { insight: 'Hope is a powerful medicine for emotional recovery.', emoji: '🌅' },
  SAFE: { insight: 'Feeling safe and supported accelerates recovery.', emoji: '🛡️' },
  WARM: { insight: 'Emotional warmth from loved ones reduces depression risk.', emoji: '🌞' },
  YOGA: { insight: 'Gentle yoga can accelerate postpartum physical recovery.', emoji: '🧘‍♀️' },
  MILK: { insight: 'Breast milk is a remarkable gift of nutrition and immunity.', emoji: '🤱' },
  WALK: { insight: 'Even gentle walking boosts mood through endorphin release.', emoji: '🚶‍♀️' },
  BOND: { insight: 'Bonding with your baby strengthens both your wellbeing.', emoji: '👶' },
  GLOW: { insight: 'Your inner glow grows as you heal and connect.', emoji: '✨' },
  DEEP: { insight: 'Deep breathing activates your parasympathetic nervous system.', emoji: '🌬️' },
  SOUL: { insight: 'Nourishing your soul is as important as your body.', emoji: '🌟' },
  RISE: { insight: 'Every morning is a chance to rise and begin again.', emoji: '🌄' },
  PURE: { insight: 'Pure intentions of self-care transform daily routines.', emoji: '💎' },
  FOOD: { insight: 'Nourishing food is medicine for your recovering body.', emoji: '🥗' },
  MOVE: { insight: 'Gentle movement reactivates your body\'s healing systems.', emoji: '💃' },
  SONG: { insight: 'Music and humming reduce stress hormones significantly.', emoji: '�' },
  GRIT: { insight: 'Quiet grit carries you through the hardest recovery days.', emoji: '💪' },

  // 5-letter
  SLEEP: { insight: "Sleep is your body's most powerful recovery tool.", emoji: '�' },
  PEACE: { insight: 'Inner peace is cultivated one mindful moment at a time.', emoji: '☮️' },
  GRACE: { insight: 'Give yourself grace — recovery is not a straight line.', emoji: '🕊️' },
  TRUST: { insight: 'Trusting your instincts strengthens the mother-baby bond.', emoji: '🤝' },
  SMILE: { insight: 'Even a gentle smile shifts your neurochemistry positively.', emoji: '😊' },
  BIRTH: { insight: 'The gift of birth begins a profound transformation.', emoji: '🌸' },
  LIGHT: { insight: 'Natural light exposure regulates mood and sleep cycles.', emoji: '☀️' },
  HEART: { insight: 'A grateful heart is the cornerstone of emotional resilience.', emoji: '💗' },
  EARTH: { insight: 'Grounding in nature reduces cortisol by up to 20%.', emoji: '🌍' },
  WATER: { insight: 'Drinking enough water supports milk production and recovery.', emoji: '💧' },
  QUIET: { insight: 'Quiet moments of reflection are profoundly healing.', emoji: '🤫' },
  BRAVE: { insight: 'You are braver than you believe in this journey.', emoji: '🦁' },
  OASIS: { insight: 'Create a personal oasis of calm in your daily routine.', emoji: '🏝️' },
  VIGOR: { insight: 'Vigor returns naturally when you honour your rest needs.', emoji: '⚡' },
  BLOOM: { insight: 'Like a flower after rain, you will bloom again.', emoji: '🌸' },
  SHORE: { insight: 'Every storm finds its shore. You will find yours too.', emoji: '🌊' },

  // 6-letter
  MOTHER: { insight: 'Being a mother is the most powerful transformation in life.', emoji: '🌺' },
  GENTLE: { insight: 'Gentle movement and touch support your nervous system.', emoji: '🌱' },
  HEALTH: { insight: 'Your health is your most precious investment.', emoji: '💚' },
  STRONG: { insight: 'Strength grows through every small act of self-care.', emoji: '💪' },
  SERENE: { insight: 'A serene environment promotes hormonal balance.', emoji: '🌅' },
  ENERGY: { insight: 'Energy returns gradually — honour each small gain.', emoji: '⚡' },
  NATURE: { insight: 'Time in nature reduces anxiety and supports mood.', emoji: '🌿' },
  TENDER: { insight: 'Tender self-compassion is a radical act of healing.', emoji: '🌷' },
  SOLACE: { insight: 'Finding solace in small comforts is a valid coping skill.', emoji: '🕊️' },

  // 7-letter
  HEALING: { insight: 'Healing is not linear — each day holds its own progress.', emoji: '🌿' },
  BREATHE: { insight: 'Each deep breath sends calm signals to every cell.', emoji: '🌬️' },
  NOURISH: { insight: 'Nourishing food fuels your body\'s incredible recovery.', emoji: '🥗' },
  MINDFUL: { insight: 'Mindfulness transforms ordinary moments into medicine.', emoji: '🧘' },
  EMBRACE: { insight: 'Embracing imperfection is the doorway to compassion.', emoji: '🤗' },
  NURTURE: { insight: 'To nurture others, you must first nurture yourself.', emoji: '🌱' },
  BALANCE: { insight: "Balance is not perfection — it's a daily gentle negotiation.", emoji: '⚖️' },
  BLOSSOM: { insight: 'Like a flower, you blossom at your own natural pace.', emoji: '🌸' },
  RADIANT: { insight: 'Radiance comes from within — from rest, love, and nourishment.', emoji: '✨' },

  // 8-letter
  WELLNESS: { insight: 'True wellness integrates body, mind, and spirit.', emoji: '🌟' },
  STRENGTH: { insight: 'Strength is built quietly through small daily acts.', emoji: '💪' },
  GRATEFUL: { insight: 'Gratitude rewires the brain toward positive resilience.', emoji: '🙏' },
  RECOVERY: { insight: 'Every single step in recovery is worthy of celebration.', emoji: '🎉' },
  SERENADE: { insight: 'Let calming sounds serenade your path to recovery.', emoji: '🎶' },

  // 9-letter
  GRATITUDE: { insight: 'Practising daily gratitude is proven to lift mood within weeks.', emoji: '🙏' },
  NOURISHES: { insight: 'Everything you nourish — including yourself — flourishes.', emoji: '🥗' },
};

/* ─── Daily challenge (rotates by calendar date) ────────────────────── */
const DAILY_CHALLENGES = [
  'HEALING', 'WELLNESS', 'STRENGTH', 'GRATEFUL', 'RECOVERY',
  'MINDFUL', 'NURTURE', 'BALANCE', 'BLOSSOM', 'GRATITUDE',
  'BREATHE', 'NOURISH', 'MOTHER', 'GENTLE', 'HEALTH',
];

const getTodayKey = () => new Date().toISOString().slice(0, 10); // "2026-03-07"

const getDailyWord = () => {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length];
};

/* ─── localStorage helpers ──────────────────────────────────────────── */
const LS_KEY = 'afterma_wsg_v2';

const loadSaved = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    // Only restore if it was saved today
    if (saved.dateKey !== getTodayKey()) {
      // New day — keep history & total score, reset daily flag
      return { score: saved.score ?? 0, history: saved.history ?? [], wordsUsed: saved.wordsUsed ?? [], dailyDone: false, dateKey: getTodayKey() };
    }
    return saved;
  } catch {
    return null;
  }
};

const persist = (patch) => {
  try {
    const prev = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    localStorage.setItem(LS_KEY, JSON.stringify({ ...prev, ...patch, dateKey: getTodayKey() }));
  } catch { /* quota exceeded etc. — silent */ }
};

/* ─── Tile ID (monotonic, stable across HMR) ────────────────────────── */
let _uid = Date.now();
const nextId = () => ++_uid;

/* ─── Draw N random tiles ───────────────────────────────────────────── */
const drawTiles = (count = 7) =>
  Array.from({ length: count }, () => ({
    id: nextId(),
    letter: LETTER_POOL[Math.floor(Math.random() * LETTER_POOL.length)],
    selected: false,
  }));

/* ─── Scoring ───────────────────────────────────────────────────────── */
const scoreWord = (word, isDaily = false) => {
  const len = word.length;
  const letterScore = word.split('').reduce((s, c) => s + (LETTER_POINTS[c] || 1), 0);
  const lengthBonus = len >= 7 ? 20 : len >= 5 ? 10 : 5;
  const dailyBonus = isDaily ? 30 : 0;
  return letterScore + lengthBonus + dailyBonus;
};

/* ─── Initial state (merged from localStorage if available) ──────────── */
const buildInitialState = () => {
  const saved = loadSaved();
  const dailyWord = getDailyWord();
  return {
    rack: drawTiles(7),
    built: [],
    score: saved?.score ?? 0,
    history: saved?.history ?? [],
    wordsUsed: saved?.wordsUsed ?? [],      // ← de-dupe guard
    dailyWord,
    dailyDone: saved?.dailyDone ?? false,
    feedback: null,
    feedbackKey: 0,                          // ← unique key per feedback so animation re-fires
    shake: false,
  };
};

/* ─── Reducer ───────────────────────────────────────────────────────── */
const reducer = (state, action) => {
  switch (action.type) {

    case 'PICK': {
      const idx = state.rack.findIndex(t => t.id === action.id && !t.selected);
      if (idx === -1) return state;
      return {
        ...state,
        rack: state.rack.map((t, i) => i === idx ? { ...t, selected: true } : t),
        built: [...state.built, state.rack[idx]],
        feedback: null,
      };
    }

    case 'UNPICK': {
      const idx = state.built.findIndex(t => t.id === action.id);
      if (idx === -1) return state;
      const tile = state.built[idx];
      return {
        ...state,
        built: state.built.filter((_, i) => i !== idx),
        rack: state.rack.map(t => t.id === tile.id ? { ...t, selected: false } : t),
        feedback: null,
      };
    }

    case 'SHUFFLE': {
      const shuffled = [...state.rack].sort(() => Math.random() - 0.5);
      return { ...state, rack: shuffled };
    }

    case 'RESET_WORD':
      return {
        ...state,
        rack: state.rack.map(t => ({ ...t, selected: false })),
        built: [],
        feedback: null,
      };

    case 'SUBMIT': {
      const word = state.built.map(t => t.letter).join('');

      if (word.length < 3) {
        return {
          ...state,
          feedback: { type: 'error', message: 'Word must be at least 3 letters long.' },
          feedbackKey: state.feedbackKey + 1,
          shake: true,
        };
      }

      // Duplicate guard
      if (state.wordsUsed.includes(word)) {
        return {
          ...state,
          feedback: { type: 'error', message: `"${word}" already scored! Try a new word.` },
          feedbackKey: state.feedbackKey + 1,
          shake: true,
        };
      }

      const data = WELLNESS_WORDS[word];
      if (!data) {
        return {
          ...state,
          feedback: { type: 'error', message: `"${word}" is not in the wellness word list.` },
          feedbackKey: state.feedbackKey + 1,
          shake: true,
        };
      }

      const isDaily = word === state.dailyWord && !state.dailyDone;
      const points = scoreWord(word, isDaily);
      const newScore = state.score + points;
      const newHistory = [{ word, points, insight: data.insight, emoji: data.emoji, isDaily }, ...state.history];
      const newWordsUsed = [...state.wordsUsed, word];
      const newDailyDone = state.dailyDone || isDaily;

      // Persist to localStorage
      persist({ score: newScore, history: newHistory, wordsUsed: newWordsUsed, dailyDone: newDailyDone });

      return {
        ...state,
        score: newScore,
        history: newHistory,
        wordsUsed: newWordsUsed,
        rack: state.rack.map(t => ({ ...t, selected: false })),
        built: [],
        dailyDone: newDailyDone,
        feedback: {
          type: isDaily ? 'daily' : 'success',
          message: `+${points} pts${isDaily ? ' 🎉 Daily Bonus!' : ''}`,
          insight: data.insight,
          emoji: data.emoji,
          word,
        },
        feedbackKey: state.feedbackKey + 1,
        shake: false,
      };
    }

    case 'CLEAR_SHAKE':
      return { ...state, shake: false };

    case 'NEW_TILES':
      return { ...state, rack: drawTiles(7), built: [], feedback: null };

    case 'RESET_ALL': {
      localStorage.removeItem(LS_KEY);
      return buildInitialState();
    }

    default:
      return state;
  }
};

/* ═══════════════════════════════════════════════════════════════════════
   Sub-components
═══════════════════════════════════════════════════════════════════════ */

/* ── Single letter tile ── */
const Tile = ({ tile, onClick, variant = 'rack' }) => {
  const pts = LETTER_POINTS[tile.letter] || 1;
  const isGhost = tile.selected && variant === 'rack'; // ghosted-out in rack when in builder

  return (
    <button
      onClick={() => !isGhost && onClick(tile.id)}
      disabled={isGhost}
      aria-label={`Letter ${tile.letter}, ${pts} point${pts !== 1 ? 's' : ''}`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: variant === 'built' ? 44 : 48,
        height: variant === 'built' ? 50 : 56,
        borderRadius: 12,
        border: `2px solid ${variant === 'built' ? '#f9a8d4' : isGhost ? '#e2e8f0' : '#fbcfe8'}`,
        background: variant === 'built'
          ? 'linear-gradient(145deg,#fce7f3,#fdf2f8)'
          : isGhost ? '#f1f5f9' : 'linear-gradient(145deg,#fff,#fdf2f8)',
        boxShadow: isGhost ? 'none' : variant === 'built'
          ? '0 3px 10px rgba(244,114,182,0.25)'
          : '0 4px 14px rgba(244,114,182,0.18)',
        cursor: isGhost ? 'default' : 'pointer',
        opacity: isGhost ? 0.32 : 1,
        transition: 'transform 0.15s ease, opacity 0.15s ease',
        outline: 'none',
        flexShrink: 0,
      }}
      onMouseEnter={e => { if (!isGhost) e.currentTarget.style.transform = 'translateY(-4px) scale(1.07)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
      onMouseDown={e => { if (!isGhost) e.currentTarget.style.transform = 'scale(0.93)'; }}
      onMouseUp={e => { if (!isGhost) e.currentTarget.style.transform = 'translateY(-4px) scale(1.07)'; }}
    >
      <span style={{ fontSize: 22, fontWeight: 900, color: isGhost ? '#cbd5e1' : variant === 'built' ? '#be185d' : '#1e293b', lineHeight: 1, fontFamily: 'Georgia, serif' }}>
        {tile.letter}
      </span>
      <span style={{ fontSize: 8, fontWeight: 700, color: isGhost ? '#cbd5e1' : '#94a3b8', lineHeight: 1, marginTop: 2 }}>
        {pts}
      </span>
    </button>
  );
};

/* ── Score history row ── */
const HistoryRow = ({ entry }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '8px 12px',
    background: entry.isDaily ? 'linear-gradient(90deg,#fef9c3,#fef3c7)' : '#f8fafc',
    borderRadius: 14,
    border: `1px solid ${entry.isDaily ? '#fde68a' : '#f1f5f9'}`,
  }}>
    <span style={{ fontSize: 20 }}>{entry.emoji}</span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontWeight: 900, fontSize: 13, color: '#0f172a', letterSpacing: 1, fontFamily: 'Georgia, serif' }}>
          {entry.word}
        </span>
        {entry.isDaily && (
          <span style={{ fontSize: 8, fontWeight: 800, background: '#fbbf24', color: '#7c3aed', padding: '2px 6px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1 }}>
            Daily ★
          </span>
        )}
      </div>
      <p style={{ fontSize: 10, color: '#64748b', margin: 0, lineHeight: 1.4, marginTop: 2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        {entry.insight}
      </p>
    </div>
    <span style={{ fontWeight: 900, fontSize: 14, color: '#db2777', whiteSpace: 'nowrap' }}>+{entry.points}</span>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════════════════ */
const WordScrambleGame = () => {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitialState);
  const shakeTimer = useRef(null);
  const gameRef = useRef(null);  // ref to the game container for scoped keyboard

  /* ── Auto-clear shake ── */
  useEffect(() => {
    if (state.shake) {
      clearTimeout(shakeTimer.current);
      shakeTimer.current = setTimeout(() => dispatch({ type: 'CLEAR_SHAKE' }), 500);
    }
    return () => clearTimeout(shakeTimer.current);
  }, [state.shake]);

  /* ── Keyboard support — scoped so it doesn't block other inputs ── */
  useEffect(() => {
    const onKey = (e) => {
      // Only handle keys when the game area is in focus or no other input is active
      const active = document.activeElement;
      const isTyping = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
      if (isTyping) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        dispatch({ type: 'SUBMIT' });
      }
      if (e.key === 'Backspace') {
        e.preventDefault();
        const last = state.built[state.built.length - 1];
        if (last) dispatch({ type: 'UNPICK', id: last.id });
      }
      if (e.key === 'Escape') {
        dispatch({ type: 'RESET_WORD' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.built]);

  /* ── Derived values ── */
  const builtWord = state.built.map(t => t.letter).join('');
  const builtPoints = useMemo(() => {
    if (builtWord.length < 3) return 0;
    return scoreWord(builtWord, builtWord === state.dailyWord && !state.dailyDone);
  }, [builtWord, state.dailyWord, state.dailyDone]);

  const builtWordStatus = useMemo(() => {
    if (builtWord.length < 3) return null;
    if (state.wordsUsed.includes(builtWord)) return 'used';
    if (WELLNESS_WORDS[builtWord]) return 'valid';
    return 'invalid';
  }, [builtWord, state.wordsUsed]);

  /* ── Styles ── */
  const card = {
    background: 'linear-gradient(160deg,rgba(255,255,255,0.93),rgba(253,242,248,0.88))',
    borderRadius: 28,
    border: '1.5px solid rgba(251,207,232,0.7)',
    boxShadow: '0 8px 40px rgba(236,72,153,0.09), 0 2px 12px rgba(0,0,0,0.06)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    padding: '20px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    userSelect: 'none',
  };

  const previewColor =
    builtWordStatus === 'valid' ? '#db2777' :
    builtWordStatus === 'used' ? '#d97706' : '#94a3b8';

  const previewMsg =
    builtWordStatus === 'valid' ? `✓ "${builtWord}" — worth ~${builtPoints} pts` :
    builtWordStatus === 'used'  ? `"${builtWord}" already scored this session` :
    builtWord.length >= 3      ? `"${builtWord}" — not a wellness word` : null;

  return (
    <div ref={gameRef} style={card} role="application" aria-label="Word Wellness Challenge game">

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ margin: 0, fontWeight: 900, fontSize: 15, color: '#0f172a', letterSpacing: -0.3 }}>
            Word Wellness Challenge
          </h4>
          <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 2 }}>
            Scrabble-style · Mindful words
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: '#db2777', lineHeight: 1 }}>{state.score}</div>
          <div style={{ fontSize: 8, fontWeight: 800, color: '#f9a8d4', textTransform: 'uppercase', letterSpacing: 1 }}>total pts</div>
        </div>
      </div>

      {/* ── Daily Challenge Banner ── */}
      <div style={{
        background: state.dailyDone ? 'linear-gradient(90deg,#d1fae5,#a7f3d0)' : 'linear-gradient(90deg,#fef9c3,#fde68a)',
        borderRadius: 14,
        padding: '8px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        border: `1.5px solid ${state.dailyDone ? '#6ee7b7' : '#fcd34d'}`,
      }}>
        <span style={{ fontSize: 16 }}>{state.dailyDone ? '✅' : '⭐'}</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 8, fontWeight: 800, color: state.dailyDone ? '#065f46' : '#92400e', textTransform: 'uppercase', letterSpacing: 1.5 }}>
            {state.dailyDone ? 'Daily Challenge Complete! +30 bonus' : "Today's Challenge"}
          </p>
          {!state.dailyDone && (
            <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: '#78350f', letterSpacing: 2, fontFamily: 'Georgia, serif' }}>
              {state.dailyWord}&nbsp;
              <span style={{ fontSize: 9, fontWeight: 600, color: '#a16207' }}>({state.dailyWord.length} letters)</span>
            </p>
          )}
        </div>
      </div>

      {/* ── Word Builder Area ── */}
      <div style={{
        minHeight: 70,
        background: 'rgba(253,242,248,0.55)',
        borderRadius: 18,
        border: '2px dashed #fbcfe8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 12px',
        gap: 6,
        flexWrap: 'wrap',
      }}>
        {state.built.length === 0 ? (
          <p style={{ fontSize: 10, fontWeight: 700, color: '#f9a8d4', textTransform: 'uppercase', letterSpacing: 1.5, margin: 0 }}>
            Tap tiles below to build your word
          </p>
        ) : (
          state.built.map(tile => (
            <div key={tile.id} style={{ animation: 'wsg-pop-in 0.18s cubic-bezier(0.34,1.56,0.64,1) both' }}>
              <Tile tile={tile} variant="built" onClick={id => dispatch({ type: 'UNPICK', id })} />
            </div>
          ))
        )}
      </div>

      {/* ── Live word preview ── */}
      {previewMsg && (
        <div style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: previewColor, minHeight: 16 }}>
          {previewMsg}
        </div>
      )}

      {/* ── Tile Rack ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 6,
        flexWrap: 'wrap',
        animation: state.shake ? 'wsg-shake 0.42s ease both' : 'none',
      }}>
        {state.rack.map(tile => (
          <Tile key={tile.id} tile={tile} variant="rack" onClick={id => dispatch({ type: 'PICK', id })} />
        ))}
      </div>

      {/* ── Action Buttons ── */}
      <div style={{ display: 'flex', gap: 8 }}>
        {/* Clear */}
        <button
          onClick={() => dispatch({ type: 'RESET_WORD' })}
          disabled={state.built.length === 0}
          style={{
            flex: 1, padding: '10px 0', borderRadius: 14, border: 'none',
            background: state.built.length === 0 ? '#f1f5f9' : '#fce7f3',
            color: state.built.length === 0 ? '#cbd5e1' : '#be185d',
            fontWeight: 800, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5,
            cursor: state.built.length === 0 ? 'default' : 'pointer',
            transition: 'all 0.18s',
          }}
        >
          ↩ Clear
        </button>

        {/* Shuffle */}
        <button
          onClick={() => dispatch({ type: 'SHUFFLE' })}
          style={{
            flex: 1, padding: '10px 0', borderRadius: 14, border: 'none',
            background: '#f0fdf4', color: '#15803d',
            fontWeight: 800, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5,
            cursor: 'pointer', transition: 'all 0.18s',
          }}
        >
          🔀 Shuffle
        </button>

        {/* Submit */}
        <button
          onClick={() => dispatch({ type: 'SUBMIT' })}
          disabled={state.built.length < 3}
          style={{
            flex: 2, padding: '10px 0', borderRadius: 14, border: 'none',
            background: state.built.length >= 3 ? 'linear-gradient(135deg,#ec4899,#be185d)' : '#f1f5f9',
            color: state.built.length >= 3 ? '#fff' : '#cbd5e1',
            fontWeight: 900, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5,
            cursor: state.built.length >= 3 ? 'pointer' : 'default',
            boxShadow: state.built.length >= 3 ? '0 4px 14px rgba(236,72,153,0.35)' : 'none',
            transition: 'all 0.18s',
          }}
        >
          Submit ✓
        </button>
      </div>

      {/* ── Draw New Tiles ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
        <button
          onClick={() => dispatch({ type: 'NEW_TILES' })}
          style={{
            background: 'none', border: 'none', fontSize: 9, fontWeight: 700,
            color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.5, cursor: 'pointer',
          }}
        >
          Draw New Tiles
        </button>
        <button
          onClick={() => { if (window.confirm('Reset all progress (score & history)?')) dispatch({ type: 'RESET_ALL' }); }}
          style={{
            background: 'none', border: 'none', fontSize: 9, fontWeight: 700,
            color: '#fca5a5', textTransform: 'uppercase', letterSpacing: 1.5, cursor: 'pointer',
          }}
        >
          Reset Game
        </button>
      </div>

      {/* ── Feedback Toast ── */}
      {state.feedback && (
        /* key={feedbackKey} forces DOM remount → CSS animation re-fires every time */
        <div
          key={state.feedbackKey}
          style={{
            borderRadius: 16,
            padding: '12px 16px',
            background: state.feedback.type === 'error'
              ? 'linear-gradient(90deg,#fff1f2,#ffe4e6)'
              : state.feedback.type === 'daily'
                ? 'linear-gradient(90deg,#fef9c3,#fef3c7)'
                : 'linear-gradient(90deg,#f0fdf4,#dcfce7)',
            border: `1.5px solid ${state.feedback.type === 'error' ? '#fecdd3' : state.feedback.type === 'daily' ? '#fde68a' : '#bbf7d0'}`,
            animation: 'wsg-slide-up 0.28s ease both',
          }}
        >
          {state.feedback.type === 'error' ? (
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#be123c' }}>
              ⚠️ {state.feedback.message}
            </p>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 22 }}>{state.feedback.emoji}</span>
                <div>
                  <span style={{ fontWeight: 900, fontSize: 14, color: state.feedback.type === 'daily' ? '#78350f' : '#065f46', fontFamily: 'Georgia, serif', letterSpacing: 1 }}>
                    {state.feedback.word}
                  </span>
                  <span style={{ marginLeft: 8, fontWeight: 900, fontSize: 12, color: '#db2777' }}>
                    {state.feedback.message}
                  </span>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 10, color: '#374151', lineHeight: 1.5 }}>
                💡 {state.feedback.insight}
              </p>
            </>
          )}
        </div>
      )}

      {/* ── Word History ── */}
      {state.history.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 200, overflowY: 'auto', borderTop: '1.5px solid #fce7f3', paddingTop: 12 }}>
          <p style={{ margin: 0, fontSize: 8, fontWeight: 800, color: '#f9a8d4', textTransform: 'uppercase', letterSpacing: 2 }}>
            Words Discovered ({state.history.length})
          </p>
          {state.history.map((entry, i) => <HistoryRow key={`${entry.word}-${i}`} entry={entry} />)}
        </div>
      )}

      {/* ── Keyboard hint ── */}
      <p style={{ margin: 0, textAlign: 'center', fontSize: 8, fontWeight: 600, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: 1.2 }}>
        Enter ↩ Submit · Backspace ⌫ Remove tile · Esc ✕ Clear word
      </p>

      {/* ── CSS Animations ── */}
      <style>{`
        @keyframes wsg-pop-in {
          0%   { transform: scale(0.35) translateY(10px); opacity: 0; }
          70%  { transform: scale(1.08) translateY(-2px); opacity: 1; }
          100% { transform: scale(1)    translateY(0);    opacity: 1; }
        }
        @keyframes wsg-shake {
          0%,100% { transform: translateX(0); }
          18%     { transform: translateX(-7px); }
          36%     { transform: translateX(7px); }
          54%     { transform: translateX(-4px); }
          72%     { transform: translateX(4px); }
          90%     { transform: translateX(-2px); }
        }
        @keyframes wsg-slide-up {
          0%   { transform: translateY(12px); opacity: 0; }
          100% { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default WordScrambleGame;

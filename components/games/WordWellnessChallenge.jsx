import { useEffect, useMemo, useState } from 'react';

/* ═══════════════════════════════════════════════════════════════════════
   Word Wellness Challenge  ·  v3
   ─────────────────────────────────────────────────────────────────────
   KEY FIX: tiles are ALWAYS drawn from the challenge word's letters
   (shuffled + a few bonus extras) so the puzzle is always solvable.
═══════════════════════════════════════════════════════════════════════ */

/* ─── Scrabble point values ─────────────────────────────────────────── */
const PTS = {
  A:1, E:1, I:1, O:1, U:1, L:1, N:1, S:1, T:1, R:1,
  D:2, G:2, B:3, C:3, M:3, P:3,
  F:4, H:4, V:4, W:4, Y:4, K:5, J:8, X:8, Q:10, Z:10,
};

/* ─── Challenge words catalogue ─────────────────────────────────────── */
const CHALLENGES = [
  {
    word: 'NURTURE',
    hint: 'To nurture others, you must first nurture yourself.',
    emoji: '🌱',
    insight: 'Nurturing your body and mind is essential during postpartum recovery.',
  },
  {
    word: 'HEALING',
    hint: 'Healing is not linear — every day holds new progress.',
    emoji: '🌿',
    insight: 'The body knows how to heal. Your role is to give it rest, nourishment, and love.',
  },
  {
    word: 'BREATHE',
    hint: 'Each breath sends calm signals to every cell.',
    emoji: '🌬️',
    insight: 'Slow, deep breathing activates the parasympathetic nervous system in seconds.',
  },
  {
    word: 'BALANCE',
    hint: 'Balance is a gentle, daily negotiation — not perfection.',
    emoji: '⚖️',
    insight: 'Hormonal balance is restored gradually. Celebrate small wins every day.',
  },
  {
    word: 'NOURISH',
    hint: 'Nourishing food is medicine for your recovering body.',
    emoji: '🥗',
    insight: 'Nutrient-rich foods accelerate tissue repair and support milk production.',
  },
  {
    word: 'MINDFUL',
    hint: 'Mindfulness transforms ordinary moments into medicine.',
    emoji: '🧘',
    insight: 'Even 3 minutes of mindful breathing lowers cortisol by up to 25%.',
  },
  {
    word: 'BLOSSOM',
    hint: 'Like a flower, you blossom at your own natural pace.',
    emoji: '🌸',
    insight: 'Growth happens quietly. Trust the process of your recovery journey.',
  },
  {
    word: 'EMBRACE',
    hint: 'Embracing imperfection is the doorway to compassion.',
    emoji: '🤗',
    insight: 'Accepting where you are right now is the first step to true healing.',
  },
  {
    word: 'RESTORE',
    hint: 'Rest and restoration are not luxuries — they are medicine.',
    emoji: '🌙',
    insight: 'During deep rest, your body releases growth hormone to repair tissue.',
  },
  {
    word: 'SERENE',
    hint: 'A serene environment promotes hormonal balance.',
    emoji: '🌅',
    insight: 'Calm surroundings reduce adrenaline and support postpartum mood.',
  },
  {
    word: 'GENTLE',
    hint: 'Gentle movement and touch support the nervous system.',
    emoji: '🕊️',
    insight: 'Gentle exercise sends blood flow to healing tissues without overloading them.',
  },
  {
    word: 'MOTHER',
    hint: 'Becoming a mother is the most profound transformation.',
    emoji: '🌺',
    insight: 'Matrescence — the process of becoming a mother — is as powerful as adolescence.',
  },
  {
    word: 'HEALTH',
    hint: 'Your health is your most precious investment.',
    emoji: '💚',
    insight: 'Physical and emotional health are deeply intertwined during recovery.',
  },
  {
    word: 'STRONG',
    hint: 'Strength grows through every small act of self-care.',
    emoji: '💪',
    insight: 'You carried life. You are stronger than you have ever been given credit for.',
  },
  {
    word: 'GRATITUDE',
    hint: 'Gratitude rewires the brain toward positive resilience.',
    emoji: '🙏',
    insight: 'Practising daily gratitude is proven to elevate mood within 3 weeks.',
  },
  {
    word: 'RECOVERY',
    hint: 'Every step in recovery is worthy of celebration.',
    emoji: '🎉',
    insight: 'Recovery is a marathon, not a sprint. Each breath forward counts.',
  },
  {
    word: 'WELLNESS',
    hint: 'True wellness integrates body, mind, and spirit.',
    emoji: '🌟',
    insight: 'Holistic wellness includes physical repair, emotional safety, and community support.',
  },
  {
    word: 'STRENGTH',
    hint: 'Strength is built quietly through small daily acts.',
    emoji: '🌄',
    insight: 'The strength you grow during recovery will serve you for a lifetime.',
  },
];

/* ─── Bonus valid sub-words (also accepted for points) ──────────────── */
const BONUS_WORDS = new Set([
  'JOY','ZEN','AIR','HUG','NAP','SIP','SUN','TEA','RUN',
  'CALM','REST','LOVE','CARE','HEAL','HOPE','SAFE','WARM','YOGA',
  'MILK','WALK','BOND','GLOW','DEEP','SOUL','RISE','PURE','FOOD',
  'MOVE','SONG','SLEEP','PEACE','GRACE','TRUST','SMILE','BIRTH',
  'LIGHT','HEART','EARTH','WATER','QUIET','BRAVE','OASIS','BLOOM',
  'SHORE','TENDER','NATURE','ENERGY','SERENE','SOLACE','MOTHER',
  'GENTLE','HEALTH','STRONG','NOURISH','MINDFUL','BALANCE','EMBRACE',
  'NURTURE','BLOSSOM','RADIANT','HEALING','BREATHE','RECOVER',
  'RESTORE','WELLNESS','STRENGTH','RECOVERY','GRATEFUL','GRATITUDE',
]);

/* ─── localStorage helpers ──────────────────────────────────────────── */
const LS_KEY = 'afterma_wwc_v3';
const todayStr = () => new Date().toISOString().slice(0, 10);

const loadSave = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return s;
  } catch { return null; }
};

const savePatch = (patch) => {
  try {
    const prev = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    localStorage.setItem(LS_KEY, JSON.stringify({ ...prev, ...patch }));
  } catch { /* silent */ }
};

/* ─── Get challenge by index ────────────────────────────────────────── */
const getChallengeAt = (idx) => CHALLENGES[((idx % CHALLENGES.length) + CHALLENGES.length) % CHALLENGES.length];

const todayChallenge = () => {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return { challenge: CHALLENGES[dayOfYear % CHALLENGES.length], startIdx: dayOfYear % CHALLENGES.length };
};

/* ─── Build tile rack from challenge word + a few bonus extras ───────
   Strategy:
   1. Take every letter of the challenge word (preserving duplicates)
   2. Add 1-2 common bonus letters to pad to ≥8 tiles (makes it feel like real Scrabble)
   3. Shuffle the whole rack
   This guarantees the challenge word can always be formed.
─────────────────────────────────────────────────────────────────────── */
const EXTRA_LETTERS = ['E','A','I','O','S','T','R','N','L','E','A'];
const buildRack = (word) => {
  const wordLetters = word.split('').map((letter, i) => ({
    id: `word-${i}-${letter}`,
    letter,
    fromWord: true,  // this letter is part of the challenge word
  }));

  // Add 1-2 random extras (if word is short, add more for variety)
  const extraCount = word.length <= 5 ? 2 : 1;
  const extras = Array.from({ length: extraCount }, (_, i) => {
    const l = EXTRA_LETTERS[Math.floor(Math.random() * EXTRA_LETTERS.length)];
    return { id: `extra-${i}-${l}`, letter: l, fromWord: false };
  });

  // Shuffle combined array
  const all = [...wordLetters, ...extras];
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all;
};

/* ─── Scoring ───────────────────────────────────────────────────────── */
const scoreWord = (word, isChallengeWord) => {
  const len = word.length;
  const letterScore = word.split('').reduce((s, c) => s + (PTS[c] || 1), 0);
  const lengthBonus = len >= 7 ? 20 : len >= 5 ? 10 : 5;
  const challengeBonus = isChallengeWord ? 25 : 0;
  return letterScore + lengthBonus + challengeBonus;
};

/* ─── Tile component ────────────────────────────────────────────────── */
const Tile = ({ tile, onClick, variant = 'rack', disabled = false }) => {
  const pts = PTS[tile.letter] || 1;
  const isGhosted = disabled && variant === 'rack';

  const rackStyle = {
    background: isGhosted ? '#f1f5f9' : 'linear-gradient(155deg, #ffffff, #fdf2f8)',
    border: `2px solid ${isGhosted ? '#e2e8f0' : tile.fromWord ? '#f9a8d4' : '#fbcfe8'}`,
    boxShadow: isGhosted ? 'none' : '0 3px 12px rgba(244,114,182,0.2), 0 1px 3px rgba(0,0,0,0.06)',
    opacity: isGhosted ? 0.3 : 1,
    cursor: isGhosted ? 'default' : 'pointer',
    color: isGhosted ? '#cbd5e1' : '#1e293b',
  };

  const builtStyle = {
    background: 'linear-gradient(155deg, #fce7f3, #fdf2f8)',
    border: '2px solid #f9a8d4',
    boxShadow: '0 3px 12px rgba(244,114,182,0.3)',
    opacity: 1,
    cursor: 'pointer',
    color: '#be185d',
  };

  const st = variant === 'built' ? builtStyle : rackStyle;

  return (
    <button
      onClick={() => !isGhosted && onClick(tile.id)}
      disabled={isGhosted}
      aria-label={`Letter ${tile.letter}, ${pts} point${pts !== 1 ? 's' : ''}`}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: variant === 'built' ? 42 : 46,
        height: variant === 'built' ? 48 : 54,
        borderRadius: 11,
        flexShrink: 0,
        outline: 'none',
        transition: 'transform 0.14s cubic-bezier(0.34,1.56,0.64,1), opacity 0.14s ease',
        ...st,
      }}
      onMouseEnter={e => { if (!isGhosted) e.currentTarget.style.transform = 'translateY(-5px) scale(1.09)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
      onMouseDown={e => { if (!isGhosted) e.currentTarget.style.transform = 'scale(0.91)'; }}
      onMouseUp={e => { if (!isGhosted) e.currentTarget.style.transform = 'translateY(-5px) scale(1.09)'; }}
    >
      <span style={{
        fontSize: variant === 'built' ? 20 : 22,
        fontWeight: 900,
        lineHeight: 1,
        fontFamily: 'Georgia, "Times New Roman", serif',
        letterSpacing: -0.5,
        color: st.color,
      }}>
        {tile.letter}
      </span>
      <span style={{ fontSize: 7, fontWeight: 700, color: variant === 'built' ? '#f9a8d4' : isGhosted ? '#cbd5e1' : '#94a3b8', lineHeight: 1, marginTop: 2 }}>
        {pts}
      </span>
    </button>
  );
};

/* ─── Score history row ─────────────────────────────────────────────── */
const HistoryRow = ({ entry }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '8px 12px',
    background: entry.isChallenge ? 'linear-gradient(90deg,#fef9c3,#fef3c7)' : 'rgba(248,250,252,0.9)',
    borderRadius: 14,
    border: `1.5px solid ${entry.isChallenge ? '#fcd34d' : '#f1f5f9'}`,
    animation: 'wwc-fadein 0.3s ease both',
  }}>
    <span style={{ fontSize: 18 }}>{entry.emoji}</span>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontWeight: 900, fontSize: 13, color: '#0f172a', fontFamily: 'Georgia, serif', letterSpacing: 1.5 }}>
          {entry.word}
        </span>
        {entry.isChallenge && (
          <span style={{ fontSize: 8, fontWeight: 800, background: '#fbbf24', color: '#7c3aed', padding: '2px 7px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1 }}>
            Challenge ★
          </span>
        )}
      </div>
      <p style={{ fontSize: 10, color: '#64748b', margin: '2px 0 0', lineHeight: 1.45, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        {entry.insight}
      </p>
    </div>
    <span style={{ fontWeight: 900, fontSize: 14, color: '#db2777', whiteSpace: 'nowrap' }}>+{entry.points}</span>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════
   Main Component
═══════════════════════════════════════════════════════════════════════ */
const WordWellnessChallenge = () => {
  const { challenge: initialChallenge, startIdx } = useMemo(() => todayChallenge(), []);

  /* ── Saved state ── */
  const saved = useMemo(() => {
    const s = loadSave();
    if (!s || s.dateKey !== todayStr()) return null;
    return s;
  }, []); // eslint-disable-line

  /* ── Round tracking ── */
  const [roundIdx, setRoundIdx] = useState(saved?.roundIdx ?? startIdx);
  const [round, setRound] = useState(saved?.round ?? 1);
  const [showRoundComplete, setShowRoundComplete] = useState(false);
  const [confetti, setConfetti] = useState([]);

  const challenge = useMemo(() => getChallengeAt(roundIdx), [roundIdx]);

  /* ── Core state ── */
  const [rack, setRack] = useState(() => buildRack(challenge.word));
  const [built, setBuilt] = useState([]);
  const [score, setScore] = useState(saved?.score ?? 0);
  const [history, setHistory] = useState(saved?.history ?? []);
  const [usedWords, setUsedWords] = useState(saved?.usedWords ?? []);
  const [challengeDone, setChallengeDone] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [feedbackSeq, setFeedbackSeq] = useState(0);
  const [shaking, setShaking] = useState(false);

  /* ── Persist on important state changes ── */
  useEffect(() => {
    savePatch({ score, history, usedWords, challengeDone, roundIdx, round, dateKey: todayStr(), challengeWord: challenge.word });
  }, [score, history, usedWords, challengeDone, roundIdx, round, challenge.word]);

  /* ── Keyboard support ── */
  useEffect(() => {
    const onKey = (e) => {
      const active = document.activeElement;
      const isInInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
      if (isInInput) return;

      if (e.key === 'Enter') { e.preventDefault(); handleSubmit(); }
      if (e.key === 'Backspace') { e.preventDefault(); handleRemoveLast(); }
      if (e.key === 'Escape') { e.preventDefault(); handleClear(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }); // no deps — always reads latest state via closures called directly

  /* ── Pick tile from rack → add to builder ── */
  const handlePick = (id) => {
    const tile = rack.find(t => t.id === id);
    if (!tile) return;
    setRack(prev => prev.map(t => t.id === id ? { ...t, selected: true } : t));
    setBuilt(prev => [...prev, tile]);
    setFeedback(null);
  };

  /* ── Remove tile from builder → return to rack ── */
  const handleUnpick = (id) => {
    const tile = built.find(t => t.id === id);
    if (!tile) return;
    setBuilt(prev => prev.filter(t => t.id !== id));
    setRack(prev => prev.map(t => t.id === id ? { ...t, selected: false } : t));
    setFeedback(null);
  };

  /* ── Remove last built tile (keyboard backspace) ── */
  const handleRemoveLast = () => {
    if (built.length === 0) return;
    const last = built[built.length - 1];
    handleUnpick(last.id);
  };

  /* ── Clear all ── */
  const handleClear = () => {
    setBuilt([]);
    setRack(prev => prev.map(t => ({ ...t, selected: false })));
    setFeedback(null);
  };

  /* ── Shuffle rack (only unselected tiles) ── */
  const handleShuffle = () => {
    setRack(prev => {
      const copy = [...prev];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    });
  };

  /* ── Submit ── */
  const handleSubmit = () => {
    const word = built.map(t => t.letter).join('');

    if (word.length < 3) {
      showError('Word must be at least 3 letters long.');
      return;
    }
    if (usedWords.includes(word)) {
      showError(`"${word}" already scored! Try a different word.`);
      return;
    }

    const isChallenge = word === challenge.word;
    const isBonus = BONUS_WORDS.has(word);

    if (!isChallenge && !isBonus) {
      showError(`"${word}" is not a recognised wellness word. Try again!`);
      return;
    }

    const pts = scoreWord(word, isChallenge);
    const insight = isChallenge ? challenge.insight : getInsight(word);
    const emoji = isChallenge ? challenge.emoji : getEmoji(word);

    const entry = { word, points: pts, insight, emoji, isChallenge };

    const newScore = score + pts;
    const newHistory = [entry, ...history];
    const newUsed = [...usedWords, word];

    setScore(newScore);
    setHistory(newHistory);
    setUsedWords(newUsed);

    if (isChallenge) {
      setChallengeDone(true);
      // Spawn confetti
      setConfetti(Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${10 + Math.random() * 80}%`,
        delay: `${Math.random() * 0.4}s`,
        color: ['#ec4899','#f59e0b','#10b981','#6366f1','#f472b6','#34d399'][i % 6],
        size: 6 + Math.random() * 6,
      })));
      // Show celebration overlay after short delay
      setTimeout(() => setShowRoundComplete(true), 600);
    }

    // Reset tiles — rebuild rack with new shuffle
    setBuilt([]);
    setRack(buildRack(challenge.word));

    // Show success feedback
    setFeedback({ type: isChallenge ? 'challenge' : 'success', word, pts, insight, emoji, isChallenge });
    setFeedbackSeq(s => s + 1);
  };

  /* ── Start next round ── */
  const handleNextRound = () => {
    const nextIdx = (roundIdx + 1) % CHALLENGES.length;
    const nextChallenge = getChallengeAt(nextIdx);
    setRoundIdx(nextIdx);
    setRound(r => r + 1);
    setRack(buildRack(nextChallenge.word));
    setBuilt([]);
    setUsedWords([]);
    setChallengeDone(false);
    setFeedback(null);
    setShowRoundComplete(false);
    setConfetti([]);
  };

  /* ── Shake the rack ── */
  const showError = (msg) => {
    setFeedback({ type: 'error', message: msg });
    setFeedbackSeq(s => s + 1);
    setShaking(true);
    setTimeout(() => setShaking(false), 450);
  };

  /* ── Derived ── */
  const builtWord = built.map(t => t.letter).join('');

  const wordPreview = useMemo(() => {
    if (builtWord.length < 3) return null;
    if (usedWords.includes(builtWord)) return { status: 'used', msg: `"${builtWord}" already scored` };
    if (builtWord === challenge.word) return { status: 'challenge', msg: `✨ Challenge word! +25 bonus` };
    if (BONUS_WORDS.has(builtWord)) return { status: 'valid', msg: `✓ "${builtWord}" — valid wellness word` };
    return { status: 'invalid', msg: `"${builtWord}" — not in the wellness list` };
  }, [builtWord, usedWords, challenge.word]);

  const previewColor = !wordPreview ? '#94a3b8' :
    wordPreview.status === 'challenge' ? '#7c3aed' :
    wordPreview.status === 'valid'     ? '#059669' :
    wordPreview.status === 'used'      ? '#d97706' : '#94a3b8';

  /* ── Styles ── */
  const card = {
    background: 'linear-gradient(160deg, rgba(255,255,255,0.94), rgba(253,242,248,0.90))',
    borderRadius: 28,
    border: '1.5px solid rgba(251,207,232,0.75)',
    boxShadow: '0 8px 40px rgba(236,72,153,0.09), 0 2px 12px rgba(0,0,0,0.05)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    padding: '20px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    userSelect: 'none',
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
    position: 'relative',   // needed for overlay positioning
    overflow: 'hidden',     // clip the overlay to the card border
  };

  return (
    <div style={card} role="application" aria-label="Word Wellness Challenge">

      {/* ── Round Complete Celebration Overlay ── */}
      {showRoundComplete && (
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 28,
          background: 'linear-gradient(160deg,rgba(255,255,255,0.97),rgba(253,242,248,0.97))',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 18,
          zIndex: 10,
          animation: 'wwc-slideup 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
          padding: 24,
        }}>
          {/* Confetti burst */}
          {confetti.map(p => (
            <div key={p.id} style={{
              position: 'absolute',
              left: p.left,
              top: `-${p.size}px`,
              width: p.size,
              height: p.size,
              borderRadius: 2,
              background: p.color,
              animation: `wwc-confetti 1.2s ${p.delay} ease-in both`,
              pointerEvents: 'none',
            }} />
          ))}

          {/* Trophy & stars */}
          <div style={{ fontSize: 52, lineHeight: 1, animation: 'wwc-bounce 0.6s 0.2s cubic-bezier(0.34,1.56,0.64,1) both' }}>🏆</div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#f9a8d4', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>
              Round {round} Complete!
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', fontFamily: 'Georgia, serif', letterSpacing: 1 }}>
              {challenge.word}
            </div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 8, lineHeight: 1.5, maxWidth: 220 }}>
              {challenge.insight}
            </div>
          </div>

          {/* Score earned this round */}
          <div style={{
            background: 'linear-gradient(135deg,#fce7f3,#fdf2f8)',
            borderRadius: 16,
            padding: '10px 24px',
            border: '1.5px solid #f9a8d4',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 30, fontWeight: 900, color: '#db2777' }}>{score}</div>
            <div style={{ fontSize: 8, fontWeight: 800, color: '#f9a8d4', textTransform: 'uppercase', letterSpacing: 1.5 }}>Total Points</div>
          </div>

          {/* Next Round button */}
          <button
            onClick={handleNextRound}
            style={{
              padding: '14px 32px',
              borderRadius: 18,
              border: 'none',
              background: 'linear-gradient(135deg, #ec4899, #be185d)',
              color: '#fff',
              fontWeight: 900,
              fontSize: 13,
              textTransform: 'uppercase',
              letterSpacing: 1.8,
              cursor: 'pointer',
              boxShadow: '0 6px 24px rgba(236,72,153,0.45)',
              animation: 'wwc-bounce 0.5s 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
            }}
          >
            Next Round →
          </button>

          <p style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.2, margin: 0 }}>
            Next word: {getChallengeAt(roundIdx + 1).word.length} letters ·  {getChallengeAt(roundIdx + 1).emoji}
          </p>
        </div>
      )}

      {/* ── Header row ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ margin: 0, fontWeight: 900, fontSize: 15, color: '#0f172a', letterSpacing: -0.4 }}>
            Word Wellness Challenge
          </h4>
          <p style={{ margin: '3px 0 0', fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1.5 }}>
            Round {round} · {challenge.word.length} letters
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#db2777', lineHeight: 1 }}>{score}</div>
          <div style={{ fontSize: 7, fontWeight: 800, color: '#f9a8d4', textTransform: 'uppercase', letterSpacing: 1.2 }}>total pts</div>
        </div>
      </div>

      {/* ── Challenge Banner ── */}
      <div style={{
        borderRadius: 16,
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: challengeDone
          ? 'linear-gradient(90deg,#d1fae5,#a7f3d0)'
          : 'linear-gradient(90deg,#fef9c3,#fef3c7)',
        border: `1.5px solid ${challengeDone ? '#6ee7b7' : '#fcd34d'}`,
      }}>
        <span style={{ fontSize: 22 }}>{challengeDone ? '✅' : challenge.emoji}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.8, color: challengeDone ? '#065f46' : '#92400e' }}>
            {challengeDone ? "Today's Challenge — Complete! 🎉" : "Today's Challenge"}
          </p>
          {!challengeDone && (
            <>
              {/* Show the target word as letter blanks — gives a hint without spoiling */}
              <div style={{ display: 'flex', gap: 5, marginTop: 5, flexWrap: 'wrap' }}>
                {challenge.word.split('').map((_, i) => (
                  <div key={i} style={{
                    width: 22, height: 24, borderRadius: 5,
                    border: '1.5px solid #fbbf24',
                    background: builtWord[i] ? '#fff7ed' : 'rgba(255,251,235,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 900, color: '#92400e',
                    fontFamily: 'Georgia, serif',
                    boxShadow: builtWord[i] ? '0 2px 6px rgba(251,191,36,0.3)' : 'none',
                    transition: 'all 0.2s ease',
                  }}>
                    {builtWord[i] || ''}
                  </div>
                ))}
              </div>
              <p style={{ margin: '5px 0 0', fontSize: 9, color: '#a16207', fontStyle: 'italic', lineHeight: 1.4 }}>
                💡 {challenge.hint}
              </p>
            </>
          )}
        </div>
        {!challengeDone && (
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#d97706' }}>+25</div>
            <div style={{ fontSize: 7, fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: 1 }}>bonus</div>
          </div>
        )}
      </div>

      {/* ── Word Builder Area ── */}
      <div style={{
        minHeight: 68,
        background: 'rgba(253,242,248,0.5)',
        borderRadius: 18,
        border: '2px dashed #fbcfe8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: built.length ? 'flex-start' : 'center',
        padding: '10px 12px',
        gap: 6,
        flexWrap: 'wrap',
        transition: 'background 0.2s',
      }}>
        {built.length === 0 ? (
          <p style={{ fontSize: 10, fontWeight: 700, color: '#f9a8d4', textTransform: 'uppercase', letterSpacing: 1.5, margin: 0 }}>
            Tap tiles below ↓ to build your word
          </p>
        ) : (
          built.map(tile => (
            <div key={tile.id} style={{ animation: 'wwc-popin 0.2s cubic-bezier(0.34,1.56,0.64,1) both' }}>
              <Tile tile={tile} variant="built" onClick={handleUnpick} />
            </div>
          ))
        )}
      </div>

      {/* ── Live word preview ── */}
      <div style={{ minHeight: 16, textAlign: 'center', fontSize: 10, fontWeight: 700, color: previewColor, transition: 'color 0.2s' }}>
        {wordPreview?.msg ?? (builtWord.length > 0 && builtWord.length < 3 ? 'Keep adding letters…' : '')}
      </div>

      {/* ── Tile Rack ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 6,
          flexWrap: 'wrap',
          animation: shaking ? 'wwc-shake 0.42s ease both' : 'none',
        }}
      >
        {rack.map(tile => (
          <Tile
            key={tile.id}
            tile={tile}
            variant="rack"
            disabled={!!tile.selected}
            onClick={handlePick}
          />
        ))}
      </div>

      {/* ── Rack hint ── */}
      <p style={{ margin: 0, textAlign: 'center', fontSize: 9, fontWeight: 600, color: '#cbd5e1', letterSpacing: 0.5 }}>
        All tiles above can spell today's challenge word
      </p>

      {/* ── Action Buttons ── */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handleClear}
          disabled={built.length === 0}
          style={{
            flex: 1, padding: '11px 0', borderRadius: 14, border: 'none',
            background: built.length === 0 ? '#f1f5f9' : '#fce7f3',
            color: built.length === 0 ? '#cbd5e1' : '#be185d',
            fontWeight: 800, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5,
            cursor: built.length === 0 ? 'default' : 'pointer',
            transition: 'all 0.18s',
          }}
        >
          ↩ Clear
        </button>

        <button
          onClick={handleShuffle}
          style={{
            flex: 1, padding: '11px 0', borderRadius: 14, border: 'none',
            background: '#f0fdf4', color: '#15803d',
            fontWeight: 800, fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5,
            cursor: 'pointer', transition: 'all 0.18s',
          }}
        >
          🔀 Shuffle
        </button>

        <button
          onClick={handleSubmit}
          disabled={built.length < 3}
          style={{
            flex: 2, padding: '11px 0', borderRadius: 14, border: 'none',
            background: built.length >= 3
              ? 'linear-gradient(135deg, #ec4899, #be185d)'
              : '#f1f5f9',
            color: built.length >= 3 ? '#ffffff' : '#cbd5e1',
            fontWeight: 900, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.5,
            cursor: built.length >= 3 ? 'pointer' : 'default',
            boxShadow: built.length >= 3 ? '0 4px 16px rgba(236,72,153,0.38)' : 'none',
            transition: 'all 0.18s',
          }}
        >
          Submit ✓
        </button>
      </div>

      {/* ── Feedback Toast ── */}
      {feedback && (
        <div
          key={feedbackSeq}
          style={{
            borderRadius: 18,
            padding: '14px 16px',
            background: feedback.type === 'error'
              ? 'linear-gradient(90deg,#fff1f2,#ffe4e6)'
              : feedback.type === 'challenge'
                ? 'linear-gradient(135deg,#fef9c3,#fde68a)'
                : 'linear-gradient(90deg,#f0fdf4,#dcfce7)',
            border: `1.5px solid ${feedback.type === 'error' ? '#fecdd3' : feedback.type === 'challenge' ? '#fcd34d' : '#bbf7d0'}`,
            animation: 'wwc-slideup 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
          }}
        >
          {feedback.type === 'error' ? (
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#be123c' }}>
              ⚠️ {feedback.message}
            </p>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 26 }}>{feedback.emoji}</span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontWeight: 900, fontSize: 16, fontFamily: 'Georgia, serif', letterSpacing: 2, color: feedback.type === 'challenge' ? '#78350f' : '#065f46' }}>
                      {feedback.word}
                    </span>
                    <span style={{ fontWeight: 900, fontSize: 13, color: '#db2777' }}>
                      +{feedback.pts} pts
                    </span>
                  </div>
                  {feedback.type === 'challenge' && (
                    <div style={{ fontSize: 9, fontWeight: 800, color: '#d97706', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 2 }}>
                      🎉 Challenge Bonus! +25 included
                    </div>
                  )}
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 10, color: '#374151', lineHeight: 1.55, borderTop: `1px solid ${feedback.type === 'challenge' ? '#fcd34d' : '#bbf7d0'}`, paddingTop: 8 }}>
                💡 {feedback.insight}
              </p>
            </>
          )}
        </div>
      )}

      {/* ── Word History ── */}
      {history.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 210, overflowY: 'auto', borderTop: '1.5px solid #fce7f3', paddingTop: 12 }}>
          <p style={{ margin: 0, fontSize: 8, fontWeight: 800, color: '#f9a8d4', textTransform: 'uppercase', letterSpacing: 2 }}>
            Words Discovered ({history.length})
          </p>
          {history.map((e, i) => <HistoryRow key={`${e.word}-${i}`} entry={e} />)}
        </div>
      )}

      {/* ── Keyboard hint ── */}
      <p style={{ margin: 0, textAlign: 'center', fontSize: 8, fontWeight: 600, color: '#e2e8f0', textTransform: 'uppercase', letterSpacing: 1.2 }}>
        Enter ↩ Submit · Backspace ⌫ Remove last · Esc ✕ Clear
      </p>

      {/* ── Keyframe CSS ── */}
      <style>{`
        @keyframes wwc-popin {
          0%   { transform: scale(0.3) translateY(10px); opacity: 0; }
          65%  { transform: scale(1.1) translateY(-3px); opacity: 1; }
          100% { transform: scale(1)   translateY(0);    opacity: 1; }
        }
        @keyframes wwc-shake {
          0%,100% { transform: translateX(0); }
          15%     { transform: translateX(-8px); }
          35%     { transform: translateX(8px); }
          50%     { transform: translateX(-5px); }
          70%     { transform: translateX(5px); }
          85%     { transform: translateX(-3px); }
        }
        @keyframes wwc-slideup {
          0%   { transform: translateY(14px) scale(0.96); opacity: 0; }
          100% { transform: translateY(0)    scale(1);    opacity: 1; }
        }
        @keyframes wwc-fadein {
          0%   { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes wwc-bounce {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes wwc-confetti {
          0%   { transform: translateY(0) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(320px) rotate(540deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

/* ── Fallback insight/emoji for sub-word matches ── */
const WORD_META = {
  JOY:{ insight:'Joy is medicine for the healing heart.',emoji:'✨' },
  ZEN:{ insight:'A calm mind accelerates recovery.',emoji:'🧘' },
  AIR:{ insight:'Fresh air and deep breaths reduce cortisol.',emoji:'🌬️' },
  HUG:{ insight:'Hugs release oxytocin — the bonding hormone.',emoji:'🤗' },
  NAP:{ insight:'Short naps restore energy and hormonal balance.',emoji:'💤' },
  REST:{ insight:'Rest is the body\'s most powerful recovery tool.',emoji:'😴' },
  LOVE:{ insight:'Self-love is not selfish — it\'s the root of good mothering.',emoji:'❤️' },
  CARE:{ insight:'Caring for yourself helps you care better for your baby.',emoji:'🌸' },
  HEAL:{ insight:'Every day is a small step in your healing journey.',emoji:'🌿' },
  HOPE:{ insight:'Hope is a powerful medicine for emotional recovery.',emoji:'🌅' },
  SAFE:{ insight:'Feeling safe accelerates every dimension of healing.',emoji:'🛡️' },
  CALM:{ insight:'Calmness is a superpower during the postpartum period.',emoji:'🌊' },
  YOGA:{ insight:'Gentle yoga accelerates postpartum physical recovery.',emoji:'🧘‍♀️' },
  WALK:{ insight:'Walking boosts mood through endorphin release.',emoji:'🚶‍♀️' },
  BOND:{ insight:'Bonding with your baby strengthens both your wellbeing.',emoji:'👶' },
  SOUL:{ insight:'Nourishing your soul is as important as your body.',emoji:'🌟' },
  SLEEP:{ insight:'Sleep is your body\'s most powerful recovery tool.',emoji:'🌙' },
  PEACE:{ insight:'Inner peace is cultivated one mindful moment at a time.',emoji:'☮️' },
  HEART:{ insight:'A grateful heart is the cornerstone of emotional resilience.',emoji:'💗' },
  WATER:{ insight:'Staying hydrated supports milk production and healing.',emoji:'💧' },
  BRAVE:{ insight:'You are braver than you have ever been given credit for.',emoji:'🦁' },
  TRUST:{ insight:'Trusting your instincts strengthens the mother-baby bond.',emoji:'🤝' },
  BLOOM:{ insight:'Like a flower, you bloom at your own natural pace.',emoji:'🌸' },
  EARTH:{ insight:'Grounding in nature reduces cortisol by up to 20%.',emoji:'🌍' },
};
const FALLBACK_INSIGHT = { insight: 'Every positive word you choose shapes your recovery mindset.', emoji: '💎' };
const getInsight = w => (WORD_META[w] || FALLBACK_INSIGHT).insight;
const getEmoji   = w => (WORD_META[w] || FALLBACK_INSIGHT).emoji;

export default WordWellnessChallenge;

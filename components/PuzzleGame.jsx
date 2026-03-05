import { useState } from 'react';

/* ── Tile Puzzle Game ─────────────────────────────────────────────────────── 
   3×3 sliding tile puzzle with an SVG-based wellness illustration.
   One empty tile (index 8 = bottom-right). Tiles move when adjacent to empty.
   On solve: confetti burst + encouragement message.
 ──────────────────────────────────────────────────────────────────────────── */

const PuzzleGame = ({ onSolve }) => {
  const [gridSize, setGridSize] = useState(3);
  
  const solvableShuffle = (arr, grid) => {
    const a = [...arr];
    let inversions = 0;
    do {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      inversions = 0;
      const blankVal = grid * grid - 1;
      const blankIdx = a.indexOf(blankVal);
      for (let i = 0; i < a.length - 1; i++) {
        for (let j = i + 1; j < a.length; j++) {
          if (a[i] !== blankVal && a[j] !== blankVal && a[i] > a[j]) inversions++;
        }
      }
      
      const isOddGrid = grid % 2 !== 0;
      const blankRowFromBottom = grid - Math.floor(blankIdx / grid);
      
      if (isOddGrid) {
        if (inversions % 2 === 0) break;
      } else {
        if (blankRowFromBottom % 2 !== 0 && inversions % 2 === 0) break;
        if (blankRowFromBottom % 2 === 0 && inversions % 2 !== 0) break;
      }
    } while (true);
    return a;
  };

  const getSolvedState = (grid) => Array.from({ length: grid * grid }, (_, i) => i);

  const [tiles, setTiles] = useState(() => solvableShuffle(getSolvedState(3), 3));
  const [solved, setSolved] = useState(false);
  const [moves, setMoves] = useState(0);
  const [confetti, setConfetti] = useState([]);

  const emptyVal = gridSize * gridSize - 1;
  const emptyIdx = tiles.indexOf(emptyVal);

  const isSolved = (t) => t.every((v, i) => v === i);

  const handleTileClick = (clickedPos) => {
    if (solved) return;
    const row = Math.floor(clickedPos / gridSize);
    const col = clickedPos % gridSize;
    const eRow = Math.floor(emptyIdx / gridSize);
    const eCol = emptyIdx % gridSize;

    const adjacent =
      (Math.abs(row - eRow) === 1 && col === eCol) ||
      (Math.abs(col - eCol) === 1 && row === eRow);

    if (!adjacent) return;

    const next = [...tiles];
    [next[clickedPos], next[emptyIdx]] = [next[emptyIdx], next[clickedPos]];
    setTiles(next);
    setMoves(m => m + 1);

    if (isSolved(next)) {
      setSolved(true);
      setConfetti(Array.from({ length: 30 }, (_, i) => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 60}%`,
        backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        animationDelay: `${Math.random() * 0.5}s`,
        transform: `rotate(${Math.random() * 360}deg)`,
      })));
      if (onSolve) onSolve();
    }
  };

  const resetGame = (newGrid = gridSize) => {
    setGridSize(newGrid);
    setTiles(solvableShuffle(getSolvedState(newGrid), newGrid));
    setSolved(false);
    setMoves(0);
    setConfetti([]);
  };

  const TILE_SIZE = gridSize === 3 ? 90 : (gridSize === 4 ? 66 : 52); // Keep total wrapper width around ~270px
  const GAP = 4;

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 space-y-5 relative overflow-hidden">
      {confetti.map((s, i) => <ConfettiPiece key={i} style={s} />)}

      <div className="flex items-center justify-between">
        <div className="space-y-0.5 text-left">
          <h4 className="font-black text-slate-900 tracking-tight">Recovery Puzzle</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Arrange tiles to complete picture</p>
        </div>
        <div className="flex items-center gap-2 flex-col items-end">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{moves} moves</span>
          <button onClick={() => resetGame()} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-bold text-[9px] uppercase tracking-widest transition-all">
            Shuffle
          </button>
        </div>
      </div>

      {solved && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 text-center animate-in slide-in-from-top-2 duration-500">
          <p className="font-black text-emerald-700 text-xs">🌟 Excellent focus!</p>
          <p className="text-[9px] font-bold text-emerald-500 mt-1 uppercase tracking-widest">
            Solved {gridSize}x{gridSize} in {moves} moves
          </p>
        </div>
      )}

      {/* Grid */}
      <div
        className="mx-auto select-none"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, ${TILE_SIZE}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${TILE_SIZE}px)`,
          gap: GAP,
          width: gridSize * TILE_SIZE + (gridSize - 1) * GAP,
        }}
      >
        {tiles.map((tileNum, pos) => {
          const isBlank = tileNum === emptyVal;
          return (
            <button
              key={pos}
              onClick={() => handleTileClick(pos)}
              style={{ width: TILE_SIZE, height: TILE_SIZE }}
              className={`rounded-2xl overflow-hidden transition-all duration-200 focus:outline-none ${
                isBlank ? 'bg-slate-100 cursor-default border-2 border-dashed border-slate-200' : 'border border-slate-100 shadow-sm hover:scale-[1.03] active:scale-95 cursor-pointer'
              }`}
              disabled={isBlank}
            >
              {!isBlank && <WomanIllustration tileIndex={tileNum} size={TILE_SIZE} />}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 justify-center">
        <DifficultyBtn active={gridSize === 3} onClick={() => resetGame(3)} label="3×3 (Easy)" />
        <DifficultyBtn active={gridSize === 4} onClick={() => resetGame(4)} label="4×4 (Med)" />
        <DifficultyBtn active={gridSize === 5} onClick={() => resetGame(5)} label="5×5 (Hard)" />
      </div>
    </div>
  );
};

const DifficultyBtn = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full border transition-all ${
      active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
    }`}
  >
    {label}
  </button>
);

export default PuzzleGame;

const CONFETTI_COLORS = ['#fbbf24', '#f87171', '#34d399', '#60a5fa', '#a78bfa', '#f472b6'];

const ConfettiPiece = ({ style }) => (
  <div
    className="absolute w-2 h-2 rounded-sm z-50 animate-bounce"
    style={{ ...style, transition: 'all 0.5s ease-out' }}
  />
);

const WomanIllustration = ({ tileIndex, size }) => {
  // Simple scalable geometric illustration of a woman doing yoga/stretching.
  // We'll scale it to cover 300x300, and shift the viewBox based on the tile we want.
  
  // E.g. for a 3x3 grid, each piece is 100x100 of this 300x300 canvas.
  const GRID_COLS = Math.sqrt(size > 80 ? 9 : (size > 60 ? 16 : 25)); // 3, 4, or 5 based on passed size
  const pieceSize = 300 / GRID_COLS;
  const col = tileIndex % GRID_COLS;
  const row = Math.floor(tileIndex / GRID_COLS);
  
  return (
    <div style={{ width: size, height: size, overflow: 'hidden' }}>
      <svg
        viewBox={`${col * pieceSize} ${row * pieceSize} ${pieceSize} ${pieceSize}`}
        width={300}
        height={300}
        style={{ transformOrigin: 'top left', transform: `scale(${size / pieceSize})` }}
      >
        <rect width="300" height="300" fill="#f8fafc" />
        <circle cx="150" cy="150" r="120" fill="#fce7f3" />
        {/* Simple stick figure / yoga pose */}
        <path d="M150 90 L150 180" stroke="#fb7185" strokeWidth="12" strokeLinecap="round" />
        <circle cx="150" cy="60" r="25" fill="#fb7185" />
        {/* Arms */}
        <path d="M150 110 Q100 80 80 50" fill="none" stroke="#fb7185" strokeWidth="10" strokeLinecap="round" />
        <path d="M150 110 Q200 80 220 50" fill="none" stroke="#fb7185" strokeWidth="10" strokeLinecap="round" />
        {/* Legs */}
        <path d="M150 180 Q100 230 110 270" fill="none" stroke="#fb7185" strokeWidth="14" strokeLinecap="round" />
        <path d="M150 180 Q200 230 190 270" fill="none" stroke="#fb7185" strokeWidth="14" strokeLinecap="round" />
        {/* Ground */}
        <line x1="80" y1="280" x2="220" y2="280" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
      </svg>
    </div>
  );
};

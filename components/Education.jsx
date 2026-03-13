
import { ArrowRight, Book, ChevronRight, ExternalLink, FileText, HeartPulse, Play, PlayCircle, ShieldCheck, Star, Users, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ARTICLES, GOVT_SCHEMES, TRUSTED_PICKS, VIDEO_LIBRARY } from '../constants';
import { translations } from '../translations';
import SurveyCommunityData from './SurveyCommunityData';
import Footer from './Footer';

/* ─────────────────────────────────────────────────────────────────────────
   Background Portal + Parallax
   Renders the fixed background image directly into <body> via a portal so
   that no parent overflow:hidden can clip it.
───────────────────────────────────────────────────────────────────────── */
const LearningCenterBackground = () => {
  const imgRef = useRef(null);
  const rafRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  /* Smooth lerp animation loop */
  const animate = useCallback(() => {
    currentRef.current.x += (targetRef.current.x - currentRef.current.x) * 0.07;
    currentRef.current.y += (targetRef.current.y - currentRef.current.y) * 0.07;

    if (imgRef.current) {
      imgRef.current.style.transform =
        `translate(calc(-50% + ${currentRef.current.x}px), calc(-50% + ${currentRef.current.y}px) ) scale(1.08)`;
    }
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    /* Start the RAF loop always, even on mobile (target stays 0,0 → no movement) */
    rafRef.current = requestAnimationFrame(animate);

    if (!isMobile) {
      const onMove = (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        /* Inverse – mouse left → bg drifts right */
        targetRef.current.x = ((cx - e.clientX) / cx) * 8;
        targetRef.current.y = ((cy - e.clientY) / cy) * 8;
      };
      window.addEventListener('mousemove', onMove, { passive: true });
      return () => {
        window.removeEventListener('mousemove', onMove);
        cancelAnimationFrame(rafRef.current);
      };
    }

    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  const portalContent = (
    <div
      id="lc-bg-portal"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {/* The background image – positioned absolute so transform origin is center */}
      <img
        ref={imgRef}
        src="/AfterMaAppPics.png"
        alt=""
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '110%',
          height: '110%',
          objectFit: 'cover',
          objectPosition: 'center',
          transform: 'translate(-50%, -50%) scale(1.08)',
          willChange: 'transform',
          userSelect: 'none',
          WebkitUserDrag: 'none',
          draggable: false,
        }}
        draggable={false}
      />
      {/* Soft gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.58) 0%, rgba(235,245,255,0.50) 45%, rgba(255,238,248,0.45) 100%)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
        }}
      />
    </div>
  );

  return createPortal(portalContent, document.body);
};

/* ─── Glass panel utility ─────────────────────────────────────────────── */
const GLASS = 'bg-white/75 backdrop-blur-md border border-white/60 shadow-lg shadow-black/5';

/* ─── Inline Video Player Component ─────────────────────────────────── */
const VideoPlayerModal = ({ video, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef(null);
  const hideTimer = useRef(null);

  const resetHideTimer = () => {
    clearTimeout(hideTimer.current);
    setShowControls(true);
    if (isPlaying) {
      hideTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  useEffect(() => {
    return () => clearTimeout(hideTimer.current);
  }, [isPlaying]);

  const handlePlayPause = (e) => {
    if (e) e.stopPropagation();
    setIsPlaying(!isPlaying);
    resetHideTimer();
  };

  const handleSeekChange = (e) => {
    if (e) e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (playerRef.current) playerRef.current.seekTo(pct);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
    if (isMuted && parseFloat(e.target.value) > 0) setIsMuted(false);
  };

  const handleToggleMute = (e) => {
    if (e) e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const handleFullscreen = (e) => {
    if (e) e.stopPropagation();
    const el = document.getElementById('vid-player-wrapper');
    if (el) {
      if (!document.fullscreenElement) {
        el.requestFullscreen().catch((err) => console.log(err));
      } else {
        document.exitFullscreen();
      }
    }
  };

  // Determine YouTube src
  let videoId = video.youtubeId || '';
  if (!videoId && video.youtubeUrl) {
    const m = video.youtubeUrl.match(/(?:v=|youtu\.be\/)([^&]+)/);
    if (m) videoId = m[1];
  }
  if (!videoId) videoId = 'dQw4w9WgXcQ';
  const ytSrc = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&controls=1`;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in p-4 md:p-8"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-6xl aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] bg-black border border-white/10 group flex flex-col justify-center">
        <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 z-[60] p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:rotate-90">
          <X size={24} strokeWidth={2.5} />
        </button>
        <div className="absolute inset-0 w-full h-full">
          <iframe 
            src={ytSrc} 
            title={video.title} 
            className="w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen 
          />
        </div>
      </div>
    </div>
  );
};

/* ─── Video Card ─────────────────────────────────────────────────────── */
const VideoCard = ({ video, onPlay }) => (
  <div
    className={`${GLASS} rounded-[3rem] hover:shadow-xl transition-all group cursor-pointer space-y-6 p-8 hover:border-blue-200`}
    onClick={() => onPlay(video)} aria-label={`Play ${video.title}`}
  >
    <div className="aspect-video bg-slate-100 rounded-[2rem] overflow-hidden relative border border-slate-100">
      <img src={video.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={video.title} />
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]">
          <Play size={28} className="text-white ml-1" fill="white" />
        </div>
      </div>
      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">{video.duration}</div>
    </div>
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 text-blue-600">Expert Verified</span>
        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{video.duration} watch</span>
      </div>
      <h4 className="text-xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">{video.title}</h4>
      <p className="text-xs text-slate-500 font-medium leading-relaxed italic line-clamp-2">
        "A comprehensive clinical overview of recovery milestones and emotional stabilization techniques."
      </p>
    </div>
    <button
      className="w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
      onClick={(e) => { e.stopPropagation(); onPlay(video); }}
    >
      <Play size={14} fill="currentColor" /> Watch Now
    </button>
  </div>
);

/* ─── Generic Resource Card ──────────────────────────────────────────── */
const GenericCard = ({ index, activeSection, onNavigate }) => (
  <div
    className={`${GLASS} p-8 rounded-[3rem] hover:shadow-xl transition-all group cursor-pointer space-y-6 ${activeSection === 'guides' ? 'hover:border-pink-200' : activeSection === 'tips' ? 'hover:border-rose-200' : 'hover:border-emerald-200'}`}
    onClick={() => onNavigate(`${activeSection}-${index}`)}
    role="article"
    tabIndex={0}
    onKeyDown={e => e.key === 'Enter' && onNavigate(`${activeSection}-${index}`)}
    aria-label={`Open article: Essential ${activeSection === 'guides' ? 'Guide' : activeSection === 'tips' ? 'Tips' : 'Safety'} Vol. ${index + 1}`}
  >
    <div className="aspect-video bg-slate-100 rounded-[2rem] overflow-hidden relative border border-slate-100">
      <img src={`https://picsum.photos/seed/${activeSection}-${index}/600/400`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Resource" />
    </div>
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${activeSection === 'guides' ? 'bg-pink-50 text-pink-600' : activeSection === 'tips' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>Expert Verified</span>
        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{index + 2}m read</span>
      </div>
      <h4 className="text-xl font-black text-slate-900 leading-tight">
        Essential {activeSection === 'guides' ? 'Guide to' : activeSection === 'tips' ? 'Tips for' : 'Safety in'} Postpartum Care Vol. {index + 1}
      </h4>
      <p className="text-xs text-slate-500 font-medium leading-relaxed italic line-clamp-2">
        "A comprehensive clinical overview of recovery milestones and emotional stabilization techniques."
      </p>
    </div>
    <button
      className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeSection === 'guides' ? 'bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white' : activeSection === 'tips' ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'}`}
      onClick={e => { e.stopPropagation(); onNavigate(`${activeSection}-${index}`); }}
    >
      Open Resource <ChevronRight size={14} />
    </button>
  </div>
);

/* ─── QuickLink ──────────────────────────────────────────────────────── */
const QuickLink = ({ icon, label, onClick, active, color }) => {
  const colorClasses = {
    pink: 'text-pink-500 bg-white/70 border-pink-100 hover:border-pink-300 hover:bg-pink-50/70 shadow-pink-100/50',
    blue: 'text-blue-500 bg-white/70 border-blue-100 hover:border-blue-300 hover:bg-blue-50/70 shadow-blue-100/50',
    rose: 'text-rose-500 bg-white/70 border-rose-100 hover:border-rose-300 hover:bg-rose-50/70 shadow-rose-100/50',
    emerald: 'text-emerald-500 bg-white/70 border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/70 shadow-emerald-100/50',
  };
  return (
    <div
      onClick={onClick}
      className={`p-5 lg:p-6 rounded-[2rem] text-center shadow-sm hover:shadow-md border backdrop-blur-md transition-all duration-300 cursor-pointer group flex flex-col items-center justify-center gap-3 ${active ? 'ring-2 ring-offset-2 ring-current scale-[1.02]' : ''} ${colorClasses[color] || 'bg-white/70 border-white/60'}`}
    >
      <div className="group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">{icon}</div>
      <span className="font-extrabold text-[11px] uppercase tracking-widest">{label}</span>
    </div>
  );
};

/* ─── Main Education Component ───────────────────────────────────────── */
const Education = ({ profile }) => {
  const navigate = useNavigate();
  const lang = profile?.journeySettings?.language || 'english';
  const t = translations[lang];

  const [activeSection, setActiveSection] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);

  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  /* ESC key handler */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (playingVideo) setPlayingVideo(null);
        else setActiveSection(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playingVideo]);

  /* Override the App wrapper's background so our section feels full-page */
  useEffect(() => {
    const prevBg = document.documentElement.style.backgroundColor;
    // Make body background transparent so background portal shows through
    document.body.style.backgroundColor = 'transparent';
    return () => {
      document.body.style.backgroundColor = prevBg;
    };
  }, []);

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeft - (x - startX) * 2;
  };

  /* ── Section portal view ── */
  if (activeSection) {
    return (
      <>
        <LearningCenterBackground />
        <div className="max-w-6xl mx-auto pt-6 animate-in slide-in-from-right-4 duration-500" style={{ position: 'relative', zIndex: 1 }}>
          <div className={`w-full ${GLASS} rounded-[3rem] overflow-hidden pb-20`}>
            <div className="border-b border-white/40 flex items-center justify-between py-6 px-10 bg-white/80 backdrop-blur-md sticky top-0 z-40">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${activeSection === 'guides' ? 'bg-pink-50 text-pink-600' : activeSection === 'videos' ? 'bg-blue-50 text-blue-600' : activeSection === 'tips' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {activeSection === 'guides' && <Book size={24} />}
                  {activeSection === 'videos' && <PlayCircle size={24} />}
                  {activeSection === 'tips' && <HeartPulse size={24} />}
                  {activeSection === 'safety' && <ShieldCheck size={24} />}
                </div>
                <div>
                  <h3 className="font-black text-xl text-slate-900 capitalize leading-tight">{activeSection} Portal</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">Curated Expert Resources</p>
                </div>
              </div>
              <button onClick={() => setActiveSection(null)} className="p-3 text-slate-400 hover:text-slate-900 transition-all bg-slate-50 hover:bg-slate-200 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="p-10 lg:p-12 pt-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {activeSection === 'videos'
                  ? VIDEO_LIBRARY.map(vid => <VideoCard key={vid.id} video={vid} onPlay={setPlayingVideo} />)
                  : Array.from({ length: 6 }).map((_, i) => (
                    <GenericCard key={i} index={i} activeSection={activeSection} onNavigate={id => navigate(`/learning-center/${id}`)} />
                  ))
                }
              </div>
            </div>

            {playingVideo && <VideoPlayerModal video={playingVideo} onClose={() => setPlayingVideo(null)} />}
          </div>
        </div>
      </>
    );
  }

  /* ── Main landing view ── */
  return (
    <div className="overflow-x-hidden w-full min-h-screen">
      {/* The background is rendered via portal directly into <body> */}
      <LearningCenterBackground />

      {/* All content sits on z-index 1 above the portal */}
      <div
        className="max-w-5xl mx-auto space-y-16 pb-20 animate-in fade-in duration-500 px-2 lg:px-0"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* ── Hero Header ── */}
        <div className="text-center space-y-6 pt-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-white/50 shadow-sm mb-2">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Premium Healthcare Education</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight drop-shadow-sm">{t.education.title}</h1>
          <p className="text-slate-600 max-w-2xl mx-auto italic text-lg font-medium leading-relaxed">{t.education.subtitle}</p>
        </div>

        {/* ── Quick Links ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <QuickLink icon={<Book size={32} />} label={t.education.quickLinks.guides} onClick={() => setActiveSection('guides')} active={activeSection === 'guides'} color="pink" />
          <QuickLink icon={<PlayCircle size={32} />} label={t.education.quickLinks.videos} onClick={() => setActiveSection('videos')} active={activeSection === 'videos'} color="blue" />
          <QuickLink icon={<HeartPulse size={32} />} label={t.education.quickLinks.tips} onClick={() => setActiveSection('tips')} active={activeSection === 'tips'} color="rose" />
          <QuickLink icon={<ShieldCheck size={32} />} label={t.education.quickLinks.safety} onClick={() => setActiveSection('safety')} active={activeSection === 'safety'} color="emerald" />
        </div>

        {/* ── Community Wisdom ── */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/70 backdrop-blur-sm text-indigo-600 rounded-2xl shadow-inner border border-indigo-100/40"><Users size={24} /></div>
            <div className="space-y-0.5">
              <h2 className="text-2xl lg:text-3xl font-black text-slate-800">Community Wisdom</h2>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Voices of Motherhood</p>
            </div>
          </div>
          <SurveyCommunityData profile={profile} />
        </section>

        {/* ── Trusted Picks Carousel ── */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-800">{t.education.newsletterTitle}</h2>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">{t.education.newsletterSub}</p>
            </div>
            <button className="flex items-center gap-2 text-pink-500 font-black text-xs uppercase tracking-widest hover:underline transition-all">
              {t.education.archive} <ArrowRight size={14} />
            </button>
          </div>
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex gap-8 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none -mx-4 px-4 lg:-mx-8 lg:px-8"
          >
            {TRUSTED_PICKS.map((pick, i) => (
              <div key={i} className={`min-w-[85%] md:min-w-[45%] lg:min-w-[31%] snap-start ${GLASS} p-8 rounded-[3rem] hover:shadow-2xl transition-all group flex flex-col justify-between`}>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] font-black uppercase px-3 py-1 bg-pink-50 text-pink-500 rounded-full">{pick.tag}</span>
                    <Star size={16} className="text-amber-300" fill="currentColor" />
                  </div>
                  <h4 className="text-lg font-black text-gray-900">{pick.brand}: {pick.product}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed italic">"Because {pick.reason.toLowerCase()} is essential for your peace of mind and delicate care."</p>
                </div>
                <button className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-pink-500 transition-colors">
                  Learn More <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── Government Schemes ── */}
        <section className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl lg:text-3xl font-black text-slate-800">{t.education.govtTitle}</h2>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-inner border border-white/50">{t.education.govtSub}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {GOVT_SCHEMES.map(scheme => (
              <div key={scheme.title} className={`${GLASS} p-6 rounded-[2rem] hover:border-blue-200 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between group`}>
                <div className="space-y-4">
                  <div className="bg-blue-50 text-blue-500 p-3 rounded-xl shadow-inner w-fit"><FileText size={20} /></div>
                  <h3 className="text-xl font-black text-gray-800 leading-tight">{scheme.title}</h3>
                  <div className="p-3 bg-blue-50/30 rounded-xl border border-blue-50">
                    <p className="text-[10px] font-black text-blue-700">{scheme.benefit}</p>
                  </div>
                </div>
                <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all">
                  Details <ExternalLink size={12} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── Latest Articles ── */}
        <section className="space-y-8">
          <h2 className="text-2xl lg:text-3xl font-black text-slate-800">{t.education.latestResources}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {ARTICLES.map((art, idx) => (
              <div
                key={art.id || idx}
                className={`${GLASS} p-8 rounded-[3rem] flex flex-col sm:flex-row gap-8 hover:shadow-2xl transition-all cursor-pointer group`}
                onClick={() => navigate(`/learning-center/${art.id || `article-${idx}`}`)}
                role="article"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && navigate(`/learning-center/${art.id || `article-${idx}`}`)}
                aria-label={`Read article: ${art.title}`}
              >
                <div className="w-full sm:w-32 h-32 lg:w-40 lg:h-40 bg-pink-100 rounded-[2rem] shrink-0 overflow-hidden shadow-inner">
                  <img
                    src={art.image || `https://picsum.photos/seed/${idx + 10}/400/400`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={art.title}
                  />
                </div>
                <div className="space-y-3 flex-1 py-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full">{art.category}</span>
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{art.readTime} {t.education.read}</span>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-black text-gray-900 group-hover:text-pink-600 transition-colors leading-snug">{art.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">{art.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ─── AFTERMA FOOTER ─────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
};

export default Education;

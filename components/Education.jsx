
import { ArrowRight, Book, ChevronRight, ExternalLink, FileText, HeartPulse, Pause, Play, PlayCircle, ShieldCheck, Star, Users, Volume2, VolumeX, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ARTICLES, GOVT_SCHEMES, TRUSTED_PICKS, VIDEO_LIBRARY } from '../constants';
import { translations } from '../translations';
import SurveyCommunityData from './SurveyCommunityData';

/* ─── Video data with real YouTube embed IDs ─────────────────────────── */



/* ─── Inline Video Player Component ─────────────────────────────────── */
const VideoPlayerModal = ({ video, onClose }) => {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [usingYT, setUsingYT] = useState(false); // fallback flag
  const hideTimer = useRef(null);

  // Reset state when video changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setUsingYT(false);
    setShowControls(true);
  }, [video]);

  // Auto-hide controls after 3 s of inactivity
  const resetHideTimer = () => {
    clearTimeout(hideTimer.current);
    setShowControls(true);
    if (isPlaying) {
      hideTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  useEffect(() => {
    return () => clearTimeout(hideTimer.current);
  }, []);

  /* ── HTML5 Video helpers ── */
  const togglePlay = () => {
    if (usingYT) return; // handled via iframe
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) { v.pause(); setIsPlaying(false); }
    else { v.play().catch(() => { setUsingYT(true); }); setIsPlaying(true); }
    resetHideTimer();
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleProgressClick = (e) => {
    if (!videoRef.current || usingYT) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pct * duration;
    setCurrentTime(pct * duration);
  };

  const toggleMute = () => {
    if (videoRef.current) videoRef.current.muted = !isMuted;
    setIsMuted(m => !m);
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const progressPct = duration ? (currentTime / duration) * 100 : 0;

  // YouTube embed URL with autoplay
  const ytSrc = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-300 p-4 md:p-8"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        ref={containerRef}
        className="relative w-full max-w-6xl aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] bg-black border border-white/10 flex items-center justify-center"
        onMouseMove={resetHideTimer}
      >
        {/* ── Close button ── */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-[60] p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-all backdrop-blur-sm border border-white/10"
        >
          <X size={20} />
        </button>

        {/* ── Video / YouTube iframe ── */}
        {usingYT ? (
          <div className="w-full h-full relative">
            <iframe
              src={ytSrc}
              title={video.title}
              allow="autoplay; fullscreen"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              style={{ border: 'none' }}
            />
          </div>
        ) : (
          <>
            {/* Thumbnail shown before play */}
            {!isPlaying && (
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  loading="lazy"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-4">
                  {/* Big play button */}
                  <button
                    onClick={togglePlay}
                    className="w-24 h-24 bg-white/20 hover:bg-white/40 border-2 border-white/60 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm shadow-[0_0_60px_rgba(255,255,255,0.3)]"
                    aria-label="Play video"
                  >
                    <Play size={44} className="text-white ml-2" fill="white" />
                  </button>
                  <div className="text-center">
                    <p className="text-white font-black text-lg">{video.title}</p>
                    <p className="text-white/60 text-sm">{video.category} · {video.duration}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actual <video> element (hidden until play) */}
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-contain bg-black ${isPlaying ? 'block' : 'hidden'}`}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => { setIsPlaying(false); setShowControls(true); }}
              onWaiting={() => setIsBuffering(true)}
              onCanPlay={() => setIsBuffering(false)}
              poster={video.thumbnail}
              muted={isMuted}
              playsInline
              src={`https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`}
            />

            {/* Buffering spinner */}
            {isBuffering && isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-14 h-14 rounded-full border-4 border-white/30 border-t-white animate-spin" />
              </div>
            )}

            {/* ── Custom Controls ── */}
            {isPlaying && (
              <div
                className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-500 ${showControls ? 'opacity-100' : 'opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Progress bar */}
                <div
                  ref={progressRef}
                  className="h-2 bg-white/30 rounded-full cursor-pointer mb-6 group/bar relative"
                  onClick={handleProgressClick}
                >
                  <div
                    className="h-full bg-blue-500 rounded-full relative group-hover/bar:h-3 transition-all"
                    style={{ width: `${progressPct}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] opacity-0 group-hover/bar:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Control buttons */}
                <div className="flex items-center gap-6">
                  <button
                    onClick={togglePlay}
                    className="p-3 bg-white/10 hover:bg-white/25 rounded-full text-white transition-all shadow-md"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} fill="white" />}
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleMute}
                      className="p-3 bg-white/10 hover:bg-white/25 rounded-full text-white transition-all"
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    {!isMuted && (
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        defaultValue="1"
                        className="w-20 md:w-28 accent-blue-500 cursor-pointer"
                        onChange={(e) => {
                          if (videoRef.current) {
                            videoRef.current.volume = parseFloat(e.target.value);
                          }
                        }}
                      />
                    )}
                  </div>

                  <span className="text-white/80 text-sm font-mono ml-2 font-medium tracking-wide">
                    {fmt(currentTime)} / {fmt(duration)}
                  </span>
                  <p className="ml-auto text-white font-bold text-base truncate max-w-[40%]" title={video.title}>{video.title}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Video info below player */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <span className="text-white/40 text-xs uppercase tracking-widest">Press ESC or click outside to close</span>
      </div>
    </div>
  );
};

/* ─── Video Card ─────────────────────────────────────────────────────── */
const VideoCard = ({ video, onPlay }) => (
  <div
    className="bg-white rounded-[3rem] border border-gray-50 shadow-sm hover:shadow-xl transition-all group cursor-pointer space-y-6 p-8 hover:border-blue-200"
    onClick={() => onPlay(video)} aria-label={`Play ${video.title}`}
  >
    <div className="aspect-video bg-slate-100 rounded-[2rem] overflow-hidden relative border border-slate-100">
      <img
        src={video.thumbnail}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        alt={video.title}
      />
      {/* Play overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.2)]">
          <Play size={28} className="text-white ml-1" fill="white" />
        </div>
      </div>
      {/* Duration badge */}
      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
        {video.duration}
      </div>
    </div>

    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 text-blue-600">
          Expert Verified
        </span>
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

/* ─── Generic Resource Card (non-video sections) ─────────────────────── */
const GenericCard = ({ index, activeSection }) => (
  <div
    className={`bg-white p-8 rounded-[3rem] border shadow-sm hover:shadow-xl transition-all group cursor-pointer space-y-6 ${activeSection === 'guides' ? 'hover:border-pink-200' :
      activeSection === 'tips' ? 'hover:border-rose-200' :
        'hover:border-emerald-200'
      }`}
  >
    <div className="aspect-video bg-slate-100 rounded-[2rem] overflow-hidden relative border border-slate-100">
      <img src={`https://picsum.photos/seed/${activeSection}-${index}/600/400`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Resource" />
    </div>
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${activeSection === 'guides' ? 'bg-pink-50 text-pink-600' :
          activeSection === 'tips' ? 'bg-rose-50 text-rose-600' :
            'bg-emerald-50 text-emerald-600'
          }`}>Expert Verified</span>
        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{index + 2}m read</span>
      </div>
      <h4 className="text-xl font-black text-slate-900 leading-tight">
        Essential {activeSection === 'guides' ? 'Guide to' : activeSection === 'tips' ? 'Tips for' : 'Safety in'} Postpartum Care Vol. {index + 1}
      </h4>
      <p className="text-xs text-slate-500 font-medium leading-relaxed italic line-clamp-2">
        "A comprehensive clinical overview of recovery milestones and emotional stabilization techniques."
      </p>
    </div>
    <button className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeSection === 'guides' ? 'bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white' :
      activeSection === 'tips' ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white' :
        'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
      }`}>
      Open Resource <ChevronRight size={14} />
    </button>
  </div>
);

/* ─── Main Education Component ───────────────────────────────────────── */
const Education = ({ profile }) => {
  const lang = profile?.journeySettings?.language || 'english';
  const t = translations[lang];

  const [activeSection, setActiveSection] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);

  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Only Close video player/portal on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (playingVideo) setPlayingVideo(null);
        else setActiveSection(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
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
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };





  if (activeSection) {
    return (
      <div className="max-w-6xl mx-auto pt-6 animate-in slide-in-from-right-4 duration-500">
        <div className="w-full bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-xl pb-20">
          <div className="border-b border-slate-100 flex items-center justify-between py-6 px-10 bg-white/95 backdrop-blur-md sticky top-0 z-40">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${activeSection === 'guides' ? 'bg-pink-50 text-pink-600' :
                activeSection === 'videos' ? 'bg-blue-50 text-blue-600' :
                  activeSection === 'tips' ? 'bg-rose-50 text-rose-600' :
                    'bg-emerald-50 text-emerald-600'
                }`}>
                {activeSection === 'guides' && <Book size={24} />}
                {activeSection === 'videos' && <PlayCircle size={24} />}
                {activeSection === 'tips' && <HeartPulse size={24} />}
                {activeSection === 'safety' && <ShieldCheck size={24} />}
              </div>
              <div>
                <h3 className="font-black text-xl text-slate-900 capitalize leading-tight">
                  {activeSection} Portal
                </h3>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                  Curated Expert Resources
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveSection(null)}
              className="p-3 text-slate-400 hover:text-slate-900 transition-all bg-slate-50 hover:bg-slate-200 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-10 lg:p-12 pt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {activeSection === 'videos'
                ? VIDEO_LIBRARY.map((vid) => (
                  <VideoCard key={vid.id} video={vid} onPlay={setPlayingVideo} />
                ))
                : Array.from({ length: 6 }).map((_, i) => (
                  <GenericCard key={i} index={i} activeSection={activeSection} />
                ))
              }
            </div>
          </div>

          {playingVideo && (
            <VideoPlayerModal video={playingVideo} onClose={() => setPlayingVideo(null)} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-20 animate-in fade-in duration-500">
      <div className="text-center space-y-6 pt-10">
        <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">{t.education.title}</h1>
        <p className="text-gray-500 max-w-2xl mx-auto italic text-lg font-medium leading-relaxed">{t.education.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <QuickLink icon={<Book size={32} />} label={t.education.quickLinks.guides} onClick={() => setActiveSection('guides')} active={activeSection === 'guides'} color="pink" />
        <QuickLink icon={<PlayCircle size={32} />} label={t.education.quickLinks.videos} onClick={() => setActiveSection('videos')} active={activeSection === 'videos'} color="blue" />
        <QuickLink icon={<HeartPulse size={32} />} label={t.education.quickLinks.tips} onClick={() => setActiveSection('tips')} active={activeSection === 'tips'} color="rose" />
        <QuickLink icon={<ShieldCheck size={32} />} label={t.education.quickLinks.safety} onClick={() => setActiveSection('safety')} active={activeSection === 'safety'} color="emerald" />
      </div>

      {/* Community Wisdom */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner"><Users size={24} /></div>
          <div className="space-y-0.5">
            <h2 className="text-2xl lg:text-3xl font-black text-gray-800">Community Wisdom</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Voices of Motherhood</p>
                      </div>
        </div>
        <SurveyCommunityData profile={profile} />
      </section>

      {/* Trusted Picks carousel */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-gray-800">{t.education.newsletterTitle}</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">{t.education.newsletterSub}</p>
          </div>
          <button className="flex items-center gap-2 text-pink-500 font-black text-xs uppercase tracking-widest hover:underline transition-all">{t.education.archive} <ArrowRight size={14} /></button>
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
            <div key={i} className="min-w-[85%] md:min-w-[45%] lg:min-w-[31%] snap-start bg-white p-8 rounded-[3rem] border border-gray-50 shadow-md hover:shadow-2xl transition-all group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start"><span className="text-[8px] font-black uppercase px-3 py-1 bg-pink-50 text-pink-500 rounded-full">{pick.tag}</span><Star size={16} className="text-amber-300" fill="currentColor" /></div>
                <h4 className="text-lg font-black text-gray-900">{pick.brand}: {pick.product}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed italic">"Because {pick.reason.toLowerCase()} is essential for your peace of mind and delicate care."</p>
              </div>
              <button className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-pink-500 transition-colors">Learn More <ArrowRight size={12} /></button>
            </div>
          ))}
        </div>
      </section>

      {/* Government schemes */}
      <section className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl lg:text-3xl font-black text-gray-800">{t.education.govtTitle}</h2>
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-gray-50 px-4 py-1.5 rounded-full shadow-inner">{t.education.govtSub}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {GOVT_SCHEMES.map(scheme => (
            <div key={scheme.title} className="bg-white p-6 rounded-[2rem] border border-gray-50 hover:border-blue-200 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between group">
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

      {/* Latest ARTICLES */}
      <section className="space-y-8">
        <h2 className="text-2xl lg:text-3xl font-black text-gray-800">{t.education.latestResources}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {ARTICLES.map((art, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[3rem] border border-gray-50 flex flex-col sm:flex-row gap-8 hover:shadow-2xl transition-all cursor-pointer group shadow-md">
              <div className="w-full sm:w-32 h-32 lg:w-40 lg:h-40 bg-pink-100 rounded-[2rem] shrink-0 overflow-hidden shadow-inner">
                <img src={`https://picsum.photos/seed/${idx + 10}/400/400`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Article" />
              </div>
              <div className="space-y-3 flex-1 py-1">
                <div className="flex justify-between items-center"><span className="text-[10px] font-black text-pink-500 uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-full">{art.category}</span><span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{art.readTime} {t.education.read}</span></div>
                <h3 className="text-xl lg:text-2xl font-black text-gray-900 group-hover:text-pink-600 transition-colors leading-snug">{art.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">{art.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const QuickLink = ({ icon, label, onClick, active, color }) => {
  const colorClasses = {
    pink: 'text-pink-500 bg-pink-50/80 border-pink-100 hover:border-pink-300 hover:bg-pink-100/50 shadow-pink-100/50',
    blue: 'text-blue-500 bg-blue-50/80 border-blue-100 hover:border-blue-300 hover:bg-blue-100/50 shadow-blue-100/50',
    rose: 'text-rose-500 bg-rose-50/80 border-rose-100 hover:border-rose-300 hover:bg-rose-100/50 shadow-rose-100/50',
    emerald: 'text-emerald-500 bg-emerald-50/80 border-emerald-100 hover:border-emerald-300 hover:bg-emerald-100/50 shadow-emerald-100/50',
  };

  return (
    <div
      onClick={onClick}
      className={`p-5 lg:p-6 rounded-[2rem] text-center shadow-sm hover:shadow-md border transition-all duration-300 cursor-pointer group flex flex-col items-center justify-center gap-3 ${active ? 'ring-2 ring-offset-2 ring-current scale-[1.02]' : ''
        } ${colorClasses[color] || 'bg-white border-gray-50'}`}
    >
      <div className="group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">{icon}</div>
      <span className="font-extrabold text-[11px] uppercase tracking-widest">{label}</span>
    </div>
  );
};

export default Education;

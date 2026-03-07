import { ArrowLeft, Bookmark, BookmarkCheck, Share2 } from 'lucide-react';
import { useState } from 'react';

const ArticleHero = ({ article, onBack, isRecipe = false }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [shared, setShared] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary || article.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <div className="relative w-full">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <button
          onClick={onBack}
          id="article-back-btn"
          aria-label="Go back to Learning Center"
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-100 shadow-sm rounded-2xl text-slate-600 hover:text-slate-900 hover:shadow-md hover:border-slate-200 transition-all duration-300 font-semibold text-sm group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform duration-300"
          />
          Back to Learning Center
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setBookmarked(b => !b)}
            id="article-bookmark-btn"
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
            className={`p-2.5 rounded-xl border transition-all duration-300 ${
              bookmarked
                ? 'bg-pink-50 border-pink-200 text-pink-500 shadow-sm'
                : 'bg-white border-slate-100 text-slate-400 hover:text-pink-500 hover:border-pink-200 shadow-sm'
            }`}
          >
            {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>

          <button
            onClick={handleShare}
            id="article-share-btn"
            aria-label="Share article"
            className={`p-2.5 rounded-xl border transition-all duration-300 ${
              shared
                ? 'bg-emerald-50 border-emerald-200 text-emerald-500 shadow-sm'
                : 'bg-white border-slate-100 text-slate-400 hover:text-blue-500 hover:border-blue-200 shadow-sm'
            }`}
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      {/* Hero Cover Image */}
      <div className="w-full aspect-[16/7] md:aspect-[16/6] rounded-3xl overflow-hidden shadow-xl border border-slate-100 relative">
        <img
          src={article.image || article.img || `https://picsum.photos/seed/${article.id || 'article'}/1200/500`}
          alt={article.title}
          className="w-full h-full object-cover"
          onError={e => {
            e.target.src = `https://picsum.photos/seed/${article.id}/1200/500`;
          }}
        />
        {/* Subtle gradient overlay at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        {isRecipe && (
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Safe Recipe
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleHero;

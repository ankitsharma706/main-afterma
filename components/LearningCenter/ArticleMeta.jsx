import { Clock, ShieldCheck, User } from 'lucide-react';

const CATEGORY_STYLES = {
  'Education':    { bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-100'    },
  'Guides':       { bg: 'bg-pink-50',    text: 'text-pink-600',    border: 'border-pink-100'    },
  'Expert Tips':  { bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-100'    },
  'Safety':       { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
  'Open Resources': { bg: 'bg-indigo-50',  text: 'text-indigo-600',  border: 'border-indigo-100'  },
  'Safe Recipes': { bg: 'bg-teal-50',    text: 'text-teal-600',    border: 'border-teal-100'    },
  'Mental Health':{ bg: 'bg-purple-50',  text: 'text-purple-600',  border: 'border-purple-100'  },
  'Nutrition':    { bg: 'bg-orange-50',  text: 'text-orange-600',  border: 'border-orange-100'  },
  'Physical Recovery': { bg: 'bg-sky-50',  text: 'text-sky-600',  border: 'border-sky-100'  },
};

const RecipeMeta = ({ article }) => (
  <div className="space-y-4">
    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
      {article.title}
    </h1>

    <div className="flex flex-wrap items-center gap-3">
      {/* Nutrition / Health Benefit Badge */}
      {article.tags?.map(tag => (
        <span
          key={tag}
          className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest"
        >
          {tag}
        </span>
      ))}
    </div>

    <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm">
      {article.prepTime && (
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <Clock size={14} className="text-slate-400" />
          <span>Prep: <strong className="text-slate-700">{article.prepTime}</strong></span>
        </div>
      )}
      {article.cookTime && (
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <Clock size={14} className="text-slate-400" />
          <span>Cook: <strong className="text-slate-700">{article.cookTime}</strong></span>
        </div>
      )}
      {(article.duration && !article.prepTime) && (
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <Clock size={14} className="text-slate-400" />
          <span><strong className="text-slate-700">{article.duration}</strong></span>
        </div>
      )}

      {/* Expert Verified */}
      <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 font-black text-[10px] uppercase tracking-widest">
        <ShieldCheck size={12} />
        Nutritionist Verified
      </div>

      {article.expert && (
        <div className="flex items-center gap-1.5 text-slate-500 font-medium text-xs">
          <User size={13} className="text-slate-400" />
          {article.expert}
        </div>
      )}
    </div>
  </div>
);

const ArticleMeta = ({ article, isRecipe = false }) => {
  if (isRecipe) return <RecipeMeta article={article} />;

  const categoryStyle = CATEGORY_STYLES[article.category] || CATEGORY_STYLES['Education'];

  return (
    <div className="space-y-5">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
        {article.title}
      </h1>

      {/* Meta Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category Badge */}
        <span
          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
          aria-label={`Category: ${article.category}`}
        >
          {article.category}
        </span>

        {/* Read Time */}
        <div className="flex items-center gap-1.5 text-slate-500">
          <Clock size={13} className="text-slate-400" />
          <span className="text-xs font-semibold">{article.readTime || article.duration}</span>
        </div>

        {/* Expert Verified */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 font-black text-[10px] uppercase tracking-widest"
          aria-label="Expert Verified"
        >
          <ShieldCheck size={12} />
          Expert Verified
        </div>

        {/* Author */}
        {article.expert && (
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
              <User size={10} className="text-white" />
            </div>
            <span>{article.expert}</span>
          </div>
        )}
      </div>

      {/* Summary / Intro */}
      {article.summary && (
        <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed italic border-l-4 border-pink-200 pl-4">
          "{article.summary}"
        </p>
      )}
    </div>
  );
};

export default ArticleMeta;

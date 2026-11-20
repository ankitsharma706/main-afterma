/**
 * @file components/seo/RelatedContent.jsx
 * @description Contextual internal linking engine to distribute PageRank across related clinical articles & recipes.
 */

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, BookOpen, Utensils } from 'lucide-react';
import { ARTICLES, RECIPES } from '../../constants';

/**
 * RelatedContent Component
 * Dynamically computes and displays contextually relevant internal links.
 *
 * @param {Object} props
 * @param {string} props.currentId - Current article or recipe ID to exclude
 * @param {string} [props.category] - Current category for contextual affinity
 * @param {Array<string>} [props.tags=[]] - Topic tags for semantic scoring
 * @param {number} [props.limit=3] - Maximum number of related items to show
 * @returns {JSX.Element|null}
 */
const RelatedContent = ({
  currentId,
  category = '',
  tags = [],
  limit = 3,
}) => {
  const navigate = useNavigate();

  const relatedItems = useMemo(() => {
    // Unify all articles and recipes into a single pool
    const pool = [
      ...(ARTICLES || []).map((art) => ({
        id: art.id,
        title: art.title,
        summary: art.summary,
        category: art.category,
        image: art.image,
        type: 'article',
      })),
      ...(RECIPES || []).map((recipe) => ({
        id: recipe.id,
        title: recipe.title,
        summary: recipe.description,
        category: 'Safe Recipes',
        image: recipe.image,
        type: 'recipe',
      })),
    ];

    // Filter out current item
    const candidates = pool.filter((item) => item.id !== currentId);

    // Score candidates by category and tag matches
    const scored = candidates.map((item) => {
      let score = 0;
      if (category && item.category?.toLowerCase() === category.toLowerCase()) {
        score += 3;
      }
      if (tags && tags.length > 0) {
        tags.forEach((tag) => {
          if (item.title?.toLowerCase().includes(tag.toLowerCase())) score += 1;
          if (item.summary?.toLowerCase().includes(tag.toLowerCase())) score += 1;
        });
      }
      return { ...item, score };
    });

    // Sort descending by score and pick top items
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit);
  }, [currentId, category, tags, limit]);

  if (relatedItems.length === 0) return null;

  return (
    <section className="mt-16 pt-10 border-t border-slate-100 space-y-6" aria-label="Related Guides & Resources">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-pink-500">
            Internal Knowledge Network
          </span>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Related Recovery Resources
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedItems.map((item) => {
          const isRecipe = item.type === 'recipe';

          return (
            <div
              key={item.id}
              onClick={() => navigate(`/learning-center/${item.id}`)}
              className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-pink-200 transition-all flex flex-col justify-between cursor-pointer group"
              role="link"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/learning-center/${item.id}`)}
              aria-label={`Explore related: ${item.title}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    {isRecipe ? <Utensils size={12} className="text-emerald-500" /> : <BookOpen size={12} className="text-pink-500" />}
                    {item.category}
                  </span>
                </div>
                <h3 className="font-black text-slate-900 text-sm md:text-base group-hover:text-pink-600 transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-4 mt-auto flex items-center gap-1 text-xs font-bold text-pink-600 group-hover:translate-x-1 transition-transform">
                <span>Read Guide</span>
                <ArrowRight size={14} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedContent;

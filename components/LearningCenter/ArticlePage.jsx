import { useLocation, useNavigate } from 'react-router-dom';
import { ARTICLES, RECIPES } from '../../constants';
import ArticleContent from './ArticleContent';
import ArticleHero from './ArticleHero';
import ArticleMeta from './ArticleMeta';
import RecipeContent from './RecipeContent';

/* ─── Build a unified article lookup from constants ─────────────────── */
const buildArticleDatabase = () => {
  const db = {};

  // Map ARTICLES from constants
  ARTICLES.forEach((art, idx) => {
    const id = art.id || `article-${idx}`;
    db[id] = {
      ...art,
      id,
      image: art.image || `https://picsum.photos/seed/${id}/1200/500`,
      expert: art.expert || 'Dr. Meera Sharma, OB-GYN',
      type: 'article',
    };
  });

  // Map RECIPES from constants
  RECIPES.forEach(recipe => {
    db[recipe.id] = {
      ...recipe,
      category: 'Safe Recipes',
      readTime: recipe.duration,
      summary: recipe.description,
      image: recipe.image,
      expert: recipe.expert || 'AfterMa Nutrition Team',
      type: 'recipe',
    };
  });

  return db;
};

/* ─── Section-based generic articles from Education portal ───────────── */
const SECTION_ARTICLES = {
  guides: (index) => ({
    id: `guides-${index}`,
    title: `Essential Guide to Postpartum Care Vol. ${index + 1}`,
    category: 'Guides',
    readTime: `${index + 2} min read`,
    summary: 'A comprehensive clinical overview of recovery milestones and emotional stabilization techniques designed for new and expecting mothers.',
    image: `https://picsum.photos/seed/guides-${index}/1200/500`,
    expert: 'Dr. Ananya Roy, MPT',
    type: 'article',
  }),
  tips: (index) => ({
    id: `tips-${index}`,
    title: `Expert Tips for Postpartum Wellness Vol. ${index + 1}`,
    category: 'Expert Tips',
    readTime: `${index + 2} min read`,
    summary: 'Clinically verified expert advice for navigating the emotional and physical demands of the postpartum period with confidence and support.',
    image: `https://picsum.photos/seed/tips-${index}/1200/500`,
    expert: 'Dr. Shweta Singh, Pelvic Specialist',
    type: 'article',
  }),
  safety: (index) => ({
    id: `safety-${index}`,
    title: `Safety in Postpartum Recovery Vol. ${index + 1}`,
    category: 'Safety',
    readTime: `${index + 2} min read`,
    summary: 'Evidence-based safety guidelines for postpartum mothers — covering physical warning signs, mental health indicators, and when to seek urgent care.',
    image: `https://picsum.photos/seed/safety-${index}/1200/500`,
    expert: 'Dr. Priya Varma, Maternal Fetal Expert',
    type: 'article',
  }),
};

const ARTICLE_DB = buildArticleDatabase();

/* ─── ArticlePage Component ──────────────────────────────────────────── */
const ArticlePage = ({ profile }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract articleId from pathname: /learning-center/:articleId
  const articleId = location.pathname.replace(/^\/learning-center\/?/, '') || null;

  // Resolve article from the database or dynamic section articles
  let article = ARTICLE_DB[articleId];

  if (!article) {
    // Try section-based articles: guides-0, tips-1, safety-2, etc.
    const sectionMatch = articleId?.match(/^(guides|tips|safety)-(\d+)$/);
    if (sectionMatch) {
      const [, section, idx] = sectionMatch;
      const generator = SECTION_ARTICLES[section];
      if (generator) article = generator(parseInt(idx, 10));
    }
  }

  const handleBack = () => {
    const isRecipe = article?.type === 'recipe' || article?.category === 'Safe Recipes';
    navigate(isRecipe ? '/recipes' : '/education');
  };

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center space-y-6 animate-in fade-in duration-500">
        <div className="text-6xl">📖</div>
        <h1 className="text-3xl font-black text-slate-900">Article Not Found</h1>
        <p className="text-slate-500 font-medium">
          We couldn't find the article you're looking for. It may have been moved or doesn't exist.
        </p>
        <button
          onClick={() => navigate('/education')}
          className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-black text-sm hover:from-pink-600 hover:to-rose-600 transition-all shadow-md"
        >
          Back to Learning Center
        </button>
      </div>
    );
  }

  const isRecipe = article.type === 'recipe' || article.category === 'Safe Recipes';

  return (
    <article
      className="max-w-4xl mx-auto pb-24 animate-in slide-in-from-bottom-4 duration-500"
      aria-label={`Article: ${article.title}`}
    >
      {/* Hero */}
      <ArticleHero article={article} onBack={handleBack} isRecipe={isRecipe} />

      {/* Metadata */}
      <div className="mt-8 md:mt-10 space-y-3">
        <ArticleMeta article={article} isRecipe={isRecipe} />
      </div>

      {/* Divider */}
      <div className="my-8 md:my-10 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      {/* Article / Recipe Content */}
      {isRecipe ? (
        <RecipeContent article={article} />
      ) : (
        <ArticleContent article={article} />
      )}
    </article>
  );
};

export default ArticlePage;

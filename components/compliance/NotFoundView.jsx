import { ArrowLeft, Home, BookOpen, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '../seo/SEOHead';

const NotFoundView = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center space-y-6 animate-in fade-in duration-500">
      <SEOHead
        title="Page Not Found (404)"
        description="The requested page could not be found."
        noindex={true}
      />
      <div className="w-20 h-20 rounded-3xl bg-pink-50 border border-pink-100 flex items-center justify-center mx-auto text-3xl shadow-sm">
        🌸
      </div>
      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-widest text-pink-500 bg-pink-50 px-3 py-1 rounded-full">
          404 Error • Page Not Found
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight pt-2">
          Looking for Postpartum Care?
        </h1>
        <p className="text-slate-500 font-medium text-sm md:text-base max-w-md mx-auto leading-relaxed">
          The page or article you are looking for may have been updated, relocated, or is no longer available.
        </p>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => navigate('/education')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-2xl font-bold text-sm shadow-md hover:from-pink-600 hover:to-rose-600 transition-all active:scale-95"
        >
          <BookOpen size={16} /> Knowledge Center
        </button>
        <button
          onClick={() => navigate('/recipes')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all"
        >
          <Utensils size={16} /> Safe Recipes
        </button>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
        >
          <Home size={16} /> Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundView;


import {
    ChevronRight,
    Clock,
    Search,
    ShieldCheck,
    Utensils
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, RECIPES } from '../constants';



const SafeRecipes = ({ profile }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const theme = COLORS?.[profile?.accent] || COLORS.PINK;
  const query = search.toLowerCase();
  const filtered = useMemo(() => {
    return RECIPES.filter(r =>
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto space-y-12 lg:space-y-16 pb-32 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-2">
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Safe Recipes</h2>
          <p className="text-slate-400 font-medium italic text-lg">Nourishing your body with clinical and traditional wisdom.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text" 
            placeholder="Search by ingredient or benefit..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl font-medium text-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(recipe => (
          <div
            key={recipe.id}
            className="bg-white rounded-[2.5rem] border border-slate-50 shadow-sm overflow-hidden group hover:shadow-xl transition-all flex flex-col cursor-pointer"
            onClick={() => navigate(`/learning-center/${recipe.id}`)}
            role="article"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && navigate(`/learning-center/${recipe.id}`)}
            aria-label={`Open recipe: ${recipe.title}`}
          >
            <div className="h-56 relative overflow-hidden">
              <img src={recipe.image} alt={recipe.title} loading="lazy" onError={(e) => e.target.src = "/images/recipe-placeholder.png"}  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute top-4 right-4 flex gap-2 z-20">
                {recipe.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-bold uppercase tracking-widest text-slate-900 shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Animated Hover Description */}
              <div className="absolute inset-0 bg-emerald-900/80 backdrop-blur-sm p-8 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-10">
                 <div className="p-3 bg-white/10 rounded-2xl mb-4"><Utensils size={24} className="text-emerald-400" /></div>
                 <p className="text-white text-xs font-medium leading-relaxed italic">"{recipe.description}"</p>
                 <div className="mt-6 flex items-center gap-2 text-[8px] font-bold text-emerald-400 uppercase tracking-widest">
                    <ShieldCheck size={12} /> Nutritionist Verified
                 </div>
              </div>
            </div>
            <div className="p-8 space-y-6 flex-1 flex flex-col">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                  <Clock size={12} /> {recipe.duration} • {recipe.intensity}
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors">{recipe.title}</h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-2 italic">"{recipe.description}"</p>
              </div>
              
              <div className="pt-4 mt-auto flex items-center justify-between border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400"><Utensils size={16} /></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{recipe.mood}</span>
                </div>
                <button
                  className="p-3 bg-slate-900 text-white rounded-xl hover:scale-110 transition-all shadow-lg"
                  onClick={e => { e.stopPropagation(); navigate(`/learning-center/${recipe.id}`); }}
                  aria-label={`Open ${recipe.title} recipe`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-10 bg-emerald-50 rounded-[3rem] border border-emerald-100 flex flex-col md:flex-row items-center gap-8">
        <div className="p-5 bg-white rounded-[2rem] shadow-sm text-emerald-500">
          <ShieldCheck size={40} />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <h4 className="text-xl font-bold text-slate-900 tracking-tight">Clinical Safety Note</h4>
          <p className="text-sm text-emerald-700 font-medium leading-relaxed italic">
            All recipes are curated based on Ayurvedic principles and modern nutritional science. If you have specific medical conditions or allergies, please consult your healthcare provider before making significant dietary changes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SafeRecipes;

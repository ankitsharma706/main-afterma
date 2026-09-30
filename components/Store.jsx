
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

import { CheckCircle2, Minus, Package, Plus, ShoppingBag, ShoppingCart, Sparkles, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { COLORS, STORE_ITEMS } from '../constants';

const CATEGORIES = ['All', 'Baby Care', 'Recovery', 'Nutrition', 'Devices', 'Maternity Care'];

const MomKart = ({ profile }) => {
  const { t } = useTranslation();
  const { cart, addToCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [toastMessage, setToastMessage] = useState(null);
  
  const theme = COLORS[profile.accent] || COLORS.PINK;

  const [isTagSticky, setIsTagSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsTagSticky(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = (item) => {
    addToCart(item);
    setToastMessage({ title: t('store.added'), desc: `${item.name} added to cart.` });
    setTimeout(() => setToastMessage(null), 2500);
  };

  const filteredItems = activeCategory === 'All' ? STORE_ITEMS : STORE_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="animate-in w-full -mt-4 lg:-mt-8 pb-32 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 dark:bg-slate-800 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-none">
          <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-full"><CheckCircle2 size={20} /></div>
          <div>
            <p className="font-bold text-sm">{toastMessage.title}</p>
            <p className="text-[11px] text-slate-400 font-medium">{toastMessage.desc}</p>
          </div>
        </div>
      )}
      {/* Floating Basket Anchor */}
      <button 
        onClick={() => navigate('/cart')}
        className="fixed bottom-10 right-10 z-[55] h-16 w-16 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all lg:hidden"
      >
        <ShoppingBag size={24} />
        {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-rose-500 text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">{cart.length}</span>}
      </button>

      <div className="w-full bg-white/60 dark:bg-slate-900/80 backdrop-blur-[10px] rounded-full px-6 lg:px-8 py-3 flex items-center gap-6 lg:gap-8 sticky top-[64px] lg:top-[80px] z-[35] shadow-md transition-all duration-300 border border-white/40 dark:border-slate-700/50 mb-8 mt-4">
        <div className="flex items-center gap-3 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] border-r border-slate-200/50 dark:border-slate-700/50 pr-6 lg:pr-8 shrink-0">
          <ShoppingCart size={14} className="text-emerald-500 dark:text-emerald-400" />
          <span>Curations</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide flex-1 pb-1 lg:pb-0">
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              aria-label={`Filter by ${cat}`}
              onClick={() => setActiveCategory(cat)} 
              className={`whitespace-nowrap px-5 py-2 rounded-full text-[11px] font-bold transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 ${activeCategory === cat ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-lg' : 'bg-slate-50/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 shadow-sm'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="shrink-0 hidden lg:flex items-center gap-6 border-l border-slate-200/50 dark:border-slate-700/50 pl-6 lg:pl-8">
          <button 
            aria-label="View Cart"
            onClick={() => navigate('/cart')} 
            className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-emerald-600 text-white transition-all text-[11px] font-bold active:scale-95 group shadow-xl hover:bg-emerald-500 dark:hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1"
          >
            <ShoppingBag size={14} />
            <span>{t('store.viewCart')}</span>
            <div className="bg-white/20 w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-bold">{cart.length}</div>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-12 mt-10 px-0 md:px-2">
        <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_15px_40px_rgba(0,0,0,0.01)] p-10 lg:p-14 group">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all duration-300 z-50 ${isTagSticky ? 'fixed top-[130px] lg:top-[140px] left-1/2 -translate-x-1/2 shadow-md backdrop-blur-md bg-white/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}><Sparkles size={14} className="text-slate-400 dark:text-slate-500" /><span className="text-[9px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-[0.2em]">Verified Recovery Essentials</span></div>
            <h2 className="text-3xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">{t('store.title')}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm lg:text-lg font-medium max-w-lg leading-relaxed opacity-85">{t('store.subtitle')}</p>
          </div>
          <div className="absolute right-[-2%] top-[-5%] h-[110%] w-2/5 opacity-[0.02] pointer-events-none flex items-center justify-center translate-x-12 group-hover:scale-105 transition-all duration-[2000ms]"><Package size={500} className="text-slate-900 dark:text-white -rotate-12" /></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-[0_25px_60px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_25px_60px_rgba(255,255,255,0.02)] transition-all duration-500 group flex flex-col h-full overflow-hidden relative hover:translate-y-[-6px]">
              <div className="relative aspect-[4/5] bg-slate-50/30 dark:bg-slate-900/50 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-in-out" />
                <div className="absolute top-4 left-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-white/40 dark:border-slate-700"><Star size={11} className="text-amber-400 fill-amber-400" /><span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">{item.rating}</span></div>
              </div>
              <div className="p-7 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center"><p className="text-[8px] font-bold uppercase text-slate-300 dark:text-slate-500 tracking-[0.2em]">{item.brand}</p><span className="text-[7px] font-bold bg-slate-50 dark:bg-slate-700 text-slate-400 dark:text-slate-300 px-2 py-0.5 rounded uppercase tracking-widest border border-slate-100 dark:border-slate-600">{item.category}</span></div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug h-9 line-clamp-2">{item.name}</h3>
                </div>
                <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-50 dark:border-slate-700/50">
                  <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">₹{item.price}</span>
                  {(() => {
                    const cartItem = cart.find(i => i.id === item.id);
                    if (cartItem) {
                      return (
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 rounded-full border border-slate-100 dark:border-slate-600 p-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="h-9 w-9 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-100 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors active:scale-95"><Minus size={16} /></button>
                          <span className="font-bold text-slate-900 dark:text-white w-4 text-center text-sm">{cartItem.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="h-9 w-9 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-100 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors active:scale-95"><Plus size={16} /></button>
                        </div>
                      );
                    }
                    return (
                      <button onClick={() => handleAddToCart(item)} className="h-11 w-11 rounded-full text-white transition-all duration-500 active:scale-90 shadow-lg hover:shadow-xl flex items-center justify-center group/btn relative overflow-hidden" style={{ backgroundColor: theme.primary }}>
                        <Plus size={20} strokeWidth={3} className="relative z-10 group-hover/btn:rotate-90 transition-transform" />
                      </button>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



export default MomKart;

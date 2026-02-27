import { Filter, Minus, Package, Plus, ShoppingBag, Sparkles, Star } from 'lucide-react';
import { useState } from 'react';
import { COLORS, STORE_ITEMS } from '../constants';

const CATEGORIES = ['All', 'Baby Care', 'Recovery', 'Nutrition', 'Devices', 'Maternity Care'];

const MomKart = ({ profile, cart, onAddToCart, onUpdateQuantity, onRemoveItem, onGoToCart }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const theme = COLORS[profile.accent] || COLORS.PINK;

  const filteredItems = activeCategory === 'All'
    ? STORE_ITEMS
    : STORE_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="animate-in w-full -mt-4 lg:-mt-8 pb-32 relative">

      {/* Mobile Floating Cart Button */}
      <button
        onClick={onGoToCart}
        className="fixed bottom-10 right-10 z-[55] h-16 w-16 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all lg:hidden"
      >
        <ShoppingBag size={24} />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">
            {cart.length}
          </span>
        )}
      </button>

      {/* Floating Curation Pill — long, non-stretching, always sticky at top */}
      <div className="sticky top-[80px] z-[50] flex justify-center pointer-events-none mt-2">
        <div className="pointer-events-auto flex items-center gap-6 bg-white/95 backdrop-blur-xl border border-slate-200 shadow-lg px-8 py-3 rounded-full transition-all duration-300 w-[90%] max-w-5xl">
          
          {/* Curations label */}
          <div className="hidden sm:flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-r border-slate-100 pr-6 shrink-0">
            <Filter size={14} className="text-slate-300" />
            <span>Curations</span>
          </div>

          {/* Category pills - using flex-1 to push the cart to the far right */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide flex-1 max-w-[80vw] sm:max-w-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[11px] font-bold transition-all duration-300 active:scale-95
                  ${activeCategory === cat
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cart button - Highlighted & Pushed to far right */}
          <button
            onClick={onGoToCart}
            className="hidden lg:flex items-center gap-2.5 px-6 py-2.5 bg-emerald-600 text-white rounded-full text-[11px] font-bold shadow-[0_8px_16px_rgba(16,185,129,0.3)] hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all shrink-0 group"
          >
            <ShoppingBag size={14} className="group-hover:rotate-12 transition-transform" />
            <span>Cart</span>
            {cart.length > 0 && (
              <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white text-emerald-600 text-[10px] font-black border-2 border-emerald-600">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>


      <div className="max-w-7xl mx-auto space-y-12 mt-16 lg:mt-20 px-0 md:px-2">
        {/* Hero Banner */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-white to-slate-50 border border-slate-100 shadow-sm p-10 lg:p-14 group">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
              <Sparkles size={14} className="text-slate-400" />
              <span className="text-[9px] font-bold uppercase text-slate-500 tracking-[0.2em]">Verified Recovery Essentials</span>
            </div>
            <h2 className="text-3xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              The Safe Store <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-600 to-slate-400">for Maternal Care.</span>
            </h2>
            <p className="text-slate-500 text-sm lg:text-lg font-medium max-w-lg leading-relaxed">
              20+ hand-picked clinical grade products to support your Nurture, Transition, and Healing phases.
            </p>
          </div>
          <div className="absolute right-[-2%] top-[-5%] h-[110%] w-2/5 opacity-[0.02] pointer-events-none flex items-center justify-center group-hover:scale-105 transition-all duration-[2000ms]">
            <Package size={500} className="text-slate-900 -rotate-12" />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
          {filteredItems.map(item => {
            const inCart = cart.find(c => c.id === item.id);
            return (
              <div key={item.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-500 group flex flex-col h-full overflow-hidden hover:translate-y-[-6px]">
                <div className="relative aspect-[4/5] bg-slate-50/30 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm border border-white/40">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-bold text-slate-800">{item.rating}</span>
                  </div>
                </div>
                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-[8px] font-bold uppercase text-slate-300 tracking-[0.2em]">{item.brand}</p>
                      <span className="text-[7px] font-bold bg-slate-50 text-slate-400 px-2 py-0.5 rounded uppercase tracking-widest border border-slate-100">{item.category}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">{item.name}</h3>
                  </div>
                  <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-50">
                    <span className="text-xl font-bold text-slate-900">₹{item.price}</span>
                    {(() => {
                      const cartItem = cart.find(cItem => cItem.id === item.id);
                      if (cartItem) {
                        return (
                          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-full border border-slate-100 shadow-sm">
                            <button onClick={() => cartItem.quantity > 1 ? onUpdateQuantity(item.id, -1) : onRemoveItem(item.id)} className="text-slate-400 hover:text-rose-500 transition-colors p-1">
                              <Minus size={14} strokeWidth={3} />
                            </button>
                            <span className="text-base font-black text-slate-900 min-w-[24px] text-center">{cartItem.quantity}</span>
                            <button onClick={() => onUpdateQuantity(item.id, 1)} className="text-slate-400 hover:text-emerald-500 transition-colors p-1">
                              <Plus size={14} strokeWidth={3} />
                            </button>
                          </div>
                        );
                      }
                      return (
                        <button
                          onClick={() => onAddToCart(item)}
                          style={{ backgroundColor: theme.primary }}
                          className="h-11 w-11 rounded-full text-white transition-all duration-300 active:scale-90 shadow-lg flex items-center justify-center hover:shadow-xl group"
                        >
                          <Plus size={20} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                        </button>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MomKart;

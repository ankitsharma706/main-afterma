import {
  Award,
  ChevronLeft, ChevronRight,
  Filter, Minus, Package, Plus,
  ShieldCheck,
  ShoppingBag, Sparkles, Star,
  Users
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { COLORS, STORE_ITEMS } from '../constants';

const CATEGORIES = [
  'Postpartum Recovery', 
  'Lactation Support', 
  'Nutrition', 
  'Baby Essentials', 
  'Comfort Care', 
  'Wellness Tools'
];

const MomKart = ({ profile, cart, onAddToCart, onUpdateQuantity, onRemoveItem, onGoToCart }) => {
  const [activeCategory, setActiveCategory] = useState('Postpartum Recovery');
  const theme = COLORS?.[profile?.accent] || COLORS.PINK;

  // Curated Recommendations logic from reference
  const recommendedItems = useMemo(() => {
    const stage = profile?.maternityStage || 'Postpartum';
    if (stage === 'Postpartum') {
      return STORE_ITEMS.filter(item => 
        item.category === 'Recovery' || 
        item.category === 'Nutrition' ||
        item.rating >= 4.8
      ).slice(0, 8);
    }
    return STORE_ITEMS.filter(item => 
      item.category === 'Maternity Care' || 
      item.category === 'Nutrition' ||
      item.rating >= 4.8
    ).slice(0, 8);
  }, [profile?.maternityStage]);

  const filteredItems = useMemo(() => {
    // Map UI categories to dataset categories if needed
    const categoryMap = {
      'Postpartum Recovery': 'Recovery',
      'Lactation Support': 'Nutrition', // Assuming based on data
      'Nutrition': 'Nutrition',
      'Baby Essentials': 'Baby Care',
      'Comfort Care': 'Maternity Care',
      'Wellness Tools': 'Devices'
    };
    
    const targetCat = categoryMap[activeCategory] || activeCategory;
    return STORE_ITEMS.filter(item => item.category === targetCat);
  }, [activeCategory]);

  return (
    <div className="w-full pb-32 relative animate-in fade-in duration-700">
      {/* Mobile Floating Cart Button */}
      <button
        onClick={onGoToCart}
        className="fixed bottom-10 right-10 z-[55] h-16 w-16 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all lg:hidden"
      >
        <ShoppingBag size={24} />
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">
            {(cart || []).length}
          </span>
        )}
      </button>

      {/* Floating Header */}
      <div className="sticky top-[64px] lg:top-[80px] z-[50] flex justify-center py-6 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-6 bg-white/90 backdrop-blur-xl border border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.08)] px-8 py-3 rounded-full transition-all duration-300 w-[94%] max-w-5xl">
          <div className="hidden sm:flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-r border-slate-100 pr-6 shrink-0">
            <Filter size={14} className="text-slate-300" />
            <span>Curations</span>
          </div>

          <div className="flex items-center gap-1.5 scrollbar-hide flex-1 overflow-x-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[11px] font-bold transition-all duration-300 active:scale-95
                  ${activeCategory === cat
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={onGoToCart}
            className="hidden lg:flex items-center gap-2.5 px-6 py-2.5 bg-emerald-600 text-white rounded-full text-[11px] font-bold shadow-lg hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all shrink-0 group"
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

      <div className="max-w-7xl mx-auto space-y-20 mt-16 px-4 lg:px-8">
        {/* Hero Section */}
        <div 
          className="relative rounded-[3rem] overflow-hidden border border-[#F3E5D8] p-10 lg:p-16 shadow-sm"
          
        >
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-white/50 rounded-xl border border-[#F3E5D8]">
              <Sparkles size={14} className="text-[#8B5E3C]" />
              <span className="text-[9px] font-bold uppercase text-[#8B5E3C] tracking-[0.2em]">Clinical Discovery</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black text-[#5D4037] tracking-tight leading-[1.1]">
              Recommended <br />
              <span className="text-[#8B5E3C]">For You, Mama..</span>
            </h2>
            <p className="text-[#A1887F] text-sm lg:text-lg font-medium max-w-lg leading-relaxed italic">
              "Hand-picked clinical grade products to support your Postpartum journey."
            </p>
          </div>
          <div className="absolute right-[-5%] top-[-10%] h-[120%] w-1/2 opacity-[0.05] pointer-events-none flex items-center justify-center">
            <ShoppingBag size={600} className="text-[#8B5E3C] -rotate-12" />
          </div>
        </div>

        {/* 1. Recommended Section */}
        <div className="space-y-10">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-xl border border-amber-100">
                  <Award size={20} className="text-amber-500" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recommended for Mothers</h3>
              </div>
              <p className="text-sm text-slate-400 font-medium italic max-w-xl">Based on your maternal needs, expert suggestions, and community feedback.</p>
            </div>
          </div>
          
          <ProductFocusRow 
            items={recommendedItems} 
            cart={cart}
            theme={theme}
            onAddToCart={onAddToCart}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />
        </div>

        {/* 2. Explore Store Section */}
        <div className="space-y-10 pt-10 border-t border-slate-100">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                  <Package size={20} className="text-slate-400" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Explore the Store</h3>
              </div>
              <p className="text-sm text-slate-400 font-medium italic">Organized by your specific needs and wellness goals.</p>
            </div>
          </div>

          <ProductFocusRow 
            items={filteredItems} 
            cart={cart}
            theme={theme}
            onAddToCart={onAddToCart}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />
        </div>
      </div>
    </div>
  );
};

const ProductFocusRow = ({ items, cart, theme, onAddToCart, onUpdateQuantity, onRemoveItem }) => {
  const scrollRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const itemWidth = 320 + 24; 
      const index = Math.round(scrollLeft / itemWidth);
      setFocusedIndex(index);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -344 : 344;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-slate-300 space-y-4 bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200">
        <Package size={40} className="opacity-50" />
        <p className="text-[10px] font-bold uppercase tracking-widest">No essentials found in this category</p>
      </div>
    );
  }

  return (
    <div className="relative group/row">
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-[40%] -translate-y-1/2 -translate-x-4 z-20 p-3 bg-white rounded-full shadow-xl border border-slate-100 text-slate-400 hover:text-slate-900 transition-all opacity-0 group-hover/row:opacity-100 hidden lg:block"
      >
        <ChevronLeft size={20} />
      </button>
      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-[40%] -translate-y-1/2 translate-x-4 z-20 p-3 bg-white rounded-full shadow-xl border border-slate-100 text-slate-400 hover:text-slate-900 transition-all opacity-0 group-hover/row:opacity-100 hidden lg:block"
      >
        <ChevronRight size={20} />
      </button>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-12 -mx-4 px-4 lg:-mx-8 lg:px-8 snap-x snap-mandatory"
      >
        {items.map((item, index) => (
          <div key={item.id} className="snap-center">
            <ProductCard 
              item={item} 
              isFocused={index === focusedIndex}
              cartItem={cart.find(c => c.id === item.id)}
              theme={theme}
              onAddToCart={onAddToCart}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductCard = ({ item, isFocused, cartItem, theme, onAddToCart, onUpdateQuantity, onRemoveItem }) => {
  return (
    <div 
      className={`min-w-[280px] md:min-w-[320px] rounded-[2.5rem] border border-slate-100 shadow-sm transition-all duration-500 group flex flex-col h-full overflow-hidden relative 
        ${isFocused ? 'scale-100 opacity-100' : 'scale-95 opacity-70'}
        hover:shadow-[0_25px_60px_rgba(0,0,0,0.06)] hover:scale-100 hover:opacity-100 hover:-translate-y-2`}
      style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)' }}
    >
      <div className="relative aspect-[4/5] bg-slate-50/30 overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1500ms] ease-out" 
        />
        
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm border border-white/40 z-20">
          <ShieldCheck size={12} className="text-emerald-500" />
          <span className="text-[9px] font-bold text-slate-800 uppercase tracking-wider">Clinical Grade</span>
        </div>

        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-white/40 z-20">
          <Star size={10} className="text-amber-400 fill-amber-400" />
          <span className="text-[10px] font-bold text-slate-800">{item.rating}</span>
        </div>
        
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm p-8 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-6 group-hover:translate-y-0 z-10">
           <div className="p-3 bg-white/10 rounded-2xl mb-4"><Sparkles size={24} className="text-emerald-400" /></div>
           <p className="text-white text-xs font-medium leading-relaxed italic">"{item.description}"</p>
           <div className="mt-6 flex items-center gap-2 text-[8px] font-bold text-emerald-400 uppercase tracking-widest border border-emerald-400/30 px-3 py-1.5 rounded-full">
              <Users size={12} /> Sister Approved
           </div>
        </div>
      </div>

      <div className="p-7 flex-1 flex flex-col justify-between bg-white">
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <p className="text-[8px] font-bold uppercase text-slate-300 tracking-[0.2em]">{item.brand}</p>
            <span className="text-[7px] font-bold bg-slate-50 text-slate-400 px-2 py-0.5 rounded uppercase tracking-widest border border-slate-100">{item.category}</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 leading-snug h-9 line-clamp-2">{item.name}</h3>
        </div>
        
        <div className="mt-4 p-3 bg-slate-50/50 rounded-2xl border border-slate-50">
          <p className="text-[9px] text-slate-400 font-medium italic leading-tight">
            "A verified essential recommended for your specific healing stage."
          </p>
        </div>

        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-50">
          <span className="text-xl font-bold text-slate-900 tracking-tight">₹{item.price}</span>
          {cartItem ? (
            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-full border border-slate-100 shadow-sm">
              <button 
                onClick={() => cartItem.quantity > 1 ? onUpdateQuantity(item.id, -1) : onRemoveItem(item.id)} 
                className="text-slate-400 hover:text-rose-500 transition-colors p-1"
              >
                <Minus size={14} strokeWidth={3} />
              </button>
              <span className="text-base font-black text-slate-900 min-w-[24px] text-center">{cartItem.quantity}</span>
              <button 
                onClick={() => onUpdateQuantity(item.id, 1)} 
                className="text-slate-400 hover:text-emerald-500 transition-colors p-1"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => onAddToCart(item)} 
              style={{ backgroundColor: theme.primary }}
              className="flex items-center gap-2 px-5 py-2.5 text-white rounded-full font-bold text-[10px] uppercase tracking-widest shadow-lg hover:shadow-xl hover:brightness-105 active:scale-95 transition-all"
            >
              <Plus size={14} strokeWidth={3} />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MomKart;


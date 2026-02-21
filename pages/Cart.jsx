import { ChevronRight, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../constants';
import { useCart } from '../context/CartContext';

const Cart = ({ profile }) => {
  const { cart, removeFromCart, updateQuantity, cartSubtotal } = useCart();
  const navigate = useNavigate();
  const [expressDelivery, setExpressDelivery] = useState(false);
  const theme = COLORS[profile.accent] || COLORS.PINK;

  const taxRate = 0.09; // 9% SGST + 9% CGST = 18% Total
  const sgst = Math.round(cartSubtotal * taxRate);
  const cgst = Math.round(cartSubtotal * taxRate);
  const deliveryCharge = expressDelivery ? 49 : 0;
  const total = cartSubtotal + sgst + cgst + deliveryCharge;

  return (
    <div className="animate-in fade-in duration-300 min-h-screen pt-4 pb-32">
      <div className="max-w-4xl mx-auto space-y-8 px-4">
        
        <div className="flex justify-between items-center border-b border-slate-50 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 border border-emerald-100 shadow-inner">
              <ShoppingBag size={24} />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Healing Cart</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{cart.length} verified items</p>
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 space-y-6">
            <ShoppingBag size={64} className="mx-auto text-slate-200" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800">Your cart is empty</h3>
              <p className="text-slate-500">Discover hand-picked items for your recovery.</p>
            </div>
            <button 
              onClick={() => navigate('/momkart')}
              className="px-8 py-3 bg-emerald-600 text-white rounded-full font-bold shadow-lg hover:bg-emerald-700 transition"
            >
              Browse Store
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 p-5 rounded-[2rem] bg-white border border-slate-100 shadow-sm transition hover:shadow-md group">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-slate-50">
                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <span className="text-[8px] font-bold uppercase text-slate-400 tracking-widest">{item.brand}</span>
                        <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">{item.name}</h4>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors shrink-0">
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <span className="font-black text-slate-900 text-lg">₹{item.price}</span>
                      <div className="flex items-center gap-4 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                        <button onClick={() => updateQuantity(item.id, -1)} className="text-slate-400 hover:text-slate-900 transition-colors"><Minus size={14} strokeWidth={3} /></button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="text-slate-400 hover:text-slate-900 transition-colors"><Plus size={14} strokeWidth={3} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] space-y-6 sticky top-24">
                <h3 className="font-black text-slate-900 text-lg border-b border-slate-50 pb-4">Order Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-bold text-slate-500"><span>Subtotal</span><span className="text-slate-900">₹{cartSubtotal}</span></div>
                  <div className="flex justify-between text-sm font-bold text-slate-500"><span>GST (18%)</span><span className="text-slate-900">₹{sgst + cgst}</span></div>
                  <div className="flex justify-between items-center text-sm font-bold text-slate-500 pt-2">
                    <div className="flex items-center gap-3">
                      <span>Express Delivery</span>
                      <button onClick={() => setExpressDelivery(!expressDelivery)} className={`w-10 h-6 rounded-full relative transition-all duration-300 ${expressDelivery ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${expressDelivery ? 'left-5' : 'left-1'}`} />
                      </button>
                    </div>
                    <span className={expressDelivery ? 'text-slate-900 font-bold' : 'text-emerald-500'}>{expressDelivery ? '+₹49' : 'FREE'}</span>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-slate-100 space-y-6">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total</span>
                    <span className="text-3xl font-black text-slate-900 tracking-tight leading-none">₹{total}</span>
                  </div>
                  
                  <button 
                    onClick={() => navigate('/payment')}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95"
                  >
                    Proceed to Payment <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

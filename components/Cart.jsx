import { ArrowLeft, Minus, Plus, ShoppingBag, Truck, X } from 'lucide-react';
import { useState } from 'react';
import { COLORS } from '../constants';

const Cart = ({ profile, cart, onUpdateQuantity, onRemoveItem, onGoBack, onGoToPayment }) => {
  const theme = COLORS[profile.accent] || COLORS.PINK;
  const [expressDelivery, setExpressDelivery] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = Math.round(subtotal * 0.18);
  const deliveryCharge = expressDelivery ? 49 : 0;
  const total = subtotal + gst + deliveryCharge;

  return (
    <div className="animate-in min-h-screen pb-32" style={{ backgroundColor: '#f8fafc' }}>
      {/* Floating Header Pill */}
      <div className="sticky top-[80px] z-[50] flex justify-center pointer-events-none mt-2">
        <div className="pointer-events-auto flex items-center gap-5 bg-white/95 backdrop-blur-xl border border-slate-200 shadow-lg px-6 py-2.5 rounded-full transition-all duration-300 w-[90%] max-w-5xl">
          <button onClick={onGoBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex-1 flex items-center gap-3 border-l border-slate-100 pl-5">
            <h1 className="text-lg font-black text-slate-900 tracking-tight">Your Cart</h1>
            <span className="text-slate-300 hidden sm:block">•</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
              {cart.length} item{cart.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-5 gap-8 px-4 lg:px-0">
        {/* Cart Items */}
        <div className={cart.length === 0 ? "lg:col-span-5 space-y-4" : "lg:col-span-3 space-y-4"}>
          {cart.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-16 text-center space-y-6">
              <div className="p-8 bg-slate-50 rounded-full w-fit mx-auto text-slate-200">
                <ShoppingBag size={56} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Cart is empty</h3>
                <p className="text-slate-400 text-sm">Add products from the store to get started.</p>
              </div>
              <button onClick={onGoBack} className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-slate-700 transition-all">
                Browse Store
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-5 flex gap-5 hover:shadow-md transition-all">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{item.brand}</p>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug mt-0.5">{item.name}</h4>
                    </div>
                    <button onClick={() => onRemoveItem(item.id)} className="p-1.5 text-slate-200 hover:text-rose-400 hover:bg-rose-50 rounded-lg transition-all shrink-0">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-black text-slate-900">₹{item.price * item.quantity}</span>
                    <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                      <button onClick={() => onUpdateQuantity(item.id, -1)} className="text-slate-400 hover:text-slate-900 transition-colors">
                        <Minus size={13} strokeWidth={3} />
                      </button>
                      <span className="text-sm font-black text-slate-900 min-w-[20px] text-center">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, 1)} className="text-slate-400 hover:text-slate-900 transition-colors">
                        <Plus size={13} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Summary Panel */}
        {cart.length > 0 && (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6 lg:sticky lg:top-36">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Order Summary</h3>

              <div className="space-y-3">
                <SummaryRow label="Subtotal" value={`₹${subtotal}`} />
                <SummaryRow label="GST (18%)" value={`₹${gst}`} />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck size={14} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-500">Express</span>
                    <button
                      onClick={() => setExpressDelivery(p => !p)}
                      className={`w-10 h-5 rounded-full relative transition-all duration-300 shrink-0 ${expressDelivery ? 'bg-emerald-500' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${expressDelivery ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                  <span className={`text-sm font-bold ${expressDelivery ? 'text-slate-900' : 'text-emerald-500'}`}>
                    {expressDelivery ? '+₹49' : 'FREE'}
                  </span>
                </div>
                <div className="h-px bg-slate-100 my-1" />
                <div className="flex justify-between items-center pt-1">
                  <span className="text-base font-black text-slate-900">Total</span>
                  <span className="text-2xl font-black text-slate-900">₹{total}</span>
                </div>
              </div>

              <button
                onClick={() => onGoToPayment({ total, subtotal, gst, deliveryCharge, expressDelivery })}
                style={{ backgroundColor: theme.primary }}
                className="w-full py-5 text-white rounded-2xl font-black text-sm shadow-xl hover:brightness-105 active:scale-[0.98] transition-all"
              >
                Proceed to Payment →
              </button>

              <button onClick={onGoBack} className="w-full py-3 text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-700 transition-colors">
                ← Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-sm font-bold text-slate-400">{label}</span>
    <span className="text-sm font-bold text-slate-900">{value}</span>
  </div>
);

export default Cart;

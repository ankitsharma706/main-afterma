import { ArrowLeft, ChevronRight, CreditCard, Landmark, Lock, ShieldCheck, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../constants';
import { useCart } from '../context/CartContext';

const Payment = ({ profile }) => {
  const { cartTotal, cartSubtotal, setCart } = useCart();
  const navigate = useNavigate();
  const theme = COLORS[profile.accent] || COLORS.PINK;
  const [paymentMethod, setPaymentMethod] = useState('upi');
  
  // Calculate total (assume fast delivery for checkout summary logic consistency)
  const taxRate = 0.18;
  const gst = Math.round(cartSubtotal * taxRate);
  const total = cartSubtotal + gst;

  if (cartSubtotal === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">No items to checkout</h2>
        <button onClick={() => navigate('/momkart')} className="px-6 py-3 bg-emerald-600 text-white rounded-full font-bold">Return to Store</button>
      </div>
    );
  }

  const handlePayment = () => {
    alert(`Secure Payment Processed for ₹${total} via ${paymentMethod.toUpperCase()}`);
    setCart([]); // Empty cart
    navigate('/momkart'); // Return to store
  }

  return (
    <div className="animate-in fade-in duration-300 min-h-screen pt-4 pb-32 max-w-2xl mx-auto px-4">
      <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm mb-8 transition-colors">
        <ArrowLeft size={16} /> Back to Cart
      </button>
      
      <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.04)] space-y-10">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-900 border border-slate-100 shadow-sm">
            <Lock size={28} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Secure Checkout</h1>
          <p className="text-sm font-bold text-slate-400 flex items-center justify-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> 256-bit encrypted transaction</p>
        </div>

        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount to Pay</p>
          <div className="text-5xl font-black text-slate-900 tracking-tighter">₹{total}</div>
        </div>

        <div className="space-y-4">
           <h3 className="text-sm font-bold text-slate-900 pl-2">Select Payment Method</h3>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <PaymentOption active={paymentMethod === 'upi'} onClick={() => setPaymentMethod('upi')} icon={<Smartphone size={20} />} label="UPI App" />
              <PaymentOption active={paymentMethod === 'card'} onClick={() => setPaymentMethod('card')} icon={<CreditCard size={20} />} label="Credit / Debit" />
              <PaymentOption active={paymentMethod === 'nb'} onClick={() => setPaymentMethod('nb')} icon={<Landmark size={20} />} label="Net Banking" />
           </div>
        </div>

        <button 
          onClick={handlePayment}
          className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-bold flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-lg"
        >
          Pay ₹{total} <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

const PaymentOption = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`p-6 rounded-[2rem] border-2 flex flex-col items-center gap-3 transition-all active:scale-95 ${active ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}>
     {icon}
     <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);

export default Payment;

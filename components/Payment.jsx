import { ArrowLeft, CheckCircle2, CreditCard, Landmark, Lock, ShieldCheck, Smartphone, Sparkles, Zap } from 'lucide-react';
import { useState } from 'react';
import { COLORS } from '../constants';

const Payment = ({ profile, cart, orderSummary, onGoBack, onSuccess }) => {
  const theme = COLORS[profile.accent] || COLORS.PINK;
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNum, setCardNum] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [paid, setPaid] = useState(false);

  const { total, subtotal, gst, deliveryCharge } = orderSummary;

  const handlePay = () => {
    if (window.Razorpay) {
      const options = {
        key: 'rzp_test_your_key_here',
        amount: total * 100,
        currency: 'INR',
        name: 'AfterMa Store',
        description: 'Maternal Care Essentials',
        handler: () => { setPaid(true); setTimeout(() => onSuccess(), 2000); },
        prefill: { name: profile.name, contact: profile.caregiver?.contact || '9999999999' },
        theme: { color: theme.primary },
      };
      new window.Razorpay(options).open();
    } else {
      // Simulated success fallback
      setPaid(true);
      setTimeout(() => onSuccess(), 2000);
    }
  };

  if (paid) {
    return (
      <div className="animate-in min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: '#f0fdf4' }}>
        <div className="text-center space-y-8 max-w-sm">
          <div className="w-28 h-28 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200 animate-bounce-slow">
            <CheckCircle2 size={56} className="text-white" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Payment Successful!</h2>
            <p className="text-slate-500 font-medium">Your maternal care essentials are on their way. Redirecting…</p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-emerald-100 shadow-sm space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount Paid</p>
            <p className="text-4xl font-black text-emerald-600">₹{total}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in min-h-screen pb-32" style={{ backgroundColor: '#f8fafc' }}>
      {/* Floating Header Pill */}
      <div className="sticky top-[80px] z-[50] flex justify-center pointer-events-none mt-2">
        <div className="pointer-events-auto flex items-center gap-5 bg-white/95 backdrop-blur-xl border border-slate-200 shadow-lg px-6 py-2.5 rounded-full transition-all duration-300 w-[90%] max-w-5xl">
          <button onClick={onGoBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900 group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex-1 flex items-center gap-3 border-l border-slate-100 pl-5">
            <h1 className="text-lg font-black text-slate-900 tracking-tight">Secure Payment</h1>
            <span className="text-slate-300 hidden sm:block">•</span>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
              256-bit SSL Encrypted
            </p>
          </div>
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
            <Lock size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Secure</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-16 lg:mt-20 grid grid-cols-1 lg:grid-cols-5 gap-8 px-4 lg:px-0">
        {/* Payment Methods */}
        <div className="lg:col-span-3 space-y-5">

          {/* Method Tabs */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6">
            <h3 className="text-base font-black text-slate-900 tracking-tight">Select Payment Method</h3>
            <div className="grid grid-cols-3 gap-3">
              <MethodTab active={paymentMethod === 'upi'} onClick={() => setPaymentMethod('upi')} icon={<Smartphone size={20} />} label="UPI" />
              <MethodTab active={paymentMethod === 'card'} onClick={() => setPaymentMethod('card')} icon={<CreditCard size={20} />} label="Card" />
              <MethodTab active={paymentMethod === 'nb'} onClick={() => setPaymentMethod('nb')} icon={<Landmark size={20} />} label="Net Banking" />
            </div>

            {/* UPI Form */}
            {paymentMethod === 'upi' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex gap-3">
                  {['gpay', 'phonepe', 'paytm'].map(app => (
                    <button key={app} className="flex-1 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all">
                      {app === 'gpay' ? '🟢 GPay' : app === 'phonepe' ? '🟣 PhonePe' : '🔵 Paytm'}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <input
                    type="text" value={upiId} onChange={e => setUpiId(e.target.value)}
                    placeholder="Enter UPI ID (e.g. name@upi)"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-300 transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Zap size={16} className="text-slate-300" />
                  </div>
                </div>
              </div>
            )}

            {/* Card Form */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <input
                  type="text" maxLength={19} value={cardNum}
                  onChange={e => setCardNum(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                  placeholder="Card Number"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all tracking-widest"
                />
                <input
                  type="text" value={cardName} onChange={e => setCardName(e.target.value)}
                  placeholder="Name on Card"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text" maxLength={5} value={cardExpiry}
                    onChange={e => { const v = e.target.value.replace(/\D/g,''); setCardExpiry(v.length > 2 ? v.slice(0,2)+'/'+v.slice(2) : v); }}
                    placeholder="MM / YY"
                    className="px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
                  />
                  <input
                    type="password" maxLength={4} value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g,''))}
                    placeholder="CVV"
                    className="px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Net Banking */}
            {paymentMethod === 'nb' && (
              <div className="grid grid-cols-2 gap-3 animate-in fade-in duration-300">
                {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'Yes Bank'].map(bank => (
                  <button key={bank} className="py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-100 hover:border-slate-200 transition-all">
                    {bank}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Security Badges */}
          <div className="flex items-center justify-center gap-6 py-2">
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Sparkles size={14} className="text-indigo-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest">RBI Compliant</span>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 space-y-6 lg:sticky lg:top-36">
            <h3 className="text-base font-black text-slate-900">Order Summary</h3>

            {/* Items preview */}
            <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-hide">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-black text-slate-900 shrink-0">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="h-px bg-slate-100" />

            <div className="space-y-2">
              <SummaryRow label="Subtotal" value={`₹${subtotal}`} />
              <SummaryRow label="GST (18%)" value={`₹${gst}`} />
              <SummaryRow label="Delivery" value={deliveryCharge ? `₹${deliveryCharge}` : 'FREE'} highlight={!deliveryCharge} />
              <div className="h-px bg-slate-100 my-1" />
              <div className="flex justify-between items-center pt-1">
                <span className="font-black text-slate-900">Total</span>
                <span className="text-2xl font-black text-slate-900">₹{total}</span>
              </div>
            </div>

            <button
              onClick={handlePay}
              style={{ backgroundColor: theme.primary }}
              className="w-full py-5 text-white rounded-2xl font-black text-sm shadow-xl hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Lock size={16} /> Pay ₹{total} Securely
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MethodTab = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${active ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-slate-200'}`}>
    {icon}
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const SummaryRow = ({ label, value, highlight }) => (
  <div className="flex justify-between">
    <span className="text-sm font-bold text-slate-400">{label}</span>
    <span className={`text-sm font-bold ${highlight ? 'text-emerald-500' : 'text-slate-900'}`}>{value}</span>
  </div>
);

export default Payment;

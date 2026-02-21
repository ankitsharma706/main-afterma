import { ArrowRight, Mail, ShieldCheck, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { COLORS } from '../constants';
import { useAuth } from '../context/AuthContext';

const SignIn = ({ profile, onLegacyLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [view, setView] = useState('main'); 
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const theme = COLORS[profile?.accent] || COLORS.PINK;
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSuccessfulLogin = (provider) => {
    // Fire the legacy app hook to maintain AfterMa backwards compatibility
    if (onLegacyLogin) onLegacyLogin(provider);
    navigate(from, { replace: true });
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    await login({ email, password }, 'email');
    handleSuccessfulLogin('email');
  };

  const handlePhoneOTP = async (e) => {
    e.preventDefault();
    // Simulate OTP sent and verified
    await login({ phone }, 'phone');
    handleSuccessfulLogin('phone');
  };

  const handleProviderLogin = async (provider) => {
    // Redirect to backend OAuth route in production:
    // window.location.href = `/auth/${provider}`;
    await login({ email: `user@${provider}.com` }, provider);
    handleSuccessfulLogin(provider);
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
      <div className="bg-white rounded-[2.5rem] p-10 lg:p-14 border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] w-full max-w-md space-y-8 relative overflow-hidden">
        
        
        <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-10 pointer-events-none blur-3xl" style={{ backgroundColor: theme.primary }} />

        <div className="text-center space-y-2 relative z-10">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-sm font-bold text-slate-400">Sign in to continue your journey</p>
        </div>

        {view === 'main' && (
          <div className="space-y-4 relative z-10">
            <AuthButton icon={<Mail size={20} />} label="Continue with Email" onClick={() => setView('email')} />
            <AuthButton icon={<Smartphone size={20} />} label="Continue with Phone" onClick={() => setView('phone')} />
            
            <div className="flex items-center gap-4 py-4">
               <div className="h-px bg-slate-100 flex-1" />
               <span className="text-[10px] uppercase font-bold text-slate-300 tracking-widest">or</span>
               <div className="h-px bg-slate-100 flex-1" />
            </div>

            <AuthButton 
              icon={<svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>} 
              label="Continue with Google" 
              onClick={() => handleProviderLogin('google')} 
            />
            <AuthButton 
              icon={<svg className="w-5 h-5 text-slate-800" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.34-.84 3.86-.75 1.7.07 3.08.79 3.86 1.93-3.2 1.83-2.67 6.17.42 7.42-.77 1.88-1.78 3.83-3.22 3.57zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.54-3.74 4.25z"/></svg>} 
              label="Continue with Apple" 
              onClick={() => handleProviderLogin('apple')} 
            />
            <AuthButton 
              icon={<svg className="w-5 h-5 text-[#00a4ef]" viewBox="0 0 23 23"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>} 
              label="Continue with Microsoft" 
              onClick={() => handleProviderLogin('microsoft')} 
            />
          </div>
        )}

        {view === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-4 animate-in slide-in-from-right-4 relative z-10">
            <button type="button" onClick={() => setView('main')} className="text-xs font-bold text-slate-400 mb-2 hover:text-slate-900 transition-colors">← Back</button>
            <div className="space-y-3">
              <input type="email" placeholder="Email Address" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium" />
              <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium" />
            </div>
            <button type="submit" className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors mt-2">
              Sign In <ArrowRight size={16} />
            </button>
          </form>
        )}

        {view === 'phone' && (
          <form onSubmit={handlePhoneOTP} className="space-y-4 animate-in slide-in-from-right-4 relative z-10">
             <button type="button" onClick={() => setView('main')} className="text-xs font-bold text-slate-400 mb-2 hover:text-slate-900 transition-colors">← Back</button>
             <input type="tel" placeholder="Phone Number" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200 transition-all text-sm font-medium tracking-wide" />
             <button type="submit" className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors mt-2">
              Get OTP <ArrowRight size={16} />
            </button>
          </form>
        )}
        
        <p className="text-[10px] text-center text-slate-400 font-bold flex items-center justify-center gap-1.5 pt-4">
          <ShieldCheck size={14} className="text-emerald-500" /> Secure and encrypted
        </p>

      </div>
    </div>
  );
};

const AuthButton = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-[0.98] group"
  >
    <div className="shrink-0 group-hover:scale-110 transition-transform">{icon}</div>
    <span className="font-bold text-sm text-slate-700">{label}</span>
  </button>
);

export default SignIn;

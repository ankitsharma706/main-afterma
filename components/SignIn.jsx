
import { ArrowLeft, Eye, EyeOff, Heart, Loader2, Mail, Phone, ShieldCheck, Stethoscope, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { authAPI } from '../services/api.js';

/* ─── SVG Brand Icons ─────────────────────────────────────── */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 814 1000">
    <path fill="#1a1a1a" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 405.8 8.5 310.6 8.5 217.4c0-168.4 109.8-258.1 218.3-258.1 67.5 0 122.9 43.4 163.4 43.4 39.1 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
  </svg>
);

/* ─── Email Sub-form ─────────────────────────────────────── */
const EmailForm = ({ onBack, onLogin, mode, role }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let user;
      if (mode === 'signup') {
        // register() saves token and returns user directly
        user = await authAPI.register({ email, password, confirmPassword, full_name: name, role: role === 'expert' ? 'doctor' : 'user' });
        // If register doesn't return user (some setups), login manually
        if (!user) user = await authAPI.login({ email, password });
      } else {
        // login() saves token and returns user directly
        user = await authAPI.login({ email, password });
      }
      // Fallback: fetch user profile if not returned
      if (!user) user = await authAPI.getMe();
      onLogin(role, user);
    } catch (err) {
      setError(err?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm font-semibold transition-colors group">
        <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
        Back
      </button>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-800">
          {mode === 'signup' ? 'Create your account' : 'Welcome back'}
        </h3>
        <p className="text-sm text-slate-400">Use your email to {mode === 'signup' ? 'get started' : 'sign in'}</p>
      </div>
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-xl">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === 'signup' && (
          <input
            type="text" autoFocus value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Full Name"
            required
            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all text-sm"
          />
        )}
        <input
          type="email" value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email address"
          required
          autoFocus={mode !== 'signup'}
          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all text-sm"
        />
        <div className="relative">
          <input
            type={showPw ? 'text' : 'password'} value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password (min 8 chars, 1 uppercase, 1 number)"
            required
            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all pr-12 text-sm"
          />
          <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {mode === 'signup' && (
          <input
            type="password" value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all text-sm"
          />
        )}
        {mode === 'signin' && (
          <div className="text-right">
            <span className="text-xs text-pink-500 font-semibold cursor-pointer hover:text-pink-700">Forgot password?</span>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold text-sm hover:from-pink-600 hover:to-rose-600 active:scale-[0.98] transition-all shadow-lg shadow-pink-200 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Please wait...' : (mode === 'signup' ? 'Create Account' : 'Sign In')}
        </button>
      </form>
    </div>
  );
};

/* ─── Phone Sub-form ─────────────────────────────────────── */
const PhoneForm = ({ onBack, onLogin, mode, role }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputsRef = React.useRef([]);

  const handleSendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      await authAPI.sendOtp({ phone: `+91${phone}` });
      setStep('otp');
    } catch (err) {
      setError(err?.message || 'Failed to send OTP. Check your number.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join('');
    setError('');
    setLoading(true);
    try {
      // verifyOtp returns user and saves token
      const user = await authAPI.verifyOtp({ phone: `+91${phone}`, code, role: role === 'expert' ? 'doctor' : 'user' });
      onLogin(role, user);
    } catch (err) {
      setError(err?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (val, idx) => {
    const newOtp = [...otp];
    newOtp[idx] = val.replace(/\D/, '').slice(-1);
    setOtp(newOtp);
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
    if (newOtp.every(d => d !== '')) handleVerifyOtp();
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm font-semibold transition-colors group">
        <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
        Back
      </button>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-800">
          {step === 'phone' ? 'Enter your phone number' : 'Verify OTP'}
        </h3>
        <p className="text-sm text-slate-400">
          {step === 'phone' ? "We'll send you a 6-digit code" : `Sent to +91 ${phone}`}
        </p>
      </div>
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-xl">
          {error}
        </div>
      )}
      {step === 'phone' ? (
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex items-center px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-bold text-sm shrink-0">+91</div>
            <input
              type="tel" autoFocus value={phone} onChange={e => {
                const digitsOnly = e.target.value.replace(/\D/g, '');
                const finalPhone = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly;
                setPhone(finalPhone);
              }}
              placeholder="Phone number"
              className="flex-1 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all text-sm"
            />
          </div>
          <button
            onClick={handleSendOtp}
            disabled={loading || phone.length < 10}
            className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold text-sm hover:from-pink-600 hover:to-rose-600 active:scale-[0.98] transition-all shadow-lg shadow-pink-200 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex gap-2 justify-center">
            {otp.map((d, i) => (
              <input
                key={i} ref={el => inputsRef.current[i] = el}
                type="text" inputMode="numeric" maxLength={1} value={d}
                onChange={e => handleOtpChange(e.target.value, i)}
                onKeyDown={e => e.key === 'Backspace' && !d && i > 0 && inputsRef.current[i-1]?.focus()}
                className="w-10 h-12 text-center text-lg font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition-all"
              />
            ))}
          </div>
          <button
            onClick={handleVerifyOtp}
            disabled={loading || otp.some(d => !d)}
            className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-bold text-sm hover:from-pink-600 hover:to-rose-600 active:scale-[0.98] transition-all shadow-lg shadow-pink-200 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </div>
      )}
    </div>
  );
};

/* ─── Main SignIn Component ─────────────────────────────── */
const SignIn = ({ onLogin, onClose }) => {
  const [view, setView] = useState('main');
  const [mode, setMode] = useState('signin');
  const [role, setRole] = useState('mother');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');

  // Load Google GSI script and initialize Google Auth on mount/view change
  useEffect(() => {
    const initGoogle = () => {
      const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
      if (!CLIENT_ID || !window.google?.accounts?.id) return;

      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: async (response) => {
          setGoogleLoading(true);
          setGoogleError('');
          try {
            const user = await authAPI.loginWithGoogle(response.credential);
            const userData = user || await authAPI.getMe();
            onLogin(role, userData);
          } catch (err) {
            setGoogleError(err?.message || 'Google sign-in failed. Please try Email or Phone.');
          } finally {
            setGoogleLoading(false);
          }
        },
      });

      // Render the hidden official Google button over our custom button to robustly capture clicks
      const btnWrapper = document.getElementById('google-btn-wrapper');
      if (btnWrapper) {
        window.google.accounts.id.renderButton(btnWrapper, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          width: btnWrapper.offsetWidth || 300,
        });
      }
    };

    if (view === 'main') {
      if (!document.getElementById('google-gsi-script')) {
        const script = document.createElement('script');
        script.id = 'google-gsi-script';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initGoogle;
        document.head.appendChild(script);
      } else {
        // Yield to let DOM element render before attaching the button
        setTimeout(initGoogle, 100);
      }
    }
  }, [view, role, onLogin]);

  const ProviderBtn = ({ icon, label, onClick, loading: btnLoading, className = '' }) => (
    <button
      onClick={onClick}
      disabled={btnLoading}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white font-semibold text-slate-700 text-sm transition-all active:scale-[0.98] hover:shadow-md hover:bg-slate-50 border border-slate-200 disabled:opacity-60 ${className}`}
    >
      <span className="w-5 h-5 flex items-center justify-center shrink-0">
        {btnLoading ? <Loader2 size={18} className="animate-spin text-pink-500" /> : icon}
      </span>
      {label}
    </button>
  );

  const handleBackdropClick = (e) => {
    if (onClose && (
      e.target.classList.contains('signin-fullpage') ||
      e.target.classList.contains('signin-right-panel') ||
      e.target.classList.contains('signin-left-panel')
    )) {
      onClose();
    }
  };

  return (
    <div className="signin-fullpage" onClick={handleBackdropClick}>
      {/* Animated background blobs */}
      <div className="signin-blob signin-blob-1" />
      <div className="signin-blob signin-blob-2" />
      <div className="signin-blob signin-blob-3" />

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="signin-close-btn"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      )}

      {/* Left panel – branding (hidden on small screens) */}
      <div className="signin-left-panel">
        <div className="signin-brand">
          <div className="signin-logo-ring">
            <Heart size={28} fill="white" className="text-white" />
          </div>
          <h1 className="signin-brand-name">AfterMa</h1>
          <p className="signin-brand-slogan">YOUR MATERNAL CARE COMPANION</p>
        </div>

        <div className="signin-features">
          {[
            { icon: '🌸', title: 'Personalised Recovery', desc: 'Tailored plans for your postpartum journey' },
            { icon: '🧠', title: 'Mental Wellness', desc: 'Evidence-based support for emotional health' },
            { icon: '👩‍⚕️', title: 'Expert Connect', desc: 'Chat with verified doctors & specialists' },
            { icon: '⭐', title: 'AfterMa Plus', desc: 'Premium membership with exclusive benefits' },
          ].map((f, i) => (
            <div key={i} className="signin-feature-card">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <p className="signin-feature-title">{f.title}</p>
                <p className="signin-feature-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="signin-trust">
          <ShieldCheck size={14} />
          <span>HIPAA compliant · End-to-end encrypted · Trusted by 50k+ mothers</span>
        </div>
      </div>

      {/* Right panel – form */}
      <div className="signin-right-panel">
        <div className="signin-card">
          {/* Mode toggle tabs */}
          {view === 'main' && (
            <div className="signin-tabs flex text-center">
              <button
                onClick={() => setMode('signin')}
                className={`signin-tab ${mode === 'signin' ? 'signin-tab-active' : ''} text-xs md:text-sm`}
              >
                {role === 'expert' ? 'Sign In as Doctor' : 'Sign In'}
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`signin-tab ${mode === 'signup' ? 'signin-tab-active' : ''} text-xs md:text-sm`}
              >
                {role === 'expert' ? 'Sign Up as Doctor' : 'Sign Up'}
              </button>
            </div>
          )}

          {/* Card content */}
          {view === 'main' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {mode === 'signin' 
                    ? (role === 'expert' ? 'Welcome Doctor 👋' : 'Welcome Back 👋') 
                    : (role === 'expert' ? 'Join as Doctor 👨‍⚕️' : 'Join AfterMa 🌸')}
                </h2>
                <p className="text-slate-400 text-sm font-medium">
                  {mode === 'signin'
                    ? (role === 'expert' ? 'Sign in to access your clinical portal' : 'Sign in to continue your care journey')
                    : (role === 'expert' ? 'Start providing expert care to mothers' : 'Start your personalised maternal care journey')}
                </p>
              </div>

              {/* Primary options */}
              <div className="space-y-2.5">
                <ProviderBtn
                  icon={<Mail size={18} className="text-slate-600" />}
                  label={mode === 'signin' ? 'Continue with Email' : 'Sign up with Email'}
                  onClick={() => setView('email')}
                />
                <ProviderBtn
                  icon={<Phone size={18} className="text-slate-600" />}
                  label={mode === 'signin' ? 'Continue with Phone' : 'Sign up with Phone'}
                  onClick={() => setView('phone')}
                />
              </div>

              {/* OR divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              {/* OAuth */}
              <div className="space-y-2.5">
                {googleError && (
                  <div className="px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-xs font-medium rounded-xl">
                    {googleError}
                  </div>
                )}
                
                <div className="relative w-full rounded-xl overflow-hidden group">
                  <ProviderBtn
                    icon={<GoogleIcon />}
                    label="Continue with Google"
                    onClick={() => {
                        if (!window.google?.accounts?.id) {
                          setGoogleError('Google Sign-In is still loading. Please try again in a moment.');
                        }
                    }}
                    loading={googleLoading}
                    className="group-hover:shadow-md group-hover:bg-slate-50"
                  />
                  {/* Invisible official Google Sign In button captures click properly */}
                  <div 
                    id="google-btn-wrapper" 
                    className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer opacity-[0.01]"
                    style={{ transform: 'scale(1.1)' }}
                  ></div>
                </div>

                <ProviderBtn
                  icon={<AppleIcon />}
                  label="Continue with Apple"
                  onClick={() => alert('Apple Sign-In coming soon. Please use Email or Phone.')}
                />
              </div>

              {/* Doctor/Mother toggle CTA */}
              {role === 'mother' ? (
                <button
                  onClick={() => setRole('expert')}
                  className="signin-doctor-btn"
                >
                  <Stethoscope size={15} className="shrink-0" />
                  {mode === 'signin' ? 'Sign in as Doctor' : 'Sign up as Doctor'}
                </button>
              ) : (
                <button
                  onClick={() => setRole('mother')}
                  className="signin-doctor-btn"
                  style={{ background: 'linear-gradient(135deg, #fdf4ff, #ffe4e6)', borderColor: '#fbcfe8', color: '#db2777' }}
                >
                  <Heart size={15} className="shrink-0" />
                  {mode === 'signin' ? 'Sign in as Mother' : 'Sign up as Mother'}
                </button>
              )}

              {/* Switch mode link */}
              <p className="text-center text-sm text-slate-400">
                {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')} className="text-pink-500 font-bold hover:text-pink-700 transition-colors">
                  {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>

              {/* Security note */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <ShieldCheck size={13} className="text-emerald-500" />
                <span className="text-[11px] font-semibold text-slate-400">Secure & encrypted</span>
              </div>
            </div>
          )}

          {view === 'email' && (
            <EmailForm onBack={() => setView('main')} onLogin={onLogin} mode={mode} role={role} />
          )}

          {view === 'phone' && (
            <PhoneForm onBack={() => setView('main')} onLogin={onLogin} mode={mode} role={role} />
          )}

          {/* Terms */}
          <p className="text-center text-[11px] text-slate-300 mt-4 leading-relaxed">
            By continuing, you agree to AfterMa's{' '}
            <span className="text-slate-500 font-semibold cursor-pointer hover:underline">Terms</span>{' '}
            &{' '}
            <span className="text-slate-500 font-semibold cursor-pointer hover:underline">Privacy Policy</span>
          </p>
        </div>
      </div>

      <style>{`
        .signin-fullpage {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: flex;
          overflow: hidden;
          background: linear-gradient(135deg, #1e1740 0%, #2d1f5e 40%, #3b1a6b 100%);
        }

        /* Blobs */
        .signin-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          opacity: 0.35;
          animation: blobFloat 8s ease-in-out infinite alternate;
        }
        .signin-blob-1 { width: 500px; height: 500px; top: -150px; left: -100px; background: #f472b6; animation-delay: 0s; }
        .signin-blob-2 { width: 400px; height: 400px; bottom: -100px; left: 30%; background: #8b5cf6; animation-delay: 2s; }
        .signin-blob-3 { width: 350px; height: 350px; top: 20%; right: -80px; background: #ec4899; animation-delay: 4s; }

        @keyframes blobFloat {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(30px) scale(1.05); }
        }

        /* Close button */
        .signin-close-btn {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          z-index: 10;
          width: 2.5rem;
          height: 2.5rem;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
        }
        .signin-close-btn:hover {
          background: rgba(255,255,255,0.25);
          transform: scale(1.05);
        }

        /* Left panel */
        .signin-left-panel {
          flex: 1;
          display: none;
          flex-direction: column;
          justify-content: center;
          padding: 3.5rem;
          position: relative;
        }
        @media (min-width: 900px) {
          .signin-left-panel { display: flex; }
        }

        .signin-brand {
          margin-bottom: 3rem;
        }
        .signin-logo-ring {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: linear-gradient(135deg, #f472b6, #a855f7);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          box-shadow: 0 8px 32px rgba(244, 114, 182, 0.4);
        }
        .signin-brand-name {
          font-size: 2.5rem;
          font-weight: 900;
          color: white;
          letter-spacing: -0.05em;
          line-height: 1;
        }
        .signin-brand-slogan {
          font-size: 10px;
          font-weight: 800;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.2em;
          margin-top: 0.4rem;
          text-transform: uppercase;
        }

        .signin-features {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 3rem;
        }
        .signin-feature-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 1rem;
          padding: 1rem 1.25rem;
          transition: background 0.2s;
        }
        .signin-feature-card:hover { background: rgba(255,255,255,0.12); }
        .signin-feature-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: white;
        }
        .signin-feature-desc {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.55);
          margin-top: 0.15rem;
        }

        .signin-trust {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.02em;
        }

        /* Right panel */
        .signin-right-panel {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          position: relative;
          z-index: 1;
          overflow-y: auto;
        }
        @media (min-width: 900px) {
          .signin-right-panel {
            width: 480px;
            flex-shrink: 0;
            background: rgba(255,255,255,0.04);
            backdrop-filter: blur(20px);
            border-left: 1px solid rgba(255,255,255,0.08);
            padding: 2.5rem;
          }
        }

        /* Card */
        .signin-card {
          width: 100%;
          max-width: 400px;
          background: white;
          border-radius: 1.75rem;
          padding: 2rem;
          box-shadow: 0 30px 100px rgba(0,0,0,0.3);
        }
        @media (min-width: 900px) {
          .signin-card {
            border-radius: 2rem;
            padding: 2.5rem;
          }
        }

        /* Tabs */
        .signin-tabs {
          display: flex;
          background: #f1f5f9;
          border-radius: 1rem;
          padding: 4px;
          margin-bottom: 1.75rem;
        }
        .signin-tab {
          flex: 1;
          padding: 0.6rem 0;
          font-size: 0.875rem;
          font-weight: 700;
          color: #94a3b8;
          border-radius: 0.75rem;
          transition: all 0.25s;
          cursor: pointer;
        }
        .signin-tab-active {
          background: white;
          color: #0f172a;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        /* Doctor CTA button */
        .signin-doctor-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: linear-gradient(135deg, #eef2ff, #fdf4ff);
          border: 1px solid #c7d2fe;
          border-radius: 0.875rem;
          color: #6366f1;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: all 0.2s;
        }
        .signin-doctor-btn:hover {
          background: linear-gradient(135deg, #e0e7ff, #f3e8ff);
          border-color: #a5b4fc;
          color: #4f46e5;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }
        .signin-doctor-btn:active { transform: scale(0.98); }

        /* Fade-in animation */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease forwards; }
      `}</style>
    </div>
  );
};

export default SignIn;

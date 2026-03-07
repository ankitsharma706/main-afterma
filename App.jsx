
import { Bell, Menu, Search, ShieldCheck } from 'lucide-react';
import { lazy, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CareConnect from './components/CareConnect';
import CaregiverView from './components/CaregiverView';
import CareJourney from './components/CareJourney';
import Cart from './components/Cart';
import Education from './components/Education';
import ExpertAnalytics from './components/ExpertAnalytics';
import ExpertDashboard from './components/ExpertDashboard';
import ExpertSettings from './components/ExpertSettings';
import HealthLogModal from './components/HealthLogModal';
import HealthLogs from './components/HealthLogs';
import HealthReportModal from './components/HealthReportModal';
import Journal from './components/Journal';
import LactationLog from './components/LactationLog';
import LocationPage from './components/LocationPage';
import Membership from './components/Membership';
import MentalWellness from './components/MentalWellness';
import Navigation from './components/Navigation';
import NotificationPanel from './components/NotificationPanel';
import Payment from './components/Payment';
import RecordsHistoryModal from './components/RecordsHistoryModal';
import SafeRecipes from './components/SafeRecipes';
import Settings from './components/Settings';
import SignIn from './components/SignIn';
import SOSOverlay from './components/SOSOverlay';
import MomKart from './components/Store';
import SurveyCommunityData from './components/SurveyCommunityData';
import { COLORS, RECOVERY_DATABASE } from './constants';
import { authAPI, setUserId } from './services/api';
import { translations } from './translations';
const Dashboard = lazy(() => import('./components/Dashboard'));

const App = () => {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('afterma_profile_v4');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse profile from localStorage", e);
    }
    return {
      name: "Guest",
      age: 28,
      deliveryDate: new Date().toISOString(),
      deliveryType: 'normal',
      maternityStage: 'Postpartum',
      authenticated: false,
      role: 'mother',
      accent: 'PINK',
      incognito: false,
      medicalHistory: "",
      emergencyContact: "",
      membershipPlan: 'free',
      currentPhase: 'Month 1',
      completedActivities: [],
      streakCount: 0,
      streakProtectionActive: false,
      lastLoginDate: new Date().toISOString().split('T')[0],
      badges: [],
      caregiver: {
        name: "", relationship: "", contact: "",
        permissions: { canViewMood: true, canViewPhysical: true, canViewMedicalHistory: false, canViewAppointments: true }
      },
      journeySettings: {
        pace: 'gentle',
        preferredTime: 'morning',
        goals: ['improve strength', 'stabilize mood'],
        isPaused: false,
        language: 'english'
      },
      notifications: {
        exerciseReminders: true,
        hydrationAlerts: true,
        moodCheckins: true,
        careConnectUpdates: true,
        sosConfirmations: true
      },
      periodLogs: [],
      journalEntries: []
    };
  });

  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname.substring(1);
  const currentView = path || (profile.authenticated && profile.role === 'expert' && profile.verification?.status === 'verified' ? 'expert-dashboard' : (profile.authenticated ? 'dashboard' : 'education'));

  const setView = (viewPath) => {
    navigate(`/${viewPath}`);
  };

  const [showSOS, setShowSOS] = useState(false);
  const [sosConfirming, setSosConfirming] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const lastClickRef = useRef(0);
  const sosTimerRef = useRef(null);

  const [appointments, setAppointments] = useState([]);
  const [showLactationLog, setShowLactationLog] = useState(false);
  const [showLocationPage, setShowLocationPage] = useState(false);
  const [showExpertReport, setShowExpertReport] = useState(false);
  const [circles, setCircles] = useState([
    { id: '1', name: 'New Moms Bonding', members: 124, description: 'Sharing the joys and struggles of the first few months.', isJoined: false },
    { id: '2', name: 'Sleep Solutions', members: 89, description: 'Tips and support for the sleepless nights.', isJoined: false },
    { id: '3', name: 'Emotional Overwhelm', members: 56, description: 'A safe space to talk about the harder days.', isJoined: false },
  ]);

  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];

  const [logs, setLogs] = useState([]);
  const [exerciseLogs, setExerciseLogs] = useState([]);
  const [triageMessages, setTriageMessages] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderSummary, setOrderSummary] = useState(null);
  useEffect(() => {
    const save = setTimeout(() => {
      localStorage.setItem('afterma_profile_v4', JSON.stringify(profile));
      document.documentElement.lang = lang === 'hindi' ? 'hi' : 'en';
    }, 300);

    return () => clearTimeout(save);
  }, [profile, lang]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentView]);

  // ── Auto-restore authenticated session from stored JWT ─────────────────
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('afterma_token');
      if (!token) return; // already logged in or no token
      try {
        const userData = await authAPI.getMe();
        if (userData?._id || userData?.email) {
          const role = userData.role === 'doctor' ? 'expert' : 'mother';
          setProfile(prev => ({
            ...prev,
            authenticated: true,
            role,
            name: userData.full_name || userData.name || prev.name,
            email: userData.email || prev.email,
            phone: userData.phone || prev.phone,
            profilePicture: userData.profile_picture || userData.profilePicture || prev.profilePicture,
            _id: userData._id,
            dob: userData.dob || prev.dob,
            bloodGroup: userData.blood_group || prev.bloodGroup,
            aadharNumber: userData.aadhar_number || prev.aadharNumber,
            address: userData.address || prev.address,
            city: userData.city || prev.city,
            state: userData.state || prev.state,
            pincode: userData.pincode || prev.pincode,
            height: userData.height_cm || prev.height,
            weight: userData.weight_kg || prev.weight,
            maternityStage: userData.phase || prev.maternityStage,
            deliveryType: userData.delivery_type || prev.deliveryType,
            symptoms: userData.symptoms || prev.symptoms,
            caregiver: {
              name: userData.family?.contact_name || prev.caregiver.name,
              contact: userData.family?.contact_phone || prev.caregiver.contact,
              relationship: userData.family?.relation || prev.caregiver.relationship,
              permissions: userData.caregiver_permissions || prev.caregiver.permissions,
            },
            notifications: userData.notifications || prev.notifications,
          }));
          if (userData._id) setUserId(userData._id);
        }
      } catch (err) {
        console.warn('Session restore failed (token may be expired):', err?.message);
        // Token expired — clear it so user is prompted to log in
        localStorage.removeItem('afterma_token');
        localStorage.removeItem('afterma_refresh_token');
      }
    };
    restoreSession();
  }, []); // run once on mount only

  // Cleanup SOS timer on unmount
  useEffect(() => {
    return () => {
      if (sosTimerRef.current) clearTimeout(sosTimerRef.current);
    };
  }, []);

  const theme = COLORS[profile.accent] || COLORS.PINK;
  const isExpert = profile.authenticated && profile.role === 'expert' && profile.verification?.status === 'verified';

  const addNotification = (title, text) => {
    setNotifications(prev => [{ id: Date.now().toString(), title, text, time: 'Just now' }, ...prev]);
  };

  const handleLogin = (role = 'mother', userData = null) => {
    // Map backend field names → profile field names
    const userName = userData?.full_name || userData?.name || (role === 'expert' ? 'Dr. Expert' : 'New Mother');
    // If the user chose "Sign in as Doctor", always honour that selection.
    // (Backend returns role:'user' by default for doctor logins too)
    const backendRole = userData?.role;
    const userRole = role === 'expert'
      ? 'expert'
      : (backendRole === 'doctor' ? 'expert' : (backendRole || role));

    setProfile(prev => ({
      ...prev,
      authenticated: true,
      role: userRole,
      name: userName,
      email: userData?.email || prev.email,
      phone: userData?.phone || prev.phone,
      profilePicture: userData?.profile_picture || userData?.profilePicture || prev.profilePicture,
      _id: userData?._id || prev._id,
      dob: userData?.dob || prev.dob,
      bloodGroup: userData?.blood_group || prev.bloodGroup,
      aadharNumber: userData?.aadhar_number || prev.aadharNumber,
      address: userData?.address || prev.address,
      city: userData?.city || prev.city,
      state: userData?.state || prev.state,
      pincode: userData?.pincode || prev.pincode,
      height: userData?.height_cm || prev.height,
      weight: userData?.weight_kg || prev.weight,
      maternityStage: userData?.phase || prev.maternityStage,
      deliveryType: userData?.delivery_type || prev.deliveryType,
      symptoms: userData?.symptoms || prev.symptoms,
      caregiver: {
        name: userData?.family?.contact_name || prev.caregiver.name,
        contact: userData?.family?.contact_phone || prev.caregiver.contact,
        relationship: userData?.family?.relation || prev.caregiver.relationship,
        permissions: userData?.caregiver_permissions || prev.caregiver.permissions,
      },
      notifications: userData?.notifications || prev.notifications,
      membershipPlan: userData?.subscription_plan || userData?.membershipPlan || prev.membershipPlan,
      verification: userRole === 'expert'
        ? { status: 'verified', roleRequested: 'expert' }
        : (userData?.verification || prev.verification),
      lastLoginDate: new Date().toISOString().split('T')[0],
    }));

    if (userData?._id) setUserId(userData._id);

    if (userRole === 'expert') {
      setView('expert-dashboard');
    } else {
      setView('dashboard');
    }

    addNotification(
      `${t.common.welcome} ${userName.split(' ')[0]} 🌸`,
      'Welcome back to your care journey.'
    );
  };

  const logout = () => {
    authAPI.logout(); // clears token + refresh token + user id from localStorage
    localStorage.removeItem('afterma_profile_v4'); // clear cached profile
    setProfile({
      name: 'Guest', age: 28,
      deliveryDate: new Date().toISOString(), deliveryType: 'normal',
      maternityStage: 'Postpartum', authenticated: false, role: 'mother',
      accent: 'PINK', incognito: false, medicalHistory: '', emergencyContact: '',
      membershipPlan: 'free', currentPhase: 'Month 1', completedActivities: [],
      streakCount: 0, streakProtectionActive: false,
      lastLoginDate: new Date().toISOString().split('T')[0], badges: [],
      caregiver: {
        name: '', relationship: '', contact: '',
        permissions: { canViewMood: true, canViewPhysical: true, canViewMedicalHistory: false, canViewAppointments: true }
      },
      journeySettings: { pace: 'gentle', preferredTime: 'morning', goals: ['improve strength', 'stabilize mood'], isPaused: false, language: 'english' },
      notifications: { exerciseReminders: true, hydrationAlerts: true, moodCheckins: true, careConnectUpdates: true, sosConfirmations: true },
      periodLogs: [], journalEntries: [],
    });
    setView('education');
  };

  const toggleActivity = (activityId) => {
    if (profile.journeySettings.isPaused) return;
    setProfile(prev => {
      const isCompleted = prev.completedActivities.includes(activityId);
      const newCompleted = isCompleted
        ? prev.completedActivities.filter(id => id !== activityId)
        : [...prev.completedActivities, activityId];

      if (!isCompleted) {
        addNotification("Activity Logged", "Your progress has been recorded securely.");
      }
      return { ...prev, completedActivities: newCompleted };
    });
  };

  const triggerSOS = () => {
    setShowSOS(true);
    setSosConfirming(false);
    if (sosTimerRef.current) clearTimeout(sosTimerRef.current);
  };

  // Improved SOS - double-tap with visual confirm state (from v3)
  const handleSOSClick = () => {
    if (!sosConfirming) {
      setSosConfirming(true);
      sosTimerRef.current = setTimeout(() => {
        setSosConfirming(false);
      }, 2000);
    } else {
      triggerSOS();
    }
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    addNotification('Added to Cart', `${item.name} added to your cart.`);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const updateQuantity = (id, delta) => {
    setCart(prev =>
      prev
        .map(i =>
          i.id === id ? { ...i, quantity: i.quantity + delta } : i
        )
        .filter(i => i.quantity > 0)
    );
  };

  const handleSaveLog = (newLog) => {
    setLogs(prev => [...prev, newLog]);
    setShowLogModal(false);
    addNotification("Health Logged", "Your daily metrics have been securely recorded.");

    // Streak logic
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastLoginDate !== today) {
      setProfile(prev => ({
        ...prev,
        streakCount: prev.streakCount + 1,
        lastLoginDate: today
      }));
    }
  };

  const filteredActivities = useMemo(() => {
    return RECOVERY_DATABASE
      .filter(a => {
        if (profile.maternityStage === 'Postpartum') {
          return a.phase.startsWith('Month');
        } else if (profile.maternityStage === 'Pregnant-T1') {
          return a.phase === 'Trimester 1';
        } else if (profile.maternityStage === 'Pregnant-T2') {
          return a.phase === 'Trimester 2';
        } else if (profile.maternityStage === 'Pregnant-T3') {
          return a.phase === 'Trimester 3';
        } else if (profile.maternityStage === 'TTC') {
          return a.phase === 'Pre-conception';
        }
        return true;
      })
      .filter(a => !a.typeSpecific || a.typeSpecific === profile.deliveryType || profile.maternityStage !== 'Postpartum')
      .filter(a => {
        if (profile.journeySettings.pace === 'gentle') {
          return a.intensityScale <= 5 || a.category === 'Emotional Stabilization';
        }
        return true;
      });
  }, [profile.deliveryType, profile.journeySettings.pace, profile.maternityStage]);
  const triageMessagesMemo = useMemo(() => triageMessages, [triageMessages]);
  return (
    <div className={`min-h-screen flex transition-colors duration-500 font-sans`} style={{ backgroundColor: theme.bg }}>
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[55] lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      <div className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-[60] lg:z-50 h-screen`}>
        <Navigation
          currentView={currentView}
          setView={setView}
          profile={profile}
          logout={logout}
          onClose={() => setIsMobileMenuOpen(false)}
          onOpenLocation={() => setShowLocationPage(true)}
          onOpenLactation={() => setShowLactationLog(true)}
        />
      </div>

      <main className="flex-1 lg:ml-64 min-h-screen relative flex flex-col">
        <header className="h-16 lg:h-20 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 flex items-center justify-between border-b border-slate-100 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-3 lg:gap-6 flex-1 max-w-2xl">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 lg:hidden text-gray-500 hover:bg-gray-100 rounded-lg"><Menu size={20} /></button>
            {isExpert ? (
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <ShieldCheck size={18} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-900">Clinical Portal</span>
              </div>
            ) : (
              <div className="relative w-full hidden sm:block">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                  <Search className={`${profile.incognito ? 'text-purple-500' : 'text-gray-400'}`} size={16} />
                </div>
                <input type="text" placeholder={profile.incognito ? "GHOST Mode Active..." : t.common.searchPlaceholder} className={`w-full border rounded-full py-2 pl-10 pr-20 focus:outline-none focus:ring-2 transition-all text-sm ${profile.incognito ? 'bg-purple-50/50 border-purple-200 focus:ring-purple-100' : 'bg-white border-slate-200 focus:ring-pink-100 shadow-sm'}`} />
                <button onClick={() => setProfile(p => ({ ...p, incognito: !p.incognito }))} className={`absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase px-2 py-1 rounded-full transition-all ${profile.incognito ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>GHOST</button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 lg:gap-5 ml-4">
            {/* Improved SOS with confirm state (from v3) */}
            <div className="relative group">
              <button
                onClick={handleSOSClick}
                className={`px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all active:scale-95 shadow-lg ${sosConfirming ? 'bg-amber-500 text-black animate-pulse' : 'bg-[#eab308] text-black shadow-amber-200'}`}
              >
                {sosConfirming ? 'Tap again to confirm SOS' : 'Double tap for SOS'}
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 text-white text-[8px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                Your safety matters. Double tap to activate.
              </div>
            </div>
            {profile.authenticated ? (
              <div className="flex items-center gap-2 lg:gap-4">
                <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-gray-500 hover:bg-gray-50 rounded-full relative transition-colors">
                  <Bell size={20} />
                  {notifications.length > 0 && <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white`} style={{ backgroundColor: theme.primary }}></span>}
                </button>
                <button onClick={() => setView('settings')} style={{ backgroundColor: theme.primary }} className="h-8 w-8 lg:h-9 lg:w-9 rounded-full text-white flex items-center justify-center font-bold text-xs lg:text-sm shadow-md border border-white hover:scale-105 transition-transform overflow-hidden">
                  {profile.profilePicture ? <img src={profile.profilePicture} alt="Profile" className="h-full w-full object-cover" /> : profile.name[0]}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setView('signin')}
                style={{ backgroundColor: theme.primary }}
                className="px-5 py-2 text-white rounded-full font-bold text-xs shadow-md hover:opacity-90 transition-all active:scale-95"
              >
                Sign In
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-x-hidden">
          <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
            {/* Expert Views */}
            {isExpert && currentView === 'expert-dashboard' && <ExpertDashboard profile={profile} onViewReport={() => setShowExpertReport(true)} />}
            {isExpert && currentView === 'expert-analytics' && <ExpertAnalytics profile={profile} />}
            {isExpert && currentView === 'expert-settings' && <ExpertSettings profile={profile} logout={logout} />}

            {/* Mother Views - Restricted for Experts */}
            {!isExpert && (
              <>
                {currentView === 'dashboard' && profile.authenticated && <Dashboard profile={profile} logs={logs} onAddLog={() => setShowLogModal(true)} onOpenHistory={() => setShowHistoryModal(true)} setView={setView} />}
                {currentView === 'carejourney' && profile.authenticated && <CareJourney profile={profile} setProfile={setProfile} onToggleActivity={toggleActivity} activities={filteredActivities} exerciseLogs={exerciseLogs} setExerciseLogs={setExerciseLogs} logs={logs} onAddLog={() => setShowLogModal(true)} />}
                {currentView === 'healthlogs' && profile.authenticated && <HealthLogs profile={profile} />}
                {currentView === 'lactationlogs' && profile.authenticated && <LactationLog profile={profile} onClose={() => setView('dashboard')} />}
                {currentView === 'healthsummary' && profile.authenticated && <HealthReportModal profile={profile} onClose={() => setView('dashboard')} />}
                {currentView === 'mentalwellness' && profile.authenticated && <MentalWellness profile={profile} messages={triageMessagesMemo} setMessages={setTriageMessages} onOpenJournal={() => setShowJournal(true)} />}
                {currentView === 'education' && <Education profile={profile} />}
                {currentView === 'recipes' && <SafeRecipes profile={profile} />}
                {currentView === 'community-wisdom' && <SurveyCommunityData profile={profile} />}
                {currentView === 'momkart' && profile.authenticated && (
                  <MomKart
                    profile={profile}
                    cart={cart}
                    onAddToCart={addToCart}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeFromCart}
                    onGoToCart={() => setView('momkart-cart')}
                  />
                )}
                {currentView === 'momkart-cart' && profile.authenticated && (
                  <Cart
                    profile={profile}
                    cart={cart}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeFromCart}
                    onGoBack={() => setView('momkart')}
                    onGoToPayment={(summary) => { setOrderSummary(summary); setView('momkart-payment'); }}
                  />
                )}
                {currentView === 'momkart-payment' && profile.authenticated && orderSummary && (
                  <Payment
                    profile={profile}
                    cart={cart}
                    orderSummary={orderSummary}
                    onGoBack={() => setView('momkart-cart')}
                    onSuccess={() => { setCart([]); setOrderSummary(null); setView('momkart'); addNotification('Order Placed!', 'Your maternal care essentials are on their way.'); }}
                  />
                )}
                {currentView === 'aftermaplus' && <Membership profile={profile} setProfile={setProfile} />}
                {currentView === 'settings' && profile.authenticated && <Settings profile={profile} setProfile={setProfile} />}
                {currentView === 'careconnect' && profile.authenticated && <CareConnect profile={profile} setProfile={setProfile} appointments={appointments} setAppointments={setAppointments} setCircles={setCircles} circles={circles} addNotification={addNotification} />}
                {currentView === 'caregiver' && profile.authenticated && <CaregiverView profile={profile} logs={logs} />}
              </>
            )}
          </div>
        </div>

        {showNotifications && <NotificationPanel notifications={notifications} onClose={() => setShowNotifications(false)} onClear={() => setNotifications([])} />}
      </main>
      {showSOS && <SOSOverlay profile={profile} onClose={() => setShowSOS(false)} />}
      {showLogModal && <HealthLogModal profile={profile} onClose={() => setShowLogModal(false)} onSave={handleSaveLog} />}
      {showHistoryModal && <RecordsHistoryModal profile={profile} logs={logs} onClose={() => setShowHistoryModal(false)} />}
      {showJournal && <Journal profile={profile} setProfile={setProfile} onClose={() => setShowJournal(false)} />}
      {showLactationLog && <LactationLog profile={profile} onClose={() => setShowLactationLog(false)} />}
      {showLocationPage && <LocationPage profile={profile} onClose={() => setShowLocationPage(false)} />}
      {showExpertReport && <HealthReportModal profile={profile} onClose={() => setShowExpertReport(false)} />}
      {currentView === 'signin' && (
        <SignIn profile={profile} onLogin={handleLogin} onClose={() => setView('education')} onOpenLocation={() => setShowLocationPage(true)} />
      )}
    </div>
  );
};

export default App;

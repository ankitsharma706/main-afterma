
import { Bell, Menu, Search, ShieldCheck } from 'lucide-react';
import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CareConnect from './components/CareConnect';
import CaregiverView from './components/CaregiverView';
import CareJourney from './components/CareJourney';
import Cart from './components/Cart';
import { getProfileInitials, loadProfile } from './utils/profile';
import Education from './components/Education';
import ExpertAnalytics from './components/ExpertAnalytics';
import ExpertDashboard from './components/ExpertDashboard';
import ExpertSettings from './components/ExpertSettings';
import HealthLogs from './components/HealthLogs';
import HealthReportModal from './components/HealthReportModal';
import Journal from './components/Journal';
import LactationLog from './components/LactationLog';
import ArticlePage from './components/LearningCenter/ArticlePage';
import LocationPage from './components/LocationPage';
import LogMomentModal from './components/LogMomentModal';
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
import CommandPalette from './components/CommandPalette';
import CommunityQA from './components/CommunityQA';
import SurveyCommunityData from './components/SurveyCommunityData';
import { COLORS, RECOVERY_DATABASE, SLOGAN } from './constants';
import JourneySessionPage from './pages/JourneySessionPage';
import MoodCheckPage from './pages/MoodCheckPage';
import { authAPI, setUserId } from './services/api';
import { translations } from './translations';
import Footer from './components/Footer';
import SEOHead from './components/seo/SEOHead';
import SEOGuardrail from './components/seo/SEOGuardrail';
import { buildWebSiteSchema, buildOrganizationSchema, buildWebApplicationSchema } from './services/seo/schemaBuilder';
import { readStoredArray, readStoredValue, removeStoredValue, shouldCreateNotification, writeStoredValue } from './utils/persistence';
import { getGhostSafeLogs, getGhostSafeProfile } from './utils/ghostMode';

// Resilient lazy imports for compliance and monetization views (protected against client-side ad-blockers)
const Dashboard = lazy(() => import('./components/Dashboard').catch(() => ({ default: () => null })));
const PolicyView = lazy(() => import('./components/compliance/PolicyView').catch(() => ({ default: () => null })));
const TermsView = lazy(() => import('./components/compliance/TermsView').catch(() => ({ default: () => null })));
const DisclaimerView = lazy(() => import('./components/compliance/DisclaimerView').catch(() => ({ default: () => null })));
const AboutView = lazy(() => import('./components/compliance/AboutView').catch(() => ({ default: () => null })));
const SupportView = lazy(() => import('./components/compliance/SupportView').catch(() => ({ default: () => null })));
const NotFoundView = lazy(() => import('./components/compliance/NotFoundView').catch(() => ({ default: () => null })));
const PromotionManager = lazy(() => import('./components/promotions/PromotionManager').catch(() => ({ default: () => null })));

const App = () => {
  const [profile, setProfile] = useState(() => loadProfile());

  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname.substring(1);
  // Handle /learning-center/:articleId pattern
  const isArticlePage = location.pathname.startsWith('/learning-center/');
  // Handle /care-journey/session/:activityId — full-page, no nav chrome
  const isSessionPage = location.pathname.startsWith('/care-journey/session');
  // Handle /mood-check — full-page mood quiz
  const isMoodCheckPage = location.pathname === '/mood-check';
  const currentView = isSessionPage
    ? 'journey-session'
    : isMoodCheckPage
      ? 'mood-check'
      : isArticlePage
        ? 'learning-center'
        : (path || (profile.authenticated && profile.role === 'expert' && profile.verification?.status === 'verified' ? 'expert-dashboard' : (profile.authenticated ? 'dashboard' : 'education')));

  const setView = (viewPath) => {
    navigate(`/${viewPath}`);
  };

  const [showSOS, setShowSOS] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // const lastClickRef = useRef(0);

  const [appointments, setAppointments] = useState(() => readStoredArray('afterma_appointments_v1'));
  const [showLactationLog, setShowLactationLog] = useState(false);
  const [showLocationPage, setShowLocationPage] = useState(false);
  const [showExpertReport, setShowExpertReport] = useState(false);
  const [circles, setCircles] = useState([
    { id: '1', name: 'New Moms Bonding', members: 124, description: 'Sharing the joys and struggles of the first few months.', isJoined: false },
    { id: '2', name: 'Sleep Solutions', members: 89, description: 'Tips and support for the sleepless nights.', isJoined: false },
    { id: '3', name: 'Emotional Overwhelm', members: 56, description: 'A safe space to talk about the harder days.', isJoined: false },
  ]);

  const lang = profile?.journeySettings?.language || 'english';
  const t = translations[lang];

  const [logs, setLogs] = useState(() => readStoredArray('afterma_daily_logs_v1'));
  const [exerciseLogs, setExerciseLogs] = useState([]);
  const [triageMessages, setTriageMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('afterma_triage_v4');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load triage messages", e);
      return [];
    }
  });
  const [cart, setCart] = useState(() => readStoredArray('afterma_cart_v1'));
  const [expressDelivery, setExpressDelivery] = useState(() => Boolean(readStoredValue('afterma_express_delivery_v1', false)));
  const [orderSummary, setOrderSummary] = useState(() => readStoredValue('afterma_order_summary_v1', null));
  useEffect(() => {
    const save = setTimeout(() => {
      try {
        localStorage.setItem('afterma_profile_v4', JSON.stringify(profile));
      } catch (error) {
        console.warn('Unable to persist profile state:', error);
      }
      document.documentElement.lang = lang === 'hindi' ? 'hi' : 'en';
    }, 300);

    return () => clearTimeout(save);
  }, [profile, lang]);

  useEffect(() => {
    if (!profile.incognito) writeStoredValue('afterma_triage_v4', triageMessages);
  }, [triageMessages, profile.incognito]);

  useEffect(() => {
    writeStoredValue('afterma_cart_v1', cart);
  }, [cart]);

  useEffect(() => {
    writeStoredValue('afterma_appointments_v1', appointments);
  }, [appointments]);

  useEffect(() => {
    if (!profile.incognito) writeStoredValue('afterma_daily_logs_v1', logs);
  }, [logs, profile.incognito]);

  useEffect(() => {
    writeStoredValue('afterma_express_delivery_v1', expressDelivery);
  }, [expressDelivery]);

  useEffect(() => {
    if (orderSummary) writeStoredValue('afterma_order_summary_v1', orderSummary);
    else removeStoredValue('afterma_order_summary_v1');
  }, [orderSummary]);

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

  const theme = COLORS[profile.accent] || COLORS.PINK;
  const isExpert = profile.authenticated && profile.role === 'expert' && profile.verification?.status === 'verified';
  const visibleProfile = getGhostSafeProfile(profile);
  const visibleLogs = getGhostSafeLogs(logs, profile);
  const visibleExerciseLogs = getGhostSafeLogs(exerciseLogs, profile);
  const visibleTriageMessages = getGhostSafeLogs(triageMessages, profile);

  const addNotification = (title, text, preference) => {
    if (profile.incognito || !shouldCreateNotification(profile, preference)) return;
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
    ['afterma_cart_v1', 'afterma_appointments_v1', 'afterma_daily_logs_v1', 'afterma_express_delivery_v1', 'afterma_order_summary_v1']
      .forEach(key => removeStoredValue(key));
    setCart([]);
    setAppointments([]);
    setLogs([]);
    setExpressDelivery(false);
    setOrderSummary(null);
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
      journeySettings: { pace: 'gentle', preferredTime: 'morning', goals: ['improve strength', 'stabilize mood'], dailyCommitmentMinutes: 15, isPaused: false, language: 'english' },
      notifications: { exerciseReminders: true, hydrationAlerts: true, moodCheckins: true, careConnectUpdates: true, sosConfirmations: true },
      periodLogs: [], wellnessCheckIns: [], journalEntries: [],
    });
    setView('education');
  };

  const toggleActivity = (activityId) => {
    if (profile.journeySettings.isPaused || profile.incognito) return false;
    setProfile(prev => {
      const currentActivities = Array.isArray(prev.completedActivities) ? prev.completedActivities : [];
      const isCompleted = currentActivities.includes(activityId);
      const newCompleted = isCompleted
        ? currentActivities.filter(id => id !== activityId)
        : [...currentActivities, activityId];

      if (!isCompleted) {
        addNotification("Activity Logged", "Your progress has been recorded.", 'exerciseReminders');
      }
      return { ...prev, completedActivities: newCompleted };
    });
    return true;
  };

  const triggerSOS = () => {
    setShowSOS(true);
  };

  const handleSOSClick = () => triggerSOS();
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
    if (profile.incognito) return false;
    const updatedLogs = [...logs, newLog];
    if (!writeStoredValue('afterma_daily_logs_v1', updatedLogs)) return false;
    setLogs(updatedLogs);
    addNotification("Health Logged", "Your daily check-in was saved.", 'moodCheckins');

    // Streak logic
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastLoginDate !== today) {
      setProfile(prev => ({
        ...prev,
        streakCount: prev.streakCount + 1,
        lastLoginDate: today
      }));
    }
    return true;
  };

  const handleSaveWellnessCheckIn = (checkIn) => {
    if (profile.incognito) return false;
    const updatedProfile = {
      ...profile,
      wellnessCheckIns: [...(profile.wellnessCheckIns || []), checkIn],
    };
    if (!writeStoredValue('afterma_profile_v4', updatedProfile)) return false;
    setProfile(updatedProfile);
    return true;
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
  const globalSchemas = useMemo(() => [
    buildWebSiteSchema(),
    buildOrganizationSchema(),
    buildWebApplicationSchema(),
  ], []);

  // ── Mood Check Page: standalone, no sidebar/header chrome ──
  if (isMoodCheckPage) {
    return (
      <>
        <SEOGuardrail />
        <MoodCheckPage profile={profile} />
      </>
    );
  }

  // ── Journey Session: render standalone, no sidebar/header chrome ──
  if (isSessionPage) {
    return (
      <>
        <SEOGuardrail />
        <JourneySessionPage
          profile={profile}
          activities={filteredActivities}
          onToggleActivity={toggleActivity}
          setExerciseLogs={setExerciseLogs}
        />
      </>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 font-sans`} style={{ backgroundColor: theme.bg }}>
      {/* Declarative SEO Head & Schema.org JSON-LD */}
      <SEOHead schemas={globalSchemas} />
      {/* Route-level Verification Guardrail: strictly forces noindex & blocks AdSense on utility/restricted views */}
      <SEOGuardrail />
      {/* Route-aware promotion controller: strictly disables ads on non-content/utility screens */}
      <Suspense fallback={null}>
        <PromotionManager />
      </Suspense>
      <main className={`flex-1 transition-all duration-300 ease-in-out min-h-screen relative flex flex-col`}>
        <div className="sticky top-0 z-50">
          <header className="h-16 lg:h-20 bg-white/95 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between shadow-sm transition-all duration-300 border-b border-slate-100">
            {/* Left: Brand */}
            <div className="flex items-center flex-1">
              <div className="group cursor-pointer">
                <h1 className="text-xl lg:text-2xl font-black text-slate-900 group-hover:scale-105 transition-transform whitespace-nowrap">
                  AfterMa
                </h1>
                <p className="text-[8px] lg:text-[10px] mt-0.5 tracking-widest font-black text-slate-400 uppercase opacity-80 whitespace-nowrap">
                  {SLOGAN}
                </p>
              </div>
            </div>
            
            {/* Center: Search / Clinical Portal */}
            <div className="hidden sm:flex flex-1 items-center justify-center max-w-xl px-4">
              {isExpert ? (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <ShieldCheck size={18} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-900">Clinical Portal</span>
                </div>
              ) : (
                <div className="relative w-full">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                    <Search className={`${profile.incognito ? 'text-purple-500' : 'text-gray-400'}`} size={16} />
                  </div>
                  <button 
                    onClick={() => setIsCommandPaletteOpen(true)}
                    className={`w-full flex items-center justify-between border rounded-full py-2 pl-10 pr-4 transition-all text-sm ${profile.incognito ? 'bg-purple-50/50 border-purple-200 focus:ring-purple-100 text-purple-700' : 'bg-white border-slate-200 focus:ring-pink-100 shadow-sm text-slate-500 hover:border-slate-300'}`}
                  >
                    <span className="truncate">{profile.incognito ? "GHOST Mode Active..." : "Search commands, resources..."}</span>
                    <div className="flex items-center gap-1 opacity-70">
                      <kbd className="hidden lg:inline-flex items-center justify-center rounded border border-slate-200 bg-slate-100 px-1.5 font-sans text-[10px] font-medium text-slate-500 shadow-sm">
                        Ctrl
                      </kbd>
                      <kbd className="hidden lg:inline-flex items-center justify-center rounded border border-slate-200 bg-slate-100 px-1.5 font-sans text-[10px] font-medium text-slate-500 shadow-sm">
                        K
                      </kbd>
                    </div>
                  </button>
                  <button onClick={() => setProfile(p => ({ ...p, incognito: !p.incognito }))} className={`absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase px-2 py-1 rounded-full transition-all ${profile.incognito ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>GHOST</button>
                </div>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center justify-end gap-3 lg:gap-5 flex-1 ml-auto">
            {/* Improved SOS with confirm state (from v3) */}
            <div className="relative group">
              <button
                onClick={handleSOSClick}
                className="px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all active:scale-95 shadow-lg bg-[#eab308] text-black shadow-amber-200"
              >
                SOS Help
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-900 text-white text-[8px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
                Open emergency support options
              </div>
            </div>
            {profile.authenticated ? (
              <div className="flex items-center gap-2 lg:gap-4">
                <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-gray-500 hover:bg-gray-50 rounded-full relative transition-colors">
                  <Bell size={20} />
                  {notifications.length > 0 && <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white`} style={{ backgroundColor: theme.primary }}></span>}
                </button>
                <button onClick={() => setView('settings')} style={{ backgroundColor: theme.primary }} className="h-8 w-8 lg:h-9 lg:w-9 rounded-full text-white flex items-center justify-center font-bold text-xs lg:text-sm shadow-md border border-white hover:scale-105 transition-transform overflow-hidden">
                  {profile.profilePicture ? <img src={profile.profilePicture} alt="Profile" className="h-full w-full object-cover" /> : getProfileInitials(profile.name)}
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

        <div className="flex-1">
          <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-8">
            {/* Expert Views */}
            {isExpert && currentView === 'expert-dashboard' && <ExpertDashboard profile={profile} onViewReport={() => setShowExpertReport(true)} />}
            {isExpert && currentView === 'expert-analytics' && <ExpertAnalytics profile={profile} />}
            {isExpert && currentView === 'expert-settings' && <ExpertSettings profile={profile} logout={logout} />}

            {/* Mother Views - Restricted for Experts */}
            {!isExpert && (
              <>
                {currentView === 'dashboard' && profile.authenticated && (
                  <Suspense fallback={<div className="py-12 text-center text-slate-400 font-medium">Loading Dashboard...</div>}>
                    <Dashboard profile={visibleProfile} logs={visibleLogs} onAddLog={() => setShowLogModal(true)} onOpenHistory={profile.incognito ? null : () => setShowHistoryModal(true)} setView={setView} />
                  </Suspense>
                )}
                {currentView === 'carejourney' && profile.authenticated && <CareJourney profile={visibleProfile} setProfile={setProfile} onToggleActivity={toggleActivity} activities={filteredActivities} exerciseLogs={visibleExerciseLogs} setExerciseLogs={setExerciseLogs} logs={visibleLogs} onAddLog={() => setShowLogModal(true)} />}
                {currentView === 'healthlogs' && profile.authenticated && <HealthLogs profile={profile} />}
                {currentView === 'lactationlogs' && profile.authenticated && <LactationLog profile={profile} onClose={() => setView('dashboard')} />}
                {currentView === 'healthsummary' && profile.authenticated && <HealthReportModal profile={profile} onClose={() => setView('dashboard')} />}
                {currentView === 'mentalwellness' && profile.authenticated && <MentalWellness profile={visibleProfile} onSaveCheckIn={handleSaveWellnessCheckIn} messages={visibleTriageMessages} setMessages={profile.incognito ? () => {} : setTriageMessages} onOpenJournal={() => setShowJournal(true)} />}
                {currentView === 'education' && <Education profile={profile} />}
                {currentView === 'recipes' && <SafeRecipes profile={profile} />}
                {currentView === 'learning-center' && <ArticlePage profile={profile} />}
                {currentView === 'community-wisdom' && <SurveyCommunityData profile={profile} />}
                {currentView === 'community' && profile.authenticated && <CommunityQA profile={profile} />}
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
                    expressDelivery={expressDelivery}
                    onExpressDeliveryChange={setExpressDelivery}
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
                    expressDelivery={expressDelivery}
                    onGoBack={() => setView('momkart-cart')}
                    onSuccess={() => { setCart([]); setOrderSummary(null); setExpressDelivery(false); setView('momkart'); addNotification('Order Placed!', 'Your maternal care essentials are on their way.'); }}
                  />
                )}
                {currentView === 'aftermaplus' && <Membership profile={profile} setProfile={setProfile} />}
                {currentView === 'settings' && profile.authenticated && <Settings profile={profile} setProfile={setProfile} />}
                {currentView === 'careconnect' && profile.authenticated && <CareConnect profile={profile} setProfile={setProfile} appointments={appointments} setAppointments={setAppointments} setCircles={setCircles} circles={circles} addNotification={addNotification} />}
                {currentView === 'caregiver' && profile.authenticated && (
                  <CaregiverView profile={visibleProfile} logs={visibleLogs} appointments={getGhostSafeLogs(appointments, profile)} />
                )}

                {/* Legal & Trust Compliance Views (Publicly Accessible) */}
                <Suspense fallback={<div className="py-12 text-center text-slate-400 font-medium">Loading document...</div>}>
                  {['privacy', 'privacy-policy'].includes(currentView) && <PolicyView />}
                  {['terms', 'terms-of-service'].includes(currentView) && <TermsView />}
                  {['disclaimer', 'medical-disclaimer'].includes(currentView) && <DisclaimerView />}
                  {['about', 'about-us'].includes(currentView) && <AboutView />}
                  {['contact', 'support', 'help'].includes(currentView) && <SupportView />}

                  {/* 404 Fallback: Prevents empty white screens on broken routes */}
                  {![
                    'dashboard', 'carejourney', 'healthlogs', 'lactationlogs', 'healthsummary',
                    'mentalwellness', 'education', 'recipes', 'learning-center', 'community-wisdom',
                    'community', 'momkart', 'momkart-cart', 'momkart-payment', 'aftermaplus',
                    'settings', 'careconnect', 'caregiver', 'expert-dashboard', 'expert-analytics',
                    'expert-settings', 'signin', 'privacy', 'privacy-policy', 'terms', 'terms-of-service',
                    'disclaimer', 'medical-disclaimer', 'about', 'about-us', 'contact', 'support', 'help'
                  ].includes(currentView) && <NotFoundView />}
                </Suspense>
              </>
            )}
          </div>
        </div>

        {/* Global Footer rendered across all platform & content pages */}
        <Footer />

        {showNotifications && <NotificationPanel notifications={notifications} onClose={() => setShowNotifications(false)} onClear={() => setNotifications([])} />}
      </main>
      {showSOS && <SOSOverlay profile={profile} onClose={() => setShowSOS(false)} />}
      {showLogModal && <LogMomentModal profile={profile} onClose={() => setShowLogModal(false)} onSave={handleSaveLog} />}
      {showHistoryModal && !profile.incognito && <RecordsHistoryModal profile={profile} logs={logs} onClose={() => setShowHistoryModal(false)} />}
      {showJournal && <Journal profile={visibleProfile} setProfile={setProfile} onClose={() => setShowJournal(false)} />}
      {showLactationLog && <LactationLog profile={profile} onClose={() => setShowLactationLog(false)} />}
      {showLocationPage && <LocationPage profile={profile} onClose={() => setShowLocationPage(false)} />}
      {showExpertReport && <HealthReportModal profile={profile} onClose={() => setShowExpertReport(false)} />}
      {currentView === 'signin' && (
        <SignIn profile={profile} onLogin={handleLogin} onClose={() => setView('education')} onOpenLocation={() => setShowLocationPage(true)} />
      )}
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
    </div>
  );
};

export default App;

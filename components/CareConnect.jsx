import {
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock,
  ExternalLink,
  Heart,
  Info,
  Loader2,
  MessageCircle,
  MessageSquare,
  Monitor,
  Navigation as NavIcon,
  Phone,
  Plus,
  Share2,
  ShieldCheck,
  Star,
  Stethoscope,
  TrendingUp,
  Users,
  X
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, COMMUNITY_QUESTIONS, EXPERT_DATA, HELPLINES, INSURANCE_PLANS, NGO_DATA } from '../constants';
import { communitiesAPI, doctorsAPI, insuranceAPI, ngoAPI } from '../services/api';
import { translations } from '../translations';
import ExpertDashboard from './ExpertDashboard';
import VerificationFlow from './VerificationFlow';



const CareConnect = ({ profile, setProfile, appointments, setAppointments, circles, setCircles, addNotification }) => {
  const lang = profile?.journeySettings?.language || 'english';
  const t = translations[lang];
  const [activeSubTab, setActiveSubTab] = useState('Community');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [isCreatingCircle, setIsCreatingCircle] = useState(false);
  const [newCircle, setNewCircle] = useState({ name: '', description: '', category: 'General Support' });
  const [expertFilter, setExpertFilter] = useState('All');
  const navigate = useNavigate();
  const [showVerification, setShowVerification] = useState(false);
  const [verificationRole, setVerificationRole] = useState('expert');
  const theme = COLORS[profile?.accent] || COLORS.PINK;

  const isVerifiedExpert = profile.role === 'expert' && profile.verification?.status === 'verified';
  const isVerifiedCreator = profile.role === 'community_creator' && profile.verification?.status === 'verified';
  const isPending = profile.verification?.status === 'pending';

  // ── Live data state ──────────────────────────────────────────────────────
  const [liveExperts, setLiveExperts] = useState([]);
  const [expertsLoading, setExpertsLoading] = useState(false);
  const [commLoading, setCommLoading] = useState(false);
  const [liveNgos, setLiveNgos] = useState([]);
  const [ngosLoading, setNgosLoading] = useState(false);
  const [liveInsurance, setLiveInsurance] = useState([]);
  const [insuranceLoading, setInsuranceLoading] = useState(false);

  // Fetch doctors from backend on mount
  useEffect(() => {
    const loadDoctors = async () => {
      setExpertsLoading(true);
      try {
        const res = await doctorsAPI.getAll();
        const docs = res?.data?.doctors || res?.doctors || (Array.isArray(res?.data) ? res.data : []);
        if (Array.isArray(docs) && docs.length > 0) {
          const mapped = docs.map(d => ({
            _id: d._id || d.doctor_id,
            category: d.specialization || d.category || 'Physiotherapy',
            name: d.name || d.full_name,
            role: d.designation || d.specialization || '',
            credentials: d.credentials || d.doctor_proof || '',
            insight: d.quote || '',
            price: d.session_fee ? `₹${d.session_fee}` : '₹1,000',
            rating: d.rating,
            location: d.location,
          }));
          setLiveExperts(mapped);
        }
      } catch (err) {
        console.warn('Doctors fetch failed — using static data:', err?.message);
      } finally {
        setExpertsLoading(false);
      }
    };
    loadDoctors();
  }, []);

  // Fetch communities from backend on mount
  useEffect(() => {
    const loadCommunities = async () => {
      setCommLoading(true);
      try {
        const res = await communitiesAPI.getAll();
        const comms = res?.data?.communities || res?.communities || (Array.isArray(res?.data) ? res.data : []);
        if (Array.isArray(comms) && comms.length > 0) {
          const mapped = comms.map(c => ({
            id: c._id || c.id,
            name: c.title || c.name,
            members: c.member_count || c.members || 0,
            description: c.short_description || '',
            isJoined: c.is_joined || false,
          }));
          setCircles(mapped);
        }
      } catch (err) {
        console.warn('Communities fetch failed — using static data:', err?.message);
      } finally {
        setCommLoading(false);
      }
    };
    loadCommunities();
  }, []);

  // Fetch NGOs from backend on mount
  useEffect(() => {
    const loadNgos = async () => {
      setNgosLoading(true);
      try {
        const res = await ngoAPI.getAll();
        const ngos = res?.data?.ngos || res?.ngos || (Array.isArray(res?.data) ? res.data : []);
        if (Array.isArray(ngos) && ngos.length > 0) {
          setLiveNgos(ngos.map(n => ({
            name: n.name || n.title,
            area: n.area || n.location || 'Pan India',
            contact: n.contact || n.helpline || 'Verified',
            description: n.description || '',
            link: n.link || '#'
          })));
        }
      } catch (err) {
        console.warn('NGO fetch failed:', err?.message);
      } finally {
        setNgosLoading(false);
      }
    };
    loadNgos();
  }, []);

  // Fetch Insurance from backend on mount
  useEffect(() => {
    const loadInsurance = async () => {
      setInsuranceLoading(true);
      try {
        const res = await insuranceAPI.getAll();
        const plans = res?.data?.plans || res?.plans || (Array.isArray(res?.data) ? res.data : []);
        if (Array.isArray(plans) && plans.length > 0) {
          setLiveInsurance(plans.map(p => ({
            bank: p.bank || p.provider || p.name || 'Insurance Partner',
            logo: (p.bank || p.provider || p.name || 'A')[0],
            plan: p.plan_name || 'Standard Plan',
            eligibility: p.eligibility || 'All New Mothers',
            approval: p.approval_rate || '95%',
            processing: p.processing_time || '48 hrs',
            count: p.client_count || '10k+',
            range: p.coverage_range || '₹5L - ₹50L',
            highlights: p.features || ['Maternity Coverage', 'Cashless Claims', 'Newborn Care'],
            theme: p.theme_color || 'BLUE'
          })));
        }
      } catch (err) {
        console.warn('Insurance fetch failed:', err?.message);
      } finally {
        setInsuranceLoading(false);
      }
    };
    loadInsurance();
  }, []);

  const displayExperts = liveExperts?.length ? liveExperts : EXPERT_DATA;

  const handleVerificationComplete = (data) => {
    setProfile(prev => ({ ...prev, role: data.roleRequested, verification: data }));
    setShowVerification(false);
    addNotification("Application Submitted", "Our clinical board is reviewing your credentials. We'll notify you soon.");
  };

  const startVerification = (role) => {
    setVerificationRole(role);
    setShowVerification(true);
  };

  useEffect(() => {
    if (activeSubTab === 'MyBookings' && profile?._id) {
      const loadMySessions = async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sessions/my/${profile._id}`);
          const data = await res.json();
          if (data.status === 'success' && data.data) {
            const mappedAppts = data.data.map(session => ({
              id: session._id,
              specialistName: session.doctor_id?.name || 'Doctor',
              type: session.doctor_id?.specialization || session.session_type,
              date: new Date(session.session_date).toISOString().split('T')[0],
              time: session.session_time,
              status: session.status || 'Upcoming',
              price: `₹${session.session_fee || 1000}`,
            }));
            setAppointments(mappedAppts);
          }
        } catch (e) {
          console.error("Failed to fetch sessions:", e);
        }
      };
      loadMySessions();
    }
  }, [activeSubTab, profile?._id]);

  const simulateApproval = () => {
    setProfile(prev => ({ ...prev, verification: { ...prev.verification, status: 'verified' } }));
    addNotification("Account Verified", `Your status as a ${profile.role === 'expert' ? 'Healthcare Expert' : 'Community Creator'} is now active.`);
  };

  if (isVerifiedExpert) return <ExpertDashboard profile={profile} />;

  // ── Community join/leave (optimistic + real API) ─────────────────────────
  const handleRSVP = useCallback(async (id) => {
    const circle = circles?.find(c => c.id === id);
    if (!circle) return;
    const wasJoined = circle.isJoined;
    setCircles(prev => prev.map(c =>
      c.id === id ? { ...c, isJoined: !wasJoined, members: wasJoined ? c.members - 1 : c.members + 1 } : c
    ));
    try {
      if (wasJoined) {
        await communitiesAPI.leave(id);
      } else {
        await communitiesAPI.join(id);
        addNotification("Circle Joined", `Welcome to the ${circle.name} sisterhood.`);
      }
    } catch (err) {
      console.warn('Community join/leave error — rolling back:', err?.message);
      setCircles(prev => prev.map(c =>
        c.id === id ? { ...c, isJoined: wasJoined, members: wasJoined ? c.members + 1 : c.members - 1 } : c
      ));
    }
  },[circles]);

  // ── Book session (local + real API) ─────────────────────────────────────
  const handleBook = useCallback(async (expert) => {
    const sessionDate = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
    const newAppt = {
      id: Date.now().toString(),
      specialistName: expert.name,
      type: expert.role,
      date: sessionDate,
      time: '11:30 AM',
      status: 'Upcoming',
      price: expert.price,
    };
    setAppointments(prev => [...prev, newAppt]);
    addNotification("Session Scheduled", `Confirmed appointment with ${expert.name}.`);
    setActiveSubTab('MyBookings');
    try {
      if (expert._id) {
        await fetch('/api/sessions/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: profile._id,
            doctor_id: expert._id,
            session_date: sessionDate,
            session_time: '11:30 AM',
            session_type: 'video',
            session_fee: parseInt(String(expert.price).replace(/[^\d]/g, '')) || 1000
          })
        });
      }
    } catch (err) {
      console.warn('Session booking API error (saved locally):', err?.message);
    }
  },[profile]);

  const cancelAppointment = (id) => {
    if (window.confirm("Are you sure you want to cancel this healing session?")) {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(displayExperts.map(e => e.category));
    return ['All', ...Array.from(cats)];
  }, [displayExperts]);

  const filteredExperts = useMemo(() => {
    if (expertFilter === 'All') return displayExperts;
    return displayExperts.filter(e => e.category === expertFilter);
  }, [displayExperts, expertFilter]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 lg:space-y-16 animate-in pb-32">
      <div className="flex flex-col md:flex-row justify-between items-center gap-10 bg-white p-12 lg:p-16 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="relative z-10 space-y-6 max-w-2xl text-center md:text-left">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border border-emerald-100/50">Verified Clinical Support</div>
          <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">{t.care.title}</h2>
          <p className="text-base lg:text-xl text-slate-400 font-medium italic opacity-85 leading-relaxed">"{t.care.subtitle}"</p>
        </div>
        <a href={`tel:${HELPLINES.india.number}`} className="flex items-center gap-4 px-10 py-5 text-black rounded-full font-bold text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95 shrink-0" style={{ background: 'linear-gradient(135deg, #e2cd0eff, #e4e155ff)' }}>
          <Phone size={20} /> {t.care.helpline}
        </a>
        <div className="absolute bottom-[-10%] right-[-5%] opacity-[0.02] pointer-events-none scale-[1.5]"><Heart size={350} /></div>
      </div>

      <div className="flex flex-col items-center gap-6">
        {isPending && (
          <div className="w-full max-w-2xl p-6 bg-amber-50 border border-amber-100 rounded-[2rem] flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm text-amber-500"><Clock size={20} /></div>
              <div><p className="text-sm font-bold text-slate-900">Verification Pending</p><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Our board is reviewing your credentials</p></div>
            </div>
            <button onClick={simulateApproval} className="px-6 py-2.5 bg-amber-500 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg hover:brightness-105 active:scale-95 transition-all">Simulate Approval</button>
          </div>
        )}

        <div className="inline-flex gap-1.5 bg-white/95 backdrop-blur-md rounded-full p-1.5 shadow-sm border border-slate-100 sticky top-[64px] lg:top-[80px] z-30">
          <NavButton label={t.care.tabs.community} active={activeSubTab === 'Community'} onClick={() => setActiveSubTab('Community')} theme={theme} icon={<Users size={16} />} />
          <NavButton label={t.care.tabs.experts} active={activeSubTab === 'Experts'} onClick={() => setActiveSubTab('Experts')} theme={theme} icon={<Stethoscope size={16} />} />
          <NavButton label={t.care.tabs.ngo} active={activeSubTab === 'NGOs'} onClick={() => setActiveSubTab('NGOs')} theme={theme} icon={<Heart size={16} />} />
          <NavButton label={t.care.tabs.insurance} active={activeSubTab === 'Insurance'} onClick={() => setActiveSubTab('Insurance')} theme={theme} icon={<ShieldCheck size={16} />} />
          <NavButton label={t.care.tabs.sessions} active={activeSubTab === 'MyBookings'} onClick={() => setActiveSubTab('MyBookings')} theme={theme} icon={<Calendar size={16} />} />
        </div>
      </div>

      <div className="space-y-12">
        {activeSubTab === 'Community' && !selectedQuestion && !selectedCircle && !isCreatingCircle && (
          <div className="space-y-16">
            {/* Community Q&A Section */}
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-1">
                  <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Community Q&A</h3>
                  <p className="text-sm text-slate-400 font-medium italic">Sister-to-sister support and shared wisdom.</p>
                </div>
                <button onClick={() => navigate('/community')} className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                  <Plus size={18} /><span>Ask a Question</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {COMMUNITY_QUESTIONS.slice(0, 3).map(q => (
                  <div 
                    key={q.id} 
                    onClick={() => navigate('/community')}
                    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer flex flex-col justify-between hover:translate-y-[-6px]"
                  >
                    <div className="space-y-6">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                        <div className="flex gap-2">
                          {q.tags.map(tag => (
                            <span key={tag} className="text-slate-400">{tag}</span>
                          ))}
                        </div>
                        <span className="text-slate-300">{q.timeAgo}</span>
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-pink-500 transition-colors">{q.title}</h4>
                      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{q.excerpt}</p>
                    </div>
                    
                    <div className="pt-8 mt-8 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-white shadow-sm overflow-hidden">
                          {q.authorInitial}
                        </div>
                        <span className="text-xs font-bold text-slate-900">{q.author}</span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-300">
                        <div className="flex items-center gap-1.5"><MessageSquare size={14} /> <span className="text-[11px] font-bold">{q.commentsCount}</span></div>
                        <div className="flex items-center gap-1.5"><Heart size={14} /> <span className="text-[11px] font-bold">{q.likesCount}</span></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-10">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Sisterhood Circles</h3>
                  <p className="text-sm text-slate-400 font-medium italic">Safe spaces for peer support and shared experiences.</p>
                </div>
                {!isVerifiedCreator && !isPending && (
                  <button onClick={() => setIsCreatingCircle(true)} className="px-8 py-4 bg-white border border-slate-100 text-slate-900 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all flex items-center gap-2">
                    <Users size={18} className="text-emerald-500" /><span>Start a Community</span>
                  </button>
                )}
              </div>
              {commLoading ? (
                <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-slate-300" /></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                  {circles.map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => setSelectedCircle(c)}
                      className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col justify-between hover:translate-y-[-6px] cursor-pointer"
                    >
                      <div className="space-y-6">
                        <div className="flex justify-between items-start">
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner" style={{ color: theme.primary }}><Users size={24} /></div>
                          <span className="text-[8px] font-bold uppercase text-emerald-500 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-100/40">Sisterhood active</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">{c.name}</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed italic opacity-80 line-clamp-3">"{c.description}"</p>
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-2 rounded-xl w-fit">
                          <Star size={14} className="text-amber-400 fill-amber-400" /> {c.members} {t.care.community.sistersJoined}
                        </div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRSVP(c.id); }} 
                        className={`w-full py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all mt-8 ${c.isJoined ? 'bg-slate-100 text-slate-400' : 'text-white shadow-lg hover:shadow-xl'}`} 
                        style={{ backgroundColor: c.isJoined ? '' : theme.primary }}
                      >
                        {c.isJoined ? 'In Circle' : t.care.community.joinSisters}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- CREATE SISTER CIRCLE VIEW --- */}
        {isCreatingCircle && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
            {/* Back Button */}
            <button 
              onClick={() => setIsCreatingCircle(false)}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-[0.2em] mb-10 group bg-white px-6 py-3 rounded-2xl border border-slate-50 shadow-sm"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Circles
            </button>

            <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden">
               <div className="p-12 lg:p-16 space-y-12">
                  <div className="space-y-4">
                     <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100/50 w-fit shadow-sm"><Users size={32} /></div>
                     <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">Start Your Own Sisterhood</h2>
                     <p className="text-lg text-slate-500 font-medium italic opacity-85 leading-relaxed">Foster a niche community focused on shared healing, local support, or specific maternal recovery goals.</p>
                  </div>

                  <form 
                    className="space-y-8"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setCommLoading(true);
                      try {
                        const res = await communitiesAPI.create({
                          title: newCircle.name,
                          short_description: newCircle.description,
                          category: newCircle.category
                        });
                        alert('Your Sister Circle proposal has been submitted for verification!');
                        setIsCreatingCircle(false);
                        // Reload communities
                        const update = await communitiesAPI.getAll();
                        const comms = update?.data?.communities || update?.communities || (Array.isArray(update?.data) ? update.data : []);
                        if (Array.isArray(comms)) {
                          setCircles(comms.map(c => ({
                            id: c._id || c.id,
                            name: c.title || c.name,
                            members: c.member_count || c.members || 0,
                            description: c.short_description || '',
                            isJoined: c.is_joined || false
                          })));
                        }
                      } catch (err) {
                        alert(err?.message || 'Failed to create community');
                      } finally {
                        setCommLoading(false);
                      }
                    }}
                  >
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Circle Name */}
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Circle Name</label>
                           <input 
                             required
                             placeholder="e.g. South Delhi C-Section Mums"
                             value={newCircle.name}
                             onChange={e => setNewCircle({...newCircle, name: e.target.value})}
                             className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all placeholder:text-slate-200" 
                           />
                        </div>
                        {/* Circle Category */}
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Expert Focus</label>
                           <select 
                             value={newCircle.category}
                             onChange={e => setNewCircle({...newCircle, category: e.target.value})}
                             className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all appearance-none cursor-pointer"
                           >
                              <option value="General Support">General Peer Support</option>
                              <option value="Loss & Healing">Loss & Healing</option>
                              <option value="Postpartum Fitness">Postpartum Fitness</option>
                              <option value="Local Meetups">Local Meetups</option>
                              <option value="Lactation Wisdom">Lactation Wisdom</option>
                           </select>
                        </div>
                     </div>

                     {/* Circle Description */}
                     <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Mission Statement (About)</label>
                         <textarea 
                           required
                           rows={4}
                           placeholder="What is the core purpose of this sisterhood? How will you help each other heal?"
                           value={newCircle.description}
                           onChange={e => setNewCircle({...newCircle, description: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-6 font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all placeholder:text-slate-200 italic"
                         />
                     </div>

                     <div className="pt-6">
                        <button 
                          type="submit"
                          disabled={commLoading}
                          className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.25em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                           {commLoading ? <Loader2 className="animate-spin" size={20} /> : <>Launch Sister Circle <Plus size={20} /></>}
                        </button>
                        <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-8">
                           * All new sister circles undergo clinical moderation before appearing in the public hub.
                        </p>
                     </div>
                  </form>
               </div>
            </div>
          </div>
        )}

        {/* --- SISTER CIRCLE DETAIL VIEW --- */}
        {selectedCircle && !selectedQuestion && (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
            {/* Back Button */}
            <button 
              onClick={() => setSelectedCircle(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-[0.2em] mb-10 group bg-white px-6 py-3 rounded-2xl border border-slate-50 shadow-sm"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> {t.common.close}
            </button>

            <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col">
              {/* Header Hero Area */}
              <div className="relative p-12 lg:p-16 overflow-hidden">
                <div 
                  className="absolute inset-0 opacity-10 pointer-events-none" 
                  style={{ background: `radial-gradient(circle at top right, ${theme.primary}, transparent)` }} 
                />
                
                <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start md:items-center">
                   <div 
                     className="w-24 h-24 lg:w-32 lg:h-32 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center shadow-xl group hover:rotate-6 transition-transform flex-shrink-0"
                     style={{ color: theme.primary }}
                   >
                     <Users size={48} className="lg:size-[64px]" />
                   </div>
                   
                   <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                         <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100/50">Verified Sisterhood</span>
                         <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 bg-white text-slate-400 rounded-full border border-slate-100">{selectedCircle.members} Active Members</span>
                      </div>
                      <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">{selectedCircle.name}</h2>
                      <p className="text-lg text-slate-500 font-medium italic opacity-85 leading-relaxed">"{selectedCircle.description}"</p>
                   </div>
                </div>
              </div>

              {/* Detail Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 border-t border-slate-50">
                {/* Left: Main Details */}
                <div className="lg:col-span-2 p-12 lg:p-16 space-y-12 border-r border-slate-50">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                      <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: theme.primary }} />
                      About the Community
                    </h3>
                    <p className="text-slate-600 text-lg leading-relaxed font-medium opacity-90">
                      Welcome to the {selectedCircle.name} sister circle. This community is designed to provide a safe, nurturing, and clinically-informed space for mothers navigating similar paths. Here, you'll find shared wisdom, peer support, and a collective strength that only mothers can offer one another.
                    </p>
                    <p className="text-slate-600 text-lg leading-relaxed font-medium opacity-90 italic">
                      "Because no mother should have to walk this journey alone. We believe in the power of shared experiences to heal, empower, and inspire."
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                    <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-[2rem] space-y-3">
                      <div className="p-3 bg-white w-fit rounded-xl text-emerald-500 shadow-sm"><ShieldCheck size={20} /></div>
                      <h4 className="font-black text-slate-900 uppercase text-[11px] tracking-widest">Safe Space</h4>
                      <p className="text-xs text-slate-400 font-bold leading-relaxed">Strictly moderated to ensure a kind, respectful environment for all.</p>
                    </div>
                    <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-[2rem] space-y-3">
                      <div className="p-3 bg-white w-fit rounded-xl text-amber-500 shadow-sm"><Star size={20} /></div>
                      <h4 className="font-black text-slate-900 uppercase text-[11px] tracking-widest">Expert Access</h4>
                      <p className="text-xs text-slate-400 font-bold leading-relaxed">Occasional guest sessions from verified AfterMa clinical experts.</p>
                    </div>
                  </div>
                </div>

                {/* Right: Actions & Stats */}
                <div className="p-12 lg:p-16 bg-[#fcfdfe]/50 space-y-10">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Circle Status</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:translate-x-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Activity Level</span>
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-md">Very High</span>
                      </div>
                      <div className="flex justify-between items-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:translate-x-1">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sisterhood Reach</span>
                        <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-md">8 Cities</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      onClick={() => handleRSVP(selectedCircle.id)}
                      className={`w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 ${selectedCircle.isJoined ? 'bg-slate-100 text-slate-400' : 'text-white'}`}
                      style={{ backgroundColor: selectedCircle.isJoined ? '' : theme.primary }}
                    >
                      {selectedCircle.isJoined ? (
                        <>In Sisterhood <Check size={18} /></>
                      ) : (
                        <>{t.care.community.joinSisters} <Plus size={18} /></>
                      )}
                    </button>
                    <p className="text-center text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-6">
                      {selectedCircle.isJoined ? "You are receiving updates from this circle" : "Join to participate in daily sisterhood wisdom"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detailed Question View */}
        {selectedQuestion && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <button 
              onClick={() => setSelectedQuestion(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-sm mb-8 group"
            >
              <X size={18} className="p-1 bg-slate-100 rounded-full group-hover:rotate-90 transition-transform" /> Back to Community
            </button>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
              {/* Question Header */}
              <div className="p-10 lg:p-14 space-y-8 border-b border-slate-100">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-400">{selectedQuestion.authorInitial}</div>
                      <div>
                        <p className="font-bold text-slate-900">{selectedQuestion.author}</p>
                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{selectedQuestion.timeAgo} · {selectedQuestion.category}</p>
                      </div>
                   </div>
                   <button className="text-slate-300 hover:text-slate-600"><Star size={20} /></button>
                </div>

                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight leading-tight">{selectedQuestion.title}</h2>
                
                {selectedQuestion.isPoll && (
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <span>Poll Results</span>
                      <span>{selectedQuestion.pollResult}%</span>
                    </div>
                    <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-slate-100 shadow-inner">
                      <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${selectedQuestion.pollResult}%` }} />
                    </div>
                  </div>
                )}

                <p className="text-lg text-slate-600 leading-relaxed italic line-clamp-none">{selectedQuestion.excerpt}</p>
                
                {selectedQuestion.image && (
                  <div className="aspect-video w-full rounded-[2rem] overflow-hidden border border-slate-100 shadow-md">
                    <img src={selectedQuestion.image} alt="Post Attachment" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="pt-8 flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <button className="flex items-center gap-2 font-bold text-slate-400 hover:text-pink-500 transition-colors">
                      <Heart size={20} /> <span>{selectedQuestion.likesCount > 1000 ? (selectedQuestion.likesCount/1000).toFixed(1) + 'k' : selectedQuestion.likesCount}</span>
                    </button>
                    <button className="flex items-center gap-2 font-bold text-slate-400 hover:text-blue-500 transition-colors">
                      <MessageCircle size={20} /> <span>{selectedQuestion.commentsCount > 1000 ? (selectedQuestion.commentsCount/1000).toFixed(1) + 'k' : selectedQuestion.commentsCount}</span>
                    </button>
                    <button className="flex items-center gap-2 font-bold text-slate-400 hover:text-emerald-500 transition-colors">
                      <Share2 size={20} />
                    </button>
                  </div>
                  <button className="text-slate-400 hover:text-slate-900">
                    <Heart size={20} className="fill-current text-slate-100" />
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="bg-slate-50/50 p-10 lg:p-14 space-y-8">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 flex items-center gap-3">
                    <MessageSquare size={18} className="text-slate-300" />
                    Community Comments
                  </h4>
                  <div className="flex gap-2">
                    {['Top', 'Newest'].map(filter => (
                      <button key={filter} className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${filter === 'Top' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100'}`}>{filter}</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {selectedQuestion.comments.length > 0 ? (
                    selectedQuestion.comments.map(c => (
                      <div key={c.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-100">{c.avatar}</div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{c.author}</p>
                              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{c.time}</p>
                            </div>
                          </div>
                          <button className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-pink-500 transition-colors">
                            <Heart size={14} /> {c.likes}
                          </button>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">{c.text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-slate-400 italic text-sm bg-white rounded-2xl border border-slate-50 shadow-inner">
                      No wisdom shared yet. Be the first to reply!
                    </div>
                  )}
                </div>

                {/* Reply Input */}
                <div className="mt-10 relative">
                  <input 
                    type="text" 
                    placeholder="Write a reply..." 
                    className="w-full pl-6 pr-16 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-pink-50 shadow-sm"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-slate-900 text-white rounded-xl hover:scale-105 active:scale-95 transition-all">
                    <NavIcon size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'Experts' && !selectedExpert && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-wrap gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 w-fit">
                {categories.map((cat) => (
                  <button 
                    key={cat} 
                    onClick={() => setExpertFilter(cat)} 
                    className={`px-6 md:px-8 py-2.5 rounded-xl font-bold text-[10px] md:text-[11px] uppercase tracking-widest transition-all ${expertFilter === cat ? 'bg-white shadow-md text-slate-900 border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {/* {!isPending && (
                <button onClick={() => startVerification('expert')} className="px-8 py-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all flex items-center gap-2">
                  <Stethoscope size={18} /><span>Join as Expert</span>
                </button>
              )} */}
            </div>
            {expertsLoading ? (
              <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-slate-300" /></div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {filteredExperts.map(expert => (
                  <div 
                    key={expert.name} 
                    onClick={() => setSelectedExpert(expert)}
                    className="bg-white p-10 rounded-[2.5rem] border border-slate-100 flex flex-col justify-between hover:shadow-xl transition-all duration-500 group shadow-sm hover:translate-y-[-6px] cursor-pointer"
                  >
                    <div className="space-y-10">
                      <div className="flex items-center gap-8">
                        <div className="w-20 h-20 rounded-[1.75rem] bg-slate-50 flex items-center justify-center font-bold text-3xl shadow-inner border border-slate-100" style={{ color: theme.primary, backgroundColor: theme.bg }}>{expert.name[0]}</div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">{expert.name}</h3>
                          <p className="text-[11px] font-bold uppercase tracking-widest mt-1" style={{ color: theme.primary }}>{expert.role}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-3 tracking-widest bg-slate-50 px-3 py-1 rounded-md w-fit border border-slate-100">{expert.credentials}</p>
                        </div>
                      </div>
                      <div className="p-6 bg-slate-50/40 rounded-2xl border border-slate-100 flex gap-5 shadow-inner">
                        <div className="p-2.5 bg-white rounded-xl shadow-sm text-slate-300 shrink-0"><Info size={20} /></div>
                        <p className="text-sm font-bold text-slate-600 leading-relaxed italic opacity-85">"{expert.insight}"</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-10 mt-10 border-t border-slate-50">
                      <div className="space-y-0.5">
                        <span className="text-2xl font-bold text-slate-900 tracking-tight">{expert.price}</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-widest opacity-60">Session Fee</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleBook(expert); }} 
                        className="px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 text-white" 
                        style={{ backgroundColor: theme.primary }}
                      >
                        {t.care.experts.book}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- EXPERT DETAIL VIEW --- */}
        {selectedExpert && (
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
            {/* Back Button */}
            <button 
              onClick={() => setSelectedExpert(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-[0.2em] mb-10 group bg-white px-6 py-3 rounded-2xl border border-slate-50 shadow-sm"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Specialists
            </button>

            <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col">
              {/* Header Hero Area */}
              <div className="relative p-12 lg:p-16 overflow-hidden">
                <div 
                  className="absolute inset-0 opacity-10 pointer-events-none" 
                  style={{ background: `radial-gradient(circle at bottom left, ${theme.primary}, transparent)` }} 
                />
                
                <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start md:items-center">
                   <div 
                     className="w-24 h-24 lg:w-32 lg:h-32 rounded-[2.5rem] bg-white border-4 border-white flex items-center justify-center shadow-2xl transition-transform flex-shrink-0 overflow-hidden"
                     style={{ color: theme.primary }}
                   >
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedExpert.name}`} alt={selectedExpert.name} className="w-full h-full object-cover" />
                   </div>
                   
                   <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                         <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100/50">Verified Specialist</span>
                         <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 bg-white text-slate-400 rounded-full border border-slate-100">AI Verified Credentials</span>
                      </div>
                      <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">{selectedExpert.name}</h2>
                      <div className="flex items-center gap-4">
                        <p className="text-xl text-slate-500 font-black uppercase tracking-widest opacity-80">{selectedExpert.category}</p>
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                        <div className="flex items-center gap-1 text-amber-500 font-black tracking-tighter text-xl">
                          <Star size={20} fill="currentColor" /> {selectedExpert.rating || '4.9'}
                        </div>
                      </div>
                   </div>
                </div>
              </div>

              {/* Detail Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 border-t border-slate-50">
                {/* Left: Professional Profile */}
                <div className="lg:col-span-2 p-10 lg:p-14 space-y-12 border-r border-slate-50">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                      <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: theme.primary }} />
                      Professional Philosophy
                    </h3>
                    <p className="text-slate-600 text-lg leading-relaxed font-medium opacity-90">
                      {selectedExpert.insight || "Dedicated to providing compassionate, evidence-based care for mothers navigating the complex journey of postpartum recovery. My approach combines clinical excellence with holistic understanding."}
                    </p>
                    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Clinical Focus Areas</h4>
                       <div className="flex flex-wrap gap-2">
                          {[selectedExpert.category, 'Postpartum Recovery', 'Maternal Wellness', 'Preventative Care'].map(tag => (
                            <span key={tag} className="px-4 py-2 bg-white rounded-xl text-xs font-bold text-slate-600 border border-slate-100 shadow-sm">{tag}</span>
                          ))}
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                    <div className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm space-y-3">
                      <div className="p-3 bg-blue-50 w-fit rounded-xl text-blue-500 shadow-sm"><ShieldCheck size={20} /></div>
                      <h4 className="font-black text-slate-900 uppercase text-[11px] tracking-widest">Medical License</h4>
                      <p className="text-xs text-slate-400 font-bold leading-relaxed">{selectedExpert.credentials || "Verified Healthcare Professional"}</p>
                    </div>
                    <div className="p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm space-y-3">
                      <div className="p-3 bg-emerald-50 w-fit rounded-xl text-emerald-500 shadow-sm"><TrendingUp size={20} /></div>
                      <h4 className="font-black text-slate-900 uppercase text-[11px] tracking-widest">Success Rate</h4>
                      <p className="text-xs text-slate-400 font-bold leading-relaxed">Over 500+ maternal cases successfully guided to full recovery.</p>
                    </div>
                  </div>
                </div>

                {/* Right: Booking & Pricing */}
                <div className="p-10 lg:p-14 bg-[#fcfdfe]/50 space-y-10 flex flex-col justify-between">
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Session Logistics</h4>
                      <div className="p-6 md:p-8 bg-white rounded-3xl border border-slate-100 shadow-xl space-y-8">
                         <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Consultation Fee</span>
                            <span className="text-4xl font-black text-slate-900 tracking-tighter leading-none">{selectedExpert.price}</span>
                         </div>
                         <div className="space-y-4">
                            <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                               <Clock size={16} className="text-blue-500" /> 45 Minute Deep-Dive Session
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                               <Monitor size={16} className="text-indigo-500" /> HD Video Consultation
                            </div>
                         </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Practice Stats</h4>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-5 bg-white rounded-2xl border border-slate-100 text-center space-y-1 shadow-sm">
                             <span className="block text-2xl font-black text-slate-900">12k+</span>
                             <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Moms Assisted</span>
                          </div>
                          <div className="p-5 bg-white rounded-2xl border border-slate-100 text-center space-y-1 shadow-sm">
                             <span className="block text-2xl font-black text-slate-900">4.9/5</span>
                             <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">User Rating</span>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="pt-10">
                    <button 
                      onClick={() => handleBook(selectedExpert)}
                      className="w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.25em] transition-all shadow-2xl hover:scale-[1.02] active:scale-95 text-white"
                      style={{ backgroundColor: theme.primary }}
                    >
                      Instant Booking <ArrowRight size={18} className="inline ml-2" />
                    </button>
                    <p className="text-center text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-6">
                      * Pre-approved by AfterMa Healthcare Board
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'NGOs' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-500">
            {(liveNgos.length ? liveNgos : NGO_DATA).map(ngo => (
              <div key={ngo.name} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between group hover:translate-y-[-6px] h-full">
                <div className="space-y-8">
                  <div className="p-5 bg-pink-50/50 text-pink-500 rounded-[1.75rem] w-fit border border-pink-100 shadow-inner"><Heart size={28} strokeWidth={2.5} /></div>
                  <div className="space-y-3">
                    <h4 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">{ngo.name}</h4>
                    <div className="inline-block px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100"><span className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">{ngo.area}</span></div>
                  </div>
                </div>
                <div className="pt-10 mt-10 border-t border-slate-50 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Verified Direct Line</span>
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-md text-xs border border-emerald-100/30">{ngo.contact}</span>
                  </div>
                  <button className="w-full py-4 bg-slate-900 text-white rounded-full font-bold text-[11px] uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-3">
                    Access Support <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSubTab === 'Insurance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in duration-500">
            {(liveInsurance.length ? liveInsurance : INSURANCE_PLANS).map((plan) => {
              const pTheme = COLORS[plan.theme] || theme;
              return (
                <div key={plan.bank} className="bg-white p-10 lg:p-12 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col group h-full relative overflow-hidden">
                  <div className="flex items-center gap-6 mb-10 relative z-10">
                    <div className="w-20 h-20 rounded-[1.75rem] bg-slate-50 flex items-center justify-center font-black text-3xl border border-slate-100 shadow-inner transition-transform group-hover:rotate-6" style={{ color: pTheme.primary, backgroundColor: pTheme.bg }}>{plan.logo}</div>
                    <div className="flex-1 space-y-2">
                       <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none">{plan.bank}</h4>
                       <div className="flex flex-wrap items-center gap-3">
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{plan.plan}</span>
                          <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-100/50">{plan.eligibility}</span>
                       </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-10">
                    <MetricBox icon={<TrendingUp size={14} className="text-emerald-500" />} val={plan.approval} label="Approval" />
                    <MetricBox icon={<Clock size={14} className="text-blue-500" />} val={plan.processing} label="Processing" />
                    <MetricBox icon={<Users size={14} className="text-purple-500" />} val={plan.count} label="Clients" />
                  </div>
                  <div className="space-y-4 mb-10 flex-1">
                    <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest px-1">Coverage Analytics ({plan.range})</p>
                    <div className="grid grid-cols-1 gap-2.5">
                      {plan.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-3 px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl">
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                          <span className="text-[13px] font-bold text-slate-600 italic opacity-90">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="w-full py-5 bg-slate-900 text-white rounded-full font-bold text-[11px] uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3">
                    Evaluate Eligibility <ShieldCheck size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {activeSubTab === 'MyBookings' && (
          <div className="animate-in fade-in duration-500">
            {appointments?.length === 0 ? (
              <div className="bg-slate-50 p-20 rounded-[2.5rem] border-2 border-dashed border-slate-100 flex flex-col items-center text-center space-y-6">
                <div className="p-10 bg-white rounded-full shadow-sm text-slate-100"><Calendar size={64} /></div>
                <div className="space-y-1">
                  <p className="text-slate-900 font-bold text-2xl tracking-tight">Your calendar is clear</p>
                  <p className="text-sm text-slate-400 font-medium italic">Ready to schedule your next clinical support session?</p>
                </div>
                <button onClick={() => setActiveSubTab('Experts')} className="px-10 py-4 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-full">Explore Specialists</button>
              </div>
            ) : (
              <div className="grid gap-6">
                {appointments.map(a => (
                  <div key={a.id} className="p-10 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-8 flex-1 w-full">
                      <div className="p-6 bg-slate-50 rounded-[1.75rem] border border-slate-100 shadow-inner" style={{ color: theme.primary, backgroundColor: theme.bg }}><Stethoscope size={32} /></div>
                      <div className="space-y-1.5 flex-1">
                        <h4 className="font-bold text-slate-900 text-2xl tracking-tight leading-none">{a.specialistName}</h4>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">{a.type}</span>
                          <span className={`px-4 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest border ${a.status === 'Upcoming' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>{a.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col md:items-end gap-5 shrink-0">
                      <div className="space-y-1 md:text-right">
                        <span className="block text-3xl font-bold text-slate-900 tracking-tight leading-none">{a.date}</span>
                        <span className="inline-block text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-md border border-slate-100">{a.time}</span>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => cancelAppointment(a.id)} className="p-3.5 bg-slate-50 text-slate-300 hover:text-red-500 rounded-xl transition-all border border-slate-100"><X size={18} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showVerification && (
        <VerificationFlow profile={profile} initialRole={verificationRole} onComplete={handleVerificationComplete} onCancel={() => setShowVerification(false)} />
      )}
    </div>
  );
};

const MetricBox = ({ icon, val, label }) => (
  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center text-center space-y-1 shadow-inner">
    <div className="p-1.5 bg-white rounded-lg shadow-sm border border-slate-50 mb-0.5">{icon}</div>
    <span className="text-xs font-bold text-slate-800 tracking-tight">{val}</span>
    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
  </div>
);

const NavButton = ({ label, active, onClick, theme, icon }) => (
  <button onClick={onClick} className={`shrink-0 flex items-center gap-2.5 px-6 py-2.5 rounded-full font-bold text-[10px] transition-all border active:scale-[0.97] uppercase ${active ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white text-slate-400 border-slate-100 hover:text-slate-900'}`}>
    <div className="transition-all duration-300" style={{ color: active ? 'white' : theme.primary }}>{icon}</div>
    <span className="tracking-tight relative z-10">{label}</span>
  </button>
);

export default CareConnect;

import {
    Baby,
    Bell,
    CalendarDays,
    Check,
    Clock,
    Eye,
    Globe,
    Lock,
    Monitor,
    Palette,
    Shield,
    Target,
    ToggleLeft,
    ToggleRight,
    User,
    Users
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { COLORS } from '../constants';
import { getUserId, userAPI } from '../services/api';
import { translations } from '../translations';
import PersonalDataForm from './PersonalDataForm';

const Settings = ({ profile, setProfile }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [localCommitment, setLocalCommitment] = useState(15);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'

  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];

  // ── Debounced backend sync ──────────────────────────────────────
  const syncTimerRef = useRef(null);

  const scheduleBackendSync = (latestProfile) => {
    // Clear any pending sync and reschedule 1.5 s after the last change
    clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(async () => {
      const userId = getUserId();
      if (!userId || !latestProfile.authenticated) return;
      setSaveStatus('saving');
      try {
        await userAPI.updateMe({
          full_name:          latestProfile.name,
          email:              latestProfile.email,
          phase:              latestProfile.maternityStage,
          delivery_type:      latestProfile.deliveryType,
          preferences: {
              language:       latestProfile.journeySettings?.language,
          },
          family: {
              contact_name:   latestProfile.caregiver?.name,
              contact_phone:  latestProfile.caregiver?.contact,
              relation:       latestProfile.caregiver?.relationship,
          },
          caregiver_permissions: latestProfile.caregiver?.permissions,
          notifications: latestProfile.notifications,
        });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (err) {
        console.warn('Settings sync to backend failed:', err?.message);
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    }, 1500);
  };

  // Cleanup timer on unmount
  useEffect(() => () => clearTimeout(syncTimerRef.current), []);

  const updateProfile = (fields) => {
    const next = { ...profile, ...fields };
    setProfile(next);
    scheduleBackendSync(next);
  };

  const updateCaregiver = (fields) => {
    const next = { ...profile, caregiver: { ...profile.caregiver, ...fields } };
    setProfile(next);
    scheduleBackendSync(next);
  };

  const updateCaregiverPermissions = (fields) => {
    const next = { 
      ...profile, 
      caregiver: { 
        ...profile.caregiver, 
        permissions: { ...profile.caregiver.permissions, ...fields } 
      } 
    };
    setProfile(next);
    scheduleBackendSync(next);
  };

  const updateNotifications = (fields) => {
    const next = { ...profile, notifications: { ...profile.notifications, ...fields } };
    setProfile(next);
    scheduleBackendSync(next);
  };

  const currentTheme = COLORS[profile.accent] || COLORS.PINK;

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 lg:gap-16 animate-in pb-40 relative px-1 md:px-2">
      {/* Sidebar Nav */}
      <div className="w-full md:w-64 space-y-1 shrink-0">
        <div className="px-5 mb-8">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Settings</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mt-2">Personalize Your Path</p>
          {/* Save status badge */}
          {saveStatus === 'saving' && <p className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mt-2 flex items-center gap-1"><span className="animate-pulse">●</span> Saving...</p>}
          {saveStatus === 'saved'  && <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-2 flex items-center gap-1"><Check size={10} /> Saved</p>}
          {saveStatus === 'error'  && <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest mt-2">⚠ Sync failed — changes saved locally</p>}
        </div>
        <nav className="space-y-2">
          <TabBtn icon={<User size={18} />} label={t.settings.tabs.profile} active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} theme={currentTheme} />
          <TabBtn icon={<Monitor size={18} />} label={t.settings.tabs.journey} active={activeTab === 'journey'} onClick={() => setActiveTab('journey')} theme={currentTheme} />
          <TabBtn icon={<Palette size={18} />} label={t.settings.tabs.custom} active={activeTab === 'custom'} onClick={() => setActiveTab('custom')} theme={currentTheme} />
          <TabBtn icon={<Bell size={18} />} label={t.settings.tabs.notifications} active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} theme={currentTheme} />
          <TabBtn icon={<Shield size={18} />} label={t.settings.tabs.privacy} active={activeTab === 'privacy'} onClick={() => setActiveTab('privacy')} theme={currentTheme} />
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-[1rem] p-10 lg:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col transition-all">
        <div className="flex-1">
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <PersonalDataForm 
              profile={profile} 
              updateProfile={updateProfile} 
              saveStatus={saveStatus}
            />
          )}

          {/* Journey Tab */}
          {activeTab === 'journey' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="pb-8 border-b border-slate-50 space-y-1.5 focus:outline-none">
                 <h3 className="text-3xl font-black text-slate-900 tracking-tight capitalize">{t.settings.journey.title}</h3>
                 <p className="text-sm font-medium text-slate-400 opacity-80 leading-relaxed italic">Adapting AfterMa to your specific maternity phase.</p>
               </div>
               
               <div className="space-y-8">
                  {/* Phase Selection Module */}
                  <div className="p-8 lg:p-10 bg-[#f8f9fb]/50 border border-[#eef2f6] rounded-[1rem] space-y-8 transition-all hover:bg-white hover:shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-3 pb-2">
                      <div className="p-2 bg-white rounded-xl shadow-sm  text-[#8b9bb4]">
                        <Baby size={16} strokeWidth={2.5} />
                      </div>
                      <h3 className="text-[11px] font-black text-[#8b9bb4] uppercase tracking-[0.25em]">Maternity Phase</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-[#8b9bb4] uppercase tracking-widest pl-2">Current Stage</label>
                        <div className="relative">
                          <select 
                            className="w-full bg-white border border-[#eef2f6] rounded-[1rem] px-8 py-5 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all shadow-sm appearance-none cursor-pointer"
                            value={profile.maternityStage}
                            onChange={e => updateProfile({ maternityStage: e.target.value })}
                          >
                            <option value="TTC">{t.settings.stages.ttc}</option>
                            <option value="Pregnant-T1">{t.settings.stages.t1}</option>
                            <option value="Pregnant-T2">{t.settings.stages.t2}</option>
                            <option value="Pregnant-T3">{t.settings.stages.t3}</option>
                            <option value="Postpartum">{t.settings.stages.post}</option>
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                            <CalendarDays size={16} />
                          </div>
                        </div>
                      </div>

                      {profile.maternityStage === 'Postpartum' && (
                        <div className="space-y-3 animate-in slide-in-from-top-4 duration-300">
                          <label className="text-[10px] font-black text-[#8b9bb4] uppercase tracking-widest pl-2">Delivery Method</label>
                          <div className="relative">
                            <select 
                              className="w-full bg-white border border-[#eef2f6] rounded-[1rem] px-8 py-5 text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all shadow-sm appearance-none cursor-pointer"
                              value={profile.deliveryType}
                              onChange={e => updateProfile({ deliveryType: e.target.value })}
                            >
                              <option value="normal">Vaginal Delivery</option>
                              <option value="c-section">C-Section Recovery</option>
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                              <Shield size={16} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Commitment Module */}
                  <div className="p-8 lg:p-12 bg-[#f8f9fb]/50 border border-[#eef2f6] rounded-[1rem] space-y-10 transition-all hover:bg-white hover:shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-3 pb-2">
                       <div className="p-2 bg-white rounded-xl shadow-sm  text-rose-400">
                         <Target size={16} strokeWidth={2.5} />
                       </div>
                       <h3 className="text-[11px] font-black text-rose-400 uppercase tracking-[0.25em]">Journey Tuning</h3>
                    </div>

                    <div className="space-y-10">
                      <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black text-[#8b9bb4] uppercase tracking-[0.25em]">Daily Commitment</label>
                        <div className="flex items-center gap-1">
                           <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full ring-4 ring-white shadow-sm">Recommended</span>
                        </div>
                      </div>

                      <div className="relative pt-6 pb-2">
                         <input 
                           type="range" 
                           min="5" max="60" step="5" 
                           value={localCommitment} 
                           onChange={(e) => setLocalCommitment(parseInt(e.target.value))} 
                           className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500 transition-all" 
                         />
                         <div className="absolute -top-1 left-0 w-full flex justify-between px-1 pointer-events-none">
                            {[5, 15, 30, 45, 60].map(val => (
                              <div key={val} className="w-1 h-1 rounded-full bg-slate-300" />
                            ))}
                         </div>
                      </div>

                      <div className="flex items-center justify-between bg-white p-8 rounded-[1rem] border border-[#eef2f6] shadow-[0_5px_15px_rgba(0,0,0,0.01)]">
                         <div className="flex items-baseline gap-4">
                            <span className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums leading-none animate-in zoom-in-50 duration-300">{localCommitment}</span>
                            <span className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] opacity-60">MIN / DAY</span>
                         </div>
                         <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner text-slate-300 transition-transform hover:rotate-12">
                            <Clock size={24} />
                         </div>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'custom' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="pb-8 border-b border-slate-50 space-y-1.5">
                 <h3 className="text-2xl font-bold text-slate-900 tracking-tight capitalize">Appearance &amp; Localization</h3>
                 <p className="text-sm font-medium text-slate-400 opacity-80 leading-relaxed italic">Customize your interface and language preference.</p>
               </div>

               <div className="space-y-4">
                  <label className="text-[9px] font-bold uppercase text-slate-400 tracking-[0.25em] ml-2 flex items-center gap-2">
                    <Globe size={12} /> {t.settings.fields.language}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                     <button 
                        onClick={() => updateProfile({ journeySettings: { ...profile.journeySettings, language: 'english' } })}
                        className={`p-6 rounded-2xl border-2 transition-all font-bold text-sm text-center flex items-center justify-center gap-3 ${profile.journeySettings.language === 'english' ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}
                     >
                        {t.settings.languages.en}
                        {profile.journeySettings.language === 'english' && <Check size={16} />}
                     </button>
                     <button 
                        onClick={() => updateProfile({ journeySettings: { ...profile.journeySettings, language: 'hindi' } })}
                        className={`p-6 rounded-2xl border-2 transition-all font-bold text-sm text-center flex items-center justify-center gap-3 ${profile.journeySettings.language === 'hindi' ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}
                     >
                        {t.settings.languages.hi}
                        {profile.journeySettings.language === 'hindi' && <Check size={16} />}
                     </button>
                  </div>
               </div>

               <div className="space-y-8">
                  <label className="text-[9px] font-bold uppercase text-slate-400 tracking-[0.25em] ml-2">Color Accents</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
                    {Object.keys(COLORS).map(accent => (
                      <button 
                        key={accent} 
                        onClick={() => {
                          setIsTransitioning(true);
                          updateProfile({ accent });
                          setTimeout(() => setIsTransitioning(false), 800);
                        }}
                        className={`group flex flex-col items-center gap-4 transition-all ${profile.accent === accent ? 'scale-110' : 'opacity-60 hover:opacity-100'}`}
                      >
                        <div className="w-16 h-16 rounded-[1.75rem] shadow-lg border-4 border-white transition-all group-hover:rotate-12" style={{ backgroundColor: COLORS[accent].primary }} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">{accent}</span>
                      </button>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="pb-8 border-b border-slate-50 space-y-1.5">
                 <h3 className="text-2xl font-bold text-slate-900 tracking-tight capitalize">Notification Management</h3>
                 <p className="text-sm font-medium text-slate-400 opacity-80 leading-relaxed italic">Fine-tune how and when we reach out to you.</p>
               </div>
               <div className="space-y-4">
                  <ToggleField label="Exercise Reminders" sub="Nudges for scheduled physical therapy sessions." active={profile.notifications.exerciseReminders} onToggle={() => updateNotifications({ exerciseReminders: !profile.notifications.exerciseReminders })} />
                  <ToggleField label="Hydration Alerts" sub="Timely reminders to keep mineral intake consistent." active={profile.notifications.hydrationAlerts} onToggle={() => updateNotifications({ hydrationAlerts: !profile.notifications.hydrationAlerts })} />
                  <ToggleField label="Mood Check-ins" sub="Short requests for reflection at key parts of the day." active={profile.notifications.moodCheckins} onToggle={() => updateNotifications({ moodCheckins: !profile.notifications.moodCheckins })} />
                  <ToggleField label="Care Connect Updates" sub="Alerts about sister circle activities and expert responses." active={profile.notifications.careConnectUpdates} onToggle={() => updateNotifications({ careConnectUpdates: !profile.notifications.careConnectUpdates })} />
                  <ToggleField label="SOS Confirmations" sub="Confirmations when SOS signals are initiated or resolved." active={profile.notifications.sosConfirmations} onToggle={() => updateNotifications({ sosConfirmations: !profile.notifications.sosConfirmations })} />
               </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="pb-8 border-b border-slate-50 space-y-1.5">
                 <h3 className="text-2xl font-bold text-slate-900 tracking-tight capitalize">Privacy &amp; Caregiver</h3>
                 <p className="text-sm font-medium text-slate-400 opacity-80 leading-relaxed italic">Manage access for your designated caregiver and emergency settings.</p>
               </div>
               
               <div className="space-y-8">
                  <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 space-y-10">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-white rounded-xl shadow-sm  text-slate-400"><Users size={20} /></div>
                        <h4 className="text-lg font-bold text-slate-900 tracking-tight">Designated Caregiver Profile</h4>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {/* Caregiver Name */}
                         <Field label="Caregiver Name" value={profile.caregiver.name} onChange={v => updateCaregiver({ name: v })} />
                         {/* Relationship — structured dropdown */}
                         <div className="space-y-3">
                           <label className="text-[9px] font-bold uppercase text-slate-400 tracking-[0.25em] ml-2">Relationship</label>
                           <select
                             value={profile.caregiver.relationship || ''}
                             onChange={e => updateCaregiver({ relationship: e.target.value })}
                             className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold text-slate-800 focus:outline-none focus:ring-4 transition-all shadow-inner text-sm focus:bg-white appearance-none cursor-pointer"
                           >
                             <option value="">— Select Relationship —</option>
                             <option value="Partner">Partner</option>
                             <option value="Spouse">Spouse</option>
                             <option value="Best Friend">Best Friend</option>
                             <option value="Close Friend">Close Friend</option>
                             <option value="Mother">Mother</option>
                             <option value="Father">Father</option>
                             <option value="Sibling">Sibling</option>
                             <option value="Extended Family">Extended Family</option>
                             <option value="Support Worker / Professional Carer">Support Worker / Professional Carer</option>
                             <option value="Other">Other</option>
                           </select>
                         </div>
                         <Field label="Emergency Contact Number" value={profile.caregiver.contact} onChange={v => updateCaregiver({ contact: v })} />
                     </div>

                     <div className="space-y-4">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1">Permissions &amp; Shared Access</p>
                        <div className="grid gap-3">
                           <PermissionItem label="Allow Mood Log Access" active={profile.caregiver.permissions.canViewMood} onToggle={() => updateCaregiverPermissions({ canViewMood: !profile.caregiver.permissions.canViewMood })} />
                           <PermissionItem label="Allow Physical Recovery Viewing" active={profile.caregiver.permissions.canViewPhysical} onToggle={() => updateCaregiverPermissions({ canViewPhysical: !profile.caregiver.permissions.canViewPhysical })} />
                           <PermissionItem label="Share Detailed Medical History" active={profile.caregiver.permissions.canViewMedicalHistory} onToggle={() => updateCaregiverPermissions({ canViewMedicalHistory: !profile.caregiver.permissions.canViewMedicalHistory })} />
                           <PermissionItem label="Allow Appointment Syncing" active={profile.caregiver.permissions.canViewAppointments} onToggle={() => updateCaregiverPermissions({ canViewAppointments: !profile.caregiver.permissions.canViewAppointments })} />
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-6 p-8 bg-slate-900 rounded-[2.5rem] text-white overflow-hidden relative group">
                     <div className="relative z-10 space-y-1 flex-1">
                        <h4 className="text-lg font-bold tracking-tight">Ghost (Incognito) Mode</h4>
                        <p className="text-xs text-slate-400 italic">Sessions logged in ghost mode won't show in shared dashboards.</p>
                     </div>
                     <button 
                       onClick={() => updateProfile({ incognito: !profile.incognito })}
                       className={`relative z-10 p-3 rounded-2xl transition-all ${profile.incognito ? 'bg-rose-500 text-white shadow-lg' : 'bg-white/10 text-white/40'}`}
                     >
                        <Eye size={24} />
                     </button>
                     <div className="absolute right-[-10%] top-[-50%] opacity-10 pointer-events-none group-hover:rotate-12 transition-transform duration-1000"><Lock size={200} /></div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TabBtn = ({ icon, label, active, onClick, theme }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-bold text-sm transition-all duration-300 relative overflow-hidden active:scale-[0.97] group ${active ? 'bg-white shadow-md  text-slate-900 scale-[1.05]' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-700'}`}>
    <div className={`shrink-0 transition-all duration-500 group-hover:scale-110 ${active ? 'text-white p-2 rounded-lg shadow-sm' : 'text-slate-300'}`} style={{ backgroundColor: active ? theme.primary : '' }}>
      {React.cloneElement(icon, { size: active ? 16 : 20 })}
    </div>
    <span className="tracking-tight">{label}</span>
  </button>
);

const Field = ({ label, value, onChange, type = "text" }) => (
  <div className="space-y-3">
    <label className="text-[9px] font-bold uppercase text-slate-400 tracking-[0.25em] ml-2">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold text-slate-800 focus:outline-none focus:ring-4 transition-all shadow-inner text-sm focus:bg-white" />
  </div>
);

const ToggleField = ({ label, sub, active, onToggle }) => (
  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[1.75rem] border border-slate-100 transition-all hover:bg-white group">
     <div className="space-y-1">
        <h4 className="text-sm font-bold text-slate-900 tracking-tight">{label}</h4>
        <p className="text-[10px] text-slate-400 italic">{sub}</p>
     </div>
     <button onClick={onToggle} className={`transition-colors duration-300 ${active ? 'text-emerald-500' : 'text-slate-200'}`}>
        {active ? <ToggleRight size={36} strokeWidth={1.5} /> : <ToggleLeft size={36} strokeWidth={1.5} />}
     </button>
  </div>
);

const PermissionItem = ({ label, active, onToggle }) => (
   <button onClick={onToggle} className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 hover:shadow-sm transition-all group active:scale-[0.98]">
      <span className={`text-sm font-bold transition-all ${active ? 'text-slate-900' : 'text-slate-300'}`}>{label}</span>
      <div className={`p-1.5 rounded-lg border transition-all ${active ? 'bg-emerald-50 border-emerald-100 text-emerald-600 shadow-inner' : 'bg-slate-50 border-slate-100 text-slate-200'}`}>
         {active ? <Check size={14} strokeWidth={3} /> : <div className="w-3.5 h-3.5" />}
      </div>
   </button>
);

export default Settings;

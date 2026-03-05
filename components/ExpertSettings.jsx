import { Bell, ChevronRight, Clock, FileText, Lock, ShieldCheck, UserCog } from 'lucide-react';
import { useEffect, useState } from 'react';
import { expertAPI } from '../services/api';

const ExpertSettings = ({ profile, logout }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await expertAPI.getProfile();
      if (res?.data?.doctor) {
        setData(res.data.doctor);
      }
    } catch (err) {
      console.error('Failed to load doctor profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditProfile = async () => {
    if (!data) return;
    const newName = prompt('Enter your name:', data.name);
    if (!newName) return;
    const newDesignation = prompt('Enter designation:', data.designation);
    if (!newDesignation) return;

    try {
      const res = await expertAPI.updateProfile({ name: newName, designation: newDesignation });
      if (res?.data?.doctor) {
        setData(res.data.doctor);
        alert('Profile updated successfully.');
      }
    } catch (err) {
      alert('Failed to update profile: ' + err.message);
    }
  };

  const handleToggleAlerts = async () => {
    if (!data) return;
    try {
      const newState = !data.urgent_alerts_enabled;
      const res = await expertAPI.updateSettings({ urgent_alerts_enabled: newState });
      if (res?.data?.doctor) {
        setData(res.data.doctor);
        alert(`Urgent alerts ${newState ? 'enabled' : 'disabled'}`);
      }
    } catch (err) {
      alert('Failed to update settings: ' + err.message);
    }
  };

  const nameDisplay = data?.name || profile.name || 'Expert';
  const designationDisplay = data?.designation || data?.specialization || 'Healthcare Professional';
  const urgentAlertDisplay = data?.urgent_alerts_enabled ? 'Enabled' : 'Disabled';

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-32 animate-in">
      <header className="pt-10 space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Portal Settings</h1>
        <p className="text-slate-400 font-medium italic">Manage your professional profile and clinical preferences.</p>
      </header>

      {loading ? (
         <div className="text-center py-20 text-slate-400 animate-pulse">Loading settings...</div>
      ) : (
      <div className="space-y-6">
        <section className="bg-white rounded-[3rem] border border-slate-50 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
              <UserCog size={20} className="text-blue-500" /> Professional Profile
            </h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center text-3xl font-black text-slate-400 shrink-0">
                {nameDisplay[0]}
              </div>
              <div className="space-y-1 text-center sm:text-left flex-1">
                <p className="text-xl font-bold text-slate-900">{nameDisplay}</p>
                <p className="text-sm text-slate-400 font-medium">{designationDisplay}</p>
                {data?.facility_name && (
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">{data.facility_name}</p>
                )}
              </div>
              <button onClick={handleEditProfile} className="px-6 py-2 bg-slate-900 hover:bg-slate-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-colors shrink-0">
                 Edit
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-[3rem] border border-slate-50 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
              <ShieldCheck size={20} className="text-emerald-500" /> Clinical Compliance
            </h3>
          </div>
          <div className="p-8 space-y-2">
             {/* Read-only compliance fields assumed verified by admin during onboarding */}
            <SettingsRow icon={<FileText size={18} />} label="Credentials &amp; Licenses" value={data?.verified ? "Verified" : "Pending"} />
            <SettingsRow icon={<Lock size={18} />} label="Data Processing Agreement" value="Signed" />
            <SettingsRow icon={<ShieldCheck size={18} />} label="Professional Indemnity" value="Active" />
          </div>
        </section>

        <section className="bg-white rounded-[3rem] border border-slate-50 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
              <Clock size={20} className="text-purple-500" /> Availability &amp; Notifications
            </h3>
          </div>
          <div className="p-8 space-y-2">
            <SettingsRow 
              icon={<Clock size={18} />} 
              label="Session Slots" 
              value="Manage" 
              onClick={() => alert('Slot management functionality coming soon.')} 
            />
            <SettingsRow 
              icon={<Bell className={data?.urgent_alerts_enabled ? "text-amber-500" : ""} size={18} />} 
              label="Urgent Patient Alerts" 
              value={urgentAlertDisplay} 
              onClick={handleToggleAlerts} 
            />
          </div>
        </section>

        <section className="pt-4 flex justify-end">
           <button onClick={logout} className="px-6 py-3 border border-rose-200 text-rose-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-rose-50 transition-colors">
              Sign Out Securely
           </button>
        </section>
      </div>
      )}
    </div>
  );
};

const SettingsRow = ({ icon, label, value, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
    <div className="flex items-center gap-4">
      <div className="text-slate-300 group-hover:text-slate-500 transition-colors">{icon}</div>
      <span className="font-bold text-slate-600">{label}</span>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{value}</span>
      <ChevronRight size={16} className="text-slate-200" />
    </div>
  </button>
);

export default ExpertSettings;

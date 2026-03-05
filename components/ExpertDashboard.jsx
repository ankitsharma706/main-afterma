import {
    AlertCircle,
    Bell,
    Calendar,
    ChevronRight,
    FileText,
    MessageCircle,
    Search,
    ShieldCheck,
    Users,
    Video
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { COLORS } from '../constants';
import { expertAPI, sessionsAPI } from '../services/api';

const ExpertDashboard = ({ profile, onViewReport }) => {
  const theme = COLORS[profile.accent] || COLORS.PINK;
  const [activeTab, setActiveTab] = useState('sessions');
  
  // State for metrics and sessions
  const [dashboardData, setDashboardData] = useState({
    active_sessions: 0,
    critical_alerts: 0,
    assigned_members: 0,
    clinical_accuracy: 98
  });
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [dashRes, sessRes] = await Promise.all([
          expertAPI.getDashboard(),
          expertAPI.getSessions(),
        ]);
        if (dashRes?.data) setDashboardData(dashRes.data);
        if (sessRes?.data?.sessions) setSessions(sessRes.data.sessions);
      } catch (err) {
        console.error('Failed to load expert dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Active Sessions', value: dashboardData.active_sessions.toString(), icon: <Calendar size={18} />, color: 'blue' },
    { label: 'Critical Alerts', value: dashboardData.critical_alerts.toString(), icon: <AlertCircle size={18} />, color: 'rose' },
    { label: 'Assigned Members', value: dashboardData.assigned_members.toString(), icon: <Users size={18} />, color: 'emerald' },
    { label: 'Clinical Accuracy', value: `${dashboardData.clinical_accuracy}%`, icon: <ShieldCheck size={18} />, color: 'indigo' },
  ];

  // Actions
  const handleJoin = async (sessionId) => {
    try {
      const res = await sessionsAPI.join(sessionId);
      if (res?.data?.join_url) {
        window.open(res.data.join_url, '_blank');
      } else {
        alert('Join URL not available yet.');
      }
    } catch (err) {
      alert('Failed to get join link: ' + err.message);
    }
  };

  const handleCancel = async (sessionId) => {
    if (!window.confirm('Are you sure you want to cancel this session?')) return;
    try {
      await sessionsAPI.cancel(sessionId, 'Cancelled by Expert');
      setSessions(prev => prev.map(s => s._id === sessionId ? { ...s, session_status: 'cancelled' } : s));
    } catch (err) {
      alert('Failed to cancel session: ' + err.message);
    }
  };

  const handleReschedule = async (sessionId) => {
    const newDate = prompt('Enter new date (YYYY-MM-DD):');
    if (!newDate) return;
    const newTime = prompt('Enter new time (HH:MM):');
    if (!newTime) return;
    try {
      const res = await sessionsAPI.reschedule(sessionId, { session_date: newDate, session_time: newTime });
      if (res?.data?.session) {
         // Replace the old session with the new one in the list, or just mark old as rescheduled and add new.
         // Let's just refetch sessions to be safe:
         const sessRes = await expertAPI.getSessions();
         if (sessRes?.data?.sessions) setSessions(sessRes.data.sessions);
         alert('Session rescheduled successfully.');
      }
    } catch (err) {
      alert('Failed to reschedule session: ' + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-32 animate-in">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shadow-inner">
               <ShieldCheck size={20} />
             </div>
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Verified Clinical Portal</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Expert Dashboard</h1>
          <p className="text-slate-400 font-medium italic">Welcome back, {profile.name}. Your clinical expertise is making a difference.</p>
        </div>
        <div className="flex items-center gap-4">
           <button
             onClick={onViewReport}
             className="flex items-center gap-2 px-5 py-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-2xl font-bold text-xs uppercase tracking-widest border border-emerald-100 transition-all"
           >
             <FileText size={16} /> View Patient Report
           </button>
           <button className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all relative">
              <Bell size={20} />
              {dashboardData.critical_alerts > 0 && <div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />}
           </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div key={stat.label} className={`bg-white p-8 rounded-[2.5rem] border border-${stat.color}-100 shadow-sm hover:shadow-md transition-all space-y-4`}>
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600`}>
              {stat.icon}
            </div>
            <div className="space-y-1">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
               {isLoading ? (
                 <p className="text-3xl font-black text-slate-200 animate-pulse">...</p>
               ) : (
                 <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
               )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-2">
          <DashNavBtn active={activeTab === 'sessions'} onClick={() => setActiveTab('sessions')} icon={<Calendar size={18} />} label="Manage Sessions" />
          <DashNavBtn active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon={<FileText size={18} />} label="Clinical Logs" />
          <DashNavBtn active={activeTab === 'queries'} onClick={() => setActiveTab('queries')} icon={<MessageCircle size={18} />} label="Patient Queries" />
          <DashNavBtn active={activeTab === 'rooms'} onClick={() => setActiveTab('rooms')} icon={<Video size={18} />} label="Support Rooms" />
          <DashNavBtn active={activeTab === 'members'} onClick={() => setActiveTab('members')} icon={<Users size={18} />} label="My Members" />
        </div>

        {/* Content View */}
        <div className="lg:col-span-9 bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm min-h-[600px] relative">
          
          {activeTab === 'sessions' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Upcoming Sessions</h3>
                <div className="flex gap-2">
                  <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900"><Search size={18} /></button>
                </div>
              </div>
              
              {isLoading ? (
                <div className="text-slate-400 text-sm font-bold animate-pulse">Loading sessions...</div>
              ) : sessions.length === 0 ? (
                <div className="p-10 text-center text-slate-400 italic">No upcoming sessions.</div>
              ) : (
                <div className="space-y-4">
                  {sessions.filter(s => s.session_status !== 'completed' && s.session_status !== 'cancelled' && s.session_status !== 'rescheduled').map(session => (
                    <SessionRow 
                      key={session._id} 
                      session={session} 
                      onJoin={() => handleJoin(session._id)}
                      onReschedule={() => handleReschedule(session._id)}
                      onCancel={() => handleCancel(session._id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab !== 'sessions' && (
             <div className="flex items-center justify-center p-20 text-slate-400 italic font-medium">
               This section is currently under development.
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

const DashNavBtn = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm ${
      active ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    {icon}
    <span>{label}</span>
    {active && <ChevronRight size={16} className="ml-auto opacity-50" />}
  </button>
);

const SessionRow = ({ session, onJoin, onReschedule, onCancel }) => {
  const patientName = session.user_id?.full_name || 'Unknown Patient';
  const type = session.session_type || 'Unknown';
  const time = session.session_time;
  const dateStr = session.session_date ? new Date(session.session_date).toLocaleDateString() : 'N/A';
  const status = session.session_status;

  const isUp = status === 'upcoming';

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-md transition-all gap-4">
      <div className="flex items-center gap-6 self-start md:self-center">
        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-slate-400 shadow-sm border border-slate-50">
          {patientName[0]}
        </div>
        <div>
          <p className="font-bold text-slate-900">{patientName}</p>
          <div className="flex items-center gap-2 mt-1">
             <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">{type}</p>
             <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border ${
               isUp ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
             }`}>
               {status}
             </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-200">
        <div className="text-left md:text-right w-full md:w-auto">
          <p className="font-bold text-slate-900 text-sm">{time}</p>
          <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">{dateStr}</p>
        </div>
        {isUp && (
          <div className="flex gap-2 w-full md:w-auto justify-end">
            <button onClick={onJoin} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest">Join</button>
            <button onClick={onReschedule} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-widest">Reschedule</button>
            <button onClick={onCancel} className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-[10px] font-bold uppercase tracking-widest">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertDashboard;

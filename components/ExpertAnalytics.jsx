import { Activity, Calendar, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { expertAPI } from '../services/api';

const ExpertAnalytics = ({ profile }) => {
  const [data, setData] = useState({
    total_patients: 0,
    avg_recovery_rate: 0,
    sessions_held: 0,
    charts: {
      recovery_velocity: [],
      case_distribution: []
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await expertAPI.getAnalytics();
        if (res?.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-32 animate-in">
      <header className="pt-10 space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Patient Analytics</h1>
        <p className="text-slate-400 font-medium italic">Deep insights into recovery trends and clinical outcomes.</p>
      </header>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">Recovery Velocity</h3>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest">Global Trend</span>
          </div>
          <div className="h-80">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center text-slate-300 font-medium">Loading chart data...</div>
            ) : data.charts.recovery_velocity.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.charts.recovery_velocity}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis hide />
                  <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}} />
                  <Area type="monotone" dataKey="rate" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 font-medium">Not enough patient data</div>
            )}
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm space-y-8">
          <h3 className="text-xl font-bold text-slate-900">Case Distribution</h3>
          <div className="h-80">
            {loading ? (
               <div className="w-full h-full flex items-center justify-center text-slate-300 font-medium">Loading distribution...</div>
            ) : data.charts.case_distribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.charts.case_distribution}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} interval={0} angle={-30} textAnchor="end" height={60} />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.08)'}} />
                  <Bar dataKey="value" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 font-medium">No distribution data</div>
            )}
          </div>
        </div>
      </div>

      {/* Top Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <AnalyticsCard 
          icon={<Users className="text-blue-500" />} 
          label="Total Patients" 
          value={loading ? '...' : data.total_patients} 
          trend="Real-time" 
        />
        <AnalyticsCard 
          icon={<Activity className="text-emerald-500" />} 
          label="Avg. Recovery Rate" 
          value={loading ? '...' : `${data.avg_recovery_rate}/100`} 
          trend="Score" 
        />
        <AnalyticsCard 
          icon={<Calendar className="text-purple-500" />} 
          label="Sessions Held" 
          value={loading ? '...' : data.sessions_held} 
          trend="Completed" 
        />
      </div>
    </div>
  );
};

const AnalyticsCard = ({ icon, label, value, trend }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm space-y-4">
    <div className="flex justify-between items-start">
      <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
      <span className="text-emerald-500 font-bold text-[10px] uppercase">{trend}</span>
    </div>
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  </div>
);

export default ExpertAnalytics;

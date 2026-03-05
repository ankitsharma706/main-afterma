import { Activity, Clock, Droplets, Smile, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

const HealthLogs = ({ profile }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`/api/healthlogs/${profile._id}`);
        const result = await res.json();
        if (result.status === 'success') {
          setLogs(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch health logs", err);
      } finally {
        setLoading(false);
      }
    };
    if (profile?._id) fetchLogs();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="text-pink-500" size={24} />
        <h2 className="text-xl font-bold text-slate-800">Health Logs History</h2>
      </div>

      {logs.length === 0 ? (
        <p className="text-slate-500 text-sm">No health logs found.</p>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log._id || log.date} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white transition-colors flex flex-col gap-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-700 text-sm">
                  {new Date(log.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
                {log.activity_level && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-white rounded-full text-slate-500 shadow-sm border border-slate-100">
                    {log.activity_level} Activity
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                    <Droplets size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Water</p>
                    <p className="text-xs font-semibold text-slate-700">{log.water_intake} cups</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                    <Clock size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sleep</p>
                    <p className="text-xs font-semibold text-slate-700">{log.sleep_hours} hrs</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                    <Zap size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pain</p>
                    <p className="text-xs font-semibold text-slate-700">{log.pain_intensity}/10</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
                    <Smile size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mood</p>
                    <p className="text-xs font-semibold text-slate-700">{log.mood_score}/10</p>
                  </div>
                </div>
              </div>

              {(log.symptoms?.length > 0 || log.notes) && (
                <div className="mt-2 pt-3 border-t border-slate-100/60 flex flex-col gap-2">
                  {log.symptoms?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {log.symptoms.map(s => (
                        <span key={s} className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full text-[10px] font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {log.notes && (
                    <p className="text-xs text-slate-500 italic">"{log.notes}"</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthLogs;

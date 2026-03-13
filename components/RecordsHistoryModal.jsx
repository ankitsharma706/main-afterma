import { BarChart2, Baby, Calendar, Droplet, Info, Loader2, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { COLORS } from '../constants';
import { lactationAPI, periodAPI } from '../services/api';

const RecordsHistoryModal = ({ profile, logs, onClose }) => {
  const [activeTab, setActiveTab] = useState('period');
  const theme = COLORS[profile.accent] || COLORS.PINK;

  const [periodLogs, setPeriodLogs]     = useState([]);
  const [lactLogs, setLactLogs]         = useState([]);
  const [periodLoading, setPeriodLoading] = useState(true);
  const [lactLoading, setLactLoading]    = useState(true);

  // Fetch period logs
  useEffect(() => {
    const fetch = async () => {
      try {
        setPeriodLoading(true);
        const res = await periodAPI.getMyLogs();
        setPeriodLogs(res?.data?.logs || []);
      } catch { setPeriodLogs([]); }
      finally { setPeriodLoading(false); }
    };
    fetch();
  }, []);

  // Fetch lactation logs
  useEffect(() => {
    const fetch = async () => {
      try {
        setLactLoading(true);
        const res = await lactationAPI.getMyLogs();
        setLactLogs(res?.data?.logs || []);
      } catch { setLactLogs([]); }
      finally { setLactLoading(false); }
    };
    fetch();
  }, []);

  const flowColor = (flow) => ({
    heavy:    'bg-rose-100 text-rose-600 border-rose-200',
    medium:   'bg-orange-100 text-orange-600 border-orange-200',
    light:    'bg-amber-100 text-amber-600 border-amber-200',
    spotting: 'bg-pink-100 text-pink-600 border-pink-200',
  }[flow] || 'bg-slate-100 text-slate-400 border-slate-200');

  const responseEmoji = { happy: '😊', sleepy: '😴', fussy: '😣', refused: '🙅' };

  const tabs = [
    { id: 'period',    label: 'Period Logs',    icon: <Droplet size={14} /> },
    { id: 'lactation', label: 'Feeding Logs',   icon: <Baby size={14} /> },
    { id: 'health',    label: 'Health Logs',    icon: <BarChart2 size={14} /> },
    { id: 'granny',    label: 'Nani Check-in',  icon: <Calendar size={14} /> },
  ];

  return (
    <div className="fixed inset-0 z-[150] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-300">
      <div className="max-w-4xl w-full bg-white rounded-[2.5rem] lg:rounded-[3.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col h-[88vh] overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">

        {/* Header */}
        <div className="p-8 lg:p-10 border-b border-slate-50 flex justify-between items-start bg-white z-10 shrink-0">
          <div className="space-y-2">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none">Health Records</h2>
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
              <ShieldCheck size={16} strokeWidth={2.5} />
              <span className="italic opacity-90 text-xs">End-to-end private. Synced from your backend.</span>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all shrink-0"><X size={22} /></button>
        </div>

        {/* Tabs */}
        <div className="px-8 lg:px-10 border-b border-slate-100 flex items-center gap-6 bg-white z-10 shrink-0 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-5 text-[10px] lg:text-xs font-black tracking-[0.15em] uppercase transition-all border-b-[3px] whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-slate-900 border-slate-900'
                  : 'text-slate-400 border-transparent hover:text-slate-600'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50/30">

          {/* ── PERIOD LOGS ── */}
          {activeTab === 'period' && (
            <div className="p-6 lg:p-8 space-y-3">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                {periodLogs.length} Cycle Entries
              </div>
              {periodLoading ? (
                <LoadingSkeletons />
              ) : periodLogs.length === 0 ? (
                <EmptyState icon="🌸" message="No period logs yet. Head to Care Journey → Period Log to add your first entry." />
              ) : (
                periodLogs.map((log, i) => {
                  const dt = new Date(log.cycle_start);
                  const isToday = new Date().toDateString() === dt.toDateString();
                  return (
                    <div key={log._id || i} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-100 hover:shadow-sm transition-all">
                      <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 text-rose-500 mt-0.5">
                        <Droplet size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[13px] font-black text-slate-800">
                            {isToday ? 'Today' : dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          {log.flow_pattern && (
                            <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${flowColor(log.flow_pattern)}`}>
                              {log.flow_pattern}
                            </span>
                          )}
                        </div>
                        {log.symptoms?.length > 0 && (
                          <p className="text-[10px] text-slate-400 font-medium mt-1">
                            {log.symptoms.join(' • ')}
                          </p>
                        )}
                        {log.notes && (
                          <p className="text-[11px] text-slate-500 mt-1 italic">"{log.notes}"</p>
                        )}
                        <div className="flex flex-wrap gap-3 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                          {log.ovulation_window && <span className="text-amber-500">🥚 Ovulation Window</span>}
                          {log.medications && <span className="text-emerald-500">💊 Medications Taken</span>}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ── LACTATION LOGS ── */}
          {activeTab === 'lactation' && (
            <div className="p-6 lg:p-8 space-y-3">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                {lactLogs.length} Feeding Sessions
              </div>
              {lactLoading ? (
                <LoadingSkeletons />
              ) : lactLogs.length === 0 ? (
                <EmptyState icon="🍼" message="No feeding logs yet. Use Lactation Log to track your sessions." />
              ) : (
                lactLogs.map((log, i) => {
                  const dt = new Date(log.timestamp);
                  const isToday = new Date().toDateString() === dt.toDateString();
                  const emoji = responseEmoji[log.baby_response] || '';
                  return (
                    <div key={log._id || i} className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-100 hover:shadow-sm transition-all">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-500 mt-0.5">
                        <Baby size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[13px] font-black text-slate-800">
                            {isToday ? 'Today' : dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })},{' '}
                            {dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {log.baby_response && (
                            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-600 border-emerald-200">
                              {emoji} {log.baby_response}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mt-1">
                          {[
                            log.feeding_type,
                            log.side && log.side !== '' ? log.side : null,
                            log.duration_minutes ? `${log.duration_minutes} min` : null,
                            log.milk_quantity_ml ? `${log.milk_quantity_ml} ml` : null,
                          ].filter(Boolean).join(' • ')}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ── HEALTH LOGS (local) ── */}
          {activeTab === 'health' && (
            <div className="p-6 lg:p-8 space-y-3">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                {logs?.length || 0} Mood & Wellness Entries
              </div>
              {!logs || logs.length === 0 ? (
                <EmptyState icon="📋" message='No health logs yet. Use "Log a Moment" from the dashboard to start.' />
              ) : (
                [...logs].reverse().map(log => (
                  <div key={log.id} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 hover:shadow-sm transition-all group">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                      <BarChart2 size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-slate-800 text-[13px]">
                        {new Date(log.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                        Mood {log.moodLevel}/10 • Pain {log.painLevel}/10 • Energy {log.energyLevel}/10
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── NANI CHECK-IN ── */}
          {activeTab === 'granny' && (
            <EmptyState icon="👵" message="Nani Check-in feature coming soon. Stay tuned!" />
          )}
        </div>

        {/* Footer */}
        <div className="p-5 lg:p-7 bg-white border-t border-slate-100 shrink-0 z-10">
          <div className="flex items-center gap-4 text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400">
            <div className="w-8 h-8 rounded-full border border-amber-200 flex items-center justify-center text-amber-500 bg-amber-50 shrink-0">
              <Info size={14} />
            </div>
            <p>Data is encrypted and stored securely. Never shared without explicit consent.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

const LoadingSkeletons = () => (
  <div className="flex flex-col gap-3">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="h-16 bg-slate-100/70 rounded-2xl animate-pulse" />
    ))}
  </div>
);

const EmptyState = ({ icon, message }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 px-8">
    <div className="text-5xl">{icon}</div>
    <p className="text-slate-400 font-bold text-sm max-w-xs leading-relaxed">{message}</p>
  </div>
);

export default RecordsHistoryModal;

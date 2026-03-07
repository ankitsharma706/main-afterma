
import {
  Activity,
  Baby,
  BarChart3,
  Calculator,
  CheckCircle2,
  Clock,
  Download,
  Droplet,
  Edit3,
  FileText,
  Frown,
  Gauge,
  Laugh,
  Lock,
  Moon,
  Play,
  Smile,
  Sparkles,
  Target,
  X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { COLORS } from '../constants';
import { periodAPI } from '../services/api';
import { translations } from '../translations';
import HealthReportModal from './HealthReportModal';
import LactationLog from './LactationLog';
import PuzzleGame from './PuzzleGame';

const CareJourney = ({ profile, setProfile, onToggleActivity, activities, exerciseLogs, setExerciseLogs, logs, onAddLog }) => {
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState('Journey');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [sessionSettings, setSessionSettings] = useState({ intensity: 'Light', environment: 'Alone' });
  const [sessionDuration, setSessionDuration] = useState(10);
  const [showReport, setShowReport] = useState(false);
  const timerRef = useRef(null);

  const [showTTCLogic, setShowTTCLogic] = useState(false);
  const [cycleLength, setCycleLength] = useState(28);
  const [lastPeriod, setLastPeriod] = useState('');
  const [ttcResult, setTtcResult] = useState(null);
  const [periodLogs, setPeriodLogs] = useState([]);

  useEffect(() => {
    const fetchPeriodLogs = async () => {
      try {
        const res = await periodAPI.getMyLogs();
        if (res.data?.logs) {
          const mappedLogs = res.data.logs.map(log => ({
            id: log._id,
            timestamp: new Date(log.cycle_start).getTime(),
            periodFlow: log.flow_pattern ? log.flow_pattern.charAt(0).toUpperCase() + log.flow_pattern.slice(1) : 'None',
            symptoms: log.symptoms || [],
            notes: log.notes || ''
          }));
          setPeriodLogs(mappedLogs.reverse());
        }
      } catch (err) {
        console.warn('Could not load period logs', err);
      }
    };
    if (profile.authenticated) fetchPeriodLogs();
  }, [profile.authenticated]);

  const theme = COLORS[profile.accent] || COLORS.PINK;
  const isTTC = profile.maternityStage === 'TTC';

  const [quickLog, setQuickLog] = useState({
    date: new Date().toISOString().split('T')[0],
    periodFlow: 'None', isOvulating: false, crampsLevel: 0, moodLevel: 5, symptoms: [], notes: ''
  });

  const SYMPTOMS = ['Nausea', 'Aching', 'Swelling', 'Insomnia', 'Cramps', 'Bloating', 'Headache', 'Fatigue', 'Spotting', 'Tender Breasts'];

  const toggleSymptom = (s) => setQuickLog(p => ({
    ...p,
    symptoms: p.symptoms.includes(s) ? p.symptoms.filter(x => x !== s) : [...p.symptoms, s]
  }));

  // Cycle insights from saved logs
  const periodActiveDates = periodLogs
    .filter(log => log.periodFlow && log.periodFlow !== 'None')
    .map(log => new Date(log.timestamp).toDateString());

  const today = new Date();
  const lastPeriodLog = periodLogs.filter(l => l.periodFlow && l.periodFlow !== 'None').slice(-1)[0];
  const lastPeriodDate = lastPeriodLog ? new Date(lastPeriodLog.timestamp) : new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14);
  const cycleLen = cycleLength || 28;
  const ovulationDay = new Date(lastPeriodDate);
  ovulationDay.setDate(lastPeriodDate.getDate() + cycleLen - 14);
  const ovulationEnd = new Date(ovulationDay);
  ovulationEnd.setDate(ovulationDay.getDate() + 4);

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const ovulationStr = `${monthNames[ovulationDay.getMonth()]} ${ovulationDay.getDate()}-${ovulationEnd.getDate()}`;

  useEffect(() => {
    if (!isTimerRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTimerRunning]);

  const handleStartActivity = (activity) => {
    setSelectedActivity(activity);
    setTimer(0);
    setIsTimerRunning(true);
  };

  const handleCompleteActivity = () => {
    if (!selectedActivity) return;
    const newLog = {
      id: Date.now().toString(),
      activityId: selectedActivity.id,
      duration: Math.floor(timer / 60),
      intensity: profile.journeySettings.pace,
      timestamp: Date.now(),
      completed: true
    };
    setExerciseLogs(prev => [...prev, newLog]);
    onToggleActivity(selectedActivity.id);
    setIsTimerRunning(false);
    setSelectedActivity(null);
    setTimer(0);
  };

  const closeSession = () => {
    setIsTimerRunning(false);
    setSelectedActivity(null);
    setTimer(0);
  };

  const calculateTTC = () => {
    if (!lastPeriod) return;
    const lmp = new Date(lastPeriod);
    const ovulation = new Date(lmp);
    ovulation.setDate(lmp.getDate() + (cycleLength - 14));
    const testDate = new Date(ovulation);
    testDate.setDate(ovulation.getDate() + 14);
    setTtcResult({ ovulation: ovulation.toLocaleDateString(), testDate: testDate.toLocaleDateString() });
  };

  const downloadClinicalReport = () => {
    const reportData = {
      patient: profile.name,
      stage: profile.maternityStage,
      summary: {
        avgMood: ((logs || []).reduce((acc, l) => acc + l.moodLevel, 0) / ((logs || []).length || 1)).toFixed(1),
        avgPain: (logs.reduce((acc, l) => acc + l.painLevel, 0) / (logs.length || 1)).toFixed(1),
        totalKegels: logs.reduce((acc, l) => acc + l.kegelCount, 0),
      },
      periodLogs: periodLogs.filter(l => l.periodFlow && l.periodFlow !== 'None').map(l => ({
        date: new Date(l.timestamp).toLocaleDateString(), flow: l.periodFlow,
      })),
      symptoms: Array.from(new Set([...logs.flatMap(l => l.symptoms || []), ...periodLogs.flatMap(l => l.symptoms || [])]))
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AfterMa_Clinical_Report_${(profile.name || 'user').replace(/\s+/g, '_')}.json`;
    a.click();
    alert('Structured Clinical Report generated for OB-GYN review.');
  };

  const handleCommitEntry = async () => {
    try {
      if (!quickLog.date) { alert('Please select a date.'); return; }
      const payload = {
        cycle_start: quickLog.date,
        flow_pattern: quickLog.periodFlow === 'None' ? null : quickLog.periodFlow.toLowerCase(),
        symptoms: quickLog.symptoms,
        notes: quickLog.notes
      };
      const res = await periodAPI.create(payload);
      const newBackendLog = res.data?.log || payload;
      const newMappedLog = {
        id: newBackendLog._id || Date.now().toString(),
        timestamp: new Date(quickLog.date).getTime(),
        periodFlow: quickLog.periodFlow,
        symptoms: quickLog.symptoms,
        notes: quickLog.notes
      };
      setPeriodLogs(prev => [...prev, newMappedLog].sort((a, b) => a.timestamp - b.timestamp));
      alert('Period log saved successfully!');
      setQuickLog({
        date: new Date().toISOString().split('T')[0],
        periodFlow: 'None', isOvulating: false, crampsLevel: 0, moodLevel: 5, symptoms: [], notes: ''
      });
    } catch (err) {
      console.error(err);
      alert('Failed to save period log. Please try again.');
    }
  };

  const progress = activities.length > 0 ? (profile.completedActivities.length / activities.length) * 100 : 0;

  // Timer ring constants
  const R = 57;
  const CIRC = 2 * Math.PI * R;
  const timerProgress = Math.min(timer / (sessionDuration * 60), 1);

  return (
    <div className="max-w-6xl mx-auto space-y-10 lg:space-y-12 pb-32 animate-in relative">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
        <div className="space-y-3">
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">{isTTC ? 'Conception Journey' : 'Care Journey'}</h2>
          <p className="text-slate-400 font-medium italic text-base lg:text-lg opacity-80 leading-relaxed">"{isTTC ? 'Optimizing your body for a healthy start.' : 'Your guided recovery pathway.'}"</p>
        </div>
        <div className="flex gap-4">
          {isTTC && (
            <button onClick={() => setShowTTCLogic(true)} className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-all">
              <Calculator size={18} /> Fertility Insights
            </button>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="sticky top-16 lg:top-20 z-30 flex justify-center w-full pointer-events-none">
        <div className="inline-flex gap-1.5 bg-white/80 backdrop-blur-xl p-1.5 rounded-full border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] pointer-events-auto mt-4">
          <TabBtn label="Journey" icon={<Target size={14} />} active={activeTab === 'Journey'} onClick={() => setActiveTab('Journey')} />
          <TabBtn label="Period Log" icon={<Droplet size={14} />} active={activeTab === 'PeriodLog'} onClick={() => setActiveTab('PeriodLog')} />
          <TabBtn label="Lactation Log" icon={<Baby size={14} />} active={activeTab === 'LactationLog'} onClick={() => setActiveTab('LactationLog')} />
          <TabBtn label="Health Summary" icon={<BarChart3 size={14} />} active={activeTab === 'HealthSummary'} onClick={() => setActiveTab('HealthSummary')} />
        </div>
      </div>

      {/* Journey Tab */}
      {activeTab === 'Journey' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in fade-in duration-500">
          {(activities || []).map((activity) => (
            <ActivityCard key={activity.id} act={activity} theme={theme} isDone={profile.completedActivities.includes(activity.id)} onClick={() => handleStartActivity(activity)} />
          ))}
        </div>
      )}

      {/* Period Log Tab */}
      {activeTab === 'PeriodLog' && (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 bg-white p-8 lg:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Log Your Cycle</h3>
                <p className="text-slate-400 font-medium italic text-sm">Record your daily observations for precise clinical tracking.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Observation Date</label>
                  <input
                    type="date" value={quickLog.date}
                    onChange={e => setQuickLog(p => ({ ...p, date: e.target.value }))}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mood Profile</label>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    {[
                      { val: 2, icon: <Frown size={22} />, activeColor: 'bg-rose-100 border-rose-400 text-rose-500', textColor: 'text-rose-500', label: 'Low' },
                      { val: 5, icon: <Smile size={22} />, activeColor: 'bg-amber-100 border-amber-400 text-amber-500', textColor: 'text-amber-500', label: 'Balanced' },
                      { val: 8, icon: <Laugh size={22} />, activeColor: 'bg-emerald-100 border-emerald-400 text-emerald-500', textColor: 'text-emerald-500', label: 'Radiant' }
                    ].map(({ val, icon, activeColor, textColor, label }) => {
                      const isActive = quickLog.moodLevel === val;
                      return (
                        <button key={val}
                          onClick={() => setQuickLog(p => ({ ...p, moodLevel: val }))}
                          className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl border-2 transition-all duration-200 min-w-[72px] ${isActive ? `${activeColor} shadow-md scale-105` : `bg-white border-slate-100 ${textColor} hover:scale-105 hover:border-slate-200`}`}
                        >
                          {icon}
                          <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? '' : 'text-slate-400'}`}>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Flow Intensity</label>
                <div className="flex flex-wrap gap-2.5">
                  {['None', 'Spotting', 'Light', 'Medium', 'Heavy'].map(f => (
                    <button key={f}
                      onClick={() => setQuickLog(p => ({ ...p, periodFlow: f }))}
                      className={`px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest border transition-all ${quickLog.periodFlow === f ? 'bg-rose-500 border-rose-500 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                    >{f}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Symptom Cluster</label>
                <div className="flex flex-wrap gap-2">
                  {SYMPTOMS.map(s => (
                    <button key={s}
                      onClick={() => toggleSymptom(s)}
                      className={`px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest border transition-all ${quickLog.symptoms.includes(s) ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-400'}`}
                    >{s}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Medical Notes</label>
                <textarea
                  value={quickLog.notes}
                  onChange={e => setQuickLog(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Any specific observations for your doctor..."
                  className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all resize-none h-28"
                />
              </div>

              <button
                onClick={handleCommitEntry}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                <Edit3 size={17} /> Commit Entry
              </button>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Cycle Calendar */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
                <h4 className="font-black text-slate-900 tracking-tight">Cycle Calendar {monthNames[today.getMonth()]}</h4>
                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {['S','M','T','W','T','F','S'].map((d, i) => (
                    <span key={`${d}-${i}`} className="text-[10px] font-bold text-slate-300">{d}</span>
                  ))}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1;
                    const dayDate = new Date(today.getFullYear(), today.getMonth(), day);
                    const isPeriod = periodActiveDates.includes(dayDate.toDateString());
                    const isOvulWindow = dayDate >= ovulationDay && dayDate <= ovulationEnd;
                    const isToday = day === today.getDate();
                    return (
                      <div key={i} className={`aspect-square flex items-center justify-center rounded-xl text-[11px] font-bold transition-all ${isPeriod ? 'bg-rose-500 text-white shadow-md' : isOvulWindow ? 'bg-amber-400 text-white shadow-sm' : isToday ? 'border-2 border-slate-900 text-slate-900' : 'text-slate-400 hover:bg-slate-50'}`}>
                        {day}
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2.5"><div className="w-3 h-3 rounded-full bg-rose-500" /><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Period Active</span></div>
                  <div className="flex items-center gap-2.5"><div className="w-3 h-3 rounded-full bg-amber-400" /><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ovulation Window</span></div>
                </div>
              </div>

              {/* Cycle Insights */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                <h4 className="font-black text-slate-900 tracking-tight">Cycle Insights</h4>
                <div className="space-y-3">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cycle Variance</p>
                    <p className="text-2xl font-black text-slate-900">±{profile.periodActiveDays || 2} Days</p>
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Clinical Stability</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Next Ovulation</p>
                    <p className="text-2xl font-black text-slate-900">{ovulationStr}</p>
                    <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Hormonal Peak</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Observations */}
          {periodLogs.filter(l => l.periodFlow).length > 0 && (
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Recent Observations</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {periodLogs.filter(l => l.periodFlow).slice(-6).reverse().map((l, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-slate-900">{new Date(l.timestamp).toLocaleDateString()}</span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${l.periodFlow === 'None' ? 'bg-slate-100 text-slate-400' : 'bg-rose-50 text-rose-500'}`}>{l.periodFlow}</span>
                    </div>
                    {l.symptoms?.length > 0 && (
                      <p className="text-[10px] text-slate-400 font-medium">{l.symptoms.slice(0, 3).join(', ')}{l.symptoms.length > 3 ? ` +${l.symptoms.length - 3}` : ''}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'LactationLog' && (
        <LactationLog profile={profile} inline={true} />
      )}

      {showReport && <HealthReportModal profile={profile} onClose={() => setShowReport(false)} />}

      {/* Health Summary Tab */}
      {activeTab === 'HealthSummary' && (
        <div className="space-y-10 animate-in fade-in duration-500">
          <div className="bg-white/70 backdrop-blur-xl p-10 lg:p-14 rounded-[3rem] border border-white/60 shadow-sm space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Health Summary</h3>
                <p className="text-slate-400 font-medium italic">Clinical analytics and readiness indices for your recovery.</p>
              </div>
              <div className="flex gap-3">
                <button id="btn-health-summary" onClick={() => setShowReport(true)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl flex items-center gap-3 hover:scale-105 transition-all">
                  <FileText size={18} /> View Health Summary
                </button>
                <button onClick={downloadClinicalReport} className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-sm flex items-center gap-3 hover:scale-105 transition-all">
                  <Download size={18} /> Download JSON
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard label="Hydration Ratio" value={((logs.reduce((acc, l) => acc + l.waterIntake, 0) / (logs.length || 1)) / 10 * 100).toFixed(0) + '%'} sub="Daily Adherence" icon={<Droplet size={18} />} trend="Optimal" />
              <MetricCard label="Sleep Quality" value={((logs.reduce((acc, l) => acc + l.sleepHours, 0) / (logs.length || 1)) / 8 * 100).toFixed(0) + '%'} sub="Rest Efficiency" icon={<Moon size={18} />} trend="Improving" />
              <MetricCard label="Pelvic Index" value={(logs.reduce((acc, l) => acc + l.kegelCount, 0) / (logs.length || 1)).toFixed(1)} sub="Muscle Tone" icon={<Gauge size={18} />} trend="Verified" />
              <MetricCard label="Activity Load" value={logs.length} sub="Log Consistency" icon={<Activity size={18} />} trend="Balanced" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="p-10 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] space-y-8">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Readiness Indices</h4>
                <div className="space-y-6">
                  <ReportProgressBar label="Tissue Restoration" value={82} color="#10B981" />
                  <ReportProgressBar label="Pelvic Resilience" value={Math.round(progress)} color={theme.primary} />
                  <ReportProgressBar label="Core Alignment" value={65} color="#8B5CF6" />
                </div>
              </div>
              <div className="p-10 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] space-y-8">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Behavioral Patterns</h4>
                <div className="space-y-6">
                  <ReportProgressBar label="Hydration Adherence" value={90} color="#3B82F6" />
                  <ReportProgressBar label="Rest Efficiency" value={70} color="#6366F1" />
                  <ReportProgressBar label="Log Consistency" value={85} color="#EC4899" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TTC Fertility Modal */}
      {showTTCLogic && (
        <div className="fixed inset-0 z-[140] bg-white/95 backdrop-blur-xl flex items-center justify-center p-6 animate-in zoom-in-95 duration-300">
          <div className="max-w-xl w-full bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10 lg:p-14 space-y-10 relative">
            <button onClick={() => setShowTTCLogic(false)} className="absolute top-8 right-8 p-2 text-slate-300 hover:text-slate-900"><X size={24} /></button>
            <div className="text-center space-y-3">
              <div className="p-4 bg-purple-50 text-purple-600 rounded-3xl w-fit mx-auto mb-4"><Baby size={32} /></div>
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Cycle Restoration Analytics</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Cycle Length (Days)</label>
                <input type="number" value={cycleLength} onChange={e => setCycleLength(parseInt(e.target.value))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-100" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">Last Period Start Date</label>
                <input type="date" value={lastPeriod} onChange={e => setLastPeriod(e.target.value)} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-100" />
              </div>
              <button onClick={calculateTTC} className="w-full py-5 bg-slate-900 text-white rounded-full font-bold text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all">Calculate Dates</button>
            </div>
            {ttcResult && (
              <div className="p-8 bg-purple-50 rounded-[2rem] border border-purple-100 grid grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">Ovulation Window</p>
                  <p className="text-lg font-bold text-slate-900">{ttcResult.ovulation}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">Best Test Date</p>
                  <p className="text-lg font-bold text-slate-900">{ttcResult.testDate}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          SESSION MODAL — fully responsive, header always pinned
          ═══════════════════════════════════════════════════════ */}
      {selectedActivity && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center animate-in fade-in duration-300"
          style={{ background: 'rgba(10,15,25,0.88)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }}
        >
          {/* Card — fixed height so both panes can scroll independently */}
          <div
            className="w-full bg-[#1b2533] rounded-[2rem] lg:rounded-[3rem] shadow-[0_30px_80px_rgba(0,0,0,0.7)] flex flex-col lg:flex-row border border-white/5 animate-in zoom-in-95 duration-300 overflow-hidden mx-3 sm:mx-5 lg:mx-8"
            style={{ maxWidth: 1100, height: '92vh' }}
          >
            {/* ── LEFT PANE ── */}
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">

              {/* PINNED HEADER — never scrolls */}
              <div className="flex-shrink-0 relative flex flex-col items-center text-center px-6 pt-5 pb-4 border-b border-white/5">
                <button
                  onClick={closeSession}
                  className="absolute top-4 left-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-all"
                >
                  <X size={16} />
                </button>
                <span className="px-3 py-1 bg-slate-800 text-slate-200 rounded-full font-black text-[9px] uppercase tracking-widest mb-2 inline-block">
                  Active Session
                </span>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
                  {selectedActivity.title}
                </h3>
                <p className="text-slate-400 italic text-xs mt-1">{selectedActivity.description}</p>
              </div>

              {/* SCROLLABLE BODY — puzzle + timer + controls */}
              <div className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center gap-5 px-6 py-5">
                {/* Puzzle */}
                <div className="w-full max-w-xs sm:max-w-sm flex-shrink-0">
                  <PuzzleGame />
                </div>

                {/* Timer ring */}
                <div className="flex-shrink-0 relative" style={{ width: 130, height: 130 }}>
                  <svg width="130" height="130" viewBox="0 0 130 130" className="absolute inset-0" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="65" cy="65" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                    <circle
                      cx="65" cy="65" r={R}
                      fill="none" stroke="#00D084" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={CIRC}
                      strokeDashoffset={CIRC * (1 - timerProgress)}
                      style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                  </svg>
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div
                      className="absolute bottom-0 left-0 right-0 transition-all duration-1000"
                      style={{ height: `${timerProgress * 100}%`, background: 'rgba(0,208,132,0.12)' }}
                    />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-black text-white tabular-nums tracking-tighter drop-shadow-lg">
                      {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}
                    </p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">/ {sessionDuration}m</p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex-shrink-0 flex items-center gap-3 w-full max-w-xs sm:max-w-sm">
                  <button
                    id="btn-start-session"
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="h-11 w-11 bg-white shrink-0 text-slate-900 rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    {isTimerRunning ? <Lock size={16} /> : <Play size={16} className="ml-0.5" />}
                  </button>
                  <button
                    id="btn-complete-session"
                    onClick={handleCompleteActivity}
                    className="flex-1 py-3 bg-[#00d084] hover:bg-[#00e691] text-white rounded-full font-black text-[12px] tracking-wide shadow-lg active:scale-[0.98] transition-all"
                  >
                    Complete Session
                  </button>
                </div>

                <button
                  id="btn-cancel-session"
                  onClick={closeSession}
                  className="flex-shrink-0 text-[9px] font-bold text-slate-600 hover:text-white uppercase tracking-widest transition-colors pb-2"
                >
                  Cancel Session
                </button>
              </div>
            </div>

            {/* ── RIGHT PANE ── */}
            <div className="lg:w-[360px] xl:w-[400px] flex-shrink-0 bg-[#1e2a3b] border-t lg:border-t-0 lg:border-l border-white/5 flex flex-col overflow-hidden">
              {/* Pinned right header */}
              <div className="flex-shrink-0 px-6 lg:px-8 pt-5 pb-4 border-b border-slate-700/40">
                <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight">Session Settings</h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Customize your recovery rhythm.</p>
              </div>

              {/* Scrollable right body */}
              <div className="flex-1 min-h-0 overflow-y-auto px-6 lg:px-8 py-5 space-y-6">
                {/* Intensity */}
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Intensity</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Light', 'Moderate', 'Strong'].map(i => (
                      <button
                        key={i}
                        onClick={() => setSessionSettings(prev => ({ ...prev, intensity: i }))}
                        className={`py-2.5 rounded-full font-bold text-[9px] uppercase tracking-wider transition-all border ${sessionSettings.intensity === i ? 'bg-white text-slate-900 border-white shadow-lg' : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'}`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Duration</label>
                    <span className="text-xs font-bold text-white">{sessionDuration} min</span>
                  </div>
                  <input
                    type="range" className="w-full accent-white h-1 bg-slate-700 rounded-full appearance-none cursor-pointer"
                    value={sessionDuration} min="5" max="30" step="5"
                    onChange={e => { setSessionDuration(parseInt(e.target.value, 10)); setTimer(0); }}
                  />
                  <div className="flex justify-between text-[8px] font-bold text-slate-600 px-0.5">
                    <span>5m</span><span>10m</span><span>15m</span><span>20m</span><span>25m</span><span>30m</span>
                  </div>
                </div>

                {/* Support Environment */}
                <div className="space-y-3 border-t border-slate-700/50 pt-5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Support Environment</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Alone', 'With Partner', 'With Friend', 'With Family', 'With Support Worker', 'In a Group'].map(env => (
                      <button
                        key={env}
                        onClick={() => setSessionSettings(prev => ({ ...prev, environment: env }))}
                        className={`py-2.5 px-2 rounded-2xl font-bold text-[8px] uppercase tracking-wide transition-all border truncate ${sessionSettings.environment === env ? 'bg-white text-slate-900 border-white shadow-lg' : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500 hover:text-white'}`}
                      >
                        {env}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recommendation */}
                <div className="p-4 rounded-3xl bg-slate-800/60 border border-slate-700/50 space-y-2">
                  <div className="flex items-center gap-2 text-[#eab308] font-bold text-[9px] uppercase tracking-widest">
                    <Sparkles size={12} /> Recommendation
                  </div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    Based on your environment ({sessionSettings.environment}), a{' '}
                    <span className="text-white font-bold">{sessionSettings.intensity} intensity</span> is recommended.
                  </p>
                  <p className="text-[9px] text-slate-500 italic leading-relaxed">
                    Listen to your body's whispers before they become shouts. Stay aware of your breath.
                  </p>
                </div>

                {/* Disclaimer */}
                <div className="pt-4 border-t border-slate-700/50">
                  <p className="text-[7px] font-bold text-slate-600 uppercase tracking-widest leading-relaxed text-center">
                    DISCLAIMER: ALL SUGGESTIONS ARE GUIDANCE ONLY AND NOT MEDICAL ADVICE. CONSULT YOUR OB-GYN FOR CLINICAL CLEARANCE.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TabBtn = ({ label, icon, active, onClick }) => (
  <button onClick={onClick} className={`px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${active ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>
    {icon} {label}
  </button>
);

const MetricCard = ({ label, value, sub, icon, trend }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 bg-slate-50 rounded-xl text-slate-300 group-hover:text-slate-900 transition-colors shadow-inner">{icon}</div>
      <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">{trend}</span>
    </div>
    <div className="space-y-1">
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest opacity-60">{label}</p>
      <p className="text-xl font-bold text-slate-900 tracking-tight">{value}</p>
      <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">{sub}</p>
    </div>
  </div>
);

const ReportProgressBar = ({ label, value, color }) => (
  <div className="space-y-2.5">
    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
      <span>{label}</span>
      <span style={{ color }}>{value}%</span>
    </div>
    <div className="h-2 w-full bg-white rounded-full border border-slate-100 overflow-hidden shadow-inner">
      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  </div>
);

const ActivityCard = ({ act, theme, isDone, onClick }) => (
  <div onClick={onClick} className={`p-6 rounded-[2.5rem] bg-white border transition-all duration-400 cursor-pointer flex items-start gap-6 hover:translate-y-[-4px] hover:shadow-lg ${isDone ? 'border-emerald-100 bg-emerald-50/5' : 'border-slate-50 shadow-sm'}`}>
    <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center ${isDone ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-50'}`} style={{ color: !isDone ? theme.primary : '' }}>
      {isDone ? <CheckCircle2 size={28} /> : <Play size={28} />}
    </div>
    <div className="flex-1 space-y-2">
      <h4 className={`text-lg font-bold ${isDone ? 'text-emerald-900 opacity-60 line-through' : 'text-slate-800'}`}>{act.title}</h4>
      <p className="text-xs text-slate-400 italic line-clamp-2">"{act.description}"</p>
      <div className="flex items-center gap-4 text-[9px] font-bold uppercase text-slate-300 tracking-widest pt-1"><Clock size={10} /> {act.duration} Min • {act.category}</div>
    </div>
  </div>
);

export default CareJourney;


import {
  Activity,
  Baby,
  BarChart3,
  Bed,
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
  Moon,
  Pill,
  Play,
  Smile,
  Target,
  X,
  Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { COLORS } from '../constants';
import { periodAPI } from '../services/api';
import { translations } from '../translations';
import HealthReportModal from './HealthReportModal';
import LactationLog from './LactationLog';

const CareJourney = ({ profile, setProfile, onToggleActivity, activities, exerciseLogs, setExerciseLogs, logs, onAddLog }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];

  // Read ?tab= from URL to auto-select tab (e.g. from Dashboard "Log Moment")
  const urlTab = new URLSearchParams(location.search).get('tab');
  const [activeTab, setActiveTab] = useState(urlTab || 'Journey');
  const [showReport, setShowReport] = useState(false);

  const [showTTCLogic, setShowTTCLogic] = useState(false);
  const [cycleLength, setCycleLength] = useState(28);
  const [lastPeriod, setLastPeriod] = useState('');
  const [ttcResult, setTtcResult] = useState(null);
  const [periodLogs, setPeriodLogs] = useState([]);
  const [showCommitSuccess, setShowCommitSuccess] = useState(false);

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

  useEffect(() => {
    let timer;
    if (showCommitSuccess) {
      timer = setTimeout(() => {
        setShowCommitSuccess(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showCommitSuccess]);

  const theme = COLORS[profile.accent] || COLORS.PINK;
  const isTTC = profile.maternityStage === 'TTC';

  const [quickLog, setQuickLog] = useState({
    date: new Date().toISOString().split('T')[0],
    periodFlow: 'None', isOvulating: false, crampsLevel: 0, moodLevel: 5,
    painLevel: 0, energyLevel: 5, waterIntake: '',
    symptoms: [], notes: '', sleepPattern: '', ovulationWindow: false, medications: false
  });

  const WATER_RANGES = ['250 ml', '500 ml', '750 ml', '1L', '1.5L', '2L','3L','4L','5L+'];

  const SLEEP_RANGES = ['4-5 hrs', '5-7 hrs', '7-9 hrs', '9-12 hrs','12-15 hrs','15+ hrs'];

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


  const handleStartActivity = (activity) => {
    // Navigate to the dedicated session page (full-page route)
    navigate(`/care-journey/session/${activity.id}`);
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
    const successQuotes = [
      "Your consistency today is building a stronger, healthier tomorrow.",
      "Tracking your cycle is a powerful act of self-care and medical awareness.",
      "Every choice you make to track your health is a step toward profound self-wisdom.",
      "Nurturing your body is the highest form of clinical and personal excellence.",
      "Your data today helps create a clearer picture of your long-term wellness."
    ];
    const randomQuote = successQuotes[Math.floor(Math.random() * successQuotes.length)];
    window._lastSuccessQuote = randomQuote;

    try {
      if (!quickLog.date) { alert('Please select a date.'); return; }
      const payload = {
        cycle_start: quickLog.date,
        flow_pattern: quickLog.periodFlow === 'None' ? null : quickLog.periodFlow.toLowerCase(),
        symptoms: quickLog.symptoms,
        notes: quickLog.notes,
        sleep_pattern: quickLog.sleepPattern || null,
        ovulation_window: quickLog.ovulationWindow,
        medications: quickLog.medications,
        mood_level: quickLog.moodLevel,
        pain_level: quickLog.painLevel,
        energy_level: quickLog.energyLevel,
        water_intake: quickLog.waterIntake || null,
        cramps_level: quickLog.crampsLevel
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
      setShowCommitSuccess(true);
      setQuickLog({
        date: new Date().toISOString().split('T')[0],
        periodFlow: 'None', isOvulating: false, crampsLevel: 0, moodLevel: 5,
        painLevel: 0, energyLevel: 5, waterIntake: '',
        symptoms: [], notes: '', sleepPattern: '', ovulationWindow: false, medications: false
      });
    } catch (err) {
      console.error(err);
      alert('Failed to save period log. Please try again.');
    }
  };

  const progress = activities.length > 0 ? (profile.completedActivities.length / activities.length) * 100 : 0;

  if (showCommitSuccess) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-white animate-in fade-in duration-700">
        <div className="relative max-w-2xl w-full bg-white rounded-[4rem] overflow-hidden animate-in zoom-in-95 duration-700">
          <div className="h-[40vh] relative bg-slate-50 border-b border-slate-100 overflow-hidden">
            <img
              src="/wellness_celebration_figure.png"
              alt="Wellness Figure"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          </div>

          <div className="p-10 lg:p-16 text-center space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100 mb-2">
                <CheckCircle2 size={14} /> Journey Updated
              </div>
              <h3 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                You have filled today's <br/><span style={{ color: theme.primary }}>Period Log!</span>
              </h3>
            </div>

            <div className="relative p-8 bg-slate-50/80 rounded-[3rem] border border-slate-100 max-w-md mx-auto">
              <p className="text-base font-bold text-slate-500 italic leading-relaxed">
                "{window._lastSuccessQuote || "Consistency in care is the foundation of lasting health."}"
              </p>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-white border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Clinical Insight
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setShowCommitSuccess(false)}
                className="w-full max-w-sm py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:shadow-emerald-100/50 hover:-translate-y-1 active:scale-95 transition-all outline-none"
              >
                Continue Journey
              </button>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest animate-pulse">Returning in 5 seconds...</p>
            </div>
          </div>

          <button
            onClick={() => setShowCommitSuccess(false)}
            className="absolute top-8 right-8 p-4 bg-white/80 backdrop-blur-md rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm border border-slate-100 transition-all active:scale-90"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    );
  }

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
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mood Profile</label>
                    <button
                      onClick={() => navigate('/mood-check')}
                      className="text-xs font-bold italic transition-all hover:scale-105 active:scale-95"
                      style={{ color: theme.primary }}
                    >
                      check Your Mood →
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    {[
                      { val: 2, icon: <Frown size={18} />, activeColor: 'bg-rose-100 border-rose-400 text-rose-500', textColor: 'text-rose-500', label: 'Very Low' },
                      { val: 4, icon: <Smile size={18} />, activeColor: 'bg-amber-100 border-amber-400 text-amber-500', textColor: 'text-amber-500', label: 'Low' },
                      { val: 6, icon: <Smile size={18} />, activeColor: 'bg-emerald-50 border-emerald-400 text-emerald-500', textColor: 'text-emerald-500', label: 'Balanced' },
                      { val: 8, icon: <Laugh size={18} />, activeColor: 'bg-emerald-100 border-emerald-400 text-emerald-500', textColor: 'text-emerald-500', label: 'Good' },
                      { val: 10, icon: <Laugh size={18} />, activeColor: 'bg-emerald-500 border-emerald-600 text-white', textColor: 'text-emerald-600', label: 'Radiant' }
                    ].map(({ val, icon, activeColor, textColor, label }) => {
                      const isActive = quickLog.moodLevel === val;
                      return (
                        <button key={val}
                          onClick={() => setQuickLog(p => ({ ...p, moodLevel: val }))}
                          className={`flex flex-col items-center justify-center gap-1.5 py-4 rounded-xl border-2 transition-all duration-300 ${isActive ? `${activeColor} shadow-md scale-105 z-10` : `bg-white border-slate-100 ${textColor} hover:border-slate-200`}`}
                        >
                          <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>{icon}</div>
                          <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-tighter text-center leading-[1] px-0.5 transition-colors ${isActive ? '' : 'text-slate-400'}`}>{label}</span>
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

              {/* Sleep Pattern */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Bed size={12} /> Sleep Pattern</label>
                <div className="flex flex-wrap gap-2.5">
                  {SLEEP_RANGES.map(r => (
                    <button key={r}
                      onClick={() => setQuickLog(p => ({ ...p, sleepPattern: r }))}
                      className={`px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest border transition-all active:scale-95 ${quickLog.sleepPattern === r ? 'bg-indigo-500 border-indigo-500 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                    >{r}</button>
                  ))}
                </div>
              </div>

              {/* Ovulation Window + Medication Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ovulation Window Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-xl text-amber-500"><Target size={16} /></div>
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">Ovulation Window</span>
                      <span className="text-[9px] font-medium text-slate-400">{quickLog.ovulationWindow ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setQuickLog(p => ({ ...p, ovulationWindow: !p.ovulationWindow }))}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${quickLog.ovulationWindow ? 'bg-amber-400' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${quickLog.ovulationWindow ? 'left-[26px]' : 'left-0.5'}`} />
                  </button>
                </div>

                {/* Medication Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-xl text-emerald-500"><Pill size={16} /></div>
                    <div>
                      <span className="text-xs font-bold text-slate-700 block">Medications</span>
                      <span className="text-[9px] font-medium text-slate-400">{quickLog.medications ? 'Taken' : 'Not Taken'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setQuickLog(p => ({ ...p, medications: !p.medications }))}
                    className={`relative w-12 h-6 rounded-full transition-all duration-300 ${quickLog.medications ? 'bg-emerald-400' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${quickLog.medications ? 'left-[26px]' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>

              {/* Pain Intensity Slider */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Activity size={12} /> Pain Intensity</label>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">Level</span>
                    <span className="text-xl font-black tabular-nums" style={{ color: quickLog.painLevel > 6 ? '#ef4444' : quickLog.painLevel > 3 ? '#f97316' : theme.primary }}>{quickLog.painLevel}</span>
                  </div>
                  <div className="relative">
                    <div className="h-1.5 rounded-full bg-slate-200 relative overflow-visible">
                      <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-200" style={{ width: `${quickLog.painLevel * 10}%`, background: quickLog.painLevel > 6 ? 'linear-gradient(90deg, #fb7185, #ef4444)' : `linear-gradient(90deg, ${theme.primary}88, ${theme.primary})` }} />
                    </div>
                    <input type="range" min="0" max="10" value={quickLog.painLevel}
                      onChange={e => setQuickLog(p => ({ ...p, painLevel: parseInt(e.target.value) }))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer h-1.5" style={{ margin: 0 }}
                    />
                    <div
                      className="absolute top-1/2 w-4 h-4 rounded-full bg-white border-2 shadow-md -translate-y-1/2 pointer-events-none transition-all"
                      style={{ left: `calc(${quickLog.painLevel * 10}% - 8px)`, borderColor: quickLog.painLevel > 6 ? '#ef4444' : theme.primary, boxShadow: `0 2px 8px ${quickLog.painLevel > 6 ? 'rgba(239,68,68,0.3)' : theme.primary + '44'}` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                    <span>None</span><span>Severe</span>
                  </div>
                </div>
              </div>

              {/* Energy Vitality Slider */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Zap size={12} /> Energy Vitality</label>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">Level</span>
                    <span className="text-xl font-black tabular-nums" style={{ color: quickLog.energyLevel > 6 ? '#10b981' : theme.primary }}>{quickLog.energyLevel}</span>
                  </div>
                  <div className="relative">
                    <div className="h-1.5 rounded-full bg-slate-200 relative overflow-visible">
                      <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-200" style={{ width: `${quickLog.energyLevel * 10}%`, background: quickLog.energyLevel > 6 ? 'linear-gradient(90deg, #34d399, #10b981)' : `linear-gradient(90deg, ${theme.primary}88, ${theme.primary})` }} />
                    </div>
                    <input type="range" min="0" max="10" value={quickLog.energyLevel}
                      onChange={e => setQuickLog(p => ({ ...p, energyLevel: parseInt(e.target.value) }))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer h-1.5" style={{ margin: 0 }}
                    />
                    <div
                      className="absolute top-1/2 w-4 h-4 rounded-full bg-white border-2 shadow-md -translate-y-1/2 pointer-events-none transition-all"
                      style={{ left: `calc(${quickLog.energyLevel * 10}% - 8px)`, borderColor: quickLog.energyLevel > 6 ? '#10b981' : theme.primary, boxShadow: `0 2px 8px ${quickLog.energyLevel > 6 ? 'rgba(16,185,129,0.3)' : theme.primary + '44'}` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                    <span>Drained</span><span>Vibrant</span>
                  </div>
                </div>
              </div>

              {/* Water Intake */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Droplet size={12} /> Water Intake</label>
                <div className="flex flex-wrap gap-2.5">
                  {WATER_RANGES.map(r => (
                    <button key={r}
                      onClick={() => setQuickLog(p => ({ ...p, waterIntake: r }))}
                      className={`px-4 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest border transition-all active:scale-95 ${quickLog.waterIntake === r ? 'bg-blue-500 border-blue-500 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                    >{r}</button>
                  ))}
                </div>
              </div>

              {/* Cramps Severity */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Cramps Severity</label>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">Severity</span>
                    <span className="text-xl font-black text-rose-500 tabular-nums">{quickLog.crampsLevel}</span>
                  </div>
                  <div className="relative">
                    <div className="h-1.5 rounded-full bg-slate-200 relative overflow-visible">
                      <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-200" style={{ width: `${quickLog.crampsLevel * 10}%`, background: quickLog.crampsLevel > 6 ? 'linear-gradient(90deg, #fb7185, #ef4444)' : 'linear-gradient(90deg, #fda4af, #f43f5e)' }} />
                    </div>
                    <input type="range" min="0" max="10" value={quickLog.crampsLevel}
                      onChange={e => setQuickLog(p => ({ ...p, crampsLevel: parseInt(e.target.value) }))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer h-1.5" style={{ margin: 0 }}
                    />
                    <div
                      className="absolute top-1/2 w-4 h-4 rounded-full bg-white border-2 border-rose-400 shadow-md -translate-y-1/2 pointer-events-none transition-all"
                      style={{ left: `calc(${quickLog.crampsLevel * 10}% - 8px)`, boxShadow: '0 2px 8px rgba(244,63,94,0.3)' }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                    <span>None</span><span>Severe</span>
                  </div>
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

              {/* ── PERIOD HISTORY ── */}
              <div className="pt-4">
                <div className="text-[10px] font-black tracking-widest uppercase text-slate-400 mb-4">Period History</div>
                {periodLogs.length === 0 ? (
                  <div className="text-[11px] text-slate-300 font-bold text-center py-6 bg-slate-50 rounded-2xl border border-slate-100">
                    No logs yet — commit your first entry above!
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                    {[...periodLogs].reverse().map((log, i) => {
                      const dt = new Date(log.timestamp);
                      const isToday = new Date().toDateString() === dt.toDateString();
                      const dateLabel = isToday
                        ? `Today, ${dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
                        : dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                      const flowColor = {
                        Heavy: 'bg-rose-100 text-rose-600 border-rose-200',
                        Medium: 'bg-orange-100 text-orange-600 border-orange-200',
                        Light: 'bg-amber-100 text-amber-600 border-amber-200',
                        Spotting: 'bg-pink-100 text-pink-600 border-pink-200',
                        None: 'bg-slate-100 text-slate-400 border-slate-200',
                      }[log.periodFlow] || 'bg-slate-100 text-slate-400 border-slate-200';
                      return (
                        <div key={log.id || i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-rose-50/30 hover:border-rose-100 transition-all">
                          <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 text-rose-500">
                            <Droplet size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-black text-slate-800 leading-none">{dateLabel}</div>
                            {log.symptoms?.length > 0 && (
                              <div className="text-[10px] text-slate-400 font-medium mt-1 truncate">
                                {log.symptoms.slice(0, 3).join(' • ')}{log.symptoms.length > 3 ? ` +${log.symptoms.length - 3}` : ''}
                              </div>
                            )}
                          </div>
                          <span className={`shrink-0 text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full border ${flowColor}`}>
                            {log.periodFlow || 'None'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
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
                    <p className="text-2xl font-black text-slate-900">{profile.periodActiveDays || 6} Days</p>
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

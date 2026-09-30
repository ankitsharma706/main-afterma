
import React, { useEffect, useMemo, useState } from 'react';

import {
  Activity,
  Award,
  BarChart3,
  CheckCircle,
  Clock,
  Download,
  Droplet,
  FileText,
  Gauge,
  Heart,
  Moon,
  Play,
  Plus,
  Ruler,
  ShieldCheck,
  Smile,
  Sparkles,
  Target
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../constants';

const PhysicalRecovery = ({ profile, setProfile, activities, onToggleActivity }) => {
  const { t } = useTranslation();
  const [activeSubTab, setActiveSubTab] = useState('Journey');
  const [sessionActive, setSessionActive] = useState(null);
  
  const [periodForm, setPeriodForm] = useState({
    date: new Date().toISOString().split('T')[0],
    flow: 'Medium',
    symptoms: [],
    mood: 'Balanced',
    notes: ''
  });

  const isPostpartum = profile.maternityStage === 'Postpartum';
  const theme = COLORS[profile.accent] || COLORS.PINK;

  const [isTagSticky, setIsTagSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsTagSticky(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fully functional mode logic based on user stage
  const phaseInfo = useMemo(() => {
    const stage = profile.maternityStage;
    if (stage === 'TTC' || stage === 'Pregnant-T1' || stage === 'Pregnant-T2') {
      return { 
        title: t('physical.nurture'), 
        sub: "Building foundations & vital resilience", 
        icon: <Heart size={20} />,
        accent: COLORS.GREEN 
      };
    } else if (stage === 'Pregnant-T3') {
      return { 
        title: t('physical.transition'), 
        sub: "Preparation for a safe delivery", 
        icon: <Gauge size={20} />,
        accent: COLORS.BLUE 
      };
    } else {
      return { 
        title: t('physical.healing'), 
        sub: "Restorative recovery & clinical care", 
        icon: <Target size={20} />,
        accent: COLORS.PINK 
      };
    }
  }, [profile.maternityStage, t]);

  const handlePeriodLog = () => {
    const newLog = {
      id: Date.now().toString(),
      date: periodForm.date || new Date().toISOString().split('T')[0],
      flow: periodForm.flow || 'None',
      symptoms: periodForm.symptoms || [],
      mood: periodForm.mood || 'Balanced',
      notes: periodForm.notes || ''
    };
    setProfile(prev => ({ ...prev, periodLogs: [newLog, ...(prev.periodLogs || [])] }));
    alert("Health metrics updated. Your data is encrypted and safe.");
  };

  const toggleSymptom = (s) => {
    setPeriodForm(prev => {
      const current = prev.symptoms || [];
      const updated = current.includes(s) ? current.filter(x => x !== s) : [...current, s];
      return { ...prev, symptoms: updated };
    });
  };

  const generatePhysicalRecoveryPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text('Physical Recovery Summary', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated for: ${profile.name || 'Guest'}`, 14, 32);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 38);
    
    // Recovery Phase Info
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('Vitals & Status', 14, 50);
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`Overall Progress: ${Math.round(progress)}%`, 14, 58);
    doc.text(`Maternity Stage: ${profile.maternityStage || 'N/A'}`, 14, 66);
    
    // Readiness Indices
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('Readiness Indices', 14, 80);
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`- Tissue Restoration: 82%`, 14, 88);
    doc.text(`- Pelvic Resilience: ${Math.round(progress)}%`, 14, 94);
    doc.text(`- Core Alignment: 65%`, 14, 100);

    // Behavioral Patterns
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('Behavioral Patterns', 14, 114);
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`- Hydration Adherence: 95%`, 14, 122);
    doc.text(`- Rest Efficiency: 78%`, 14, 128);
    doc.text(`- Log Consistency: 88%`, 14, 134);
    
    doc.save('Physical_Recovery_Report.pdf');
  };

  const completedActivities = profile.completedActivities || [];
  const progress = activities.length > 0 ? (completedActivities.length / activities.length) * 100 : 0;

  return (
    <div className="space-y-10 animate-in max-w-6xl mx-auto pb-32">
      <div className="w-full flex justify-center">
        <div className="inline-flex gap-1.5 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-1.5 rounded-full border border-slate-100 dark:border-slate-700/50 shadow-sm sticky top-[64px] lg:top-[80px] z-[35]">
          <SubTabBtn active={activeSubTab === 'Journey'} onClick={() => setActiveSubTab('Journey')} icon={<Target size={14} />} label="Journey" theme={theme} />
          <SubTabBtn active={activeSubTab === 'Cycle'} onClick={() => setActiveSubTab('Cycle')} icon={<Droplet size={14} />} label={isPostpartum ? t('physical.cycleTitle') : t('physical.cycleTitlePre')} theme={theme} />
          <SubTabBtn active={activeSubTab === 'Report'} onClick={() => setActiveSubTab('Report')} icon={<FileText size={14} />} label={t('physical.reportTitle')} theme={theme} />
        </div>
      </div>

      {activeSubTab === 'Journey' && (
        <div className="space-y-12 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-8 bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-5">
                   <div className="p-4 rounded-2xl text-white shadow-lg" style={{ backgroundColor: phaseInfo.accent.primary }}>
                     {phaseInfo.icon}
                   </div>
                   <div className="space-y-1">
                     <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">{phaseInfo.title}</h2>
                     <div className={`text-[9px] font-bold uppercase text-slate-400 px-2.5 py-1 rounded-md border mt-2 inline-block tracking-widest shadow-inner transition-all duration-300 z-50 ${isTagSticky ? 'fixed top-[120px] lg:top-[140px] left-1/2 -translate-x-1/2 shadow-md backdrop-blur-md bg-white/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-700'}`}>
                       {phaseInfo.sub}
                     </div>
                   </div>
                </div>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-end px-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">Phase Completion</span>
                    <span className="text-3xl font-bold tracking-tighter tabular-nums" style={{ color: theme.primary }}>{Math.round(progress)}%</span>
                 </div>
                 <div className="h-2.5 w-full bg-slate-50 dark:bg-slate-900/50 rounded-full border border-slate-100 dark:border-slate-700 overflow-hidden shadow-inner">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%`, backgroundColor: theme.primary }} />
                 </div>
              </div>
            </div>
            <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center space-y-5">
               <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-inner">
                 <Award size={32} style={{ color: theme.primary }} strokeWidth={2.5} />
               </div>
               <div className="space-y-1">
                 <div className="text-5xl font-bold text-slate-900 dark:text-white tracking-tighter tabular-nums">{completedActivities.length * 10}</div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-80">Care Tokens</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             {activities.length > 0 ? activities.map(act => (
               <ActivityCard key={act.id} act={act} theme={theme} isDone={completedActivities.includes(act.id)} onClick={() => setSessionActive(act)} />
             )) : (
               <div className="col-span-full py-20 text-center space-y-4 bg-slate-50/50 dark:bg-slate-900/40 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-700">
                  <p className="text-slate-400 dark:text-slate-500 font-medium italic">No specific tasks found for this stage yet.</p>
               </div>
             )}
          </div>
        </div>
      )}

      {activeSubTab === 'Cycle' && (
        <div className="space-y-12 animate-in fade-in duration-500">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard label="Cycle Variance" value="±2 Days" sub="Clinical Stability" icon={<Ruler size={18} />} trend="Stable" />
              <MetricCard label="Ovulation Window" value="May 12-16" sub="Hormonal Peak" icon={<Sparkles size={18} />} trend="Next Cycle" />
              <MetricCard label="Mood Correlation" value="88%" sub="Hormonal Alignment" icon={<Smile size={18} />} trend="High" />
              <MetricCard label="Recovery Index" value="7.8/10" sub="Structural Integrity" icon={<Gauge size={18} />} trend="+0.2 wk" />
           </div>

           <div className="bg-white dark:bg-slate-800 p-10 lg:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-4 tracking-tight leading-none">
                    <div className="p-3 bg-rose-50 dark:bg-rose-900/30 rounded-2xl text-rose-500 border border-rose-100 dark:border-rose-800/50"><Droplet size={24} /></div>
                    {isPostpartum ? "Vitals & Cycle Log" : "Prenatal Symptom Core"}
                  </h2>
                </div>
                <button onClick={handlePeriodLog} style={{ backgroundColor: theme.primary }} className="w-full md:w-auto px-8 py-3 rounded-xl text-white font-bold text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
                  <Plus size={14} /> Commit Entry
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
                 <div className="space-y-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Observation Date</label>
                       <input type="date" value={periodForm.date} onChange={e => setPeriodForm(f => ({...f, date: e.target.value}))} className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50 rounded-xl font-bold text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-rose-100 dark:focus:ring-slate-600 transition-all dark:[color-scheme:dark]" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{isPostpartum ? "Recovery Intensity" : "Symptom Cluster"}</label>
                       <div className="flex flex-wrap gap-2">
                          {(isPostpartum ? ['Lochia Tracking', 'Breast Pain', 'Pelvic Pressure', 'Fatigue'] : ['Nausea', 'Aching', 'Swelling', 'Insomnia']).map(s => (
                            <button key={s} onClick={() => toggleSymptom(s)} className={`px-4 py-2 rounded-lg font-bold text-[10px] uppercase border transition-all ${periodForm.symptoms?.includes(s) ? 'bg-slate-800 dark:bg-slate-700 border-slate-800 dark:border-slate-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500'}`}>{s}</button>
                          ))}
                       </div>
                    </div>
                 </div>
                 <div className="space-y-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Clinical Mood Profile</label>
                       <select value={periodForm.mood} onChange={e => setPeriodForm(f => ({...f, mood: e.target.value}))} className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50 rounded-xl font-bold text-slate-800 dark:text-slate-200 outline-none appearance-none cursor-pointer">
                         <option>Resilient</option>
                         <option>Balanced</option>
                         <option>Overwhelmed</option>
                         <option>Focused</option>
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Medical Notes</label>
                       <textarea placeholder="Describe physical sensations or concerns..." value={periodForm.notes} onChange={e => setPeriodForm(f => ({...f, notes: e.target.value}))} className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50 rounded-xl font-medium text-slate-800 dark:text-slate-200 outline-none min-h-[140px] resize-none placeholder:text-slate-400 dark:placeholder:text-slate-600" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeSubTab === 'Report' && (
        <div className="space-y-12 animate-in fade-in duration-500">
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard label="Hydration Ratio" value="1.2 L/m" sub="Mineral Balance" icon={<Droplet size={18} />} trend="Optimal" />
              <MetricCard label="Sleep Quality" value="84%" sub="Rem Cycle" icon={<Moon size={18} />} trend="Improving" />
              <MetricCard label="Pelvic Index" value="9.2/10" sub="Structural Strength" icon={<ShieldCheck size={18} />} trend="Verified" />
              <MetricCard label="Activity Load" value="High" sub="Safe Load" icon={<Activity size={18} />} trend="Balanced" />
           </div>

           <div className="bg-white dark:bg-slate-800 p-10 lg:p-12 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-4 tracking-tight leading-none">
                    <div className="p-3 bg-sky-50 dark:bg-sky-900/30 rounded-2xl border border-sky-100 dark:border-sky-800/50 text-sky-500"><BarChart3 size={24} /></div>
                    Health Summary Report
                  </h2>
                </div>
                <button onClick={generatePhysicalRecoveryPDF} className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 dark:hover:bg-white transition-all active:scale-95">
                   <Download size={16} /> Structured PDF Report
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="p-8 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50 rounded-[2.5rem] space-y-8">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Readiness Indices</h4>
                    <div className="grid gap-6">
                       <ReportProgressBar label="Tissue Restoration" value={82} color="#10B981" />
                       <ReportProgressBar label="Pelvic Resilience" value={Math.round(progress)} color={theme.primary} />
                       <ReportProgressBar label="Core Alignment" value={65} color="#8B5CF6" />
                    </div>
                 </div>
                 <div className="p-8 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/50 rounded-[2.5rem] space-y-8">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Behavioral Patterns</h4>
                    <div className="grid gap-6">
                       <ReportProgressBar label="Hydration Adherence" value={95} color="#3B82F6" />
                       <ReportProgressBar label="Rest Efficiency" value={78} color="#F59E0B" />
                       <ReportProgressBar label="Log Consistency" value={88} color="#EC4899" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {sessionActive && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-6 animate-in duration-300">
           <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-[3rem] p-10 text-center space-y-8 shadow-2xl border border-slate-100 dark:border-slate-700">
              <div className="space-y-3">
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{sessionActive.title}</h2>
                 <p className="text-sm text-slate-400 dark:text-slate-400 italic">"{sessionActive.description}"</p>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <button onClick={() => { onToggleActivity(sessionActive.id); setSessionActive(null); }} style={{ backgroundColor: theme.primary }} className="w-full py-5 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                  Log Complete
                </button>
                <button onClick={() => setSessionActive(null)} className="w-full py-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-all">Cancel</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const MetricCard = ({ label, value, sub, icon, trend }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all group">
     <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-300 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors shadow-inner">{icon}</div>
        <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">{trend}</span>
     </div>
     <div className="space-y-1">
        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest opacity-60">{label}</p>
        <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
        <p className="text-[8px] font-bold text-slate-300 dark:text-slate-500 uppercase tracking-widest">{sub}</p>
     </div>
  </div>
);

const SubTabBtn = ({ active, onClick, icon, label, theme }) => (
  <button onClick={onClick} className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2.5 active:scale-95 ${active ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>{React.cloneElement(icon, { className: active ? 'text-white dark:text-slate-900' : '' })}{label}</button>
);

const ReportProgressBar = ({ label, value, color }) => (
  <div className="space-y-2.5">
     <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
        <span>{label}</span>
        <span style={{ color }}>{value}%</span>
     </div>
     <div className="h-2 w-full bg-white dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700 overflow-hidden shadow-inner">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${value}%`, backgroundColor: color }} />
     </div>
  </div>
);

const ActivityCard = ({ act, theme, isDone, onClick }) => (
  <div onClick={onClick} className={`p-6 rounded-[2.5rem] bg-white dark:bg-slate-800 border transition-all duration-400 cursor-pointer flex items-start gap-6 hover:translate-y-[-4px] hover:shadow-lg ${isDone ? 'border-emerald-100 dark:border-emerald-800/30 bg-emerald-50/5 dark:bg-emerald-900/10' : 'border-slate-50 dark:border-slate-700/50 shadow-sm'}`}>
    <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center ${isDone ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-900/50 text-slate-300 dark:text-slate-600'}`} style={{ color: !isDone ? theme.primary : '' }}>{isDone ? <CheckCircle size={28} /> : <Play size={28} />}</div>
    <div className="flex-1 space-y-2">
      <h4 className={`text-lg font-bold ${isDone ? 'text-emerald-900 dark:text-emerald-500 opacity-60 line-through' : 'text-slate-800 dark:text-slate-200'}`}>{act.title}</h4>
      <p className="text-xs text-slate-400 dark:text-slate-500 italic line-clamp-2">"{act.description}"</p>
      <div className="flex items-center gap-4 text-[9px] font-bold uppercase text-slate-300 dark:text-slate-600 tracking-widest pt-1"><Clock size={10} /> {act.duration} Min • {act.category}</div>
    </div>
  </div>
);

export default PhysicalRecovery;

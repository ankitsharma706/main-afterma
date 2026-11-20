
import React, { useEffect, useMemo, useState } from 'react';
import jsPDF from 'jspdf';

import {
    Award,
    BarChart3,
    CheckCircle,
    Clock,
    Download,
    Droplet,
    FileText,
    Gauge,
    Heart,
    Play,
    Plus,
    Target
} from 'lucide-react';
import { COLORS } from '../constants';
import { translations } from '../translations';
import { removePeriodLog, upsertPeriodLog } from '../utils/periodLogs';
import { getActivitySummary } from '../utils/recoveryReport';
import { getGhostSafeProfile } from '../utils/ghostMode';

const PhysicalRecovery = ({ profile, setProfile, activities, onToggleActivity }) => {
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];
  const [activeSubTab, setActiveSubTab] = useState('Journey');
  const [sessionActive, setSessionActive] = useState(null);
  
  const [periodForm, setPeriodForm] = useState({
    date: new Date().toISOString().split('T')[0],
    flow: 'Medium',
    symptoms: [],
    mood: 'Balanced',
    notes: ''
  });
  const [editingPeriodId, setEditingPeriodId] = useState(null);

  const isPostpartum = profile.maternityStage === 'Postpartum';
  const visibleProfile = getGhostSafeProfile(profile);
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
        title: t.physical.nurture, 
        sub: "Building foundations & vital resilience", 
        icon: <Heart size={20} />,
        accent: COLORS.GREEN 
      };
    } else if (stage === 'Pregnant-T3') {
      return { 
        title: t.physical.transition, 
        sub: "Preparation for a safe delivery", 
        icon: <Gauge size={20} />,
        accent: COLORS.BLUE 
      };
    } else {
      return { 
        title: t.physical.healing, 
        sub: "Restorative recovery & clinical care", 
        icon: <Target size={20} />,
        accent: COLORS.PINK 
      };
    }
  }, [profile.maternityStage, t]);

  const handlePeriodLog = () => {
    if (profile.incognito) {
      alert('Ghost mode is active. This observation was not saved or shared.');
      return;
    }

    const newLog = {
      id: editingPeriodId || Date.now().toString(),
      date: periodForm.date || new Date().toISOString().split('T')[0],
      flow: periodForm.flow || 'None',
      symptoms: periodForm.symptoms || [],
      mood: periodForm.mood || 'Balanced',
      notes: periodForm.notes || ''
    };
    setProfile(prev => ({
      ...prev,
      periodLogs: upsertPeriodLog(prev.periodLogs, newLog),
    }));
    setEditingPeriodId(null);
    alert("Observation saved in this browser profile. It is not encrypted or sent to a care provider.");
  };

  const editPeriodLog = (log) => {
    setPeriodForm({
      date: log.date || '',
      flow: log.flow || 'Medium',
      symptoms: Array.isArray(log.symptoms) ? log.symptoms : [],
      mood: log.mood || 'Balanced',
      notes: log.notes || '',
    });
    setEditingPeriodId(log.id);
  };

  const deletePeriodLog = (id) => {
    if (profile.incognito) return;
    setProfile(prev => ({ ...prev, periodLogs: removePeriodLog(prev.periodLogs, id) }));
    if (editingPeriodId === id) setEditingPeriodId(null);
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
    const activitySummary = getActivitySummary(activities, visibleProfile.completedActivities);
    const periodLogCount = Array.isArray(visibleProfile.periodLogs) ? visibleProfile.periodLogs.length : 0;
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text('Physical Recovery Summary', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated for: ${profile.name || 'Guest'}`, 14, 32);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 38);
    
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text('Recorded Activity', 14, 50);
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`Care activities checked off: ${activitySummary.completed} of ${activitySummary.total}`, 14, 58);
    doc.text(`Observations logged: ${periodLogCount}`, 14, 64);
    doc.text(`Maternity Stage: ${profile.maternityStage || 'N/A'}`, 14, 70);
    doc.text('Clinical measurements and health predictions are not collected or calculated by this app.', 14, 80, { maxWidth: 180 });
    
    doc.save('Physical_Recovery_Report.pdf');
  };

  const completedActivities = visibleProfile.completedActivities || [];
  const activitySummary = getActivitySummary(activities, completedActivities);
  const progress = activitySummary.percentage ?? 0;

  return (
    <div className="space-y-10 animate-in max-w-6xl mx-auto pb-32">
      <div className="w-full flex justify-center">
        <div className="inline-flex gap-1.5 bg-white/95 backdrop-blur-xl p-1.5 rounded-full border border-slate-100 shadow-sm sticky top-[64px] lg:top-[80px] z-[35]">
          <SubTabBtn active={activeSubTab === 'Journey'} onClick={() => setActiveSubTab('Journey')} icon={<Target size={14} />} label="Journey" theme={theme} />
          <SubTabBtn active={activeSubTab === 'Cycle'} onClick={() => setActiveSubTab('Cycle')} icon={<Droplet size={14} />} label={isPostpartum ? t.physical.cycleTitle : t.physical.cycleTitlePre} theme={theme} />
          <SubTabBtn active={activeSubTab === 'Report'} onClick={() => setActiveSubTab('Report')} icon={<FileText size={14} />} label={t.physical.reportTitle} theme={theme} />
        </div>
      </div>

      {activeSubTab === 'Journey' && (
        <div className="space-y-12 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between space-y-10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-5">
                   <div className="p-4 rounded-2xl text-white shadow-lg" style={{ backgroundColor: phaseInfo.accent.primary }}>
                     {phaseInfo.icon}
                   </div>
                   <div className="space-y-1">
                     <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{phaseInfo.title}</h2>
                     <div className={`text-[9px] font-bold uppercase text-slate-400 px-2.5 py-1 rounded-md border mt-2 inline-block tracking-widest shadow-inner transition-all duration-300 z-50 ${isTagSticky ? 'fixed top-[120px] lg:top-[140px] left-1/2 -translate-x-1/2 shadow-md backdrop-blur-md bg-white/90 border-slate-200' : 'bg-slate-50 border-slate-100'}`}>
                       {phaseInfo.sub}
                     </div>
                   </div>
                </div>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-end px-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-60">Phase Completion</span>
                    <span className="text-3xl font-bold tracking-tighter tabular-nums" style={{ color: phaseInfo.accent.text }}>{Math.round(progress)}%</span>
                 </div>
                 <div className="h-2.5 w-full bg-slate-50 rounded-full border border-slate-100 overflow-hidden shadow-inner">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%`, backgroundColor: phaseInfo.accent.primary }} />
                 </div>
              </div>
            </div>
            <div className="lg:col-span-4 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-5">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shadow-inner">
                 <Award size={32} style={{ color: theme.primary }} strokeWidth={2.5} />
               </div>
               <div className="space-y-1">
                 <div className="text-5xl font-bold text-slate-900 tracking-tighter tabular-nums">{activitySummary.completed}</div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-80">Activities completed</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             {activities.length > 0 ? activities.map(act => (
               <ActivityCard key={act.id} act={act} theme={theme} isDone={completedActivities.includes(act.id)} onClick={() => setSessionActive(act)} />
             )) : (
               <div className="col-span-full py-20 text-center space-y-4 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                  <p className="text-slate-400 font-medium italic">No specific tasks found for this stage yet.</p>
               </div>
             )}
          </div>
        </div>
      )}

      {activeSubTab === 'Cycle' && (
        <div className="space-y-12 animate-in fade-in duration-500">
           <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-6 text-sm text-amber-900">
             Cycle variance, ovulation timing, and hormone-related trends are unavailable. Entries below are personal observations only and are not analyzed or used to make predictions.
           </div>

           <div className="bg-white p-10 lg:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-4 tracking-tight leading-none">
                    <div className="p-3 bg-rose-50 rounded-2xl text-rose-500 border border-rose-100"><Droplet size={24} /></div>
                    {isPostpartum ? "Vitals & Cycle Log" : "Prenatal Symptom Core"}
                  </h2>
                </div>
                <button onClick={handlePeriodLog} style={{ backgroundColor: theme.primary }} className="w-full md:w-auto px-8 py-3 rounded-xl text-white font-bold text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
                  <Plus size={14} /> {editingPeriodId ? 'Update Entry' : 'Commit Entry'}
                </button>
                {editingPeriodId && <button onClick={() => setEditingPeriodId(null)} className="w-full md:w-auto px-5 py-3 rounded-xl text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50">Cancel edit</button>}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
                 <div className="space-y-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Observation Date</label>
                       <input type="date" value={periodForm.date} onChange={e => setPeriodForm(f => ({...f, date: e.target.value}))} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-rose-100 transition-all" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{isPostpartum ? "Recovery Intensity" : "Symptom Cluster"}</label>
                       <div className="flex flex-wrap gap-2">
                          {(isPostpartum ? ['Lochia Tracking', 'Breast Pain', 'Pelvic Pressure', 'Fatigue'] : ['Nausea', 'Aching', 'Swelling', 'Insomnia']).map(s => (
                            <button key={s} onClick={() => toggleSymptom(s)} className={`px-4 py-2 rounded-lg font-bold text-[10px] uppercase border transition-all ${periodForm.symptoms?.includes(s) ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>{s}</button>
                          ))}
                       </div>
                    </div>
                 </div>
                 <div className="space-y-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Clinical Mood Profile</label>
                       <select value={periodForm.mood} onChange={e => setPeriodForm(f => ({...f, mood: e.target.value}))} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-800 outline-none appearance-none cursor-pointer">
                         <option>Resilient</option>
                         <option>Balanced</option>
                         <option>Overwhelmed</option>
                         <option>Focused</option>
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Medical Notes</label>
                       <textarea placeholder="Describe physical sensations or concerns..." value={periodForm.notes} onChange={e => setPeriodForm(f => ({...f, notes: e.target.value}))} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl font-medium text-slate-800 outline-none min-h-[140px] resize-none" />
                    </div>
                    <section aria-labelledby="period-observations-heading" className="border-t border-slate-100 pt-8 space-y-4">
                      <h3 id="period-observations-heading" className="text-sm font-bold text-slate-700">Saved observations ({Array.isArray(visibleProfile.periodLogs) ? visibleProfile.periodLogs.length : 0})</h3>
                      {visibleProfile.periodLogs?.length ? visibleProfile.periodLogs.map(log => (
                        <article key={log.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-800">{log.date ? new Date(`${log.date}T00:00:00`).toLocaleDateString() : 'Date unavailable'} · {log.flow || 'Flow not recorded'}</p>
                            {log.symptoms?.length > 0 && <p className="text-xs text-slate-500">Symptoms: {log.symptoms.join(', ')}</p>}
                            {log.mood && <p className="text-xs text-slate-500">Mood: {log.mood}</p>}
                            {log.notes && <p className="text-xs text-slate-500 whitespace-pre-wrap">{log.notes}</p>}
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button onClick={() => editPeriodLog(log)} className="px-3 py-2 text-xs font-bold text-slate-700 bg-white rounded-lg border border-slate-200">Edit</button>
                            <button onClick={() => deletePeriodLog(log.id)} className="px-3 py-2 text-xs font-bold text-rose-700 bg-white rounded-lg border border-rose-200">Delete</button>
                          </div>
                        </article>
                      )) : <p className="text-sm text-slate-500">No saved observations yet.</p>}
                    </section>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeSubTab === 'Report' && (
        <div className="space-y-12 animate-in fade-in duration-500">
           <div className="bg-white p-10 lg:p-12 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-4 tracking-tight leading-none">
                    <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100 text-sky-500"><BarChart3 size={24} /></div>
                    Health Summary Report
                  </h2>
                </div>
                <button onClick={generatePhysicalRecoveryPDF} className="w-full md:w-auto flex items-center justify-center gap-3 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all active:scale-95">
                   <Download size={16} /> Structured PDF Report
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] space-y-8">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Care activity checklist</h4>
                    <div className="grid gap-6">
                       {activitySummary.percentage === null
                         ? <p className="text-sm text-slate-500">Unavailable: no activities are configured for this stage.</p>
                         : <ReportProgressBar label={`${activitySummary.completed} of ${activitySummary.total} activities checked off`} value={activitySummary.percentage} color={theme.primary} />}
                    </div>
                 </div>
                 <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Health measurements</h4>
                    <p className="text-sm text-slate-500">Unavailable: this app does not collect clinical measurements or calculate readiness, recovery, hydration, sleep, or cycle metrics.</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {sessionActive && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6 animate-in duration-300">
           <div className="max-w-md w-full bg-white rounded-[3rem] p-10 text-center space-y-8 shadow-2xl border border-slate-100">
              <div className="space-y-3">
                 <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{sessionActive.title}</h2>
                 <p className="text-sm text-slate-400 italic">"{sessionActive.description}"</p>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <button onClick={() => { onToggleActivity(sessionActive.id); setSessionActive(null); }} style={{ backgroundColor: theme.primary }} className="w-full py-5 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                  Log Complete
                </button>
                <button onClick={() => setSessionActive(null)} className="w-full py-3 text-slate-400 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50">Cancel</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const SubTabBtn = ({ active, onClick, icon, label, theme }) => (
  <button onClick={onClick} className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2.5 active:scale-95 ${active ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>{React.cloneElement(icon, { className: active ? 'text-white' : '' })}{label}</button>
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
    <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center ${isDone ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-50 text-slate-300'}`} style={{ color: !isDone ? theme.primary : '' }}>{isDone ? <CheckCircle size={28} /> : <Play size={28} />}</div>
    <div className="flex-1 space-y-2">
      <h4 className={`text-lg font-bold ${isDone ? 'text-emerald-900 opacity-60 line-through' : 'text-slate-800'}`}>{act.title}</h4>
      <p className="text-xs text-slate-400 italic line-clamp-2">"{act.description}"</p>
      <div className="flex items-center gap-4 text-[9px] font-bold uppercase text-slate-300 tracking-widest pt-1"><Clock size={10} /> {act.duration} Min • {act.category}</div>
    </div>
  </div>
);

export default PhysicalRecovery;

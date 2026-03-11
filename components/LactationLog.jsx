import { Baby, CheckCircle2, Droplets, Info, Loader2, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { COLORS } from '../constants';
import { lactationAPI } from '../services/api';

const LactationLog = ({ profile, onClose, inline = false }) => {
  const [form, setForm] = useState({
    feeding_type: 'breast',
    side: 'left',
    milk_quantity: '',
    duration: '',
    baby_response: '',
  });
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const theme = COLORS[profile?.accent] || COLORS.PINK;

  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => {
        setShowSuccess(false);
        if (onClose) onClose();
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showSuccess, onClose]);

  const up = (fields) => setForm(prev => ({ ...prev, ...fields }));

  const handleSave = async () => {
    if (!form.milk_quantity || !form.duration) {
      setError('Please enter milk quantity and duration.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await lactationAPI.create(profile._id, {
        feeding_type: form.feeding_type,
        side: form.side,
        milk_quantity: parseFloat(form.milk_quantity),
        duration_minutes: parseInt(form.duration, 10),
        baby_response: form.baby_response,
      });
      setShowSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const BtnGroup = ({ label, options, field, value, onChange }) => (
    <div className="space-y-3">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest border transition-all ${
              value === opt.value
                ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                : 'bg-white border-slate-200 text-slate-400 hover:border-slate-400'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  const ReferenceCard = ({ title, items, icon }) => (
    <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <div className="p-1.5 bg-white rounded-lg text-slate-400 group-hover:text-slate-900 transition-colors shadow-sm">{icon}</div>
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h4>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between items-center text-[10px] font-bold">
            <span className="text-slate-500">{item.label}</span>
            <span className="text-slate-900 bg-white px-2 py-0.5 rounded-full border border-slate-100">{item.range}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-white animate-in fade-in duration-700">
        <div className="relative max-w-2xl w-full bg-white rounded-[4rem] overflow-hidden animate-in zoom-in-95 duration-700">
          <div className="h-[35vh] relative bg-slate-50 border-b border-slate-100 overflow-hidden">
            <img
              src="/wellness_celebration_figure.png"
              alt="Wellness Figure"
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          </div>

          <div className="p-10 lg:p-14 text-center space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100 mb-2">
                <CheckCircle2 size={14} /> Nutrition Logged
              </div>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                Session Saved <span style={{ color: theme.primary }}>Successfully!</span>
              </h3>
            </div>

            <div className="relative p-7 bg-slate-50/80 rounded-[2.5rem] border border-slate-100 max-w-sm mx-auto">
              <p className="text-sm font-bold text-slate-500 italic leading-relaxed">
                "Nurturing your baby is the highest form of clinical and personal excellence."
              </p>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-white border border-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Wellness Insight
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full max-w-xs py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all outline-none"
              >
                Back to Dashboard
              </button>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest animate-pulse">Returning in 5 seconds...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={inline ? "w-full animate-in fade-in duration-300 space-y-6" : "fixed inset-0 z-[200] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"}>
      <div className={`bg-white overflow-hidden shadow-[0_32px_80px_-20px_rgba(0,0,0,0.1)] ${inline ? 'rounded-[2.5rem] border border-slate-100 w-full mx-auto p-2' : 'rounded-[3.5rem] w-full max-w-5xl animate-in zoom-in-95 duration-300'}`}>
        
        <div className="flex flex-col lg:flex-row h-full">
          {/* Main Content Area */}
          <div className="flex-1 border-r border-slate-50">
            {/* Header */}
            <div className={`flex items-center justify-between px-8 pb-6 border-b border-slate-50 ${inline ? 'pt-6' : 'pt-8'}`}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-500 rounded-2xl">
                  <Droplets size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 tracking-tight">Lactation Log</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Track your feeding sessions</p>
                </div>
              </div>
              {!inline && onClose && (
                <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Form Body */}
            <div className="px-8 py-8 space-y-8 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <BtnGroup
                  label="Feeding Type"
                  options={[{ value: 'breast', label: 'Breast' }, { value: 'pump', label: 'Pump' }]}
                  value={form.feeding_type}
                  onChange={v => up({ feeding_type: v })}
                />

                <BtnGroup
                  label="Side / Source"
                  options={[
                    { value: 'left', label: 'Left' },
                    { value: 'right', label: 'Right' },
                    { value: 'both', label: 'Both' },
                  ]}
                  value={form.side}
                  onChange={v => up({ side: v })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Milk Quantity (ml)</label>
                  <input
                    type="number"
                    value={form.milk_quantity}
                    min="0"
                    placeholder="e.g. 120"
                    onChange={e => up({ milk_quantity: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={form.duration}
                    min="0"
                    placeholder="e.g. 20"
                    onChange={e => up({ duration: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Baby Response Notes</label>
                <textarea
                  value={form.baby_response}
                  onChange={e => up({ baby_response: e.target.value })}
                  placeholder="e.g. Baby stops feeding calmly, latched well..."
                  rows={3}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none text-sm placeholder:text-slate-300"
                />
              </div>

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                  <p className="text-sm font-bold text-rose-600">{error}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 pb-8 pt-4 flex gap-4">
              <button
                id="btn-save-feeding-log"
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-60"
              >
                {saving ? (
                  <><Loader2 size={17} className="animate-spin" /> Committing...</>
                ) : (
                  <><Save size={17} /> Commit Feeding Log</>
                )}
              </button>
            </div>
          </div>

          {/* Reference Side Panel */}
          <div className="lg:w-[380px] bg-slate-50/30 flex flex-col border-l border-slate-100">
            <div className="p-8 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-500 shadow-sm"><Info size={16} /></div>
                <h4 className="font-black text-slate-900 tracking-tight">Reference Chart</h4>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">Medical Guideline Indices</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <ReferenceCard 
                title="Milk Quantity Sessions"
                icon={<Droplets size={12}/>}
                items={[
                  { label: "Low", range: "0 - 60 ml" },
                  { label: "Normal", range: "60 - 120 ml" },
                  { label: "High", range: "120 - 180 ml" },
                  { label: "Very High", range: "180+ ml" }
                ]}
              />

              <ReferenceCard 
                title="Feeding Durations"
                icon={<Save size={12}/>}
                items={[
                  { label: "Short", range: "5 - 10 min" },
                  { label: "Normal", range: "10 - 25 min" },
                  { label: "Long", range: "25 - 40 min" }
                ]}
              />

              <ReferenceCard 
                title="Condition Index"
                icon={<Baby size={12}/>}
                items={[
                  { label: "Satisfied", range: "Calm" },
                  { label: "Hungry", range: "Crying" },
                  { label: "Mastitis", range: "Redness" },
                  { label: "Blocked", range: "Painful" }
                ]}
              />

              <div className="p-6 bg-slate-900 rounded-[2rem] text-white space-y-3 shadow-lg">
                <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Hydration & Supply</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>1-2 Liters</span>
                    <span className="text-rose-400">Low Supply</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold">
                    <span>3-4 Liters</span>
                    <span className="text-emerald-400">Optimal</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-slate-200">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed text-center">
                  Hard lumps or skin dimpling require immediate clinical consultation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LactationLog;

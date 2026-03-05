import { Droplets, Loader2, Save, X } from 'lucide-react';
import { useState } from 'react';
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
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

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
      setSaved(true);
      setTimeout(() => { setSaved(false); if (onClose) onClose(); }, 2000);
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

  return (
    <div className={inline ? "w-full animate-in fade-in duration-300 space-y-6" : "fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300"}>
      <div className={`bg-white overflow-hidden ${inline ? 'rounded-[2.5rem] border border-slate-100 shadow-sm w-full mx-auto p-2' : 'rounded-[3rem] shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-300'}`}>
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
        <div className="px-8 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Milk Quantity (ml)</label>
              <input
                type="number"
                value={form.milk_quantity}
                min="0"
                placeholder="e.g. 120"
                onChange={e => up({ milk_quantity: e.target.value })}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
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
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Baby Response</label>
            <textarea
              value={form.baby_response}
              onChange={e => up({ baby_response: e.target.value })}
              placeholder="e.g. Settled well, latched properly, seemed satisfied..."
              rows={3}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none text-sm"
            />
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
              <p className="text-sm font-bold text-rose-600">{error}</p>
            </div>
          )}

          {saved && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center animate-in slide-in-from-top-2 duration-300">
              <p className="font-black text-emerald-700 text-sm">✓ Feeding log saved successfully!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 pt-4 flex gap-3">
          {!inline && onClose && (
            <button
              onClick={onClose}
              className="flex-1 py-4 border border-slate-200 text-slate-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
          )}
          <button
            id="btn-save-feeding-log"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-slate-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <><Loader2 size={15} className="animate-spin" /> Saving...</>
            ) : (
              <><Save size={15} /> Save Feeding Log</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LactationLog;

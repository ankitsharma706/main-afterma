import { Calendar, CheckCircle2, Clock, ShieldCheck, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

// Wrapper for all modals to keep styling consistent
const ModalWrapper = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  const content = (
    <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4 sm:p-6 overflow-y-auto hide-scrollbar">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-8 border-b border-slate-50">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-full transition-colors"><X size={20}/></button>
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
  return typeof document !== 'undefined' ? createPortal(content, document.body) : content;
};

export const CredentialsModal = ({ isOpen, onClose }) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Credentials & Licenses">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Medical Registration Number</label>
            <input type="text" placeholder="e.g. MCI-12345" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-400 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Licensing Authority</label>
            <input type="text" placeholder="e.g. Medical Council of India" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-400 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Specialty / Field of Practice</label>
            <input type="text" placeholder="e.g. Lactation Consultant" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-400 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Years of Experience</label>
            <input type="text" placeholder="e.g. 10" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-400 outline-none transition-all" />
          </div>
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Clinic / Hospital Affiliation</label>
            <input type="text" placeholder="e.g. Apollo Hospitals" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-400 outline-none transition-all" />
          </div>
        </div>
        
        <div className="space-y-2 pt-4">
          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Supporting Documents</label>
          <div className="border border-slate-100 rounded-[2rem] p-10 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 border-dashed transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-white flex items-center justify-center rounded-2xl shadow-sm mb-4 text-slate-300 group-hover:text-blue-500 transition-colors">
              <Upload size={20} />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Upload Registration Certificate</h4>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">PDF, JPG or PNG (Max 5MB)</p>
          </div>
        </div>

        <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:bg-slate-800 active:scale-[0.98] transition-all tracking-widest text-xs flex justify-center items-center gap-2 mt-4">
          <FileTextIcon /> SAVE CREDENTIALS
        </button>
      </div>
    </ModalWrapper>
  );
};

export const AlertsModal = ({ isOpen, onClose }) => {
  const [enabled, setEnabled] = useState(true);
  const [channels, setChannels] = useState(['Push', 'Email']);

  const toggleChannel = (ch) => {
    if (channels.includes(ch)) {
       setChannels(channels.filter(c => c !== ch));
    } else {
       setChannels([...channels, ch]);
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Urgent Patient Alerts">
      <div className="space-y-8">
        <div className="flex items-center justify-between bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Enable Urgent Alerts</h4>
            <p className="text-[10px] text-slate-400 font-medium mt-1">Receive priority notifications for red-flag cases.</p>
          </div>
          <button 
            onClick={() => setEnabled(!enabled)}
            className={`w-12 h-6 rounded-full relative transition-colors ${enabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${enabled ? 'left-7 px-0' : 'left-1'}`} />
          </button>
        </div>

        <div className="space-y-3">
          <label className="text-[9px] uppercase font-bold text-slate-400 tracking-widest pl-1">Notification Channels</label>
          <div className="flex gap-3">
             {['Push', 'SMS', 'Email'].map(ch => (
               <button 
                 key={ch}
                 onClick={() => toggleChannel(ch)}
                 className={`flex-1 py-3 rounded-2xl text-xs font-bold transition-all border ${channels.includes(ch) ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}
               >
                 {ch}
               </button>
             ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <label className="text-[9px] uppercase font-bold text-slate-400 tracking-widest pl-1">Quiet Hours (DND)</label>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-[9px] uppercase font-bold text-slate-400 tracking-widest pl-1">From</label>
              <div className="relative">
                <input type="text" defaultValue="10:00 PM" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 outline-none" />
                <Clock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <label className="text-[9px] uppercase font-bold text-slate-400 tracking-widest pl-1">To</label>
              <div className="relative">
                <input type="text" defaultValue="07:00 AM" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 outline-none" />
                <Clock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:bg-slate-800 active:scale-[0.98] transition-all tracking-widest text-xs flex justify-center items-center gap-2 mt-4">
           UPDATE ALERT SETTINGS
        </button>
      </div>
    </ModalWrapper>
  );
};

export const SessionSlotsModal = ({ isOpen, onClose }) => {
  const [days, setDays] = useState(['Mon', 'Tue', 'Wed', 'Thu']);

  const toggleDay = (d) => {
    if (days.includes(d)) setDays(days.filter(day => day !== d));
    else setDays([...days, d]);
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Session Slots Configuration">
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-[9px] uppercase font-bold text-slate-400 tracking-widest pl-1">Available Days</label>
          <div className="flex flex-wrap gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <button 
                key={day}
                onClick={() => toggleDay(day)}
                className={`w-14 h-10 rounded-xl text-xs font-bold transition-all border ${days.includes(day) ? 'bg-slate-900 border-slate-900 text-white' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300'}`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
              <label className="text-[9px] uppercase font-bold text-slate-400 tracking-widest pl-1">Start Time</label>
              <div className="relative">
                <input type="text" defaultValue="09:00 AM" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 outline-none" />
                <Clock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
           </div>
           <div className="space-y-2">
              <label className="text-[9px] uppercase font-bold text-slate-400 tracking-widest pl-1">End Time</label>
              <div className="relative">
                <input type="text" defaultValue="05:00 PM" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 outline-none" />
                <Clock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
           </div>
           <div className="space-y-2">
              <label className="text-[9px] uppercase font-bold text-slate-400 tracking-widest pl-1">Session Duration (Min)</label>
              <input type="number" defaultValue="30" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[9px] uppercase font-bold text-slate-400 tracking-widest pl-1">Buffer Time (Min)</label>
              <input type="number" defaultValue="10" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 outline-none" />
           </div>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 mt-4">
          <div className="flex justify-between items-center mb-4">
             <h4 className="text-xs font-bold text-slate-800">Preview Schedule</h4>
             <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">13 Slots / Day</span>
          </div>
          <div className="flex gap-2 flex-wrap text-[10px] font-bold text-slate-500">
             <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">09:00</span>
             <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">09:40</span>
             <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">10:20</span>
             <span className="bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100">11:00</span>
             <span className="bg-white px-3 py-1.5 rounded-lg text-slate-300 border border-slate-100 border-dashed">...</span>
          </div>
        </div>

        <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:bg-slate-800 active:scale-[0.98] transition-all tracking-widest text-xs flex justify-center items-center gap-2 mt-4">
           <Calendar size={14} /> SAVE SCHEDULE
        </button>
      </div>
    </ModalWrapper>
  );
};

export const DPAModal = ({ isOpen, onClose }) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Data Processing Agreement">
      <div className="space-y-6">
        <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 text-sm text-slate-600 font-medium leading-relaxed">
          <h4 className="font-bold text-slate-900 mb-4">Data Processing Terms</h4>
          <p className="mb-4">
            By signing this agreement, you agree to handle all patient data in accordance with AfterMa's strict privacy protocols and local healthcare data regulations (e.g., HIPAA, GDPR, or local equivalents).
          </p>
          <ul className="space-y-4">
            <li><strong className="text-slate-800">1. Data Confidentiality:</strong> All patient interactions and health data must remain strictly confidential.</li>
            <li><strong className="text-slate-800">2. Data Minimization:</strong> Only collect data necessary for the clinical consultation.</li>
            <li><strong className="text-slate-800">3. Security Standards:</strong> Maintain secure access to your expert portal and report any breaches immediately.</li>
            <li><strong className="text-slate-800">4. Patient Rights:</strong> Respect patient requests for data access or deletion as per...</li>
          </ul>
        </div>

        <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-3xl p-5 flex items-start gap-4">
          <div className="bg-white p-1.5 rounded-full shadow-sm text-emerald-500 shrink-0 mt-0.5"><ShieldCheck size={16} /></div>
          <p className="text-[11px] font-bold leading-relaxed">
            Your digital signature will be recorded along with your IP address and timestamp for legal compliance.
          </p>
        </div>

        <button onClick={onClose} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-[0_10px_20px_rgba(16,185,129,0.3)] hover:bg-emerald-700 active:scale-[0.98] transition-all tracking-widest text-xs flex justify-center items-center gap-2 mt-4">
           <CheckCircle2 size={16} /> SIGN & ACCEPT AGREEMENT
        </button>
      </div>
    </ModalWrapper>
  );
};

export const IndemnityModal = ({ isOpen, onClose }) => {
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Professional Indemnity">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Policy Number</label>
            <input type="text" placeholder="e.g. PI-987654321" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-400 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Insurance Provider</label>
            <input type="text" placeholder="e.g. United Healthcare" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-400 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Coverage Amount</label>
            <input type="text" placeholder="e.g. ₹50,00,000" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-400 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Expiry Date</label>
            <div className="relative">
              <input type="text" placeholder="dd----yyyy" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-semibold text-slate-800 focus:bg-white focus:border-blue-400 outline-none transition-all" />
              <Calendar size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest pl-1">Proof of Insurance</label>
          <div className="border border-purple-200 rounded-[2rem] p-10 flex flex-col items-center justify-center bg-white hover:bg-purple-50/30 border-dashed transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-white flex items-center justify-center rounded-2xl shadow-[0_4px_12px_rgba(168,85,247,0.1)] mb-4 text-purple-400 group-hover:text-purple-600 transition-colors border border-purple-50">
              <Upload size={20} />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Upload Indemnity Certificate</h4>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">PDF or Image (Max 5MB)</p>
          </div>
        </div>

        <button onClick={onClose} className="w-full py-4 bg-purple-600 text-white font-bold rounded-2xl shadow-[0_10px_20px_rgba(168,85,247,0.3)] hover:bg-purple-700 active:scale-[0.98] transition-all tracking-widest text-xs flex justify-center items-center gap-2 mt-4">
           <FileTextIcon /> UPDATE INDEMNITY PROOF
        </button>
      </div>
    </ModalWrapper>
  );
};

// Simple placeholder icon wrapper for the missing file text
const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
);

import { BarChart2, Calendar, Info, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';
import { COLORS } from '../constants';

const RecordsHistoryModal = ({ profile, logs, onClose }) => {
  const [activeTab, setActiveTab] = useState('logs');
  const theme = COLORS[profile.accent] || COLORS.PINK;

  return (
    <div className="fixed inset-0 z-[150] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-300">
      <div className="max-w-4xl w-full bg-white rounded-[2.5rem] lg:rounded-[3.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
        
        {/* Header */}
        <div className="p-8 lg:p-10 border-b border-slate-50 flex justify-between items-start bg-white z-10 shrink-0">
          <div className="space-y-3">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none">Health Records</h2>
            <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
               <ShieldCheck size={18} strokeWidth={2.5} /> <span className="italic opacity-90">End-to-end private. Data remains within this circle.</span>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all shrink-0"><X size={24} /></button>
        </div>

        {/* Tabs */}
        <div className="px-8 lg:px-10 border-b border-slate-50 flex items-center gap-8 bg-white z-10 shrink-0">
            <button 
              onClick={() => setActiveTab('logs')} 
              className={`py-6 text-[10px] lg:text-xs font-black tracking-[0.15em] uppercase transition-all border-b-[3px] ${activeTab === 'logs' ? 'text-slate-900 border-slate-900' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
            >
              Health Logs
            </button>
            <button 
              onClick={() => setActiveTab('granny')} 
              className={`py-6 text-[10px] lg:text-xs font-black tracking-[0.15em] uppercase transition-all border-b-[3px] ${activeTab === 'granny' ? 'text-slate-900 border-slate-900' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
            >
              Granny Check-in
            </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto bg-white flex flex-col relative">
           {logs && logs.length > 0 && activeTab === 'logs' ? (
              <div className="p-8 lg:p-10 grid grid-cols-1 gap-4">
                 {logs.map(log => (
                    <div key={log.id} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex justify-between items-center group hover:bg-white hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all">
                       <div className="space-y-2">
                          <p className="font-bold text-slate-900 text-lg">Log from {new Date(log.timestamp).toLocaleDateString()}</p>
                          <p className="text-sm font-bold text-slate-400">Mood: {log.moodLevel}/10 • Pain: {log.painLevel}/10 • Energy: {log.energyLevel}/10</p>
                       </div>
                       <button className="text-slate-400 hover:text-slate-900 transition-colors p-4 bg-white border border-slate-100 group-hover:border-slate-200 shadow-sm rounded-2xl"><BarChart2 size={20} /></button>
                    </div>
                 ))}
              </div>
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 my-auto absolute inset-0">
                <div className="w-28 h-28 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-2 shadow-inner">
                   <Calendar size={48} strokeWidth={1.5} />
                </div>
                <p className="text-slate-400 font-bold text-lg max-w-sm leading-relaxed">No records found yet. Start logging to see the journey here.</p>
             </div>
           )}
        </div>

        {/* Footer */}
        <div className="p-6 lg:p-8 bg-slate-50 border-t border-slate-100 shrink-0 z-10 relative">
           <div className="flex items-center gap-5 text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-slate-400">
               <div className="w-10 h-10 rounded-full border border-amber-200 flex items-center justify-center text-amber-500 bg-amber-50 shrink-0 shadow-sm">
                  <Info size={20} />
               </div>
               <p className="leading-loose">Data is encrypted and stored locally. Health information is never shared with third parties without explicit consent.</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default RecordsHistoryModal;

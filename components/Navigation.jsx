
import {
    Activity,
    BarChart3,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Heart,
    Home,
    LayoutDashboard,
    LogOut,
    MapPin,
    Settings,
    ShoppingBag,
    Star,
    UserCheck,
    UserCog,
    Users,
    Utensils,
    X
} from 'lucide-react';
import { useState } from 'react';
import { COLORS, SLOGAN } from '../constants';
import { translations } from '../translations';

const Navigation = ({ currentView, setView, profile, logout, onClose, onOpenLocation, isCollapsed, setIsCollapsed }) => {
  const theme = COLORS[profile.accent] || COLORS.PINK;
  const lang = profile.journeySettings.language || 'english';
  const t = translations[lang];
  
  const isExpert = profile.role === 'expert' && profile.verification?.status === 'verified';

  const navItems = isExpert ? [
    { id: 'expert-dashboard', label: 'Clinical Dashboard', icon: LayoutDashboard, private: true },
    { id: 'expert-analytics', label: 'Patient Analytics', icon: BarChart3, private: true },
    { id: 'expert-settings', label: 'Portal Settings', icon: UserCog, private: true },
  ] : [
    { id: 'dashboard', label: t.nav.dashboard, icon: Home, private: true },
    { id: 'carejourney', label: 'Care Journey', icon: Activity, private: true },
    { id: 'mentalwellness', label: t.nav.mental, icon: Heart, private: true },
    { id: 'careconnect', label: t.nav.care, icon: Users, private: true },
    { id: 'momkart', label: t.nav.momkart, icon: ShoppingBag, private: true },
    { id: 'recipes', label: 'Safe Recipes', icon: Utensils, private: false },
    { id: 'education', label: t.nav.education, icon: BookOpen, private: false },
    { id: 'settings', label: t.nav.settings, icon: Settings, private: true },
    { id: 'aftermaplus', label: t.nav.membership, icon: Star, private: true },
  ];

  if (profile.role === 'caregiver' && !isExpert) {
    navItems.unshift({ id: 'caregiver', label: t.nav.caregiver || 'Caregiver View', icon: UserCheck, private: true });
  }

  return (
    <div 
      className={`bg-white h-screen border-r border-gray-100 flex flex-col shadow-sm relative z-50 overflow-hidden transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-5 flex items-center justify-between">
        {!isCollapsed && (
          <div className="group cursor-pointer animate-in fade-in duration-500">
            <h1 className="text-2xl font-black text-slate-900 group-hover:scale-105 transition-transform">
              AfterMa
            </h1>
            <p className="text-[10px] mt-1 tracking-widest font-black text-slate-400 uppercase opacity-80">
              {SLOGAN}
            </p>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-xl hover:bg-slate-50 text-slate-400 transition-all shrink-0 ${isCollapsed ? 'mx-auto py-4 mt-2' : ''}`}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        {!isCollapsed && onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-slate-50 rounded-xl"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          if (item.private && !profile.authenticated) return null;
          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <div key={item.id} className="flex flex-col">
              <button
                onClick={() => {
                  setView(item.id);
                  if (!item.subItems && onClose) onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
                  isActive || (item.subItems && item.subItems.some(sub => currentView === sub.id))
                    ? 'text-white shadow-lg' 
                    : 'text-slate-500 hover:bg-slate-50'
                } ${isCollapsed ? 'justify-center' : ''}`}
                style={{ 
                  backgroundColor: isActive || (item.subItems && item.subItems.some(sub => currentView === sub.id)) ? theme.primary : '', 
                  color: isActive || (item.subItems && item.subItems.some(sub => currentView === sub.id)) ? 'white' : ''
                }}
              >
                <Icon size={18} className={(isActive || (item.subItems && item.subItems.some(sub => currentView === sub.id))) ? '' : 'text-slate-400 group-hover:text-slate-900'} />
                {!isCollapsed && (
                  <span className="font-bold text-sm tracking-tight">
                    {item.label}
                  </span>
                )}
                {/* Tooltip on collapsed */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-50">
                    {item.label}
                  </div>
                )}
                {!isCollapsed && item.id === 'aftermaplus' && profile.membershipPlan === 'plus' && 
                  <Star size={12} fill="currentColor" className="ml-auto text-amber-300" />
                }
              </button>
              
              {!isCollapsed && item.subItems && (
                <div className="flex flex-col ml-8 mt-1 space-y-1">
                  {item.subItems.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setView(sub.id);
                        if (onClose) onClose();
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                        currentView === sub.id ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-50 space-y-2">
        {!profile.authenticated && (
          <button 
            onClick={() => { if (onOpenLocation) onOpenLocation(); if (onClose) onClose(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all text-sm font-bold ${isCollapsed ? 'justify-center' : ''}`}
          >
            <MapPin size={18} />
            {!isCollapsed && <span>Nearby Care</span>}
          </button>
        )}
        {profile.authenticated && (
          <button 
            onClick={logout}
            className={`w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all text-sm font-bold ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={18} />
            {!isCollapsed && <span>{t.common.signOut}</span>}
          </button>
        )}
      </div>
    </div>
  );
};

export default Navigation;

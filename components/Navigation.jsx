
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
    <div className="bg-slate-100 w-full flex items-center border-b border-slate-200 shadow-sm relative z-40 overflow-x-auto scrollbar-hide">
      <nav className="flex flex-1 items-center justify-center px-4 py-2 gap-2">
        {navItems.map((item) => {
          if (item.private && !profile.authenticated) return null;
          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <div key={item.id} className="flex-shrink-0 relative group">
              <button
                onClick={() => {
                  setView(item.id);
                  if (!item.subItems && onClose) onClose();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                  isActive || (item.subItems && item.subItems.some(sub => currentView === sub.id))
                    ? 'text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-200/50'
                }`}
                style={{ 
                  backgroundColor: isActive || (item.subItems && item.subItems.some(sub => currentView === sub.id)) ? theme.primary : '', 
                  color: isActive || (item.subItems && item.subItems.some(sub => currentView === sub.id)) ? 'white' : ''
                }}
              >
                <Icon size={16} className={(isActive || (item.subItems && item.subItems.some(sub => currentView === sub.id))) ? '' : 'text-amber-500 group-hover:text-slate-900'} />
                <span className="font-semibold text-sm tracking-tight whitespace-nowrap">
                  {item.label}
                </span>
                {item.id === 'aftermaplus' && profile.membershipPlan === 'plus' && 
                  <Star size={12} fill="currentColor" className="ml-1 text-amber-300" />
                }
              </button>
              
              {/* Optional sub-items dropdown (if ever needed in horizontal layout) */}
              {item.subItems && (
                <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-xl py-2 hidden group-hover:flex flex-col min-w-[150px] z-50">
                  {item.subItems.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        setView(sub.id);
                        if (onClose) onClose();
                      }}
                      className={`text-left px-4 py-2 text-xs font-bold transition-all ${
                        currentView === sub.id ? 'bg-slate-50 text-slate-900' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
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

      <div className="flex items-center px-4 gap-2 flex-shrink-0">
        {!profile.authenticated && (
          <button 
            onClick={() => { if (onOpenLocation) onOpenLocation(); if (onClose) onClose(); }}
            className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all text-sm font-bold whitespace-nowrap"
          >
            <MapPin size={16} />
            <span>Nearby Care</span>
          </button>
        )}
        {profile.authenticated && (
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all text-sm font-bold whitespace-nowrap"
          >
            <LogOut size={16} />
            <span>{t.common.signOut}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Navigation;

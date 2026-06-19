import React, { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';
import { Search, Home, Activity, Droplet, Coffee, Stethoscope, ShoppingBag, Utensils, BookOpen, Settings, ChevronRight, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DESTINATIONS = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Home, overview, main landing page',
    keywords: ['dashboard', 'home', 'overview', 'main', 'landing'],
    icon: Home,
    path: '/dashboard'
  },
  {
    id: 'care-journey',
    title: 'Care Journey',
    description: 'Your recovery and healing path',
    keywords: ['care', 'journey', 'recovery', 'healing', 'recovery plan', 'recovery path', 'healing path'],
    icon: Activity,
    path: '/carejourney'
  },
  {
    id: 'period-log',
    title: 'Period Log',
    description: 'Track cycle information',
    keywords: ['period', 'cycle', 'menstrual', 'bleeding', 'period log', 'cycle log', 'flow tracking'],
    icon: Droplet,
    path: '/carejourney' // Handled by navigating to carejourney which displays period log
  },
  {
    id: 'lactation-log',
    title: 'Lactation Log',
    description: 'Feeding and nursing information',
    keywords: ['feeding', 'breastfeeding', 'milk', 'lactation', 'feed log', 'nursing', 'baby feed'],
    icon: Coffee,
    path: '/lactationlogs'
  },
  {
    id: 'health-summary',
    title: 'Health Summary',
    description: 'Analytics, statistics and progress',
    keywords: ['health', 'report', 'analytics', 'summary', 'statistics', 'progress', 'insights'],
    icon: Activity,
    path: '/healthsummary'
  },
  {
    id: 'mental-wellness',
    title: 'Mental Wellness',
    description: 'Stress, anxiety, mood and emotions',
    keywords: ['mental', 'stress', 'anxiety', 'mood', 'depression', 'wellness', 'emotions'],
    icon: Heart,
    path: '/mentalwellness'
  },
  {
    id: 'care-connect',
    title: 'Care Connect',
    description: 'Find specialists and doctors',
    keywords: ['doctor', 'expert', 'gynecologist', 'consultation', 'specialist', 'appointment', 'community'],
    icon: Stethoscope,
    path: '/careconnect'
  },
  {
    id: 'momkart',
    title: 'MomKart',
    description: 'Nutrition, products and recovery essentials',
    keywords: ['food', 'diet', 'nutrition', 'meal', 'recipes', 'shopping', 'buy', 'products', 'supplements', 'store', 'marketplace'],
    icon: ShoppingBag,
    path: '/momkart'
  },
  {
    id: 'safe-recipes',
    title: 'Safe Recipes',
    description: 'Clinically safe recipes',
    keywords: ['recipe', 'food ideas', 'healthy food', 'meal plan', 'cooking'],
    icon: Utensils,
    path: '/recipes'
  },
  {
    id: 'learning-center',
    title: 'Learning Center',
    description: 'Guides, tutorials and education',
    keywords: ['guide', 'learn', 'tutorial', 'article', 'resource', 'education', 'video'],
    icon: BookOpen,
    path: '/education'
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Preferences, theme, and account',
    keywords: ['setting', 'profile', 'account', 'theme', 'appearance', 'preferences'],
    icon: Settings,
    path: '/settings'
  }
];

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Create Fuse instance with memoization to avoid recreation
  const fuseRef = useRef(new Fuse(DESTINATIONS, {
    keys: ['title', 'description', 'keywords'],
    threshold: 0.4,
    includeScore: true
  }));

  const results = query ? fuseRef.current.search(query).map(r => r.item) : DESTINATIONS;

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results.length > 0) {
      handleSelect(results[selectedIndex]);
    }
  };

  const handleSelect = (destination) => {
    onClose();
    navigate(destination.path);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-slate-100">
          <Search className="text-slate-400" size={20} />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent border-none px-4 py-4 text-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            placeholder="Search for tools, guides, or help..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
            ESC
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length > 0 ? (
            <div className="space-y-1">
              {results.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;
                
                return (
                  <div 
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors ${isSelected ? 'bg-pink-50' : 'hover:bg-slate-50'}`}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-500'}`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-bold truncate ${isSelected ? 'text-pink-700' : 'text-slate-700'}`}>
                        {item.title}
                      </h4>
                      <p className={`text-xs truncate ${isSelected ? 'text-pink-500/80' : 'text-slate-500'}`}>
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight size={16} className={isSelected ? 'text-pink-400' : 'text-slate-300'} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-slate-500 mb-4">We couldn't find an exact match.</p>
              <div className="text-sm font-medium text-slate-400 mb-2">Try:</div>
              <div className="flex flex-wrap justify-center gap-2">
                {['nutrition', 'doctor', 'recovery', 'mood', 'recipe'].map(term => (
                  <button 
                    key={term} 
                    className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-xs font-bold"
                    onClick={() => { setQuery(term); inputRef.current?.focus(); }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-100 px-4 py-3 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><kbd className="bg-white border border-slate-200 rounded px-1 shadow-sm font-sans">↑↓</kbd> to navigate</span>
            <span className="flex items-center gap-1"><kbd className="bg-white border border-slate-200 rounded px-1 shadow-sm font-sans">Enter</kbd> to select</span>
          </div>
          <div className="text-[10px] tracking-wider uppercase font-bold text-slate-400">
            Intelligent Search
          </div>
        </div>
      </div>
    </div>
  );
}

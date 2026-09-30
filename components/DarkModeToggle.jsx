import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check local storage or system preference on mount
    const savedTheme = localStorage.getItem('afterma_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('afterma_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('afterma_theme', 'light');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="relative flex items-center justify-center h-8 w-14 lg:h-9 lg:w-16 rounded-full bg-slate-100 dark:bg-slate-800 shadow-inner border border-slate-200 dark:border-slate-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 overflow-hidden group"
    >
      <div 
        className={`absolute h-6 w-6 lg:h-7 lg:w-7 rounded-full bg-white shadow-md flex items-center justify-center transition-all duration-300 ease-in-out z-10 ${isDark ? 'translate-x-3 lg:translate-x-3.5 bg-slate-700' : '-translate-x-3 lg:-translate-x-3.5'}`}
      >
        {isDark ? (
          <Moon size={12} className="text-blue-300" />
        ) : (
          <Sun size={12} className="text-amber-500" />
        )}
      </div>
      <div className="absolute inset-0 flex justify-between items-center px-1.5 lg:px-2 opacity-50 dark:opacity-40">
        <Moon size={12} className="text-slate-400 dark:text-blue-300" />
        <Sun size={12} className="text-amber-500 dark:text-slate-400" />
      </div>
    </button>
  );
};

export default DarkModeToggle;

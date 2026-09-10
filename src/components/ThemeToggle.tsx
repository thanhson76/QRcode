import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export type ThemeMode = 'light' | 'dark';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('vietqr_theme') as ThemeMode | null;
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    try {
      localStorage.setItem('vietqr_theme', theme);
    } catch {
      // Ignore
    }
  }, [theme]);

  return (
    <div
      id="theme-toggle-group"
      className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs"
      role="radiogroup"
      aria-label="Chế độ giao diện sáng hoặc tối"
    >
      <button
        id="theme-btn-light"
        type="button"
        role="radio"
        aria-checked={theme === 'light'}
        onClick={() => setTheme('light')}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
          theme === 'light'
            ? 'bg-white text-amber-600 shadow-xs ring-1 ring-slate-200/60'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
        title="Giao diện Sáng"
      >
        <Sun className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-500 fill-amber-500/20' : ''}`} />
        <span className="hidden xs:inline sm:inline">Sáng</span>
      </button>

      <button
        id="theme-btn-dark"
        type="button"
        role="radio"
        aria-checked={theme === 'dark'}
        onClick={() => setTheme('dark')}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
          theme === 'dark'
            ? 'bg-slate-900 text-sky-400 shadow-xs ring-1 ring-slate-700'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        }`}
        title="Giao diện Tối"
      >
        <Moon className={`w-3.5 h-3.5 ${theme === 'dark' ? 'text-sky-400 fill-sky-400/20' : ''}`} />
        <span className="hidden xs:inline sm:inline">Tối</span>
      </button>
    </div>
  );
};

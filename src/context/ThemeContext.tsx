import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ThemePreference } from '../../shared/types';

interface ThemeContextType {
  /** Choix du visiteur (null = pas de choix, on suit le réglage du site puis le système). */
  preference: ThemePreference;
  resolved: 'light' | 'dark';
  setPreference: (p: ThemePreference) => void;
  /** Thème par défaut défini dans le tableau de bord. */
  setSiteDefault: (p: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const media = () => window.matchMedia('(prefers-color-scheme: dark)');

function readStored(): ThemePreference | null {
  try {
    const v = localStorage.getItem('theme');
    return v === 'light' || v === 'dark' || v === 'system' ? v : null;
  } catch {
    return null;
  }
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stored, setStored] = useState<ThemePreference | null>(readStored);
  const [siteDefault, setSiteDefault] = useState<ThemePreference>('light');
  const [systemDark, setSystemDark] = useState(() => media().matches);

  useEffect(() => {
    const m = media();
    const onChange = () => setSystemDark(m.matches);
    m.addEventListener('change', onChange);
    return () => m.removeEventListener('change', onChange);
  }, []);

  const preference = stored ?? siteDefault;
  const resolved = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolved === 'dark');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'dark' ? '#06142d' : '#ffffff');
  }, [resolved]);

  const setPreference = (p: ThemePreference) => {
    setStored(p);
    try {
      localStorage.setItem('theme', p);
    } catch {
      /* ignore */
    }
  };

  return (
    <ThemeContext.Provider value={{ preference, resolved, setPreference, setSiteDefault }}>{children}</ThemeContext.Provider>
  );
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

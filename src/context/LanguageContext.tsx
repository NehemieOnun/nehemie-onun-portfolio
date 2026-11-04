import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { L10n, L10nList, Language } from '../../shared/types';
import { tr, trList } from '../../shared/utils';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  /** Texte d'interface : t('Bonjour', 'Hello') */
  t: (fr: string, en: string) => string;
  /** Contenu bilingue : l(project.description) */
  l: (value: L10n | undefined) => string;
  ll: (value: L10nList | undefined) => string[];
  /** Applique la langue par défaut du site si le visiteur n'a encore rien choisi. */
  applySiteDefault: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function storedLanguage(): Language | null {
  try {
    const saved = localStorage.getItem('language');
    if (saved === 'fr' || saved === 'en') return saved;
  } catch {
    /* stockage indisponible */
  }
  return null;
}

function initialLanguage(): Language {
  return storedLanguage() ?? 'fr';
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const [chosen, setChosen] = useState(() => storedLanguage() !== null);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  // Seul un choix explicite du visiteur est mémorisé.
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    setChosen(true);
    try {
      localStorage.setItem('language', lang);
    } catch {
      /* ignore */
    }
  }, []);

  const applySiteDefault = useCallback(
    (lang: Language) => {
      if (!chosen) setLanguageState(lang);
    },
    [chosen]
  );

  const t = useCallback((fr: string, en: string) => (language === 'fr' ? fr : en), [language]);
  const l = useCallback((v: L10n | undefined) => tr(v, language), [language]);
  const ll = useCallback((v: L10nList | undefined) => trList(v, language), [language]);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, toggleLanguage: () => setLanguage(language === 'fr' ? 'en' : 'fr'), t, l, ll, applySiteDefault }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

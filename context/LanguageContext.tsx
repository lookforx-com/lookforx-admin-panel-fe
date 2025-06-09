'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import trTranslations from '@/locales/tr.json';
import enTranslations from '@/locales/en.json';

type Locale = 'tr' | 'en';
type Translations = typeof trTranslations;

interface LanguageContextType {
  locale: Locale;
  translations: Translations;
  changeLanguage: (locale: Locale) => void;
  t: (key: string) => string;
}

const defaultLanguage: Locale = 'tr';

const translations = {
  tr: trTranslations,
  en: enTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Locale>(defaultLanguage);

  useEffect(() => {
    // Browser tarafında çalıştığından emin olalım
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale | null;
      if (savedLocale && (savedLocale === 'tr' || savedLocale === 'en')) {
        setLocale(savedLocale);
      } else {
        // Tarayıcı dilini kontrol edelim
        const browserLang = navigator.language.split('-')[0];
        if (browserLang === 'tr') {
          setLocale('tr');
          localStorage.setItem('locale', 'tr');
        } else {
          // Varsayılan olarak İngilizce
          setLocale('en');
          localStorage.setItem('locale', 'en');
        }
      }
    }
  }, []);

  const changeLanguage = (newLocale: Locale) => {
    setLocale(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
      // Sayfayı yeniden yüklemeden dil değişikliğini uygulayalım
      document.documentElement.lang = newLocale;
    }
  };

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[locale];
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ locale, translations: translations[locale], changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
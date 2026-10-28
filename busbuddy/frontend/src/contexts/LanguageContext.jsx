import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '../translations/en.json';
import taTranslations from '../translations/ta.json';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('busbuddy_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('busbuddy_lang', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ta' : 'en'));
  };

  const t = (key) => {
    const translations = language === 'ta' ? taTranslations : enTranslations;
    return translations[key] || enTranslations[key] || key;
  };

  const getStopName = (stop) => {
    if (!stop) return '';
    if (language === 'ta' && stop.stopNameTa) {
      return stop.stopNameTa;
    }
    return stop.stopNameEn || stop.name || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, getStopName }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

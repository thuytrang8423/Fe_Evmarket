'use client';

import { useState, useEffect } from 'react';

type Locale = 'en' | 'vn';

interface Translation {
  [key: string]: any;
}

export const useI18n = () => {
  const [locale, setLocale] = useState<Locale>('en');
  const [translations, setTranslations] = useState<Translation>({});
  const [loading, setLoading] = useState(true);
  const [allTranslations, setAllTranslations] = useState<{ en: Translation; vn: Translation }>({ en: {}, vn: {} });

  // Load all translations at once
  useEffect(() => {
    const loadAllTranslations = async () => {
      try {
        setLoading(true);
        
        // Load both languages in parallel
        const [enModule, vnModule] = await Promise.all([
          import('@/locales/en.json'),
          import('@/locales/vn.json')
        ]);
        
        const allTrans = {
          en: enModule.default,
          vn: vnModule.default
        };
        
        setAllTranslations(allTrans);
        setTranslations(allTrans[locale]);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to empty object
        setTranslations({});
      } finally {
        setLoading(false);
      }
    };

    loadAllTranslations();
  }, []);

  // Update translations when locale changes
  useEffect(() => {
    if (allTranslations[locale]) {
      setTranslations(allTranslations[locale]);
    }
  }, [locale, allTranslations]);

  // Get translation function
  const t = (key: string, fallback?: string): string => {
    // Nếu đang loading và chưa có translations, return fallback hoặc empty string thay vì key
    if (loading || Object.keys(translations).length === 0) {
      return fallback || '';
    }
    
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return fallback || key;
      }
    }
    
    return typeof value === 'string' ? value : fallback || key;
  };

  // Change locale function
  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
    }
  };

  // Initialize locale from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale;
      if (savedLocale && (savedLocale === 'en' || savedLocale === 'vn')) {
        setLocale(savedLocale);
      }
    }
  }, []);

  return {
    locale,
    changeLocale,
    t,
    loading,
  };
};

export default useI18n;
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

  // Get translation function with English fallback when key missing
  const t = (key: string, fallback?: string): string => {
    // When loading or translations not ready, prefer fallback or empty string
    if (loading || Object.keys(translations).length === 0) {
      return fallback || '';
    }

    const resolveKey = (source: Translation, lookupKey: string): string | undefined => {
      const parts = lookupKey.split('.');
      let current: any = source;
      for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
          current = current[part];
        } else {
          return undefined;
        }
      }
      return typeof current === 'string' ? current : undefined;
    };

    // 1) Try current locale
    const fromCurrent = resolveKey(translations, key);
    if (fromCurrent !== undefined) return fromCurrent;

    // 2) Fallback to English if available
    const fromEnglish = resolveKey(allTranslations.en || {}, key);
    if (fromEnglish !== undefined) return fromEnglish;

    // 3) Last resort: provided fallback or empty string (avoid leaking keys to UI)
    return fallback || '';
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
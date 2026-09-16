import { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { updateDynamicMetadata } from '../utils/seo';

/**
 * Custom React Hook that automatically synchronizes document title,
 * OpenGraph, Twitter cards, canonical tags, and structured data with the active section and language.
 */
export function useDynamicSEO(activeSection: string) {
  const { language } = useLanguage();

  useEffect(() => {
    updateDynamicMetadata(activeSection, language);
  }, [activeSection, language]);
}

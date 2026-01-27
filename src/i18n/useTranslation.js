import { useContext } from 'react';
import { LanguageContext } from '../components/LanguageProvider';
import translations from './translations';

/**
 * Custom hook for accessing translations
 * Usage: const t = useTranslation();
 * Then: t('nav.home') returns 'Accueil'
 */
export const useTranslation = () => {
  const { language } = useContext(LanguageContext);

  /**
   * Get translation for a given key
   * Supports nested keys using dot notation
   * @param {string} key - Translation key (e.g., 'nav.home')
   * @param {object} params - Optional parameters for interpolation
   * @returns {string} Translated text
   */
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language] || translations['fr'];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation key does not resolve to string: ${key}`);
      return key;
    }

    // Simple parameter interpolation
    let result = value;
    Object.keys(params).forEach(param => {
      result = result.replace(`{${param}}`, params[param]);
    });

    return result;
  };

  /**
   * Format currency in MAD
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MA', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + ' DH';
  };

  /**
   * Format date in French
   * @param {Date|string} date - Date to format
   * @param {string} format - Format type ('short', 'long', 'time')
   * @returns {string} Formatted date
   */
  const formatDate = (date, format = 'short') => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    const options = {
      short: { day: '2-digit', month: '2-digit', year: 'numeric' },
      long: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
      time: { hour: '2-digit', minute: '2-digit' }
    };

    return new Intl.DateTimeFormat('fr-FR', options[format] || options.short).format(dateObj);
  };

  return { t, formatCurrency, formatDate, language };
};

export default useTranslation;

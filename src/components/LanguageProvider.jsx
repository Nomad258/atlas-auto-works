import React, { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

/**
 * Language Provider Component
 * Provides language context to the entire application
 * Currently supports French only as per requirements
 */
export const LanguageProvider = ({ children }) => {
  // Default to French (fr) as per project requirements
  const [language, setLanguage] = useState('fr');

  // Persist language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('atlas-language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('atlas-language', newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;

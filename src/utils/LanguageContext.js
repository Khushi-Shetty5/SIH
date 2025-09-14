import React, { createContext, useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';

export const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const stored = await FileSystem.readAsStringAsync(
          `${FileSystem.documentDirectory}pharmacy_language.txt`,
          { encoding: FileSystem.EncodingType.UTF8 }
        );
        if (stored) setLanguage(stored);
      } catch (e) {
        console.log('No language file found');
      }
    };
    loadLanguage();
  }, []);

  const changeLanguage = async (lang) => {
    setLanguage(lang);
    await FileSystem.writeAsStringAsync(
      `${FileSystem.documentDirectory}pharmacy_language.txt`,
      lang,
      { encoding: FileSystem.EncodingType.UTF8 }
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
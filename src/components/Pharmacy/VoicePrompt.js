import React, { useEffect } from 'react';
import * as Speech from 'expo-speech';

const VoicePrompt = ({ text, language }) => {
  useEffect(() => {
    const langCode = language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : 'en-US';
    Speech.speak(text, { language: langCode });
  }, [text, language]);

  return null;
};

export default VoicePrompt;
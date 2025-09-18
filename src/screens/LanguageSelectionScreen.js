import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Alert } from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../languageConstants';

const languages = [
  { name: 'English', display: 'English' },
  { name: 'Hindi', display: 'हिन्दी' },
  { name: 'Punjabi', display: 'ਪੰਜਾਬੀ' },
];

const LanguageSelectionScreen = ({ navigation }) => {
  const { translations, language, changeLanguage, ttsEnabled, setTtsEnabled } = useLanguage();
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);
  const [orientation, setOrientation] = useState(windowWidth > windowHeight ? 'landscape' : 'portrait');

  useEffect(() => {
    const updateDimensions = () => {
      const { width, height } = Dimensions.get('window');
      setWindowWidth(width);
      setWindowHeight(height);
      setOrientation(width > height ? 'landscape' : 'portrait');
    };
    const subscription = Dimensions.addEventListener('change', updateDimensions);
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    Speech.getAvailableVoicesAsync()
      .then((voices) => {
        console.log('Available TTS voices:', voices);
      })
      .catch((error) => {
        console.error('Error fetching voices:', error);
      });

    if (ttsEnabled) {
      const timeoutId = setTimeout(() => {
        playWelcomeMessage();
      }, 500);
      return () => clearTimeout(timeoutId);
    }

    return () => {
      Speech.stop();
    };
  }, [ttsEnabled, language]);

  const playWelcomeMessage = async () => {
    try {
      await Speech.stop();
      const preferredLang = language === 'English' ? 'en-US' : language === 'Hindi' ? 'hi-IN' : 'pa-IN';
      let speechLang = preferredLang;
      const availableVoices = await Speech.getAvailableVoicesAsync();
      const isLangSupported = availableVoices.some((voice) => voice.language === preferredLang || voice.language.includes(language.toLowerCase()));
      if (!isLangSupported) {
        speechLang = 'en-US';
        Alert.alert('Language Notice', `Voice for ${language} is not available. Using English voice.`, [{ text: 'OK' }]);
      }
      const welcomeText =
        translations[language]?.welcome_message || 'Welcome to MedKit! Select your preferred language to get started.';
      console.log('Speaking welcome message:', welcomeText, 'in language:', speechLang);
      await Speech.speak(welcomeText, {
        language: speechLang,
        pitch: 1.0,
        rate: 0.7,
        onStart: () => console.log('TTS started'),
        onDone: () => console.log('TTS finished'),
        onError: (error) => console.error('TTS Error:', error),
      });
    } catch (error) {
      console.error('TTS Error:', error);
      Alert.alert('Audio Error', 'Text-to-Speech failed. Ensure your device supports TTS.', [{ text: 'OK' }]);
    }
  };

  const speakLanguageConfirmation = async (lang) => {
    try {
      await Speech.stop();
      const preferredLang = lang === 'English' ? 'en-US' : lang === 'Hindi' ? 'hi-IN' : 'pa-IN';
      let speechLang = preferredLang;
      const availableVoices = await Speech.getAvailableVoicesAsync();
      const isLangSupported = availableVoices.some((voice) => voice.language === preferredLang);
      if (!isLangSupported) {
        speechLang = 'en-US';
      }
      const text = translations[lang]?.language_selected || `Selected language: ${lang}`;
      Speech.speak(text, {
        language: speechLang,
        pitch: 1.0,
        rate: 0.7,
        onError: (error) => console.error('TTS Error:', error),
      });
    } catch (error) {
      console.error('TTS Error:', error);
    }
  };

  const handleLanguageSelect = (lang) => {
    console.log('Language selected:', lang);
    changeLanguage(lang);
    if (ttsEnabled) {
      speakLanguageConfirmation(lang);
    }
  };

  const handleContinue = () => {
    console.log('Continuing to next screen');
    navigation.navigate('UserTypeSelection');
  };

  const toggleTts = () => {
    setTtsEnabled();
    const status = ttsEnabled ? 'tts_disabled' : 'tts_enabled';
    if (ttsEnabled) {
      Speech.stop();
    } else {
      const text = translations[language]?.[status] || `Voice assistance ${ttsEnabled ? 'disabled' : 'enabled'}`;
      Speech.speak(text, {
        language: language === 'English' ? 'en-US' : language === 'Hindi' ? 'hi-IN' : 'pa-IN',
        pitch: 1.0,
        rate: 0.7,
      });
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8fafc',
    },
    content: {
      flex: 1,
      paddingHorizontal: orientation === 'landscape' ? windowWidth * 0.1 : windowWidth * 0.06,
      paddingVertical: windowHeight * 0.02,
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: windowHeight * 0.04,
    },
    title: {
      fontSize: Math.min(windowHeight * 0.04, 32),
      fontWeight: 'bold',
      color: '#1e293b',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: Math.min(windowHeight * 0.022, 18),
      color: '#64748b',
      textAlign: 'center',
      lineHeight: Math.min(windowHeight * 0.03, 24),
      marginTop: 8,
    },
    languageContainer: {
      width: '100%',
      maxWidth: 400,
      alignItems: 'center',
      marginBottom: windowHeight * 0.04,
    },
    languageButton: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 24,
      marginVertical: 8,
      width: '100%',
      maxWidth: 300,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    selectedLanguageButton: {
      backgroundColor: '#3b82f6',
    },
    languageText: {
      fontSize: Math.min(windowHeight * 0.022, 18),
      color: '#1e293b',
      fontWeight: '500',
    },
    selectedLanguageText: {
      color: '#ffffff',
      fontWeight: '600',
    },
    ttsToggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      borderRadius: windowWidth * 0.03,
      padding: windowHeight * 0.015,
      marginVertical: windowHeight * 0.02,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      width: '100%',
      maxWidth: 300,
      alignSelf: 'center',
    },
    ttsToggleText: {
      fontSize: Math.min(windowHeight * 0.02, 16),
      color: '#1e293b',
      marginRight: windowWidth * 0.03,
      fontWeight: '500',
    },
    audioButton: {
      backgroundColor: '#10b981',
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 24,
      alignItems: 'center',
      marginVertical: 10,
      width: '100%',
      maxWidth: 300,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    audioButtonText: {
      color: '#ffffff',
      fontSize: Math.min(windowHeight * 0.022, 16),
      fontWeight: '600',
    },
    continueButton: {
      backgroundColor: '#3b82f6',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      width: '100%',
      maxWidth: 300,
      marginTop: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    continueButtonText: {
      color: '#ffffff',
      fontSize: Math.min(windowHeight * 0.024, 18),
      fontWeight: '600',
    },
  });

  const chooseLanguageText = translations[language]?.choose_language || 'Choose Language';
  const selectLanguageText = translations[language]?.select_preferred_language || 'Select your preferred language';
  const continueText = translations[language]?.continue || 'Continue';
  const ttsText = translations[language]?.tts_toggle || 'Voice Assistance';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{chooseLanguageText}</Text>
          <Text style={styles.subtitle}>{selectLanguageText}</Text>
        </View>

        <View style={styles.languageContainer}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.name}
              style={[styles.languageButton, language === lang.name && styles.selectedLanguageButton]}
              onPress={() => handleLanguageSelect(lang.name)}
              activeOpacity={0.7}
            >
              <Text style={[styles.languageText, language === lang.name && styles.selectedLanguageText]}>
                {lang.display}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.ttsToggleContainer}>
          <Text style={styles.ttsToggleText}>
            {ttsText} ({ttsEnabled ? translations[language]?.tts_enabled || 'On' : translations[language]?.tts_disabled || 'Off'})
          </Text>
          <TouchableOpacity onPress={toggleTts} style={{ padding: 8 }}>
            <Ionicons
              name={ttsEnabled ? 'volume-high-outline' : 'volume-mute-outline'}
              size={windowHeight * 0.025}
              color="#3b82f6"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.audioButton} onPress={playWelcomeMessage} activeOpacity={0.7}>
          <Text style={styles.audioButtonText}>
            {translations[language]?.play_welcome || '🔊 Play Welcome Message'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.7}>
          <Text style={styles.continueButtonText}>{continueText} →</Text>
        </TouchableOpacity>

        {__DEV__ && (
          <Text style={{ fontSize: 12, color: '#64748b', marginTop: 20 }}>
            Debug: Language = {language}, TTS = {ttsEnabled ? 'On' : 'Off'}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default LanguageSelectionScreen;
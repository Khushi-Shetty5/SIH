import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, Alert, Switch } from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../languageConstants';

const languages = [
  { name: 'English', display: 'English' },
  { name: 'Hindi', display: 'हिन्दी' },
  { name: 'Punjabi', display: 'ਪੰਜਾਬੀ' },
];

const LanguageSelectionScreen = ({ navigation }) => {
  const { translations, language, setLanguage, ttsEnabled, setTtsEnabled } = useLanguage();
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
    // Log available voices for debugging
    Speech.getAvailableVoicesAsync().then((voices) => {
      console.log('Available TTS voices in Expo Go:', voices);
    }).catch((error) => {
      console.error('Error fetching voices:', error);
    });

    // Stop speech on component unmount
    return () => {
      Speech.stop();
    };
  }, []);

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
  };

  const handleContinue = () => {
    navigation.navigate('Signin');
  };

  const playWelcomeMessage = async () => {
    try {
      await Speech.stop();
      const preferredLang = language === 'English' ? 'en-US' : language === 'Hindi' ? 'hi-IN' : 'pa-IN';
      let speechLang = preferredLang;

      const availableVoices = await Speech.getAvailableVoicesAsync();
      const isLangSupported = availableVoices.some((voice) => voice.language === preferredLang);

      if (!isLangSupported) {
        console.warn(`Language ${preferredLang} not supported, falling back to en-US`);
        speechLang = 'en-US';
        Alert.alert(
          'Language Not Supported',
          `Text-to-Speech for ${language} is not available in Expo Go. Using English as fallback.`,
          [{ text: 'OK' }]
        );
      }

      Speech.speak(translations[language].welcome_message, {
        language: speechLang,
        pitch: 1.0,
        rate: 0.5,
        onError: (error) => {
          console.error('Speech Error:', error);
          Alert.alert(
            'Audio Error',
            'Failed to play audio. Please check your device settings or try again.',
            [{ text: 'OK' }]
          );
        },
      });
    } catch (error) {
      console.error('TTS Error:', error);
      Alert.alert(
        'Audio Error',
        'Text-to-Speech failed to initialize. Ensure your device supports TTS and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const toggleTts = () => {
    setTtsEnabled(!ttsEnabled);
    if (!ttsEnabled) {
      // Play a confirmation message when enabling TTS
      Speech.speak(
        translations[language].tts_toggle + ' enabled',
        {
          language: language === 'English' ? 'en-US' : language === 'Hindi' ? 'hi-IN' : 'en-US',
          pitch: 1.0,
          rate: 0.5,
        }
      );
    } else {
      Speech.stop(); // Stop any ongoing speech when disabling
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
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: windowHeight * 0.06,
    },
    title: {
      fontSize: windowHeight * 0.04,
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: windowHeight * 0.01,
    },
    subtitle: {
      fontSize: windowHeight * 0.022,
      color: '#64748b',
    },
    languageContainer: {
      width: windowWidth * 0.9,
      marginBottom: windowHeight * 0.04,
      flexDirection: orientation === 'landscape' ? 'row' : 'column',
      flexWrap: orientation === 'landscape' ? 'wrap' : 'nowrap',
      justifyContent: orientation === 'landscape' ? 'space-between' : 'center',
    },
    languageButton: {
      backgroundColor: '#ffffff',
      borderRadius: windowWidth * 0.03,
      paddingVertical: windowHeight * 0.02,
      marginBottom: windowHeight * 0.02,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: windowHeight * 0.001 },
      shadowOpacity: 0.05,
      shadowRadius: windowWidth * 0.005,
      elevation: 1,
      width: orientation === 'landscape' ? windowWidth * 0.42 : windowWidth * 0.9,
    },
    selectedLanguageButton: {
      backgroundColor: '#3b82f6',
    },
    languageText: {
      fontSize: windowHeight * 0.022,
      color: '#1e293b',
    },
    selectedLanguageText: {
      color: '#ffffff',
      fontWeight: '600',
    },
    continueButton: {
      backgroundColor: '#3b82f6',
      borderRadius: windowWidth * 0.03,
      paddingVertical: windowHeight * 0.02,
      alignItems: 'center',
      width: windowWidth * 0.9,
      marginTop: windowHeight * 0.02,
    },
    continueButtonText: {
      color: '#ffffff',
      fontSize: windowHeight * 0.022,
      fontWeight: '600',
    },
    audioButton: {
      marginTop: windowHeight * 0.02,
      padding: windowWidth * 0.03,
      backgroundColor: '#10b981',
      borderRadius: windowWidth * 0.03,
      alignItems: 'center',
    },
    audioButtonText: {
      color: '#ffffff',
      fontSize: windowHeight * 0.018,
      fontWeight: '600',
    },
    ttsToggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: windowHeight * 0.02,
      marginBottom: windowHeight * 0.02,
    },
    ttsToggleText: {
      fontSize: windowHeight * 0.018,
      color: '#1e293b',
      marginRight: windowWidth * 0.02,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{translations[language].choose_language}</Text>
          <Text style={styles.subtitle}>{translations[language].select_preferred_language}</Text>
        </View>

        <View style={styles.languageContainer}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.name}
              style={[
                styles.languageButton,
                language === lang.name && styles.selectedLanguageButton,
              ]}
              onPress={() => handleLanguageSelect(lang.name)}
            >
              <Text
                style={[
                  styles.languageText,
                  language === lang.name && styles.selectedLanguageText,
                ]}
              >
                {lang.display}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.ttsToggleContainer}>
          <Text style={styles.ttsToggleText}>{translations[language].tts_toggle}</Text>
          <Switch
            value={ttsEnabled}
            onValueChange={toggleTts}
            trackColor={{ false: '#64748b', true: '#3b82f6' }}
            thumbColor={ttsEnabled ? '#ffffff' : '#f8fafc'}
          />
        </View>

        <TouchableOpacity style={styles.audioButton} onPress={playWelcomeMessage}>
          <Text style={styles.audioButtonText}>Play Welcome Message</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>{translations[language].continue}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LanguageSelectionScreen;
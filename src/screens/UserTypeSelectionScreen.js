import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../languageConstants';

const userTypes = [
  { name: 'Patient', display: 'Patient', screen: 'Signin' },
  { name: 'Doctor', display: 'Doctor', screen: 'DoctorSignin' }, // Update 'DoctorSignin' to your actual doctor screen
];

const UserTypeSelectionScreen = ({ navigation }) => {
  const { translations, language, ttsEnabled } = useLanguage();
  const [selectedUserType, setSelectedUserType] = useState('');
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
    if (ttsEnabled) {
      playScreenText();
    }
    return () => {
      Speech.stop();
    };
  }, [ttsEnabled, language]);

  const playScreenText = async () => {
    try {
      await Speech.stop();
      const preferredLang = language === 'English' ? 'en-US' : language === 'Hindi' ? 'hi-IN' : 'pa-IN';
      let speechLang = preferredLang;
      const availableVoices = await Speech.getAvailableVoicesAsync();
      const isLangSupported = availableVoices.some((voice) => voice.language === preferredLang);
      if (!isLangSupported) {
        speechLang = 'en-US';
      }
      const textToSpeak = `${translations[language].select_user_type}. ${translations[language].choose_user_type_prompt}.`;
      Speech.speak(textToSpeak, { language: speechLang, pitch: 1.0, rate: 0.5 });
    } catch (error) {
      console.error('TTS Error:', error);
    }
  };

  const playText = async (text) => {
    if (!ttsEnabled) return;
    try {
      await Speech.stop();
      const preferredLang = language === 'English' ? 'en-US' : language === 'Hindi' ? 'hi-IN' : 'pa-IN';
      let speechLang = preferredLang;
      const availableVoices = await Speech.getAvailableVoicesAsync();
      const isLangSupported = availableVoices.some((voice) => voice.language === preferredLang);
      if (!isLangSupported) {
        speechLang = 'en-US';
      }
      Speech.speak(text, { language: speechLang, pitch: 1.0, rate: 0.5 });
    } catch (error) {
      console.error('TTS Error:', error);
    }
  };

  const handleUserTypeSelect = (userType) => {
    setSelectedUserType(userType.name);
    navigation.navigate(userType.screen);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8fafc',
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: orientation === 'landscape' ? windowWidth * 0.1 : windowWidth * 0.06,
      paddingVertical: windowHeight * 0.02,
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
    userTypeContainer: {
      width: windowWidth * 0.9,
      marginBottom: windowHeight * 0.04,
      flexDirection: orientation === 'landscape' ? 'row' : 'column',
      flexWrap: orientation === 'landscape' ? 'wrap' : 'nowrap',
      justifyContent: orientation === 'landscape' ? 'space-between' : 'center',
    },
    userTypeButton: {
      backgroundColor: '#ffffff',
      borderRadius: windowWidth * 0.03,
      paddingVertical: windowHeight * 0.025,
      paddingHorizontal: windowWidth * 0.1,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: windowHeight * 0.02,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: windowHeight * 0.001 },
      shadowOpacity: 0.05,
      shadowRadius: windowWidth * 0.005,
      elevation: 2,
      width: orientation === 'landscape' ? windowWidth * 0.42 : windowWidth * 0.9,
      minHeight: windowHeight * 0.08, // Ensure buttons are large
    },
    selectedUserTypeButton: {
      backgroundColor: '#3b82f6',
    },
    userTypeText: {
      fontSize: windowHeight * 0.024,
      color: '#1e293b',
      fontWeight: '600',
    },
    selectedUserTypeText: {
      color: '#ffffff',
    },
    ttsButton: {
      marginLeft: windowWidth * 0.02,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.title}>{translations[language].select_user_type || 'Select User Type'}</Text>
            {ttsEnabled && (
              <TouchableOpacity
                style={styles.ttsButton}
                onPress={() => playText(translations[language].select_user_type || 'Select User Type')}
              >
                <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.subtitle}>{translations[language].choose_user_type_prompt || 'Are you a patient or a doctor?'}</Text>
            {ttsEnabled && (
              <TouchableOpacity
                style={styles.ttsButton}
                onPress={() => playText(translations[language].choose_user_type_prompt || 'Are you a patient or a doctor?')}
              >
                <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.userTypeContainer}>
          {userTypes.map((userType) => (
            <View key={userType.name} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  selectedUserType === userType.name && styles.selectedUserTypeButton,
                ]}
                onPress={() => handleUserTypeSelect(userType)}
              >
                <Text
                  style={[
                    styles.userTypeText,
                    selectedUserType === userType.name && styles.selectedUserTypeText,
                  ]}
                >
                  {translations[language][userType.name.toLowerCase()] || userType.display}
                </Text>
              </TouchableOpacity>
              {ttsEnabled && (
                <TouchableOpacity
                  style={styles.ttsButton}
                  onPress={() => playText(translations[language][userType.name.toLowerCase()] || userType.display)}
                >
                  <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserTypeSelectionScreen;
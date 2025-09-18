import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Dimensions, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../languageConstants';

const BACKEND_URL = 'http://192.168.118.168:3000';

const SignInScreen = ({ navigation }) => {
  const { translations, language, ttsEnabled, setTtsEnabled } = useLanguage();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
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
        Alert.alert('Language Notice', `Voice for ${language} not available. Using English voice.`, [{ text: 'OK' }]);
      }
      const textToSpeak = `${translations[language]?.medkit || 'MedKit'}. ${translations[language]?.sign_in_to_continue || 'Sign in to continue'}.`;
      Speech.speak(textToSpeak, {
        language: speechLang,
        pitch: 1.0,
        rate: 0.7,
        onError: (error) => console.error('TTS Error:', error),
      });
    } catch (error) {
      console.error('TTS Error:', error);
      Alert.alert('Audio Error', 'Text-to-Speech failed. Ensure your device supports TTS.', [{ text: 'OK' }]);
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

  const handleToggleTts = () => {
    setTtsEnabled();
    const status = ttsEnabled ? 'tts_disabled' : 'tts_enabled';
    playText(translations[language]?.[status] || `Voice assistance ${ttsEnabled ? 'disabled' : 'enabled'}`);
  };

  const handleSignIn = async () => {
    if (!phone || !name.trim()) {
      Alert.alert(
        translations[language]?.error || 'Error',
        translations[language]?.signin_error || 'Please enter both name and phone number'
      );
      return;
    }

    let fullPhone = phone.trim();
    if (!fullPhone.startsWith('+')) {
      fullPhone = `+91${fullPhone}`;
    } else if (!fullPhone.startsWith('+91') && fullPhone.length === 10) {
      fullPhone = `+91${fullPhone}`;
    }

    try {
      console.log('Attempting signin with phone:', fullPhone, 'and name:', name);
      const response = await fetch(`${BACKEND_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone, name: name.trim() }),
      });
      const data = await response.json();
      console.log('Signin response:', data);
      
      if (response.ok && data.patientId) {
        await AsyncStorage.setItem('patientId', data.patientId);
        if (ttsEnabled) {
          playText(translations[language]?.signin_success || 'Signed in successfully');
        }
        navigation.replace('Dashboard', { patientId: data.patientId });
      } else {
        Alert.alert(
          translations[language]?.error || 'Error',
          data.error || translations[language]?.signin_error || 'Sign-in failed: Invalid credentials'
        );
      }
    } catch (error) {
      console.error('Signin error:', error);
      Alert.alert(
        translations[language]?.error || 'Error',
        translations[language]?.network_error || 'Failed to sign in. Check your network connection.'
      );
    }
  };

  const medkitText = translations[language]?.medkit || 'MedKit';
  const signInToContinueText = translations[language]?.sign_in_to_continue || 'Sign in to continue';
  const namePlaceholderText = translations[language]?.name_placeholder || 'Name';
  const phonePlaceholderText = translations[language]?.contact_placeholder || 'Phone Number';
  const signInText = translations[language]?.sign_in || 'Sign In';
  const noAccountText = translations[language]?.no_account || "Don't have an account?";
  const signUpLinkText = translations[language]?.sign_up_link || 'Sign Up';

  // Define styles inside component to ensure access to windowWidth and windowHeight
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8fafc',
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: orientation === 'landscape' ? windowWidth * 0.15 : windowWidth * 0.1,
      paddingVertical: windowHeight * 0.03,
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: windowHeight * 0.05,
      width: '100%',
    },
    title: {
      fontSize: Math.min(windowHeight * 0.045, 34),
      fontWeight: '700',
      color: '#1e293b',
      textAlign: 'center',
    },
    subtitle: {
      fontSize: Math.min(windowHeight * 0.025, 20),
      color: '#64748b',
      textAlign: 'center',
      lineHeight: Math.min(windowHeight * 0.035, 26),
      marginTop: 10,
    },
    form: {
      width: '100%',
      maxWidth: Math.min(windowWidth * 0.85, 400),
      alignItems: 'center',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
      width: '100%',
      minHeight: windowHeight * 0.07,
    },
    inputIcon: {
      marginRight: 12,
      fontSize: Math.min(windowHeight * 0.03, 22),
      color: '#64748b',
    },
    input: {
      flex: 1,
      fontSize: Math.min(windowHeight * 0.022, 18),
      color: '#1e293b',
      paddingVertical: 10,
    },
    signinButton: {
      backgroundColor: '#3b82f6',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      width: '100%',
      maxWidth: 400,
      marginTop: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    signinButtonText: {
      color: '#ffffff',
      fontSize: Math.min(windowHeight * 0.024, 20),
      fontWeight: '600',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 24,
      marginBottom: windowHeight * 0.04,
      flexWrap: 'wrap',
    },
    footerText: {
      color: '#64748b',
      fontSize: Math.min(windowHeight * 0.02, 16),
      textAlign: 'center',
    },
    signupLink: {
      color: '#3b82f6',
      fontSize: Math.min(windowHeight * 0.02, 16),
      fontWeight: '600',
      marginLeft: 8,
    },
    ttsButton: {
      marginLeft: 12,
      padding: 8,
    },
    ttsToggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 12,
      marginVertical: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
      width: '100%',
      maxWidth: 400,
    },
    ttsToggleText: {
      fontSize: Math.min(windowHeight * 0.022, 18),
      color: '#1e293b',
      marginRight: 12,
      fontWeight: '500',
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.title}>{medkitText}</Text>
            {ttsEnabled && (
              <TouchableOpacity style={styles.ttsButton} onPress={() => playText(medkitText)}>
                <Ionicons name="volume-high-outline" size={Math.min(windowHeight * 0.03, 24)} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.subtitle}>{signInToContinueText}</Text>
            {ttsEnabled && (
              <TouchableOpacity style={styles.ttsButton} onPress={() => playText(signInToContinueText)}>
                <Ionicons name="volume-high-outline" size={Math.min(windowHeight * 0.03, 24)} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.ttsToggleContainer}>
            <Text style={styles.ttsToggleText}>
              {translations[language]?.tts_toggle || 'Voice Assistance'} (
              {ttsEnabled ? translations[language]?.tts_enabled || 'On' : translations[language]?.tts_disabled || 'Off'})
            </Text>
            <TouchableOpacity onPress={handleToggleTts} style={{ padding: 10 }}>
              <Ionicons
                name={ttsEnabled ? 'volume-high-outline' : 'volume-mute-outline'}
                size={Math.min(windowHeight * 0.03, 24)}
                color="#3b82f6"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={Math.min(windowHeight * 0.03, 22)} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={namePlaceholderText}
              value={name}
              onChangeText={setName}
              placeholderTextColor="#9ca3af"
            />
            {ttsEnabled && (
              <TouchableOpacity style={styles.ttsButton} onPress={() => playText(namePlaceholderText)}>
                <Ionicons name="volume-high-outline" size={Math.min(windowHeight * 0.03, 24)} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={Math.min(windowHeight * 0.03, 22)} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={phonePlaceholderText}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor="#9ca3af"
            />
            {ttsEnabled && (
              <TouchableOpacity style={styles.ttsButton} onPress={() => playText(phonePlaceholderText)}>
                <Ionicons name="volume-high-outline" size={Math.min(windowHeight * 0.03, 24)} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.signinButton} onPress={handleSignIn}>
            <Text style={styles.signinButtonText}>{signInText}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{noAccountText}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>{signUpLinkText}</Text>
          </TouchableOpacity>
          {ttsEnabled && (
            <TouchableOpacity style={styles.ttsButton} onPress={() => playText(`${noAccountText} ${signUpLinkText}`)}>
              <Ionicons name="volume-high-outline" size={Math.min(windowHeight * 0.022, 18)} color="#3b82f6" />
            </TouchableOpacity>
          )}
        </View>

        {__DEV__ && (
          <View style={{ marginTop: 20, padding: 10, backgroundColor: '#f0f9ff', borderRadius: 8 }}>
            <Text style={{ fontSize: 12, color: '#64748b' }}>
              Debug: Language = {language}, TTS = {ttsEnabled ? 'On' : 'Off'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignInScreen;
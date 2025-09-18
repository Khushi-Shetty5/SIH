import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Dimensions } from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../languageConstants';

const BACKEND_URL = 'http://192.168.117.168:3000';

const SigninScreen = ({ navigation }) => {
  const { translations, language, ttsEnabled } = useLanguage();
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
      }
      const textToSpeak = `${translations[language].medkit}. ${translations[language].sign_in_to_continue}. ${translations[language].name_placeholder}. ${translations[language].phone_placeholder}. ${translations[language].sign_in}.`;
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

  const handleSignin = async () => {
    if (!phone || !name) {
      Alert.alert(
        translations[language].sign_in || 'Error',
        translations[language].signin_error || 'Please enter both name and phone number'
      );
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name }),
      });
      const data = await response.json();
      console.log('Signin response:', data); // Debug log
      if (response.ok) {
        if (!data.patientId) {
          console.error('No patientId in response');
          Alert.alert(
            translations[language].sign_in || 'Error',
            translations[language].signin_error || 'Sign-in failed: No patient ID returned'
          );
          return;
        }
        console.log('Navigating to Dashboard with patientId:', data.patientId);
        navigation.navigate('Dashboard', { patientId: data.patientId });
      } else {
        Alert.alert(
          translations[language].sign_in || 'Error',
          translations[language].signin_error || data.error
        );
      }
    } catch (error) {
      console.error('Signin error:', error);
      Alert.alert(
        translations[language].sign_in || 'Error',
        translations[language].signin_error || 'Failed to connect to server. Check your network.'
      );
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    content: {
      flex: 1,
      paddingHorizontal: orientation === 'landscape' ? windowWidth * 0.1 : windowWidth * 0.06,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: { alignItems: 'center', marginBottom: windowHeight * 0.06 },
    title: {
      fontSize: windowHeight * 0.04,
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: windowHeight * 0.01,
    },
    subtitle: { fontSize: windowHeight * 0.022, color: '#64748b' },
    form: { width: windowWidth * 0.9, marginBottom: windowHeight * 0.04 },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      borderRadius: windowWidth * 0.03,
      marginBottom: windowHeight * 0.02,
      paddingHorizontal: windowWidth * 0.04,
      paddingVertical: windowHeight * 0.005,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: windowHeight * 0.001 },
      shadowOpacity: 0.05,
      shadowRadius: windowWidth * 0.005,
      elevation: 1,
    },
    inputIcon: { marginRight: windowWidth * 0.03, fontSize: windowHeight * 0.025 },
    input: {
      flex: 1,
      paddingVertical: windowHeight * 0.02,
      fontSize: windowHeight * 0.02,
      color: '#1e293b',
    },
    signinButton: {
      backgroundColor: '#3b82f6',
      borderRadius: windowWidth * 0.03,
      paddingVertical: windowHeight * 0.02,
      alignItems: 'center',
      marginTop: windowHeight * 0.01,
    },
    signinButtonText: { color: '#ffffff', fontSize: windowHeight * 0.02, fontWeight: '600' },
    footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    footerText: { color: '#64748b', fontSize: windowHeight * 0.018 },
    signupLink: { color: '#3b82f6', fontSize: windowHeight * 0.018, fontWeight: '600' },
    ttsButton: { marginLeft: windowWidth * 0.02 },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.title}>{translations[language].medkit}</Text>
            {ttsEnabled && (
              <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].medkit)}>
                <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.subtitle}>{translations[language].sign_in_to_continue}</Text>
            {ttsEnabled && (
              <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].sign_in_to_continue)}>
                <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={translations[language].name_placeholder}
              value={name}
              onChangeText={setName}
            />
            {ttsEnabled && (
              <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].name_placeholder)}>
                <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={translations[language].phone_placeholder}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            {ttsEnabled && (
              <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].phone_placeholder)}>
                <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={styles.signinButton} onPress={handleSignin}>
              <Text style={styles.signinButtonText}>{translations[language].sign_in}</Text>
            </TouchableOpacity>
            {ttsEnabled && (
              <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].sign_in)}>
                <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{translations[language].no_account}</Text>
          {ttsEnabled && (
            <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].no_account)}>
              <Ionicons name="volume-high-outline" size={windowHeight * 0.018} color="#3b82f6" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>{translations[language].sign_up_link}</Text>
          </TouchableOpacity>
          {ttsEnabled && (
            <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].sign_up_link)}>
              <Ionicons name="volume-high-outline" size={windowHeight * 0.018} color="#3b82f6" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SigninScreen;
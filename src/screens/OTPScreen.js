import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Dimensions } from 'react-native';
import * as Speech from 'expo-speech';
import * as SMS from 'expo-sms';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../languageConstants';

const BACKEND_URL = 'http://192.168.117.168:3000'; // Replace with your backend server's IP

const OTPScreen = ({ navigation, route }) => {
  const { translations, language, ttsEnabled } = useLanguage();
  const [otp, setOtp] = useState('');
  const { phone } = route.params || {};
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
  }, [ttsEnabled, language, phone]);

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
      const textToSpeak = `${translations[language].verify_otp}. ${translations[language].enter_otp}${phone ? `. ${translations[language].phone_label}${phone}` : ''}. ${translations[language].verify_otp_button}.`;
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

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', translations[language].enter_valid_otp);
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await response.json();
      if (response.ok) {
        navigation.replace('Home');
      } else {
        Alert.alert('Error', data.error || translations[language].invalid_otp);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify OTP. Please check your connection.');
    }
  };

  const handleResendOTP = async () => {
    try {
      const isAvailable = await SMS.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'SMS is not available on this device.');
        return;
      }
      const otp = generateOTP();
      const otpResponse = await fetch(`${BACKEND_URL}/auth/store-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const otpData = await otpResponse.json();
      if (otpResponse.ok) {
        await SMS.sendSMSAsync([phone], `Your Nabha Hospital OTP is ${otp}`);
        Alert.alert('Success', 'OTP resent successfully');
      } else {
        Alert.alert('Error', otpData.error || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      Alert.alert('Error', 'Failed to resend OTP. Check your SIM or network.');
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
    subtitle: { fontSize: windowHeight * 0.022, color: '#64748b', textAlign: 'center' },
    form: { width: windowWidth * 0.9, marginBottom: windowHeight * 0.04 },
    phoneContainer: {
      backgroundColor: '#e2e8f0',
      borderRadius: windowWidth * 0.03,
      marginBottom: windowHeight * 0.02,
      paddingHorizontal: windowWidth * 0.04,
      paddingVertical: windowHeight * 0.015,
      flexDirection: 'row',
      alignItems: 'center',
    },
    phoneText: { fontSize: windowHeight * 0.02, color: '#1e293b' },
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
    verifyButton: {
      backgroundColor: '#3b82f6',
      borderRadius: windowWidth * 0.03,
      paddingVertical: windowHeight * 0.02,
      alignItems: 'center',
      marginTop: windowHeight * 0.01,
    },
    verifyButtonText: { color: '#ffffff', fontSize: windowHeight * 0.02, fontWeight: '600' },
    resendOTP: { alignItems: 'center', marginTop: windowHeight * 0.02 },
    resendOTPText: { color: '#3b82f6', fontSize: windowHeight * 0.018 },
    ttsButton: { marginLeft: windowWidth * 0.02 },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.title}>{translations[language].verify_otp}</Text>
            {ttsEnabled && (
              <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].verify_otp)}>
                <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.subtitle}>
              {translations[language].enter_otp}
              {phone ? `\n(${phone})` : ''}
            </Text>
            {ttsEnabled && (
              <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].enter_otp + (phone ? ` ${translations[language].phone_label}${phone}` : ''))}>
                <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.form}>
          {phone && (
            <View style={styles.phoneContainer}>
              <Text style={styles.phoneText}>{translations[language].phone_label}{phone}</Text>
              {ttsEnabled && (
                <TouchableOpacity style={styles.ttsButton} onPress={() => playText(`${translations[language].phone_label}${phone}`)}>
                  <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.inputContainer}>
            <Ionicons name="key-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={translations[language].enter_otp_placeholder}
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              maxLength={6}
            />
            {ttsEnabled && (
              <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].enter_otp_placeholder)}>
                <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP}>
              <Text style={styles.verifyButtonText}>{translations[language].verify_otp_button}</Text>
            </TouchableOpacity>
            {ttsEnabled && (
              <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].verify_otp_button)}>
                <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={styles.resendOTP} onPress={handleResendOTP}>
              <Text style={styles.resendOTPText}>{translations[language].resend_otp}</Text>
            </TouchableOpacity>
            {ttsEnabled && (
              <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].resend_otp)}>
                <Ionicons name="volume-high-outline" size={windowHeight * 0.018} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OTPScreen;
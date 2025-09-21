import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import * as SMS from 'expo-sms';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../languageConstants';
import axios from 'axios';

const BACKEND_URL = 'http://192.168.181.168:3000';

const OTPScreen = ({ navigation, route }) => {
  const { translations, language, ttsEnabled, setTtsEnabled } = useLanguage();
  const [otp, setOtp] = useState('');
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const { phone, formData, demoOtp } = route.params || {};
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
        Alert.alert('Language Notice', `Voice for ${language} not available. Using English voice.`, [{ text: 'OK' }]);
      }
      const textToSpeak = `${translations[language]?.verify_otp || 'Verify OTP'}. ${
        translations[language]?.enter_otp || 'Enter the OTP sent to your phone'
      }${phone ? `. ${translations[language]?.phone_label || 'Phone: '}${phone}` : ''}. ${
        translations[language]?.verify_otp_button || 'Verify OTP'
      }.`;
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

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleToggleTts = () => {
    setTtsEnabled();
    const status = ttsEnabled ? 'tts_disabled' : 'tts_enabled';
    playText(translations[language]?.[status] || `Voice assistance ${ttsEnabled ? 'disabled' : 'enabled'}`);
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert(
        translations[language]?.error || 'Error',
        translations[language]?.enter_valid_otp || 'Please enter a valid 6-digit OTP'
      );
      return;
    }
    if (isVerifyingOTP) return;
    setIsVerifyingOTP(true);
    try {
      const fullPhone = phone;
      console.log('🔍 Verifying OTP:', otp, 'for phone:', fullPhone);
      const response = await axios.post(`${BACKEND_URL}/auth/signup`, {
        phone: fullPhone,
        otp,
        formData,
      });
      console.log('📋 Signup response:', response.data);
      if (response.status === 200) {
        console.log('✅ Signup successful:', response.data);
        await AsyncStorage.setItem('patientId', response.data.patientId);
        console.log('💾 Stored patientId in AsyncStorage:', response.data.patientId);
        if (ttsEnabled) {
          playText(translations[language]?.signup_success || 'Account created successfully! Navigating to Dashboard.');
        }
        Alert.alert(
          translations[language]?.success || 'Success',
          translations[language]?.signup_success || 'Account created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('🚀 Navigating to Dashboard with patientId:', response.data.patientId);
                navigation.replace('Dashboard', { patientId: response.data.patientId });
              },
            },
          ]
        );
      } else {
        Alert.alert(
          translations[language]?.error || 'Error',
          response.data.error || translations[language]?.signup_failed || 'Signup failed'
        );
      }
    } catch (error) {
      console.error('❌ Verify OTP error:', error.response?.data || error.message);
      Alert.alert(
        translations[language]?.error || 'Error',
        error.response?.data?.error || translations[language]?.invalid_otp || 'Invalid or expired OTP'
      );
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleResendOTP = async () => {
    if (isVerifyingOTP) return;
    setIsVerifyingOTP(true);
    try {
      const fullPhone = phone;
      const isAvailable = await SMS.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert(
          translations[language]?.error || 'Error',
          translations[language]?.sms_unavailable || 'SMS is not available on this device.'
        );
        setIsVerifyingOTP(false);
        return;
      }
      const newOtp = generateOTP();
      console.log('🔄 Resending OTP:', newOtp, 'for phone:', fullPhone);
      const otpResponse = await axios.post(`${BACKEND_URL}/auth/store-otp`, {
        phone: fullPhone,
        otp: newOtp,
        formData,
        otpExpires: new Date(Date.now() + 10 * 60 * 1000),
      });
      if (otpResponse.status === 200) {
        await SMS.sendSMSAsync([fullPhone], `Your Nabha Hospital OTP is ${newOtp}. Valid for 10 minutes.`);
        console.log('📱 Resent OTP successfully to:', fullPhone, 'with OTP:', newOtp);
        setOtp('');
        if (ttsEnabled) {
          playText(translations[language]?.otp_sent || 'OTP resent to your phone');
        }
        Alert.alert(
          translations[language]?.success || 'Success',
          translations[language]?.otp_sent || 'OTP resent to your phone'
        );
      } else {
        Alert.alert(
          translations[language]?.error || 'Error',
          otpResponse.data.error || translations[language]?.otp_store_failed || 'Failed to store OTP'
        );
      }
    } catch (error) {
      console.error('❌ Resend OTP error:', error.response?.data || error.message);
      Alert.alert(
        translations[language]?.error || 'Error',
        error.response?.data?.error || translations[language]?.otp_send_failed || 'Failed to resend OTP. Check your SIM or network.'
      );
    } finally {
      setIsVerifyingOTP(false);
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
    form: {
      width: '100%',
      maxWidth: windowWidth * 0.9,
      alignItems: 'center',
    },
    phoneContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: windowHeight * 0.02,
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    phoneText: {
      fontSize: Math.min(windowHeight * 0.02, 16),
      color: '#1e293b',
      flex: 1,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      borderRadius: 12,
      paddingHorizontal: 16,
      marginBottom: windowHeight * 0.02,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      minHeight: windowHeight * 0.06,
    },
    inputIcon: {
      marginRight: 12,
      fontSize: Math.min(windowHeight * 0.025, 20),
      color: '#64748b',
    },
    input: {
      flex: 1,
      paddingVertical: 12,
      fontSize: Math.min(windowHeight * 0.02, 16),
      color: '#1e293b',
    },
    verifyButton: {
      backgroundColor: '#3b82f6',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      width: '100%',
      maxWidth: 300,
      marginVertical: windowHeight * 0.02,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      opacity: isVerifyingOTP ? 0.5 : 1,
    },
    verifyButtonText: {
      color: '#ffffff',
      fontSize: Math.min(windowHeight * 0.02, 18),
      fontWeight: '600',
    },
    resendOTP: {
      paddingVertical: 10,
      alignItems: 'center',
    },
    resendOTPText: {
      color: '#3b82f6',
      fontSize: Math.min(windowHeight * 0.018, 16),
      fontWeight: '600',
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
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.title}>{translations[language]?.verify_otp || 'Verify OTP'}</Text>
            {ttsEnabled && (
              <TouchableOpacity
                style={styles.ttsButton}
                onPress={() => playText(translations[language]?.verify_otp || 'Verify OTP')}
              >
                <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.subtitle}>
              {translations[language]?.enter_otp || 'Enter the OTP sent to your phone'}
              {phone ? `\n(${phone})` : ''}
            </Text>
            {ttsEnabled && (
              <TouchableOpacity
                style={styles.ttsButton}
                onPress={() =>
                  playText(
                    `${translations[language]?.enter_otp || 'Enter the OTP sent to your phone'}${
                      phone ? ` ${translations[language]?.phone_label || 'Phone: '}${phone}` : ''
                    }`
                  )
                }
              >
                <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.ttsToggleContainer}>
            <Text style={styles.ttsToggleText}>
              {translations[language]?.tts_toggle || 'Voice Assistance'} (
              {ttsEnabled ? translations[language]?.tts_enabled || 'On' : translations[language]?.tts_disabled || 'Off'})
            </Text>
            <TouchableOpacity onPress={handleToggleTts} style={{ padding: 8 }}>
              <Ionicons
                name={ttsEnabled ? 'volume-high-outline' : 'volume-mute-outline'}
                size={windowHeight * 0.025}
                color="#3b82f6"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          {phone && (
            <View style={styles.phoneContainer}>
              <Text style={styles.phoneText}>
                {translations[language]?.phone_label || 'Phone: '}
                {phone}
              </Text>
              {ttsEnabled && (
                <TouchableOpacity
                  style={styles.ttsButton}
                  onPress={() => playText(`${translations[language]?.phone_label || 'Phone: '}${phone}`)}
                >
                  <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={styles.inputContainer}>
            <Ionicons name="key-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={translations[language]?.enter_otp_placeholder || 'Enter 6-digit OTP'}
              value={otp}
              onChangeText={(text) => {
                setOtp(text);
                if (ttsEnabled) {
                  playText(translations[language]?.enter_otp_placeholder || 'Enter 6-digit OTP');
                }
              }}
              keyboardType="numeric"
              maxLength={6}
              placeholderTextColor="#9ca3af"
            />
            {ttsEnabled && (
              <TouchableOpacity
                style={styles.ttsButton}
                onPress={() => playText(translations[language]?.enter_otp_placeholder || 'Enter 6-digit OTP')}
              >
                <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity
              style={[styles.verifyButton, isVerifyingOTP && { opacity: 0.5 }]}
              onPress={handleVerifyOTP}
              disabled={isVerifyingOTP}
            >
              <Text style={styles.verifyButtonText}>
                {translations[language]?.verify_otp_button || 'Verify OTP'}
              </Text>
            </TouchableOpacity>
            {ttsEnabled && (
              <TouchableOpacity
                style={styles.ttsButton}
                onPress={() => playText(translations[language]?.verify_otp_button || 'Verify OTP')}
              >
                <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <TouchableOpacity style={styles.resendOTP} onPress={handleResendOTP} disabled={isVerifyingOTP}>
              <Text style={styles.resendOTPText}>{translations[language]?.resend_otp || 'Resend OTP'}</Text>
            </TouchableOpacity>
            {ttsEnabled && (
              <TouchableOpacity
                style={styles.ttsButton}
                onPress={() => playText(translations[language]?.resend_otp || 'Resend OTP')}
              >
                <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>

          {__DEV__ && (
            <View style={{ marginTop: windowHeight * 0.02, padding: 10, backgroundColor: '#f0f9ff', borderRadius: 8 }}>
              <Text style={{ fontSize: 12, color: '#64748b' }}>
                Debug: Language = {language}, TTS = {ttsEnabled ? 'On' : 'Off'}, Demo OTP = {demoOtp || 'N/A'}, Patient ID = {formData?.patientId || 'N/A'}
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OTPScreen;
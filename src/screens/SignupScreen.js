import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Speech from 'expo-speech';
import * as SMS from 'expo-sms';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../languageConstants';
import axios from 'axios';

const BACKEND_URL = 'http://192.168.118.168:3000';

const SignupScreen = ({ navigation }) => {
  const { translations, language, changeLanguage, ttsEnabled, setTtsEnabled } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    countryCode: '+91',
    age: '',
    gender: '',
    language: 'English',
    address: '',
    emergencyContact: '',
    emergencyCountryCode: '+91',
    emergencyRelation: '',
    disabilityStatus: '',
    healthParameters: '',
    password: '',
    confirmPassword: '',
  });
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);
  const [orientation, setOrientation] = useState(windowWidth > windowHeight ? 'landscape' : 'portrait');
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      const textToSpeak = `${translations[language]?.create_account || 'Create Account'}. ${translations[language]?.join_medkit || 'Join MedKit to manage your health appointments seamlessly'}.`;
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

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (field === 'language') {
      changeLanguage(value);
      if (ttsEnabled) {
        playText(`${translations[value]?.language_label || 'Language'}: ${value}`);
      }
    }
    if (ttsEnabled && translations[language]?.[`${field}_placeholder`]) {
      playText(translations[language][`${field}_placeholder`]);
    }
  };

  const validateForm = () => {
    const requiredFields = {
      name: translations[language]?.full_name_placeholder || 'Full Name',
      phone: translations[language]?.contact_placeholder || 'Phone Number',
      age: translations[language]?.age_placeholder || 'Age',
      gender: translations[language]?.select_gender || 'Gender',
      language: translations[language]?.select_language || 'Language',
      address: translations[language]?.address_placeholder || 'Address',
      emergencyContact: translations[language]?.emergency_contact_placeholder || 'Emergency Contact',
      emergencyRelation: translations[language]?.emergency_relation_placeholder || 'Emergency Relation',
      password: translations[language]?.password_placeholder || 'Password',
      confirmPassword: translations[language]?.confirm_password_placeholder || 'Confirm Password',
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field]?.trim()) {
        return { valid: false, message: `${translations[language]?.enter_field || 'Please enter'} ${label}` };
      }
    }

    const fullPhone = `${formData.countryCode}${formData.phone}`;
    const fullEmergencyContact = `${formData.emergencyCountryCode}${formData.emergencyContact}`;
    const phoneRegex = /^\+\d{1,3}\d{10}$/;
    if (!phoneRegex.test(fullPhone)) {
      return { valid: false, message: translations[language]?.invalid_phone || 'Invalid phone number format' };
    }
    if (!phoneRegex.test(fullEmergencyContact)) {
      return { valid: false, message: translations[language]?.invalid_emergency_phone || 'Invalid emergency contact number format' };
    }

    const ageNum = parseInt(formData.age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 150) {
      return { valid: false, message: translations[language]?.invalid_age || 'Please enter a valid age (1-150)' };
    }

    if (formData.password !== formData.confirmPassword) {
      return { valid: false, message: translations[language]?.password_mismatch || 'Passwords do not match' };
    }

    return { valid: true };
  };

  const handleGetOTP = async () => {
    if (isSendingOTP) return;
    const validation = validateForm();
    if (!validation.valid) {
      Alert.alert(translations[language]?.error || 'Error', validation.message);
      setIsSendingOTP(false);
      return;
    }
    setIsSendingOTP(true);
    try {
      const fullPhone = `${formData.countryCode}${formData.phone}`;
      const fullEmergencyContact = `${formData.emergencyCountryCode}${formData.emergencyContact}`;
      
      console.log('📱 Full phone for OTP:', fullPhone);
      console.log('📱 Full emergency contact:', fullEmergencyContact);

      const checkResponse = await axios.post(`${BACKEND_URL}/auth/request-signup-otp`, {
        ...formData,
        phone: fullPhone,
        emergencyContact: fullEmergencyContact,
      });
      
      console.log('✅ Validation response:', checkResponse.data);
      
      if (checkResponse.status !== 200) {
        Alert.alert(
          translations[language]?.error || 'Error',
          checkResponse.data.error || 'Failed to validate signup data'
        );
        setIsSendingOTP(false);
        return;
      }

      const isAvailable = await SMS.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert(
          translations[language]?.error || 'Error',
          translations[language]?.sms_unavailable || 'SMS is not available on this device.'
        );
        setIsSendingOTP(false);
        return;
      }

      const otp = generateOTP();
      console.log('🔢 Generated OTP:', otp, 'for phone:', fullPhone);

      const otpResponse = await axios.post(`${BACKEND_URL}/auth/store-otp`, {
        phone: fullPhone,
        otp: otp,
        formData: {
          ...formData,
          phone: fullPhone,
          emergencyContact: fullEmergencyContact,
          countryCode: formData.countryCode,
          emergencyCountryCode: formData.emergencyCountryCode,
        },
        otpExpires: new Date(Date.now() + 10 * 60 * 1000),
      });
      
      console.log('💾 Store OTP response:', otpResponse.data);
      
      if (otpResponse.status === 200) {
        await SMS.sendSMSAsync([fullPhone], `Your Nabha Hospital OTP is ${otp}. Valid for 10 minutes.`);
        console.log('📱 SMS sent successfully to:', fullPhone, 'with OTP:', otp);
        
        navigation.navigate('OTP', {
          phone: fullPhone,
          formData: {
            ...formData,
            phone: fullPhone,
            emergencyContact: fullEmergencyContact,
          },
          demoOtp: otp,
        });
        
        if (ttsEnabled) {
          playText(`${translations[language]?.otp_sent || 'OTP sent to your phone'}: ${otp}`);
        }
        
        if (__DEV__) {
          Alert.alert(
            'Demo OTP',
            `Your OTP is: ${otp}\n\nUse this OTP to verify your account.`,
            [{ text: 'OK' }]
          );
        }
      } else {
        Alert.alert(
          translations[language]?.error || 'Error',
          otpResponse.data.error || 'Failed to store OTP'
        );
      }
    } catch (error) {
      console.error('❌ Request OTP error:', error.response?.data || error.message);
      Alert.alert(
        translations[language]?.error || 'Error',
        error.response?.data?.error || 'Failed to send OTP. Please try again.'
      );
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleToggleTts = () => {
    setTtsEnabled();
    const status = ttsEnabled ? 'tts_disabled' : 'tts_enabled';
    playText(translations[language]?.[status] || `Voice assistance ${ttsEnabled ? 'disabled' : 'enabled'}`);
  };

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
      paddingHorizontal: 10,
    },
    form: {
      width: '100%',
      maxWidth: Math.min(windowWidth * 0.85, 400),
      alignSelf: 'center',
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
    pickerContainer: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
      minHeight: windowHeight * 0.07,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    picker: {
      flex: 1,
      height: windowHeight * 0.07,
      color: '#1e293b',
    },
    button: {
      backgroundColor: '#3b82f6',
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 24,
      marginBottom: windowHeight * 0.03,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
      width: '100%',
      maxWidth: 400,
      alignSelf: 'center',
      opacity: isSendingOTP ? 0.5 : 1,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: Math.min(windowHeight * 0.024, 20),
      fontWeight: '600',
    },
    signInLink: {
      alignItems: 'center',
      marginTop: 24,
      marginBottom: windowHeight * 0.04,
    },
    signInText: {
      color: '#64748b',
      fontSize: Math.min(windowHeight * 0.02, 16),
      textAlign: 'center',
    },
    ttsButton: {
      marginLeft: 12,
      padding: 10,
    },
    passwordEye: {
      marginLeft: 12,
      padding: 10,
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
            <Text style={styles.title}>{translations[language]?.create_account || 'Create Account'}</Text>
            {ttsEnabled && (
              <TouchableOpacity
                style={styles.ttsButton}
                onPress={() => playText(translations[language]?.create_account || 'Create Account')}
              >
                <Ionicons name="volume-high-outline" size={Math.min(windowHeight * 0.03, 24)} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.subtitle}>
              {translations[language]?.join_medkit || 'Join MedKit to manage your health appointments seamlessly'}
            </Text>
            {ttsEnabled && (
              <TouchableOpacity
                style={styles.ttsButton}
                onPress={() => playText(translations[language]?.join_medkit || 'Join MedKit to manage your health appointments seamlessly')}
              >
                <Ionicons name="volume-high-outline" size={Math.min(windowHeight * 0.03, 24)} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.ttsToggleContainer}>
            <Text style={styles.ttsToggleText}>
              {translations[language]?.toggle_tts || 'Voice Assistance'} (
              {ttsEnabled ? translations[language]?.tts_enabled || 'On' : translations[language]?.tts_disabled || 'Off'})
            </Text>
            <TouchableOpacity onPress={handleToggleTts} style={styles.ttsButton}>
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
              placeholder={translations[language]?.full_name_placeholder || 'Full Name'}
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              placeholderTextColor="#9ca3af"
            />
            {ttsEnabled && (
              <TouchableOpacity
                style={styles.ttsButton}
                onPress={() => playText(translations[language]?.full_name_placeholder || 'Full Name')}
              >
                <Ionicons name="volume-high-outline" size={Math.min(windowHeight * 0.03, 24)} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Picker
              selectedValue={formData.countryCode}
              onValueChange={(value) => handleInputChange('countryCode', value)}
              style={[styles.picker, { width: Math.min(windowWidth * 0.25, 100) }]}
            >
              <Picker.Item label="+91" value="+91" />
              <Picker.Item label="+1" value="+1" />
              <Picker.Item label="+44" value="+44" />
            </Picker>
            <Ionicons name="call-outline" size={Math.min(windowHeight * 0.03, 22)} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={translations[language]?.contact_placeholder || '9876543210'}
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              keyboardType="phone-pad"
              placeholderTextColor="#9ca3af"
            />
            {ttsEnabled && (
              <TouchableOpacity
                style={styles.ttsButton}
                onPress={() => playText(translations[language]?.contact_placeholder || 'Phone Number')}
              >
                <Ionicons name="volume-high-outline" size={Math.min(windowHeight * 0.03, 24)} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="calendar-outline" size={Math.min(windowHeight * 0.03, 22)} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={translations[language]?.age_placeholder || 'Age'}
              value={formData.age}
              onChangeText={(text) => handleInputChange('age', text)}
              keyboardType="numeric"
              placeholderTextColor="#9ca3af"
            />
            {ttsEnabled && (
              <TouchableOpacity
                style={styles.ttsButton}
                onPress={() => playText(translations[language]?.age_placeholder || 'Age')}
              >
                <Ionicons name="volume-high-outline" size={Math.min(windowHeight * 0.03, 24)} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.gender}
              onValueChange={(value) => handleInputChange('gender', value)}
              style={styles.picker}
            >
              <Picker.Item label={translations[language]?.select_gender || 'Select Gender'} value="" />
              <Picker.Item label={translations[language]?.male || 'Male'} value="Male" />
              <Picker.Item label={translations[language]?.female || 'Female'} value="Female" />
              <Picker.Item label={translations[language]?.other || 'Other'} value="Other" />
            </Picker>
            {ttsEnabled && (
              <TouchableOpacity
                style={styles.ttsButton}
                onPress={() => playText(translations[language]?.select_gender || 'Select Gender')}
              >
                <Ionicons name="volume-high-outline" size={Math.min(windowHeight * 0.03, 24)} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.language}
              onValueChange={(value) => handleInputChange('language', value)}
              style={styles.picker}
            >
              <Picker.Item label={translations[language]?.select_language || 'Select Language'} value="" />
              <Picker.Item label="English" value="English" />
              <Picker.Item label="Hindi" value="Hindi" />
              <Picker.Item label="Punjabi" value="Punjabi" />
            </Picker>
            {ttsEnabled && (
              <TouchableOpacity
                style={styles.ttsButton}
                onPress={() => playText(translations[language]?.select_language || 'Select Language')}
              >
                <Ionicons name="volume-high-outline" size={Math.min(windowHeight * 0.03, 24)} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={Math.min(windowHeight * 0.03, 22)} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={translations[language]?.address_placeholder || 'Address'}
              value={formData.address}
              onChangeText={(text) => handleInputChange('address', text)}
              placeholderTextColor="#9ca3af"
              multiline
            />
            {ttsEnabled && (
              <TouchableOpacity
                style={styles.ttsButton}
                onPress={() => playText(translations[language]?.address_placeholder || 'Address')}
              >
                <Ionicons name="volume-high-outline" size={Math.min(windowHeight * 0.03, 24)} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Picker
              selectedValue={formData.emergencyCountryCode}
              onValueChange={(value) => handleInputChange('emergencyCountryCode', value)}
              style={[styles.picker, { width: Math.min(windowWidth * 0.25, 100) }]}
            >
              <Picker.Item label="+91" value="+91" />
              <Picker.Item label="+1" value="+1" />
              <Picker.Item label="+44" value="+44" />
            </Picker>
            <Ionicons name="call-outline" size={Math.min(windowHeight * 0.03, 22)} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={translations[language]?.emergency_contact_placeholder || '9876543211'}
              value={formData.emergencyContact}
              onChangeText={(text) => handleInputChange('emergencyContact', text)}
              keyboardType="phone-pad"
              placeholderTextColor="#9ca3af"
            />
            {ttsEnabled && (
              <TouchableOpacity
                style={styles.ttsButton}
                onPress={() => playText(translations[language]?.emergency_contact_placeholder || 'Emergency Contact')}
              >
                <Ionicons name="volume-high-outline" size={Math.min(windowHeight * 0.03, 24)} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={Math.min(windowHeight * 0.03, 22)} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={translations[language]?.emergency_relation_placeholder || 'Emergency Relation'}
              value={formData.emergencyRelation}
              onChangeText={(text) => handleInputChange('emergencyRelation', text)}
              placeholderTextColor="#9ca3af"
            />
            {ttsEnabled && (
              <TouchableOpacity
                style={styles.ttsButton}
                onPress={() => playText(translations[language]?.emergency_relation_placeholder || 'Emergency Relation')}
              >
                <Ionicons name="volume-high-outline" size={Math.min(windowHeight * 0.03, 24)} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="accessibility-outline" size={Math.min(windowHeight * 0.03, 22)} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={translations[language]?.disability_status_placeholder || 'Disability Status (Optional)'}
              value={formData.disabilityStatus}
              onChangeText={(text) => handleInputChange('disabilityStatus', text)}
              placeholderTextColor="#9ca3af"
            />
            {ttsEnabled && (
              <TouchableOpacity
                style={styles.ttsButton}
                onPress={() => playText(translations[language]?.disability_status_placeholder || 'Disability Status (Optional)')}
              >
                <Ionicons name="volume-high-outline" size={Math.min(windowHeight * 0.03, 24)} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="heart-outline" size={Math.min(windowHeight * 0.03, 22)} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={translations[language]?.health_parameters_placeholder || 'Health Parameters (Optional)'}
              value={formData.healthParameters}
              onChangeText={(text) => handleInputChange('healthParameters', text)}
              placeholderTextColor="#9ca3af"
              multiline
            />
            {ttsEnabled && (
              <TouchableOpacity
                style={styles.ttsButton}
                onPress={() => playText(translations[language]?.health_parameters_placeholder || 'Health Parameters (Optional)')}
              >
                <Ionicons name="volume-high-outline" size={Math.min(windowHeight * 0.03, 24)} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={Math.min(windowHeight * 0.03, 22)} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={translations[language]?.password_placeholder || 'Password'}
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              secureTextEntry={!showPassword}
              placeholderTextColor="#9ca3af"
            />
            <TouchableOpacity
              style={styles.passwordEye}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={Math.min(windowHeight * 0.03, 24)}
                color="#64748b"
              />
            </TouchableOpacity>
            {ttsEnabled && (
              <TouchableOpacity
                style={styles.ttsButton}
                onPress={() => playText(translations[language]?.password_placeholder || 'Password')}
              >
                <Ionicons name="volume-high-outline" size={Math.min(windowHeight * 0.03, 24)} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={Math.min(windowHeight * 0.03, 22)} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={translations[language]?.confirm_password_placeholder || 'Confirm Password'}
              value={formData.confirmPassword}
              onChangeText={(text) => handleInputChange('confirmPassword', text)}
              secureTextEntry={!showConfirmPassword}
              placeholderTextColor="#9ca3af"
            />
            <TouchableOpacity
              style={styles.passwordEye}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={Math.min(windowHeight * 0.03, 24)}
                color="#64748b"
              />
            </TouchableOpacity>
            {ttsEnabled && (
              <TouchableOpacity
                style={styles.ttsButton}
                onPress={() => playText(translations[language]?.confirm_password_placeholder || 'Confirm Password')}
              >
                <Ionicons name="volume-high-outline" size={Math.min(windowHeight * 0.03, 24)} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={[styles.button, isSendingOTP && { opacity: 0.5 }]} onPress={handleGetOTP} disabled={isSendingOTP}>
            <Text style={styles.buttonText}>
              {isSendingOTP ? translations[language]?.sending || 'Sending...' : translations[language]?.get_otp || 'Get OTP'}
            </Text>
          </TouchableOpacity>

          <View style={styles.signInLink}>
            <Text style={styles.signInText}>
              {translations[language]?.already_have_account || 'Already have an account? '}
              <Text
                style={{ color: '#3b82f6', fontWeight: '600' }}
                onPress={() => navigation.navigate('Signin')}
              >
                {translations[language]?.sign_in_link || 'Sign In'}
              </Text>
            </Text>
            {ttsEnabled && (
              <TouchableOpacity
                style={styles.ttsButton}
                onPress={() =>
                  playText(
                    `${translations[language]?.already_have_account || 'Already have an account? '} ${
                      translations[language]?.sign_in_link || 'Sign In'
                    }`
                  )
                }
              >
                <Ionicons name="volume-high-outline" size={Math.min(windowHeight * 0.03, 24)} color="#3b82f6" />
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupScreen;
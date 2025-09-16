import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import * as Speech from 'expo-speech';
import * as SMS from 'expo-sms';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useLanguage } from '../languageConstants';

const BACKEND_URL = 'http://192.168.117.168:3000'; // Replace with your backend server's IP
const genders = ['Male', 'Female', 'Other'];
const languages = [
  { name: 'English', display: 'English' },
  { name: 'Hindi', display: 'हिन्दी' },
  { name: 'Punjabi', display: 'ਪੰਜਾਬੀ' },
];

const SignupScreen = ({ navigation }) => {
  const { translations, language, ttsEnabled } = useLanguage();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [languageSelected, setLanguageSelected] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [healthRecords, setHealthRecords] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('');
  const [disabilityStatus, setDisabilityStatus] = useState('');
  const [healthParameters, setHealthParameters] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      const textToSpeak = `${translations[language].create_account}. ${translations[language].join_medkit}. ${translations[language].full_name_placeholder}. ${translations[language].age_placeholder}. ${translations[language].select_gender}. ${translations[language].select_language}. ${translations[language].contact_placeholder}.`;
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

  const handleSignup = async () => {
    if (
      !name ||
      !age ||
      !gender ||
      !languageSelected ||
      !contact ||
      !address ||
      !emergencyContact ||
      !emergencyRelation ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (!consent) {
      Alert.alert('Error', 'Please consent to store health data');
      return;
    }
    if (!contact.startsWith('+') || contact.length < 12) {
      Alert.alert('Error', 'Phone number must include country code (e.g., +919876543210)');
      return;
    }
    if (!emergencyContact.startsWith('+') || emergencyContact.length < 12) {
      Alert.alert('Error', 'Emergency contact must include country code (e.g., +919876543211)');
      return;
    }

    try {
      // Check SMS availability
      const isAvailable = await SMS.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Error', 'SMS is not available on this device. Please use a device with SMS capability.');
        return;
      }

      // Register patient
      const signupResponse = await fetch(`${BACKEND_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone: contact,
          age: parseInt(age),
          gender,
          language: languageSelected,
          address,
          emergencyContact,
          emergencyRelation,
          disabilityStatus,
          healthParameters,
          password,
        }),
      });
      const signupData = await signupResponse.json();

      if (signupResponse.ok) {
        // Generate OTP
        const otp = generateOTP();
        // Store OTP
        const otpResponse = await fetch(`${BACKEND_URL}/auth/store-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: contact, otp }),
        });
        const otpData = await otpResponse.json();
        if (otpResponse.ok) {
          // Send OTP
          try {
            await SMS.sendSMSAsync([contact], `Your Nabha Hospital OTP is ${otp}`);
            navigation.navigate('OTP', { phone: contact });
          } catch (smsError) {
            console.error('SMS error:', smsError);
            // Fallback: Log OTP and alert staff
            await fetch(`${BACKEND_URL}/auth/store-otp`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ phone: contact, otp }),
            });
            Alert.alert('Error', `Failed to send SMS. OTP: ${otp} (Please note this OTP or contact staff)`);
            navigation.navigate('OTP', { phone: contact });
          }
        } else {
          Alert.alert('Error', otpData.error || 'Failed to store OTP');
        }
      } else {
        Alert.alert('Error', signupData.error || 'Failed to register patient');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', error.message.includes('Network request failed') ? 'Failed to connect to server. Check your network or server IP.' : `Signup failed: ${error.message}`);
    }
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingBottom: windowHeight * 0.02,
      paddingHorizontal: orientation === 'landscape' ? windowWidth * 0.1 : windowWidth * 0.06,
    },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
    pickerContainer: {
      marginBottom: windowHeight * 0.02,
    },
    pickerLabel: {
      fontSize: windowHeight * 0.022,
      color: '#1e293b',
      marginBottom: windowHeight * 0.01,
      fontWeight: '500',
    },
    picker: { height: windowHeight * 0.08, width: '100%', color: '#1e293b', fontSize: windowHeight * 0.02 },
    eyeIcon: { padding: windowWidth * 0.01 },
    consentContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: windowHeight * 0.02 },
    checkbox: { marginRight: windowWidth * 0.02 },
    consentText: { fontSize: windowHeight * 0.018, color: '#64748b' },
    signupButton: {
      backgroundColor: '#10b981',
      borderRadius: windowWidth * 0.03,
      paddingVertical: windowHeight * 0.02,
      alignItems: 'center',
      marginTop: windowHeight * 0.01,
    },
    signupButtonText: { color: '#ffffff', fontSize: windowHeight * 0.02, fontWeight: '600' },
    footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    footerText: { color: '#64748b', fontSize: windowHeight * 0.018 },
    signupLink: { color: '#3b82f6', fontSize: windowHeight * 0.018, fontWeight: '600' },
    ttsButton: { marginLeft: windowWidth * 0.02 },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.title}>{translations[language].create_account}</Text>
              {ttsEnabled && (
                <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].create_account)}>
                  <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                </TouchableOpacity>
              )}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.subtitle}>{translations[language].join_medkit}</Text>
              {ttsEnabled && (
                <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].join_medkit)}>
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
                placeholder={translations[language].full_name_placeholder}
                value={name}
                onChangeText={setName}
              />
              {ttsEnabled && (
                <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].full_name_placeholder)}>
                  <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="calendar-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={translations[language].age_placeholder}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
              {ttsEnabled && (
                <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].age_placeholder)}>
                  <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.pickerContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.pickerLabel}>{translations[language].select_gender}</Text>
                {ttsEnabled && (
                  <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].select_gender)}>
                    <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="male-female-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
                <Picker
                  selectedValue={gender}
                  onValueChange={(itemValue) => setGender(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label={translations[language].select_gender} value="" />
                  {genders.map((item) => (
                    <Picker.Item key={item} label={item} value={item} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.pickerContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.pickerLabel}>{translations[language].select_language}</Text>
                {ttsEnabled && (
                  <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].select_language)}>
                    <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="language-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
                <Picker
                  selectedValue={languageSelected}
                  onValueChange={(itemValue) => setLanguageSelected(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label={translations[language].select_language} value="" />
                  {languages.map((item) => (
                    <Picker.Item key={item.name} label={item.display} value={item.name} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={translations[language].contact_placeholder}
                value={contact}
                onChangeText={setContact}
                keyboardType="phone-pad"
              />
              {ttsEnabled && (
                <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].contact_placeholder)}>
                  <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={translations[language].address_placeholder}
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
              />
              {ttsEnabled && (
                <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].address_placeholder)}>
                  <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="medical-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={translations[language].health_records_placeholder}
                value={healthRecords}
                onChangeText={setHealthRecords}
                multiline
                numberOfLines={3}
              />
              {ttsEnabled && (
                <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].health_records_placeholder)}>
                  <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="medkit-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={translations[language].current_medications_placeholder}
                value={currentMedications}
                onChangeText={setCurrentMedications}
                multiline
                numberOfLines={3}
              />
              {ttsEnabled && (
                <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].current_medications_placeholder)}>
                  <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="person-circle-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={translations[language].emergency_contact_placeholder}
                value={emergencyContact}
                onChangeText={setEmergencyContact}
                keyboardType="phone-pad"
              />
              {ttsEnabled && (
                <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].emergency_contact_placeholder)}>
                  <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="people-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={translations[language].emergency_relation_placeholder}
                value={emergencyRelation}
                onChangeText={setEmergencyRelation}
              />
              {ttsEnabled && (
                <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].emergency_relation_placeholder)}>
                  <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="accessibility-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={translations[language].disability_status_placeholder}
                value={disabilityStatus}
                onChangeText={setDisabilityStatus}
              />
              {ttsEnabled && (
                <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].disability_status_placeholder)}>
                  <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="heart-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={translations[language].health_parameters_placeholder}
                value={healthParameters}
                onChangeText={setHealthParameters}
                multiline
                numberOfLines={3}
              />
              {ttsEnabled && (
                <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].health_parameters_placeholder)}>
                  <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={translations[language].password_placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={styles.inputIcon.fontSize} color="#64748b" />
              </TouchableOpacity>
              {ttsEnabled && (
                <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].password_placeholder)}>
                  <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={styles.inputIcon.fontSize} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder={translations[language].confirm_password_placeholder}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={styles.inputIcon.fontSize} color="#64748b" />
              </TouchableOpacity>
              {ttsEnabled && (
                <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].confirm_password_placeholder)}>
                  <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.consentContainer}>
              <TouchableOpacity onPress={() => setConsent(!consent)} style={styles.checkbox}>
                <Ionicons name={consent ? 'checkbox-outline' : 'square-outline'} size={styles.inputIcon.fontSize} color="#3b82f6" />
              </TouchableOpacity>
              <Text style={styles.consentText}>{translations[language].consent_text}</Text>
              {ttsEnabled && (
                <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].consent_text)}>
                  <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                </TouchableOpacity>
              )}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
                <Text style={styles.signupButtonText}>{translations[language].get_otp}</Text>
              </TouchableOpacity>
              {ttsEnabled && (
                <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].get_otp)}>
                  <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{translations[language].already_have_account}</Text>
            {ttsEnabled && (
              <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].already_have_account)}>
                <Ionicons name="volume-high-outline" size={windowHeight * 0.018} color="#3b82f6" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
              <Text style={styles.signupLink}>{translations[language].sign_in_link}</Text>
            </TouchableOpacity>
            {ttsEnabled && (
              <TouchableOpacity style={styles.ttsButton} onPress={() => playText(translations[language].sign_in_link)}>
                <Ionicons name="volume-high-outline" size={windowHeight * 0.018} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupScreen;
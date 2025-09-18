import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../languageConstants';
import axios from 'axios';

const BACKEND_URL = 'http://192.168.118.168:3000';

const ProfileScreen = ({ navigation, route }) => {
  const { translations, language, changeLanguage, ttsEnabled, setTtsEnabled } = useLanguage();
  const [patientId, setPatientId] = useState(route.params?.patientId);
  const [userData, setUserData] = useState(null);
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);
  const [orientation, setOrientation] = useState(windowWidth > windowHeight ? 'landscape' : 'portrait');
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hardcoded health records (fallback data)
  const healthRecords = {
    bloodPressure: '120/80 mmHg',
    heartRate: '72 bpm',
    bloodSugar: '90 mg/dL',
    medicalHistory: 'No known allergies, mild asthma',
    lastCheckup: '2025-08-15',
  };

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
    const loadPatientIdAndData = async () => {
      try {
        // Try to get patientId from route params first
        let currentPatientId = patientId;
        
        // If no patientId from params, try AsyncStorage
        if (!currentPatientId) {
          currentPatientId = await AsyncStorage.getItem('patientId');
          console.log('👤 Profile: Retrieved patientId from AsyncStorage:', currentPatientId);
          setPatientId(currentPatientId);
        }
        
        // If still no patientId, show error
        if (!currentPatientId) {
          console.error('❌ Profile: No patientId found in route or AsyncStorage');
          setError(translations[language]?.no_patient_id || 'No patient ID found. Please sign in again.');
          setLoading(false);
          Alert.alert(
            translations[language]?.error || 'Error',
            translations[language]?.please_sign_in || 'Please sign in to view your profile',
            [
              {
                text: 'Sign In',
                onPress: () => navigation.replace('Signin'),
              },
            ]
          );
          return;
        }

        console.log('👤 Profile: Loading data for patientId:', currentPatientId);
        await fetchUserData(currentPatientId);
        setLoading(false);
        
        if (ttsEnabled) {
          playScreenText();
        }
      } catch (error) {
        console.error('❌ Profile: Error loading patient data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    loadPatientIdAndData();
  }, [patientId, language, ttsEnabled]);

  const fetchUserData = async (currentPatientId) => {
    try {
      console.log('👤 Fetching profile for patientId:', currentPatientId);
      const response = await axios.get(`${BACKEND_URL}/auth/get-profile/${currentPatientId}`);
      
      if (response.status === 200) {
        const data = response.data;
        setUserData(data);
        console.log('✅ Profile data fetched:', {
          name: data.name,
          phone: data.phone,
          age: data.age,
          gender: data.gender,
        });
        
        if (ttsEnabled) {
          const profileText = `${translations[language]?.profile_title || 'Profile'}. ${translations[language]?.name_label || 'Name'}: ${data.name}. ${translations[language]?.phone_label || 'Phone'}: ${data.phone}.`;
          Speech.speak(profileText, { 
            language: language === 'English' ? 'en-US' : language === 'Hindi' ? 'hi-IN' : 'pa-IN', 
            rate: 0.7 
          });
        }
      } else {
        throw new Error(response.data?.error || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('❌ Profile fetch error:', error.response?.data || error.message);
      setError(error.message || translations[language]?.fetch_profile_error || 'Failed to fetch profile data');
      
      if (ttsEnabled) {
        Speech.speak(translations[language]?.fetch_profile_error || 'Failed to fetch profile data', { 
          language: language === 'English' ? 'en-US' : (language === 'Hindi' ? 'hi-IN' : 'pa-IN'),
          rate: 0.7 
        });
      }
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
      const textToSpeak = `${translations[language]?.profile_title || 'Profile'}. ${translations[language]?.view_your_info || 'View your personal and health information'}.`;
      Speech.speak(textToSpeak, {
        language: speechLang,
        pitch: 1.0,
        rate: 0.7,
        onError: (error) => console.error('TTS Error:', error),
      });
    } catch (error) {
      console.error('TTS Error:', error);
    }
  };

  const handleEditProfile = () => {
    console.log('✏️ Edit profile pressed for patientId:', patientId);
    if (ttsEnabled) {
      playText(translations[language]?.edit_profile || 'Edit Profile');
    }
    // Navigate to edit profile screen or show edit form
    Alert.alert(
      translations[language]?.edit_profile || 'Edit Profile',
      translations[language]?.edit_profile_message || 'Profile editing feature coming soon!',
      [{ text: 'OK' }]
    );
  };

  const handleToggleTts = () => {
    setTtsEnabled();
    const status = ttsEnabled ? 'tts_disabled' : 'tts_enabled';
    playText(translations[language]?.[status] || `Voice assistance ${ttsEnabled ? 'disabled' : 'enabled'}`);
  };

  // Define styles inside component to access windowHeight and windowWidth
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8fafc',
    },
    scrollContent: {
      flexGrow: 1,
    },
    header: {
      alignItems: 'center',
      marginBottom: windowHeight * 0.03,
      paddingTop: windowHeight * 0.02,
    },
    title: {
      fontSize: Math.min(windowHeight * 0.04, 32),
      fontWeight: 'bold',
      color: '#1e293b',
      textAlign: 'center',
    },
    ttsToggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 12,
      marginVertical: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      width: '100%',
      maxWidth: 300,
    },
    ttsToggleText: {
      fontSize: Math.min(windowHeight * 0.02, 16),
      color: '#1e293b',
      marginRight: 12,
      fontWeight: '500',
    },
    profileContainer: {
      flex: 1,
      paddingHorizontal: windowWidth * 0.06,
      paddingBottom: windowHeight * 0.05,
    },
    section: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    sectionTitle: {
      fontSize: Math.min(windowHeight * 0.025, 20),
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    icon: {
      marginRight: 12,
    },
    infoLabel: {
      fontSize: Math.min(windowHeight * 0.018, 14),
      color: '#64748b',
      fontWeight: '500',
      minWidth: 120,
    },
    infoValue: {
      flex: 1,
      fontSize: Math.min(windowHeight * 0.018, 14),
      color: '#1e293b',
    },
    ttsButton: {
      padding: 4,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 20,
    },
    button: {
      backgroundColor: '#3b82f6',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
      flex: 1,
      marginHorizontal: 8,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    logoutButton: {
      backgroundColor: '#ef4444',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: Math.min(windowHeight * 0.018, 14),
      fontWeight: '600',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: Math.min(windowHeight * 0.02, 16),
      color: '#64748b',
      marginTop: 16,
      textAlign: 'center',
    },
    errorText: {
      fontSize: Math.min(windowHeight * 0.02, 16),
      color: '#ef4444',
      textAlign: 'center',
      marginBottom: 20,
    },
    retryButton: {
      backgroundColor: '#3b82f6',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
      marginBottom: 12,
      alignItems: 'center',
    },
    retryButtonText: {
      color: '#ffffff',
      fontSize: Math.min(windowHeight * 0.018, 14),
      fontWeight: '600',
    },
    signInButton: {
      backgroundColor: '#10b981',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 24,
      alignItems: 'center',
    },
    signInButtonText: {
      color: '#ffffff',
      fontSize: Math.min(windowHeight * 0.018, 14),
      fontWeight: '600',
    },
    debugContainer: {
      marginTop: 20,
      padding: 10,
      backgroundColor: '#f0f9ff',
      borderRadius: 8,
      alignItems: 'center',
    },
    debugText: {
      fontSize: 12,
      color: '#64748b',
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>
            {translations[language]?.loading_profile || 'Loading profile...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => {
              setLoading(true);
              setError(null);
              if (patientId) fetchUserData(patientId);
            }}
          >
            <Text style={styles.retryButtonText}>
              {translations[language]?.retry || 'Retry'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.signInButton} 
            onPress={() => navigation.replace('Signin')}
          >
            <Text style={styles.signInButtonText}>
              {translations[language]?.sign_in || 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.title}>{translations[language]?.profile_title || 'Profile'}</Text>
            {ttsEnabled && (
              <TouchableOpacity
                style={styles.ttsButton}
                onPress={() => playScreenText()}
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

        <View style={styles.profileContainer}>
          {userData ? (
            <>
              {/* Personal Information */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {translations[language]?.personal_info || 'Personal Information'}
                </Text>
                <View style={styles.infoRow}>
                  <Ionicons name="person-outline" size={20} color="#64748b" style={styles.icon} />
                  <Text style={styles.infoLabel}>
                    {translations[language]?.name_label || 'Name:'}
                  </Text>
                  <Text style={styles.infoValue}>{userData.name}</Text>
                  {ttsEnabled && (
                    <TouchableOpacity 
                      style={styles.ttsButton} 
                      onPress={() => playText(`${translations[language]?.name_label || 'Name:'} ${userData.name}`)}
                    >
                      <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={20} color="#64748b" style={styles.icon} />
                  <Text style={styles.infoLabel}>
                    {translations[language]?.phone_label || 'Phone:'}
                  </Text>
                  <Text style={styles.infoValue}>{userData.phone}</Text>
                  {ttsEnabled && (
                    <TouchableOpacity 
                      style={styles.ttsButton} 
                      onPress={() => playText(`${translations[language]?.phone_label || 'Phone:'} ${userData.phone}`)}
                    >
                      <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={20} color="#64748b" style={styles.icon} />
                  <Text style={styles.infoLabel}>
                    {translations[language]?.age_label || 'Age:'}
                  </Text>
                  <Text style={styles.infoValue}>{userData.age}</Text>
                  {ttsEnabled && (
                    <TouchableOpacity 
                      style={styles.ttsButton} 
                      onPress={() => playText(`${translations[language]?.age_label || 'Age:'} ${userData.age}`)}
                    >
                      <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="gender-male-female" size={20} color="#64748b" style={styles.icon} />
                  <Text style={styles.infoLabel}>
                    {translations[language]?.gender_label || 'Gender:'}
                  </Text>
                  <Text style={styles.infoValue}>{userData.gender}</Text>
                  {ttsEnabled && (
                    <TouchableOpacity 
                      style={styles.ttsButton} 
                      onPress={() => playText(`${translations[language]?.gender_label || 'Gender:'} ${userData.gender}`)}
                    >
                      <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                    </TouchableOpacity>
                  )}
                </View>
                {userData.address && (
                  <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={20} color="#64748b" style={styles.icon} />
                    <Text style={styles.infoLabel}>
                      {translations[language]?.address_label || 'Address:'}
                    </Text>
                    <Text style={styles.infoValue}>{userData.address}</Text>
                    {ttsEnabled && (
                      <TouchableOpacity 
                        style={styles.ttsButton} 
                        onPress={() => playText(`${translations[language]?.address_label || 'Address:'} ${userData.address}`)}
                      >
                        <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                {userData.emergencyContact && (
                  <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={20} color="#64748b" style={styles.icon} />
                    <Text style={styles.infoLabel}>
                      {translations[language]?.emergency_contact_label || 'Emergency Contact:'}
                    </Text>
                    <Text style={styles.infoValue}>{userData.emergencyContact}</Text>
                    {ttsEnabled && (
                      <TouchableOpacity 
                        style={styles.ttsButton} 
                        onPress={() => playText(`${translations[language]?.emergency_contact_label || 'Emergency Contact:'} ${userData.emergencyContact}`)}
                      >
                        <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                {userData.emergencyRelation && (
                  <View style={styles.infoRow}>
                    <Ionicons name="heart-handshake-outline" size={20} color="#64748b" style={styles.icon} />
                    <Text style={styles.infoLabel}>
                      {translations[language]?.emergency_relation_label || 'Emergency Relation:'}
                    </Text>
                    <Text style={styles.infoValue}>{userData.emergencyRelation}</Text>
                    {ttsEnabled && (
                      <TouchableOpacity 
                        style={styles.ttsButton} 
                        onPress={() => playText(`${translations[language]?.emergency_relation_label || 'Emergency Relation:'} ${userData.emergencyRelation}`)}
                      >
                        <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>

              {/* Health Information */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {translations[language]?.health_records || 'Health Records'}
                </Text>
                <View style={styles.infoRow}>
                  <Ionicons name="speedometer" size={20} color="#64748b" style={styles.icon} />
                  <Text style={styles.infoLabel}>
                    {translations[language]?.blood_pressure_label || 'Blood Pressure:'}
                  </Text>
                  <Text style={styles.infoValue}>{healthRecords.bloodPressure}</Text>
                  {ttsEnabled && (
                    <TouchableOpacity 
                      style={styles.ttsButton} 
                      onPress={() => playText(`${translations[language]?.blood_pressure_label || 'Blood Pressure:'} ${healthRecords.bloodPressure}`)}
                    >
                      <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="heart-pulse" size={20} color="#64748b" style={styles.icon} />
                  <Text style={styles.infoLabel}>
                    {translations[language]?.heart_rate_label || 'Heart Rate:'}
                  </Text>
                  <Text style={styles.infoValue}>{healthRecords.heartRate}</Text>
                  {ttsEnabled && (
                    <TouchableOpacity 
                      style={styles.ttsButton} 
                      onPress={() => playText(`${translations[language]?.heart_rate_label || 'Heart Rate:'} ${healthRecords.heartRate}`)}
                    >
                      <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="water-outline" size={20} color="#64748b" style={styles.icon} />
                  <Text style={styles.infoLabel}>
                    {translations[language]?.blood_sugar_label || 'Blood Sugar:'}
                  </Text>
                  <Text style={styles.infoValue}>{healthRecords.bloodSugar}</Text>
                  {ttsEnabled && (
                    <TouchableOpacity 
                      style={styles.ttsButton} 
                      onPress={() => playText(`${translations[language]?.blood_sugar_label || 'Blood Sugar:'} ${healthRecords.bloodSugar}`)}
                    >
                      <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="medical-bag" size={20} color="#64748b" style={styles.icon} />
                  <Text style={styles.infoLabel}>
                    {translations[language]?.medical_history_label || 'Medical History:'}
                  </Text>
                  <Text style={styles.infoValue}>{healthRecords.medicalHistory}</Text>
                  {ttsEnabled && (
                    <TouchableOpacity 
                      style={styles.ttsButton} 
                      onPress={() => playText(`${translations[language]?.medical_history_label || 'Medical History:'} ${healthRecords.medicalHistory}`)}
                    >
                      <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="calendar-check-outline" size={20} color="#64748b" style={styles.icon} />
                  <Text style={styles.infoLabel}>
                    {translations[language]?.last_checkup_label || 'Last Checkup:'}
                  </Text>
                  <Text style={styles.infoValue}>{healthRecords.lastCheckup}</Text>
                  {ttsEnabled && (
                    <TouchableOpacity 
                      style={styles.ttsButton} 
                      onPress={() => playText(`${translations[language]?.last_checkup_label || 'Last Checkup:'} ${healthRecords.lastCheckup}`)}
                    >
                      <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.button} onPress={handleEditProfile}>
                  <Ionicons name="pencil-outline" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                  <Text style={styles.buttonText}>
                    {translations[language]?.edit_profile || 'Edit Profile'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.logoutButton]} 
                  onPress={() => {
                    Alert.alert(
                      translations[language]?.logout || 'Logout',
                      translations[language]?.confirm_logout || 'Are you sure you want to logout?',
                      [
                        { text: translations[language]?.cancel || 'Cancel', style: 'cancel' },
                        {
                          text: translations[language]?.logout || 'Logout',
                          style: 'destructive',
                          onPress: async () => {
                            await AsyncStorage.multiRemove(['patientId', 'language']);
                            navigation.replace('Signin');
                            if (ttsEnabled) {
                              playText(translations[language]?.logged_out || 'You have been logged out');
                            }
                          },
                        },
                      ]
                    );
                  }}
                >
                  <Ionicons name="logout" size={20} color="#ffffff" style={{ marginRight: 8 }} />
                  <Text style={styles.buttonText}>
                    {translations[language]?.logout || 'Logout'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.loadingText}>
                {translations[language]?.loading_profile || 'Loading profile...'}
              </Text>
              {ttsEnabled && (
                <TouchableOpacity 
                  style={styles.ttsButton} 
                  onPress={() => playText(translations[language]?.loading_profile || 'Loading profile...')}
                >
                  <Ionicons name="volume-high-outline" size={windowHeight * 0.025} color="#3b82f6" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {__DEV__ && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugText}>
              Debug: Language = {language}, TTS = {ttsEnabled ? 'On' : 'Off'}, PatientId = {patientId || 'N/A'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
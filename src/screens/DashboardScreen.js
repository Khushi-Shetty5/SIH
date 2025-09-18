import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import HeaderBar from '../components/HeaderBar';
import FloatingChatButton from '../components/FloatingChatButton';
import { useLanguage } from '../languageConstants';
import { getPatientAppointments, getOrCreateVideoRoom } from '../../services/api.js';
import * as Speech from 'expo-speech';

export default function DashboardScreen({ navigation, route }) {
  const { translations, language, ttsEnabled } = useLanguage();
  const [patientId, setPatientId] = useState(route.params?.patientId);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const dashboardCards = [
    {
      id: 1,
      title: translations[language]?.checkDoctorAvailability || 'Check Doctor Availability',
      icon: 'calendar-check',
      color: '#4A90E2',
      screen: 'DoctorAvailability',
    },
    {
      id: 2,
      title: translations[language]?.bookAppointment || 'Book Appointment',
      icon: 'plus-circle',
      color: '#4CAF50',
      screen: 'AppointmentBooking',
    },
    {
      id: 3,
      title: translations[language]?.searchMedicine || 'Search Medicine',
      icon: 'magnify',
      color: '#FF9800',
      screen: 'MedicineSearch',
    },
    {
      id: 4,
      title: translations[language]?.videoConference || 'Video Conference',
      icon: 'video',
      color: '#9C27B0',
      screen: 'VideoConsultation',
      disabled: !appointments.some(appt => appt.isVideoReady),
    },
    {
      id: 5,
      title: translations[language]?.myProfile || 'My Profile',
      icon: 'account',
      color: '#9E9E9E',
      screen: 'Profile',
    },
  ];

  useEffect(() => {
    const fetchPatientIdAndAppointments = async () => {
      try {
        let currentPatientId = patientId;
        
        // If no patientId from route params, try to get from AsyncStorage
        if (!currentPatientId) {
          currentPatientId = await AsyncStorage.getItem('patientId');
          console.log('📋 Dashboard: Retrieved patientId from AsyncStorage:', currentPatientId);
          setPatientId(currentPatientId);
        }
        
        // If still no patientId, show error and redirect to signin
        if (!currentPatientId) {
          console.error('❌ Dashboard: No patientId found in route or AsyncStorage');
          Alert.alert(
            translations[language]?.error || 'Error',
            translations[language]?.please_sign_in || 'Please sign in to continue',
            [
              {
                text: 'Sign In',
                onPress: () => navigation.replace('Signin'),
              },
            ]
          );
          setLoading(false);
          setError(translations[language]?.no_patient_id || 'No patient ID found');
          return;
        }

        console.log('📋 Loading appointments for patientId:', currentPatientId);
        const fetchedAppointments = await getPatientAppointments(currentPatientId);
        console.log('📋 Fetched appointments:', fetchedAppointments.length, 'appointments');
        setAppointments(fetchedAppointments);
        setFilteredAppointments(fetchedAppointments);
        setLoading(false);
        setError(null);
        
        if (ttsEnabled) {
          const welcomeText = `${translations[language]?.welcome_back || 'Welcome back'}! ${translations[language]?.appointments_loaded || 'Your appointments are loaded'}. ${fetchedAppointments.length} ${translations[language]?.appointments || 'appointments'} ${translations[language]?.found || 'found'}.`;
          Speech.speak(welcomeText, { 
            language: language === 'English' ? 'en-US' : language === 'Hindi' ? 'hi-IN' : 'pa-IN', 
            rate: 0.8 
          });
        }
      } catch (error) {
        console.error('❌ Error fetching appointments:', error);
        setError(error.message);
        setLoading(false);
        Alert.alert(
          translations[language]?.error || 'Error',
          error.message || translations[language]?.failed_to_load || 'Failed to load appointments'
        );
      }
    };

    fetchPatientIdAndAppointments();
  }, [patientId, language, ttsEnabled, navigation]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = appointments.filter(appt =>
        appt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appt.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appt.status.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments(appointments);
    }
  }, [searchQuery, appointments]);

  const handleCardPress = async (card) => {
    try {
      // Ensure we have a valid patientId before navigating
      const currentPatientId = patientId || await AsyncStorage.getItem('patientId');
      if (!currentPatientId) {
        Alert.alert(
          translations[language]?.error || 'Error',
          translations[language]?.please_sign_in || 'Please sign in to continue',
          [
            {
              text: 'Sign In',
              onPress: () => navigation.replace('Signin'),
            },
          ]
        );
        return;
      }

      if (card.disabled) {
        Alert.alert(
          translations[language]?.notice || 'Notice',
          translations[language]?.no_appointments || 'No appointments available for video consultation'
        );
        return;
      }

      if (card.screen === 'VideoConsultation' && !card.disabled) {
        const videoAppointment = appointments.find(appt => appt.isVideoReady);
        if (videoAppointment) {
          console.log('🎥 Joining video consultation for appointment:', videoAppointment._id);
          
          let roomUrl = videoAppointment.videoRoomUrl;
          if (!roomUrl) {
            try {
              roomUrl = await getOrCreateVideoRoom(
                videoAppointment._id,
                currentPatientId,
                videoAppointment.doctorId
              );
              console.log('🎥 Created new video room:', roomUrl);
            } catch (error) {
              console.error('❌ Failed to create video room:', error);
              Alert.alert(
                translations[language]?.error || 'Error',
                translations[language]?.failed_to_create_room || 'Failed to create video room'
              );
              return;
            }
          }
          
          navigation.navigate('VideoConsultation', {
            roomUrl,
            isDoctor: false,
            roomId: videoAppointment._id,
            userId: currentPatientId,
            appointment: videoAppointment,
          });
          if (ttsEnabled) {
            Speech.speak(`${translations[language]?.joining_video || 'Joining video consultation with'} ${videoAppointment.doctorName}`, {
              language: language === 'English' ? 'en-US' : language === 'Hindi' ? 'hi-IN' : 'pa-IN',
              rate: 0.8,
            });
          }
        } else {
          Alert.alert(
            translations[language]?.notice || 'Notice',
            translations[language]?.no_video_appointments || 'No video appointments available'
          );
        }
      } else {
        console.log(`🚀 Navigating to ${card.screen} with patientId:`, currentPatientId);
        navigation.navigate(card.screen, { patientId: currentPatientId });
        
        if (ttsEnabled) {
          const speechText = `${translations[language]?.navigating_to || 'Navigating to'} ${card.title}`;
          Speech.speak(speechText, {
            language: language === 'English' ? 'en-US' : language === 'Hindi' ? 'hi-IN' : 'pa-IN',
            rate: 0.8,
          });
        }
      }
    } catch (error) {
      console.error('❌ Error handling card press:', error);
      Alert.alert(
        translations[language]?.error || 'Error',
        translations[language]?.navigation_error || 'Failed to navigate'
      );
    }
  };

  const handleAppointmentPress = async (appointment) => {
    try {
      const currentPatientId = patientId || await AsyncStorage.getItem('patientId');
      if (!currentPatientId) {
        Alert.alert(
          translations[language]?.error || 'Error',
          translations[language]?.please_sign_in || 'Please sign in to continue'
        );
        return;
      }

      console.log('📋 Appointment pressed:', appointment._id, appointment.status);
      
      if (appointment.status === 'confirmed' && appointment.isVideoReady) {
        let roomUrl = appointment.videoRoomUrl;
        
        if (!roomUrl) {
          try {
            roomUrl = await getOrCreateVideoRoom(
              appointment._id,
              currentPatientId,
              appointment.doctorId
            );
            console.log('🎥 Fetched video room for appointment:', roomUrl);
          } catch (error) {
            console.error('❌ Failed to get video room:', error);
            Alert.alert(
              translations[language]?.error || 'Error',
              translations[language]?.failed_to_join || 'Failed to join video consultation'
            );
            return;
          }
        }
        
        navigation.navigate('VideoConsultation', {
          roomUrl,
          isDoctor: false,
          roomId: appointment._id,
          userId: currentPatientId,
          appointment,
        });
        if (ttsEnabled) {
          Speech.speak(`${translations[language]?.joining_video || 'Joining video consultation with'} ${appointment.doctorName}`, {
            language: language === 'English' ? 'en-US' : language === 'Hindi' ? 'hi-IN' : 'pa-IN',
            rate: 0.8,
          });
        }
      } else if (appointment.status === 'pending') {
        Alert.alert(
          translations[language]?.notice || 'Notice',
          translations[language]?.appointment_pending || 'Your appointment is pending confirmation. You will be notified when it\'s ready.'
        );
      } else {
        Alert.alert(
          translations[language]?.notice || 'Notice',
          `${translations[language]?.appointment_status || 'Appointment status'}: ${translations[language]?.[appointment.status] || appointment.status}`
        );
      }
    } catch (error) {
      console.error('❌ Error handling appointment press:', error);
      Alert.alert(
        translations[language]?.error || 'Error',
        translations[language]?.appointment_error || 'Failed to process appointment'
      );
    }
  };

  const handleChatPress = async () => {
    const currentPatientId = patientId || await AsyncStorage.getItem('patientId');
    if (!currentPatientId) {
      Alert.alert(
        translations[language]?.error || 'Error',
        translations[language]?.please_sign_in || 'Please sign in to continue'
      );
      return;
    }
    
    console.log('💬 Navigating to Chat with patientId:', currentPatientId);
    navigation.navigate('Chat', { patientId: currentPatientId });
    if (ttsEnabled) {
      Speech.speak(translations[language]?.chatSupport || 'Chat Support', {
        language: language === 'English' ? 'en-US' : language === 'Hindi' ? 'hi-IN' : 'pa-IN',
        rate: 0.8,
      });
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (ttsEnabled && text) {
      Speech.speak(`${translations[language]?.searching || 'Searching for'}: ${text}`, {
        language: language === 'English' ? 'en-US' : language === 'Hindi' ? 'hi-IN' : 'pa-IN',
        rate: 0.8,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'cancelled': return '#F44336';
      case 'completed': return '#9C27B0';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return translations[language]?.confirmed || 'Confirmed';
      case 'pending': return translations[language]?.pending || 'Pending';
      case 'cancelled': return translations[language]?.cancelled || 'Cancelled';
      case 'completed': return translations[language]?.completed || 'Completed';
      default: return status;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>
            {translations[language]?.loading || 'Loading'}...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar navigation={navigation} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={24} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={translations[language]?.search_appointments || 'Search appointments...'}
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
          {searchQuery && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {/* Dashboard Cards */}
        <View style={styles.cardsContainer}>
          {dashboardCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[
                styles.card,
                { backgroundColor: card.color },
                card.disabled && styles.disabledCard,
              ]}
              onPress={() => handleCardPress(card)}
              disabled={card.disabled}
              activeOpacity={0.7}
            >
              <Icon name={card.icon} size={32} color="#fff" />
              <Text style={styles.cardTitle} numberOfLines={2}>{card.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Appointments Section */}
        <View style={styles.appointmentsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {translations[language]?.upcoming_appointments || 'Upcoming Appointments'}
            </Text>
            {appointments.length > 3 && (
              <TouchableOpacity onPress={() => navigation.navigate('Appointments')}>
                <Text style={styles.viewAllText}>
                  {translations[language]?.view_all || 'View All'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {filteredAppointments.length === 0 ? (
            <View style={styles.noAppointmentsContainer}>
              <Icon name="calendar-remove" size={64} color="#ccc" />
              <Text style={styles.noAppointmentsText}>
                {translations[language]?.no_appointments || 'No appointments found'}
              </Text>
              <TouchableOpacity style={styles.bookNowButton} onPress={() => handleCardPress(dashboardCards[1])}>
                <Text style={styles.bookNowText}>
                  {translations[language]?.book_now || 'Book Now'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredAppointments.slice(0, 3).map((appt) => (
              <TouchableOpacity
                key={appt._id}
                style={styles.appointmentCard}
                onPress={() => handleAppointmentPress(appt)}
                activeOpacity={0.7}
              >
                <View style={[styles.appointmentIcon, { backgroundColor: getStatusColor(appt.status) }]}>
                  <Icon name={appt.status === 'confirmed' ? 'video' : 'calendar-clock'} size={20} color="#fff" />
                </View>
                <View style={styles.appointmentDetails}>
                  <Text style={styles.appointmentTitle}>{appt.doctorName}</Text>
                  <Text style={styles.appointmentDate}>{appt.date} • {appt.timeFormatted}</Text>
                  <Text style={styles.appointmentReason} numberOfLines={1}>{appt.reason}</Text>
                  <View style={styles.statusContainer}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appt.status) }]} />
                    <Text style={styles.statusText}>{getStatusText(appt.status)}</Text>
                  </View>
                </View>
                {appt.isVideoReady && appt.status === 'confirmed' && (
                  <TouchableOpacity
                    style={[styles.joinCallButton, !appt.videoRoomUrl && styles.disabledButton]}
                    onPress={() => handleAppointmentPress(appt)}
                    disabled={!appt.videoRoomUrl}
                  >
                    <Text style={styles.joinCallText}>
                      {translations[language]?.joinVideoCall || 'Join Call'}
                    </Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
      <FloatingChatButton onPress={handleChatPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { flex: 1 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  cardsContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8, marginBottom: 24 },
  card: {
    width: '45%',
    aspectRatio: 1,
    margin: 8,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  disabledCard: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  cardTitle: { color: '#fff', fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 12 },
  appointmentsSection: { paddingHorizontal: 16, marginBottom: 100 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  viewAllText: { fontSize: 14, color: '#4A90E2', fontWeight: '600' },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appointmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  appointmentDetails: { flex: 1 },
  appointmentTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  appointmentDate: { fontSize: 14, color: '#666', marginTop: 2 },
  appointmentReason: { fontSize: 14, color: '#666', marginTop: 2 },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: { fontSize: 12, fontWeight: '500' },
  joinCallButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 16,
    minWidth: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  joinCallText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  noAppointmentsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noAppointmentsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  bookNowButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  bookNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
});
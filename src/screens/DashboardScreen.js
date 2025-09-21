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
import { getPendingAppointments, getApprovedAppointments } from '../../services/storage.js';
import * as Speech from 'expo-speech';
import { strings } from '../constants/strings.js';

export default function DashboardScreen({ navigation, route }) {
  const { translations, language, ttsEnabled } = useLanguage();
  const [patientId, setPatientId] = useState(route.params?.patientId);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Dashboard cards from both versions
  const dashboardCards = [
    {
      id: 1,
      title: translations[language]?.checkDoctorAvailability || strings.checkDoctorAvailability || 'Check Doctor Availability',
      icon: 'calendar-check',
      color: '#4A90E2',
      screen: 'DoctorAvailability',
    },
    {
      id: 2,
      title: translations[language]?.bookAppointment || strings.bookAppointment || 'Book Appointment',
      icon: 'plus-circle',
      color: '#4CAF50',
      screen: 'AppointmentBooking',
    },
    {
      id: 3,
      title: translations[language]?.searchMedicine || strings.searchMedicine || 'Search Medicine',
      icon: 'magnify',
      color: '#FF9800',
      screen: 'MedicineSearch',
    },
    {
      id: 4,
      title: translations[language]?.videoConference || strings.videoConference || 'Video Conference',
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

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      let currentPatientId = patientId;
      if (!currentPatientId) {
        currentPatientId = await AsyncStorage.getItem('patientId');
        setPatientId(currentPatientId);
      }
      if (!currentPatientId) throw new Error('No patient ID found');

      let fetchedAppointments = [];
      try {
        // Try fetching from API first
        fetchedAppointments = await getPatientAppointments(currentPatientId);
      } catch (apiErr) {
        console.warn('API failed, fallback to local storage:', apiErr.message);
        const pending = await getPendingAppointments();
        const approved = await getApprovedAppointments();
        fetchedAppointments = [...pending, ...approved];
      }

      fetchedAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));
      setAppointments(fetchedAppointments);
      setFilteredAppointments(fetchedAppointments);
      setLoading(false);

      if (ttsEnabled) {
        Speech.speak(
          `${translations[language]?.welcome_back || 'Welcome back'}! ${translations[language]?.appointments_loaded || 'Your appointments are loaded'}. ${fetchedAppointments.length} ${translations[language]?.appointments || 'appointments'} ${translations[language]?.found || 'found'}.`,
          { language: language === 'English' ? 'en-US' : language === 'Hindi' ? 'hi-IN' : 'pa-IN', rate: 0.8 }
        );
      }
    } catch (error) {
      setLoading(false);
      Alert.alert(translations[language]?.error || 'Error', error.message);
    }
  };

  useEffect(() => {
    fetchAppointments();
    const intervalId = setInterval(fetchAppointments, 5000);
    return () => clearInterval(intervalId);
  }, [patientId, language]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = appointments.filter(
        appt =>
          appt.doctorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          appt.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          appt.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          appt.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments(appointments);
    }
  }, [searchQuery, appointments]);

  const handleCardPress = async (card) => {
    try {
      const currentPatientId = patientId || (await AsyncStorage.getItem('patientId'));
      if (!currentPatientId) {
        Alert.alert(
          translations[language]?.error || 'Error',
          translations[language]?.please_sign_in || 'Please sign in',
          [{ text: 'Sign In', onPress: () => navigation.replace('Signin') }]
        );
        return;
      }

      if (card.disabled) {
        Alert.alert(translations[language]?.notice || 'Notice', translations[language]?.no_appointments || 'No video appointments available');
        return;
      }

      if (card.screen === 'VideoConsultation') {
        const videoAppointment = appointments.find(a => a.isVideoReady);
        if (!videoAppointment) return;

        let roomUrl = videoAppointment.videoRoomUrl;
        if (!roomUrl) roomUrl = await getOrCreateVideoRoom(videoAppointment._id, currentPatientId, videoAppointment.doctorId);

        navigation.navigate('VideoConsultation', {
          roomUrl,
          isDoctor: false,
          roomId: videoAppointment._id,
          userId: currentPatientId,
          appointment: videoAppointment,
        });
      } else {
        navigation.navigate(card.screen, { patientId: currentPatientId });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAppointmentPress = async (appt) => {
    if (!appt) return;

    if (appt.status === 'confirmed' && appt.isVideoReady) {
      let roomUrl = appt.videoRoomUrl;
      if (!roomUrl) roomUrl = await getOrCreateVideoRoom(appt._id, patientId, appt.doctorId);

      navigation.navigate('VideoConsultation', {
        roomUrl,
        isDoctor: false,
        roomId: appt._id,
        userId: patientId,
        appointment: appt,
      });
    } else if (appt.status === 'pending') {
      Alert.alert(translations[language]?.notice || 'Notice', translations[language]?.appointment_pending || 'Appointment pending');
    } else {
      Alert.alert(translations[language]?.notice || 'Notice', `${translations[language]?.appointment_status || 'Status'}: ${appt.status}`);
    }
  };

  const handleChatPress = async () => {
    const currentPatientId = patientId || (await AsyncStorage.getItem('patientId'));
    if (!currentPatientId) return;
    navigation.navigate('Chat', { patientId: currentPatientId });
  };

  const getStatusColor = status => {
    switch (status) {
      case 'confirmed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'cancelled': return '#F44336';
      case 'completed': return '#9C27B0';
      default: return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>{translations[language]?.loading || 'Loading'}...</Text>
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
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Dashboard Cards */}
        <View style={styles.cardsContainer}>
          {dashboardCards.map(card => (
            <TouchableOpacity
              key={card.id}
              style={[styles.card, { backgroundColor: card.color }, card.disabled && styles.disabledCard]}
              onPress={() => handleCardPress(card)}
              disabled={card.disabled}
            >
              <Icon name={card.icon} size={32} color="#fff" />
              <Text style={styles.cardTitle}>{card.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Appointments Section */}
        <View style={styles.appointmentsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{translations[language]?.upcoming_appointments || 'Upcoming Appointments'}</Text>
          </View>

          {filteredAppointments.length === 0 ? (
            <View style={styles.noAppointmentsContainer}>
              <Icon name="calendar-remove" size={64} color="#ccc" />
              <Text style={styles.noAppointmentsText}>{translations[language]?.no_appointments || 'No appointments found'}</Text>
              <TouchableOpacity style={styles.bookNowButton} onPress={() => handleCardPress(dashboardCards[1])}>
                <Text style={styles.bookNowText}>{translations[language]?.book_now || 'Book Now'}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredAppointments.slice(0, 3).map(appt => (
              <TouchableOpacity
                key={appt._id || appt.id}
                style={styles.appointmentCard}
                onPress={() => handleAppointmentPress(appt)}
              >
                <View style={[styles.appointmentIcon, { backgroundColor: getStatusColor(appt.status) }]}>
                  <Icon name={appt.status === 'confirmed' ? 'video' : 'calendar-clock'} size={20} color="#fff" />
                </View>
                <View style={styles.appointmentDetails}>
                  <Text style={styles.appointmentTitle}>{appt.doctorName || appt.title}</Text>
                  <Text style={styles.appointmentDate}>{appt.date} {appt.timeFormatted || ''}</Text>
                </View>
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  cardsContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8, marginBottom: 24 },
  card: { width: '45%', aspectRatio: 1, margin: 8, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
  disabledCard: { backgroundColor: '#ccc', opacity: 0.6 },
  cardTitle: { color: '#fff', fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 12 },
  appointmentsSection: { paddingHorizontal: 16, marginBottom: 100 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  appointmentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, marginVertical: 4, borderRadius: 8, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2 },
  appointmentIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  appointmentDetails: { flex: 1 },
  appointmentTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  appointmentDate: { fontSize: 14, color: '#666', marginTop: 2 },
  noAppointmentsContainer: { alignItems: 'center', paddingVertical: 40 },
  noAppointmentsText: { fontSize: 16, color: '#666', marginTop: 16, textAlign: 'center' },
  bookNowButton: { backgroundColor: '#4CAF50', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginTop: 16 },
  bookNowText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  loadingText: { fontSize: 16, color: '#666', marginTop: 16, textAlign: 'center' },
});

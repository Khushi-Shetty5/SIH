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
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import HeaderBar from '../components/HeaderBar';
import FloatingChatButton from '../components/FloatingChatButton';
import { useLanguage } from '../languageConstants';
import { getPatientAppointments, createVideoRoom } from '../../services/api.js';

export default function DashboardScreen({ navigation, route }) {
  const { translations, language } = useLanguage();
  const { patientId } = route.params || {};
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dashboardCards = [
    {
      id: 1,
      title: translations[language].checkDoctorAvailability,
      icon: 'calendar-check',
      color: '#4A90E2',
      screen: 'DoctorAvailability',
    },
    {
      id: 2,
      title: translations[language].bookAppointment,
      icon: 'plus-circle',
      color: '#4CAF50',
      screen: 'AppointmentBooking',
    },
    {
      id: 3,
      title: translations[language].searchMedicine,
      icon: 'magnify',
      color: '#FF9800',
      screen: 'MedicineSearch',
    },
    {
      id: 4,
      title: translations[language].videoConference,
      icon: 'video',
      color: '#9C27B0',
      screen: 'VideoConsultation',
      disabled: !appointments.length,
    },
  ];

  const fetchAppointments = async () => {
    try {
      console.log('Dashboard: patientId received:', patientId);
      if (!patientId) {
        throw new Error(translations[language].signin_error || 'Patient ID is missing. Please sign in again.');
      }
      setLoading(true);
      const res = await getPatientAppointments(patientId);
      console.log('Fetched appointments:', res);
      setAppointments(res.appointments || res);
    } catch (err) {
      console.error('Failed to load appointments:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [translations, language, patientId]);

  const handleJoinVideoCall = (appointment) => {
    if (!appointment?.id || !appointment?.doctorId) {
      Alert.alert(
        translations[language].videoConsultationTitle || 'Video Consultation',
        translations[language].noAppointments || 'No valid appointment selected.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      translations[language].videoConsultationTitle,
      translations[language].joinVideoCallPrompt.replace('{doctorName}', appointment.doctorName || 'Doctor').replace('{time}', appointment.time || 'the scheduled time'),
      [
        { text: translations[language].cancel, style: 'cancel' },
        {
          text: translations[language].joinVideoCall,
          onPress: async () => {
            try {
              console.log('Calling createVideoRoom with:', { appointmentId: appointment.id, patientId, doctorId: appointment.doctorId });
              const { channelName, token, appId } = await createVideoRoom(appointment.id, patientId, appointment.doctorId);
              console.log('Navigating to VideoConsultation with:', { channelName, token, appId });
              if (!channelName || !token || !appId) {
                throw new Error(translations[language].failedToCreateRoom || 'Failed to create video room');
              }
              navigation.navigate('VideoConsultation', {
                channelName,
                token,
                appId,
                isDoctor: false,
                roomId: appointment.id,
                userId: patientId,
              });
            } catch (error) {
              console.error('Join video call error:', error.message);
              Alert.alert(
                translations[language].videoConsultationTitle,
                translations[language].failedToJoin || 'Failed to join video call: ' + error.message,
                [{ text: 'OK' }]
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar navigation={navigation} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <Icon name="magnify" size={20} color="#9E9E9E" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={translations[language].searchPlaceholder}
            placeholderTextColor="#9E9E9E"
          />
        </View>

        <View style={styles.cardsContainer}>
          {dashboardCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[styles.card, { backgroundColor: card.color }, card.disabled && styles.disabledCard]}
              onPress={() => {
                if (card.disabled) {
                  Alert.alert(
                    translations[language].videoConsultationTitle || 'Video Consultation',
                    translations[language].noAppointments || 'No appointments available. Please book an appointment first.',
                    [{ text: 'OK' }]
                  );
                } else if (card.screen !== 'VideoConsultation') {
                  navigation.navigate(card.screen);
                }
              }}
              accessibilityLabel={card.title}
              disabled={card.disabled || card.screen === 'VideoConsultation'}
            >
              <Icon name={card.icon} size={32} color="#fff" />
              <Text style={styles.cardTitle}>{card.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.appointmentsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{translations[language].upcomingAppointments}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Records')}>
              <Text style={styles.viewAllText}>{translations[language].viewAll}</Text>
            </TouchableOpacity>
          </View>

          {loading && <ActivityIndicator size="large" color="#4A90E2" style={{ marginVertical: 20 }} />}
          {error && (
            <Text style={{ color: 'red', textAlign: 'center' }}>
              {error}
            </Text>
          )}

          {!loading && appointments.length === 0 && (
            <Text style={{ textAlign: 'center', color: '#666' }}>{translations[language].noAppointments}</Text>
          )}

          {appointments.map((appt) => (
            <View key={appt._id || appt.id} style={styles.appointmentCard}>
              <View style={[styles.appointmentIcon, { backgroundColor: '#4A90E2' }]}>
                <Icon name="calendar" size={20} color="#fff" />
              </View>
              <View style={styles.appointmentDetails}>
                <Text style={styles.appointmentTitle}>
                  {appt.doctorName || appt.doctorId || translations[language].bookAppointment}
                </Text>
                <Text style={{ color: '#555', marginTop: 2 }}>
                  {appt.date} {appt.time ? `• ${appt.time}` : ''}
                </Text>
                <Text style={{ color: '#888', marginTop: 2 }}>
                  Status: {appt.status || translations[language].pending}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.joinCallButton, appt.status !== 'confirmed' && styles.disabledButton]}
                onPress={() => handleJoinVideoCall(appt)}
                disabled={appt.status !== 'confirmed'}
              >
                <Text style={styles.joinCallText}>
                  {appt.status === 'confirmed' ? translations[language].joinVideoCall : translations[language].pending}
                </Text>
              </TouchableOpacity>
              <Text style={styles.appointmentDate}>
                {new Date(appt.date).toLocaleDateString()}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <FloatingChatButton onPress={() => console.log('Chat button pressed')} />
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
  },
  disabledCard: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  cardTitle: { color: '#fff', fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 12 },
  appointmentsSection: { paddingHorizontal: 16, marginBottom: 100 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
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
  },
  appointmentIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  appointmentDetails: { flex: 1 },
  appointmentTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  appointmentDate: { fontSize: 14, color: '#4A90E2', fontWeight: '600', marginLeft: 16 },
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
});
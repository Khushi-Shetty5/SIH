import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VideoConferenceScreen = ({ navigation }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [reason, setReason] = useState('');

  const doctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'General Medicine', available: true },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Cardiology', available: true },
    { id: 3, name: 'Dr. Emily Davis', specialty: 'Dermatology', available: false },
  ];

  const availableDates = [
    { id: 1, date: '2024-01-15', day: 'Today', dayNum: '15' },
    { id: 2, date: '2024-01-16', day: 'Tomorrow', dayNum: '16' },
    { id: 3, date: '2024-01-17', day: 'Wed', dayNum: '17' },
    { id: 4, date: '2024-01-18', day: 'Thu', dayNum: '18' },
  ];

  const availableTimes = [
    '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const handleRequestConference = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !reason.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    Alert.alert(
      'Request Sent',
      'Your video conference request has been sent. You will receive a confirmation shortly.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerText}>
          Request a video consultation with your preferred doctor
        </Text>

        {/* Select Doctor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Doctor</Text>
          {doctors.map((doctor) => (
            <TouchableOpacity
              key={doctor.id}
              style={[
                styles.doctorCard,
                selectedDoctor?.id === doctor.id && styles.selectedCard,
                !doctor.available && styles.unavailableCard
              ]}
              onPress={() => doctor.available && setSelectedDoctor(doctor)}
              disabled={!doctor.available}
            >
              <View style={styles.doctorInfo}>
                <View style={styles.doctorAvatar}>
                  <Ionicons name="person-outline" size={24} color="#64748b" />
                </View>
                <View style={styles.doctorDetails}>
                  <Text style={[
                    styles.doctorName,
                    !doctor.available && styles.unavailableText
                  ]}>
                    {doctor.name}
                  </Text>
                  <Text style={[
                    styles.doctorSpecialty,
                    !doctor.available && styles.unavailableText
                  ]}>
                    {doctor.specialty}
                  </Text>
                  {!doctor.available && (
                    <Text style={styles.unavailableLabel}>Not available for video calls</Text>
                  )}
                </View>
              </View>
              <View style={styles.doctorActions}>
                {doctor.available && (
                  <View style={styles.videoCallBadge}>
                    <Ionicons name="videocam" size={16} color="#10b981" />
                    <Text style={styles.videoCallText}>Video Call</Text>
                  </View>
                )}
                {selectedDoctor?.id === doctor.id && (
                  <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Select Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
            {availableDates.map((dateItem) => (
              <TouchableOpacity
                key={dateItem.id}
                style={[
                  styles.dateCard,
                  selectedDate?.id === dateItem.id && styles.selectedDateCard
                ]}
                onPress={() => setSelectedDate(dateItem)}
              >
                <Text style={[
                  styles.dayText,
                  selectedDate?.id === dateItem.id && styles.selectedDateText
                ]}>
                  {dateItem.day}
                </Text>
                <Text style={[
                  styles.dayNumText,
                  selectedDate?.id === dateItem.id && styles.selectedDateText
                ]}>
                  {dateItem.dayNum}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Select Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Time</Text>
          <View style={styles.timeGrid}>
            {availableTimes.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeCard,
                  selectedTime === time && styles.selectedTimeCard
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[
                  styles.timeText,
                  selectedTime === time && styles.selectedTimeText
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reason for Consultation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reason for Consultation</Text>
          <TextInput
            style={styles.reasonInput}
            placeholder="Please describe your symptoms or reason for consultation..."
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Request Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.requestButton} onPress={handleRequestConference}>
          <Ionicons name="videocam" size={20} color="#ffffff" style={styles.buttonIcon} />
          <Text style={styles.requestButtonText}>Request Video Conference</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 22,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#10b981',
  },
  unavailableCard: {
    backgroundColor: '#f8fafc',
    opacity: 0.6,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  unavailableText: {
    color: '#94a3b8',
  },
  unavailableLabel: {
    fontSize: 12,
    color: '#ef4444',
    fontStyle: 'italic',
  },
  doctorActions: {
    alignItems: 'flex-end',
  },
  videoCallBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  videoCallText: {
    fontSize: 12,
    color: '#10b981',
    marginLeft: 4,
    fontWeight: '500',
  },
  dateScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  dateCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 80,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedDateCard: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  dayText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  dayNumText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  selectedDateText: {
    color: '#ffffff',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeCard: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTimeCard: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  selectedTimeText: {
    color: '#ffffff',
  },
  reasonInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1e293b',
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  footer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  requestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    paddingVertical: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  requestButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VideoConferenceScreen;

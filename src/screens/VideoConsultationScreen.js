import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import DoctorCard from '../components/DoctorCard';
import FloatingChatButton from '../components/FloatingChatButton';
import { strings } from '../constants/strings';

export default function VideoConsultationScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [countdown, setCountdown] = useState(86400); // 24 hours in seconds

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'General Physician',
      status: 'available',
      consultationStatus: 'approved'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Cardiologist',
      status: 'available',
      consultationStatus: 'not_approved'
    },
    {
      id: 3,
      name: 'Dr. Emily Davis',
      specialty: 'Dermatologist',
      status: 'busy',
      consultationStatus: 'approved'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 86400);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status) => {
    const isApproved = status === 'approved';
    return (
      <View style={[styles.statusBadge, { backgroundColor: isApproved ? '#4CAF50' : '#FF9800' }]}>
        <Text style={styles.statusText}>
          {isApproved ? strings.approved : strings.notApproved}
        </Text>
      </View>
    );
  };

  const handleEmergencyCall = () => {
    console.log('Emergency video call initiated');
  };

  const handleBookConsultation = (doctor) => {
    console.log('Booking video consultation with:', doctor.name);
  };

  const handleChatPress = () => {
    console.log('Chat button pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Countdown Timer */}
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownLabel}>{strings.nextAvailable}</Text>
          <Text style={styles.countdownTime}>{formatTime(countdown)}</Text>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{strings.selectDate}</Text>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setSelectedDate('2024-08-15')}
          >
            <Icon name="calendar" size={20} color="#4A90E2" style={styles.dateIcon} />
            <Text style={styles.dateText}>
              {selectedDate || 'Select date'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{strings.selectTime}</Text>
          <View style={styles.timeSlots}>
            {['10:00 AM', '2:00 PM', '4:00 PM', '6:00 PM'].map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.selectedTimeSlot
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[
                  styles.timeSlotText,
                  selectedTime === time && styles.selectedTimeSlotText
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reason */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{strings.reason}</Text>
          <TextInput
            style={styles.reasonInput}
            placeholder="Describe your symptoms"
            placeholderTextColor="#9E9E9E"
            multiline
            numberOfLines={3}
            value={reason}
            onChangeText={setReason}
          />
        </View>

        {/* Available Doctors */}
        <View style={styles.doctorsSection}>
          <Text style={styles.sectionTitle}>Available Doctors</Text>
          {doctors.map((doctor) => (
            <View key={doctor.id} style={styles.doctorContainer}>
              <DoctorCard
                doctor={doctor}
                onPress={() => handleBookConsultation(doctor)}
                showBookButton={false}
              />
              {getStatusBadge(doctor.consultationStatus)}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Emergency Call Button */}
      <TouchableOpacity 
        style={styles.emergencyButton}
        onPress={handleEmergencyCall}
      >
        <Icon name="video" size={24} color="#fff" />
        <Text style={styles.emergencyButtonText}>{strings.emergencyCall}</Text>
      </TouchableOpacity>

      <FloatingChatButton onPress={handleChatPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    paddingBottom: 120,
  },
  countdownContainer: {
    backgroundColor: '#4A90E2',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  countdownLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  countdownTime: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  dateIcon: {
    marginRight: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    minWidth: 80,
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#333',
  },
  selectedTimeSlotText: {
    color: '#fff',
  },
  reasonInput: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  doctorsSection: {
    paddingHorizontal: 16,
  },
  doctorContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 24,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emergencyButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  emergencyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});

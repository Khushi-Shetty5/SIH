import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import FloatingChatButton from '../components/FloatingChatButton';
import { strings } from '../constants/strings';

export default function AppointmentScreen({ route }) {
  const [selectedDoctor, setSelectedDoctor] = useState(route?.params?.selectedDoctor?.name || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  const doctors = [
    'Dr. Sarah Johnson - General Physician',
    'Dr. Michael Chen - Cardiologist',
    'Dr. Emily Davis - Dermatologist',
    'Dr. Robert Wilson - Orthopedic',
    'Dr. Lisa Anderson - Pediatrician'
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleConfirmAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !reason) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    console.log('Appointment Details:', {
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      reason: reason
    });

    Alert.alert(
      'Success',
      'Appointment booked successfully!',
      [{ text: 'OK', onPress: () => {} }]
    );
  };

  const handleChatPress = () => {
    console.log('Chat button pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Doctor Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{strings.selectDoctor}</Text>
          <View style={styles.pickerContainer}>
            <Icon name="doctor" size={20} color="#4A90E2" style={styles.pickerIcon} />
            <Text style={styles.pickerText}>
              {selectedDoctor || 'Choose a doctor'}
            </Text>
            <Icon name="chevron-down" size={20} color="#9E9E9E" />
          </View>
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
            {timeSlots.map((time) => (
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
            placeholder="Describe your symptoms or reason for visit"
            placeholderTextColor="#9E9E9E"
            multiline
            numberOfLines={4}
            value={reason}
            onChangeText={setReason}
          />
        </View>

        {/* Confirm Button */}
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={handleConfirmAppointment}
        >
          <Text style={styles.confirmButtonText}>{strings.confirmAppointment}</Text>
        </TouchableOpacity>
      </ScrollView>
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
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  pickerContainer: {
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
  pickerIcon: {
    marginRight: 12,
  },
  pickerText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
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
  confirmButton: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    minHeight: 48,
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

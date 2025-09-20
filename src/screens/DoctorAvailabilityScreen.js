import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DoctorCard from '../components/DoctorCard';
import FloatingChatButton from '../components/FloatingChatButton';

export default function DoctorAvailabilityScreen({ navigation }) {
  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'General Physician',
      status: 'available',
      timeSlots: '9:00 AM - 5:00 PM'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Cardiologist',
      status: 'busy',
      timeSlots: '10:00 AM - 2:00 PM'
    },
    {
      id: 3,
      name: 'Dr. Emily Davis',
      specialty: 'Dermatologist',
      status: 'available',
      timeSlots: '11:00 AM - 6:00 PM'
    },
    {
      id: 4,
      name: 'Dr. Robert Wilson',
      specialty: 'Orthopedic',
      status: 'offline',
      timeSlots: 'Not available today'
    },
    {
      id: 5,
      name: 'Dr. Lisa Anderson',
      specialty: 'Pediatrician',
      status: 'available',
      timeSlots: '8:00 AM - 4:00 PM'
    }
  ];

  const handleBookAppointment = (doctor) => {
    console.log('Booking appointment with:', doctor.name);
    navigation.navigate('Appointment', { selectedDoctor: doctor });
  };

  const handleChatPress = () => {
    console.log('Chat button pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onPress={() => handleBookAppointment(doctor)}
          />
        ))}
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
    paddingVertical: 8,
    paddingBottom: 100,
  },
});

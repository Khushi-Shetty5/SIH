import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AppointmentBookingScreen = ({ navigation }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const doctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'General Medicine', rating: 4.8 },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Cardiology', rating: 4.9 },
    { id: 3, name: 'Dr. Emily Davis', specialty: 'Dermatology', rating: 4.7 },
  ];

  const availableDates = [
    { id: 1, date: '2024-01-15', day: 'Mon', dayNum: '15' },
    { id: 2, date: '2024-01-16', day: 'Tue', dayNum: '16' },
    { id: 3, date: '2024-01-17', day: 'Wed', dayNum: '17' },
    { id: 4, date: '2024-01-18', day: 'Thu', dayNum: '18' },
  ];

  const availableTimes = [
    '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select doctor, date, and time');
      return;
    }
    Alert.alert('Success', 'Appointment booked successfully!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Select Doctor */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Doctor</Text>
          {doctors.map((doctor) => (
            <TouchableOpacity
              key={doctor.id}
              style={[
                styles.doctorCard,
                selectedDoctor?.id === doctor.id && styles.selectedCard
              ]}
              onPress={() => setSelectedDoctor(doctor)}
            >
              <View style={styles.doctorInfo}>
                <View style={styles.doctorAvatar}>
                  <Ionicons name="person-outline" size={24} color="#64748b" />
                </View>
                <View style={styles.doctorDetails}>
                  <Text style={styles.doctorName}>{doctor.name}</Text>
                  <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#f59e0b" />
                    <Text style={styles.rating}>{doctor.rating}</Text>
                  </View>
                </View>
              </View>
              {selectedDoctor?.id === doctor.id && (
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Select Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
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
          <Text style={styles.sectionTitle}>Select Time</Text>
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
      </ScrollView>

      {/* Book Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookAppointment}>
          <Text style={styles.bookButtonText}>Book Appointment</Text>
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 4,
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
    minWidth: 60,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedDateCard: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
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
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  selectedTimeText: {
    color: '#ffffff',
  },
  footer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  bookButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AppointmentBookingScreen;

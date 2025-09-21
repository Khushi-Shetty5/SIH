import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

const DoctorAvailabilityScreen = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'General Medicine',
      rating: 4.8,
      status: 'available',
      nextAvailable: 'Now',
      schedule: [
        { day: 'Monday', time: '9:00 AM - 5:00 PM' },
        { day: 'Tuesday', time: '9:00 AM - 5:00 PM' },
        { day: 'Wednesday', time: '9:00 AM - 1:00 PM' },
        { day: 'Thursday', time: '9:00 AM - 5:00 PM' },
        { day: 'Friday', time: '9:00 AM - 3:00 PM' },
      ]
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      rating: 4.9,
      status: 'busy',
      nextAvailable: '2:00 PM',
      schedule: [
        { day: 'Monday', time: '10:00 AM - 6:00 PM' },
        { day: 'Tuesday', time: '10:00 AM - 6:00 PM' },
        { day: 'Wednesday', time: '10:00 AM - 4:00 PM' },
        { day: 'Thursday', time: '10:00 AM - 6:00 PM' },
        { day: 'Friday', time: '10:00 AM - 2:00 PM' },
      ]
    },
    {
      id: 3,
      name: 'Dr. Emily Davis',
      specialty: 'Dermatology',
      rating: 4.7,
      status: 'offline',
      nextAvailable: 'Tomorrow 9:00 AM',
      schedule: [
        { day: 'Monday', time: '9:00 AM - 4:00 PM' },
        { day: 'Tuesday', time: '9:00 AM - 4:00 PM' },
        { day: 'Wednesday', time: 'Off' },
        { day: 'Thursday', time: '9:00 AM - 4:00 PM' },
        { day: 'Friday', time: '9:00 AM - 2:00 PM' },
      ]
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return '#10b981';
      case 'busy':
        return '#f59e0b';
      case 'offline':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'busy':
        return 'Busy';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  const showDoctorDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerText}>Check real-time availability of doctors</Text>
        
        {doctors.map((doctor) => (
          <TouchableOpacity
            key={doctor.id}
            style={styles.doctorCard}
            onPress={() => showDoctorDetails(doctor)}
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
            
            <View style={styles.availabilityInfo}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(doctor.status) }]}>
                <Text style={styles.statusText}>{getStatusText(doctor.status)}</Text>
              </View>
              <Text style={styles.nextAvailableText}>Next: {doctor.nextAvailable}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Doctor Details Modal */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          {selectedDoctor && (
            <>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedDoctor.name}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.modalSpecialty}>{selectedDoctor.specialty}</Text>
              
              <View style={styles.modalStatusContainer}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedDoctor.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(selectedDoctor.status)}</Text>
                </View>
                <Text style={styles.nextAvailableText}>Next available: {selectedDoctor.nextAvailable}</Text>
              </View>
              
              <Text style={styles.scheduleTitle}>Weekly Schedule</Text>
              {selectedDoctor.schedule.map((item, index) => (
                <View key={index} style={styles.scheduleItem}>
                  <Text style={styles.scheduleDay}>{item.day}</Text>
                  <Text style={styles.scheduleTime}>{item.time}</Text>
                </View>
              ))}
              
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Book Appointment</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
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
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
  availabilityInfo: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  nextAvailableText: {
    fontSize: 12,
    color: '#64748b',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  modalSpecialty: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 16,
  },
  modalStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  scheduleDay: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  scheduleTime: {
    fontSize: 14,
    color: '#64748b',
  },
  bookButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DoctorAvailabilityScreen;

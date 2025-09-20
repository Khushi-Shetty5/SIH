import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { strings } from '../constants/strings';

export default function DoctorCard({ doctor, onPress, showBookButton = true }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#4CAF50';
      case 'busy': return '#FF9800';
      case 'offline': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available': return strings.available;
      case 'busy': return strings.busy;
      case 'offline': return strings.offline;
      default: return '';
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.doctorInfo}>
        <Icon name="user-md" size={24} color="#4A90E2" style={styles.icon} />
        <View style={styles.details}>
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialty}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(doctor.status) }]} />
            <Text style={styles.statusText}>{getStatusText(doctor.status)}</Text>
          </View>
          {doctor.timeSlots && (
            <Text style={styles.timeSlots}>{doctor.timeSlots}</Text>
          )}
        </View>
      </View>
      
      {showBookButton && doctor.status === 'available' && (
        <TouchableOpacity style={styles.bookButton} onPress={onPress}>
          <Text style={styles.bookButtonText}>{strings.bookNow}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 12,
    marginTop: 4,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  timeSlots: {
    fontSize: 12,
    color: '#4A90E2',
    marginTop: 4,
  },
  bookButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-end',
    marginTop: 8,
    minWidth: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

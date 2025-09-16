import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useDoctor } from '../context/DoctorContext';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function DoctorProfile({ navigation }) {
  const { doctorData } = useDoctor();
  
  // Debug: Log the doctor data to see what we're receiving
  React.useEffect(() => {
    console.log('DoctorProfile - doctorData:', doctorData);
  }, [doctorData]);
  
  if (!doctorData) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialIcons name="local-hospital" size={64} color="#3498db" />
        <Text style={styles.loadingText}>Loading doctor profile...</Text>
      </View>
    );
  }

  const handleCallDoctor = () => {
    if (doctorData.mobile) {
      Linking.openURL(`tel:${doctorData.mobile}`);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.avatarContainer}>
          <FontAwesome5 name="user-md" size={48} color="#fff" />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.doctorName}>{doctorData.name || 'Doctor Name'}</Text>
          <View style={styles.specialtyContainer}>
            <MaterialIcons name="local-hospital" size={18} color="#3498db" />
            <Text style={styles.specialty}>{doctorData.specialization || 'Specialization'}</Text>
          </View>
          <View style={styles.statusContainer}>
            <View style={[styles.statusDot, { backgroundColor: doctorData.availability ? '#27ae60' : '#e74c3c' }]} />
            <Text style={[styles.statusText, { color: doctorData.availability ? '#27ae60' : '#e74c3c' }]}>
              {doctorData.availability ? 'Available' : 'Not Available'}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
     

      {/* Information Cards */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="person-circle" size={24} color="#3498db" />
          <Text style={styles.sectionTitle}>Personal Information</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="person" size={20} color="#7f8c8d" />
          <Text style={styles.infoLabel}>Full Name</Text>
          <Text style={styles.infoValue}>{doctorData.name || 'Not available'}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="badge" size={20} color="#7f8c8d" />
          <Text style={styles.infoLabel}>Doctor ID</Text>
          <Text style={styles.infoValue}>{doctorData._id ? doctorData._id.slice(-8) : 'Not available'}</Text>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="work" size={20} color="#7f8c8d" />
          <Text style={styles.infoLabel}>Status</Text>
          <Text style={[styles.infoValue, { color: doctorData.status === 'active' ? '#27ae60' : '#e74c3c' }]}>
            {doctorData.status ? doctorData.status.charAt(0).toUpperCase() + doctorData.status.slice(1) : 'Not available'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="call" size={24} color="#3498db" />
          <Text style={styles.sectionTitle}>Contact Information</Text>
        </View>
        <TouchableOpacity style={styles.infoRow} onPress={handleCallDoctor}>
          <Ionicons name="phone-portrait" size={20} color="#7f8c8d" />
          <Text style={styles.infoLabel}>Mobile</Text>
          <Text style={[styles.infoValue, styles.phoneNumber]}>
            {doctorData.mobile || 'Not available'}</Text>
          
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="stats-chart" size={24} color="#3498db" />
          <Text style={styles.sectionTitle}>Practice Statistics</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#3498db' }]}>
              <Ionicons name="people" size={24} color="#fff" />
            </View>
            <Text style={styles.statNumber}>{doctorData.patients ? doctorData.patients.length : 0}</Text>
            <Text style={styles.statLabel}>Patients</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#9b59b6' }]}>
              <Ionicons name="document-text" size={24} color="#fff" />
            </View>
            <Text style={styles.statNumber}>{doctorData.reports ? doctorData.reports.length : 0}</Text>
            <Text style={styles.statLabel}>Reports</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#e74c3c' }]}>
              <Ionicons name="alert-circle" size={24} color="#fff" />
            </View>
            <Text style={styles.statNumber}>{doctorData.emergencies ? doctorData.emergencies.length : 0}</Text>
            <Text style={styles.statLabel}>Emergencies</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  headerSection: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundColor: '#3498db',
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  specialtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  specialty: {
    fontSize: 16,
    color: '#ecf0f1',
    marginLeft: 6,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageButton: {
    backgroundColor: '#3498db',
  },
  emailButton: {
    backgroundColor: '#9b59b6',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 14,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  infoLabel: {
    flex: 1,
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 12,
    fontWeight: '500',
  },
  infoValue: {
    flex: 2,
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: '600',
    textAlign: 'right',
  },
  phoneNumber: {
    color: '#3498db',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 4,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
    textAlign: 'center',
  },
});
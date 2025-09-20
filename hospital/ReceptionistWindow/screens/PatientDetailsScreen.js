import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { commonStyles } from '../../../theme/styles';
import { getPatientById, getEmergencyById, assignDoctorToEmergency } from '../services/patientService';
import { getDoctorsByDepartment } from '../services/doctorService';
import PatientCard from '../components/PatientCard';
import SectionHeader from '../components/SectionHeader';

const PatientDetailsScreen = ({ navigation, route }) => {
  const { patientId, emergencyId } = route.params;
  const [patient, setPatient] = useState(null);
  const [emergency, setEmergency] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    loadPatientData();
  }, []);

  const loadPatientData = () => {
    const patientData = getPatientById(patientId);
    const emergencyData = emergencyId ? getEmergencyById(emergencyId) : null;
    const doctorsData = getDoctorsByDepartment();
    
    setPatient(patientData);
    setEmergency(emergencyData);
    setDoctors(doctorsData);
  };

  const handleAssignDoctor = () => {
    if (!selectedDoctor) {
      Alert.alert('Error', 'Please select a doctor first');
      return;
    }

    if (emergency) {
      const success = assignDoctorToEmergency(emergency.id, selectedDoctor.id);
      if (success) {
        Alert.alert(
          'Success',
          `Emergency assigned to ${selectedDoctor.name}`,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to assign doctor');
      }
    }
  };

  const handleScheduleConsultation = () => {
    navigation.navigate('ScheduleConsultation', { 
      patientId: patientId,
      patientName: patient?.name 
    });
  };

  const handleStartVideoCall = () => {
    navigation.navigate('VideoConsultation', {
      patientId: patientId,
      patientName: patient?.name
    });
  };

  const getDepartmentDoctors = () => {
    if (!selectedDepartment) return doctors;
    return doctors.filter(doctor => doctor.department === selectedDepartment);
  };

  const getDepartments = () => {
    const departments = [...new Set(doctors.map(doctor => doctor.department))];
    return departments;
  };

  if (!patient) {
    return (
      <SafeAreaView style={commonStyles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading patient details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Patient Details</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Emergency Alert */}
        {emergency && (
          <View style={[styles.alertCard, { backgroundColor: colors.emergencyHigh + '20' }]}>
            <Text style={styles.alertTitle}>🚨 Emergency Case</Text>
            <Text style={styles.alertText}>{emergency.issue}</Text>
            <Text style={styles.alertTime}>
              Reported: {new Date(emergency.timestamp).toLocaleString()}
            </Text>
          </View>
        )}

        {/* Patient Information */}
        <PatientCard patient={patient} showFullDetails={true} />

        {/* Emergency Actions */}
        {emergency && (
          <View style={styles.actionsSection}>
            <SectionHeader title="Emergency Actions" icon="🚨" />
            
            {/* Assign Doctor */}
            <View style={styles.actionCard}>
              <Text style={styles.actionTitle}>Assign Doctor</Text>
              <Text style={styles.actionDescription}>
                Select a doctor to handle this emergency case
              </Text>
              
              <TouchableOpacity
                style={styles.doctorSelector}
                onPress={() => setShowDoctorModal(true)}
              >
                <Text style={styles.doctorSelectorText}>
                  {selectedDoctor ? selectedDoctor.name : 'Select Doctor'}
                </Text>
                <Text style={styles.doctorSelectorArrow}>▼</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[commonStyles.primaryButton, styles.assignButton]}
                onPress={handleAssignDoctor}
                disabled={!selectedDoctor}
              >
                <Text style={commonStyles.primaryButtonText}>
                  Assign to Doctor
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* General Actions */}
        <View style={styles.actionsSection}>
          <SectionHeader title="Actions" icon="⚡" />
          
          <TouchableOpacity
            style={[commonStyles.secondaryButton, styles.actionButton]}
            onPress={handleScheduleConsultation}
          >
            <Text style={commonStyles.secondaryButtonText}>
              📅 Schedule Consultation
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[commonStyles.secondaryButton, styles.actionButton]}
            onPress={handleStartVideoCall}
          >
            <Text style={commonStyles.secondaryButtonText}>
              📹 Start Video Call
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Doctor Selection Modal */}
      <Modal
        visible={showDoctorModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowDoctorModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Doctor</Text>
            <View style={styles.modalHeaderRight} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            {getDepartments().map((department) => (
              <View key={department} style={styles.departmentSection}>
                <Text style={styles.departmentTitle}>{department}</Text>
                {doctors
                  .filter(doctor => doctor.department === department)
                  .map((doctor) => (
                    <TouchableOpacity
                      key={doctor.id}
                      style={[
                        styles.doctorOption,
                        selectedDoctor?.id === doctor.id && styles.doctorOptionSelected
                      ]}
                      onPress={() => {
                        setSelectedDoctor(doctor);
                        setShowDoctorModal(false);
                      }}
                    >
                      <View style={styles.doctorOptionInfo}>
                        <Text style={styles.doctorOptionName}>{doctor.name}</Text>
                        <Text style={styles.doctorOptionSpecialization}>
                          {doctor.specialization}
                        </Text>
                        <Text style={styles.doctorOptionAvailability}>
                          {doctor.availability === 'available' ? '✅ Available' : 
                           doctor.availability === 'busy' ? '❌ Busy' : '💤 Unavailable'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: typography.h5,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerRight: {
    width: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  alertCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.emergencyHigh,
  },
  alertTitle: {
    fontSize: typography.h6,
    fontWeight: 'bold',
    color: colors.emergencyHigh,
    marginBottom: 8,
  },
  alertText: {
    fontSize: typography.body,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  alertTime: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
  actionsSection: {
    marginTop: 24,
  },
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    // Use boxShadow for better cross-platform compatibility
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  actionTitle: {
    fontSize: typography.h6,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  doctorSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  doctorSelectorText: {
    fontSize: typography.body,
    color: colors.textPrimary,
  },
  doctorSelectorArrow: {
    fontSize: typography.body,
    color: colors.textLight,
  },
  assignButton: {
    marginTop: 0,
  },
  actionButton: {
    marginVertical: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalCloseButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  modalCloseText: {
    fontSize: typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: typography.h5,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  modalHeaderRight: {
    width: 60,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  departmentSection: {
    marginBottom: 24,
  },
  departmentTitle: {
    fontSize: typography.h6,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  doctorOption: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  doctorOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  doctorOptionInfo: {
    flex: 1,
  },
  doctorOptionName: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  doctorOptionSpecialization: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  doctorOptionAvailability: {
    fontSize: typography.caption,
    color: colors.textLight,
  },
});

export default PatientDetailsScreen;

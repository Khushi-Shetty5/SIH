import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { commonStyles } from '../../../theme/styles';
import { getPatientById } from '../services/patientService';
import { getDoctorsByDepartment } from '../services/doctorService';
import { scheduleAppointment, getAvailableTimeSlots, consultationTypes } from '../services/appointmentService';
import ScheduleCard from '../components/ScheduleCard';
import SectionHeader from '../components/SectionHeader';
import { Icons } from '../components/Icon';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const formatDate = (date) => {
  if (!(date instanceof Date) || isNaN(date)) return {
    iso: '',
    day: '',
    display: 'Invalid Date',
  };
  const year = date.getFullYear();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); 

  return {
    iso: `${year}-${month}-${day}`, 
    day: date.toLocaleDateString('en-US', { weekday: 'short' }), 
    display: `${day}/${month}/${year}` 
  };
};

const ScheduleConsultationScreen = ({ navigation, route }) => {
  const { patientId } = route.params || {};
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedType, setSelectedType] = useState('video');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    const doctorsData = getDoctorsByDepartment();
    setDoctors(doctorsData);

    if (patientId) {
      const patient = getPatientById(patientId);
      setSelectedPatient(patient);
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(false);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorModal(false);
    setSelectedDate('');
    setSelectedTime('');
    loadAvailableSlots(doctor.id);
  };

  // ✅ Generate 7 days with safe formatting
  const loadAvailableSlots = (doctorId) => {
    const today = new Date();
    const dates = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const formatted = formatDate(date);

      dates.push({
        iso: formatted.iso,
        day: formatted.day,
        display: formatted.display,
      });
    }

    setAvailableSlots(dates);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleSchedule = () => {
    if (!selectedPatient) {
      Alert.alert('Error', 'Please select a patient');
      return;
    }
    if (!selectedDoctor) {
      Alert.alert('Error', 'Please select a doctor');
      return;
    }
    if (!selectedDate) {
      Alert.alert('Error', 'Please select a date');
      return;
    }
    if (!selectedTime) {
      Alert.alert('Error', 'Please select a time');
      return;
    }

    const appointmentData = {
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      department: selectedDoctor.department,
      type: selectedType,
      date: selectedDate,
      time: selectedTime,
      notes: `Scheduled consultation for ${selectedPatient.name}`,
      duration: 30
    };

    scheduleAppointment(appointmentData);

    Alert.alert(
      'Success',
      'Consultation scheduled successfully!',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Appointments')
        }
      ]
    );
  };

  const getAvailableTimes = () => {
    if (!selectedDoctor || !selectedDate) return [];
    return getAvailableTimeSlots(selectedDoctor.id, selectedDate);
  };

  const getDepartments = () => {
    return [...new Set(doctors.map(doctor => doctor.department))];
  };

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
          <Text style={styles.headerTitle}>Schedule Consultation</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Patient Selection */}
        <SectionHeader title="Select Patient" icon={<Text>👤</Text>} />
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setShowPatientModal(true)}
        >
          <Text style={styles.selectorText}>
            {selectedPatient ? selectedPatient.name : 'Select Patient'}
          </Text>
          <Text style={styles.selectorArrow}>▼</Text>
        </TouchableOpacity>

        {/* Doctor Selection */}
        <SectionHeader title="Select Doctor" icon={<Text>👨‍⚕️</Text>} />
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setShowDoctorModal(true)}
        >
          <Text style={styles.selectorText}>
            {selectedDoctor ? selectedDoctor.name : 'Select Doctor'}
          </Text>
          <Text style={styles.selectorArrow}>▼</Text>
        </TouchableOpacity>

        {/* Consultation Type */}
        <SectionHeader title="Consultation Type" icon={<Text>📞</Text>} />
        <View style={styles.typeContainer}>
          {consultationTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeButton,
                selectedType === type.id && styles.typeButtonSelected
              ]}
              onPress={() => setSelectedType(type.id)}
            >
              <MaterialIcons 
                name={type.icon} 
                size={24} 
                color={selectedType === type.id ? '#fff' : '#333'} 
                style={styles.typeIcon} 
              />
              <Text style={[
                styles.typeText,
                selectedType === type.id && styles.typeTextSelected
              ]}>
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

      {selectedDoctor && (
        <>
          <SectionHeader title="Select Date" icon={<Icons.calendar />} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateScrollView}
          >
            {availableSlots.map((slot) => (
              <ScheduleCard
                key={slot.iso}
                slot={{
                  day: slot.day,        
                  date: slot.display   
                }}
                isSelected={selectedDate === slot.iso}  
                onPress={() => handleDateSelect(slot.iso)} 
              />
            ))}
          </ScrollView>
        </>
      )}

        {/* Time Selection */}
        {selectedDate && (
          <>
            <SectionHeader title="Select Time" icon={<Text>⏰</Text>} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeScrollView}>
              {getAvailableTimes().map((time) => (
                <ScheduleCard
                  key={time}
                  slot={{ time }}
                  isSelected={selectedTime === time}
                  onPress={() => handleTimeSelect(time)}
                />
              ))}
            </ScrollView>
          </>
        )}

        {/* Schedule Button */}
        <TouchableOpacity
          style={[commonStyles.primaryButton, styles.scheduleButton]}
          onPress={handleSchedule}
        >
          <Text style={commonStyles.primaryButtonText}>Schedule Consultation</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Patient Selection Modal */}
      <Modal
        visible={showPatientModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowPatientModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Patient</Text>
            <View style={styles.modalHeaderRight} />
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalNote}>
              Patient selection would typically show a list of registered patients.
              For demo purposes, we'll use a sample patient.
            </Text>
            <TouchableOpacity
              style={styles.patientOption}
              onPress={() => handlePatientSelect({ id: '1', name: 'John Smith' })}
            >
              <Text style={styles.patientOptionName}>John Smith</Text>
              <Text style={styles.patientOptionDetails}>Male, 45 years old</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

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
                      onPress={() => handleDoctorSelect(doctor)}
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
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectorText: {
    fontSize: typography.body,
    color: colors.textPrimary,
  },
  selectorArrow: {
    fontSize: typography.body,
    color: colors.textLight,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  typeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  typeText: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  typeTextSelected: {
    color: colors.textWhite,
  },
  dateScrollView: {
    marginVertical: 8,
  },
  timeScrollView: {
    marginVertical: 8,
  },
  scheduleButton: {
    marginTop: 32,
    marginBottom: 16,
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
  modalNote: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginBottom: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  patientOption: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
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
  patientOptionName: {
    fontSize: typography.h6,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  patientOptionDetails: {
    fontSize: typography.body,
    color: colors.textSecondary,
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

export default ScheduleConsultationScreen;

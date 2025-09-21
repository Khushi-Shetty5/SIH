import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import DateTimePicker from '@react-native-community/datetimepicker';

import { fetchDoctors, fetchSlots, bookAppointment } from '../services/api';
import { sendOfflineSms } from '../services/sms';
import SpeakButton from '../components/SpeakButton';
import FloatingChatButton from '../components/FloatingChatButton.js';
import { strings } from '../constants/strings';

export default function AppointmentScreen({ route, navigation }) {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(route?.params?.selectedDoctor || null);
  const [showDoctorList, setShowDoctorList] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [reason, setReason] = useState('');
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    fetchDoctors()
      .then(setDoctors)
      .catch(() => Alert.alert('Error', 'Failed to load doctors'));
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchSlots(selectedDoctor.id, selectedDate)
        .then(setTimeSlots)
        .catch(() => Alert.alert('Error', 'Failed to load time slots'));
    } else {
      setTimeSlots([]);
    }
  }, [selectedDoctor, selectedDate]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const validateFields = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !reason) {
      Alert.alert('Error', 'Please fill all fields');
      return false;
    }
    return true;
  };

  const handleBookOnline = async () => {
    if (!validateFields()) return;

    try {
      const appointmentData = {
        doctor: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
        reason,
      };
      await bookAppointment(appointmentData);
      Alert.alert('Success', 'Appointment booked online');
    } catch {
      Alert.alert('Error', 'Failed to book appointment online');
    }
  };

  const handleBookViaSms = () => {
    if (!validateFields()) return;
    sendOfflineSms(selectedDoctor, selectedDate, selectedTime, reason);
  };

  const handleCallTollFree = () => {
    Linking.openURL('tel:18001234567');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.sectionTitle}>{strings.selectDoctorText}</Text>
            <SpeakButton text={strings.selectDoctorText} />
          </View>
          {doctors.length === 0 ? (
            <Text>Loading doctors...</Text>
          ) : (
            <>
              <TouchableOpacity onPress={() => setShowDoctorList(true)} style={styles.picker}>
                <Text style={styles.pickerText}>
                  {selectedDoctor?.name || 'Choose a doctor'}
                </Text>
                <Icon name="chevron-down" size={20} />
              </TouchableOpacity>
              {showDoctorList && (
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    {doctors.map((doc) => (
                      <TouchableOpacity
                        key={doc.id}
                        onPress={() => {
                          setSelectedDoctor(doc);
                          setShowDoctorList(false);
                        }}
                        style={styles.doctorItem}
                      >
                        <Text>{doc.name}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={() => setShowDoctorList(false)} style={styles.cancelBtn}>
                      <Text>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
          )}
        </View>

        <View style={styles.section}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.sectionTitle}>{strings.selectDateText}</Text>
            <SpeakButton text={strings.selectDateText} />
          </View>

          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
            <Text>{selectedDate || 'Select date'}</Text>
            <Icon name="calendar" size={20} />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate ? new Date(selectedDate) : new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setSelectedDate(date.toISOString().split('T')[0]);
              }}
              minimumDate={new Date()}
            />
          )}
        </View>

        <View style={styles.section}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.sectionTitle}>{strings.selectTimeText}</Text>
            <SpeakButton text={strings.selectTimeText} />
          </View>

          <View style={styles.timeSlotsContainer}>
            {timeSlots.length === 0 ? (
              <Text style={{ color: '#888' }}>Please select doctor and date</Text>
            ) : (
              timeSlots.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    selectedTime === time ? styles.timeSlotSelected : null,
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={selectedTime === time ? styles.timeSlotTextSelected : null}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.sectionTitle}>{strings.reasonForVisit}</Text>
            <SpeakButton text={strings.reasonForVisit} />
          </View>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={4}
            value={reason}
            onChangeText={setReason}
            placeholder="Enter reason for visit"
          />
        </View>

        {isConnected ? (
          <TouchableOpacity style={styles.confirmButton} onPress={handleBookOnline}>
            <Text style={styles.confirmButtonText}>Confirm Appointment</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.smsButton} onPress={handleBookViaSms}>
              <Text style={styles.smsButtonText}>Book via SMS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.callButton} onPress={handleCallTollFree}>
              <Text style={styles.callButtonText}>Call Toll-Free</Text>
            </TouchableOpacity>
          </>
        )}

        <FloatingChatButton />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  section: { marginVertical: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold' },
  picker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#aaa',
  },
  pickerText: { fontSize: 16 },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
  },
  doctorItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  cancelBtn: { marginTop: 10, alignItems: 'center' },
  datePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#aaa',
  },
  timeSlotsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  timeSlot: {
    backgroundColor: '#eee',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  timeSlotSelected: {
    backgroundColor: '#007AFF',
  },
  timeSlotTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top',
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  smsButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  smsButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  callButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  callButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

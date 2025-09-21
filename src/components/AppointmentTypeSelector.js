import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, Linking, Platform } from 'react-native';
import { useNetwork } from './NetworkProvider.js';
import { Camera } from 'expo-camera';
import SpeakButton from '../components/SpeakButton.js'; // Import SpeakButton here

export default function AppointmentTypeSelector({ selectedType, onSelectType, isOnline, hospitalSmsNumber, ivrNumber }) {
  const { isConnected } = useNetwork();
  const [hasCamera, setHasCamera] = useState(false);
  const [videoDisabled, setVideoDisabled] = useState(false);
  const [showOfflineForm, setShowOfflineForm] = useState(false);

  // Offline form fields
  const [symptoms, setSymptoms] = useState('');
  const [doctorPref, setDoctorPref] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');

  // Request camera permission when user clicks video
  const requestCameraPermission = async () => {
    const { status } = await Camera.getCameraPermissionsAsync();

    switch (status) {
      case 'granted':
        setHasCamera(true);
        return true;

      case 'undetermined':
      case 'denied': {
        const { status: newStatus } = await Camera.requestCameraPermissionsAsync();
        if (newStatus === 'granted') {
          setHasCamera(true);
          return true;
        } else {
          setVideoDisabled(true);
          Alert.alert(
            'Camera Permission Denied',
            'Camera access is required for video consultations. You can enable it later in the device settings.'
          );
          return false;
        }
      }

      case 'blocked':
        setVideoDisabled(true);
        Alert.alert(
          'Camera Permission Blocked',
          'Camera permission is blocked. Please enable it manually in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return false;

      default:
        return false;
    }
  };

  const handleSelect = async (type) => {
  if (type === 'video') {
    if (!isConnected) {
      Alert.alert('Unavailable', 'Video Consultation requires internet connection.');
      return;
    }

    if (videoDisabled) {
      Alert.alert('Unavailable', 'Video consultation is disabled due to permission denial.');
      return;
    }

    const permissionGranted = await requestCameraPermission();

    if (!permissionGranted) {
      return; // Don't select video if permission denied
    }
  }

  
  onSelectType(type);
};


  const sendSms = (phone, message) => {
    const url =
      Platform.OS === 'android'
        ? `sms:${phone}?body=${encodeURIComponent(message)}`
        : `sms:${phone}&body=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open SMS app.'));
  };

  const submitOfflineBooking = () => {
    if (!symptoms.trim() || !name.trim() || !contact.trim()) {
      Alert.alert('Validation Error', 'Please fill all required fields.');
      return;
    }
    if (!hospitalSmsNumber) {
      Alert.alert('Error', 'Hospital SMS number not configured.');
      return;
    }

    const smsContent = `Booking Request
Symptoms: ${symptoms}
Doctor Preference: ${doctorPref}
Name: ${name}
Contact: ${contact}`;
    sendSms(hospitalSmsNumber, smsContent);
    Alert.alert('Booking Sent', 'Your booking request has been sent via SMS.');
    setShowOfflineForm(false);
    onSelectType('offline_physical');
  };

  const callIVR = () => {
    if (!ivrNumber) return Alert.alert('Error', 'IVR number not available.');
    Linking.openURL(`tel:${ivrNumber}`).catch(() => Alert.alert('Error', 'Could not call IVR.'));
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.button,
          selectedType === 'video' && styles.selectedButton,
          (!isConnected || videoDisabled) && styles.disabledButton,
        ]}
        onPress={() => handleSelect('video')}
        disabled={!isConnected || videoDisabled}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text
            style={[
              styles.buttonText,
              selectedType === 'video' && styles.selectedButtonText,
              (!isConnected || videoDisabled) && styles.disabledText,
            ]}
          >
            Video Consultation
          </Text>
          <SpeakButton text="Video Consultation" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, selectedType === 'physical' && styles.selectedButton]}
        onPress={() => handleSelect('physical')}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text
            style={[
              styles.buttonText,
              selectedType === 'physical' && styles.selectedButtonText,
            ]}
          >
            Physical Checkup
          </Text>
          <SpeakButton text="Physical Checkup" />
        </View>
      </TouchableOpacity>

      {/* {!isConnected && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Internet not detected. Please book via SMS or IVR.</Text>
          <TouchableOpacity style={styles.linkButton} onPress={() => setShowOfflineForm(true)}>
            <Text style={styles.linkText}>Book via SMS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkButton} onPress={callIVR}>
            <Text style={styles.linkText}>Call IVR Toll-Free</Text>
          </TouchableOpacity>
        </View>
      )} */}

      <Modal visible={showOfflineForm} animationType="slide" transparent>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Offline Booking Form</Text>

          <TextInput
            placeholder="Symptoms"
            style={styles.input}
            value={symptoms}
            onChangeText={setSymptoms}
            multiline
            numberOfLines={3}
          />
          <TextInput
            placeholder="Doctor Preference"
            style={styles.input}
            value={doctorPref}
            onChangeText={setDoctorPref}
          />
          <TextInput placeholder="Name" style={styles.input} value={name} onChangeText={setName} />
          <TextInput
            placeholder="Contact Number"
            keyboardType="phone-pad"
            style={styles.input}
            value={contact}
            onChangeText={setContact}
          />

          <TouchableOpacity style={styles.submitButton} onPress={submitOfflineBooking}>
            <Text style={styles.submitButtonText}>Send Booking Request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setShowOfflineForm(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: '#007bff', padding: 15, marginVertical: 10, borderRadius: 8 },
  selectedButton: { backgroundColor: '#0056b3' },
  selectedButtonText: { color: 'white' },
  disabledButton: { backgroundColor: '#ccc' },
  buttonText: { color: 'white', textAlign: 'center', fontSize: 18 },
  disabledText: { color: '#666' },
  banner: { marginTop: 20, padding: 15, backgroundColor: '#ffdddd', borderRadius: 6, alignItems: 'center' },
  bannerText: { color: '#800000', marginBottom: 10, fontWeight: '600' },
  linkButton: { marginVertical: 5, padding: 10, backgroundColor: '#d9534f', borderRadius: 6, width: '60%', alignItems: 'center' },
  linkText: { color: 'white', textAlign: 'center', fontSize: 16 },
  modal: { flex: 1, backgroundColor: 'white', margin: 20, padding: 20, borderRadius: 10, justifyContent: 'center' },
  modalTitle: { fontSize: 20, marginBottom: 15, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#999', borderRadius: 6, padding: 10, marginBottom: 15 },
  submitButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, marginBottom: 10 },
  submitButtonText: { color: 'white', textAlign: 'center', fontSize: 18 },
  cancelButton: { backgroundColor: '#6c757d', padding: 15, borderRadius: 8 },
  cancelButtonText: { color: 'white', textAlign: 'center', fontSize: 16 },
});

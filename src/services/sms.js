import { Linking, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storePendingAppointment } from './storage';

const hospitalNumber = '+918217018706';

export const formatSmsMessage = (profile, reason, date, doctor, time) => {
  const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
  return `Booking Request
UserID: ${profile.id}
Name: ${profile.name}
Phone: ${profile.phone}
Reason: ${reason}
Date: ${dateStr}
Doctor: ${doctor || 'Any'}
Time: ${time || 'Any'}`;
};

// Sends SMS using device's native SMS app prefilled with booking message
export const sendSmsBooking = async (message) => {
  try {
    const url = `sms:${hospitalNumber}${Platform.OS === 'ios' ? '&' : '?'}body=${encodeURIComponent(message)}`;

    // Check if device can open SMS URL
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert('Error', 'SMS app is not available on this device');
      return;
    }

    // Open native SMS app with the filled message
    await Linking.openURL(url);
  } catch (error) {
    Alert.alert('Error', `Failed to open SMS app: ${error.message}`);
  }
};

// Send offline SMS appointment - this is what AppointmentScreen calls
export const sendOfflineSms = async (doctor, date, time, reason) => {
  try {
    // Save to pending appointments for tracking
    const appointmentData = {
      id: Date.now().toString(),
      doctor: doctor,
      date: date,
      time: time,
      reason: reason,
      status: 'pending_sms',
      createdAt: new Date().toISOString()
    };
    
    await storePendingAppointment(appointmentData);
    
    // Create SMS message
    const message = `Booking Request
Doctor: ${doctor?.name || 'Any available'}
Date: ${date}
Time: ${time}
Reason: ${reason}
Patient ID: ${appointmentData.id}`;
    
    // Open SMS app
    const url = `sms:${hospitalNumber}${Platform.OS === 'ios' ? '&' : '?'}body=${encodeURIComponent(message)}`;
    
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert('Error', 'SMS app is not available on this device');
      return;
    }

    await Linking.openURL(url);
    
    Alert.alert(
      'SMS Booking', 
      'SMS app opened. Please send the message to complete your booking request.'
    );
    
  } catch (error) {
    console.error('SMS booking error:', error);
    Alert.alert('Error', `Failed to create SMS booking: ${error.message}`);
  }
};

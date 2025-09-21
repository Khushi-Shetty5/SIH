// src/services/storage.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking, Platform } from 'react-native';

const PENDING_APPOINTMENTS_KEY = 'PENDING_APPOINTMENTS';
const hospitalNumber = '+918217018706';
const USER_KEY = 'LOGGED_IN_USER';

export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user data', e);
  }
};

export const getUser = async () => {
  try {
    const json = await AsyncStorage.getItem(USER_KEY);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    console.error('Failed to get user data', e);
    return null;
  }
};
// Store a single appointment locally (append to the list)
export const storePendingAppointment = async (appointment) => {
  try {
    const stored = await AsyncStorage.getItem(PENDING_APPOINTMENTS_KEY);
    const pending = stored ? JSON.parse(stored) : [];
    pending.push(appointment);
    await AsyncStorage.setItem(PENDING_APPOINTMENTS_KEY, JSON.stringify(pending));
    console.log('Stored appointment offline:', appointment);
    const pendings = await getPendingAppointments();
    console.log('All pending appointments:', pendings);
  } catch (e) {
    console.error('Error storing pending appointment', e);
  }
};

// Get all pending appointments from local storage
export const getPendingAppointments = async () => {
  try {
    const stored = await AsyncStorage.getItem(PENDING_APPOINTMENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error getting pending appointments', e);
    return [];
  }
};

// Clear all pending appointments locally
export const clearPendingAppointments = async () => {
  try {
    await AsyncStorage.removeItem(PENDING_APPOINTMENTS_KEY);
  } catch (e) {
    console.error('Error clearing pending appointments', e);
  }
};

// Bulk replace pending appointments array (useful for sync retries)
export const storePendingAppointmentsBulk = async (appointmentsArray) => {
  try {
    await AsyncStorage.setItem(PENDING_APPOINTMENTS_KEY, JSON.stringify(appointmentsArray));
  } catch (e) {
    console.error('Error storing bulk pending appointments', e);
  }
};

// Format SMS message text to send for appointment booking
export const formatSmsMessage = (profile, reason, date, doctor, time) => {
  const dateStr = date.toISOString().split('T')[0];
  return `Booking Request
UserID: ${profile.id}
Name: ${profile.name}
Phone: ${profile.phone}
Reason: ${reason}
Date: ${dateStr}
Doctor: ${doctor || 'Any'}
Time: ${time || 'Any'}`;
};

// Open system SMS app prefilled with hospital number and booking message
export const sendSmsBooking = async (reason, date, doctor, time) => {
  try {
    const jsonProfile = await AsyncStorage.getItem('USER_PROFILE');
    if (!jsonProfile) throw new Error('User profile not found. Please register first.');

    const profile = JSON.parse(jsonProfile);
    const message = formatSmsMessage(profile, reason, date, doctor, time);

    const url = Platform.OS === 'android'
      ? `sms:${hospitalNumber}?body=${encodeURIComponent(message)}`
      : `sms:${hospitalNumber}&body=${encodeURIComponent(message)}`;

    await Linking.openURL(url);
  } catch (e) {
    console.error('Error preparing SMS booking:', e);
    alert('Error preparing SMS booking: ' + e.message);
  }
};

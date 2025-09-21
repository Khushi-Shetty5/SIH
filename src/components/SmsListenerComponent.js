import React, { useEffect } from 'react';
import SmsListener from 'react-native-android-sms-listener';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import emitter from '../utils/EventEmitter';

 
const hospitalNumber = '+918217018706';
const PENDING_APPOINTMENTS_KEY = 'PENDING_SMS_APPOINTMENTS';

const requestSmsPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      const grantedRead = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
      );
      const grantedReceive = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      );
      if (
        grantedRead !== PermissionsAndroid.RESULTS.GRANTED ||
        grantedReceive !== PermissionsAndroid.RESULTS.GRANTED
      ) {
        Alert.alert('Permissions Denied', 'SMS read/receive permissions are required for approval updates.');
      }
    } catch (err) {
      console.warn('SMS permission error:', err);
    }
  }
};

const markAppointmentApproved = async (appointmentId) => {
  try {
    const stored = await AsyncStorage.getItem(PENDING_APPOINTMENTS_KEY);
    console.log('Pending appointments before update:', stored);
    if (!stored) return;

    let appointments = JSON.parse(stored);
    let updated = false;
    appointments = appointments.map(appt => {
      if (appt.id && appt.id.toString() === appointmentId) {
        updated = true;
        return { ...appt, status: 'approved' };
      }
      return appt;
    });

    if (updated) {
      await AsyncStorage.setItem(PENDING_APPOINTMENTS_KEY, JSON.stringify(appointments));
      console.log('Pending appointments updated:', appointments);
      Alert.alert('Appointment Approved', 'Your hospital booking was approved!');
      emitter.emit('appointmentApproved'); // emit event to update UI
    }
  } catch (err) {
    console.error('Error updating appointment:', err);
  }
};

export default function SmsListenerComponent() {
  useEffect(() => {
    // Show iOS alert if on iOS
    if (Platform.OS === 'ios') {
      Alert.alert(
        'SMS Listener Unavailable',
        'Due to iOS restrictions, automatic SMS reading is disabled. Please manually check SMS for appointment approval.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Request permissions for Android
    requestSmsPermissions();

    // Only set up listener on Android
    if (Platform.OS === 'android') {
      const subscription = SmsListener.addListener(async (message) => {
        try {
          if (
            message.originatingAddress === hospitalNumber &&
            message.body.includes('Booking Approved')
          ) {
            const match = message.body.match(/Appointment ID[:\s]*([0-9]+)/i);
            if (match && match[1]) {
              const appointmentId = match[1];

              const pendingStr = await AsyncStorage.getItem(PENDING_APPOINTMENTS_KEY);
              if (!pendingStr) return;

              let appointments = JSON.parse(pendingStr);
              let updated = false;

              appointments = appointments.map((appt) => {
                if (appt.id && appt.id.toString() === appointmentId) {
                  updated = true;
                  return { ...appt, status: 'approved' };
                }
                return appt;
              });

              if (updated) {
                await AsyncStorage.setItem(PENDING_APPOINTMENTS_KEY, JSON.stringify(appointments));
                emitter.emit('appointmentApproved');
                Alert.alert('Appointment Approved', 'Your hospital booking was approved!');
              }
            }
          }
        } catch (error) {
          console.error('Error in SMS listener:', error);
        }
      });

      return () => subscription.remove();
    }
  }, []);

  return null;
}

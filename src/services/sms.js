import { Linking, Platform, Alert } from 'react-native';

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

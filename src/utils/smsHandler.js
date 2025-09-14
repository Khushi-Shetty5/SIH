import { Linking } from 'react-native';

export const sendSMS = (order) => {
  const message = `Order: ${JSON.stringify(order)}`;
  Linking.openURL(`sms:+1234567890?body=${encodeURIComponent(message)}`);
};
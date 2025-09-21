import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import AppNavigator from './src/AppNavigator';
import { NetworkProvider } from './src/components/NetworkProvider.js';
import SmsListenerComponent from './src/components/SmsListenerComponent';
import { setupSyncOnReconnect } from './src/services/sync.js';  // ✅ make sure path is correct

// ✅ Request Android SMS permissions
async function requestSmsPermissions() {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
      ]);

      const allGranted =
        granted['android.permission.RECEIVE_SMS'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.READ_SMS'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.SEND_SMS'] === PermissionsAndroid.RESULTS.GRANTED;

      if (allGranted) {
        Alert.alert('Permissions granted', 'SMS permissions granted successfully');
      } else {
        Alert.alert('Permission denied', 'SMS permissions were denied');
      }
    } catch (err) {
      console.warn('SMS permission error:', err);
    }
  }
}

export default function App() {
  useEffect(() => {
    requestSmsPermissions();     // ✅ Ask for SMS permissions on app start
    setupSyncOnReconnect();      // ✅ Re-sync data when network reconnects
  }, []);

  return (
    <SafeAreaProvider>
      <NetworkProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <AppNavigator />
        </NavigationContainer>
        <SmsListenerComponent />
      </NetworkProvider>
    </SafeAreaProvider>
  );
}

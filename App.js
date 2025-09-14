import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/AppNavigator';
import PharmacyNavigator from './src/PharmacyNavigator';
import LanguageProvider from './src/utils/LanguageContext'; // Adjust the path as needed
import ConnectivityProvider from './src/utils/ConnectivityContext';
import AuthProvider from './src/utils/AuthContext';

export default function App() {
  return (
    <LanguageProvider>
      <ConnectivityProvider>
        <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
      </AuthProvider>
      </ConnectivityProvider>
    </LanguageProvider>
  );
}

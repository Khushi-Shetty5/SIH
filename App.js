import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { ToastProvider } from './context/ToastContext';

import AppNavigator from './src/AppNavigator';
import PharmacyNavigator from './src/PharmacyNavigator';

import RoleSelectionScreen from './components/RoleSelectionScreen';

export default function App() {
  const [role, setRole] = React.useState(null);

  return (
          <ToastProvider>
            <SafeAreaProvider>
              <NavigationContainer>
                <StatusBar style="auto" />
                {role === null && (
                  <RoleSelectionScreen onSelectRole={setRole} />
                )}
                {role === "lab" && <AppNavigator />}
                {role === "doctor" && <PharmacyNavigator />}
              </NavigationContainer>
            </SafeAreaProvider>
          </ToastProvider>
  );
}

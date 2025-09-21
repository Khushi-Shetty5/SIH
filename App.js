import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, Text, View, PermissionsAndroid, Platform, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';

import { LanguageProvider } from './src/languageConstants';
import { NetworkProvider } from './src/components/NetworkProvider.js';
import SmsListenerComponent from './src/components/SmsListenerComponent';
import { setupSyncOnReconnect } from './src/services/sync.js';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import UserTypeSelectionScreen from './src/screens/UserTypeSelectionScreen';
import LanguageSelectionScreen from './src/screens/LanguageSelectionScreen';
import SigninScreen from './src/screens/SignInScreen';
import SignupScreen from './src/screens/SignupScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import OTPScreen from './src/screens/OTPScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import VideoConsultationScreen from './src/screens/VideoConsultationScreen';
import AppointmentBookingScreen from './src/screens/AppointmentBookingScreen';
import MedicineSearchScreen from './src/screens/MedicineSearchScreen';
import DoctorAvailabilityScreen from './src/screens/DoctorAvailabilityScreen';
import ChatScreen from './src/screens/ChatScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AppNavigator from './src/AppNavigator'; // existing navigator for patient flows

const Stack = createStackNavigator();
const windowHeight = Dimensions.get('window').height;

// Request SMS permissions for Android
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

      if (!allGranted) {
        Alert.alert('Permission denied', 'SMS permissions were denied');
      }
    } catch (err) {
      console.warn('SMS permission error:', err);
    }
  }
}

export default function App() {
  useEffect(() => {
    requestSmsPermissions();   // request SMS permissions
    setupSyncOnReconnect();    // setup sync on network reconnect
  }, []);

  const styles = StyleSheet.create({
    headerTitle: {
      fontWeight: '600',
      fontSize: windowHeight * 0.025,
    },
  });

  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <NetworkProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator
              initialRouteName="Splash"
              screenOptions={{
                headerStyle: { backgroundColor: '#f8fafc' },
                headerTintColor: '#1e293b',
                headerTitleStyle: styles.headerTitle,
              }}
            >
              {/* Core app screens */}
              <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
              <Stack.Screen name="UserTypeSelection" component={UserTypeSelectionScreen} options={{ headerShown: false }} />
              <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Signin" component={SigninScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
              <Stack.Screen name="OTP" component={OTPScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Profile" component={ProfileScreen} />

              {/* Patient / main app navigator */}
              <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
              <Stack.Screen
                name="VideoConsultation"
                component={VideoConsultationScreen}
                options={({ navigation }) => ({
                  title: 'Video Consultation',
                  headerShown: true,
                  headerLeft: () => (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
                      <Ionicons name="arrow-back" size={24} color="#1e293b" />
                    </TouchableOpacity>
                  ),
                })}
              />
              <Stack.Screen name="AppointmentBooking" component={AppointmentBookingScreen} options={{ title: 'Book Appointment' }} />
              <Stack.Screen name="MedicineSearch" component={MedicineSearchScreen} options={{ title: 'Search Medicine' }} />
              <Stack.Screen name="DoctorAvailability" component={DoctorAvailabilityScreen} options={{ title: 'Doctor Availability' }} />
              <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat Support' }} />
              <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
              <Stack.Screen
                name="HelpFAQ"
                component={() => (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Help & FAQ (Placeholder)</Text>
                  </View>
                )}
                options={{ title: 'Help & FAQ' }}
              />

              {/* Optional: include LabApp navigator */}
              <Stack.Screen name="LabApp" component={AppNavigator} options={{ headerShown: false }} />

            </Stack.Navigator>
          </NavigationContainer>
          <SmsListenerComponent />
        </NetworkProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

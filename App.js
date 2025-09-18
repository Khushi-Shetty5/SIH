import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Dimensions, TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LanguageProvider } from './src/languageConstants';
import SplashScreen from './src/screens/SplashScreen';
import UserTypeSelectionScreen from './src/screens/UserTypeSelectionScreen';
import LanguageSelectionScreen from './src/screens/LanguageSelectionScreen';
import SigninScreen from './src/screens/SignInScreen';
import SignupScreen from './src/screens/SignupScreen';
import OTPScreen from './src/screens/OTPScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import VideoConsultationScreen from './src/screens/VideoConsultationScreen';
import AppointmentBookingScreen from './src/screens/AppointmentBookingScreen';
import MedicineSearchScreen from './src/screens/MedicineSearchScreen';
import DoctorAvailabilityScreen from './src/screens/DoctorAvailabilityScreen';
import ChatScreen from './src/screens/ChatScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createStackNavigator();

export default function App() {
  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    console.log('App: TouchableOpacity available:', !!TouchableOpacity);
  }, []);

  const styles = StyleSheet.create({
    headerTitle: {
      fontWeight: '600',
      fontSize: windowHeight * 0.025,
    },
  });

  return (
    <LanguageProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f8fafc',
            },
            headerTintColor: '#1e293b',
            headerTitleStyle: styles.headerTitle,
          }}
        >
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="UserTypeSelection"
            component={UserTypeSelectionScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="LanguageSelection"
            component={LanguageSelectionScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signin"
            component={SigninScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="OTP"
            component={OTPScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="VideoConsultation"
            component={VideoConsultationScreen}
            options={({ navigation }) => ({
              title: 'Video Consultation',
              headerShown: true,
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => {
                    console.log('Header back button pressed');
                    navigation.goBack();
                  }}
                  style={{ marginLeft: 10 }}
                >
                  <Ionicons name="arrow-back" size={24} color="#1e293b" />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="AppointmentBooking"
            component={AppointmentBookingScreen}
            options={{ title: 'Book Appointment' }}
          />
          <Stack.Screen
            name="MedicineSearch"
            component={MedicineSearchScreen}
            options={{ title: 'Search Medicine' }}
          />
          <Stack.Screen
            name="DoctorAvailability"
            component={DoctorAvailabilityScreen}
            options={{ title: 'Doctor Availability' }}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{ title: 'Chat Support' }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: 'Settings' }}
          />
          <Stack.Screen
            name="HelpFAQ"
            component={() => (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Help & FAQ (Placeholder)</Text>
              </View>
            )}
            options={{ title: 'Help & FAQ' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </LanguageProvider>
  );
}
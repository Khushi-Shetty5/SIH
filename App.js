import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Dimensions } from 'react-native';
import SplashScreen from './src/screens/SplashScreen';
import LanguageSelectionScreen from './src/screens/LanguageSelectionScreen';
import SigninScreen from './src/screens/SignInScreen';
import SignupScreen from './src/screens/SignupScreen';
import OTPScreen from './src/screens/OTPScreen';
import HomeScreen from './src/screens/HomeScreen';
import AppointmentBookingScreen from './src/screens/AppointmentBookingScreen';
import MedicineSearchScreen from './src/screens/MedicineSearchScreen';
import DoctorAvailabilityScreen from './src/screens/DoctorAvailabilityScreen';
import VideoConferenceScreen from './src/screens/VideoConferenceScreen';
import ChatScreen from './src/screens/ChatScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createStackNavigator();

export default function App() {
  const windowHeight = Dimensions.get('window').height;

  const styles = StyleSheet.create({
    headerTitle: {
      fontWeight: '600',
      fontSize: windowHeight * 0.025,
    },
  });

  return (
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
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
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
          name="VideoConference"
          component={VideoConferenceScreen}
          options={{ title: 'Video Conference' }}
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
  );
}
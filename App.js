import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import AppointmentBookingScreen from './src/screens/AppointmentBookingScreen';
import MedicineSearchScreen from './src/screens/MedicineSearchScreen';
import DoctorAvailabilityScreen from './src/screens/DoctorAvailabilityScreen';
import VideoConferenceScreen from './src/screens/VideoConferenceScreen';
import ChatScreen from './src/screens/ChatScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f8fafc',
          },
          headerTintColor: '#1e293b',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen} 
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

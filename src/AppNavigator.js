import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from './screens/DashboardScreen';
import DoctorAvailabilityScreen from './screens/DoctorAvailabilityScreen';
import AppointmentScreen from './screens/AppointmentScreen';
import MedicineSearchScreen from './screens/MedicineSearchScreen';
import VideoConsultationScreen from './screens/VideoConsultationScreen';
import RecordsScreen from './screens/RecordsScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4A90E2',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'MedKit' }}
      />
      <Stack.Screen 
        name="DoctorAvailability" 
        component={DoctorAvailabilityScreen}
        options={{ title: 'Doctor Availability' }}
      />
      <Stack.Screen 
        name="Appointment" 
        component={AppointmentScreen}
        options={{ title: 'Book Appointment' }}
      />
      <Stack.Screen 
        name="MedicineSearch" 
        component={MedicineSearchScreen}
        options={{ title: 'Search Medicine' }}
      />
      <Stack.Screen 
        name="VideoConsultation" 
        component={VideoConsultationScreen}
        options={{ title: 'Video Conference' }}
      />
      <Stack.Screen 
        name="Records" 
        component={RecordsScreen}
        options={{ title: 'View Records' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
}

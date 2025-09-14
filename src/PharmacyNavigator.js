import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PharmacyAppointmentScreen from './screens/Pharmacy/AppointmentScreen';
import PharmacyDashboardScreen from './screens/Pharmacy/DashboardScreen';
import PharmacyDoctorAvailabilityScreen from './screens/Pharmacy/DoctorAvailabilityScreen';
import PharmacyMedicineSearchScreen from './screens/Pharmacy/MedicineSearchScreen';
import PharmacyRecordsScreen from './screens/Pharmacy/RecordsScreen';
import PharmacySettingsScreen from './screens/Pharmacy/SettingsScreen';
import PharmacyVideoConsultationScreen from './screens/Pharmacy/VideoConsultationScreen';

const PharmacyStack = createStackNavigator();

export default function PharmacyNavigator() {
  return (
    <PharmacyStack.Navigator
      initialRouteName="DashboardScreen"
      screenOptions={{
        headerStyle: { backgroundColor: '#2E7D32' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <PharmacyStack.Screen 
        name="AppointmentScreen" 
        component={PharmacyAppointmentScreen}
        options={{ title: 'Pharmacy Appointment' }}
      />
      <PharmacyStack.Screen 
        name="DashboardScreen" 
        component={PharmacyDashboardScreen}
        options={{ title: 'Pharmacy Dashboard' }}
      />
      <PharmacyStack.Screen 
      name="DoctorAvailabilityScreen" 
      component={PharmacyDoctorAvailabilityScreen}
      options={{ title: 'Pharmacy Doctor availability screen' }}
      />
      <PharmacyStack.Screen 
        name="MedicineSearchScreen" 
        component={PharmacyMedicineSearchScreen}
        options={{ title: 'Pharmacy Medicine search screen' }}
      />
      <PharmacyStack.Screen 
        name="RecordsScreen" 
        component={PharmacyRecordsScreen}
        options={{ title: 'Pharmacy Records screen' }}
      />
      <PharmacyStack.Screen 
        name="SettingsScreen" 
        component={PharmacySettingsScreen}
        options={{ title: 'Pharmacy Settings screen' }}
      />
      <PharmacyStack.Screen 
        name="VideoConsultationScreen" 
        component={PharmacyVideoConsultationScreen}
        options={{ title: 'Pharmacy video consultation screen' }}
      />

    </PharmacyStack.Navigator>
  );
}

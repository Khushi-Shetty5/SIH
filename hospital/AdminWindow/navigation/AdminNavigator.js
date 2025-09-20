// navigation/AdminNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import PatientsListScreen from '../screens/PatientsListScreen';
import PatientFormScreen from '../screens/PatientFormScreen';
import DoctorsListScreen from '../screens/DoctorsListScreen';
import DoctorFormScreen from '../screens/DoctorFormScreen';
import StaffListScreen from '../screens/StaffListScreen';
import StaffFormScreen from '../screens/StaffFormScreen';
import AuditLogScreen from '../screens/AuditLogScreen';
import AppointmentsScreen from '../../ReceptionistWindow/screens/AppointmentsScreen';

// Create stack navigator
const Stack = createStackNavigator();

const AdminNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2563EB', // Primary blue from your color scheme
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerBackTitleVisible: false,
        cardStyle: {
          backgroundColor: '#F8FAFC', // Background color from your theme
        },
      }}
    >
      {/* Dashboard Screen */}
      <Stack.Screen 
        name="Dashboard" 
        component={AdminDashboardScreen} 
        options={{ 
          title: 'Hospital Admin Dashboard',
          headerTitleAlign: 'center',
        }}
      />
      
      {/* Patient Management Screens */}
      <Stack.Screen 
        name="Patients" 
        component={PatientsListScreen} 
        options={{ 
          title: 'Patient Management',
          headerTitleAlign: 'center',
        }}
      />
      
      <Stack.Screen 
        name="PatientForm" 
        component={PatientFormScreen} 
        options={{ 
          title: 'Patient Form',
          headerTitleAlign: 'center',
        }}
      />
      
      {/* Doctor Management Screens */}
      <Stack.Screen 
        name="Doctors" 
        component={DoctorsListScreen} 
        options={{ 
          title: 'Doctor Management',
          headerTitleAlign: 'center',
        }}
      />
      
      <Stack.Screen 
        name="DoctorForm" 
        component={DoctorFormScreen} 
        options={{ 
          title: 'Doctor Form',
          headerTitleAlign: 'center',
        }}
      />
      
      {/* Audit Log Screen */}
      <Stack.Screen 
        name="AuditLog" 
        component={AuditLogScreen} 
        options={{ 
          title: 'Audit Log',
          headerTitleAlign: 'center',
        }}
      />
      
      {/* Staff Management Screens */}
      <Stack.Screen 
        name="StaffList" 
        component={StaffListScreen} 
        options={{ 
          title: 'Staff Management',
          headerTitleAlign: 'center',
        }}
      />
      
      <Stack.Screen 
        name="StaffForm" 
        component={StaffFormScreen} 
        options={{ 
          title: 'Staff Form',
          headerTitleAlign: 'center',
        }}
      />
      

      <Stack.Screen 
        name="Appointments" 
        component={AppointmentsScreen} 
        options={{ title: 'Appointment Management' }}
      />
      

    </Stack.Navigator>
  );
};

export default AdminNavigator;
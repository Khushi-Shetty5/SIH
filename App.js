import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import StackNavigator from './hospital/ReceptionistWindow/navigation/StackNavigator';
import AdminNavigator from "./hospital/AdminWindow/navigation/AdminNavigator";
import { DoctorApp } from './doctor/DoctorNavigator';
import LabApp from './src/AppNavigator'; // Fixed import
import LandingScreen from './components/LandingScreen';
import AuthNavigator from './components/AuthNavigator';

import { colors } from './theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const isAdmin = true;

// Separate screens for Reception and Admin
function ReceptionScreen() {
  return <StackNavigator />;
}

function AdminScreen() {
  return <AdminNavigator />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor={colors.primary} />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Auth" component={AuthNavigator} />
            <Stack.Screen name="Doctor" component={DoctorApp} />
            <Stack.Screen name="Lab" component={LabApp} />
            <Stack.Screen name="Reception" component={ReceptionScreen} />
            <Stack.Screen name="Admin" component={AdminScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
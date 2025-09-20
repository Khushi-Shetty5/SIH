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
import AppNavigator from './src/AppNavigator';
import LandingScreen from './components/LandingScreen';
import { colors } from './theme/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const isAdmin = true;

// Tabs for Reception/Admin
function ReceptionAdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Receptionist') {
            iconName = 'people-outline';
          } else if (route.name === 'Admin') {
            iconName = 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Receptionist" component={StackNavigator} />
      {isAdmin && <Tab.Screen name="Admin" component={AdminNavigator} />}
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor={colors.primary} />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Doctor" component={DoctorApp} />
            <Stack.Screen name="Lab" component={AppNavigator} />
            <Stack.Screen name="ReceptionAdmin" component={ReceptionAdminTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

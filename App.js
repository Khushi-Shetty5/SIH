import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DoctorApp } from './doctor/DoctorNavigator';
import AppNavigator from './src/AppNavigator';
import LandingScreen from './components/LandingScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Doctor" component={DoctorApp} />
        <Stack.Screen name="Lab" component={AppNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
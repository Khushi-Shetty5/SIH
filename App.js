import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { DoctorApp } from './doctor/DoctorNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <DoctorApp />
    </NavigationContainer>
  );
}
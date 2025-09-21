import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import LandingScreen from './components/LandingScreen';
import AuthScreen from './Auth/AuthScreen';
import OTPVerifyScreen from './Auth/OTPVerifiyScreen';
import ForgotPasswordScreen from './Auth/ForgotPasswordScreen';
import { DoctorApp } from './doctor/DoctorNavigator';
import AppNavigator from './src/AppNavigator';

// Optional: Toast context if you use it
import { ToastProvider } from './context/ToastContext';

const Stack = createNativeStackNavigator();

function AuthStack({ onLogin }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing">
        {(props) => <LandingScreen {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name="Auth">
        {(props) => <AuthScreen {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name="OTPVerify">
        {(props) => <OTPVerifyScreen {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

function MainStack({ onLogout, userRole }) {
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }} 
      initialRouteName={userRole === "labdoctor" ? "Lab" : "Doctor"}
    >
      <Stack.Screen name="Doctor">
        {(props) => <DoctorApp {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="Lab" component={AppNavigator} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const handleLogin = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  return (
    <ToastProvider>
      <NavigationContainer>
        {isLoggedIn ? (
          <MainStack onLogout={handleLogout} userRole={userRole} />
        ) : (
          <AuthStack onLogin={handleLogin} />
        )}
      </NavigationContainer>
    </ToastProvider>
  );
}
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography.js';
import logger from '../../../utils/logger.js'

// Import screens
import TabNavigator from './TabNavigator';
import PatientDetailsScreen from '../screens/PatientDetailsScreen';
import ScheduleConsultationScreen from '../screens/ScheduleConsultationScreen';
import VideoConsultationScreen from '../screens/VideoConsultationScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
  logger.info('NAVIGATION', 'StackNavigator initialized');

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.textWhite,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: typography.h5,
        },
        headerBackTitleVisible: false,
        cardStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="PatientDetails" 
        component={PatientDetailsScreen}
        options={{
          title: 'Patient Details',
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.textPrimary,
        }}
      />
      <Stack.Screen 
        name="ScheduleConsultation" 
        component={ScheduleConsultationScreen}
        options={{
          title: 'Schedule Consultation',
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.textPrimary,
        }}
      />
      <Stack.Screen 
        name="VideoConsultation" 
        component={VideoConsultationScreen}
        options={{
          title: 'Video Consultation',
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.textPrimary,
        }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;

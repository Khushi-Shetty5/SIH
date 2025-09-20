import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../../../theme/colors';
import { getResponsiveValue } from '../../../utils/responsive';
import { Icons } from '../components/Icon';

// Import screens
import DashboardScreen from '../screens/DashboardScreen';
import EmergencyRequestsScreen from '../screens/EmergencyRequestsScreen';
import DoctorAvailabilityScreen from '../screens/DoctorAvailabilityScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let IconComponent;
          
          switch (route.name) {
            case 'Dashboard':
              IconComponent = Icons.home;
              break;
            case 'Emergencies':
              IconComponent = Icons.emergency;
              break;
            case 'Doctors':
              IconComponent = Icons.doctors;
              break;
            case 'Appointments':
              IconComponent = Icons.appointments;
              break;
            default:
              IconComponent = Icons.info;
          }
          
          return (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <IconComponent 
                color={focused ? colors.primary : color} 
                size={getResponsiveValue(20, 24, 28)} 
              />
            </View>
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: getResponsiveValue(6, 8, 12),
          paddingTop: getResponsiveValue(6, 8, 12),
          height: getResponsiveValue(60, 70, 80),
        },
        tabBarLabelStyle: {
          fontSize: getResponsiveValue(10, 12, 14),
          fontWeight: '600',
          marginTop: getResponsiveValue(2, 4, 6),
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
        }}
      />
      <Tab.Screen 
        name="Emergencies" 
        component={EmergencyRequestsScreen}
        options={{
          title: 'Emergencies',
        }}
      />
      <Tab.Screen 
        name="Doctors" 
        component={DoctorAvailabilityScreen}
        options={{
          title: 'Doctors',
        }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={AppointmentsScreen}
        options={{
          title: 'Appointments',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: getResponsiveValue(36, 40, 44),
    height: getResponsiveValue(36, 40, 44),
    borderRadius: getResponsiveValue(18, 20, 22),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconContainerFocused: {
    backgroundColor: colors.primary + '15',
  },
});

export default TabNavigator;

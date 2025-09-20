import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import StackNavigator from './hospital/ReceptionistWindow/navigation/StackNavigator';
import AdminNavigator from "./hospital/AdminWindow/navigation/AdminNavigator";
import { colors } from './theme/colors';

const Tab = createBottomTabNavigator();
const isAdmin = true;

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor={colors.primary} />
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
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

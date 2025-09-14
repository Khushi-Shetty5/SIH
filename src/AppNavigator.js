// In App.js or AppNavigator.js:

import { createStackNavigator } from '@react-navigation/stack';
// import RegisterScreen from './screens/RegisterScreen';
import PharmacyNavigator from './PharmacyNavigator';
import PatientNavigator from './PatientNavigator';
import LoginScreen from './screens/Auth/LoginScreen';
// ...other imports

const Stack = createStackNavigator();

function AppNavigator() {
  const { isAuthenticated, userRole } = {isAuthenticated: false, userRole: 'pharmacy'}; // Replace with actual auth logic

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          {/* <Stack.Screen name="Register" component={RegisterScreen} /> */}
        </>
      ) : userRole === 'pharmacy' ? (
        <Stack.Screen name="Pharmacy" component={PharmacyNavigator} />
      ) : (
        <Stack.Screen name="Patient" component={PatientNavigator} />
      )}
    </Stack.Navigator>
  );
}
export default AppNavigator;
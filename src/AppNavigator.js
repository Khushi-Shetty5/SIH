import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LabProvider } from "../context/LabContext";

// Import Lab screens
import HomeScreen from "../components/HomeScreen";
import PatientSearch from "../lab/PatientSearch";
import UploadReport from "../lab/UploadReport";
import AddPatient from "../lab/AddPatient";
import Profile from "../lab/Profile";
import ReportDetail from "../lab/ReportDetail";
import PatientDetail from "../lab/PatientDetail";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <LabProvider>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#2E86C1" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PatientSearch" component={PatientSearch} options={{ title: "Search Patient" }} />
        <Stack.Screen name="AddPatient" component={AddPatient} options={{ title: "Add Patient" }} />
        <Stack.Screen name="UploadReport" component={UploadReport} options={{ title: "Upload Report" }} />
        <Stack.Screen name="PatientDetail" component={PatientDetail} options={{ title: "Patient Detail" }} />
        <Stack.Screen name="ReportDetail" component={ReportDetail} options={{ title: "Report Detail" }} />
        <Stack.Screen name="Profile" component={Profile} options={{ title: "Profile" }} />
      </Stack.Navigator>
    </LabProvider>
  );
};

export default AppNavigator;
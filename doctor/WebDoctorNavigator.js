import React from "react";
import { DoctorProvider } from "../context/DoctorContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// Import the screens we've created
import DoctorHomeScreen from "./DoctorHomeScreen";
import PatientListScreen from "./PatientListScreen";
import EmergencyScreen from "./EmergencyScreen";
import AddEmergency from "./AddEmergency";
import TestEmergency from "./TestEmergency";
import VideoCallScreen from "./VideoCallScreen";

// Import existing screens
import { AddPatient } from "./DoctorScreens";
import { PatientDetail } from "../lab/PatientDetail";
import { PatientSearch } from "../lab/PatientSearch";
import ReportDetail from "../lab/ReportDetail";
import { LabRecordsScreen, PatientReportsScreen } from "./LabReports";
import { PatientProfile } from "./DoctorScreens";
import Medicines from "./Medicines";
import { Calendar } from "../context/Calendar";
import DoctorProfile from "./DoctorProfile";

const Stack = createNativeStackNavigator();

export default function WebDoctorNavigator() {
  return (
    <DoctorProvider>
      <Stack.Navigator>
        <Stack.Screen 
          name="DoctorHome" 
          component={DoctorHomeScreen} 
          options={{ 
            headerShown: true,
            title: "Doctor Dashboard",
            headerStyle: { backgroundColor: "#2E86C1" },
            headerTintColor: "#fff"
          }} 
        />
        <Stack.Screen name="Emergency" component={EmergencyScreen} options={{ title: "Emergency Cases", headerStyle: { backgroundColor: "#FF4757" }, headerTintColor: "#fff" }} />
        <Stack.Screen name="AddEmergency" component={AddEmergency} options={{ title: "Add Emergency" }} />
        <Stack.Screen name="TestEmergency" component={TestEmergency} options={{ title: "Test Emergency" }} />
        <Stack.Screen name="PatientList" component={PatientListScreen} options={{ title: "Patients" }} />
        <Stack.Screen name="PatientProfile" component={PatientProfile} options={{ title: "Patient Profile" }} />
        <Stack.Screen name="AddPatient" component={AddPatient} options={{ title: "Add Patient" }} />
        <Stack.Screen name="ReportDetail" component={ReportDetail} options={{ title: "Report Details" }} />
        <Stack.Screen name="LabReports" component={LabRecordsScreen} options={{ title: "Lab Records" }} />
        <Stack.Screen name="PatientReports" component={PatientReportsScreen} options={{ title: "Patient Reports" }} />
        <Stack.Screen name="Medicines" component={Medicines} options={{ title: "Medicines" }} />
        <Stack.Screen name="Calendar" component={Calendar} options={{ title: "Calendar" }} />
        <Stack.Screen name="VideoCall" component={VideoCallScreen} options={{ title: "Video Call" }} />
        <Stack.Screen name="DoctorProfile" component={DoctorProfile} options={{ title: "Profile" }} />
      </Stack.Navigator>
    </DoctorProvider>
  );
}
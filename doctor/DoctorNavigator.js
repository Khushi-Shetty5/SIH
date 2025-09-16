import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { DoctorProvider } from "../context/DoctorContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// Import the screens we've created
import DoctorHomeScreen from "./DoctorHomeScreen";
import PatientListScreen from "./PatientListScreen";
import EmergencyScreen from "./EmergencyScreen";
import AddEmergency from "./AddEmergency";
import TestEmergency from "./TestEmergency";

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

export default function DoctorNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DoctorHome" component={DoctorHomeScreen} options={{ headerShown: true }} />
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
      <Stack.Screen name="DoctorProfile" component={DoctorProfile} options={{ title: "Profile" }} />
    </Stack.Navigator>
  );
}

// Wrap the navigator with DoctorProvider in a separate component
export function DoctorApp() {
  return (
    <DoctorProvider>
      <DoctorNavigator />
    </DoctorProvider>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#f8f9fa", padding: 16 },
  title: { fontSize: 22, fontWeight: "800", color: "#2E4053" },
  sectionHeader: { marginTop: 16, marginBottom: 8, fontWeight: "700", color: "#2E4053" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    width: "48%",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { color: "#fff", fontSize: 12 },
  cardValue: { color: "#fff", fontSize: 18, fontWeight: "700" },
  listItem: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  itemTitle: { color: "#2E4053", fontWeight: "700" },
  itemSub: { color: "#6c757d", marginTop: 4, fontSize: 12 },
  tag: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20 },
  tagText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  actions: { flexDirection: "row" },
  primaryBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#2E86C1", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
  primaryBtnText: { color: "#fff", fontWeight: "700" },
  secondaryBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#e8f1f9", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: "#cfe3f5" },
  secondaryBtnText: { color: "#2E86C1", fontWeight: "700" },
  subTitle: { marginTop: 14, marginBottom: 8, fontWeight: "700", color: "#2E4053" },
  note: { marginTop: 8, color: "#6c757d", fontSize: 12 },
});
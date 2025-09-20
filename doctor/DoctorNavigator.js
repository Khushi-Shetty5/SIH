// import React from "react";
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
// import { DoctorProvider } from "../context/DoctorContext";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { Ionicons, MaterialIcons, AntDesign, FontAwesome5 } from "@expo/vector-icons";
// import {
//   EmergencyScreen,
//   PatientList,
//   PatientProfile,
//   LabReports,
//   Medicines,
//   Calendar,
//   DoctorProfile,
// } from "./DoctorScreens";

// const Stack = createNativeStackNavigator();

// function ScreenContainer({ title, children, actions }) {
//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>{title}</Text>
//       {actions ? <View style={styles.actions}>{actions}</View> : null}
//       <View style={{ marginTop: 12 }}>{children}</View>
//     </ScrollView>
//   );
// }

// // 1) Dashboard
// function DoctorDashboardScreen() {
//   return (
//     <ScreenContainer title="Dashboard">
//       <View style={styles.grid}>
//         <SummaryCard color="#dc3545" icon={<MaterialIcons name="warning" size={22} color="#fff" />} title="Emergency Requests" value="2 active" />
//         <SummaryCard color="#2E86C1" icon={<Ionicons name="calendar" size={22} color="#fff" />} title="Today's Appointments" value="7" />
//         <SummaryCard color="#6C757D" icon={<MaterialIcons name="pending-actions" size={22} color="#fff" />} title="Pending Prescriptions" value="3" />
//         <SummaryCard color="#28A745" icon={<MaterialIcons name="science" size={22} color="#fff" />} title="New Lab Reports" value="5" />
//       </View>
//       <Text style={styles.sectionHeader}>Live Emergencies</Text>
//       <ListItem title="Chest pain - John Doe" subtitle="2 min ago • Priority: High" right={<Tag text="ATTEND" color="#dc3545" />} />
//       <ListItem title="Severe allergy - Mary P." subtitle="8 min ago • Priority: Medium" right={<Tag text="ATTEND" color="#dc3545" />} />

//       <Text style={styles.sectionHeader}>Today's Appointments</Text>
//       <ListItem title="10:00 AM - Rahul Sharma" subtitle="Follow-up" />
//       <ListItem title="10:30 AM - Anita Kumari" subtitle="New consultation" />
//     </ScreenContainer>
//   );
// }

// // 2) Patients (Stack: List -> Profile)
// function PatientsListScreen({ navigation }) {
//   return (
//     <ScreenContainer
//       title="Patients"
//       actions={
//         <TouchableOpacity style={styles.primaryBtn} onPress={() => {}}>
//           <Ionicons name="search" color="#fff" size={16} />
//           <Text style={styles.primaryBtnText}> Search</Text>
//         </TouchableOpacity>
//       }
//     >
//       <ListItem title="John Doe" subtitle="M • 34 • Last visit: 12 Aug" right={<Tag text="View" color="#2E86C1" onPress={() => navigation.navigate("PatientProfile", { id: "1" })} />} />
//       <ListItem title="Anita Kumari" subtitle="F • 29 • Last visit: 26 Jul" right={<Tag text="View" color="#2E86C1" onPress={() => navigation.navigate("PatientProfile", { id: "2" })} />} />
//     </ScreenContainer>
//   );
// }

// function PatientProfileScreen() {
//   return (
//     <ScreenContainer title="Patient Profile">
//       <Text style={styles.subTitle}>Personal Info</Text>
//       <ListItem title="Name" subtitle="John Doe" />
//       <ListItem title="Contact" subtitle="+91-9876543210" />
//       <ListItem title="History" subtitle="Hypertension, Seasonal Allergy" />

//       <Text style={styles.subTitle}>Reports</Text>
//       <ListItem title="CBC Report (PDF)" subtitle="Uploaded: 10 Aug" right={<Tag text="View" color="#6C757D" />} />

//       <Text style={styles.subTitle}>Timeline</Text>
//       <ListItem title="12 Aug" subtitle="Follow-up visit" />

//       <Text style={styles.subTitle}>Medications</Text>
//       <ListItem title="Amlodipine" subtitle="5mg • once daily" />

//       <View style={{ height: 12 }} />
//       <View style={{ flexDirection: "row" }}>
//         <TouchableOpacity style={[styles.primaryBtn, { flex: 1, justifyContent: "center" }]}>
//           <Ionicons name="add" color="#fff" size={16} />
//           <Text style={styles.primaryBtnText}> Add Report</Text>
//         </TouchableOpacity>
//         <View style={{ width: 8 }} />
//         <TouchableOpacity style={[styles.secondaryBtn, { flex: 1, justifyContent: "center" }]}>
//           <MaterialIcons name="edit" color="#2E86C1" size={16} />
//           <Text style={styles.secondaryBtnText}> Update Treatment</Text>
//         </TouchableOpacity>
//       </View>
//     </ScreenContainer>
//   );
// }

// function PatientsStack() {
//   return (
//     <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: "#2E86C1" }, headerTintColor: "#fff" }}>
//       <Stack.Screen name="PatientsList" component={PatientsListScreen} options={{ title: "Patients" }} />
//       <Stack.Screen name="PatientProfile" component={PatientProfileScreen} options={{ title: "Profile" }} />
//     </Stack.Navigator>
//   );
// }

// // 3) Reports & Documents
// function ReportsScreen() {
//   return (
//     <ScreenContainer
//       title="Reports & Documents"
//       actions={
//         <TouchableOpacity style={styles.primaryBtn}>
//           <Ionicons name="cloud-upload" color="#fff" size={16} />
//           <Text style={styles.primaryBtnText}> Upload</Text>
//         </TouchableOpacity>
//       }
//     >
//       <ListItem title="Liver Function Test.pdf" subtitle="Patient upload • 11 Aug" right={<Tag text="Sign" color="#28A745" />} />
//       <ListItem title="X-Ray Chest.png" subtitle="Lab upload • 08 Aug" right={<Tag text="View" color="#6C757D" />} />
//       <Text style={styles.note}>Digital signature action is stubbed.</Text>
//     </ScreenContainer>
//   );
// }

// // 4) Appointments & Calendar (placeholder)
// function AppointmentsScreen() {
//   return (
//     <ScreenContainer
//       title="Appointments"
//       actions={
//         <TouchableOpacity style={styles.primaryBtn}>
//           <Ionicons name="add" color="#fff" size={16} />
//           <Text style={styles.primaryBtnText}> New Appointment</Text>
//         </TouchableOpacity>
//       }
//     >
//       <ListItem title="10:00 AM - John Doe" subtitle="Follow-up" right={<Tag text="Reschedule" color="#6C757D" />} />
//       <ListItem title="10:30 AM - Anita Kumari" subtitle="Consultation" right={<Tag text="Cancel" color="#dc3545" />} />
//       <Text style={styles.note}>Full day/week/month calendar view to be implemented.</Text>
//     </ScreenContainer>
//   );
// }

// // 5) Medicine Management
// function MedicinesScreen() {
//   return (
//     <ScreenContainer title="Medicines">
//       <ListItem title="Paracetamol 500mg" subtitle="In stock: 240" right={<Tag text="Prescribe" color="#2E86C1" />} />
//       <ListItem title="Amoxicillin 250mg" subtitle="Low stock: 12" right={<Tag text="Request Stock" color="#dc3545" />} />
//     </ScreenContainer>
//   );
// }

// // 6) Emergency Handling
// function EmergencyScreen() {
//   return (
//     <ScreenContainer title="Emergency">
//       <ListItem title="Chest pain - John Doe" subtitle="2 min ago • Ward A" right={<Tag text="Attending" color="#dc3545" />} />
//       <ListItem title="Severe allergy - Mary P." subtitle="8 min ago • Ward C" right={<Tag text="Attend" color="#dc3545" />} />
//     </ScreenContainer>
//   );
// }

// // 7) Notifications
// function NotificationsScreen() {
//   return (
//     <ScreenContainer title="Notifications">
//       <ListItem title="New lab report uploaded" subtitle="Rahul S. • 5m ago" />
//       <ListItem title="Emergency case reported" subtitle="High priority • 10m ago" />
//       <ListItem title="Appointment reminder" subtitle="Today 10:00 AM" />
//     </ScreenContainer>
//   );
// }

// // 8) Doctor Profile & Settings
// function DoctorProfileScreen() {
//   return (
//     <ScreenContainer title="Profile & Settings">
//       <Text style={styles.subTitle}>Personal</Text>
//       <ListItem title="Name" subtitle="Dr. Meera Verma" />
//       <ListItem title="Specialization" subtitle="Cardiology" />
//       <ListItem title="Contact" subtitle="dr.meera@example.com" />

//       <Text style={styles.subTitle}>Availability</Text>
//       <ListItem title="Working Hours" subtitle="Mon-Fri • 9:00 AM - 5:00 PM" right={<Tag text="Set" color="#2E86C1" />} />
//       <ListItem title="Status" subtitle="Available" right={<Tag text="Toggle" color="#6C757D" />} />
//     </ScreenContainer>
//   );
// }

// // 9) Analytics (Extras)
// function AnalyticsScreen() {
//   return (
//     <ScreenContainer title="Analytics">
//       <View style={styles.grid}>
//         <SummaryCard color="#2E86C1" icon={<Ionicons name="people" size={22} color="#fff" />} title="Patients Today" value="12" />
//         <SummaryCard color="#28A745" icon={<MaterialIcons name="show-chart" size={22} color="#fff" />} title="This Week" value="54" />
//         <SummaryCard color="#6C757D" icon={<MaterialIcons name="pie-chart" size={22} color="#fff" />} title="Top Illness" value="Flu" />
//       </View>
//       <Text style={styles.note}>Charts and AI assistant to be implemented.</Text>
//     </ScreenContainer>
//   );
// }

// function SummaryCard({ color, icon, title, value }) {
//   return (
//     <View style={[styles.card, { backgroundColor: color }]}>
//       <View style={styles.iconCircle}>{icon}</View>
//       <View style={{ marginLeft: 10 }}>
//         <Text style={styles.cardTitle}>{title}</Text>
//         <Text style={styles.cardValue}>{value}</Text>
//       </View>
//     </View>
//   );
// }

// function ListItem({ title, subtitle, right }) {
//   return (
//     <View style={styles.listItem}>
//       <View style={{ flex: 1 }}>
//         <Text style={styles.itemTitle}>{title}</Text>
//         {subtitle ? <Text style={styles.itemSub}>{subtitle}</Text> : null}
//       </View>
//       {right}
//     </View>
//   );
// }

// function Tag({ text, color, onPress }) {
//   return (
//     <TouchableOpacity onPress={onPress} style={[styles.tag, { backgroundColor: color || "#2E86C1" }]}>
//       <Text style={styles.tagText}>{text}</Text>
//     </TouchableOpacity>
//   );
// }

// // export default function DoctorNavigator() {
// //   return (
// //     <DoctorProvider>
// //       <Stack.Navigator>
// //         <Stack.Screen name="DoctorHome" component={require("./DoctorHomeScreen").default} options={{ headerShown: true }} />
// //         <Stack.Screen name="Emergency" component={require("./DoctorScreens").EmergencyScreen} options={{ title: "Emergency" }} />
// //         <Stack.Screen name="PatientList" component={require("./DoctorScreens").PatientList} options={{ title: "Patients" }} />
// //         <Stack.Screen name="PatientProfile" component={require("./DoctorScreens").PatientProfile} options={{ title: "Profile" }} />
// //         <Stack.Screen name="LabReports" component={require("./DoctorScreens").LabReports} options={{ title: "Lab Reports" }} />
// //         <Stack.Screen name="Medicines" component={require("./DoctorScreens").Medicines} options={{ title: "Medicines" }} />
// //         <Stack.Screen name="Calendar" component={require("./DoctorScreens").Calendar} options={{ title: "Calendar" }} />
// //         <Stack.Screen name="DoctorProfile" component={require("./DoctorScreens").DoctorProfile} options={{ title: "Profile" }} />
// //       </Stack.Navigator>
// //     </DoctorProvider>
// //   );
// // }

// export default function DoctorNavigator() {
//   return (
//     <DoctorProvider>
//       <Stack.Navigator>
//         <Stack.Screen name="DoctorHome" component={require("./DoctorHomeScreen").default} />
//         <Stack.Screen name="Emergency" component={EmergencyScreen} />
//         <Stack.Screen name="PatientList" component={PatientList} />
//         <Stack.Screen name="PatientProfile" component={PatientProfile} />
//         <Stack.Screen name="LabReports" component={LabReports} />
//         <Stack.Screen name="Medicines" component={Medicines} />
//         <Stack.Screen name="Calendar" component={Calendar} />
//         <Stack.Screen name="DoctorProfile" component={DoctorProfile} />
//       </Stack.Navigator>
//     </DoctorProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: { backgroundColor: "#f8f9fa", padding: 16 },
//   title: { fontSize: 22, fontWeight: "800", color: "#2E4053" },
//   sectionHeader: { marginTop: 16, marginBottom: 8, fontWeight: "700", color: "#2E4053" },
//   grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
//   card: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 14,
//     borderRadius: 12,
//     width: "48%",
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   iconCircle: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "rgba(255,255,255,0.18)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   cardTitle: { color: "#fff", fontSize: 12 },
//   cardValue: { color: "#fff", fontSize: 18, fontWeight: "700" },
//   listItem: {
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "#e9ecef",
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 1,
//   },
//   itemTitle: { color: "#2E4053", fontWeight: "700" },
//   itemSub: { color: "#6c757d", marginTop: 4, fontSize: 12 },
//   tag: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 20 },
//   tagText: { color: "#fff", fontWeight: "700", fontSize: 12 },
//   actions: { flexDirection: "row" },
//   primaryBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#2E86C1", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10 },
//   primaryBtnText: { color: "#fff", fontWeight: "700" },
//   secondaryBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#e8f1f9", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: "#cfe3f5" },
//   secondaryBtnText: { color: "#2E86C1", fontWeight: "700" },
//   subTitle: { marginTop: 14, marginBottom: 8, fontWeight: "700", color: "#2E4053" },
//   note: { marginTop: 8, color: "#6c757d", fontSize: 12 },
// });

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
import VideoCallListScreen from "./VideoCallListScreen";

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
      <Stack.Screen name="VideoCallList" component={VideoCallListScreen} options={{ title: "Video Consultations" }} />
      <Stack.Screen name="VideoCall" component={VideoCallScreen} options={{ title: "Video Call" }} />
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
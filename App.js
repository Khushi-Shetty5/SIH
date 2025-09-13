import React, { useEffect, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons, MaterialIcons, AntDesign, FontAwesome5 } from "@expo/vector-icons";

import PatientSearch from "./lab/PatientSearch";
import UploadReport from "./lab/UploadReport";
import AddPatient from "./lab/AddPatient";
import Profile from "./lab/Profile";
import { LabProvider, useLab } from "./context/LabContext";
import { ToastProvider } from "./context/ToastContext";
import ReportDetail from "./lab/ReportDetail";
import PatientDetail from "./lab/PatientDetail";
import DoctorNavigator from "./doctor/DoctorNavigator";

const Stack = createNativeStackNavigator();

function RoleSelectionScreen({ onSelectRole }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: "#f8f9fa" }}>
      <Text style={{ fontSize: 22, fontWeight: "800", color: "#2E4053", marginBottom: 16 }}>Who are you?</Text>
      <Text style={{ fontSize: 14, color: "#6c757d", marginBottom: 24 }}>Choose your role to continue</Text>
      <TouchableOpacity
        onPress={() => onSelectRole("lab")}
        activeOpacity={0.9}
        style={{ backgroundColor: "#2E86C1", paddingVertical: 14, paddingHorizontal: 22, borderRadius: 12, width: "100%", marginBottom: 12, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 6, elevation: 4 }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>I am a Lab Worker</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onSelectRole("doctor")}
        activeOpacity={0.9}
        style={{ backgroundColor: "#28A745", paddingVertical: 14, paddingHorizontal: 22, borderRadius: 12, width: "100%", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 6, elevation: 4 }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>I am a Doctor</Text>
      </TouchableOpacity>
    </View>
  );
}

function DoctorScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 20, fontWeight: "700", color: "#2E4053" }}>I am doctor</Text>
    </View>
  );
}

function HomeScreen({ navigation }) {
  const { labWorker, logout, patients, reports } = useLab();

  useEffect(() => {
    navigation.setOptions({
      title: "MedKit",
      headerLeft: () => null,
      headerRight: () => (
        <HeaderAvatarMenu onProfile={() => navigation.navigate("Profile")} onLogout={logout} />
      ),
    });
  }, [navigation, logout]);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>Welcome, {labWorker?.name || "Lab Worker"}</Text>
        <Text style={styles.headerSubtitle}>Have a productive day in the lab</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: "#e8f1f9" }]}>
          <Ionicons name="people" size={22} color="#2E86C1" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.statLabel}>Patients</Text>
            <Text style={styles.statValue}>{patients?.length || 0}</Text>
          </View>
        </View>
        <View style={[styles.statCard, { backgroundColor: "#eaf7ee" }]}>
          <MaterialIcons name="assignment" size={22} color="#28A745" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.statLabel}>Reports</Text>
            <Text style={styles.statValue}>{reports?.length || 0}</Text>
          </View>
        </View>
      </View>

      <View style={styles.grid}>
        <ActionTile
          color="#2E86C1"
          icon={<Ionicons name="search" size={26} color="#fff" />}
          title="Search Patient"
          subtitle="Find by ID or name"
          onPress={() => navigation.navigate("PatientSearch")}
        />
        <ActionTile
          color="#2E86C1"
          icon={<AntDesign name="adduser" size={26} color="#fff" />}
          title="Add Patient"
          subtitle="Register new record"
          onPress={() => navigation.navigate("AddPatient")}
        />
        <ActionTile
          color="#28A745"
          icon={<MaterialIcons name="upload-file" size={26} color="#fff" />}
          title="Upload Report"
          subtitle="Manual or PDF"
          onPress={() => navigation.navigate("UploadReport")}
        />
        {null}
      </View>

      <Text style={homeStyles.recentHeader}>Recent Reports</Text>
      {useMemo(() => {
        const sorted = (reports || []).slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return sorted.slice(0, 4);
      }, [reports]).map((r) => {
        const patient = patients?.find((p) => p.id === r.patientId);
        return (
          <View key={r.id} style={homeStyles.recentItem}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate("ReportDetail", { report: r })}>
              <Text style={homeStyles.recentTitle}>{patient?.name || "Unknown Patient"} ({r.patientId})</Text>
              <Text style={homeStyles.recentMeta}>{r.title} {r.type === "pdf" ? "(PDF)" : ""} • {new Date(r.createdAt).toLocaleString()}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={homeStyles.iconBtn} onPress={async () => {
              try {
                if (r.type === "pdf" && r.fileUri) {
                  await Sharing.shareAsync(r.fileUri);
                } else {
                  const html = `
                    <html><head><meta name='viewport' content='width=device-width, initial-scale=1.0'></head>
                    <body style='font-family: -apple-system, Roboto, Arial; padding: 24px;'>
                      <h2>${r.title}</h2>
                      <p><b>Patient ID:</b> ${r.patientId}</p>
                      <p><b>Uploaded by:</b> ${r.uploadedByName}</p>
                      <p><b>Date:</b> ${new Date(r.createdAt).toLocaleString()}</p>
                      <hr/>
                      <pre style='white-space: pre-wrap; font-size: 14px;'>${r.content || ""}</pre>
                    </body></html>`;
                  const { uri } = await Print.printToFileAsync({ html });
                  await Sharing.shareAsync(uri);
                }
              } catch (e) {}
            }}>
              <MaterialIcons name="download" size={20} color="#2E86C1" />
            </TouchableOpacity>
            <Ionicons name="chevron-forward" size={18} color="#6c757d" />
          </View>
        );
      })}
    </ScrollView>
  );
}

export default function App() {
  const [role, setRole] = React.useState(null);

  return (
    <ToastProvider>
      <NavigationContainer>
        {role === null && (
          <RoleSelectionScreen onSelectRole={setRole} />
        )}

        {role === "lab" && (
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
        )}

        {role === "doctor" && (
          <DoctorNavigator />
        )}
      </NavigationContainer>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  headerCard: {
    backgroundColor: "#2E86C1",
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "#eaf2fb",
    marginTop: 4,
    fontSize: 14,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    width: "48%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: { color: "#6c757d", fontSize: 12 },
  statValue: { color: "#212529", fontSize: 18, fontWeight: "700" },
  grid: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    marginBottom: 14,
    borderRadius: 12,
    width: "48%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardPrimary: { backgroundColor: "#2E86C1" },
  cardSuccess: { backgroundColor: "#28A745" },
  cardSecondary: { backgroundColor: "#6C757D" },
  cardText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 15,
    fontWeight: "600",
  },
});

function ActionTile({ color, icon, title, subtitle, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[tileStyles.tile, { backgroundColor: color }]}>
      <View style={tileStyles.decor} />
      <View style={tileStyles.left}>
        <View style={tileStyles.iconCircle}>{icon}</View>
        <View style={{ marginLeft: 12 }}>
          <Text style={tileStyles.title}>{title}</Text>
          <Text style={tileStyles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={tileStyles.chevCircle}>
        <Ionicons name="chevron-forward" size={18} color="#fff" />
      </View>
    </TouchableOpacity>
  );
}

const tileStyles = StyleSheet.create({
  tile: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 16,
    width: "100%",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    overflow: "hidden",
  },
  left: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  chevCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: "#fff", fontWeight: "700", fontSize: 15 },
  subtitle: { color: "#f1f3f5", fontSize: 12, marginTop: 2 },
  decor: {
    position: "absolute",
    right: -30,
    top: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
});

const homeStyles = StyleSheet.create({
  recentHeader: { marginTop: 12, marginBottom: 8, fontWeight: "700", color: "#2E4053" },
  recentItem: {
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
  recentTitle: { color: "#2E4053", fontWeight: "700" },
  recentMeta: { color: "#6c757d", marginTop: 4, fontSize: 12 },
});

function HeaderAvatarMenu({ onProfile, onLogout }) {
  const [open, setOpen] = React.useState(false);
  return (
    <View style={{ marginLeft: 8 }}>
      <TouchableOpacity
        onPress={() => onProfile?.()}
        onLongPress={() => setOpen((v) => !v)}
        delayLongPress={300}
        style={{ padding: 6 }}
      >
        <FontAwesome5 name="user-circle" size={22} color="#fff" />
      </TouchableOpacity>
      {open && (
        <View style={menuStyles.menu}>
          <TouchableOpacity style={menuStyles.item} onPress={() => { setOpen(false); onProfile?.(); }}>
            <AntDesign name="idcard" size={16} color="#2E86C1" />
            <Text style={menuStyles.text}>See Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={menuStyles.item} onPress={() => { setOpen(false); onLogout?.(); }}>
            <AntDesign name="logout" size={16} color="#dc3545" />
            <Text style={[menuStyles.text, { color: "#dc3545" }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const menuStyles = StyleSheet.create({
  menu: {
    position: "absolute",
    top: 36,
    left: 0,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    minWidth: 140,
  },
  text: { marginLeft: 8, color: "#212529", fontWeight: "600" },
});

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useDoctor } from "../context/DoctorContext";
import { useToast } from "../context/ToastContext"; // for popup notifications

export default function DoctorHomeScreen({ navigation }) {
  const doctorCtx = useDoctor();
  const toast = useToast(); // <-- initialize toast

  if (!doctorCtx) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: "#2E86C1", fontWeight: "700" }}>Loading...</Text>
      </View>
    );
  }

  const {
    emergencies = [],
    reports = [],
    videoCalls = [],
    notifications = [],
    requestVideoCall,
    attendVideoCall,
    attendEmergency,
    addReport,
    approveReport,
    createEmergency,
    patients = [],
  } = doctorCtx;

  const newLabReports = reports.filter(r => r.status === "new").length;
  const pendingVideoCalls = videoCalls.filter(v => !v.attendedBy).length;
  const emergencyCount = emergencies.filter(e => !e.attendingBy).length;

  // ---------- HANDLERS FOR TOAST ----------
// Handle Video Call
const handleTriggerVideoCall = () => {
  const patientId = patients[0]?.id;   // pick first patient as example
  const patientName = patients.find(p => p.id === patientId)?.name || "Unknown Patient";

  requestVideoCall(patientId);
  toast.show(`📹 Video call request triggered for ${patientName}`, "info");
};

// Handle Emergency
const handleTriggerEmergency = () => {
  const patientId = patients[1]?.id || "p2";   // pick second patient as example
  const patientName = patients.find(p => p.id === patientId)?.name || "Unknown Patient";

  createEmergency({
    title: `Emergency`,
    priority: "high",
    patientId,
  });
  toast.show(`🚨 Emergency request triggered for ${patientName}`, "danger");
};

  // Header with profile + notifications
  React.useEffect(() => {
    navigation.setOptions({
      title: "MedKit",
      headerTitleAlign: "left",
      headerStyle: { backgroundColor: "#ffffff" },
      headerTintColor: "#2E86C1",
      headerTitleStyle: { color: "#2E86C1", fontWeight: "800" },
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity style={{ padding: 6 }} onPress={() => navigation.navigate("DoctorProfile")}>
            <FontAwesome5 name="user-md" size={22} color="#2E86C1" />
          </TouchableOpacity>

          <TouchableOpacity style={{ padding: 6, marginLeft: 12 }} onPress={() => navigation.navigate("Notifications")}>
            <Ionicons name="notifications" size={24} color="#2E86C1" />
            {notifications.length > 0 && (
              <View style={{
                position: "absolute",
                top: -2,
                right: -2,
                backgroundColor: "#dc3545",
                borderRadius: 8,
                width: 16,
                height: 16,
                justifyContent: "center",
                alignItems: "center",
              }}>
                <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>{notifications.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, notifications]);

  const buttons = [
    { key: "Emergency", label: "Emergencies", icon: <MaterialIcons name="warning" size={28} color="#2E86C1" />, route: "Emergency", count: emergencyCount },
    { key: "Patients", label: "Patients", icon: <Ionicons name="people" size={28} color="#2E86C1" />, route: "PatientList" },
    { key: "LabReports", label: "Lab Reports", icon: <MaterialIcons name="science" size={28} color="#2E86C1" />, route: "LabReports", count: newLabReports },
    { key: "Medicines", label: "Medicines", icon: <FontAwesome5 name="pills" size={28} color="#2E86C1" />, route: "Medicines" },
    { key: "VideoCall", label: "Video Call", icon: <Ionicons name="videocam" size={28} color="#2E86C1" />, route: "VideoCallRequests", count: pendingVideoCalls },
    { key: "Calendar", label: "Calendar", icon: <Ionicons name="calendar" size={28} color="#2E86C1" />, route: "Calendar" },
  ];

  return (
    <View style={styles.container}>
      {/* Alerts Row */}
      <View style={styles.alertsRow}>
        <View style={styles.alertCard}>
          <Ionicons name="warning" size={18} color="#dc3545" />
          <Text style={styles.alertText}> Emergencies: {emergencyCount}</Text>
        </View>
        <View style={styles.alertCard}>
          <Ionicons name="videocam" size={18} color="#ffc107" />
          <Text style={styles.alertText}> Video Calls: {pendingVideoCalls}</Text>
        </View>
        <View style={styles.alertCard}>
          <MaterialIcons name="science" size={18} color="#17a2b8" />
          <Text style={styles.alertText}> Lab Reports: {newLabReports}</Text>
        </View>
      </View>

      {/* Grid Buttons */}
      <View style={styles.grid}>
        {buttons.map(b => (
          <TouchableOpacity
            key={b.key}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => {
              if (!b.route) return;
              if (b.key === "VideoCall") {
                const roomId = `MedKitRoom-${Date.now()}`;
                navigation.navigate(b.route, { roomId });
              } else {
                navigation.navigate(b.route);
              }
            }}
          >
            <View style={styles.iconCircle}>
              {b.icon}
              {b.count > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{b.count}</Text>
                </View>
              )}
            </View>
            <Text style={styles.cardLabel}>{b.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ---------- TESTING BUTTONS ---------- */}
      <View style={{ marginTop: 20 }}>
  <Text style={{ fontWeight: "700", marginBottom: 10 }}>⚡ Test Actions:</Text>

  <TouchableOpacity style={styles.testButton} onPress={handleTriggerVideoCall}>
    <Text style={styles.testButtonText}>Simulate Video Call Request</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.testButton} onPress={handleTriggerEmergency}>
    <Text style={styles.testButtonText}>Simulate Emergency Request</Text>
  </TouchableOpacity>
</View>

    </View>
  );
}

const { width } = Dimensions.get("window");
const itemWidth = (width - 16 * 2 - 12) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: {
    backgroundColor: "#fff",
    width: itemWidth,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#e6eef7",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e8f1f9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    position: "relative",
  },
  cardLabel: { color: "#2E4053", fontWeight: "700" },
  alertsRow: { flexDirection: "row", marginBottom: 12 },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e6eef7",
    marginRight: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  alertText: { marginLeft: 6, color: "#2E4053", fontWeight: "700", fontSize: 12 },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#dc3545",
    borderRadius: 8,
    paddingHorizontal: 5,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  testButton: {
    backgroundColor: "#2E86C1",
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  testButtonText: { color: "#fff", fontWeight: "700", textAlign: "center" },
});

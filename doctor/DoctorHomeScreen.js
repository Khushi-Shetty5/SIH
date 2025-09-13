import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function DoctorHomeScreen({ navigation }) {
  React.useEffect(() => {
    navigation.setOptions({
      title: "MedKit",
      headerTitleAlign: "left",
      headerStyle: { backgroundColor: "#ffffff" },
      headerTintColor: "#2E86C1",
      headerTitleStyle: { color: "#2E86C1", fontWeight: "800" },
      headerRight: () => (
        <TouchableOpacity style={{ padding: 6 }} onPress={() => navigation.navigate("DoctorProfile") }>
          <FontAwesome5 name="user-md" size={22} color="#2E86C1" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const buttons = [
    { key: "Emergency", label: "Emergencies", icon: <MaterialIcons name="warning" size={28} color="#2E86C1" />, route: "Emergency" },
    { key: "Patients", label: "Patients", icon: <Ionicons name="people" size={28} color="#2E86C1" />, route: "PatientList" },
    { key: "LabReports", label: "Lab Reports", icon: <MaterialIcons name="science" size={28} color="#2E86C1" />, route: "LabReports" },
    { key: "Medicines", label: "Medicines", icon: <FontAwesome5 name="pills" size={28} color="#2E86C1" />, route: "Medicines" },
    { key: "VideoCall", label: "Video Call", icon: <Ionicons name="videocam" size={28} color="#2E86C1" />, route: null },
    { key: "Calendar", label: "Calendar", icon: <Ionicons name="calendar" size={28} color="#2E86C1" />, route: "Calendar" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.alertsRow}>
        <View style={styles.alertCard}>
          <Ionicons name="warning" size={18} color="#dc3545" />
          <Text style={styles.alertText}> Emergencies: 2</Text>
        </View>
      </View>
      <View style={styles.grid}>
        {buttons.map((b) => (
          <TouchableOpacity key={b.key} style={styles.card} activeOpacity={0.9} onPress={() => b.route ? navigation.navigate(b.route) : null}>
            <View style={styles.iconCircle}>{b.icon}</View>
            <Text style={styles.cardLabel}>{b.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");
const itemWidth = (width - 16 * 2 - 12) / 2; // padding 16, gap 12

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 16 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
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
  },
  cardLabel: { color: "#2E4053", fontWeight: "700" },
  alertsRow: { flexDirection: "row", marginBottom: 12 },
  alertCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", paddingHorizontal: 10, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: "#e6eef7", marginRight: 8, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  alertText: { marginLeft: 6, color: "#2E4053", fontWeight: "700", fontSize: 12 },
});



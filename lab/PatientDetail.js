import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLab } from "../context/LabContext";

export default function PatientDetail({ route, navigation }) {
  const { patientId } = route.params || {};
  const { patients, reports } = useLab();

  // Moved the filtering logic inside the component to avoid hook order issues
  const getPatient = () => {
    return patients.find((p) => p._id === patientId);
  };

  const getPatientReports = () => {
    return reports.filter((r) => r.patientId === patientId);
  };

  const patient = getPatient();
  const patientReports = getPatientReports();

  if (!patient) {
    return (
      <View style={styles.container}><Text style={{ color: "#6c757d" }}>Patient not found.</Text></View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.infoCard}>
        <Text style={styles.name}>{patient.name}</Text>
        <Text style={styles.meta}>ID: {patient._id}</Text>
        <Text style={styles.meta}>Age: {patient.age}</Text>
        <Text style={styles.meta}>Gender: {patient.gender}</Text>
        <Text style={styles.meta}>Contact: {patient.contact}</Text>
      </View>

      <TouchableOpacity
        style={styles.addReportBtn}
        onPress={() => navigation.navigate("UploadReport", { patientId: patient._id, from: 'PatientDetail' })}
      >
        <MaterialIcons name="post-add" size={20} color="#fff" />
        <Text style={styles.addReportText}> Add Report</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Reports</Text>
      {patientReports.length === 0 ? (
        <Text style={{ color: "#6c757d" }}>No reports yet.</Text>
      ) : (
        patientReports.map((r) => (
          <TouchableOpacity key={r.id} style={styles.reportItem} onPress={() => navigation.navigate("ReportDetail", { report: r })}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name={r.files && r.files.length > 0 ? "document-text" : "create"} size={18} color="#2E86C1" />
              <Text style={styles.reportTitle}>  {r.title} {r.files && r.files.length > 0 ? "(PDF)" : ""}</Text>
            </View>
            <Text style={styles.reportMeta}>by {r.uploadedByName} • {new Date(r.createdAt).toLocaleString()}</Text>
            
            {/* Show file attachment info */}
            {r.files && r.files.length > 0 && (
              <View style={styles.fileInfo}>
                <MaterialIcons name="attachment" size={14} color="#6c757d" />
                <Text style={styles.fileText}>{r.files.length} file(s) attached</Text>
              </View>
            )}
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", padding: 20 },
  infoCard: {
    backgroundColor: "#F4F6F7",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  name: { fontSize: 20, fontWeight: "700", color: "#2E4053", marginBottom: 6 },
  meta: { color: "#6c757d", marginBottom: 4 },
  addReportBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28A745",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    alignSelf: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  addReportText: { color: "#fff", fontWeight: "700" },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#2E4053", marginTop: 8, marginBottom: 8 },
  reportItem: {
    backgroundColor: "#F8FAFB",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  reportTitle: { color: "#2E4053", fontWeight: "700" },
  reportMeta: { color: "#6c757d", marginTop: 4 },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  fileText: {
    color: "#6c757d",
    fontSize: 12,
    marginLeft: 4,
  },
});
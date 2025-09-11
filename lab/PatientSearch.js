import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLab } from "../context/LabContext";

export default function PatientSearch({ navigation }) {
  const { patients, reports } = useLab();
  const [search, setSearch] = useState("");

  const results = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return patients;
    return patients.filter(
      (p) => p.id.toLowerCase().includes(term) || p.name.toLowerCase().includes(term)
    );
  }, [search, patients]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🔍 Search Patient</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Patient ID or Name"
        value={search}
        onChangeText={setSearch}
      />
      <TouchableOpacity style={styles.searchBtn} onPress={() => setSearch(search.trim())}>
        <Ionicons name="search" size={20} color="#fff" />
        <Text style={styles.btnText}> Search</Text>
      </TouchableOpacity>

      {/* Show results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 20 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const patientReports = reports.filter((r) => r.patientId === item.id);
          return (
            <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => navigation.navigate("PatientDetail", { patientId: item.id })}>
              <Text style={styles.cardTitle}>
                {item.name} ({item.id})
              </Text>
              <Text style={styles.cardText}>Age: {item.age}</Text>
              <Text style={styles.cardText}>Gender: {item.gender}</Text>
              <Text style={styles.cardText}>Contact: {item.contact}</Text>

              <TouchableOpacity
                style={styles.addReportBtn}
                onPress={() => navigation.navigate("UploadReport", { patientId: item.id })}
              >
                <Text style={styles.addReportText}>+ Add Report</Text>
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>Reports</Text>
              {patientReports.length === 0 ? (
                <Text style={{ color: "#6c757d" }}>No reports yet.</Text>
              ) : (
                patientReports.map((r) => (
                  <TouchableOpacity key={r.id} style={styles.reportItem} onPress={() => navigation.navigate("ReportDetail", { report: r })}>
                    <Text style={styles.reportTitle}>{r.title} {r.type === "pdf" ? "(PDF)" : ""}</Text>
                    <Text style={styles.reportMeta}>by {r.uploadedByName} • {new Date(r.createdAt).toLocaleString()}</Text>
                    {r.type === "manual" ? (
                      <Text style={styles.reportContent} numberOfLines={2}>{r.content}</Text>
                    ) : (
                      <Text style={styles.reportLink}>Tap to open</Text>
                    )}
                  </TouchableOpacity>
                ))
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={() => (
          <Text style={{ marginTop: 20, color: "gray" }}>
            ❌ No patient found
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: { fontSize: 22, fontWeight: "bold", color: "#2E86C1", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  searchBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E86C1",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  card: {
    backgroundColor: "#F4F6F7",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#2E4053" },
  cardText: { fontSize: 14, color: "#5D6D7E" },
  addReportBtn: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28A745",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  addReportText: { color: "#fff", fontWeight: "700" },
  sectionTitle: { marginTop: 14, marginBottom: 8, color: "#2E4053", fontWeight: "700" },
  reportItem: {
    backgroundColor: "#F8FAFB",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  reportTitle: { color: "#2E4053", fontWeight: "700" },
  reportMeta: { color: "#6c757d", marginTop: 2 },
  reportContent: { color: "#495057", marginTop: 6 },
  reportLink: { color: "#2E86C1", marginTop: 6 },
});

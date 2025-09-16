import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDoctor } from "../context/DoctorContext";

export default function PatientListScreen({ navigation }) {
  const { patients } = useDoctor();

  const renderPatientItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.patientCard}
      onPress={() => navigation.navigate("PatientProfile", { id: item._id || item.id })}
    >
      <View style={styles.patientInfo}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.patientDetails}>
          <Text style={styles.patientName}>{item.name}</Text>
          <Text style={styles.patientMeta}>{item.age} years old • {item.gender}</Text>
          <Text style={styles.patientContact}>{item.contact}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Updated keyExtractor to handle both _id and id fields
  const keyExtractor = (item) => item._id || item.id || `patient-${item.name}-${item.age}`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate("AddPatient")}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Patient</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={patients}
        renderItem={renderPatientItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No patients found</Text>
            <Text style={styles.emptySubtext}>Add a new patient to get started</Text>
          </View>
        )}
      />
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#2E86C1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "700",
  },
  listContainer: {
    paddingBottom: 20,
  },
  patientCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    // Replace shadow* props with boxShadow for web compatibility
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    elevation: 2,
  },
  patientInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e8f1f9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#2E86C1",
    fontWeight: "700",
    fontSize: 18,
  },
  patientDetails: {},
  patientName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E4053",
    marginBottom: 4,
  },
  patientMeta: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 4,
  },
  patientContact: {
    fontSize: 12,
    color: "#2E86C1",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6c757d",
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
});
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useLab } from "../context/LabContext";

export default function Profile() {
  const { labWorker, logout } = useLab();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>👤 Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{labWorker.name || "-"}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{labWorker.email}</Text>
        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{labWorker.role}</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <AntDesign name="logout" size={20} color="#fff" />
        <Text style={styles.btnText}> Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: { fontSize: 22, fontWeight: "bold", color: "#2E86C1", marginBottom: 16 },
  card: {
    backgroundColor: "#F4F6F7",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  label: { fontSize: 12, color: "#6c757d", marginTop: 8 },
  value: { fontSize: 16, fontWeight: "600", color: "#2E4053" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dc3545",
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});


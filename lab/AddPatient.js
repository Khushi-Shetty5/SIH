import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useLab } from "../context/LabContext";
import { useToast } from "../context/ToastContext";

export default function AddPatient({ navigation }) {
  const { addPatient } = useLab();
  const { show } = useToast();
  const [form, setForm] = useState({ id: "", name: "", age: "", gender: "", contact: "" });

  const onChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const onSave = () => {
    if (!form.id || !form.name || !form.age || !form.gender || !form.contact) {
      show("Please fill all fields", "danger");
      return;
    }
    const ageNum = Number(form.age);
    if (Number.isNaN(ageNum) || ageNum <= 0) {
      show("Please enter a valid age", "danger");
      return;
    }
    addPatient({ id: form.id.trim(), name: form.name.trim(), age: ageNum, gender: form.gender.trim(), contact: form.contact.trim() });
    show("Patient added", "success");
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>➕ Add New Patient</Text>
      <TextInput style={styles.input} placeholder="Patient ID" value={form.id} onChangeText={(t) => onChange("id", t)} />
      <TextInput style={styles.input} placeholder="Name" value={form.name} onChangeText={(t) => onChange("name", t)} />
      <TextInput style={styles.input} placeholder="Age" keyboardType="numeric" value={form.age} onChangeText={(t) => onChange("age", t)} />
      <TextInput style={styles.input} placeholder="Gender" value={form.gender} onChangeText={(t) => onChange("gender", t)} />
      <TextInput style={styles.input} placeholder="Contact" keyboardType="phone-pad" value={form.contact} onChangeText={(t) => onChange("contact", t)} />

      <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
        <AntDesign name="save" size={20} color="#fff" />
        <Text style={styles.btnText}> Save Patient</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  heading: { fontSize: 22, fontWeight: "bold", color: "#2E86C1", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28A745",
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});


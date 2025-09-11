import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useLab } from "../context/LabContext";
import { useToast } from "../context/ToastContext";

export default function UploadReport({ route }) {
  const { addManualReport, addPdfReport } = useLab();
  const { show } = useToast();
  const [patientId, setPatientId] = useState("");
  const [title, setTitle] = useState("");
  const [reportDetails, setReportDetails] = useState("");

  useEffect(() => {
    if (route?.params?.patientId) {
      setPatientId(route.params.patientId);
    }
  }, [route?.params?.patientId]);

  const handleManualUpload = () => {
    if (!patientId || !reportDetails) {
      show("Please enter Patient ID and details", "danger");
      return;
    }
    addManualReport(patientId, title, reportDetails);
    setReportDetails("");
    setTitle("");
    show("Report saved", "success");
  };

  const handlePickPdf = async () => {
    if (!patientId) {
      show("Enter patient ID first", "danger");
      return;
    }
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: "application/pdf", multiple: false });
      if (res.canceled) return;
      const file = res.assets?.[0];
      if (file) {
        addPdfReport(patientId, title, file.uri, file.name);
        setTitle("");
        show("PDF uploaded", "success");
      }
    } catch (e) {
      show("Failed to pick PDF", "danger");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>📑 Upload / Update Report</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Patient ID"
        value={patientId}
        onChangeText={setPatientId}
      />

      <TextInput
        style={styles.input}
        placeholder="Report Title (optional)"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, { height: 120 }]}
        placeholder="Enter Report Details"
        value={reportDetails}
        onChangeText={setReportDetails}
        multiline
      />

      <TouchableOpacity style={styles.uploadBtn} onPress={handleManualUpload}>
        <MaterialIcons name="cloud-upload" size={22} color="#fff" />
        <Text style={styles.btnText}> Save Manual Report</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.pdfBtn} onPress={handlePickPdf}>
        <MaterialIcons name="picture-as-pdf" size={22} color="#fff" />
        <Text style={styles.btnText}> Upload PDF</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E86C1",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E86C1",
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
  },
  pdfBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28A745",
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 12,
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
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#2E4053" },
  cardText: { fontSize: 14, color: "#5D6D7E", marginVertical: 5 },
  cardDate: { fontSize: 12, color: "#839192" },
});

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export default function ReportDetail({ route }) {
  const { report } = route.params || {};
  if (!report) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "#6c757d" }}>Report not found.</Text>
      </View>
    );
  }

  const openPdf = () => {
    if (report.type === "pdf" && report.fileUri) {
      Linking.openURL(report.fileUri).catch(() => {});
    }
  };

  const shareOrGeneratePdf = async () => {
    try {
      if (report.type === "pdf" && report.fileUri) {
        await Sharing.shareAsync(report.fileUri);
        return;
      }
      const html = `
        <html><head><meta name='viewport' content='width=device-width, initial-scale=1.0'></head>
        <body style='font-family: -apple-system, Roboto, Arial; padding: 24px;'>
          <h2>${report.title}</h2>
          <p><b>Patient ID:</b> ${report.patientId}</p>
          <p><b>Uploaded by:</b> ${report.uploadedByName}</p>
          <p><b>Date:</b> ${new Date(report.createdAt).toLocaleString()}</p>
          <hr/>
          <pre style='white-space: pre-wrap; font-size: 14px;'>${report.content || ""}</pre>
        </body></html>`;
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (e) {}
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{report.title}</Text>
      <Text style={styles.meta}>Patient ID: {report.patientId}</Text>
      <Text style={styles.meta}>Uploaded by: {report.uploadedByName}</Text>
      <Text style={styles.meta}>On: {new Date(report.createdAt).toLocaleString()}</Text>

      {report.type === "manual" ? (
        <View style={styles.contentBox}>
          <Text style={styles.contentText}>{report.content}</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.pdfBtn} onPress={openPdf}>
          <MaterialIcons name="picture-as-pdf" size={20} color="#fff" />
          <Text style={styles.pdfText}> Open PDF</Text>
        </TouchableOpacity>
      )}

      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <TouchableOpacity style={[styles.pdfBtn, { flex: 1, backgroundColor: "#6C757D" }]} onPress={shareOrGeneratePdf}>
          <MaterialIcons name="download" size={20} color="#fff" />
          <Text style={styles.pdfText}> Download</Text>
        </TouchableOpacity>
        <View style={{ width: 10 }} />
        <TouchableOpacity style={[styles.pdfBtn, { flex: 1, backgroundColor: "#2E86C1" }]} onPress={shareOrGeneratePdf}>
          <MaterialIcons name="share" size={20} color="#fff" />
          <Text style={styles.pdfText}> Share</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 20, fontWeight: "700", color: "#2E4053", marginBottom: 8 },
  meta: { color: "#6c757d", marginBottom: 4 },
  contentBox: {
    backgroundColor: "#F4F6F7",
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  contentText: { color: "#212529", fontSize: 16, lineHeight: 22 },
  pdfBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E86C1",
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 16,
  },
  pdfText: { color: "#fff", fontWeight: "600" },
});


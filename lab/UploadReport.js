// // import React, { useEffect, useState } from "react";
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   StyleSheet,
// //   TouchableOpacity,
// //   FlatList,
// //   Alert,
// //   ScrollView,
// // } from "react-native";
// // import { MaterialIcons } from "@expo/vector-icons";
// // import * as DocumentPicker from "expo-document-picker";
// // import { useLab } from "../context/LabContext";
// // import { useToast } from "../context/ToastContext";

// // export default function UploadReport({ route }) {
// //   const { addManualReport, addPdfReport } = useLab();
// //   const { show } = useToast();
// //   const [patientId, setPatientId] = useState("");
// //   const [title, setTitle] = useState("");
// //   const [reportDetails, setReportDetails] = useState("");

// //   useEffect(() => {
// //     if (route?.params?.patientId) {
// //       setPatientId(route.params.patientId);
// //     }
// //   }, [route?.params?.patientId]);

// //   const handleManualUpload = () => {
// //     if (!patientId || !reportDetails) {
// //       show("Please enter Patient ID and details", "danger");
// //       return;
// //     }
// //     addManualReport(patientId, title, reportDetails);
// //     setReportDetails("");
// //     setTitle("");
// //     show("Report saved", "success");
// //   };

// //   const handlePickPdf = async () => {
// //     if (!patientId) {
// //       show("Enter patient ID first", "danger");
// //       return;
// //     }
// //     try {
// //       const res = await DocumentPicker.getDocumentAsync({ type: "application/pdf", multiple: false });
// //       if (res.canceled) return;
// //       const file = res.assets?.[0];
// //       if (file) {
// //         addPdfReport(patientId, title, file.uri, file.name);
// //         setTitle("");
// //         show("PDF uploaded", "success");
// //       }
// //     } catch (e) {
// //       show("Failed to pick PDF", "danger");
// //     }
// //   };

// //   return (
// //     <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
// //       <Text style={styles.heading}>📑 Upload / Update Report</Text>

// //       <TextInput
// //         style={styles.input}
// //         placeholder="Enter Patient ID"
// //         value={patientId}
// //         onChangeText={setPatientId}
// //       />

// //       <TextInput
// //         style={styles.input}
// //         placeholder="Report Title (optional)"
// //         value={title}
// //         onChangeText={setTitle}
// //       />

// //       <TextInput
// //         style={[styles.input, { height: 120 }]}
// //         placeholder="Enter Report Details"
// //         value={reportDetails}
// //         onChangeText={setReportDetails}
// //         multiline
// //       />

// //       <TouchableOpacity style={styles.uploadBtn} onPress={handleManualUpload}>
// //         <MaterialIcons name="cloud-upload" size={22} color="#fff" />
// //         <Text style={styles.btnText}> Save Manual Report</Text>
// //       </TouchableOpacity>

// //       <TouchableOpacity style={styles.pdfBtn} onPress={handlePickPdf}>
// //         <MaterialIcons name="picture-as-pdf" size={22} color="#fff" />
// //         <Text style={styles.btnText}> Upload PDF</Text>
// //       </TouchableOpacity>
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, padding: 20, backgroundColor: "#fff" },
// //   heading: {
// //     fontSize: 22,
// //     fontWeight: "bold",
// //     color: "#2E86C1",
// //     marginBottom: 20,
// //   },
// //   input: {
// //     borderWidth: 1,
// //     borderColor: "#ccc",
// //     borderRadius: 10,
// //     padding: 12,
// //     marginBottom: 20,
// //   },
// //   uploadBtn: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: "#2E86C1",
// //     padding: 14,
// //     borderRadius: 10,
// //     justifyContent: "center",
// //   },
// //   pdfBtn: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: "#28A745",
// //     padding: 14,
// //     borderRadius: 10,
// //     justifyContent: "center",
// //     marginTop: 12,
// //   },
// //   btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
// //   card: {
// //     backgroundColor: "#F4F6F7",
// //     padding: 15,
// //     borderRadius: 10,
// //     marginBottom: 15,
// //     shadowColor: "#000",
// //     shadowOpacity: 0.1,
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowRadius: 5,
// //     elevation: 2,
// //   },
// //   cardTitle: { fontSize: 16, fontWeight: "bold", color: "#2E4053" },
// //   cardText: { fontSize: 14, color: "#5D6D7E", marginVertical: 5 },
// //   cardDate: { fontSize: 12, color: "#839192" },
// // });

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Switch,
// } from "react-native";
// import { MaterialIcons } from "@expo/vector-icons";
// import * as DocumentPicker from "expo-document-picker";
// import { useLab } from "../context/LabContext";
// import { useToast } from "../context/ToastContext";

// export default function UploadReport({ route }) {
//   const { addManualReport, addPdfReport } = useLab();
//   const { show } = useToast();
//   const [patientId, setPatientId] = useState("");
//   const [title, setTitle] = useState("");
//   const [reportDetails, setReportDetails] = useState("");
//   const [isEmergency, setIsEmergency] = useState(false);

//   useEffect(() => {
//     if (route?.params?.patientId) {
//       setPatientId(route.params.patientId);
//     }
//   }, [route?.params?.patientId]);

//   const handleManualUpload = () => {
//     if (!patientId || !reportDetails) {
//       show("Please enter Patient ID and details", "danger");
//       return;
//     }
//     addManualReport(patientId, title, reportDetails, { isEmergency });
//     setReportDetails("");
//     setTitle("");
//     setIsEmergency(false);
//     show("Report saved", "success");
//   };

//   const handlePickPdf = async () => {
//     if (!patientId) {
//       show("Enter patient ID first", "danger");
//       return;
//     }
//     try {
//       const res = await DocumentPicker.getDocumentAsync({
//         type: "application/pdf",
//         multiple: false,
//       });
//       if (res.canceled) return;
//       const file = res.assets?.[0];
//       if (file) {
//         addPdfReport(patientId, title, file.uri, file.name, { isEmergency });
//         setTitle("");
//         setIsEmergency(false);
//         show("PDF uploaded", "success");
//       }
//     } catch (e) {
//       show("Failed to pick PDF", "danger");
//     }
//   };

//   return (
//     <ScrollView
//       contentContainerStyle={styles.container}
//       showsVerticalScrollIndicator={false}
//     >
//       <Text style={styles.heading}>📑 Upload / Update Report</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter Patient ID"
//         value={patientId}
//         onChangeText={setPatientId}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Report Title (optional)"
//         value={title}
//         onChangeText={setTitle}
//       />

//       <TextInput
//         style={[styles.input, { height: 120 }]}
//         placeholder="Enter Report Details"
//         value={reportDetails}
//         onChangeText={setReportDetails}
//         multiline
//       />

//       {/* Emergency Toggle */}
//       <View style={styles.emergencyRow}>
//         <Switch value={isEmergency} onValueChange={setIsEmergency} />
//         <Text style={{ marginLeft: 10, fontSize: 16 }}>
//           🚨 Mark as Emergency
//         </Text>
//       </View>

//       <TouchableOpacity style={styles.uploadBtn} onPress={handleManualUpload}>
//         <MaterialIcons name="cloud-upload" size={22} color="#fff" />
//         <Text style={styles.btnText}> Save Manual Report</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.pdfBtn} onPress={handlePickPdf}>
//         <MaterialIcons name="picture-as-pdf" size={22} color="#fff" />
//         <Text style={styles.btnText}> Upload PDF</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#fff" },
//   heading: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#2E86C1",
//     marginBottom: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     padding: 12,
//     marginBottom: 20,
//   },
//   emergencyRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   uploadBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#2E86C1",
//     padding: 14,
//     borderRadius: 10,
//     justifyContent: "center",
//   },
//   pdfBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#28A745",
//     padding: 14,
//     borderRadius: 10,
//     justifyContent: "center",
//     marginTop: 12,
//   },
//   btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
// });

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useNavigation } from "@react-navigation/native";

export default function ReportDetail({ route }) {
  const { report } = route.params || {};
  const navigation = useNavigation();

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
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Emergency Badge */}
      {report.isEmergency && (
        <View style={styles.emergencyBadge}>
          <Text style={styles.emergencyText}>🚨 Emergency Report</Text>
        </View>
      )}

      <Text style={styles.title}>{report.title}</Text>
      <Text style={styles.meta}>Patient ID: {report.patientId}</Text>
      <Text style={styles.meta}>Uploaded by: {report.uploadedByName}</Text>
      <Text style={styles.meta}>
        On: {new Date(report.createdAt).toLocaleString()}
      </Text>

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

      {/* Emergency Reports → Show Video Call */}
      {report.isEmergency && (
        <TouchableOpacity
          style={[styles.pdfBtn, { backgroundColor: "#e74c3c" }]}
          onPress={() =>
            navigation.navigate("VideoCall", {
              roomId: `${report.patientId}_${report.id}`,
            })
          }
        >
          <MaterialIcons name="video-call" size={20} color="#fff" />
          <Text style={styles.pdfText}> Start Video Call</Text>
        </TouchableOpacity>
      )}

      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <TouchableOpacity
          style={[styles.pdfBtn, { flex: 1, backgroundColor: "#6C757D" }]}
          onPress={shareOrGeneratePdf}
        >
          <MaterialIcons name="download" size={20} color="#fff" />
          <Text style={styles.pdfText}> Download</Text>
        </TouchableOpacity>
        <View style={{ width: 10 }} />
        <TouchableOpacity
          style={[styles.pdfBtn, { flex: 1, backgroundColor: "#2E86C1" }]}
          onPress={shareOrGeneratePdf}
        >
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
  emergencyBadge: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  emergencyText: { color: "#fff", fontWeight: "700" },
});

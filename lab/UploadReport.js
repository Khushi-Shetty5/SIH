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
import { useState,useEffect,useRef } from "react";
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

export default function UploadReport({ route, navigation }) {
  const { patients, addManualReport, addPdfReport } = useLab();
  const { show } = useToast();
  const [patientId, setPatientId] = useState("");
  const [title, setTitle] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [patient, setPatient] = useState(null);

  // Extract doctorId from route params
  const { userData } = route?.params || {};
  const doctorId = userData?.id || userData?._id;

  useEffect(() => {
    if (route?.params?.patientId) {
      const patientIdFromParams = route.params.patientId;
      setPatientId(patientIdFromParams);
      
      // Find patient details
      const foundPatient = patients.find(p => p._id === patientIdFromParams);
      setPatient(foundPatient);
    }
  }, [route?.params?.patientId, patients]);

  const handleManualUpload = async () => {
    if (!patientId) {
      show("Please select a patient", "danger");
      return;
    }
    
    // Check if we have a valid doctorId
    if (!doctorId) {
      show("Doctor information not found. Please login again.", "danger");
      return;
    }
    
    if (!reportDetails && !selectedFile) {
      show("Please enter report details or attach a file", "danger");
      return;
    }
    
    setLoading(true);
    try {
      await addManualReport(patientId, title, reportDetails, doctorId);
      setReportDetails("");
      setTitle("");
      setSelectedFile(null);
      show("Report saved successfully", "success");
      
      // Navigate back to patient detail or patient search
      if (route?.params?.from === 'PatientDetail') {
        navigation.goBack();
      } else {
        navigation.navigate("PatientSearch");
      }
    } catch (error) {
      console.error("Error in handleManualUpload:", error);
      show("Failed to save report: " + (error.response?.data?.message || error.message), "danger");
    } finally {
      setLoading(false);
    }
  };

  const handlePickPdf = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: "application/pdf", multiple: false });
      if (res.canceled) return;
      const file = res.assets?.[0];
      if (file) {
        setSelectedFile(file);
        show("File selected: " + file.name, "success");
      }
    } catch (e) {
      console.error("Error picking PDF:", e);
      show("Failed to pick PDF: " + e.message, "danger");
    }
  };

  const handleUploadPdf = async () => {
    if (!patientId) {
      show("Please select a patient", "danger");
      return;
    }
    
    // Check if we have a valid doctorId
    if (!doctorId) {
      show("Doctor information not found. Please login again.", "danger");
      return;
    }
    
    if (!selectedFile) {
      show("Please select a file first", "danger");
      return;
    }
    
    setLoading(true);
    try {
      await addPdfReport(patientId, title, selectedFile.uri, selectedFile.name, doctorId);
      setTitle("");
      setSelectedFile(null);
      show("PDF uploaded successfully", "success");
      
      // Navigate back to patient detail or patient search
      if (route?.params?.from === 'PatientDetail') {
        navigation.goBack();
      } else {
        navigation.navigate("PatientSearch");
      }
    } catch (error) {
      console.error("Error in handleUploadPdf:", error);
      show("Failed to upload PDF: " + (error.response?.data?.message || error.message), "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.heading}>📑 Upload / Update Report</Text>
      
      {/* Patient Information Display */}
      {patient && (
        <View style={styles.patientInfoCard}>
          <Text style={styles.patientInfoTitle}>Patient Information</Text>
          <Text style={styles.patientInfoText}>Name: {patient.name}</Text>
          <Text style={styles.patientInfoText}>Age: {patient.age}</Text>
          <Text style={styles.patientInfoText}>Gender: {patient.gender}</Text>
          <Text style={styles.patientInfoText}>ID: {patient._id}</Text>
        </View>
      )}
      
      {!patient && (
        <TextInput
          style={styles.input}
          placeholder="Enter Patient ID *"
          value={patientId}
          onChangeText={setPatientId}
        />
      )}

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

      <TouchableOpacity 
        style={styles.filePickerBtn} 
        onPress={handlePickPdf}
      >
        <MaterialIcons name="attach-file" size={22} color="#fff" />
        <Text style={styles.btnText}>
          {selectedFile ? `Selected: ${selectedFile.name}` : " Attach File"}
        </Text>
      </TouchableOpacity>

      {selectedFile && (
        <View style={styles.filePreview}>
          <MaterialIcons name="description" size={24} color="#28A745" />
          <Text style={styles.fileName}>{selectedFile.name}</Text>
        </View>
      )}

      <TouchableOpacity 
        style={[styles.uploadBtn, loading && styles.disabledBtn]} 
        onPress={handleManualUpload}
        disabled={loading}
      >
        <MaterialIcons name="cloud-upload" size={22} color="#fff" />
        <Text style={styles.btnText}>
          {loading ? "Saving..." : " Save Report"}
        </Text>
      </TouchableOpacity>

      {selectedFile && (
        <TouchableOpacity 
          style={[styles.pdfBtn, loading && styles.disabledBtn]} 
          onPress={handleUploadPdf}
          disabled={loading}
        >
          <MaterialIcons name="file-upload" size={22} color="#fff" />
          <Text style={styles.btnText}>
            {loading ? "Uploading..." : " Upload Attached File"}
          </Text>
        </TouchableOpacity>
      )}
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
  patientInfoCard: {
    backgroundColor: "#e8f1f9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#2E86C1",
  },
  patientInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E86C1",
    marginBottom: 10,
  },
  patientInfoText: {
    fontSize: 16,
    color: "#2E4053",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  filePickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6c757d",
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 12,
  },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E86C1",
    padding: 14,
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 16,
  },
  disabledBtn: {
    backgroundColor: "#a5d6a7",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  filePreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  fileName: {
    marginLeft: 8,
    fontSize: 14,
    color: "#495057",
    flex: 1,
  },
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
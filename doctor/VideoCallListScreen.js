import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert, Linking } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useDoctor } from "../context/DoctorContext";

export default function VideoCallListScreen({ navigation, route }) {
  const { patients, doctorData } = useDoctor();
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Get doctorId from route params
  const { userData } = route?.params || {};
  const doctorId = userData?.id || userData?._id;

  // Dummy patient data for testing if no patients are available from context
  const dummyPatients = [
    {
      _id: "dummy1",
      name: "John Doe",
      age: 35,
      gender: "M",
      phoneNumber: "+1234567890",
      reason: "Follow-up consultation for diabetes management",
      birthDate: "1988-05-15"
    },
    {
      _id: "dummy2",
      name: "Jane Smith",
      age: 28,
      gender: "F",
      phoneNumber: "+1234567891",
      reason: "Post-surgery checkup for knee replacement",
      birthDate: "1995-03-22"
    },
    {
      _id: "dummy3",
      name: "Robert Johnson",
      age: 45,
      gender: "M",
      phoneNumber: "+1234567892",
      reason: "Consultation for persistent cough and fever",
      birthDate: "1978-11-10"
    }
  ];

  // Use dummy data if no patients from context
  const patientList = patients && patients.length > 0 ? patients : dummyPatients;

  // Calculate age from birth date if available
  const calculateAge = (birthDate, age) => {
    if (birthDate) {
      const today = new Date();
      const birth = new Date(birthDate);
      let patientAge = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        patientAge--;
      }
      return patientAge;
    }
    return age || "N/A";
  };

  // Function to directly start video call
  const startVideoCall = async (patient) => {
    // Check if we have a valid doctorId
    if (!doctorId) {
      Alert.alert("Error", "Doctor information not found. Please login again.");
      return;
    }
    
    try {
      // Get doctor ID from context (in a real app)
      const effectiveDoctorId = doctorData?._id || doctorId;
      
      // Create a Daily.co room (in a real app, this would call your backend API)

      const API_BASE_URL = "http://192.168.1.48:5000";
      const response = await fetch(`${API_BASE_URL}/api/doctors/create-daily-room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: patient._id,
          doctorId: effectiveDoctorId // Use the doctorId from context
        })
      });
      const data = await response.json();
      console.log(data)
      if (data.success && data.roomUrl) {
        // Navigate directly to VideoCallScreen with room URL and patient data
        navigation.navigate("VideoCall", { 
          patient: patient,
          roomUrl: data.roomUrl,
          roomId: data.roomId,
          roomName: data.roomName
        });
      } else {
        throw new Error(data.error || 'Failed to create room');
      }
    } catch (error) {
      console.error('Error creating Daily.co room:', error);
      Alert.alert('Error', error.message || 'Failed to create video call room');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Ionicons name="videocam" size={28} color="#fff" />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Video Consultations</Text>
              <Text style={styles.headerSubtitle}>{patientList.length} patients available</Text>
            </View>
          </View>
        </View>

        {/* Patient List */}
        <View style={styles.requestsContainer}>
          {patientList && patientList.length > 0 ? (
            patientList.map((patient) => (
              <View key={patient._id || patient.id} style={styles.requestCard}>
                <View style={styles.patientInfoContainer}>
                  <View style={styles.avatarContainer}>
                    <MaterialIcons 
                      name={patient.gender === "M" ? "man" : "woman"} 
                      size={28} 
                      color={patient.gender === "M" ? "#2E86C1" : "#E91E63"} 
                    />
                  </View>
                  <View style={styles.patientDetails}>
                    <Text style={styles.patientName}>{patient.name}</Text>
                    <Text style={styles.patientInfoText}>
                      {calculateAge(patient.birthDate, patient.age)} years, {patient.gender}
                    </Text>
                    <Text style={styles.reasonText}>
                      {patient.reason || patient.condition || "General consultation"}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.buttonGroup}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => startVideoCall(patient)}
                  >
                    <Ionicons name="videocam" size={18} color="#4CAF50" />
                    <Text style={styles.actionButtonText}>Video</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => {
                      const phoneNumber = patient.phoneNumber || patient.contact;
                      if (phoneNumber) {
                        // Ensure the phone number is in the correct format for dialing
                        const formattedNumber = phoneNumber.replace(/\s/g, '');
                        Linking.openURL(`tel:${formattedNumber}`);
                      } else {
                        Alert.alert("No Phone Number", "Patient phone number is not available");
                      }
                    }}
                  >
                    <MaterialIcons name="call" size={18} color="#2196F3" />
                    <Text style={styles.actionButtonText}>Audio</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => {
                      setSelectedPatient(patient);
                      setScheduleModalVisible(true);
                    }}
                  >
                    <MaterialIcons name="schedule" size={18} color="#2E86C1" />
                    <Text style={styles.actionButtonText}>Schedule</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="videocam-off" size={64} color="#E0E0E0" />
              <Text style={styles.emptyStateTitle}>No Patients Found</Text>
              <Text style={styles.emptyStateSubtitle}>There are no patients in your list at the moment.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Schedule Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={scheduleModalVisible}
        onRequestClose={() => setScheduleModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule Appointment</Text>
              <TouchableOpacity 
                onPress={() => setScheduleModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              {selectedPatient && (
                <View style={styles.patientSummary}>
                  <View style={styles.modalAvatar}>
                    <MaterialIcons 
                      name={selectedPatient.gender === "M" ? "man" : "woman"} 
                      size={32} 
                      color={selectedPatient.gender === "M" ? "#2E86C1" : "#E91E63"} 
                    />
                  </View>
                  <View style={styles.patientSummaryText}>
                    <Text style={styles.modalPatientName}>{selectedPatient.name}</Text>
                    <Text style={styles.modalPatientInfo}>
                      {calculateAge(selectedPatient.birthDate, selectedPatient.age)} years, {selectedPatient.gender}
                    </Text>
                  </View>
                </View>
              )}
              <Text style={styles.modalText}>Schedule functionality coming soon.</Text>
              <Text style={styles.modalText}>This will be integrated with your calendar system to schedule appointments.</Text>
              
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setScheduleModalVisible(false)}
              >
                <Text style={styles.modalCloseButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerContainer: {
    backgroundColor: "#2E86C1",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTextContainer: {
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  requestsContainer: {
    marginBottom: 20,
  },
  requestCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  patientInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E2E2E",
    marginBottom: 4,
  },
  patientInfoText: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 14,
    color: "#6c757d",
    lineHeight: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 0.3,
    justifyContent: "center",
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2E86C1",
    marginLeft: 4,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E2E2E",
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    alignItems: "center",
  },
  patientSummary: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    marginBottom: 24,
  },
  modalAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  patientSummaryText: {
    flex: 1,
  },
  modalPatientName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E2E2E",
    marginBottom: 4,
  },
  modalPatientInfo: {
    fontSize: 14,
    color: "#6c757d",
  },
  modalText: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  modalCloseButton: {
    backgroundColor: "#2E86C1",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  modalCloseButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
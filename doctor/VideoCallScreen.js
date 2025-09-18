import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useDoctor } from "../context/DoctorContext";

export function VideoCallScreen({ navigation }) {
  const { patients } = useDoctor();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Mock data for patient call requests
  // In a real app, this would come from your backend or context
  const [callRequests, setCallRequests] = useState([
    {
      id: "1",
      patientId: "p1",
      name: "Rajesh Kumar",
      reason: "Follow-up consultation for diabetes management",
      time: "10:30 AM",
      avatar: null,
      gender: "M",
      status: "pending"
    },
    {
      id: "2",
      patientId: "p2",
      name: "Priya Sharma",
      reason: "Post-surgery checkup for knee replacement",
      time: "11:15 AM",
      avatar: null,
      gender: "F",
      status: "pending"
    },
    {
      id: "3",
      patientId: "p3",
      name: "Amit Patel",
      reason: "Consultation for persistent cough and fever",
      time: "2:45 PM",
      avatar: null,
      gender: "M",
      status: "pending"
    },
    {
      id: "4",
      patientId: "p4",
      name: "Sneha Reddy",
      reason: "Medication review and adjustment",
      time: "4:00 PM",
      avatar: null,
      gender: "F",
      status: "pending"
    }
  ]);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setModalVisible(true);
  };

  const handleStartVideoCall = () => {
    setModalVisible(false);
    Alert.alert(
      "Video Call",
      `Starting video call with ${selectedPatient?.name}`,
      [
        { text: "OK" }
      ]
    );
    // In a real app, you would integrate with a video calling SDK here
  };

  const handleStartAudioCall = () => {
    setModalVisible(false);
    Alert.alert(
      "Audio Call",
      `Starting audio call with ${selectedPatient?.name}`,
      [
        { text: "OK" }
      ]
    );
    // In a real app, you would integrate with a calling SDK here
  };

  const handleScheduleLater = () => {
    setModalVisible(false);
    Alert.alert(
      "Schedule Appointment",
      `Scheduling appointment for ${selectedPatient?.name}`,
      [
        { text: "OK" }
      ]
    );
    // In a real app, you would open a scheduling interface
  };

  const getAvatarColor = (gender) => {
    return gender === "M" ? "#E3F2FD" : "#FCE4EC";
  };

  const getAvatarIconColor = (gender) => {
    return gender === "M" ? "#2E86C1" : "#E91E63";
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
              <Text style={styles.headerSubtitle}>{callRequests.length} pending requests</Text>
            </View>
          </View>
        </View>

        {/* Call Requests List */}
        <View style={styles.requestsContainer}>
          {callRequests.length > 0 ? (
            callRequests.map((request) => (
              <TouchableOpacity
                key={request.id}
                style={styles.requestCard}
                onPress={() => handlePatientSelect(request)}
                activeOpacity={0.8}
              >
                <View style={styles.patientInfoContainer}>
                  <View style={[styles.avatarContainer, { backgroundColor: getAvatarColor(request.gender) }]}>
                    <MaterialIcons 
                      name={request.gender === "M" ? "man" : "woman"} 
                      size={28} 
                      color={getAvatarIconColor(request.gender)} 
                    />
                  </View>
                  <View style={styles.patientDetails}>
                    <Text style={styles.patientName}>{request.name}</Text>
                    <Text style={styles.reasonText}>{request.reason}</Text>
                    <View style={styles.timeContainer}>
                      <MaterialIcons name="schedule" size={14} color="#8E8E93" />
                      <Text style={styles.timeText}>{request.time}</Text>
                    </View>
                  </View>
                </View>
                <MaterialIcons name="chevron-right" size={24} color="#2E86C1" />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="videocam-off" size={64} color="#E0E0E0" />
              <Text style={styles.emptyStateTitle}>No Call Requests</Text>
              <Text style={styles.emptyStateSubtitle}>You don't have any pending video call requests at the moment.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Call Options</Text>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>
            
            {selectedPatient && (
              <View style={styles.modalContent}>
                <View style={styles.patientSummary}>
                  <View style={[styles.modalAvatar, { backgroundColor: getAvatarColor(selectedPatient.gender) }]}>
                    <MaterialIcons 
                      name={selectedPatient.gender === "M" ? "man" : "woman"} 
                      size={32} 
                      color={getAvatarIconColor(selectedPatient.gender)} 
                    />
                  </View>
                  <View style={styles.patientSummaryText}>
                    <Text style={styles.modalPatientName}>{selectedPatient.name}</Text>
                    <Text style={styles.modalReason}>{selectedPatient.reason}</Text>
                  </View>
                </View>
                
                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.videoCallButton]}
                    onPress={handleStartVideoCall}
                  >
                    <Ionicons name="videocam" size={24} color="#fff" />
                    <Text style={styles.actionButtonText}>Video Call</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.audioCallButton]}
                    onPress={handleStartAudioCall}
                  >
                    <MaterialIcons name="call" size={24} color="#fff" />
                    <Text style={styles.actionButtonText}>Audio Call</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.scheduleButton]}
                    onPress={handleScheduleLater}
                  >
                    <MaterialIcons name="schedule" size={24} color="#2E86C1" />
                    <Text style={styles.scheduleButtonText}>Schedule for Later</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
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
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  patientInfoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E2E2E",
    marginBottom: 4,
  },
  reasonText: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 6,
    lineHeight: 20,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 13,
    color: "#8E8E93",
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
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
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
  modalReason: {
    fontSize: 14,
    color: "#6c757d",
    lineHeight: 20,
  },
  modalActions: {
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    paddingHorizontal: 20,
  },
  videoCallButton: {
    backgroundColor: "#4CAF50",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  audioCallButton: {
    backgroundColor: "#2196F3",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scheduleButton: {
    backgroundColor: "#E3F2FD",
    borderWidth: 1,
    borderColor: "#2E86C1",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 12,
  },
  scheduleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E86C1",
    marginLeft: 12,
  },
});

export default VideoCallScreen;
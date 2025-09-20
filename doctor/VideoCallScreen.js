import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Alert, Linking, Platform } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useDoctor } from "../context/DoctorContext";

// Daily.co Video Call Component
const DailyCoVideoCall = ({ roomUrl, onEndCall, onToggleMute, onToggleCamera, isMuted, isCameraOn }) => {
  // In a real implementation with daily.co, you would use:
  // 1. @daily-co/react-native-daily-js library
  // 2. Create a call frame and join the room
  // 3. Handle participant events, media events, etc.
  
  /*
  import DailyIframe from '@daily-co/react-native-daily-js';
  
  const callFrameRef = useRef(null);
  
  useEffect(() => {
    // Initialize Daily.co call frame
    const initializeCall = async () => {
      try {
        callFrameRef.current = DailyIframe.createCallFrame({
          url: roomUrl,
          showLeaveButton: false,
          showFullscreenButton: false,
        });
        
        // Event listeners
        callFrameRef.current
          .on('joined-meeting', handleJoinedMeeting)
          .on('participant-joined', handleParticipantJoined)
          .on('participant-left', handleParticipantLeft)
          .on('error', handleError);
        
        // Join the room
        await callFrameRef.current.join({ url: roomUrl });
      } catch (error) {
        console.error('Error initializing Daily.co call:', error);
        Alert.alert('Connection Error', 'Failed to connect to video call');
      }
    };
    
    initializeCall();
    
    // Cleanup
    return () => {
      if (callFrameRef.current) {
        callFrameRef.current.destroy();
      }
    };
  }, [roomUrl]);
  
  const handleJoinedMeeting = () => {
    console.log('Joined meeting successfully');
  };
  
  const handleParticipantJoined = (event) => {
    console.log('Participant joined:', event);
  };
  
  const handleParticipantLeft = (event) => {
    console.log('Participant left:', event);
  };
  
  const handleError = (error) => {
    console.error('Daily.co error:', error);
    Alert.alert('Call Error', error.message);
  };
  */
  
  // For now, we'll use a placeholder UI that simulates the video call experience with Daily.co
  return (
    <View style={styles.videoContainer}>
      {/* Remote Video Stream (Patient's camera) */}
      <View style={styles.remoteVideo}>
        <View style={styles.videoPlaceholderContainer}>
          <Ionicons name="person" size={64} color="#fff" />
          <Text style={styles.videoPlaceholderText}>Patient's Video</Text>
          <Text style={styles.dailyCoText}>Daily.co Video Call</Text>
        </View>
      </View>
      
      {/* Self View (Doctor's camera) */}
      <View style={styles.selfView}>
        <View style={styles.selfViewPlaceholder}>
          <Ionicons name="person" size={32} color="#fff" />
          <Text style={styles.selfViewText}>You</Text>
        </View>
      </View>
      
      {/* Call Controls Overlay */}
      <View style={styles.callControlsOverlay}>
        <TouchableOpacity style={styles.controlButton} onPress={onToggleMute}>
          <MaterialIcons name={isMuted ? "mic-off" : "mic"} size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.controlButton, styles.endCallButton]} 
          onPress={onEndCall}
        >
          <MaterialIcons name="call-end" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.controlButton} onPress={onToggleCamera}>
          <MaterialIcons name={isCameraOn ? "videocam" : "videocam-off"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Video Call Screen Component
export function VideoCallScreen({ route, navigation }) {
  const { patient, roomUrl, roomId, roomName } = route.params || {};
  const { patients, doctorData } = useDoctor(); // Get doctorData from context
  const [isCallActive, setIsCallActive] = useState(!!roomUrl); // If roomUrl is provided, call is active
  const [callType, setCallType] = useState(roomUrl ? 'video' : null); // 'video' or 'audio'
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [dailyRoomUrl, setDailyRoomUrl] = useState(roomUrl || null);

  // Get doctorId from route params
  const { userData } = route?.params || {};
  const doctorId = userData?.id || userData?._id || doctorData?._id;

  // Dummy patient data for testing if no patient is provided
  const dummyPatient = {
    _id: "dummy123",
    name: "John Doe",
    age: 35,
    gender: "M",
    phoneNumber: "+1234567890",
    reason: "Follow-up consultation",
    birthDate: "1988-05-15"
  };

  const currentPatient = patient || dummyPatient;

  // Calculate age from birth date if available
  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Create a Daily.co room (in a real app, this would call your backend API)
  const createDailyRoom = async () => {
    // Check if we have a valid doctorId
    if (!doctorId) {
      Alert.alert("Error", "Doctor information not found. Please login again.");
      return null;
    }
    
    try {
      // In a real implementation, you would call your backend to create a room:
      const API_BASE_URL = "http://10.188.235.128:5000";
      
      const response = await fetch(`${API_BASE_URL}/api/doctors/create-daily-room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: currentPatient._id,
          doctorId: doctorId // Use the doctorId from context
        })
      });
      
      const data = await response.json();
      if (data.success && data.roomUrl) {
        setDailyRoomUrl(data.roomUrl);
        return data.roomUrl;
      } else {
        throw new Error(data.error || 'Failed to create room');
      }
    } catch (error) {
      console.error('Error creating Daily.co room:', error);
      Alert.alert('Error', error.message || 'Failed to create video call room');
      return null;
    }
  };

  // Handle end call
  const handleEndCall = () => {
    setIsCallActive(false);
    setCallType(null);
    setDailyRoomUrl(null);
    Alert.alert("Call Ended", "The call has been disconnected");
  };

  // Handle mute toggle
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    Alert.alert("Microphone", isMuted ? "Microphone unmuted" : "Microphone muted");
  };

  // Handle toggle camera
  const handleToggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    Alert.alert("Camera", isCameraOn ? "Camera turned on" : "Camera turned off");
  };

  // Start video call with Daily.co
  const startVideoCall = async () => {
    // If roomUrl is already provided (from direct navigation), use it
    console.log("came to call room")
    if (roomUrl) {
      setIsCallActive(true);
      setCallType('video');
      return;
    }
    
    // Otherwise create a new room
    const roomUrl = await createDailyRoom();
    if (roomUrl) {
      setIsCallActive(true);
      setCallType('video');
    }
  };

  // If we navigated directly with a room URL, start the call immediately
  useEffect(() => {
    if (roomUrl && !isCallActive) {
      setIsCallActive(true);
      setCallType('video');
    }
  }, [roomUrl, isCallActive]);

  if (currentPatient && isCallActive && callType === 'video') {
    // Daily.co Video Call UI
    return (
      <View style={styles.callContainer}>
        {/* Patient Details Header */}
        <View style={styles.callHeader}>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{currentPatient.name}</Text>
            <Text style={styles.patientDetailsText}>
              {calculateAge(currentPatient.birthDate || currentPatient.age)} years, {currentPatient.gender}
            </Text>
            <Text style={styles.patientDetailsText}>{currentPatient.reason || "Video Consultation"}</Text>
          </View>
        </View>

        {/* Daily.co Video Container */}
        <DailyCoVideoCall 
          roomUrl={dailyRoomUrl}
          onEndCall={handleEndCall}
          onToggleMute={handleToggleMute}
          onToggleCamera={handleToggleCamera}
          isMuted={isMuted}
          isCameraOn={isCameraOn}
        />

        {/* Call Status Bar */}
        <View style={styles.callStatusBar}>
          <Text style={styles.callStatusText}>Daily.co Video Call - Connected</Text>
          <View style={styles.callIndicators}>
            {isMuted && (
              <View style={styles.indicator}>
                <MaterialIcons name="mic-off" size={16} color="#fff" />
              </View>
            )}
            {!isCameraOn && (
              <View style={styles.indicator}>
                <MaterialIcons name="videocam-off" size={16} color="#fff" />
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }

  // Patient Details View (when not in a call)
  if (currentPatient) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Patient Card */}
          <View style={styles.patientCard}>
            <View style={styles.patientHeader}>
              <View style={styles.avatarContainer}>
                <MaterialIcons 
                  name={currentPatient.gender === "M" ? "man" : "woman"} 
                  size={32} 
                  color={currentPatient.gender === "M" ? "#2E86C1" : "#E91E63"} 
                />
              </View>
              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>{currentPatient.name}</Text>
                <Text style={styles.patientDetailsText}>
                  {calculateAge(currentPatient.birthDate || currentPatient.age)} years, {currentPatient.gender}
                </Text>
                <Text style={styles.patientDetailsText}>{currentPatient.reason || "Video Consultation"}</Text>
                {currentPatient.phoneNumber && (
                  <Text style={styles.patientDetailsText}>📞 {currentPatient.phoneNumber}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Call Options */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity 
              style={[styles.optionButton, styles.videoCallButton]}
              onPress={startVideoCall}
            >
              <Ionicons name="videocam" size={24} color="#fff" />
              <Text style={styles.optionButtonText}>Video Call</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.optionButton, styles.audioCallButton]}
              onPress={() => {
                const phoneNumber = currentPatient.phoneNumber || currentPatient.contact;
                if (phoneNumber) {
                  // Ensure the phone number is in the correct format for dialing
                  const formattedNumber = phoneNumber.replace(/\s/g, '');
                  Linking.openURL(`tel:${formattedNumber}`);
                } else {
                  Alert.alert("No Phone Number", "Patient phone number is not available");
                }
              }}
            >
              <MaterialIcons name="call" size={24} color="#fff" />
              <Text style={styles.optionButtonText}>Audio Call</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.optionButton, styles.scheduleButton]}
              onPress={() => {
                Alert.alert(
                  "Schedule Appointment",
                  "Schedule functionality coming soon. This will be integrated with your calendar system.",
                  [{ text: "OK" }]
                );
              }}
            >
              <MaterialIcons name="schedule" size={24} color="#2E86C1" />
              <Text style={styles.scheduleButtonText}>Schedule Later</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // If no patient data, show error
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>No patient data available</Text>
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
  // Video Call Screen Styles
  callContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  callHeader: {
    backgroundColor: "#2E86C1",
    padding: 20,
    paddingTop: 50,
  },
  patientCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  patientHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
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
  optionButtonText: {
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
  patientDetailsText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  videoContainer: {
    flex: 1,
    backgroundColor: "#333",
    position: "relative",
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: "#444",
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlaceholderContainer: {
    alignItems: "center",
  },
  videoPlaceholderText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
  },
  selfView: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 100,
    height: 150,
    backgroundColor: "#555",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  selfViewPlaceholder: {
    alignItems: "center",
  },
  selfViewText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
  },
  callControlsOverlay: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  endCallButton: {
    backgroundColor: "#f44336",
  },
  errorText: {
    fontSize: 18,
    color: "#f44336",
    textAlign: "center",
    marginTop: 50,
  },
  callStatusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  callStatusText: {
    color: "#fff",
    fontWeight: "600",
  },
  callIndicators: {
    flexDirection: "row",
    gap: 10,
  },
  indicator: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 5,
    borderRadius: 10,
  },
});

export default VideoCallScreen;
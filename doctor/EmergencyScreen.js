import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Alert, Linking, Modal, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useDoctor } from "../context/DoctorContext";

export default function EmergencyScreen({ navigation }) {
  const { emergencies, acknowledgeEmergency, attendEmergency, addEmergencyNote } = useDoctor();
  const [showNoteModal, setShowNoteModal] = React.useState(false);
  const [selectedEmergency, setSelectedEmergency] = React.useState(null);
  const [noteText, setNoteText] = React.useState('');

  console.log('Emergency Screen - Emergencies data:', emergencies);

  // Handle acknowledge emergency
  const handleAcknowledge = (emergencyId) => {
    acknowledgeEmergency(emergencyId);
    Alert.alert('Acknowledged', 'Emergency has been acknowledged successfully');
  };

  // Handle attend emergency
  const handleAttend = (emergencyId) => {
    attendEmergency(emergencyId, 'current-doctor');
    Alert.alert('Attending', 'You are now attending this emergency case');
  };

  // Handle call patient
  const handleCallPatient = (contact, patientName) => {
    if (!contact) {
      Alert.alert('Error', 'No contact information available');
      return;
    }
    
    const phoneNumber = contact.replace(/[^0-9+]/g, '');
    Alert.alert(
      'Call Patient',
      `Call ${patientName || 'Patient'} at ${contact}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${phoneNumber}`).catch(() => {
              Alert.alert('Error', 'Unable to make phone call');
            });
          }
        }
      ]
    );
  };

  // Get time ago string
  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown time';
    
    const date = new Date(dateString);
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // Handle add note
  const handleAddNote = (emergency) => {
    setSelectedEmergency(emergency);
    setNoteText('');
    setShowNoteModal(true);
  };

  // Handle save note
  const handleSaveNote = async () => {
    console.log('Save note button clicked');
    console.log('Note text:', noteText);
    console.log('Selected emergency:', selectedEmergency);
    
    if (!noteText.trim()) {
      Alert.alert('Error', 'Please enter a note');
      return;
    }
    
    const emergencyId = selectedEmergency._id || selectedEmergency.id;
    console.log('Calling addEmergencyNote with ID:', emergencyId, 'and note:', noteText.trim());
    
    const result = await addEmergencyNote(emergencyId, noteText.trim());
    
    console.log('addEmergencyNote result:', result);
    
    if (result.success) {
      setShowNoteModal(false);
      setNoteText('');
      setSelectedEmergency(null);
      Alert.alert('Success', 'Doctor note added successfully. Patient will be notified.');
    } else {
      Alert.alert('Error', result.error || 'Failed to add note. Please try again.');
    }
  };


  const renderEmergencyItem = ({ item }) => {
    // Handle both 'priority' and 'priority' field names from API
    const priorityLevel = (item.priority || item.urgency || 'medium').toLowerCase();
    
    const priorityColors = {
      high: { bg: "#FFEBEE", text: "#F44336", icon: "priority-high" },
      critical: { bg: "#FFEBEE", text: "#F44336", icon: "warning" },
      medium: { bg: "#FFF3E0", text: "#FF9800", icon: "warning" },
      low: { bg: "#E3F2FD", text: "#2E86C1", icon: "info" }
    };
    
    const priority = priorityColors[priorityLevel] || priorityColors.medium;
    
    // Handle different possible data structures
    const emergencyId = item._id || item.id;
    const emergencyTitle = item.title || item.reason || item.description || 'Emergency Case';
    const patientName = item.patientName || item.patient?.name || item.patient || 'Unknown Patient';
    const emergencyDetails = item.details || item.description || item.symptoms || '';
    const timeReported = item.timeReported || item.createdAt || item.timestamp;
    const contact = item.contact || item.patient?.contact || item.patient?.phone;
    
    return (
      <View style={[styles.emergencyCard, { borderLeftColor: priority.text, borderLeftWidth: 4 }]}>
        {/* Emergency Header */}
        <View style={styles.emergencyHeader}>
          <View style={styles.emergencyHeaderLeft}>
            <View style={[styles.priorityBadge, { backgroundColor: priority.bg }]}>
              <MaterialIcons name={priority.icon} size={14} color={priority.text} />
              <Text style={[styles.priorityText, { color: priority.text, marginLeft: 4 }]}>
                {priorityLevel.toUpperCase()}
              </Text>
            </View>
            {timeReported && (
              <Text style={styles.timeAgo}>{getTimeAgo(timeReported)}</Text>
            )}
          </View>
          
          <View style={styles.emergencyHeaderRight}>
            {item.acknowledged && (
              <View style={styles.acknowledgedBadge}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={[styles.acknowledgedText, { marginLeft: 4 }]}>Acknowledged</Text>
              </View>
            )}
            {item.attendingBy && (
              <View style={styles.attendingBadge}>
                <MaterialIcons name="person" size={16} color="#2E86C1" />
                <Text style={[styles.attendingText, { marginLeft: 4 }]}>Attending</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Patient Info */}
        <View style={styles.patientSection}>
          <View style={styles.patientInfo}>
            <View style={styles.patientAvatar}>
              <Text style={styles.avatarText}>
                {patientName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.patientDetails}>
              <Text style={styles.patientName}>{patientName}</Text>
              {item.age && (
                <Text style={styles.patientMeta}>
                  {item.age}y • {item.gender || 'N/A'}
                </Text>
              )}
            </View>
          </View>
        </View>
        
        {/* Emergency Title */}
        <Text style={styles.emergencyTitle}>{emergencyTitle}</Text>
        
        {/* Emergency Details */}
        {emergencyDetails && (
          <Text style={styles.emergencyDetails} numberOfLines={3}>
            {emergencyDetails}
          </Text>
        )}
        
        {/* Additional Information */}
        {item.location && (
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={14} color="#8E8E93" />
            <Text style={styles.infoText}>Location: {item.location}</Text>
          </View>
        )}
        
        {item.reportedBy && (
          <View style={styles.infoRow}>
            <MaterialIcons name="person-outline" size={14} color="#8E8E93" />
            <Text style={styles.infoText}>Reported by: {item.reportedBy}</Text>
          </View>
        )}
        
        {/* Doctor Notes */}
        {(item.notes && item.notes.length > 0) && (
          <View style={styles.notesSection}>
            <View style={styles.notesSectionHeader}>
              <MaterialIcons name="note" size={16} color="#9C27B0" />
              <Text style={styles.notesSectionTitle}>Doctor Notes ({item.notes.length})</Text>
            </View>
            {item.notes.slice(-2).map((note, index) => (
              <View key={index} style={styles.noteItem}>
                <Text style={styles.noteText}>• {note}</Text>
              </View>
            ))}
            {item.notes.length > 2 && (
              <Text style={styles.moreNotesText}>+{item.notes.length - 2} more notes</Text>
            )}
          </View>
        )}
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {!item.acknowledged && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.acknowledgeButton]}
              onPress={() => handleAcknowledge(emergencyId)}
            >
              <MaterialIcons name="check" size={16} color="#fff" />
              <Text style={[styles.actionButtonText, { marginLeft: 4 }]}>Acknowledge</Text>
            </TouchableOpacity>
          )}
          
          {!item.attendingBy && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.attendButton]}
              onPress={() => handleAttend(emergencyId)}
            >
              <MaterialIcons name="medical-services" size={16} color="#fff" />
              <Text style={[styles.actionButtonText, { marginLeft: 4 }]}>Attend</Text>
            </TouchableOpacity>
          )}
          
          {contact && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.callButton]}
              onPress={() => handleCallPatient(contact, patientName)}
            >
              <MaterialIcons name="phone" size={16} color="#fff" />
              <Text style={[styles.actionButtonText, { marginLeft: 4 }]}>Call</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.noteButton]}
            onPress={() => handleAddNote(item)}
          >
            <MaterialIcons name="note-add" size={16} color="#fff" />
            <Text style={[styles.actionButtonText, { marginLeft: 4 }]}>Add Note</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Emergency Cases</Text>
          <Text style={styles.headerSubtitle}>
            {emergencies.length} {emergencies.length === 1 ? 'case' : 'cases'} requiring attention
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate("AddEmergency")}
        >
          <MaterialIcons name="add" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Emergency</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={emergencies}
        renderItem={renderEmergencyItem}
        keyExtractor={item => item._id || item.id || Math.random().toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="assignment-turned-in" size={64} color="#E0E0E0" />
            <Text style={styles.emptyText}>No emergencies found</Text>
            <Text style={styles.emptySubtext}>
              {emergencies.length === 0 ? 'All caught up! No emergency cases to handle.' : 'Check your connection and try again.'}
            </Text>
          </View>
        )}
        ListHeaderComponent={() => (
          emergencies.length > 0 && (
            <View style={styles.headerStats}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{emergencies.length}</Text>
                <Text style={styles.statLabel}>Total Cases</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, { color: '#F44336' }]}>
                  {emergencies.filter(e => (e.priority || '').toLowerCase() === 'high' || (e.priority || '').toLowerCase() === 'critical').length}
                </Text>
                <Text style={styles.statLabel}>High Priority</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, { color: '#4CAF50' }]}>
                  {emergencies.filter(e => e.acknowledged).length}
                </Text>
                <Text style={styles.statLabel}>Acknowledged</Text>
              </View>
            </View>
          )
        )}
      />
      
      {/* Add Note Modal */}
      <Modal
        visible={showNoteModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNoteModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowNoteModal(false)}>
              <MaterialIcons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Doctor Note</Text>
            <TouchableOpacity onPress={handleSaveNote} disabled={!noteText.trim()}>
              <Text style={[styles.saveButton, !noteText.trim() && styles.saveButtonDisabled]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <Text style={styles.modalSubtitle}>
              Patient: {selectedEmergency?.patientName || selectedEmergency?.patient?.name}
            </Text>
            <Text style={styles.modalEmergencyTitle}>
              Emergency: {selectedEmergency?.title || selectedEmergency?.reason}
            </Text>
            <TextInput
              style={styles.noteInput}
              placeholder="Enter your medical note for the patient..."
              value={noteText}
              onChangeText={setNoteText}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            <Text style={styles.noteHint}>
              💡 This note will be sent to the patient and can help them understand their condition and next steps.
            </Text>
          </View>
        </View>
      </Modal>
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E4053",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
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
  headerStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2E86C1",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "600",
  },
  listContainer: {
    paddingBottom: 20,
  },
  emergencyCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  emergencyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  emergencyHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  emergencyHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "700",
  },
  timeAgo: {
    fontSize: 12,
    color: "#8E8E93",
    fontStyle: "italic",
  },
  acknowledgedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  acknowledgedText: {
    fontSize: 11,
    color: "#4CAF50",
    fontWeight: "600",
  },
  attendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  attendingText: {
    fontSize: 11,
    color: "#2E86C1",
    fontWeight: "600",
  },
  patientSection: {
    marginBottom: 12,
  },
  patientInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  patientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2E86C1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E4053",
    marginBottom: 2,
  },
  patientMeta: {
    fontSize: 12,
    color: "#8E8E93",
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E4053",
    marginBottom: 8,
    lineHeight: 24,
  },
  emergencyDetails: {
    fontSize: 14,
    color: "#6C757D",
    lineHeight: 20,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: "#8E8E93",
    marginLeft: 6,
  },
  notesSection: {
    backgroundColor: "#F8F5FF",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#9C27B0",
  },
  notesSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  notesSectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9C27B0",
    marginLeft: 6,
  },
  noteItem: {
    marginBottom: 4,
  },
  noteText: {
    fontSize: 12,
    color: "#6C757D",
    lineHeight: 16,
  },
  moreNotesText: {
    fontSize: 11,
    color: "#9C27B0",
    fontStyle: "italic",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 12,
    flexWrap: "wrap",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    minWidth: 80,
    justifyContent: "center",
    marginRight: 8,
    marginBottom: 8,
  },
  acknowledgeButton: {
    backgroundColor: "#4CAF50",
  },
  attendButton: {
    backgroundColor: "#2E86C1",
  },
  callButton: {
    backgroundColor: "#FF9800",
  },
  noteButton: {
    backgroundColor: "#9C27B0",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: "#6C757D",
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#F8F9FA",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E4053",
  },
  saveButton: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9C27B0",
  },
  saveButtonDisabled: {
    color: "#9CA3AF",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 8,
    fontWeight: "600",
  },
  modalEmergencyTitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 20,
    fontStyle: "italic",
  },
  noteInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#2E4053",
    minHeight: 150,
    backgroundColor: "#F8F9FA",
  },
  noteHint: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 12,
    fontStyle: "italic",
    lineHeight: 16,
  },
});
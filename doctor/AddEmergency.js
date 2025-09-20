import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Dimensions, Platform, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useDoctor } from "../context/DoctorContext";

const { width } = Dimensions.get("window");

export default function AddEmergency({ navigation, route }) {
  const { addEmergency, patients } = useDoctor();
  const [formData, setFormData] = useState({
    patientId: '',
    title: '',
    details: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [showPatientSelector, setShowPatientSelector] = useState(false);

  // Get doctorId from route params
  const { userData } = route?.params || {};
  const doctorId = userData?.id || userData?._id;

  const handleAddEmergency = async () => {
    // Validation
    if (!formData.patientId) {
      Alert.alert("Validation Error", "Please select a patient");
      return;
    }
    
    if (!formData.title.trim()) {
      Alert.alert("Validation Error", "Please enter a title for the emergency");
      return;
    }
    
    // Check if we have a valid doctorId
    if (!doctorId) {
      Alert.alert("Error", "Doctor information not found. Please login again.");
      return;
    }

    setLoading(true);
    
    try {
      const result = await addEmergency({
        doctorId,
        patientId: formData.patientId,
        title: formData.title.trim(),
        details: formData.details.trim(),
        priority: formData.priority
      });
      
      setLoading(false);
      
      if (result.success) {
        Alert.alert(
          "Success", 
          `Emergency case "${formData.title}" added successfully!`,
          [
            {
              text: "Go to Main Page",
              onPress: () => {
                // Navigate back to the main page (Doctor Home)
                navigation.reset({
                  index: 0,
                  routes: [
                    { name: 'DoctorHome' }
                  ],
                });
              }
            },
            {
              text: "Add Another Emergency",
              onPress: () => {
                // Reset form for adding another emergency
                setFormData({
                  patientId: '',
                  title: '',
                  details: '',
                  priority: 'medium'
                });
              }
            }
          ]
        );
      } else {
        Alert.alert("Error", result.error || "Failed to add emergency case");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      console.error("Unexpected error in handleAddEmergency:", error);
    }
  };

  // Get selected patient name for display
  const selectedPatient = patients.find(p => (p._id || p.id) === formData.patientId);
  const selectedPatientName = selectedPatient ? 
    `${selectedPatient.name} (${selectedPatient.age || 'N/A'}y, ${selectedPatient.gender || 'N/A'})` : 
    'Select a patient';

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1 }}
        bounces={true}
        alwaysBounceVertical={false}
      >
        {/* Enhanced Header */}
        <View style={styles.addPatientHeaderContainer}>
          <View style={styles.addPatientIconContainer}>
            <MaterialIcons name="warning" size={24} color="#FF4757" />
          </View>
          <View style={styles.addPatientHeaderText}>
            <Text style={styles.addPatientTitle}>Add New Emergency</Text>
            <Text style={styles.addPatientSubtitle}>Fill in emergency information</Text>
          </View>
        </View>
        
        {/* Enhanced Form Card */}
        <View style={styles.enhancedFormCard}>
          {/* Patient Selection */}
          <View style={styles.enhancedInputGroup}>
            <View style={styles.inputLabelContainer}>
              <MaterialIcons name="person" size={16} color="#FF4757" />
              <Text style={styles.enhancedLabel}>Patient *</Text>
            </View>
            <TouchableOpacity 
              style={styles.enhancedTextInput}
              onPress={() => setShowPatientSelector(true)}
            >
              <Text style={{ color: formData.patientId ? '#2E4053' : '#8E8E93' }}>
                {selectedPatientName}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>
          
          {/* Title */}
          <View style={styles.enhancedInputGroup}>
            <View style={styles.inputLabelContainer}>
              <MaterialIcons name="title" size={16} color="#FF4757" />
              <Text style={styles.enhancedLabel}>Emergency Title *</Text>
            </View>
            <TextInput 
              style={styles.enhancedTextInput}
              placeholder="e.g., Severe chest pain, Difficulty breathing"
              placeholderTextColor="#8E8E93"
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({...prev, title: text}))}
            />
          </View>
          
          {/* Details */}
          <View style={styles.enhancedInputGroup}>
            <View style={styles.inputLabelContainer}>
              <MaterialIcons name="description" size={16} color="#FF4757" />
              <Text style={styles.enhancedLabel}>Details</Text>
            </View>
            <TextInput 
              style={[styles.enhancedTextInput, styles.enhancedTextArea]}
              placeholder="Describe the emergency situation in detail..."
              placeholderTextColor="#8E8E93"
              value={formData.details}
              onChangeText={(text) => setFormData(prev => ({...prev, details: text}))}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          {/* Priority */}
          <View style={styles.enhancedInputGroup}>
            <View style={styles.inputLabelContainer}>
              <MaterialIcons name="priority-high" size={16} color="#FF4757" />
              <Text style={styles.enhancedLabel}>Priority</Text>
            </View>
            <View style={styles.enhancedGenderRow}>
              {['high', 'medium', 'low'].map((priority) => (
                <TouchableOpacity 
                  key={priority}
                  style={[
                    styles.enhancedGenderOption, 
                    formData.priority === priority && styles.enhancedGenderSelected,
                    { 
                      backgroundColor: 
                        priority === 'high' ? '#FFEBEE' : 
                        priority === 'medium' ? '#FFF3E0' : 
                        '#E3F2FD',
                      borderColor: 
                        priority === 'high' ? '#F44336' : 
                        priority === 'medium' ? '#FF9800' : 
                        '#2E86C1'
                    }
                  ]}
                  onPress={() => setFormData(prev => ({...prev, priority: priority}))}
                >
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <MaterialIcons 
                      name={
                        priority === 'high' ? 'error' : 
                        priority === 'medium' ? 'warning' : 
                        'info'
                      } 
                      size={18} 
                      color={
                        priority === 'high' ? '#F44336' : 
                        priority === 'medium' ? '#FF9800' : 
                        '#2E86C1'
                      } 
                    />
                    <Text style={[
                      styles.enhancedGenderText,
                      { 
                        color: 
                          priority === 'high' ? '#F44336' : 
                          priority === 'medium' ? '#FF9800' : 
                          '#2E86C1'
                      },
                      formData.priority === priority && styles.enhancedGenderSelectedText
                    ]}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        
        {/* Enhanced Action Buttons */}
        <View style={styles.enhancedActionButtons}>
          <TouchableOpacity 
            style={styles.enhancedCancelButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <MaterialIcons name="close" size={16} color="#6c757d" />
            <Text style={styles.enhancedCancelText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.enhancedSaveButton, loading && styles.enhancedSaveButtonDisabled]}
            onPress={handleAddEmergency}
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialIcons name="hourglass-empty" size={16} color="#fff" />
                <Text style={styles.enhancedSaveText}>Saving...</Text>
              </View>
            ) : (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialIcons name="save" size={16} color="#fff" />
                <Text style={styles.enhancedSaveText}>Save Emergency</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* Patient Selector Modal */}
      <Modal
        visible={showPatientSelector}
        animationType="slide"
        onRequestClose={() => setShowPatientSelector(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPatientSelector(false)}>
              <MaterialIcons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Patient</Text>
            <View style={{ width: 24 }} /> {/* Spacer for alignment */}
          </View>
          
          <ScrollView style={styles.modalContent}>
            {patients.length > 0 ? (
              patients.map((patient) => (
                <TouchableOpacity
                  key={patient._id || patient.id}
                  style={[
                    styles.patientItem,
                    (patient._id || patient.id) === formData.patientId && styles.selectedPatientItem
                  ]}
                  onPress={() => {
                    setFormData(prev => ({...prev, patientId: patient._id || patient.id}));
                    setShowPatientSelector(false);
                  }}
                >
                  <View style={styles.patientInfoRow}>
                    <View style={styles.patientAvatarSmall}>
                      <Text style={styles.avatarTextSmall}>
                        {patient.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <View style={styles.patientDetailsSmall}>
                      <Text style={styles.patientNameSmall}>{patient.name}</Text>
                      <Text style={styles.patientMetaSmall}>
                        {patient.age || 'N/A'}y • {patient.gender || 'N/A'} • {patient.contact || 'No contact'}
                      </Text>
                    </View>
                    {(patient._id || patient.id) === formData.patientId && (
                      <MaterialIcons name="check" size={24} color="#4CAF50" />
                    )}
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <MaterialIcons name="people-outline" size={48} color="#E0E0E0" />
                <Text style={styles.emptyText}>No patients available</Text>
                <Text style={styles.emptySubText}>Please add patients first</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  // Enhanced Header Styles
  addPatientHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  addPatientIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  addPatientHeaderText: {
    flex: 1,
  },
  addPatientTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E4053',
    marginBottom: 4,
  },
  addPatientSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  // Enhanced Form Styles
  enhancedFormCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  enhancedInputGroup: {
    marginBottom: 20,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  enhancedLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E4053',
    marginLeft: 8,
  },
  enhancedTextInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  enhancedTextArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  // Enhanced Gender/Priority Selection
  enhancedGenderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  enhancedGenderOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
  enhancedGenderSelected: {
    borderWidth: 2,
  },
  enhancedGenderText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  enhancedGenderSelectedText: {
    fontWeight: '700',
  },
  // Enhanced Action Buttons
  enhancedActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  enhancedCancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    marginRight: 10,
  },
  enhancedCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
    marginLeft: 8,
  },
  enhancedSaveButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#2E86C1',
    marginLeft: 10,
  },
  enhancedSaveButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  enhancedSaveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#F8F9FA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E4053',
  },
  modalContent: {
    flex: 1,
  },
  patientItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  selectedPatientItem: {
    backgroundColor: '#E3F2FD',
  },
  patientInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  patientAvatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2E86C1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarTextSmall: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  patientDetailsSmall: {
    flex: 1,
  },
  patientNameSmall: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E4053',
    marginBottom: 2,
  },
  patientMetaSmall: {
    fontSize: 12,
    color: '#8E8E93',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: '#6C757D',
    fontWeight: '600',
  },
  emptySubText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});
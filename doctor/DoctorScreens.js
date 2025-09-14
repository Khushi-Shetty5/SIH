
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Image, Linking, Platform, Modal } from "react-native";
import { useDoctor } from "../context/DoctorContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import * as WebBrowser from "expo-web-browser";

// Import and re-export Calendar component
import { Calendar } from "../context/Calendar";
export { Calendar };

export function EmergencyScreen() {
  const { emergencies, attendEmergency } = useDoctor();
  
  const handleAttendEmergency = (emergency) => {
    Alert.alert(
      'Attend Emergency',
      `Attend to ${emergency.title}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Attend Now',
          onPress: () => {
            attendEmergency(emergency.id);
            Alert.alert(
              'Emergency Attended',
              `You are now attending to: ${emergency.title}`,
              [
                {
                  text: 'Call Patient',
                  onPress: () => {
                    // Extract patient info and call
                    Alert.alert('Calling...', 'Connecting to emergency contact.');
                  }
                },
                { text: 'OK' }
              ]
            );
          }
        }
      ]
    );
  };
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Current Emergencies</Text>
        
        {emergencies.length === 0 ? (
          <Card>
            <View style={styles.emptyStateSmall}>
              <MaterialIcons name="local-hospital" size={48} color="#28A745" />
              <Text style={styles.emptyText}>No Active Emergencies</Text>
              <Text style={styles.emptySubText}>All emergency cases have been handled</Text>
            </View>
          </Card>
        ) : (
          <Card>
            {emergencies.map((e) => (
              <View key={e.id} style={styles.emergencyItem}>
                <View style={styles.emergencyInfo}>
                  <View style={[styles.priorityIndicator, { 
                    backgroundColor: e.priority === 'high' ? '#dc3545' : 
                                   e.priority === 'medium' ? '#ffc107' : '#28a745' 
                  }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{e.title}</Text>
                    <Text style={styles.itemSub}>
                      {Math.round((Date.now() - e.time) / 60000)} min ago • Priority: {e.priority.toUpperCase()}
                      {e.attendingBy && ` • Attending`}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    e.attendingBy ? styles.btnSecondary : styles.btnPrimary,
                    { backgroundColor: e.attendingBy ? '#6c757d' : '#dc3545' }
                  ]}
                  onPress={() => !e.attendingBy && handleAttendEmergency(e)}
                  disabled={!!e.attendingBy}
                >
                  <Text style={styles.btnText}>
                    {e.attendingBy ? "Attending" : "Attend"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </Card>
        )}
        
        <Text style={styles.note}>Emergency notifications are updated in real-time</Text>
      </ScrollView>
    </View>
  );
}

export function PatientList({ navigation }) {
  const [q, setQ] = React.useState("");
  const { patients } = useDoctor();
  const filtered = patients.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Enhanced Header */}
        <View style={styles.patientHeaderContainer}>
          <View style={styles.headerIconContainer}>
            <MaterialIcons name="people" size={32} color="#2E86C1" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.patientHeader}>Patients</Text>
            <Text style={styles.patientSubHeader}>{filtered.length} patient{filtered.length !== 1 ? 's' : ''} found</Text>
          </View>
        </View>
        
        {/* Enhanced Search */}
        <View style={styles.enhancedSearchContainer}>
          <View style={styles.searchIconContainer}>
            <Ionicons name="search" color="#2E86C1" size={20} />
          </View>
          <TextInput 
            style={styles.enhancedSearchInput} 
            placeholder="Search patients by name..." 
            placeholderTextColor="#8E8E93"
            value={q} 
            onChangeText={setQ} 
          />
          {q.length > 0 && (
            <TouchableOpacity onPress={() => setQ('')} style={styles.clearSearchBtn}>
              <Ionicons name="close" color="#8E8E93" size={20} />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Enhanced Patient Cards */}
        <View style={styles.patientCardsContainer}>
          {filtered.length > 0 ? (
            filtered.map((p, index) => (
              <TouchableOpacity 
                key={p.id} 
                onPress={() => navigation.navigate("PatientProfile", { id: p.id })}
                style={[styles.patientCard, { marginBottom: index === filtered.length - 1 ? 0 : 16 }]}
                activeOpacity={0.7}
              >
                <View style={styles.patientCardContent}>
                  <View style={styles.patientAvatar}>
                    <MaterialIcons 
                      name={p.gender === 'M' ? 'man' : 'woman'} 
                      size={28} 
                      color="#fff" 
                    />
                  </View>
                  <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{p.name}</Text>
                    <View style={styles.patientDetails}>
                      <View style={styles.patientDetailItem}>
                        <MaterialIcons name="person" size={14} color="#6c757d" />
                        <Text style={styles.patientDetailText}>{p.gender === 'M' ? 'Male' : 'Female'}</Text>
                      </View>
                      <View style={styles.patientDetailItem}>
                        <MaterialIcons name="cake" size={14} color="#6c757d" />
                        <Text style={styles.patientDetailText}>{p.age} years</Text>
                      </View>
                    </View>
                    <View style={styles.lastVisitContainer}>
                      <MaterialIcons name="schedule" size={14} color="#28A745" />
                      <Text style={styles.lastVisitText}>Last visit: {p.lastVisit}</Text>
                    </View>
                  </View>
                  <View style={styles.patientCardAction}>
                    <View style={styles.viewPatientBtn}>
                      <MaterialIcons name="arrow-forward-ios" size={16} color="#2E86C1" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.enhancedEmptyState}>
              <View style={styles.emptyStateIconContainer}>
                <MaterialIcons name="person" size={64} color="#E3F2FD" />
              </View>
              <Text style={styles.enhancedEmptyText}>
                {q.length > 0 ? 'No patients found' : 'No patients yet'}
              </Text>
              <Text style={styles.enhancedEmptySubText}>
                {q.length > 0 ? 'Try adjusting your search terms' : 'Add your first patient to get started'}
              </Text>
              {q.length === 0 && (
                <TouchableOpacity 
                  style={styles.addFirstPatientBtn}
                  onPress={() => navigation.navigate("AddPatient")}
                >
                  <MaterialIcons name="add" size={20} color="#fff" />
                  <Text style={styles.addFirstPatientText}>Add First Patient</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Enhanced Floating Action Button */}
      <TouchableOpacity 
        style={styles.enhancedFab} 
        onPress={() => navigation.navigate("AddPatient")}
        activeOpacity={0.8}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

export function AddPatient({ navigation }) {
  const { addPatient } = useDoctor();
  const [formData, setFormData] = React.useState({
    name: '',
    age: '',
    gender: 'M',
    contact: '',
    history: ''
  });
  
  const handleSave = () => {
    if (!formData.name || !formData.age) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }
    
    const newPatient = {
      ...formData,
      age: parseInt(formData.age),
      lastVisit: new Date().toISOString().slice(0, 10)
    };
    
    addPatient(newPatient);
    
    Alert.alert('Success', 'Patient added successfully!');
    navigation.goBack();
  };
  
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
            <MaterialIcons name="person-add" size={24} color="#2E86C1" />
          </View>
          <View style={styles.addPatientHeaderText}>
            <Text style={styles.addPatientTitle}>Add New Patient</Text>
            <Text style={styles.addPatientSubtitle}>Fill in patient information</Text>
          </View>
        </View>
        
        {/* Enhanced Form Card */}
        <View style={styles.enhancedFormCard}>
          {/* Full Name */}
          <View style={styles.enhancedInputGroup}>
            <View style={styles.inputLabelContainer}>
              <MaterialIcons name="person" size={16} color="#2E86C1" />
              <Text style={styles.enhancedLabel}>Full Name *</Text>
            </View>
            <TextInput 
              style={styles.enhancedTextInput}
              placeholder="Enter patient's full name"
              placeholderTextColor="#8E8E93"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({...prev, name: text}))}
            />
          </View>
          
          {/* Age */}
          <View style={styles.enhancedInputGroup}>
            <View style={styles.inputLabelContainer}>
              <MaterialIcons name="cake" size={16} color="#2E86C1" />
              <Text style={styles.enhancedLabel}>Age *</Text>
            </View>
            <TextInput 
              style={styles.enhancedTextInput}
              placeholder="Enter age"
              placeholderTextColor="#8E8E93"
              value={formData.age}
              onChangeText={(text) => setFormData(prev => ({...prev, age: text}))}
              keyboardType="numeric"
            />
          </View>
          
          {/* Gender */}
          <View style={styles.enhancedInputGroup}>
            <View style={styles.inputLabelContainer}>
              <MaterialIcons name="wc" size={16} color="#2E86C1" />
              <Text style={styles.enhancedLabel}>Gender</Text>
            </View>
            <View style={styles.enhancedGenderRow}>
              <TouchableOpacity 
                style={[styles.enhancedGenderOption, formData.gender === 'M' && styles.enhancedGenderSelected]}
                onPress={() => setFormData(prev => ({...prev, gender: 'M'}))}
                activeOpacity={0.7}
              >
                <MaterialIcons 
                  name="man" 
                  size={18} 
                  color={formData.gender === 'M' ? '#fff' : '#2E86C1'} 
                />
                <Text style={[styles.enhancedGenderText, formData.gender === 'M' && styles.enhancedGenderSelectedText]}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.enhancedGenderOption, formData.gender === 'F' && styles.enhancedGenderSelected]}
                onPress={() => setFormData(prev => ({...prev, gender: 'F'}))}
                activeOpacity={0.7}
              >
                <MaterialIcons 
                  name="woman" 
                  size={18} 
                  color={formData.gender === 'F' ? '#fff' : '#2E86C1'} 
                />
                <Text style={[styles.enhancedGenderText, formData.gender === 'F' && styles.enhancedGenderSelectedText]}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Contact Number */}
          <View style={styles.enhancedInputGroup}>
            <View style={styles.inputLabelContainer}>
              <MaterialIcons name="phone" size={16} color="#2E86C1" />
              <Text style={styles.enhancedLabel}>Contact Number</Text>
            </View>
            <TextInput 
              style={styles.enhancedTextInput}
              placeholder="+91-0000000000"
              placeholderTextColor="#8E8E93"
              value={formData.contact}
              onChangeText={(text) => setFormData(prev => ({...prev, contact: text}))}
              keyboardType="phone-pad"
            />
          </View>
          
          {/* Medical History */}
          <View style={styles.enhancedInputGroup}>
            <View style={styles.inputLabelContainer}>
              <MaterialIcons name="medical-services" size={16} color="#2E86C1" />
              <Text style={styles.enhancedLabel}>Medical History</Text>
            </View>
            <TextInput 
              style={[styles.enhancedTextInput, styles.enhancedTextArea]}
              placeholder="Enter any known medical conditions, allergies, or previous treatments..."
              placeholderTextColor="#8E8E93"
              value={formData.history}
              onChangeText={(text) => setFormData(prev => ({...prev, history: text}))}
              multiline
              numberOfLines={3}
            />
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
            style={styles.enhancedSaveButton}
            onPress={handleSave}
            activeOpacity={0.7}
          >
            <MaterialIcons name="save" size={16} color="#fff" />
            <Text style={styles.enhancedSaveText}>Save Patient</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

export function ReportDetail({ route, navigation }) {
  const { reports, patients } = useDoctor();
  const { reportId } = route.params || {};
  const report = reports.find(r => r.id === reportId);
  const patient = patients.find(p => p.id === report?.patientId);
  
  if (!report) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.header}>Report Not Found</Text>
        </ScrollView>
      </View>
    );
  }

  const handleShareAttachment = async (attachment) => {
    try {
      if (Sharing && attachment.uri) {
        // For real files with URI, use expo-sharing
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          Alert.alert(
            'Share File',
            `Share ${attachment.name}?`,
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Share File', 
                onPress: async () => {
                  try {
                    await Sharing.shareAsync(attachment.uri, {
                      dialogTitle: `Share ${attachment.name}`,
                      mimeType: attachment.type === 'pdf' ? 'application/pdf' : 
                               attachment.type === 'image' ? 'image/*' : '*/*'
                    });
                  } catch (shareError) {
                    console.error('Share error:', shareError);
                    Alert.alert('Share Failed', 'Unable to share the file.');
                  }
                }
              },
              { 
                text: 'Share via Email', 
                onPress: () => {
                  const subject = `Medical Report: ${attachment.name}`;
                  const body = `Please find attached the medical report: ${attachment.name}\n\nFrom: MedKit App`;
                  const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  
                  Linking.openURL(emailUrl).catch(() => {
                    Alert.alert('Error', 'Unable to open email client. Please make sure you have an email app installed.');
                  });
                }
              },
              { 
                text: 'Share via Message', 
                onPress: () => {
                  const message = `Medical Report: ${attachment.name} - Shared from MedKit App`;
                  const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
                  
                  Linking.openURL(smsUrl).catch(() => {
                    Alert.alert('Error', 'Unable to open messaging app.');
                  });
                }
              }
            ]
          );
        } else {
          // Fallback to basic sharing options
          Alert.alert(
            'Share File',
            `Share ${attachment.name}?`,
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Share via Email', 
                onPress: () => {
                  const subject = `Medical Report: ${attachment.name}`;
                  const body = `Please find attached the medical report: ${attachment.name}\n\nFrom: MedKit App`;
                  const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  
                  Linking.openURL(emailUrl).catch(() => {
                    Alert.alert('Error', 'Unable to open email client. Please make sure you have an email app installed.');
                  });
                }
              },
              { 
                text: 'Share via Message', 
                onPress: () => {
                  const message = `Medical Report: ${attachment.name} - Shared from MedKit App`;
                  const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
                  
                  Linking.openURL(smsUrl).catch(() => {
                    Alert.alert('Error', 'Unable to open messaging app.');
                  });
                }
              },
              {
                text: 'Copy Link',
                onPress: () => {
                  // In a real app, you would copy the file URL to clipboard
                  Alert.alert('Link Copied', `Link to ${attachment.name} has been copied to clipboard.`);
                }
              }
            ]
          );
        }
      } else {
        // Fallback when Sharing is not available
        Alert.alert(
          'Share File',
          `Share ${attachment.name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Share via Email', 
              onPress: () => {
                const subject = `Medical Report: ${attachment.name}`;
                const body = `Please find attached the medical report: ${attachment.name}\n\nFrom: MedKit App`;
                const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                
                Linking.openURL(emailUrl).catch(() => {
                  Alert.alert('Error', 'Unable to open email client. Please make sure you have an email app installed.');
                });
              }
            },
            { 
              text: 'Share via Message', 
              onPress: () => {
                const message = `Medical Report: ${attachment.name} - Shared from MedKit App`;
                const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
                
                Linking.openURL(smsUrl).catch(() => {
                  Alert.alert('Error', 'Unable to open messaging app.');
                });
              }
            },
            {
              text: 'Copy Link',
              onPress: () => {
                // In a real app, you would copy the file URL to clipboard
                Alert.alert('Link Copied', `Link to ${attachment.name} has been copied to clipboard.`);
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Share setup error:', error);
      Alert.alert('Error', 'Unable to share file at this time.');
    }
  };

  const handleViewAttachment = async (attachment) => {
  try {
    if (!attachment || !attachment.uri) {
      Alert.alert("Error", "File not found.");
      return;
    }

    const { uri, name, type } = attachment;

    // ✅ Helper to download & save file
    const downloadAndSave = async () => {
      try {
        // Request permission to save
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission denied", "Cannot save files without permission.");
          return;
        }

        // Download file
        const fileUri = FileSystem.documentDirectory + name;
        const downloaded = await FileSystem.downloadAsync(uri, fileUri);

        // Save to media library (Gallery/Downloads)
        const asset = await MediaLibrary.createAssetAsync(downloaded.uri);
        await MediaLibrary.createAlbumAsync("Downloads", asset, false);

        Alert.alert("Success", `${name} saved to Downloads.`);
      } catch (err) {
        console.error("Download error:", err);
        Alert.alert("Error", "Failed to download file.");
      }
    };

    // ✅ Local files (file://)
    if (uri.startsWith("file://")) {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert("Error", "Sharing is not available on this device.");
      }
      return;
    }

    // ✅ Remote files
    if (type === "image" || name.match(/\.(jpg|jpeg|png|gif)$/i)) {
      Alert.alert("Image Options", `Choose what to do with ${name}`, [
        { text: "View", onPress: async () => await WebBrowser.openBrowserAsync(uri) },
        { text: "Download", onPress: downloadAndSave },
        { text: "Cancel", style: "cancel" },
      ]);
    } else if (type === "pdf" || name.match(/\.pdf$/i)) {
      Alert.alert("PDF Options", `Choose what to do with ${name}`, [
        { text: "View", onPress: async () => await WebBrowser.openBrowserAsync(uri) },
        { text: "Download", onPress: downloadAndSave },
        { text: "Cancel", style: "cancel" },
      ]);
    } else if (name.match(/\.(doc|docx|xls|xlsx|ppt|pptx|txt)$/i)) {
      Alert.alert("Document Options", `Choose what to do with ${name}`, [
        {
          text: "Share",
          onPress: async () => {
            if (await Sharing.isAvailableAsync()) {
              await Sharing.shareAsync(uri);
            } else {
              Alert.alert("Error", "Sharing not available.");
            }
          },
        },
        { text: "Download", onPress: downloadAndSave },
        { text: "Cancel", style: "cancel" },
      ]);
    } else {
      Alert.alert("Unsupported", "Cannot open this file type.");
    }
  } catch (error) {
    console.error("View attachment error:", error);
    Alert.alert("Error", "Unable to open file.");
  }
};
  const renderAttachment = (attachment, index) => {
    const isImage = attachment.type === 'image' || attachment.name.match(/\.(jpg|jpeg|png|gif)$/i);
    const isPDF = attachment.type === 'pdf' || attachment.name.match(/\.pdf$/i);
    
    return (
      <View key={index} style={styles.attachmentCard}>
        <View style={styles.attachmentHeader}>
          <View style={styles.attachmentInfo}>
            <MaterialIcons 
              name={isPDF ? 'description' : isImage ? 'image' : 'attach-file'} 
              size={28} 
              color={isPDF ? '#dc3545' : isImage ? '#28a745' : '#6c757d'} 
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.attachmentFileName}>{attachment.name}</Text>
              <Text style={styles.attachmentFileSize}>{attachment.size || 'Unknown size'}</Text>
              <Text style={styles.attachmentFileType}>
                {isPDF ? 'PDF Document' : isImage ? 'Image File' : 'Document'}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Preview for images */}
        {isImage && attachment.uri && (
          <View style={styles.imagePreviewContainer}>
            <Image 
              source={{ uri: attachment.uri }} 
              style={styles.imagePreview}
              resizeMode="cover"
            />
          </View>
        )}
        
        {/* Action buttons */}
        <View style={styles.attachmentActions}>
          
          <TouchableOpacity 
            style={styles.attachmentActionBtn}
            onPress={() => handleShareAttachment(attachment)}
          >
            <MaterialIcons name="share" size={20} color="#2E86C1" />
            <Text style={styles.attachmentActionText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.attachmentActionBtn}
            onPress={() => handleViewAttachment(attachment)}
          >
            <MaterialIcons name="visibility" size={20} color="#2E86C1" />
            <Text style={styles.attachmentActionText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>{report.title}</Text>
        
        {/* Report Info */}
        <Text style={styles.subHeader}>Report Information</Text>
        <Card>
          <Row title="Patient" subtitle={patient?.name || 'Unknown'} />
          <Row title="Report Type" subtitle={report.type || 'Doctor Note'} />
          <Row title="Status" subtitle={report.status.toUpperCase()} />
          <Row title="Created Date" subtitle={new Date(report.createdAt).toLocaleDateString()} />
          <Row title="Created Time" subtitle={new Date(report.createdAt).toLocaleTimeString()} />
        </Card>
        
        {/* Report Content */}
        {report.content && (
          <>
            <Text style={styles.subHeader}>Report Details</Text>
            <Card>
              <ScrollView style={styles.reportContentContainer} nestedScrollEnabled>
                <Text style={styles.reportContent}>{report.content}</Text>
              </ScrollView>
            </Card>
          </>
        )}
        
        {/* Attached Files */}
        {report.attachments && report.attachments.length > 0 && (
          <>
            <Text style={styles.subHeader}>Attachments ({report.attachments.length})</Text>
            {report.attachments.map(renderAttachment)}
          </>
        )}
        
        {/* No content message */}
        {!report.content && (!report.attachments || report.attachments.length === 0) && (
          <Card>
            <View style={styles.emptyStateSmall}>
              <MaterialIcons name="description" size={32} color="#6c757d" />
              <Text style={styles.emptyText}>No additional content</Text>
              <Text style={styles.emptySubText}>This report contains only basic information</Text>
            </View>
          </Card>
        )}
        
        {/* Actions */}
        <View style={styles.reportActions}>
          
         <TouchableOpacity 
  style={styles.actionButton}
  onPress={() => {
    if (Sharing && report) {
      Alert.alert(
        'Share Report',
        `Choose how to share "${report.title}"`,
        [
          { text: 'Cancel', style: 'cancel' },

          // ✅ View (just preview content in alert for now)
          {
            text: 'View',
            onPress: () => {
              Alert.alert(
                "Report Preview",
                `Title: ${report.title}
Patient: ${patient?.name || "Unknown"}
Date: ${new Date(report.createdAt).toLocaleDateString()}

${report.content || "No additional content"}`
              );
            }
          },

          // ✅ Share as plain text
         {
  text: 'Share as Text',
  onPress: async () => {
    try {
      const reportText = `Medical Report

Title: ${report.title}
Patient: ${patient?.name || 'Unknown'}
Date: ${new Date(report.createdAt).toLocaleDateString()}

Content:
${report.content || 'No additional content'}

Generated by MedKit App`;

      // ✅ Create a file path inside Expo's FileSystem
      const fileName = `${report.title.replace(/\s+/g, "_")}.txt`;
      const fileUri = FileSystem.cacheDirectory + fileName;

      // ✅ Write the text content into that file
      await FileSystem.writeAsStringAsync(fileUri, reportText);

      // ✅ Share the file
      await Sharing.shareAsync(fileUri);
    } catch (err) {
      console.error("Error sharing text report:", err);
      Alert.alert("Error", "Unable to share report as text.");
    }
  }
},


          // ✅ Share via Email
          {
            text: 'Email',
            onPress: () => {
              const subject = `Medical Report: ${report.title}`;
              const body = `Medical Report for ${patient?.name || 'Patient'}

Title: ${report.title}
Date: ${new Date(report.createdAt).toLocaleDateString()}

Content:
${report.content || 'No additional content'}

Best regards,
MedKit App`;

              const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

              Linking.openURL(emailUrl).catch(() => {
                Alert.alert('Error', 'Unable to open email client.');
              });
            }
          },

          // ✅ Share via WhatsApp
          {
            text: 'WhatsApp',
            onPress: () => {
              const message = `Medical Report: ${report.title}\n\n${report.content || 'No additional content'}`;
              const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;

              Linking.openURL(whatsappUrl).catch(() => {
                Alert.alert('Error', 'WhatsApp is not installed on this device.');
              });
            }
          },

          // ✅ Share via SMS
          {
            text: 'SMS',
            onPress: () => {
              const message = `Medical Report: ${report.title}\n\n${report.content || 'No additional content'}`;
              const smsUrl = `sms:?body=${encodeURIComponent(message)}`;

              Linking.openURL(smsUrl).catch(() => {
                Alert.alert('Error', 'Unable to open SMS app.');
              });
            }
          },

          // ✅ Download as file (like your attachments)
          {
            text: 'Download',
            onPress: async () => {
              try {
                const { status } = await MediaLibrary.requestPermissionsAsync();
                if (status !== "granted") {
                  Alert.alert("Permission denied", "Cannot save files without permission.");
                  return;
                }

                // Save report as a text file
                const fileName = `${report.title.replace(/\s+/g, "_")}.txt`;
                const fileUri = FileSystem.documentDirectory + fileName;

                const reportText = `Medical Report

Title: ${report.title}
Patient: ${patient?.name || "Unknown"}
Date: ${new Date(report.createdAt).toLocaleDateString()}

${report.content || "No additional content"}`;

                await FileSystem.writeAsStringAsync(fileUri, reportText);

                const asset = await MediaLibrary.createAssetAsync(fileUri);
                await MediaLibrary.createAlbumAsync("Downloads", asset, false);

                Alert.alert("Success", `Report saved to Downloads as ${fileName}.`);
              } catch (err) {
                console.error("Download error:", err);
                Alert.alert("Error", "Failed to download report.");
              }
            }
          }
        ]
      );
    } else {
      Alert.alert('Share Report', 'Report sharing feature is being prepared.');
    }
  }}
>
  <MaterialIcons name="share" size={20} color="#2E86C1" />
  <Text style={styles.actionButtonText}>Share Report</Text>
</TouchableOpacity>

          
        </View>
      </ScrollView>
    </View>
  );
}

export function PatientProfile({ route, navigation }) {
  const { patients, reports, addReport, appointments, updatePatientTreatment } = useDoctor();
  const { id } = route.params || {};
  const patient = patients.find((p) => p.id === id);
  const [showAddReport, setShowAddReport] = React.useState(false);
  const [reportTitle, setReportTitle] = React.useState('');
  const [reportContent, setReportContent] = React.useState('');
  const [reportType, setReportType] = React.useState('note');
  const [attachments, setAttachments] = React.useState([]);
  const [reportSearchQuery, setReportSearchQuery] = React.useState('');
  
  // Get reports for this patient
  const myReports = React.useMemo(() => {
    return reports.filter((r) => r.patientId === id);
  }, [reports, id]);
  
  // Filter reports based on search query
  const filteredReports = React.useMemo(() => {
    if (reportSearchQuery.trim() === '') {
      return myReports;
    }
    return myReports.filter(report => 
      report.title.toLowerCase().includes(reportSearchQuery.toLowerCase()) ||
      (report.type && report.type.toLowerCase().includes(reportSearchQuery.toLowerCase())) ||
      (report.status && report.status.toLowerCase().includes(reportSearchQuery.toLowerCase()))
    );
  }, [myReports, reportSearchQuery]);
  
  if (!patient) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.header}>Patient Not Found</Text>
        </ScrollView>
      </View>
    );
  }

  const handleAddReport = () => {
    if (!reportTitle.trim()) {
      Alert.alert('Error', 'Please enter a report title');
      return;
    }
    
    const newReport = {
      patientId: id, 
      title: reportTitle,
      content: reportContent,
      type: reportType,
      attachments: attachments
    };
    console.log(newReport.attachments)
    addReport(newReport);
    
    setReportTitle('');
    setReportContent('');
    setAttachments([]);
    setShowAddReport(false);
    
    Alert.alert('Success', 'Report added successfully!');
  };

const handleAddAttachment = () => {
  Alert.alert("Add Attachment", "Choose how you want to add a file", [
    { text: "Camera", onPress: () => openCamera() },
    { text: "Gallery", onPress: () => openGallery() },
    { text: "Documents", onPress: () => openDocumentPicker() },
    { text: "Cancel", style: "cancel" },
  ]);
};



const openCamera = async () => {
  try {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (permission.granted === false) {
      Alert.alert("Permission required", "Camera access is needed to take photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const newAttachment = {
        name: `camera_photo_${Date.now()}.jpg`,
        type: "image",
        size: "2 MB",
        uri: asset.uri,
        dateAdded: new Date().toISOString(),
      };
      setAttachments((prev) => [...prev, newAttachment]);
    }
  } catch (error) {
    console.warn('Camera access error:', error);
    Alert.alert("Error", "Unable to access camera. Please check permissions.");
  }
};

 const openGallery = async () => {
  try {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.granted === false) {
      Alert.alert("Permission required", "Gallery access is needed to select images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const newAttachment = {
        name: `gallery_photo_${Date.now()}.jpg`,
        type: "image",
        size: "2 MB",
        uri: asset.uri,
        dateAdded: new Date().toISOString(),
      };
      setAttachments((prev) => [...prev, newAttachment]);
    }
  } catch (error) {
    console.warn('Gallery access limited in Expo Go:', error);
    Alert.alert(
      "Limited Functionality", 
      "Full gallery access is limited in Expo Go. For complete functionality, please use a development build.",
      [
        { text: "Continue Anyway", onPress: () => {
          // Fallback: still try to open gallery
          ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
          }).then(result => {
            if (!result.canceled && result.assets && result.assets.length > 0) {
              const asset = result.assets[0];
              const newAttachment = {
                name: `gallery_photo_${Date.now()}.jpg`,
                type: "image",
                size: "2 MB",
                uri: asset.uri,
                dateAdded: new Date().toISOString(),
              };
              setAttachments((prev) => [...prev, newAttachment]);
            }
          }).catch(() => {
            Alert.alert("Error", "Unable to access gallery.");
          });
        }},
        { text: "Cancel", style: "cancel" }
      ]
    );
  }
};

  const openDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"],
        copyToCacheDirectory: true,
        multiple: false
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newAttachment = {
          name: asset.name,
          type: asset.mimeType || "document",
          size: asset.size ? `${(asset.size / (1024 * 1024)).toFixed(2)} MB` : "Unknown",
          uri: asset.uri,
          dateAdded: new Date().toISOString(),
        };
        setAttachments((prev) => [...prev, newAttachment]);
      } else if (result.type === "success") {
        // Handle older API response format
        const newAttachment = {
          name: result.name,
          type: result.mimeType || "document",
          size: result.size ? `${(result.size / (1024 * 1024)).toFixed(2)} MB` : "Unknown",
          uri: result.uri,
          dateAdded: new Date().toISOString(),
        };
        setAttachments((prev) => [...prev, newAttachment]);
      }
    } catch (error) {
      console.error('Document picker error:', error);
      Alert.alert("Error", "Unable to pick document. Please try again.");
    }
  };


  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleMarkTreated = () => {
    updatePatientTreatment(id);
    alert('Patient marked as treated successfully!');
    navigation.goBack();
  };

  const handleViewReport = (report) => {
    navigation.navigate('ReportDetail', { reportId: report.id });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>{patient.name}</Text>
        
        {/* Patient Details Section */}
        <Text style={styles.subHeader}>Patient Details</Text>
        <Card>
          <Row title="Full Name" subtitle={patient.name} />
          <Row title="Gender" subtitle={patient.gender === 'M' ? 'Male' : 'Female'} />
          <Row title="Age" subtitle={`${patient.age} years`} />
          <Row 
            title="Contact" 
            subtitle={patient.contact || "+91-0000000000"} 
            action={
              patient.contact && (
                <View style={{flexDirection: 'row', gap: 8}}>
                  <TouchableOpacity 
                    style={styles.quickActionBtn}
                    onPress={() => {
                      const phoneUrl = `tel:${patient.contact}`;
                      Linking.openURL(phoneUrl).catch(() => {
                        Alert.alert('Error', 'Unable to make phone call');
                      });
                    }}
                  >
                    <Ionicons name="call" size={16} color="#28A745" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.quickActionBtn}
                    onPress={() => {
                      const smsUrl = `sms:${patient.contact}`;
                      Linking.openURL(smsUrl).catch(() => {
                        Alert.alert('Error', 'Unable to send message');
                      });
                    }}
                  >
                    <Ionicons name="chatbubble" size={16} color="#2E86C1" />
                  </TouchableOpacity>
                </View>
              )
            }
          />
          <Row title="Last Visit" subtitle={patient.lastVisit} />
          <Row title="Medical History" subtitle={patient.history || "No medical history available"} />
        </Card>
        
        {/* Medical Reports Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.subHeader}>Medical Reports ({myReports.length})</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowAddReport(!showAddReport)}
          >
            <Ionicons name="add" size={20} color="#2E86C1" />
            <Text style={styles.addButtonText}>Add Report</Text>
          </TouchableOpacity>
        </View>
        
        {/* Reports Search */}
        {myReports.length > 0 && (
          <View style={styles.searchRow}>
            <Ionicons name="search" color="#6c757d" size={16} />
            <TextInput 
              style={styles.input} 
              placeholder="Search reports by title, type, or status" 
              value={reportSearchQuery} 
              onChangeText={setReportSearchQuery} 
            />
            {reportSearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setReportSearchQuery('')}>
                <Ionicons name="close" color="#6c757d" size={20} />
              </TouchableOpacity>
            )}
          </View>
        )}
        
        {/* Add Report Form */}
        {showAddReport && (
          <Card>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Report Title *</Text>
              <TextInput 
                style={styles.textInput}
                placeholder="Enter report title (e.g., Blood Test, X-Ray)"
                value={reportTitle}
                onChangeText={setReportTitle}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Report Content</Text>
              <TextInput 
                style={[styles.textInput, styles.textArea]}
                placeholder="Enter detailed report findings, observations, and recommendations..."
                value={reportContent}
                onChangeText={setReportContent}
                multiline
                numberOfLines={6}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Report Type</Text>
              <View style={styles.reportTypeRow}>
                {[{key: 'note', label: 'Doctor Note'}, {key: 'lab', label: 'Lab Report'}, {key: 'scan', label: 'Scan/Image'}].map((type) => (
                  <TouchableOpacity 
                    key={type.key}
                    style={[styles.typeOption, reportType === type.key && styles.typeSelected]}
                    onPress={() => setReportType(type.key)}
                  >
                    <Text style={[styles.typeText, reportType === type.key && styles.typeSelectedText]}>{type.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <View style={styles.attachmentHeaderGroup}>
                <Text style={styles.label}>Attachments</Text>
                <TouchableOpacity 
                  style={styles.addFileButton}
                  onPress={handleAddAttachment}
                >
                  <MaterialIcons name="add-photo-alternate" size={24} color="#2E86C1" />
                  <Text style={styles.addFileButtonText}>Add File</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.attachmentHint}>Add images, PDFs, or other documents</Text>
              
              {attachments.length > 0 && (
                <View style={styles.attachmentsList}>
                  {attachments.map((attachment, index) => (
                    <View key={index} style={styles.attachmentPreviewCard}>
                      <View style={styles.attachmentPreviewContent}>
                        <MaterialIcons 
                          name={attachment.type === 'pdf' ? 'description' : 'image'} 
                          size={32} 
                          color={attachment.type === 'pdf' ? '#dc3545' : '#28a745'} 
                        />
                        <View style={styles.attachmentPreviewInfo}>
                          <Text style={styles.attachmentPreviewName}>{attachment.name}</Text>
                          <Text style={styles.attachmentPreviewSize}>{attachment.size}</Text>
                        </View>
                        <TouchableOpacity 
                          onPress={() => removeAttachment(index)}
                          style={styles.removeAttachmentBtn}
                        >
                          <Ionicons name="close" size={24} color="#dc3545" />
                        </TouchableOpacity>
                      </View>
                      
                      {/* Preview for images */}
                      {attachment.type === 'image' && attachment.uri && (
                        <Image 
                          source={{ uri: attachment.uri }} 
                          style={styles.attachmentImagePreview}
                          resizeMode="cover"
                        />
                      )}
                    </View>
                  ))}
                </View>
              )}
              
              {attachments.length === 0 && (
                <View style={styles.noAttachmentsContainer}>
                  <MaterialIcons name="attach-file" size={48} color="#e0e0e0" />
                  <Text style={styles.noAttachmentsText}>No files attached</Text>
                  <Text style={styles.noAttachmentsSubText}>Tap "Add File" to attach documents</Text>
                </View>
              )}
            </View>
            
            <View style={{ flexDirection: "row", marginTop: 16 }}>
              <Button text="Cancel" type="secondary" onPress={() => setShowAddReport(false)} />
              <View style={{ width: 12 }} />
              <Button text="Add Report" onPress={handleAddReport} />
            </View>
          </Card>
        )}
        
        {/* Reports List */}
        <Card>
          {filteredReports.length > 0 ? (
            filteredReports.map((r) => (
              <View key={r.id} style={styles.reportItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>{r.title}</Text>
                  <Text style={styles.itemSub}>
                    {r.status.toUpperCase()} • {new Date(r.createdAt).toLocaleDateString()}
                    {r.type && ` • ${r.type.toUpperCase()}`}
                    {r.attachments && r.attachments.length > 0 && ` • ${r.attachments.length} attachment(s)`}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.viewButton}
                  onPress={() => handleViewReport(r)}
                >
                  <Ionicons name="eye" size={16} color="#2E86C1" />
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : reportSearchQuery.length > 0 ? (
            <View style={styles.emptyStateSmall}>
              <MaterialIcons name="search-off" size={32} color="#6c757d" />
              <Text style={styles.emptyText}>No reports found</Text>
              <Text style={styles.emptySubText}>Try adjusting your search terms</Text>
            </View>
          ) : (
            <View style={styles.emptyStateSmall}>
              <MaterialIcons name="description" size={32} color="#6c757d" />
              <Text style={styles.emptyText}>No reports available</Text>
              <Text style={styles.emptySubText}>Add a report to get started</Text>
            </View>
          )}
        </Card>
        
      </ScrollView>
    </View>
  );
}

export function LabReports() {
  const { reports, approveReport } = useDoctor();
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Lab Reports</Text>
        <Card>
          {reports.map((r) => (
            <Row key={r.id} title={r.title} subtitle={`${r.status} • ${new Date(r.createdAt).toLocaleDateString()}`} action={<Button text={r.status === "approved" ? "Approved" : "Approve"} onPress={() => approveReport(r.id)} />} />
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

export function Medicines() {
  const { medicines } = useDoctor();
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Filter medicines based on search query
  const filteredMedicines = React.useMemo(() => {
    if (searchQuery.trim() === '') {
      return medicines;
    }
    return medicines.filter(medicine => 
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [medicines, searchQuery]);
  
  // Calculate medicine statistics
  const medicineStats = React.useMemo(() => {
    const totalMedicines = medicines.length;
    const lowStockCount = medicines.filter(m => m.stock < 20).length;
    const outOfStockCount = medicines.filter(m => m.stock === 0).length;
    const totalStockValue = medicines.reduce((sum, m) => sum + m.stock, 0);
    
    return {
      total: totalMedicines,
      lowStock: lowStockCount,
      outOfStock: outOfStockCount,
      totalStock: totalStockValue
    };
  }, [medicines]);
  
  const getStockStatus = (stock) => {
    if (stock === 0) return { status: 'Out of Stock', color: '#dc3545', bgColor: '#FFF5F5' };
    if (stock < 20) return { status: 'Low Stock', color: '#ffc107', bgColor: '#FFFBF0' };
    return { status: 'In Stock', color: '#28a745', bgColor: '#F0FFF4' };
  };
  
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Enhanced Header */}
        <View style={styles.medicineHeaderContainer}>
          <View style={styles.medicineHeaderIconContainer}>
            <MaterialIcons name="medication" size={32} color="#2E86C1" />
          </View>
          <View style={styles.medicineHeaderTextContainer}>
            <Text style={styles.medicineHeader}>Medicine Inventory</Text>
            <Text style={styles.medicineSubHeader}>{filteredMedicines.length} medicine{filteredMedicines.length !== 1 ? 's' : ''} available</Text>
          </View>
        </View>
        
        {/* Medicine Statistics Cards */}
        <View style={styles.medicineStatsContainer}>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
              <MaterialIcons name="inventory" size={24} color="#2E86C1" />
              <Text style={styles.statValue}>{medicineStats.total}</Text>
              <Text style={styles.statLabel}>Total Medicines</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
              <MaterialIcons name="warning" size={24} color="#FF9800" />
              <Text style={styles.statValue}>{medicineStats.lowStock}</Text>
              <Text style={styles.statLabel}>Low Stock</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: '#FFEBEE' }]}>
              <MaterialIcons name="cancel" size={24} color="#F44336" />
              <Text style={styles.statValue}>{medicineStats.outOfStock}</Text>
              <Text style={styles.statLabel}>Out of Stock</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#E8F5E8' }]}>
              <MaterialIcons name="assessment" size={24} color="#4CAF50" />
              <Text style={styles.statValue}>{medicineStats.totalStock}</Text>
              <Text style={styles.statLabel}>Total Stock</Text>
            </View>
          </View>
        </View>
        
        {/* Enhanced Search */}
        <View style={styles.medicineSearchContainer}>
          <View style={styles.searchIconContainer}>
            <MaterialIcons name="search" color="#2E86C1" size={20} />
          </View>
          <TextInput 
            style={styles.medicineSearchInput} 
            placeholder="Search medicines by name..."
            placeholderTextColor="#8E8E93"
            value={searchQuery} 
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchBtn}>
              <MaterialIcons name="close" color="#8E8E93" size={20} />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Medicine Cards */}
        <View style={styles.medicineCardsContainer}>
          {filteredMedicines.length > 0 ? (
            filteredMedicines.map((medicine, index) => {
              const stockInfo = getStockStatus(medicine.stock);
              return (
                <View 
                  key={medicine.id} 
                  style={[
                    styles.medicineCard, 
                    { marginBottom: index === filteredMedicines.length - 1 ? 0 : 16 }
                  ]}
                >
                  <View style={styles.medicineCardHeader}>
                    <View style={styles.medicineIconContainer}>
                      <MaterialIcons name="medication" size={28} color="#2E86C1" />
                    </View>
                    <View style={styles.medicineMainInfo}>
                      <Text style={styles.medicineName}>{medicine.name}</Text>
                      <View style={styles.medicineStockContainer}>
                        <View style={[styles.stockBadge, { backgroundColor: stockInfo.bgColor }]}>
                          <MaterialIcons 
                            name={medicine.stock === 0 ? 'cancel' : medicine.stock < 20 ? 'warning' : 'check'} 
                            size={16} 
                            color={stockInfo.color} 
                          />
                          <Text style={[styles.stockBadgeText, { color: stockInfo.color }]}>
                            {stockInfo.status}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.medicineStockInfo}>
                    <View style={styles.stockDetailsContainer}>
                      <MaterialIcons name="inventory" size={18} color="#6c757d" />
                      <Text style={styles.stockText}>Stock: </Text>
                      <Text style={[styles.stockNumber, { color: stockInfo.color }]}>
                        {medicine.stock} units
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.medicineEmptyState}>
              <View style={styles.emptyStateIconContainer}>
                <MaterialIcons name="medication" size={64} color="#E3F2FD" />
              </View>
              <Text style={styles.enhancedEmptyText}>
                {searchQuery.length > 0 ? 'No medicines found' : 'No medicines available'}
              </Text>
              <Text style={styles.enhancedEmptySubText}>
                {searchQuery.length > 0 ? 'Try adjusting your search terms' : 'Medicine inventory is empty'}
              </Text>
            </View>
          )}
        </View>
        
        {/* Quick Summary */}
        {medicineStats.total > 0 && (
          <View style={styles.quickSummaryContainer}>
            <Text style={styles.quickSummaryTitle}>Medicine Summary</Text>
            <View style={styles.summaryContent}>
              <Text style={styles.summaryText}>
                Total: {medicineStats.total} medicines | 
                In Stock: {medicineStats.total - medicineStats.outOfStock} | 
                Low Stock: {medicineStats.lowStock} | 
                Out of Stock: {medicineStats.outOfStock}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}



export function DoctorProfile() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Doctor Profile</Text>
        <Card>
          <Row title="Name" subtitle="Dr. Meera Verma" />
          <Row title="Mobile Number" subtitle="+91-9876543210" action={
            <TouchableOpacity 
              style={styles.quickActionBtn}
              onPress={() => {
                const phoneUrl = `tel:+91-9876543210`;
                Linking.openURL(phoneUrl).catch(() => {
                  Alert.alert('Error', 'Unable to make phone call');
                });
              }}
            >
              <Ionicons name="call" size={16} color="#28A745" />
            </TouchableOpacity>
          } />
          <Row title="Specialization" subtitle="Cardiology" />
          <Row title="Availability" subtitle="Mon-Fri • 8AM-6PM" action={<Button text="Set" />} />
          <Row title="Status" subtitle="Available" action={<Button text="Toggle" type="secondary" />} />
        </Card>
      </ScrollView>
    </View>
  );
}

function Card({ children }) {
  return (
    <View style={styles.card}>{children}</View>
  );
}

function Row({ title, subtitle, action }) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle ? <Text style={styles.itemSub}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

function Button({ text, onPress, color, type }) {
  const isSecondary = type === "secondary";
  return (
    <TouchableOpacity onPress={onPress} style={[styles.btn, isSecondary ? styles.btnSecondary : styles.btnPrimary, color ? { backgroundColor: color } : null]}>
      <Text style={[styles.btnText, isSecondary ? { color: "#2E86C1" } : null]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  scrollContent: { padding: 16, paddingBottom: 100 },
  header: { fontSize: 20, fontWeight: "800", color: "#2E4053", marginBottom: 10 },
  subHeader: { marginTop: 14, marginBottom: 8, fontWeight: "700", color: "#2E4053" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 12,
  },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  itemTitle: { color: "#2E4053", fontWeight: "700" },
  itemSub: { color: "#6c757d", marginTop: 4, fontSize: 12 },
  btn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  btnPrimary: { backgroundColor: "#2E86C1" },
  btnSecondary: { backgroundColor: "#e8f1f9", borderWidth: 1, borderColor: "#cfe3f5" },
  btnText: { color: "#fff", fontWeight: "700" },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  input: { marginLeft: 8, flex: 1 },
  note: { color: "#6c757d", fontSize: 12, marginTop: 8 },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E86C1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateSmall: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: '#6c757d',
    fontWeight: '600',
    marginTop: 8,
  },
  emptySubText: {
    color: '#6c757d',
    fontSize: 12,
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#2E4053',
    fontWeight: '700',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    fontSize: 14,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  genderSelected: {
    backgroundColor: '#2E86C1',
    borderColor: '#2E86C1',
  },
  genderText: {
    color: '#2E4053',
    fontWeight: '600',
  },
  genderSelectedText: {
    color: '#fff',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e8f1f9',
    borderWidth: 1,
    borderColor: '#cfe3f5',
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: '#2E86C1',
    borderColor: '#2E86C1',
  },
  chipText: {
    color: '#2E86C1',
    fontWeight: '600',
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#e8f1f9',
    borderWidth: 1,
    borderColor: '#cfe3f5',
  },
  addButtonText: {
    color: '#2E86C1',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 12,
  },
  reportTypeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  typeSelected: {
    backgroundColor: '#2E86C1',
    borderColor: '#2E86C1',
  },
  typeText: {
    color: '#2E4053',
    fontWeight: '600',
    fontSize: 12,
  },
  typeSelectedText: {
    color: '#fff',
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#e8f1f9',
    borderWidth: 1,
    borderColor: '#cfe3f5',
  },
  viewButtonText: {
    color: '#2E86C1',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 12,
  },
  treatmentSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  treatmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28A745',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  treatmentButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
  reportContent: {
    color: '#2E4053',
    lineHeight: 20,
    fontSize: 14,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  attachmentName: {
    color: '#2E4053',
    fontWeight: '600',
  },
  attachmentSize: {
    color: '#6c757d',
    fontSize: 12,
    marginTop: 2,
  },
  reportActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#e8f1f9',
    borderWidth: 1,
    borderColor: '#cfe3f5',
  },
  actionButtonText: {
    color: '#2E86C1',
    fontWeight: '600',
    marginLeft: 6,
    fontSize: 12,
  },
  attachmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#e8f1f9',
  },
  attachButtonText: {
    color: '#2E86C1',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 12,
  },
  attachmentsList: {
    marginTop: 8,
  },
  attachmentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
  },
  attachmentText: {
    flex: 1,
    marginLeft: 8,
    color: '#2E4053',
    fontWeight: '500',
  },
  // ReportDetail styles
  attachmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  attachmentHeader: {
    marginBottom: 12,
  },
  attachmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachmentFileName: {
    color: '#2E4053',
    fontWeight: '700',
    fontSize: 16,
  },
  attachmentFileSize: {
    color: '#6c757d',
    fontSize: 12,
    marginTop: 2,
  },
  attachmentFileType: {
    color: '#2E86C1',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  imagePreviewContainer: {
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
  },
  attachmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },
  attachmentActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#e8f1f9',
  },
  attachmentActionText: {
    color: '#2E86C1',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 12,
  },
  reportContentContainer: {
    maxHeight: 200,
  },
  // Enhanced Add File styles
  attachmentHeaderGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addFileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#e8f1f9',
    borderWidth: 2,
    borderColor: '#2E86C1',
    borderStyle: 'dashed',
  },
  addFileButtonText: {
    color: '#2E86C1',
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 14,
  },
  attachmentHint: {
    color: '#6c757d',
    fontSize: 12,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  attachmentPreviewCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  attachmentPreviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachmentPreviewInfo: {
    flex: 1,
    marginLeft: 12,
  },
  attachmentPreviewName: {
    color: '#2E4053',
    fontWeight: '600',
    fontSize: 14,
  },
  attachmentPreviewSize: {
    color: '#6c757d',
    fontSize: 12,
    marginTop: 2,
  },
  removeAttachmentBtn: {
    padding: 4,
  },
  attachmentImagePreview: {
    width: '100%',
    height: 120,
    marginTop: 12,
    borderRadius: 8,
  },
  noAttachmentsContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  noAttachmentsText: {
    color: '#6c757d',
    fontWeight: '600',
    marginTop: 8,
  },
  noAttachmentsSubText: {
    color: '#6c757d',
    fontSize: 12,
    marginTop: 4,
  },
  // File upload states
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    marginTop: 8,
  },
  uploadingText: {
    marginLeft: 8,
    color: '#1976d2',
    fontWeight: '600',
  },
  quickActionBtn: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  emergencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  emergencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  priorityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  // Enhanced Patient List Styles
  patientHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  patientHeader: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2E4053',
    marginBottom: 4,
  },
  patientSubHeader: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  enhancedSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIconContainer: {
    marginRight: 12,
  },
  enhancedSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2E4053',
    fontWeight: '500',
  },
  clearSearchBtn: {
    padding: 4,
  },
  patientCardsContainer: {
    marginBottom: 20,
  },
  patientCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3F2FD',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  patientCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  patientAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E86C1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E4053',
    marginBottom: 8,
  },
  patientDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  patientDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  patientDetailText: {
    fontSize: 14,
    color: '#6c757d',
    marginLeft: 4,
    fontWeight: '500',
  },
  lastVisitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastVisitText: {
    fontSize: 13,
    color: '#28A745',
    marginLeft: 4,
    fontWeight: '600',
  },
  patientCardAction: {
    paddingLeft: 16,
  },
  viewPatientBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  enhancedEmptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  enhancedEmptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E4053',
    marginBottom: 8,
    textAlign: 'center',
  },
  enhancedEmptySubText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  addFirstPatientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E86C1',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  addFirstPatientText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  enhancedFab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2E86C1',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  // Enhanced Add Patient Styles - Optimized for Mobile
  addPatientHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  addPatientIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addPatientHeaderText: {
    flex: 1,
  },
  addPatientTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2E4053',
    marginBottom: 2,
  },
  addPatientSubtitle: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
  },
  enhancedFormCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  enhancedInputGroup: {
    marginBottom: 16,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  enhancedLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E4053',
    marginLeft: 6,
  },
  enhancedTextInput: {
    borderWidth: 1,
    borderColor: '#E3F2FD',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FAFBFC',
    fontSize: 14,
    color: '#2E4053',
    fontWeight: '500',
  },
  enhancedTextArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  enhancedGenderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  enhancedGenderOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E3F2FD',
    borderRadius: 10,
    backgroundColor: '#FAFBFC',
  },
  enhancedGenderSelected: {
    backgroundColor: '#2E86C1',
    borderColor: '#2E86C1',
  },
  enhancedGenderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E86C1',
    marginLeft: 6,
  },
  enhancedGenderSelectedText: {
    color: '#fff',
  },
  enhancedActionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  enhancedCancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  enhancedCancelText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6c757d',
    marginLeft: 6,
  },
  enhancedSaveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#2E86C1',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  enhancedSaveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 6,
  },
  // Enhanced Medicine Styles
  medicineHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  medicineHeaderIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  medicineHeaderTextContainer: {
    flex: 1,
  },
  medicineHeader: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2E4053',
    marginBottom: 4,
  },
  medicineSubHeader: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  medicineStatsContainer: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2E4053',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
    textAlign: 'center',
  },
  medicineSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medicineSearchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2E4053',
    fontWeight: '500',
  },
  medicineCardsContainer: {
    marginBottom: 20,
  },
  medicineCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3F2FD',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    padding: 16,
  },
  medicineCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicineIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  medicineMainInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E4053',
    marginBottom: 6,
  },
  medicineStockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stockBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  medicineStockInfo: {
    marginBottom: 16,
  },
  stockDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    fontSize: 14,
    color: '#6c757d',
    marginLeft: 6,
  },
  stockNumber: {
    fontSize: 14,
    fontWeight: '700',
  },
  medicineActions: {
    flexDirection: 'row',
    gap: 12,
  },
  medicineActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  prescribeBtn: {
    backgroundColor: '#2E86C1',
  },
  prescribeBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  requestBtn: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  requestBtnText: {
    color: '#FF9800',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  disabledBtn: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  disabledBtnText: {
    color: '#ccc',
  },
  medicineEmptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  quickActionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E4053',
    marginBottom: 16,
  },
  bulkRequestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9800',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  bulkRequestText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  // Calendar Styles
  calendarHeader: {
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  calendarTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2E4053',
    marginBottom: 4,
  },
  doctorStatusContainer: {
    marginTop: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  doctorStatusText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  statusChangeBtn: {
    marginLeft: 8,
    padding: 4,
  },
  newAppointmentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E86C1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  newAppointmentText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  dateNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navBtn: {
    padding: 8,
  },
  datePickerBtn: {
    flex: 1,
    alignItems: 'center',
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E4053',
  },
  viewSelector: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 4,
  },
  viewButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewButtonActive: {
    backgroundColor: '#2E86C1',
  },
  viewButtonText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '600',
  },
  viewButtonTextActive: {
    color: '#fff',
  },
  calendarContent: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  // Day View Styles
  dayViewContainer: {
    flex: 1,
  },
  timelineHeader: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  dateHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E4053',
    textAlign: 'center',
  },
  timeSlot: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
    minHeight: 80,
  },
  timeLabel: {
    width: 80,
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: '#E9ECEF',
    justifyContent: 'center',
  },
  timeLabelText: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '600',
  },
  slotContent: {
    flex: 1,
    padding: 8,
  },
  emptySlot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderStyle: 'dashed',
  },
  emptySlotText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
  },
  // Appointment Card Styles
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E3F2FD',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  compactCard: {
    marginBottom: 4,
    padding: 12,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E4053',
  },
  modalContent: {
    flex: 1,
  },
  // Appointment Detail Styles
  appointmentDetail: {
    padding: 20,
  },
  detailPatientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  detailAvatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2E86C1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  detailAvatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  detailPatientDetails: {
    flex: 1,
  },
  detailPatientName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E4053',
  },
  detailPatientMeta: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  detailPatientContact: {
    fontSize: 14,
    color: '#2E86C1',
    marginTop: 4,
    fontWeight: '500',
  },
  detailAppointmentInfo: {
    marginBottom: 24,
  },
  detailInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailInfoText: {
    fontSize: 16,
    color: '#2E4053',
    marginLeft: 12,
    flex: 1,
  },
  detailStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  detailStatusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  detailActions: {
    gap: 12,
  },
  detailActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  primaryAction: {
    backgroundColor: '#2E86C1',
  },
  secondaryAction: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#2E86C1',
  },
  outlineAction: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    flex: 1,
  },
  dangerAction: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#F44336',
    flex: 1,
  },
  detailActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  detailActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Form Styles
  appointmentForm: {
    padding: 20,
  },
  formSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E4053',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E4053',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2E4053',
    backgroundColor: '#fff',
  },
  durationSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  durationOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    alignItems: 'center',
  },
  durationOptionActive: {
    backgroundColor: '#2E86C1',
    borderColor: '#2E86C1',
  },
  durationOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
  durationOptionTextActive: {
    color: '#fff',
  },
  typeSelector: {
    gap: 8,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  typeOptionActive: {
    backgroundColor: '#2E86C1',
    borderColor: '#2E86C1',
  },
  typeOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
    marginLeft: 12,
  },
  typeOptionTextActive: {
    color: '#fff',
  },
  patientSelector: {
    flexDirection: 'row',
  },
  patientOption: {
    alignItems: 'center',
    marginRight: 16,
    padding: 8,
  },
  patientOptionActive: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  formCancelBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  formCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
  },
  formSaveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#2E86C1',
  },
  formSaveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  // Doctor Status Styles
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E4053',
    marginBottom: 8,
  },
  statusScrollView: {
    flexDirection: 'row',
  },
  statusScrollContent: {
    paddingHorizontal: 4,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 4,
    minWidth: 100,
    justifyContent: 'center',
  },
  statusOptionActive: {
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  statusOptionText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  // Compact Status Styles (for horizontal layout)
  compactStatusScrollView: {
    flexDirection: 'row',
  },
  compactStatusScrollContent: {
    paddingHorizontal: 4,
  },
  compactStatusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 3,
    minWidth: 70,
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  compactStatusOptionActive: {
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  compactStatusOptionText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  // Enhanced Doctor Status Grid
  statusGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusGridOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
  },
  statusGridOptionActive: {
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  statusGridOptionText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  // Compact Status Styles (for scrollable one-line layout)
  compactStatusScrollView: {
    flexDirection: 'row',
  },
  compactStatusScrollContent: {
    paddingHorizontal: 4,
  },
  compactStatusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  compactStatusOptionActive: {
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  compactStatusOptionText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  // Enhanced New Appointment Button
  enhancedNewAppointmentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E86C1',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    shadowColor: '#2E86C1',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  newAppointmentIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  enhancedNewAppointmentText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  // Unavailable Slot Styles
  unavailableToggle: {
    padding: 4,
    marginTop: 4,
  },
  unavailableSlot: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F44336',
    padding: 12,
  },
  unavailableSlotText: {
    color: '#F44336',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Empty Slot Container and Toggle Styles
  emptySlotContainer: {
    flex: 1,
    gap: 8,
  },
  toggleAvailabilityBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F44336',
    padding: 8,
  },
  toggleAvailabilityText: {
    color: '#F44336',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  // Agenda View Styles
  agendaStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  agendaStatCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  agendaStatNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2E4053',
    marginTop: 8,
  },
  agendaStatLabel: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '600',
    marginTop: 4,
  },
  currentAppointmentSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  currentAppointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentAppointmentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
    marginLeft: 8,
    flex: 1,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginRight: 4,
  },
  liveText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  nextAppointmentSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    shadowColor: '#FF9800',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  nextAppointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  nextAppointmentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF9800',
    marginLeft: 8,
    flex: 1,
  },
  nextAppointmentTime: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
  },
  timelineSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  timelineSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timelineSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E4053',
    marginLeft: 8,
  },
  timelineContainer: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineItemLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineMarkerCurrent: {
    backgroundColor: '#4CAF50',
  },
  timelineMarkerPast: {
    backgroundColor: '#6c757d',
  },
  timelineMarkerFuture: {
    backgroundColor: '#2E86C1',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  timelineLinePast: {
    backgroundColor: '#6c757d',
  },
  timelineLineFuture: {
    backgroundColor: '#E9ECEF',
  },
  timelineItemRight: {
    flex: 1,
  },
  timelineTime: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyTimelineContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTimelineText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6c757d',
    marginTop: 16,
  },
  emptyTimelineSubText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  quickActionsSection: {
    margin: 16,
  },
  quickActionsSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E4053',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E4053',
    marginTop: 8,
  },
  highlightedCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  customTaskAvatar: {
    backgroundColor: '#FF9800',
  },
  // Modal Enhancement Styles
  appointmentTypeToggle: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  appointmentToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  appointmentToggleBtnActive: {
    backgroundColor: '#2E86C1',
  },
  appointmentToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E86C1',
    marginLeft: 8,
  },
  appointmentToggleTextActive: {
    color: '#fff',
  },
  taskInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  patientSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  closeSearchBtn: {
    padding: 4,
  },
  patientSearchContainer: {
    marginBottom: 16,
  },
  patientSearchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  patientSearchResults: {
    maxHeight: 200,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  patientSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  patientSearchItemSelected: {
    backgroundColor: '#E3F2FD',
  },
  patientSearchAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2E86C1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  patientSearchAvatarText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  patientSearchInfo: {
    flex: 1,
  },
  patientSearchName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E4053',
  },
  patientSearchMeta: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  searchMorePatientsBtn: {
    alignItems: 'center',
    padding: 8,
    marginLeft: 8,
  },
  searchMorePatientsText: {
    fontSize: 12,
    color: '#2E86C1',
    fontWeight: '600',
    marginTop: 4,
  },
});



import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

// Mock data
const mockPatients = [
  { id: 'P001', name: 'Rajesh Kumar', age: 45, gender: 'Male' },
  { id: 'P002', name: 'Priya Sharma', age: 32, gender: 'Female' },
  { id: 'P003', name: 'Amit Singh', age: 28, gender: 'Male' },
  { id: 'P004', name: 'Sunita Devi', age: 55, gender: 'Female' },
];

const mockReports = {
  P001: [
    {
      id: 'R001',
      title: 'Blood Test Report',
      date: new Date(2024, 0, 15),
      labName: 'Apollo Diagnostics',
      notes: 'All parameters within normal range. Slight elevation in cholesterol levels.',
      type: 'file',
      fileName: 'blood_test_rajesh.pdf',
    },
  ],
  P002: [
    {
      id: 'R003',
      title: 'Pregnancy Test',
      date: new Date(2024, 0, 20),
      labName: 'Fortis Diagnostics',
      notes: 'Positive result. Patient counseled about prenatal care.',
      type: 'text',
    },
  ],
};

// Main Lab Records Screen
const LabRecordsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return mockPatients;
    const query = searchQuery.toLowerCase();
    return mockPatients.filter(
      patient =>
        patient.name.toLowerCase().includes(query) ||
        patient.id.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const renderPatientCard = ({ item }) => (
    <TouchableOpacity
      style={styles.patientCard}
      onPress={() => navigation.navigate('PatientReports', { patient: item })}
      activeOpacity={0.7}
    >
      <View style={styles.patientCardContent}>
        <View style={styles.patientAvatar}>
          <Text style={styles.avatarText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{item.name}</Text>
          <Text style={styles.patientId}>ID: {item.id}</Text>
          <View style={styles.patientMeta}>
            <Text style={styles.metaText}>{item.age}y • {item.gender}</Text>
          </View>
        </View>
        
        <View style={styles.reportCount}>
          <Text style={styles.reportCountNumber}>
            {mockReports[item.id]?.length || 0}
          </Text>
          <Text style={styles.reportCountLabel}>Reports</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="science" size={28} color="#3B82F6" />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Lab Records</Text>
          <Text style={styles.headerSubtitle}>
            {filteredPatients.length} patients found
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by patient name or ID..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="close" size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Patients List */}
      <FlatList
        data={filteredPatients}
        renderItem={renderPatientCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="person-search" size={64} color="#E5E7EB" />
            <Text style={styles.emptyText}>No patients found</Text>
          </View>
        )}
      />
    </View>
  );
};

// Patient Reports Screen
const PatientReportsScreen = ({ route }) => {
  const { patient } = route.params;
  const [reports, setReports] = useState(mockReports[patient.id] || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [editNotes, setEditNotes] = useState('');

  const handleAddReport = (newReport) => {
    const reportWithId = {
      ...newReport,
      id: `R${Date.now()}`,
      date: new Date(),
    };
    setReports(prev => [reportWithId, ...prev]);
  };

  const handleEditNotes = () => {
    setReports(prev =>
      prev.map(report =>
        report.id === selectedReport.id
          ? { ...report, notes: editNotes }
          : report
      )
    );
    setShowEditModal(false);
    Alert.alert('Success', 'Notes updated successfully');
  };

  const handleViewDownload = (report) => {
    if (report.type === 'file') {
      Alert.alert('File Action', report.fileName, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download', onPress: () => Alert.alert('Download', 'File download initiated') },
        { text: 'Share', onPress: () => Alert.alert('Share', 'File sharing initiated') }
      ]);
    } else {
      Alert.alert('View Report', report.notes);
    }
  };

  const renderReportCard = ({ item }) => (
    <View style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <MaterialIcons 
          name={item.type === 'file' ? 'description' : 'notes'} 
          size={24} 
          color={item.type === 'file' ? '#EF4444' : '#10B981'} 
        />
        <View style={styles.reportInfo}>
          <Text style={styles.reportTitle}>{item.title}</Text>
          <Text style={styles.reportDate}>
            {item.date.toLocaleDateString('en-IN')}
          </Text>
          {item.labName && (
            <Text style={styles.reportLab}>📍 {item.labName}</Text>
          )}
        </View>
        <Text style={[
          styles.typeChip,
          { backgroundColor: item.type === 'file' ? '#FEE2E2' : '#DCFCE7' }
        ]}>
          {item.type === 'file' ? 'FILE' : 'TEXT'}
        </Text>
      </View>
      
      <Text style={styles.reportNotes} numberOfLines={2}>
        {item.notes}
      </Text>
      
      <View style={styles.reportActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => handleViewDownload(item)}
        >
          <MaterialIcons name="visibility" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>
            {item.type === 'file' ? 'Download' : 'View'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => {
            setSelectedReport(item);
            setEditNotes(item.notes);
            setShowEditModal(true);
          }}
        >
          <MaterialIcons name="edit" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Edit Notes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Patient Header */}
      <View style={styles.patientHeader}>
        <View style={styles.patientHeaderAvatar}>
          <Text style={styles.patientHeaderAvatarText}>
            {patient.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.patientHeaderInfo}>
          <Text style={styles.patientHeaderName}>{patient.name}</Text>
          <Text style={styles.patientHeaderDetails}>
            ID: {patient.id} • {patient.age}y • {patient.gender}
          </Text>
        </View>
        
        <View style={styles.reportsCount}>
          <Text style={styles.reportsCountNumber}>{reports.length}</Text>
          <Text style={styles.reportsCountLabel}>Reports</Text>
        </View>
      </View>

      {/* Reports List */}
      <FlatList
        data={reports}
        renderItem={renderReportCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.reportsListContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyReportsContainer}>
            <MaterialIcons name="assignment" size={64} color="#E5E7EB" />
            <Text style={styles.emptyReportsText}>No reports found</Text>
          </View>
        )}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.8}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add Report Modal */}
      <AddReportModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddReport={handleAddReport}
        patientName={patient.name}
      />

      {/* Edit Notes Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.editModalContainer}>
          <View style={styles.editModalHeader}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <MaterialIcons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.editModalTitle}>Edit Notes</Text>
            <TouchableOpacity onPress={handleEditNotes}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.editModalContent}>
            <TextInput
              style={styles.editNotesInput}
              placeholder="Enter notes..."
              value={editNotes}
              onChangeText={setEditNotes}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Add Report Modal Component
const AddReportModal = ({ visible, onClose, onAddReport, patientName }) => {
  const [reportType, setReportType] = useState('text');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [labName, setLabName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const resetForm = () => {
    setReportType('text');
    setTitle('');
    setNotes('');
    setLabName('');
    setSelectedFile(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a report title');
      return;
    }

    const newReport = {
      title: title.trim(),
      notes: notes.trim(),
      labName: labName.trim(),
      type: reportType,
      ...(reportType === 'file' && {
        fileName: selectedFile?.name || 'document.pdf',
      }),
    };

    onAddReport(newReport);
    handleClose();
    Alert.alert('Success', 'Report added successfully!');
  };

  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.addModalContainer}>
        <View style={styles.addModalHeader}>
          <TouchableOpacity onPress={handleClose}>
            <MaterialIcons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.addModalTitle}>Add Report</Text>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.saveButton}>Add</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.addModalContent}>
          <Text style={styles.addModalSubtitle}>Patient: {patientName}</Text>

          {/* Report Type Selector */}
          <View style={styles.typeSelector}>
            <Text style={styles.sectionLabel}>Report Type</Text>
            <View style={styles.typeSelectorButtons}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  reportType === 'text' && styles.typeButtonActive
                ]}
                onPress={() => setReportType('text')}
              >
                <MaterialIcons name="notes" size={20} color={reportType === 'text' ? '#fff' : '#10B981'} />
                <Text style={[
                  styles.typeButtonText,
                  reportType === 'text' && styles.typeButtonTextActive
                ]}>
                  Text Report
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  reportType === 'file' && styles.typeButtonActive
                ]}
                onPress={() => setReportType('file')}
              >
                <MaterialIcons name="description" size={20} color={reportType === 'file' ? '#fff' : '#EF4444'} />
                <Text style={[
                  styles.typeButtonText,
                  reportType === 'file' && styles.typeButtonTextActive
                ]}>
                  File Upload
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Report Title *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Blood Test Report"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Lab Name (Optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Apollo Diagnostics"
              value={labName}
              onChangeText={setLabName}
            />
          </View>

          {reportType === 'text' ? (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Report Notes *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Enter detailed report notes..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          ) : (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>File Attachment *</Text>
              <TouchableOpacity
                style={styles.filePickerButton}
                onPress={handleFilePicker}
              >
                <MaterialIcons name="cloud-upload" size={24} color="#3B82F6" />
                <Text style={styles.filePickerText}>
                  {selectedFile ? selectedFile.name : 'Select PDF or Image'}
                </Text>
              </TouchableOpacity>
              
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Add notes about the file (optional)..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 8,
  },
  listContent: {
    padding: 16,
  },
  patientCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  patientCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  patientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  patientId: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  patientMeta: {
    marginTop: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  reportCount: {
    alignItems: 'center',
  },
  reportCountNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B82F6',
  },
  reportCountLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  // Patient Reports Screen
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  patientHeaderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  patientHeaderAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  patientHeaderInfo: {
    flex: 1,
  },
  patientHeaderName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  patientHeaderDetails: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  reportsCount: {
    alignItems: 'center',
  },
  reportsCountNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
  },
  reportsCountLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  reportsListContent: {
    padding: 16,
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reportInfo: {
    flex: 1,
    marginLeft: 12,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  reportDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  reportLab: {
    fontSize: 10,
    color: '#8B5CF6',
    marginTop: 2,
  },
  typeChip: {
    fontSize: 9,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  reportNotes: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 12,
  },
  reportActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewButton: {
    backgroundColor: '#3B82F6',
  },
  editButton: {
    backgroundColor: '#8B5CF6',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  emptyReportsContainer: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyReportsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  // Modal Styles
  addModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  addModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  addModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  saveButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  addModalContent: {
    flex: 1,
    padding: 16,
  },
  addModalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  typeSelector: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  typeSelectorButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  typeButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 4,
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: '#1F2937',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  filePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    borderRadius: 6,
    padding: 16,
    marginBottom: 10,
  },
  filePickerText: {
    fontSize: 14,
    color: '#3B82F6',
    marginLeft: 6,
    fontWeight: '500',
  },
  editModalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  editModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  editModalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  editModalContent: {
    flex: 1,
    padding: 16,
  },
  editNotesInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: '#1F2937',
    minHeight: 100,
    textAlignVertical: 'top',
  },
});

export { LabRecordsScreen, PatientReportsScreen };
export default LabRecordsScreen;
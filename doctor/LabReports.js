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
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useDoctor } from '../context/DoctorContext';

// Main Lab Records Screen
const LabRecordsScreen = ({ navigation }) => {
  const { patients, reports, loading } = useDoctor();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter patients based on search query
  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return patients || [];
    const query = searchQuery.toLowerCase();
    return (patients || []).filter(
      patient =>
        patient.name.toLowerCase().includes(query) ||
        patient._id.toLowerCase().includes(query)
    );
  }, [patients, searchQuery]);

  // Get report count for each patient (including lab reports)
  const getReportCount = (patientId) => {
    return (reports || []).filter(report => {
      // Check if report.patient is an object or string
      const reportPatientId = typeof report.patient === 'object' ? report.patient._id : report.patient;
      return reportPatientId === patientId;
    }).length;
  };

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
          <Text style={styles.patientId}>ID: {item._id}</Text>
          <View style={styles.patientMeta}>
            <Text style={styles.metaText}>{item.age}y • {item.gender}</Text>
          </View>
        </View>
        
        <View style={styles.reportCount}>
          <Text style={styles.reportCountNumber}>
            {getReportCount(item._id)}
          </Text>
          <Text style={styles.reportCountLabel}>Reports</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading lab records...</Text>
      </View>
    );
  }

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
        keyExtractor={(item) => item._id}
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
  const { reports, loading } = useDoctor();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [editNotes, setEditNotes] = useState('');

  // Filter reports for this patient (including lab reports)
  const patientReports = useMemo(() => {
    return (reports || []).filter(report => {
      // Check if report.patient is an object or string
      const reportPatientId = typeof report.patient === 'object' ? report.patient._id : report.patient;
      return reportPatientId === patient._id;
    });
  }, [reports, patient._id]);

  const handleViewDownload = (report) => {
    if (report.files && report.files.length > 0) {
      Alert.alert('File Available', 'This report has attached files.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Files', onPress: () => Alert.alert('View Files', 'File viewing functionality would be implemented here') }
      ]);
    } else {
      Alert.alert('View Report', report.content || 'No content available');
    }
  };

  const renderReportCard = ({ item }) => (
    <View style={styles.reportCard}>
      <View style={styles.reportHeader}>
        <MaterialIcons 
          name={item.files && item.files.length > 0 ? 'description' : 'notes'} 
          size={24} 
          color={item.uploadedByRole === 'LabDoctor' ? '#EF4444' : '#10B981'} 
        />
        <View style={styles.reportInfo}>
          <Text style={styles.reportTitle}>{item.title}</Text>
          <Text style={styles.reportDate}>
            {new Date(item.createdAt).toLocaleDateString('en-IN')}
          </Text>
          {item.uploadedByRole === 'LabDoctor' && (
            <Text style={styles.reportLab}>🔬 Lab Report</Text>
          )}
        </View>
        <Text style={[
          styles.typeChip,
          { backgroundColor: item.files && item.files.length > 0 ? '#FEE2E2' : '#DCFCE7' }
        ]}>
          {item.files && item.files.length > 0 ? 'FILE' : 'TEXT'}
        </Text>
      </View>
      
      {item.content && (
        <Text style={styles.reportNotes} numberOfLines={2}>
          {item.content}
        </Text>
      )}
      
      {item.files && item.files.length > 0 && (
        <View style={styles.fileList}>
          <MaterialIcons name="attachment" size={16} color="#6B7280" />
          <Text style={styles.fileCount}>{item.files.length} file(s) attached</Text>
        </View>
      )}
      
      <View style={styles.reportActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => handleViewDownload(item)}
        >
          <MaterialIcons name="visibility" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>
            {item.files && item.files.length > 0 ? 'View Files' : 'View'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading reports...</Text>
      </View>
    );
  }

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
            ID: {patient._id} • {patient.age}y • {patient.gender}
          </Text>
        </View>
        
        <View style={styles.reportsCount}>
          <Text style={styles.reportsCountNumber}>{patientReports.length}</Text>
          <Text style={styles.reportsCountLabel}>Reports</Text>
        </View>
      </View>

      {/* Reports List */}
      <FlatList
        data={patientReports}
        renderItem={renderReportCard}
        keyExtractor={(item) => item._id}
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
      {/* <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.8}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
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
  fileList: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  fileCount: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
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
});

export { LabRecordsScreen, PatientReportsScreen };
export default LabRecordsScreen;
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  TextInput,
  Modal,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Mock emergency data
const mockEmergencies = [
  {
    id: 'E001',
    patientName: 'John Smith',
    age: 45,
    gender: 'Male',
    priority: 'High',
    reason: 'Chest Pain',
    details: 'Severe chest pain radiating to left arm, sweating profusely, difficulty breathing. Started 30 minutes ago.',
    timeReported: new Date(Date.now() - 30 * 60000),
    contact: '+91-9876543210',
    acknowledged: false,
    notes: []
  },
  {
    id: 'E002',
    patientName: 'Sarah Johnson',
    age: 28,
    gender: 'Female',
    priority: 'Medium',
    reason: 'Severe Headache',
    details: 'Sudden onset severe headache with nausea and light sensitivity. No history of migraines.',
    timeReported: new Date(Date.now() - 45 * 60000),
    contact: '+91-9876543211',
    acknowledged: true,
    notes: ['Patient contacted, advised to come to hospital']
  },
  {
    id: 'E003',
    patientName: 'Michael Brown',
    age: 35,
    gender: 'Male',
    priority: 'Low',
    reason: 'Minor Cut',
    details: 'Small cut on finger while cooking, bleeding controlled, asking for tetanus shot advice.',
    timeReported: new Date(Date.now() - 60 * 60000),
    contact: '+91-9876543212',
    acknowledged: false,
    notes: []
  },
  {
    id: 'E004',
    patientName: 'Emily Davis',
    age: 67,
    gender: 'Female',
    priority: 'High',
    reason: 'Fall Injury',
    details: 'Elderly patient fell down stairs, complaining of hip pain, unable to move. Possible fracture.',
    timeReported: new Date(Date.now() - 15 * 60000),
    contact: '+91-9876543213',
    acknowledged: false,
    notes: []
  },
  {
    id: 'E005',
    patientName: 'David Wilson',
    age: 52,
    gender: 'Male',
    priority: 'Medium',
    reason: 'Allergic Reaction',
    details: 'Mild allergic reaction after eating seafood, slight facial swelling, no breathing issues.',
    timeReported: new Date(Date.now() - 75 * 60000),
    contact: '+91-9876543214',
    acknowledged: true,
    notes: ['Advised antihistamine', 'Monitoring required']
  }
];

const EmergencyScreen = () => {
  const [emergencies, setEmergencies] = useState(mockEmergencies);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [newNote, setNewNote] = useState('');

  // Priority colors and configurations
  const priorityConfig = {
    High: { color: '#FF4757', bgColor: '#FFE5E7', icon: 'priority-high' },
    Medium: { color: '#FFA726', bgColor: '#FFF3E0', icon: 'warning' },
    Low: { color: '#4CAF50', bgColor: '#E8F5E8', icon: 'info' }
  };

  // Filter and sort emergencies
  const filteredEmergencies = useMemo(() => {
    let filtered = selectedFilter === 'All' 
      ? emergencies 
      : emergencies.filter(e => e.priority === selectedFilter);
    
    // Sort by priority (High -> Medium -> Low) and then by time
    return filtered.sort((a, b) => {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.timeReported) - new Date(a.timeReported);
    });
  }, [emergencies, selectedFilter]);

  // Get time ago string
  const getTimeAgo = (date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // Handle acknowledge emergency
  const handleAcknowledge = (emergencyId) => {
    setEmergencies(prev => 
      prev.map(e => 
        e.id === emergencyId 
          ? { ...e, acknowledged: true }
          : e
      )
    );
    Alert.alert('Acknowledged', 'Emergency has been acknowledged');
  };

  // Handle call patient
  const handleCallPatient = (contact, patientName) => {
    const phoneNumber = contact.replace(/[^0-9+]/g, '');
    Alert.alert(
      'Call Patient',
      `Call ${patientName} at ${contact}?`,
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

  // Handle expand/collapse card
  const toggleExpand = (emergencyId) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(emergencyId)) {
        newSet.delete(emergencyId);
      } else {
        newSet.add(emergencyId);
      }
      return newSet;
    });
  };

  // Handle add note
  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    setEmergencies(prev => 
      prev.map(e => 
        e.id === selectedEmergency.id 
          ? { ...e, notes: [...e.notes, newNote.trim()] }
          : e
      )
    );
    setNewNote('');
    setShowNotesModal(false);
    Alert.alert('Success', 'Note added successfully');
  };

  // Render filter buttons
  const renderFilterButtons = () => {
    const filters = ['All', 'High', 'Medium', 'Low'];
    return (
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Filter by Priority</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
          {filters.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive,
                filter !== 'All' && { borderColor: priorityConfig[filter]?.color }
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              {filter !== 'All' && (
                <MaterialIcons 
                  name={priorityConfig[filter]?.icon} 
                  size={16} 
                  color={selectedFilter === filter ? '#fff' : priorityConfig[filter]?.color} 
                />
              )}
              <Text style={[
                styles.filterButtonText,
                selectedFilter === filter && styles.filterButtonTextActive
              ]}>
                {filter}
              </Text>
              {filter !== 'All' && (
                <View style={[styles.filterBadge, { backgroundColor: priorityConfig[filter]?.color }]}>
                  <Text style={styles.filterBadgeText}>
                    {emergencies.filter(e => e.priority === filter).length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Render emergency card
  const renderEmergencyCard = ({ item }) => {
    const isExpanded = expandedCards.has(item.id);
    const config = priorityConfig[item.priority];
    
    return (
      <View style={[styles.emergencyCard, { borderLeftColor: config.color }]}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.patientInfo}>
            <View style={styles.patientAvatar}>
              <Text style={styles.avatarText}>
                {item.patientName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.patientDetails}>
              <Text style={styles.patientName}>{item.patientName}</Text>
              <Text style={styles.patientMeta}>
                {item.age}y • {item.gender} • {getTimeAgo(item.timeReported)}
              </Text>
            </View>
          </View>
          
          <View style={styles.cardHeaderRight}>
            <View style={[styles.priorityBadge, { backgroundColor: config.bgColor }]}>
              <MaterialIcons name={config.icon} size={14} color={config.color} />
              <Text style={[styles.priorityText, { color: config.color }]}>
                {item.priority}
              </Text>
            </View>
            {item.acknowledged && (
              <View style={styles.acknowledgedBadge}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
              </View>
            )}
          </View>
        </View>

        {/* Reason */}
        <View style={styles.reasonContainer}>
          <MaterialIcons name="medical-services" size={16} color="#FF6B6B" />
          <Text style={styles.reasonText}>{item.reason}</Text>
        </View>

        {/* Details - Expandable */}
        <TouchableOpacity 
          style={styles.detailsContainer}
          onPress={() => toggleExpand(item.id)}
        >
          <Text style={styles.detailsLabel}>Details</Text>
          <MaterialIcons 
            name={isExpanded ? "expand-less" : "expand-more"} 
            size={20} 
            color="#6B7280" 
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.expandedDetails}>
            <Text style={styles.detailsText}>{item.details}</Text>
            {item.notes.length > 0 && (
              <View style={styles.notesSection}>
                <Text style={styles.notesTitle}>Notes:</Text>
                {item.notes.map((note, index) => (
                  <Text key={index} style={styles.noteText}>• {note}</Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {!item.acknowledged && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.acknowledgeButton]}
              onPress={() => handleAcknowledge(item.id)}
            >
              {/* <MaterialIcons name="check" size={16} color="#fff" /> */}
              <Text style={styles.actionButtonText}>Acknowledge</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.callButton]}
            onPress={() => handleCallPatient(item.contact, item.patientName)}
          >
            <MaterialIcons name="phone" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.notesButton]}
            onPress={() => {
              setSelectedEmergency(item);
              setShowNotesModal(true);
            }}
          >
            <MaterialIcons name="note-add" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Notes</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderFilterButtons()}

      {/* Emergency List */}
      <FlatList
        data={filteredEmergencies}
        renderItem={renderEmergencyCard}
        keyExtractor={(item) => item.id}
        style={styles.emergencyList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="assignment-turned-in" size={64} color="#E0E0E0" />
            <Text style={styles.emptyText}>No emergencies found</Text>
            <Text style={styles.emptySubText}>
              {selectedFilter === 'All' ? 'All caught up!' : `No ${selectedFilter.toLowerCase()} priority cases`}
            </Text>
          </View>
        )}
      />

      {/* Add Notes Modal */}
      <Modal
        visible={showNotesModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNotesModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowNotesModal(false)}>
              <MaterialIcons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Note</Text>
            <TouchableOpacity onPress={handleAddNote} disabled={!newNote.trim()}>
              <Text style={[styles.saveButton, !newNote.trim() && styles.saveButtonDisabled]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <Text style={styles.modalSubtitle}>
              Patient: {selectedEmergency?.patientName}
            </Text>
            <TextInput
              style={styles.noteInput}
              placeholder="Enter your note here..."
              value={newNote}
              onChangeText={setNewNote}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  filterContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  filterScrollView: {
    flexDirection: 'row',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    marginRight: 12,
  },
  filterButtonActive: {
    backgroundColor: '#1F2937',
    borderColor: '#1F2937',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 6,
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  filterBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  emergencyList: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  emergencyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  patientMeta: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  cardHeaderRight: {
    alignItems: 'flex-end',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  acknowledgedBadge: {
    marginTop: 8,
  },
  reasonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reasonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginBottom: 12,
  },
  detailsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  expandedDetails: {
    marginBottom: 12,
  },
  detailsText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 8,
  },
  notesSection: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  noteText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  acknowledgeButton: {
    backgroundColor: '#10B981',
  },
  callButton: {
    backgroundColor: '#3B82F6',
  },
  notesButton: {
    backgroundColor: '#8B5CF6',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  saveButtonDisabled: {
    color: '#9CA3AF',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 120,
  },
});

export default EmergencyScreen;
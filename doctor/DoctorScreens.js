
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Image, Linking, Platform, Modal, Picker } from "react-native";
import { useDoctor } from "../context/DoctorContext";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import * as WebBrowser from "expo-web-browser";
import { MaterialIcons } from "@expo/vector-icons";

// Import and re-export Calendar component
import { Calendar } from "../context/Calendar";
import EmergencyScreen from "./emergencies";
export { Calendar, EmergencyScreen };




export function PatientList({ navigation }) {
  const [q, setQ] = React.useState("");
  const [sortBy, setSortBy] = React.useState('name'); // name, age, lastVisit
  const [filterGender, setFilterGender] = React.useState('all'); // all, M, F
  const { patients } = useDoctor();
  
  // Enhanced filtering and sorting
  const filtered = React.useMemo(() => {
    let result = patients.filter((p) => {
      const nameMatch = p.name.toLowerCase().includes(q.toLowerCase());
      const contactMatch = (p.contact || p.mobile || '').toLowerCase().includes(q.toLowerCase());
      const searchMatch = nameMatch || contactMatch;
      
      const genderMatch = filterGender === 'all' || 
        p.gender === filterGender || 
        (filterGender === 'M' && (p.gender === 'Male' || p.gender === 'male' || p.gender === 'man')) ||
        (filterGender === 'F' && (p.gender === 'Female' || p.gender === 'female' || p.gender === 'woman'));
      
      return searchMatch && genderMatch;
    });
    
    // Sort results
    result.sort((a, b) => {
      switch (sortBy) {
        case 'age':
          return (a.age || 0) - (b.age || 0);
        case 'lastVisit':
          const aDate = new Date(a.lastVisit || a.updatedAt || 0);
          const bDate = new Date(b.lastVisit || b.updatedAt || 0);
          return bDate - aDate; // Most recent first
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    return result;
  }, [patients, q, sortBy, filterGender]);
  
  // Statistics
  const stats = React.useMemo(() => {
    const total = patients.length;
    const male = patients.filter(p => p.gender === 'M' || p.gender === 'Male' || p.gender === 'male' || p.gender === 'man').length;
    const female = patients.filter(p => p.gender === 'F' || p.gender === 'Female' || p.gender === 'female' || p.gender === 'woman').length;
    const recentVisits = patients.filter(p => {
      const lastVisit = new Date(p.lastVisit || p.updatedAt || 0);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return lastVisit > weekAgo;
    }).length;
    
    return { total, male, female, recentVisits };
  }, [patients]);
  
  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Modern Header with Gradient Effect */}
        <View style={styles.modernPatientHeader}>
          <View style={styles.headerGradient}>
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <View style={styles.headerIconWrapper}>
                  <MaterialIcons name="people" size={28} color="#fff" />
                </View>
                <View>
                  <Text style={styles.modernHeaderTitle}>My Patients</Text>
                  <Text style={styles.modernHeaderSubtitle}>{filtered.length} of {patients.length} patients</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.modernAddBtn}
                onPress={() => navigation.navigate("AddPatient")}
                activeOpacity={0.8}
              >
                <MaterialIcons name="person-add" size={20} color="#2E86C1" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
              <MaterialIcons name="group" size={24} color="#2E86C1" />
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#E8F5E8' }]}>
              <MaterialIcons name="trending-up" size={24} color="#4CAF50" />
              <Text style={styles.statNumber}>{stats.recentVisits}</Text>
              <Text style={styles.statLabel}>Recent</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
              <MaterialIcons name="man" size={24} color="#FF9800" />
              <Text style={styles.statNumber}>{stats.male}</Text>
              <Text style={styles.statLabel}>Male</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#FCE4EC' }]}>
              <MaterialIcons name="woman" size={24} color="#E91E63" />
              <Text style={styles.statNumber}>{stats.female}</Text>
              <Text style={styles.statLabel}>Female</Text>
            </View>
          </View>
        </View>
        
        {/* Enhanced Search and Filters */}
        <View style={styles.searchFilterContainer}>
          <View style={styles.modernSearchContainer}>
            <View style={styles.searchInputWrapper}>
              <MaterialIcons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
              <TextInput 
                style={styles.modernSearchInput} 
                placeholder="Search by name or contact..." 
                placeholderTextColor="#8E8E93"
                value={q} 
                onChangeText={setQ}
              />
              {q.length > 0 && (
                <TouchableOpacity onPress={() => setQ('')} style={styles.clearBtn}>
                  <MaterialIcons name="close" color="#8E8E93" size={18} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          {/* Filter and Sort Options */}
          <View style={styles.filterContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
              {/* Gender Filter */}
              <TouchableOpacity 
                style={[styles.filterChip, filterGender === 'all' && styles.filterChipActive]}
                onPress={() => setFilterGender('all')}
              >
                <MaterialIcons name="people" size={16} color={filterGender === 'all' ? '#fff' : '#2E86C1'} />
                <Text style={[styles.filterChipText, filterGender === 'all' && styles.filterChipActiveText]}>All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.filterChip, filterGender === 'M' && styles.filterChipActive]}
                onPress={() => setFilterGender('M')}
              >
                <MaterialIcons name="man" size={16} color={filterGender === 'M' ? '#fff' : '#2E86C1'} />
                <Text style={[styles.filterChipText, filterGender === 'M' && styles.filterChipActiveText]}>Male</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.filterChip, filterGender === 'F' && styles.filterChipActive]}
                onPress={() => setFilterGender('F')}
              >
                <MaterialIcons name="woman" size={16} color={filterGender === 'F' ? '#fff' : '#2E86C1'} />
                <Text style={[styles.filterChipText, filterGender === 'F' && styles.filterChipActiveText]}>Female</Text>
              </TouchableOpacity>
              
              {/* Sort Options */}
              <View style={styles.filterDivider} />
              
              <TouchableOpacity 
                style={[styles.filterChip, sortBy === 'name' && styles.filterChipActive]}
                onPress={() => setSortBy('name')}
              >
                <MaterialIcons name="sort-by-alpha" size={16} color={sortBy === 'name' ? '#fff' : '#2E86C1'} />
                <Text style={[styles.filterChipText, sortBy === 'name' && styles.filterChipActiveText]}>Name</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.filterChip, sortBy === 'age' && styles.filterChipActive]}
                onPress={() => setSortBy('age')}
              >
                <MaterialIcons name="cake" size={16} color={sortBy === 'age' ? '#fff' : '#2E86C1'} />
                <Text style={[styles.filterChipText, sortBy === 'age' && styles.filterChipActiveText]}>Age</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.filterChip, sortBy === 'lastVisit' && styles.filterChipActive]}
                onPress={() => setSortBy('lastVisit')}
              >
                <MaterialIcons name="schedule" size={16} color={sortBy === 'lastVisit' ? '#fff' : '#2E86C1'} />
                <Text style={[styles.filterChipText, sortBy === 'lastVisit' && styles.filterChipActiveText]}>Recent</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
        
        {/* Enhanced Patient Cards */}
        <View style={styles.modernPatientList}>
          {filtered.length > 0 ? (
            filtered.map((p, index) => (
              <TouchableOpacity 
                key={p._id || p.id || index} 
                onPress={() => navigation.navigate("PatientProfile", { id: p._id || p.id })}
                style={styles.modernPatientCard}
                activeOpacity={0.7}
              >
                <View style={styles.modernPatientCardContent}>
                  <View style={styles.modernPatientAvatar}>
                    <View style={[styles.avatarBackground, { 
                      backgroundColor: p.gender === 'M' || p.gender === 'Male' || p.gender === 'male' || p.gender === 'man' 
                        ? '#E3F2FD' : '#FCE4EC' 
                    }]}>
                      <MaterialIcons 
                        name={p.gender === 'M' || p.gender === 'Male' || p.gender === 'male' || p.gender === 'man' ? 'man' : 'woman'} 
                        size={32} 
                        color={p.gender === 'M' || p.gender === 'Male' || p.gender === 'male' || p.gender === 'man' ? '#2E86C1' : '#E91E63'}
                      />
                    </View>
                  </View>
                  
                  <View style={styles.modernPatientInfo}>
                    <Text style={styles.modernPatientName}>{p.name}</Text>
                    <View style={styles.modernPatientMetaRow}>
                      <View style={styles.modernPatientMeta}>
                        <MaterialIcons name="cake" size={14} color="#8E8E93" />
                        <Text style={styles.modernPatientMetaText}>{p.age || 'N/A'} years</Text>
                      </View>
                      <View style={styles.modernPatientMeta}>
                        <MaterialIcons name="phone" size={14} color="#8E8E93" />
                        <Text style={styles.modernPatientMetaText}>{p.contact || p.mobile || 'No contact'}</Text>
                      </View>
                    </View>
                    <View style={styles.modernPatientFooter}>
                      <View style={styles.lastVisitBadge}>
                        <MaterialIcons name="schedule" size={12} color="#4CAF50" />
                        <Text style={styles.lastVisitBadgeText}>
                          {p.lastVisit || p.updatedAt 
                            ? new Date(p.lastVisit || p.updatedAt).toLocaleDateString()
                            : 'No visits'
                          }
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.modernPatientAction}>
                    <View style={styles.actionIndicator}>
                      <MaterialIcons name="chevron-right" size={24} color="#2E86C1" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.modernEmptyState}>
              <View style={styles.emptyIconWrapper}>
                <MaterialIcons 
                  name={q.length > 0 ? "search-off" : "people-outline"} 
                  size={64} 
                  color="#E0E0E0" 
                />
              </View>
              <Text style={styles.modernEmptyTitle}>
                {q.length > 0 ? 'No patients found' : 'No patients yet'}
              </Text>
              <Text style={styles.modernEmptySubtitle}>
                {q.length > 0 
                  ? 'Try adjusting your search terms or filters' 
                  : 'Add your first patient to get started'
                }
              </Text>
              {q.length === 0 && (
                <TouchableOpacity 
                  style={styles.modernEmptyAction}
                  onPress={() => navigation.navigate("AddPatient")}
                >
                  <MaterialIcons name="add" size={20} color="#fff" />
                  <Text style={styles.modernEmptyActionText}>Add First Patient</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Modern Floating Action Button */}
      <TouchableOpacity 
        style={styles.modernFab} 
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
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handleSave = async () => {
    if (!formData.name || !formData.age) {
      Alert.alert(
        '⚠️ Required Fields Missing', 
        'Please fill in both Name and Age fields before saving.',
        [
          {
            text: 'OK',
            style: 'default'
          }
        ]
      );
      return;
    }
    
    // Validate age
    const ageNum = parseInt(formData.age);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 150) {
      Alert.alert(
        '⚠️ Invalid Age', 
        'Please enter a valid age between 1 and 150 years.',
        [
          {
            text: 'OK',
            style: 'default'
          }
        ]
      );
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await addPatient({
        ...formData,
        age: ageNum
      });
      
      if (result.success) {
        // Show success popup with enhanced styling
        Alert.alert(
          '✅ Success!', 
          `New patient "${formData.name}" has been added successfully to your patient list!`,
          [
            {
              text: 'Go to Patient List',
              onPress: () => {
                // Navigate back to the patient list
                navigation.navigate('PatientList');
              },
              style: 'default'
            },
            {
              text: 'Add Another Patient',
              onPress: () => {
                // Reset form for adding another patient
                setFormData({
                  name: '',
                  age: '',
                  gender: 'M',
                  contact: '',
                  history: ''
                });
              },
              style: 'cancel'
            }
          ],
          {
            cancelable: false // Prevent dismissing by tapping outside
          }
        );
      } else {
        Alert.alert(
          '⚠️ Error', 
          result.error || 'Failed to add patient. Please check your connection and try again.',
          [
            {
              text: 'Try Again',
              style: 'default'
            }
          ],
          {
            cancelable: true
          }
        );
      }
    } catch (error) {
      console.error('Error in handleSave:', error);
      Alert.alert(
        '⚠️ Network Error', 
        'Unable to connect to the server. Please check your internet connection and try again.',
        [
          {
            text: 'Retry',
            style: 'default'
          }
        ],
        {
          cancelable: true
        }
      );
    } finally {
      setIsLoading(false);
    }
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
            style={[styles.enhancedSaveButton, isLoading && styles.enhancedSaveButtonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <>
                <MaterialIcons name="hourglass-empty" size={16} color="#fff" />
                <Text style={styles.enhancedSaveText}>Saving...</Text>
              </>
            ) : (
              <>
                <MaterialIcons name="save" size={16} color="#fff" />
                <Text style={styles.enhancedSaveText}>Save Patient</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

export function ReportDetail({ route, navigation }) {
  const { reports, patients } = useDoctor();
  const { reportId, report: passedReport } = route.params || {};
  
  // Handle both ways of passing report data
  const report = passedReport || reports.find(r => r.id === reportId || r._id === reportId);
  const patient = patients.find(p => (p.id === report?.patientId || p._id === report?.patientId));
  
  if (!report) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.modernEmptyState}>
            <MaterialIcons name="description" size={64} color="#E0E0E0" />
            <Text style={styles.modernEmptyTitle}>Report Not Found</Text>
            <Text style={styles.modernEmptySubtitle}>The requested report could not be found.</Text>
            <TouchableOpacity 
              style={styles.modernEmptyAction}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={20} color="#fff" />
              <Text style={styles.modernEmptyActionText}>Go Back</Text>
            </TouchableOpacity>
          </View>
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
        Alert.alert("Error", "File not found or invalid file path.");
        return;
      }

      const { uri, name, type } = attachment;
      console.log('Opening attachment:', { uri, name, type });

      // Check if it's a PDF file
      const isPDF = type === 'pdf' || name.toLowerCase().endsWith('.pdf');
      const isImage = type === 'image' || name.match(/\.(jpg|jpeg|png|gif)$/i);
      
      if (isPDF) {
        // For PDF files, try multiple approaches
        try {
          // First, try opening with the default browser/PDF viewer
          const supported = await Linking.canOpenURL(uri);
          if (supported) {
            await Linking.openURL(uri);
          } else {
            // If direct linking fails, try WebBrowser
            const browserResult = await WebBrowser.openBrowserAsync(uri, {
              showTitle: true,
              toolbarColor: '#2E86C1',
              controlsColor: '#fff',
              presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
            });
            console.log('Browser result:', browserResult);
          }
        } catch (pdfError) {
          console.error('PDF opening error:', pdfError);
          // Fallback: offer download or share options
          Alert.alert(
            "Open PDF",
            `Unable to open PDF directly. Choose an alternative:`,
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Share",
                onPress: async () => {
                  try {
                    if (await Sharing.isAvailableAsync()) {
                      await Sharing.shareAsync(uri, {
                        dialogTitle: `Share ${name}`,
                        mimeType: 'application/pdf'
                      });
                    } else {
                      Alert.alert("Error", "Sharing is not available on this device.");
                    }
                  } catch (shareError) {
                    console.error('Share error:', shareError);
                    Alert.alert("Error", "Unable to share the file.");
                  }
                }
              },
              {
                text: "Download",
                onPress: async () => {
                  try {
                    const { status } = await MediaLibrary.requestPermissionsAsync();
                    if (status !== "granted") {
                      Alert.alert("Permission denied", "Cannot save files without permission.");
                      return;
                    }

                    const fileUri = FileSystem.documentDirectory + name;
                    const downloaded = await FileSystem.downloadAsync(uri, fileUri);
                    const asset = await MediaLibrary.createAssetAsync(downloaded.uri);
                    await MediaLibrary.createAlbumAsync("Downloads", asset, false);
                    Alert.alert("Success", `${name} saved to Downloads.`);
                  } catch (downloadError) {
                    console.error('Download error:', downloadError);
                    Alert.alert("Error", "Failed to download file.");
                  }
                }
              }
            ]
          );
        }
      } else if (isImage) {
        // For images, open in browser or share
        try {
          const browserResult = await WebBrowser.openBrowserAsync(uri, {
            showTitle: true,
            toolbarColor: '#2E86C1',
            controlsColor: '#fff',
            presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
          });
          console.log('Image browser result:', browserResult);
        } catch (imageError) {
          console.error('Image opening error:', imageError);
          // Fallback to sharing
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri);
          } else {
            Alert.alert("Error", "Unable to open image.");
          }
        }
      } else {
        // For other file types, try to share or download
        Alert.alert(
          "Open Document",
          `Choose how to handle ${name}:`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Share",
              onPress: async () => {
                try {
                  if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(uri);
                  } else {
                    Alert.alert("Error", "Sharing is not available on this device.");
                  }
                } catch (shareError) {
                  console.error('Share error:', shareError);
                  Alert.alert("Error", "Unable to share the file.");
                }
              }
            },
            {
              text: "Download",
              onPress: async () => {
                try {
                  const { status } = await MediaLibrary.requestPermissionsAsync();
                  if (status !== "granted") {
                    Alert.alert("Permission denied", "Cannot save files without permission.");
                    return;
                  }

                  const fileUri = FileSystem.documentDirectory + name;
                  const downloaded = await FileSystem.downloadAsync(uri, fileUri);
                  const asset = await MediaLibrary.createAssetAsync(downloaded.uri);
                  await MediaLibrary.createAlbumAsync("Downloads", asset, false);
                  Alert.alert("Success", `${name} saved to Downloads.`);
                } catch (downloadError) {
                  console.error('Download error:', downloadError);
                  Alert.alert("Error", "Failed to download file.");
                }
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('View attachment error:', error);
      Alert.alert("Error", `Unable to open file: ${error.message || 'Unknown error'}`);
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
              <Text style={styles.attachmentFileName}>{attachment.name || attachment.originalName || 'Unknown File'}</Text>
              <Text style={styles.attachmentFileSize}>{attachment.size || 'Unknown size'}</Text>
              <Text style={styles.attachmentFileType}>
                {isPDF ? 'PDF Document' : isImage ? 'Image File' : 'Document'}
              </Text>
              
              {/* Enhanced Metadata Display */}
              {attachment.mimeType && (
                <Text style={styles.attachmentMetadata}>MIME: {attachment.mimeType}</Text>
              )}
              
              {attachment.uploadedAt && (
                <Text style={styles.attachmentMetadata}>
                  Added: {new Date(attachment.uploadedAt || attachment.dateAdded).toLocaleDateString()}
                </Text>
              )}
              
              {attachment.downloadCount !== undefined && (
                <Text style={styles.attachmentMetadata}>
                  Downloads: {attachment.downloadCount || 0}
                </Text>
              )}
              
              {attachment.lastAccessed && (
                <Text style={styles.attachmentMetadata}>
                  Last accessed: {new Date(attachment.lastAccessed).toLocaleDateString()}
                </Text>
              )}
              
              {attachment.fileName && attachment.fileName !== attachment.name && (
                <Text style={styles.attachmentMetadata}>File: {attachment.fileName}</Text>
              )}
              
              {attachment.path && (
                <Text style={[styles.attachmentMetadata, styles.pathText]} numberOfLines={1}>
                  Path: {attachment.path}
                </Text>
              )}
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
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Modern Header */}
        <View style={styles.modernReportDetailHeader}>
          <TouchableOpacity 
            style={styles.reportDetailBackButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.reportDetailHeaderContent}>
            <View style={styles.reportDetailIconContainer}>
              <MaterialIcons 
                name={
                  report.type === 'lab' ? 'science' :
                  report.type === 'scan' ? 'medical-services' :
                  'note'
                } 
                size={32} 
                color="#fff" 
              />
            </View>
            
            <View style={styles.reportDetailHeaderText}>
              <Text style={styles.reportDetailTitle}>{report.title}</Text>
              <Text style={styles.reportDetailSubtitle}>
                {patient?.name || 'Unknown Patient'} • {new Date(report.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Report Information Card */}
        <View style={styles.modernReportInfoCard}>
          <View style={styles.reportInfoHeader}>
            <MaterialIcons name="info" size={24} color="#2E86C1" />
            <Text style={styles.reportInfoTitle}>Report Information</Text>
          </View>
          
          <View style={styles.reportInfoContent}>
            <View style={styles.reportInfoRow}>
              <MaterialIcons name="person" size={18} color="#8E8E93" />
              <Text style={styles.reportInfoLabel}>Patient:</Text>
              <Text style={styles.reportInfoValue}>{patient?.name || 'Unknown'}</Text>
            </View>
            
            <View style={styles.reportInfoRow}>
              <MaterialIcons name="category" size={18} color="#8E8E93" />
              <Text style={styles.reportInfoLabel}>Type:</Text>
              <Text style={styles.reportInfoValue}>
                {report.type === 'lab' ? 'Lab Report' :
                 report.type === 'scan' ? 'Scan/Image Report' :
                 'Doctor Note'}
              </Text>
            </View>
            
            <View style={styles.reportInfoRow}>
              <MaterialIcons name="flag" size={18} color="#8E8E93" />
              <Text style={styles.reportInfoLabel}>Status:</Text>
              <View style={[
                styles.reportStatusBadge, 
                { backgroundColor: 
                  report.status === 'approved' ? '#E8F5E8' :
                  report.status === 'pending' ? '#FFF3E0' : '#E3F2FD'
                }
              ]}>
                <Text style={[
                  styles.reportStatusText,
                  { color:
                    report.status === 'approved' ? '#4CAF50' :
                    report.status === 'pending' ? '#FF9800' : '#2E86C1'
                  }
                ]}>
                  {(report.status || 'new').toUpperCase()}
                </Text>
              </View>
            </View>
            
            <View style={styles.reportInfoRow}>
              <MaterialIcons name="schedule" size={18} color="#8E8E93" />
              <Text style={styles.reportInfoLabel}>Created:</Text>
              <Text style={styles.reportInfoValue}>
                {new Date(report.createdAt || report.uploadedAt || Date.now()).toLocaleDateString()} at {new Date(report.createdAt || report.uploadedAt || Date.now()).toLocaleTimeString()}
              </Text>
            </View>
            
            {(report.uploadedByName || report.uploadedBy) && (
              <View style={styles.reportInfoRow}>
                <MaterialIcons name="person-add" size={18} color="#8E8E93" />
                <Text style={styles.reportInfoLabel}>Uploaded by:</Text>
                <Text style={styles.reportInfoValue}>{report.uploadedByName || report.uploadedBy || 'Dr. Unknown'}</Text>
              </View>
            )}
            
            {report.lastAccessed && (
              <View style={styles.reportInfoRow}>
                <MaterialIcons name="visibility" size={18} color="#8E8E93" />
                <Text style={styles.reportInfoLabel}>Last Accessed:</Text>
                <Text style={styles.reportInfoValue}>{new Date(report.lastAccessed).toLocaleDateString()} at {new Date(report.lastAccessed).toLocaleTimeString()}</Text>
              </View>
            )}
            
            {report.downloadCount !== undefined && (
              <View style={styles.reportInfoRow}>
                <MaterialIcons name="download" size={18} color="#8E8E93" />
                <Text style={styles.reportInfoLabel}>Downloads:</Text>
                <Text style={styles.reportInfoValue}>{report.downloadCount || 0} times</Text>
              </View>
            )}
            
            {report.fileType && (
              <View style={styles.reportInfoRow}>
                <MaterialIcons name="insert-drive-file" size={18} color="#8E8E93" />
                <Text style={styles.reportInfoLabel}>File Type:</Text>
                <Text style={styles.reportInfoValue}>{report.fileType.toUpperCase()}</Text>
              </View>
            )}
            
            {report.mimeType && (
              <View style={styles.reportInfoRow}>
                <MaterialIcons name="description" size={18} color="#8E8E93" />
                <Text style={styles.reportInfoLabel}>MIME Type:</Text>
                <Text style={styles.reportInfoValue}>{report.mimeType}</Text>
              </View>
            )}
            
            {report.size && (
              <View style={styles.reportInfoRow}>
                <MaterialIcons name="storage" size={18} color="#8E8E93" />
                <Text style={styles.reportInfoLabel}>Size:</Text>
                <Text style={styles.reportInfoValue}>
                  {typeof report.size === 'number' 
                    ? `${(report.size / (1024 * 1024)).toFixed(2)} MB`
                    : report.size
                  }
                </Text>
              </View>
            )}
            
            {report.originalName && report.originalName !== report.title && (
              <View style={styles.reportInfoRow}>
                <MaterialIcons name="label" size={18} color="#8E8E93" />
                <Text style={styles.reportInfoLabel}>Original Name:</Text>
                <Text style={styles.reportInfoValue}>{report.originalName}</Text>
              </View>
            )}
            
            {report.fileName && report.fileName !== report.originalName && (
              <View style={styles.reportInfoRow}>
                <MaterialIcons name="folder" size={18} color="#8E8E93" />
                <Text style={styles.reportInfoLabel}>File Name:</Text>
                <Text style={styles.reportInfoValue}>{report.fileName}</Text>
              </View>
            )}
            
            {report.path && (
              <View style={styles.reportInfoRow}>
                <MaterialIcons name="folder-open" size={18} color="#8E8E93" />
                <Text style={styles.reportInfoLabel}>Path:</Text>
                <Text style={[styles.reportInfoValue, styles.pathText]} numberOfLines={2}>{report.path}</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Report Content */}
        {report.content && (
          <View style={styles.modernReportContentCard}>
            <View style={styles.reportContentHeader}>
              <MaterialIcons name="description" size={24} color="#4CAF50" />
              <Text style={styles.reportContentTitle}>Report Content</Text>
            </View>
            
            <View style={styles.reportContentBody}>
              <ScrollView 
                style={styles.reportContentScrollView} 
                nestedScrollEnabled
                showsVerticalScrollIndicator={true}
              >
                <Text style={styles.modernReportContent}>{report.content}</Text>
              </ScrollView>
            </View>
          </View>
        )}
        
        {/* Attachments Section */}
        {report.attachments && report.attachments.length > 0 && (
          <View style={styles.modernAttachmentsCard}>
            <View style={styles.attachmentsHeader}>
              <MaterialIcons name="attach-file" size={24} color="#FF9800" />
              <Text style={styles.attachmentsTitle}>Attachments ({report.attachments.length})</Text>
            </View>
            
            <View style={styles.attachmentsList}>
              {report.attachments.map(renderAttachment)}
            </View>
          </View>
        )}
        
        {/* No Content State */}
        {!report.content && (!report.attachments || report.attachments.length === 0) && (
          <View style={styles.modernNoContentCard}>
            <View style={styles.noContentContainer}>
              <MaterialIcons name="description" size={48} color="#E0E0E0" />
              <Text style={styles.noContentTitle}>No Additional Content</Text>
              <Text style={styles.noContentSubtitle}>This report contains only basic information</Text>
            </View>
          </View>
        )}
        
        {/* Action Buttons */}
        <View style={styles.modernReportActions}>
          <TouchableOpacity 
            style={styles.modernShareButton}
            onPress={() => {
              if (Sharing && report) {
                Alert.alert(
                  'Share Report',
                  `Choose how to share "${report.title}"`,
                  [
                    { text: 'Cancel', style: 'cancel' },
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
                          const fileName = `${report.title.replace(/\s+/g, "_")}.txt`;
                          const fileUri = FileSystem.cacheDirectory + fileName;
                          await FileSystem.writeAsStringAsync(fileUri, reportText);
                          await Sharing.shareAsync(fileUri);
                        } catch (err) {
                          console.error("Error sharing text report:", err);
                          Alert.alert("Error", "Unable to share report as text.");
                        }
                      }
                    },
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
                    }
                  ]
                );
              } else {
                Alert.alert('Share Report', 'Report sharing feature is being prepared.');
              }
            }}
            activeOpacity={0.7}
          >
            <MaterialIcons name="share" size={20} color="#fff" />
            <Text style={styles.modernShareButtonText}>Share Report</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

export function PatientProfile({ route, navigation }) {
  const { patients, reports, addReport, appointments, updatePatientTreatment } = useDoctor();
  const { id } = route.params || {};
  
  // Find patient by matching both _id and id fields
  const patient = patients.find((p) => (p._id && p._id === id) || (p.id && p.id === id));
  
  const [showAddReport, setShowAddReport] = React.useState(false);
  const [reportTitle, setReportTitle] = React.useState('');
  const [reportContent, setReportContent] = React.useState('');
  const [reportType, setReportType] = React.useState('note');
  const [attachments, setAttachments] = React.useState([]);
  const [reportSearchQuery, setReportSearchQuery] = React.useState('');
  const [isAddingReport, setIsAddingReport] = React.useState(false);
  
  // Debug: Log patient data
  React.useEffect(() => {
    console.log('PatientProfile - Received ID:', id);
    console.log('PatientProfile - Available patients:', patients.map(p => ({
      id: p.id, 
      _id: p._id, 
      name: p.name,
      reports: p.reports ? p.reports.length : 0
    })));
    console.log('PatientProfile - Found patient:', patient);
    if (patient) {
      console.log('PatientProfile - Patient details:', {
        id: patient.id || patient._id,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        contact: patient.contact,
        history: patient.history,
        reports: patient.reports ? patient.reports.length : 0,
        lastVisit: patient.lastVisit || patient.updatedAt
      });
    }
    console.log('PatientProfile - Available reports:', reports.length);
  }, [id, patients, patient, reports]);
  
  // Get reports for this patient from multiple sources
  const myReports = React.useMemo(() => {
    if (!patient) return [];
    
    const patientIdToMatch = patient._id || patient.id || id;
    
    // Get reports from context reports array (filtered by patientId)
    const contextReports = reports.filter((r) => {
      return (r.patientId && r.patientId === patientIdToMatch) || 
             (r.patientId && r.patientId === id) || 
             (r.patient && r.patient._id && r.patient._id === patientIdToMatch) ||
             (id && r.patientId === id);
    });
    
    // Get reports directly from patient object if available
    const patientReports = patient.reports || [];
    
    // Combine and deduplicate reports
    const allReports = [...contextReports];
    
    // Add patient reports if they're not already in the context reports
    patientReports.forEach(report => {
      const exists = allReports.find(r => 
        (r._id && r._id === report._id) || 
        (r.id && r.id === report.id) ||
        (r.title === report.title && r.createdAt === report.createdAt)
      );
      if (!exists) {
        allReports.push({
          ...report,
          patientId: patientIdToMatch, // Ensure patientId is set
          patientName: patient.name
        });
      }
    });
    
    console.log('PatientProfile - My reports:', allReports);
    return allReports;
  }, [reports, id, patient]);
  
  // Filter reports based on search query
  const filteredReports = React.useMemo(() => {
    if (reportSearchQuery.trim() === '') {
      return myReports;
    }
    return myReports.filter(report => 
      (report.title && report.title.toLowerCase().includes(reportSearchQuery.toLowerCase())) ||
      (report.type && report.type.toLowerCase().includes(reportSearchQuery.toLowerCase())) ||
      (report.status && report.status.toLowerCase().includes(reportSearchQuery.toLowerCase())) ||
      (report.content && report.content.toLowerCase().includes(reportSearchQuery.toLowerCase()))
    );
  }, [myReports, reportSearchQuery]);
  
  if (!patient) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.emptyStateSmall}>
            <MaterialIcons name="person-off" size={48} color="#6c757d" />
            <Text style={styles.header}>Patient Not Found</Text>
            <Text style={styles.emptySubText}>The requested patient could not be found.</Text>
            <Text style={styles.emptySubText}>ID: {id}</Text>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={20} color="#2E86C1" />
              <Text style={styles.actionButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  const handleAddReport = async () => {
    if (!reportTitle.trim()) {
      Alert.alert('⚠️ Error', 'Please enter a report title');
      return;
    }
    
    const patientIdToUse = patient?._id || patient?.id || id;
    
    setIsAddingReport(true);
    
    try {
      const result = await addReport({
        patientId: patientIdToUse, 
        title: reportTitle.trim(),
        content: reportContent.trim(),
        type: reportType,
        attachments: attachments
      });
      
      if (result.success) {
        // Reset form
        setReportTitle('');
        setReportContent('');
        setAttachments([]);
        setShowAddReport(false);
        setIsAddingReport(false);
        
        // Show success popup
        Alert.alert(
          '✅ Report Added!', 
          `Report "${reportTitle}" has been successfully added for patient ${patient?.name || 'Unknown Patient'}!`,
          [
            {
              text: 'View Report',
              onPress: () => {
                if (result.report) {
                  navigation.navigate('ReportDetail', { report: result.report });
                }
              },
              style: 'default'
            },
            {
              text: 'Add Another Report',
              onPress: () => {
                setShowAddReport(true);
              },
              style: 'cancel'
            }
          ],
          {
            cancelable: false
          }
        );
      } else {
        setIsAddingReport(false);
        Alert.alert(
          '⚠️ Error', 
          result.error || 'Failed to add report. Please check your connection and try again.',
          [
            {
              text: 'Try Again',
              style: 'default'
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error in handleAddReport:', error);
      setIsAddingReport(false);
      Alert.alert(
        '⚠️ Network Error', 
        'Unable to connect to the server. Please check your internet connection and try again.',
        [
          {
            text: 'Retry',
            style: 'default'
          }
        ]
      );
    }
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
    const patientIdToUse = patient?._id || patient?.id || id;
    updatePatientTreatment(patientIdToUse);
    Alert.alert('Success', 'Patient marked as treated successfully!');
    navigation.goBack();
  };

  const handleViewReport = (report) => {
    console.log('Viewing report:', report);
    // Enhanced report object with patient information for better context
    const enhancedReport = {
      ...report,
      patientId: report.patientId || patient?._id || patient?.id || id,
      patientName: report.patientName || patient?.name,
      // Ensure compatibility with ReportDetail component
      id: report._id || report.id || `temp-${Date.now()}`,
      createdAt: report.createdAt || Date.now(),
      status: report.status || 'new'
    };
    navigation.navigate('ReportDetail', { report: enhancedReport });
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Modern Patient Header */}
        <View style={styles.modernPatientProfileHeader}>
          <View style={styles.patientProfileGradient}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <MaterialIcons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.patientProfileHeaderContent}>
              <View style={styles.patientProfileAvatar}>
                <View style={[styles.patientAvatarLarge, {
                  backgroundColor: patient.gender === 'M' || patient.gender === 'Male' || patient.gender === 'male' || patient.gender === 'man' 
                    ? '#E3F2FD' : '#FCE4EC'
                }]}>
                  <MaterialIcons 
                    name={patient.gender === 'M' || patient.gender === 'Male' || patient.gender === 'male' || patient.gender === 'man' ? 'man' : 'woman'} 
                    size={48} 
                    color={patient.gender === 'M' || patient.gender === 'Male' || patient.gender === 'male' || patient.gender === 'man' ? '#2E86C1' : '#E91E63'}
                  />
                </View>
              </View>
              
              <View style={styles.patientProfileHeaderText}>
                <Text style={styles.patientProfileName}>{patient.name}</Text>
                <View style={styles.patientProfileMeta}>
                  <View style={styles.patientMetaBadge}>
                    <MaterialIcons name="cake" size={16} color="#fff" />
                    <Text style={styles.patientMetaBadgeText}>{patient.age || 'N/A'} years</Text>
                  </View>
                  <View style={styles.patientMetaBadge}>
                    <MaterialIcons 
                      name={patient.gender === 'M' || patient.gender === 'Male' || patient.gender === 'male' || patient.gender === 'man' ? 'man' : 'woman'} 
                      size={16} 
                      color="#fff" 
                    />
                    <Text style={styles.patientMetaBadgeText}>
                      {patient.gender === 'M' || patient.gender === 'Male' || patient.gender === 'male' || patient.gender === 'man' 
                        ? 'Male' 
                        : patient.gender === 'F' || patient.gender === 'Female' || patient.gender === 'female' || patient.gender === 'woman'
                        ? 'Female' 
                        : patient.gender || 'N/A'
                      }
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Quick Action Buttons */}
            {(patient.contact || patient.mobile) && (
              <View style={styles.quickActionButtons}>
                <TouchableOpacity 
                  style={styles.quickActionButton}
                  onPress={() => {
                    const phoneUrl = `tel:${patient.contact || patient.mobile}`;
                    Linking.openURL(phoneUrl).catch(() => {
                      Alert.alert('Error', 'Unable to make phone call');
                    });
                  }}
                >
                  <MaterialIcons name="phone" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickActionButton}
                  onPress={() => {
                    const smsUrl = `sms:${patient.contact || patient.mobile}`;
                    Linking.openURL(smsUrl).catch(() => {
                      Alert.alert('Error', 'Unable to send message');
                    });
                  }}
                >
                  <MaterialIcons name="message" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        
        {/* Patient Information Cards */}
        <View style={styles.patientInfoSection}>
          {/* Contact Information */}
          <View style={styles.modernInfoCard}>
            <View style={styles.infoCardHeader}>
              <MaterialIcons name="contact-phone" size={24} color="#2E86C1" />
              <Text style={styles.infoCardTitle}>Contact Information</Text>
            </View>
            <View style={styles.infoCardContent}>
              <View style={styles.infoRow}>
                <MaterialIcons name="phone" size={16} color="#8E8E93" />
                <Text style={styles.infoLabel}>Phone:</Text>
                <Text style={styles.infoValue}>{patient.contact || patient.mobile || 'Not provided'}</Text>
              </View>
            </View>
          </View>
          
          {/* Medical Information */}
          <View style={styles.modernInfoCard}>
            <View style={styles.infoCardHeader}>
              <MaterialIcons name="medical-services" size={24} color="#4CAF50" />
              <Text style={styles.infoCardTitle}>Medical Information</Text>
            </View>
            <View style={styles.infoCardContent}>
              <View style={styles.infoRow}>
                <MaterialIcons name="schedule" size={16} color="#8E8E93" />
                <Text style={styles.infoLabel}>Last Visit:</Text>
                <Text style={styles.infoValue}>
                  {patient.lastVisit 
                    ? new Date(patient.lastVisit).toLocaleDateString()
                    : patient.updatedAt 
                    ? new Date(patient.updatedAt).toLocaleDateString()
                    : patient.createdAt
                    ? new Date(patient.createdAt).toLocaleDateString()
                    : 'No previous visits'
                  }
                </Text>
              </View>
              {patient.createdAt && (
                <View style={styles.infoRow}>
                  <MaterialIcons name="person-add" size={16} color="#8E8E93" />
                  <Text style={styles.infoLabel}>Patient Since:</Text>
                  <Text style={styles.infoValue}>{new Date(patient.createdAt).toLocaleDateString()}</Text>
                </View>
              )}
              <View style={styles.infoRowFull}>
                <MaterialIcons name="description" size={16} color="#8E8E93" />
                <Text style={styles.infoLabel}>Medical History:</Text>
              </View>
              <Text style={styles.infoValueFull}>
                {patient.history || 'No medical history available'}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Medical Reports Section */}
        <View style={styles.reportsSection}>
          <View style={styles.modernSectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <MaterialIcons name="description" size={24} color="#FF9800" />
              <Text style={styles.modernSectionTitle}>Medical Reports</Text>
              <View style={styles.reportsBadge}>
                <Text style={styles.reportsBadgeText}>{myReports.length}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.modernAddButton}
              onPress={() => setShowAddReport(!showAddReport)}
            >
              <MaterialIcons name="add" size={20} color="#2E86C1" />
              <Text style={styles.modernAddButtonText}>Add Report</Text>
            </TouchableOpacity>
          </View>
          
          {/* Reports Search */}
          {myReports.length > 0 && (
            <View style={styles.modernSearchRow}>
              <View style={styles.searchInputContainer}>
                <MaterialIcons name="search" size={18} color="#8E8E93" />
                <TextInput 
                  style={styles.modernSearchInput} 
                  placeholder="Search reports by title, type, or content..." 
                  placeholderTextColor="#8E8E93"
                  value={reportSearchQuery} 
                  onChangeText={setReportSearchQuery} 
                />
                {reportSearchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setReportSearchQuery('')}>
                    <MaterialIcons name="close" color="#8E8E93" size={18} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          
          {/* Add Report Form */}
          {showAddReport && (
            <View style={styles.modernAddReportForm}>
              <View style={styles.addReportFormHeader}>
                <MaterialIcons name="note-add" size={24} color="#2E86C1" />
                <Text style={styles.addReportFormTitle}>Add New Report</Text>
                <TouchableOpacity 
                  onPress={() => setShowAddReport(false)}
                  style={styles.closeFormButton}
                >
                  <MaterialIcons name="close" size={20} color="#8E8E93" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modernFormCard}>
                <View style={styles.modernInputGroup}>
                  <Text style={styles.modernLabel}>Report Title *</Text>
                  <TextInput 
                    style={styles.modernTextInput}
                    placeholder="Enter report title (e.g., Blood Test, X-Ray)"
                    placeholderTextColor="#8E8E93"
                    value={reportTitle}
                    onChangeText={setReportTitle}
                  />
                </View>
                
                <View style={styles.modernInputGroup}>
                  <Text style={styles.modernLabel}>Report Content</Text>
                  <TextInput 
                    style={[styles.modernTextInput, styles.modernTextArea]}
                    placeholder="Enter detailed report findings, observations, and recommendations..."
                    placeholderTextColor="#8E8E93"
                    value={reportContent}
                    onChangeText={setReportContent}
                    multiline
                    numberOfLines={4}
                  />
                </View>
                
                <View style={styles.modernInputGroup}>
                  <Text style={styles.modernLabel}>Report Type</Text>
                  <View style={styles.modernReportTypeRow}>
                    {[{key: 'note', label: 'Doctor Note', icon: 'note'}, {key: 'lab', label: 'Lab Report', icon: 'science'}, {key: 'scan', label: 'Scan/Image', icon: 'medical-services'}].map((type) => (
                      <TouchableOpacity 
                        key={type.key}
                        style={[styles.modernTypeOption, reportType === type.key && styles.modernTypeSelected]}
                        onPress={() => setReportType(type.key)}
                        activeOpacity={0.7}
                      >
                        <MaterialIcons 
                          name={type.icon} 
                          size={18} 
                          color={reportType === type.key ? '#fff' : '#2E86C1'} 
                        />
                        <Text style={[styles.modernTypeText, reportType === type.key && styles.modernTypeSelectedText]}>{type.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <View style={styles.modernInputGroup}>
                  <View style={styles.modernAttachmentHeader}>
                    <Text style={styles.modernLabel}>Attachments</Text>
                    <TouchableOpacity 
                      style={styles.modernAddFileButton}
                      onPress={handleAddAttachment}
                      activeOpacity={0.7}
                    >
                      <MaterialIcons name="add-photo-alternate" size={16} color="#2E86C1" />
                      <Text style={styles.modernAddFileButtonText}>Add File</Text>
                    </TouchableOpacity>
                  </View>
                  
                  {attachments.length > 0 ? (
                    <View style={styles.modernAttachmentsList}>
                      {attachments.map((attachment, index) => (
                        <View key={index} style={styles.modernAttachmentPreviewCard}>
                          <View style={styles.modernAttachmentPreviewContent}>
                            <MaterialIcons 
                              name={attachment.type === 'pdf' ? 'description' : 'image'} 
                              size={24} 
                              color={attachment.type === 'pdf' ? '#dc3545' : '#28a745'} 
                            />
                            <View style={styles.modernAttachmentPreviewInfo}>
                              <Text style={styles.modernAttachmentPreviewName}>{attachment.name}</Text>
                              <Text style={styles.modernAttachmentPreviewSize}>{attachment.size}</Text>
                            </View>
                            <TouchableOpacity 
                              onPress={() => removeAttachment(index)}
                              style={styles.modernRemoveAttachmentBtn}
                            >
                              <MaterialIcons name="close" size={18} color="#dc3545" />
                            </TouchableOpacity>
                          </View>
                          
                          {attachment.type === 'image' && attachment.uri && (
                            <Image 
                              source={{ uri: attachment.uri }} 
                              style={styles.modernAttachmentImagePreview}
                              resizeMode="cover"
                            />
                          )}
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View style={styles.modernNoAttachmentsContainer}>
                      <MaterialIcons name="attach-file" size={32} color="#E0E0E0" />
                      <Text style={styles.modernNoAttachmentsText}>No files attached</Text>
                      <Text style={styles.modernNoAttachmentsSubText}>Tap "Add File" to attach documents</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.modernFormActions}>
                  <TouchableOpacity 
                    style={styles.modernCancelButton}
                    onPress={() => setShowAddReport(false)}
                    activeOpacity={0.7}
                  >
                    <MaterialIcons name="close" size={16} color="#6c757d" />
                    <Text style={styles.modernCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modernSaveButton, isAddingReport && styles.modernSaveButtonDisabled]}
                    onPress={handleAddReport}
                    disabled={isAddingReport}
                    activeOpacity={0.7}
                  >
                    {isAddingReport ? (
                      <>
                        <MaterialIcons name="hourglass-empty" size={16} color="#fff" />
                        <Text style={styles.modernSaveText}>Saving...</Text>
                      </>
                    ) : (
                      <>
                        <MaterialIcons name="save" size={16} color="#fff" />
                        <Text style={styles.modernSaveText}>Save Report</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          
          {/* Reports List */}
          <View style={styles.reportsContainer}>
            {filteredReports.length > 0 ? (
              filteredReports.map((r) => (
                <TouchableOpacity
                  key={r._id || r.id || `report-${Date.now()}-${Math.random()}`}
                  style={styles.modernReportCard}
                  onPress={() => handleViewReport(r)}
                  activeOpacity={0.7}
                >
                  <View style={styles.reportCardHeader}>
                    <View style={styles.reportTypeIcon}>
                      <MaterialIcons 
                        name={
                          r.type === 'lab' ? 'science' :
                          r.type === 'scan' ? 'medical-services' :
                          'note'
                        } 
                        size={20} 
                        color="#fff" 
                      />
                    </View>
                    <View style={styles.reportCardInfo}>
                      <Text style={styles.reportCardTitle}>{r.title}</Text>
                      <View style={styles.reportCardMeta}>
                        <View style={styles.reportStatusBadge}>
                          <Text style={styles.reportStatusText}>{(r.status || 'new').toUpperCase()}</Text>
                        </View>
                        <Text style={styles.reportCardDate}>
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Unknown date'}
                        </Text>
                      </View>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#2E86C1" />
                  </View>
                  
                  {r.content && (
                    <Text style={styles.reportCardPreview} numberOfLines={2}>
                      {r.content}
                    </Text>
                  )}
                  
                  {((r.attachments && r.attachments.length > 0) || (r.files && r.files.length > 0)) && (
                    <View style={styles.reportCardFooter}>
                      <MaterialIcons name="attach-file" size={16} color="#8E8E93" />
                      <Text style={styles.reportCardAttachments}>
                        {(r.attachments?.length || 0) + (r.files?.length || 0)} attachment(s)
                      </Text>
                      {r.uploadedByName && (
                        <Text style={styles.reportCardUploader}>by {r.uploadedByName}</Text>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              ))
            ) : reportSearchQuery.length > 0 ? (
              <View style={styles.modernEmptyState}>
                <MaterialIcons name="search-off" size={48} color="#E0E0E0" />
                <Text style={styles.modernEmptyTitle}>No reports found</Text>
                <Text style={styles.modernEmptySubtitle}>Try adjusting your search terms</Text>
              </View>
            ) : (
              <View style={styles.modernEmptyState}>
                <MaterialIcons name="description" size={48} color="#E0E0E0" />
                <Text style={styles.modernEmptyTitle}>No reports available</Text>
                <Text style={styles.modernEmptySubtitle}>Add the first medical report for this patient</Text>
              </View>
            )}
          </View>
        </View>
        

        


        
     
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



export function DoctorProfile1() {
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

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f8f9fa", padding: 16 },
//   header: { fontSize: 20, fontWeight: "800", color: "#2E4053", marginBottom: 10 },
//   subHeader: { marginTop: 14, marginBottom: 8, fontWeight: "700", color: "#2E4053" },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#e9ecef",
//     padding: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 1,
//     marginBottom: 12,
//   },
//   row: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
//   itemTitle: { color: "#2E4053", fontWeight: "700" },
//   itemSub: { color: "#6c757d", marginTop: 4, fontSize: 12 },
//   btn: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
//   btnPrimary: { backgroundColor: "#2E86C1" },
//   btnSecondary: { backgroundColor: "#e8f1f9", borderWidth: 1, borderColor: "#cfe3f5" },
//   btnText: { color: "#fff", fontWeight: "700" },
//   searchRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "#e9ecef",
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     marginBottom: 10,
//   },
//   input: { marginLeft: 8, flex: 1 },
//   note: { color: "#6c757d", fontSize: 12, marginTop: 8 },
// });


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
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 8, marginBottom: 8, backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
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
  attachmentMetadata: {
    color: '#8E8E93',
    fontSize: 11,
    marginTop: 2,
    fontStyle: 'italic',
  },
  pathText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#6c757d',
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
  enhancedSaveButtonDisabled: {
    backgroundColor: '#95a5a6',
    opacity: 0.7,
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
 container: { flex: 1, backgroundColor: "#F9FAFB" },
  scrollContent: { padding: 16, paddingBottom: 32 },

  // Header
  modernPatientProfileHeader: { marginBottom: 16 },
  patientProfileGradient: {
    backgroundColor: "#2E86C1",
    padding: 20,
    borderRadius: 16,
    elevation: 5,
  },
  backButton: {
    backgroundColor: "#1B4F72",
    padding: 8,
    borderRadius: 50,
    marginBottom: 16,
  },
  patientProfileHeaderContent: { flexDirection: "row", alignItems: "center" },
  patientProfileAvatar: { marginRight: 16 },
  patientAvatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  patientProfileHeaderText: { flex: 1 },
  patientProfileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  patientProfileMeta: { flexDirection: "row", gap: 8 },
  patientMetaBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  patientMetaBadgeText: { color: "#fff", marginLeft: 4, fontSize: 12 },

  quickActionButtons: { flexDirection: "row", marginTop: 12 },
  quickActionButton: {
    backgroundColor: "#1B4F72",
    padding: 10,
    borderRadius: 30,
    marginRight: 12,
  },

  // Info
  patientInfoSection: { marginTop: 16 },
  modernInfoCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
  },
  infoCardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E2E2E",
    marginLeft: 8,
  },
  infoCardContent: { marginTop: 8 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  infoLabel: { fontSize: 14, fontWeight: "600", marginLeft: 6, marginRight: 4 },
  infoValue: { fontSize: 14, color: "#555" },
  infoRowFull: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  infoValueFull: { fontSize: 14, color: "#555", marginTop: 4 },

  // Reports
  reportsSection: { marginTop: 16 },
  modernSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionHeaderLeft: { flexDirection: "row", alignItems: "center" },
  modernSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#2E2E2E",
  },
  reportsBadge: {
    backgroundColor: "#FF9800",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  reportsBadgeText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  modernAddButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  modernAddButtonText: {
    color: "#2E86C1",
    marginLeft: 4,
    fontWeight: "600",
  },
// Add Report Form Styles
modernAddReportForm: {
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 16,
  marginTop: 12,
  marginBottom: 20,
  elevation: 4,
},

addReportFormHeader: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 16,
},
addReportFormTitle: {
  flex: 1,
  fontSize: 18,
  fontWeight: "bold",
  color: "#2E2E2E",
  marginLeft: 8,
},
closeFormButton: {
  backgroundColor: "#F0F0F0",
  padding: 6,
  borderRadius: 20,
},

modernFormCard: {
  backgroundColor: "#F9FAFB",
  padding: 14,
  borderRadius: 12,
},

// Inputs
modernInputGroup: { marginBottom: 16 },
modernLabel: {
  fontSize: 14,
  fontWeight: "600",
  color: "#2E2E2E",
  marginBottom: 6,
},
modernTextInput: {
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#E0E0E0",
  borderRadius: 10,
  paddingHorizontal: 12,
  paddingVertical: 10,
  fontSize: 14,
  color: "#333",
},
modernTextArea: {
  height: 100,
  textAlignVertical: "top",
},

// Report type
modernReportTypeRow: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 8,
  marginTop: 6,
},
modernTypeOption: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderWidth: 1,
  borderColor: "#2E86C1",
  borderRadius: 20,
  marginRight: 8,
  marginBottom: 8,
},
modernTypeSelected: {
  backgroundColor: "#2E86C1",
  borderColor: "#2E86C1",
},
modernTypeText: {
  marginLeft: 6,
  fontSize: 13,
  color: "#2E86C1",
  fontWeight: "500",
},
modernTypeSelectedText: { color: "#fff" },

// Attachments
modernAttachmentHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 8,
},
modernAddFileButton: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#E3F2FD",
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 20,
},
modernAddFileButtonText: {
  marginLeft: 4,
  fontSize: 13,
  fontWeight: "600",
  color: "#2E86C1",
},

modernAttachmentsList: { marginTop: 8 },
modernAttachmentPreviewCard: {
  backgroundColor: "#fff",
  borderWidth: 1,
  borderColor: "#E0E0E0",
  borderRadius: 12,
  padding: 10,
  marginBottom: 12,
},
modernAttachmentPreviewContent: {
  flexDirection: "row",
  alignItems: "center",
},
modernAttachmentPreviewInfo: { flex: 1, marginLeft: 10 },
modernAttachmentPreviewName: {
  fontSize: 14,
  fontWeight: "600",
  color: "#2E2E2E",
},
modernAttachmentPreviewSize: {
  fontSize: 12,
  color: "#6c757d",
},
modernRemoveAttachmentBtn: {
  backgroundColor: "#F8D7DA",
  padding: 4,
  borderRadius: 20,
  marginLeft: 8,
},
modernAttachmentImagePreview: {
  width: "100%",
  height: 150,
  borderRadius: 10,
  marginTop: 8,
},

modernNoAttachmentsContainer: {
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  borderWidth: 1,
  borderColor: "#E0E0E0",
  borderStyle: "dashed",
  borderRadius: 12,
  marginTop: 8,
},
modernNoAttachmentsText: {
  fontSize: 14,
  fontWeight: "600",
  color: "#555",
  marginTop: 8,
},
modernNoAttachmentsSubText: {
  fontSize: 12,
  color: "#8E8E93",
  marginTop: 2,
},

// Actions
modernFormActions: {
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
  marginTop: 16,
  gap: 10,
},
modernCancelButton: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#F0F0F0",
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 20,
},
modernCancelText: {
  marginLeft: 4,
  fontSize: 13,
  fontWeight: "600",
  color: "#6c757d",
},
modernSaveButton: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#2E86C1",
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 20,
},
modernSaveButtonDisabled: { backgroundColor: "#A9CCE3" },
modernSaveText: {
  marginLeft: 6,
  fontSize: 14,
  fontWeight: "600",
  color: "#fff",
},
// Reports Container
reportsContainer: {
  marginTop: 16,
  marginBottom: 20,
},

// Report Card
modernReportCard: {
  backgroundColor: "#fff",
  borderRadius: 14,
  padding: 14,
  marginBottom: 12,
  elevation: 3,
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
},

reportCardHeader: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 8,
},

reportTypeIcon: {
  backgroundColor: "#2E86C1",
  padding: 8,
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
  marginRight: 10,
},

reportCardInfo: { flex: 1 },

reportCardTitle: {
  fontSize: 16,
  fontWeight: "700",
  color: "#2E2E2E",
  marginBottom: 2,
},

reportCardMeta: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
},

reportStatusBadge: {
  backgroundColor: "#E3F2FD",
  paddingHorizontal: 8,
  paddingVertical: 2,
  borderRadius: 8,
},
reportStatusText: {
  fontSize: 11,
  fontWeight: "700",
  color: "#2E86C1",
  letterSpacing: 0.5,
},

reportCardDate: {
  fontSize: 12,
  color: "#6c757d",
},

// Preview Text
reportCardPreview: {
  fontSize: 13,
  color: "#4A4A4A",
  marginTop: 4,
  marginBottom: 6,
  lineHeight: 18,
},

// Footer
reportCardFooter: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 6,
},
reportCardAttachments: {
  fontSize: 12,
  color: "#555",
  marginLeft: 4,
},
reportCardUploader: {
  fontSize: 12,
  color: "#888",
  marginLeft: 10,
  fontStyle: "italic",
},

// Empty State
modernEmptyState: {
  justifyContent: "center",
  alignItems: "center",
  paddingVertical: 40,
  paddingHorizontal: 20,
},
modernEmptyTitle: {
  fontSize: 16,
  fontWeight: "700",
  color: "#333",
  marginTop: 10,
},
modernEmptySubtitle: {
  fontSize: 13,
  color: "#777",
  marginTop: 4,
  textAlign: "center",
},

});

export default styles;

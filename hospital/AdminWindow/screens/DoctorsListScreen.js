// screens/DoctorsListScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { commonStyles } from '../../../theme/styles';
import SectionHeaderAdmin from '../components/SectionHeaderAdmin';
import AdminFormField from '../components/AdminFormField';


const DoctorsListScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [searchQuery, selectedDepartment, doctors]);

  const loadDoctors = () => {
    // Mock data
    const mockDoctors = [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        department: 'Cardiology',
        specialization: 'Heart Surgery',
        availability: 'Available',
        consultationFee: 200,
      },
      {
        id: '2',
        name: 'Dr. Michael Chen',
        department: 'Neurology',
        specialization: 'Brain Disorders',
        availability: 'Busy',
        consultationFee: 180,
      },
      {
        id: '3',
        name: 'Dr. Emily Williams',
        department: 'Pediatrics',
        specialization: 'Child Healthcare',
        availability: 'Available',
        consultationFee: 150,
      },
      {
        id: '4',
        name: 'Dr. James Wilson',
        department: 'Surgery',
        specialization: 'General Surgery',
        availability: 'Unavailable',
        consultationFee: 220,
      },
    ];
    setDoctors(mockDoctors);
  };

  const filterDoctors = () => {
    let filtered = doctors;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(query) ||
          doctor.department.toLowerCase().includes(query) ||
          doctor.specialization.toLowerCase().includes(query)
      );
    }

    if (selectedDepartment !== 'All') {
      filtered = filtered.filter((doctor) => doctor.department === selectedDepartment);
    }

    setFilteredDoctors(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadDoctors();
      setRefreshing(false);
    }, 2000);
  };

  const getAvailabilityIcon = (availability) => {
    switch (availability) {
      case 'Available': return { icon: '✅', color: colors.available };
      case 'Busy': return { icon: '⏰', color: colors.busy };
      case 'Unavailable': return { icon: '⭕', color: colors.unavailable };
      default: return { icon: '❓', color: colors.textLight };
    }
  };

  const renderDoctorItem = ({ item }) => {
    const availability = getAvailabilityIcon(item.availability);
    
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('DoctorDetail', { doctorId: item.id })}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: typography.h6, fontWeight: 'bold' }}>
              {item.name}
            </Text>
            <Text style={{ color: colors.textLight, marginTop: 4 }}>
              {item.department} • {item.specialization}
            </Text>
            <Text style={{ marginTop: 8, fontWeight: '600' }}>
              Consultation: ${item.consultationFee}
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 20 }}>{availability.icon}</Text>
            <Text style={{ color: availability.color, fontSize: typography.caption, marginTop: 4 }}>
              {item.availability}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const departments = ['All', 'Cardiology', 'Neurology', 'Pediatrics', 'Surgery'];

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        <SectionHeaderAdmin title="Doctor Management" />
        
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <AdminFormField
              placeholder="Search doctors..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              icon="search"
            />
          </View>
          <TouchableOpacity
            style={[styles.button, { width: 50, justifyContent: 'center' }]}
            onPress={() => navigation.navigate('DoctorForm')}
          >
            <Text style={[styles.buttonText, { fontSize: 20 }]}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={styles.label}>Filter by Department:</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {departments.map((dept) => (
              <TouchableOpacity
                key={dept}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                  backgroundColor: selectedDepartment === dept ? colors.primary : colors.border,
                  marginRight: 8,
                  marginBottom: 8,
                }}
                onPress={() => setSelectedDepartment(dept)}
              >
                <Text style={{
                  color: selectedDepartment === dept ? 'white' : colors.textSecondary,
                  fontSize: typography.body,
                }}>
                  {dept}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <FlatList
          data={filteredDoctors}
          renderItem={renderDoctorItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text>No doctors found</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.textWhite,
    fontSize: typography.body,
    fontWeight: '600',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
});

export default DoctorsListScreen;
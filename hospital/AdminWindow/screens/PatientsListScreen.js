// screens/PatientsListScreen.js
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

const PatientsListScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [searchQuery, patients]);

  const loadPatients = () => {
    // Mock data - in a real app, this would come from an API
    const mockPatients = [
      {
        id: '1',
        name: 'John Doe',
        age: 45,
        gender: 'Male',
        bloodType: 'A+',
        lastVisit: '2023-05-15',
        status: 'Active',
      },
      {
        id: '2',
        name: 'Jane Smith',
        age: 32,
        gender: 'Female',
        bloodType: 'O-',
        lastVisit: '2023-06-20',
        status: 'Active',
      },
      {
        id: '3',
        name: 'Robert Johnson',
        age: 68,
        gender: 'Male',
        bloodType: 'B+',
        lastVisit: '2023-04-10',
        status: 'Inactive',
      },
    ];
    setPatients(mockPatients);
  };

  const filterPatients = () => {
    if (!searchQuery) {
      setFilteredPatients(patients);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(query) ||
        patient.bloodType.toLowerCase().includes(query) ||
        patient.status.toLowerCase().includes(query)
    );
    setFilteredPatients(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate data fetching
    setTimeout(() => {
      loadPatients();
      setRefreshing(false);
    }, 2000);
  };

  const renderPatientItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PatientDetail', { patientId: item.id })}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View>
          <Text
            style={{
              fontSize: typography.h6,
              fontWeight: 'bold',
            }}
          >
            {item.name}
          </Text>
          <Text style={{ color: colors.textSecondary }}>
            {item.gender}, {item.age} years, {item.bloodType}
          </Text>
        </View>
        <View
          style={{
            backgroundColor:
              item.status === 'Active'
                ? colors.success
                : colors.textLight,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
          }}
        >
          <Text style={{ color: 'white', fontSize: typography.caption }}>
            {item.status}
          </Text>
        </View>
      </View>
      <Text
        style={{
          marginTop: 4,
          color: colors.textSecondary,
        }}
      >
        Last visit: {item.lastVisit}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        <SectionHeaderAdmin title="Patient Management" />

      <View
        style={{
          flexDirection: 'row',
          marginBottom: 16,
        }}
      >
        <View style={{ flex: 1, marginRight: 8 }}>
          <AdminFormField
            placeholder="Search patients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            icon="search-outline"
          />
        </View>
        <TouchableOpacity
          style={[styles.button, { width: 50, justifyContent: 'center' }]}
          onPress={() => navigation.navigate('PatientForm')}
        >
          <Text style={[styles.buttonText, { fontSize: 20 }]}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredPatients}
        renderItem={renderPatientItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={{ color: colors.textSecondary }}>
              No patients found
            </Text>
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
    padding: 16,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.textWhite,
    fontSize: typography.body,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
});

export default PatientsListScreen;

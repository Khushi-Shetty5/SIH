// screens/StaffListScreen.js
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

const StaffListScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');

  useEffect(() => {
    loadStaff();
  }, []);

  useEffect(() => {
    filterStaff();
  }, [searchQuery, selectedDepartment, selectedRole, staff]);

  const loadStaff = () => {
    // Mock data
    const mockStaff = [
      {
        id: '1',
        name: 'Sarah Johnson',
        role: 'Nurse',
        department: 'Cardiology',
        email: 'sarah.johnson@hospital.com',
        phone: '+1-555-0123',
        status: 'Active',
      },
      {
        id: '2',
        name: 'Michael Chen',
        role: 'Receptionist',
        department: 'Front Desk',
        email: 'michael.chen@hospital.com',
        phone: '+1-555-0124',
        status: 'Active',
      },
      {
        id: '3',
        name: 'Emily Williams',
        role: 'Lab Technician',
        department: 'Pathology',
        email: 'emily.williams@hospital.com',
        phone: '+1-555-0125',
        status: 'Inactive',
      },
      {
        id: '4',
        name: 'James Wilson',
        role: 'Pharmacist',
        department: 'Pharmacy',
        email: 'james.wilson@hospital.com',
        phone: '+1-555-0126',
        status: 'Active',
      },
    ];
    setStaff(mockStaff);
  };

  const filterStaff = () => {
    let filtered = staff;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (staff) =>
          staff.name.toLowerCase().includes(query) ||
          staff.role.toLowerCase().includes(query) ||
          staff.department.toLowerCase().includes(query) ||
          staff.email.toLowerCase().includes(query)
      );
    }

    if (selectedDepartment !== 'All') {
      filtered = filtered.filter((staff) => staff.department === selectedDepartment);
    }

    if (selectedRole !== 'All') {
      filtered = filtered.filter((staff) => staff.role === selectedRole);
    }

    setFilteredStaff(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadStaff();
      setRefreshing(false);
    }, 2000);
  };

  const renderStaffItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('StaffForm', { staffId: item.id })}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: typography.h6, fontWeight: 'bold' }}>
            {item.name}
          </Text>
          <Text style={{ color: colors.textSecondary, marginTop: 4 }}>
            {item.role} • {item.department}
          </Text>
          <Text style={{ marginTop: 8, color: colors.textSecondary }}>
            {item.email}
          </Text>
          <Text style={{ color: colors.textSecondary }}>
            {item.phone}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: item.status === 'Active' ? colors.success : colors.textLight,
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
    </TouchableOpacity>
  );

  const departments = ['All', 'Cardiology', 'Front Desk', 'Pathology', 'Pharmacy', 'Administration'];
  const roles = ['All', 'Nurse', 'Receptionist', 'Lab Technician', 'Pharmacist', 'Administrator'];

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        <SectionHeaderAdmin title="Staff Management" />
      
      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <AdminFormField
            placeholder="Search staff..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            icon="search"
          />
        </View>
        <TouchableOpacity
          style={[styles.button, { width: 50, justifyContent: 'center' }]}
          onPress={() => navigation.navigate('StaffForm')}
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
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 16,
                backgroundColor: selectedDepartment === dept ? colors.primary : colors.border,
                marginRight: 4,
                marginBottom: 4,
              }}
              onPress={() => setSelectedDepartment(dept)}
            >
              <Text style={{
                color: selectedDepartment === dept ? 'white' : colors.textPrimary,
                fontSize: typography.caption,
              }}>
                {dept}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text style={styles.label}>Filter by Role:</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 16,
                backgroundColor: selectedRole === role ? colors.primary : colors.border,
                marginRight: 4,
                marginBottom: 4,
              }}
              onPress={() => setSelectedRole(role)}
            >
              <Text style={{
                color: selectedRole === role ? 'white' : colors.textPrimary,
                fontSize: typography.caption,
              }}>
                {role}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredStaff}
        renderItem={renderStaffItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>No staff members found</Text>
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
  label: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
});

export default StaffListScreen;
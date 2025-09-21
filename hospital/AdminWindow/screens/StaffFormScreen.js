// screens/StaffFormScreen.js
import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { commonStyles } from '../../../theme/styles';
import AdminFormField from '../components/AdminFormField';
import SectionHeaderAdmin from '../components/SectionHeaderAdmin';
import { validateEmail, validatePhone } from '../utils/validators';

const StaffFormScreen = ({ navigation, route }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    salary: '',
    hireDate: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    status: 'Active',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when field is edited
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (formData.email && !validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (formData.phone && !validatePhone(formData.phone)) newErrors.phone = 'Invalid phone number';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.salary) newErrors.salary = 'Salary is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Here you would typically save the data to your backend
      Alert.alert('Success', 'Staff information saved successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  const roles = [
    'Nurse',
    'Receptionist',
    'Lab Technician',
    'Pharmacist',
    'Administrator',
    'Janitor',
    'Security',
    'IT Support'
  ];

  const departments = [
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Surgery',
    'Orthopedics',
    'Pathology',
    'Pharmacy',
    'Front Desk',
    'Administration',
    'Maintenance'
  ];

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <SectionHeaderAdmin title="Add/Edit Staff" />
      
      <View style={styles.card}>
        <Text style={styles.subHeader}>Personal Information</Text>
        
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <View style={{ width: '48%' }}>
            <AdminFormField
              label="First Name"
              placeholder="Enter first name"
              value={formData.firstName}
              onChangeText={(text) => handleChange('firstName', text)}
              error={errors.firstName}
            />
          </View>
          <View style={{ width: '48%' }}>
            <AdminFormField
              label="Last Name"
              placeholder="Enter last name"
              value={formData.lastName}
              onChangeText={(text) => handleChange('lastName', text)}
              error={errors.lastName}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <View style={{ width: '48%' }}>
            <AdminFormField
              label="Email"
              placeholder="Enter email"
              value={formData.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
              error={errors.email}
            />
          </View>
          <View style={{ width: '48%' }}>
            <AdminFormField
              label="Phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChangeText={(text) => handleChange('phone', text)}
              keyboardType="phone-pad"
              error={errors.phone}
            />
          </View>
        </View>

        <AdminFormField
          label="Address"
          placeholder="Enter full address"
          value={formData.address}
          onChangeText={(text) => handleChange('address', text)}
          multiline
          numberOfLines={2}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.subHeader}>Employment Information</Text>
        
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <View style={{ width: '48%' }}>
            <AdminFormField
              label="Role"
              placeholder="Select role"
              value={formData.role}
              onChangeText={(text) => handleChange('role', text)}
              error={errors.role}
            />
          </View>
          <View style={{ width: '48%' }}>
            <AdminFormField
              label="Department"
              placeholder="Select department"
              value={formData.department}
              onChangeText={(text) => handleChange('department', text)}
              error={errors.department}
            />
          </View>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <View style={{ width: '48%' }}>
            <AdminFormField
              label="Salary ($)"
              placeholder="Enter salary amount"
              value={formData.salary}
              onChangeText={(text) => handleChange('salary', text)}
              keyboardType="numeric"
              error={errors.salary}
            />
          </View>
          <View style={{ width: '48%' }}>
            <AdminFormField
              label="Hire Date"
              placeholder="YYYY-MM-DD"
              value={formData.hireDate}
              onChangeText={(text) => handleChange('hireDate', text)}
            />
          </View>
        </View>

        <AdminFormField
          label="Status"
          placeholder="Select status"
          value={formData.status}
          onChangeText={(text) => handleChange('status', text)}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.subHeader}>Emergency Contact</Text>
        
        <AdminFormField
          label="Emergency Contact Name"
          placeholder="Enter name"
          value={formData.emergencyContact}
          onChangeText={(text) => handleChange('emergencyContact', text)}
        />

        <AdminFormField
          label="Emergency Contact Phone"
          placeholder="Enter phone number"
          value={formData.emergencyPhone}
          onChangeText={(text) => handleChange('emergencyPhone', text)}
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Staff Information</Text>
      </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
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
  subHeader: {
    fontSize: typography.h6,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginVertical: 16,
  },
  buttonText: {
    color: colors.textWhite,
    fontSize: typography.body,
    fontWeight: '600',
  },
});

export default StaffFormScreen;
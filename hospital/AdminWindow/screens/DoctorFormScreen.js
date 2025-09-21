// screens/DoctorFormScreen.js
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

const DoctorFormScreen = ({ navigation, route }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    specialization: '',
    qualifications: '',
    experience: '',
    consultationFee: '',
    availability: 'Available',
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
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.specialization) newErrors.specialization = 'Specialization is required';
    if (!formData.consultationFee) newErrors.consultationFee = 'Consultation fee is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Here you would typically save the data to your backend
      Alert.alert('Success', 'Doctor information saved successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  const departments = [
    'Cardiology',
    'Neurology',
    'Pediatrics',
    'Surgery',
    'Orthopedics',
    'Dermatology',
    'Ophthalmology',
    'ENT',
    'Dentistry',
    'Psychiatry'
  ];

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <SectionHeaderAdmin title="Add/Edit Doctor" />
        
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
      </View>

      <View style={styles.card}>
        <Text style={styles.subHeader}>Professional Information</Text>
        
        <AdminFormField
          label="Department"
          placeholder="Select department"
          value={formData.department}
          onChangeText={(text) => handleChange('department', text)}
          error={errors.department}
        />

        <AdminFormField
          label="Specialization"
          placeholder="Enter specialization"
          value={formData.specialization}
          onChangeText={(text) => handleChange('specialization', text)}
          error={errors.specialization}
        />

        <AdminFormField
          label="Qualifications"
          placeholder="Enter qualifications (comma separated)"
          value={formData.qualifications}
          onChangeText={(text) => handleChange('qualifications', text)}
          multiline
          numberOfLines={2}
        />

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <View style={{ width: '48%' }}>
            <AdminFormField
              label="Experience (years)"
              placeholder="Enter years of experience"
              value={formData.experience}
              onChangeText={(text) => handleChange('experience', text)}
              keyboardType="numeric"
            />
          </View>
          <View style={{ width: '48%' }}>
            <AdminFormField
              label="Consultation Fee ($)"
              placeholder="Enter fee amount"
              value={formData.consultationFee}
              onChangeText={(text) => handleChange('consultationFee', text)}
              keyboardType="numeric"
              error={errors.consultationFee}
            />
          </View>
        </View>

        <AdminFormField
          label="Availability"
          placeholder="Select availability"
          value={formData.availability}
          onChangeText={(text) => handleChange('availability', text)}
        />
      </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Save Doctor Information</Text>
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
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  buttonText: {
    color: colors.textWhite,
    fontSize: typography.body,
    fontWeight: '600',
  },
});

export default DoctorFormScreen;
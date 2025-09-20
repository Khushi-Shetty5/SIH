import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';

const PatientCard = ({ patient, onPress, showFullDetails = false }) => {
  const formatAge = (age) => {
    return `${age} years old`;
  };

  const getGenderIcon = (gender) => {
    return gender === 'Male' ? '👨' : '👩';
  };

  const getBloodTypeColor = (bloodType) => {
    const type = bloodType.replace(/[+-]/, '');
    const colors = {
      'O': '#E63946',
      'A': '#2E86AB',
      'B': '#F4A261',
      'AB': '#9B59B6'
    };
    return colors[type] || '#6B7280';
  };

  if (showFullDetails) {
    return (
      <ScrollView style={styles.fullCard}>
        <View style={styles.header}>
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{patient.name}</Text>
            <Text style={styles.patientDetails}>
              {getGenderIcon(patient.gender)} {formatAge(patient.age)} • {patient.bloodType}
            </Text>
          </View>
          <View style={[styles.bloodTypeBadge, { backgroundColor: getBloodTypeColor(patient.bloodType) }]}>
            <Text style={styles.bloodTypeText}>{patient.bloodType}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone:</Text>
            <Text style={styles.detailValue}>{patient.phone}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address:</Text>
            <Text style={styles.detailValue}>{patient.address}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Emergency Contact:</Text>
            <Text style={styles.detailValue}>{patient.emergencyContact}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allergies</Text>
          <View style={styles.allergiesContainer}>
            {patient.allergies.map((allergy, index) => (
              <View key={index} style={styles.allergyTag}>
                <Text style={styles.allergyText}>{allergy}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Medications</Text>
          {patient.currentMedications.map((medication, index) => (
            <View key={index} style={styles.medicationItem}>
              <Text style={styles.medicationName}>{medication.name}</Text>
              <Text style={styles.medicationDetails}>
                {medication.dosage} • {medication.frequency}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medical History</Text>
          {patient.medicalHistory.map((record, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyDate}>{record.date}</Text>
              <Text style={styles.historyCondition}>{record.condition}</Text>
              <Text style={styles.historyTreatment}>{record.treatment}</Text>
              <Text style={styles.historyDoctor}>Dr. {record.doctor}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>{patient.name}</Text>
          <Text style={styles.patientDetails}>
            {getGenderIcon(patient.gender)} {formatAge(patient.age)}
          </Text>
        </View>
        <View style={[styles.bloodTypeBadge, { backgroundColor: getBloodTypeColor(patient.bloodType) }]}>
          <Text style={styles.bloodTypeText}>{patient.bloodType}</Text>
        </View>
      </View>
      
      <Text style={styles.phone}>{patient.phone}</Text>
      
      <View style={styles.allergiesContainer}>
        {patient.allergies.slice(0, 2).map((allergy, index) => (
          <View key={index} style={styles.allergyTag}>
            <Text style={styles.allergyText}>{allergy}</Text>
          </View>
        ))}
        {patient.allergies.length > 2 && (
          <Text style={styles.moreAllergies}>+{patient.allergies.length - 2} more</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    // Use boxShadow for better cross-platform compatibility
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  fullCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    // Use boxShadow for better cross-platform compatibility
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: typography.h6,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  patientDetails: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  bloodTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bloodTypeText: {
    fontSize: typography.caption,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  phone: {
    fontSize: typography.body,
    color: colors.textLight,
    marginBottom: 8,
  },
  allergiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  allergyTag: {
    backgroundColor: colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  allergyText: {
    fontSize: typography.caption,
    color: colors.textWhite,
    fontWeight: '600',
  },
  moreAllergies: {
    fontSize: typography.caption,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: typography.h6,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: typography.body,
    color: colors.textLight,
    flex: 1,
  },
  detailValue: {
    fontSize: typography.body,
    color: colors.textSecondary,
    flex: 2,
    textAlign: 'right',
  },
  medicationItem: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  medicationName: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  medicationDetails: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
  historyItem: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  historyDate: {
    fontSize: typography.caption,
    color: colors.textLight,
    marginBottom: 4,
  },
  historyCondition: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  historyTreatment: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  historyDoctor: {
    fontSize: typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default PatientCard;

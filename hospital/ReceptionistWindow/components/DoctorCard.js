import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { commonStyles } from '../../../theme/styles';
import { getResponsiveValue } from '../../../utils/responsive';
import { Icons } from './Icon';

const DoctorCard = ({ doctor, onPress }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isSmallScreen = width < 375;

  const getAvailabilityIcon = (availability) => {
    const iconSize = getResponsiveValue(16, 20, 24);
    switch (availability) {
      case 'available':
        return <Icons.available size={iconSize} />;
      case 'busy':
        return <Icons.busy size={iconSize} />;
      case 'unavailable':
        return <Icons.unavailable size={iconSize} />;
      default:
        return <Icons.info size={iconSize} />;
    }
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'available':
        return colors.available;
      case 'busy':
        return colors.busy;
      case 'unavailable':
        return colors.unavailable;
      default:
        return colors.textLight;
    }
  };

  const getAvailabilityText = (availability) => {
    switch (availability) {
      case 'available':
        return 'Available';
      case 'busy':
        return 'Busy';
      case 'unavailable':
        return 'Not Available';
      default:
        return 'Unknown';
    }
  };

  return (
    <TouchableOpacity style={[commonStyles.card, styles.card]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.doctorInfo}>
          <Text style={[styles.doctorName, { fontSize: getResponsiveValue(14, 16, 18) }]}>
            {doctor.name}
          </Text>
          <View style={styles.departmentContainer}>
            <Icons.hospital size={getResponsiveValue(12, 14, 16)} color={colors.primary} />
            <Text style={styles.department}>{doctor.department}</Text>
          </View>
          <Text style={styles.specialization}>{doctor.specialization}</Text>
        </View>
        <View style={styles.availabilityContainer}>
          {getAvailabilityIcon(doctor.availability)}
          <Text style={[styles.availabilityText, { color: getAvailabilityColor(doctor.availability) }]}>
            {getAvailabilityText(doctor.availability)}
          </Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Experience:</Text>
          <Text style={styles.detailValue}>{doctor.experience}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Current Patients:</Text>
          <Text style={styles.detailValue}>{doctor.currentPatients}/{doctor.maxPatients}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Phone:</Text>
          <Text style={styles.detailValue}>{doctor.phone}</Text>
        </View>
      </View>
      
      <View style={styles.qualifications}>
        <Text style={styles.qualificationsLabel}>Qualifications:</Text>
        <Text style={styles.qualificationsText}>{doctor.qualifications.join(', ')}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    // Using commonStyles.card as base
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: getResponsiveValue(8, 12, 16),
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: getResponsiveValue(2, 4, 6),
  },
  departmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getResponsiveValue(2, 4, 6),
  },
  department: {
    fontSize: typography.body,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: getResponsiveValue(4, 6, 8),
  },
  specialization: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
  availabilityContainer: {
    alignItems: 'center',
  },
  availabilityIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  availabilityText: {
    fontSize: typography.caption,
    fontWeight: '600',
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: typography.caption,
    color: colors.textLight,
  },
  detailValue: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  qualifications: {
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 8,
  },
  qualificationsLabel: {
    fontSize: typography.caption,
    color: colors.textLight,
    marginBottom: 4,
  },
  qualificationsText: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.caption,
  },
});

export default DoctorCard;

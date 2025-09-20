import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { commonStyles } from '../../../theme/styles';
import { getResponsiveValue } from '../../../utils/responsive';
import { Icons } from './Icon';


const EmergencyCard = ({ emergency, onPress }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isSmallScreen = width < 375;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return colors.emergencyHigh;
      case 'medium':
        return colors.emergencyMedium;
      case 'low':
        return colors.emergencyLow;
      default:
        return colors.emergencyLow;
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <Icons.high size={getResponsiveValue(16, 20, 24)} />;
      case 'medium':
        return <Icons.medium size={getResponsiveValue(16, 20, 24)} />;
      case 'low':
        return <Icons.low size={getResponsiveValue(16, 20, 24)} />;
      default:
        return <Icons.low size={getResponsiveValue(16, 20, 24)} />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <TouchableOpacity style={[styles.card]} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.patientInfo}>
          <Text style={[styles.patientName, { fontSize: getResponsiveValue(14, 16, 18) }]}>
            {emergency.patientName}
          </Text>
          <View style={styles.timeContainer}>
            <Icons.time size={getResponsiveValue(12, 14, 16)} color={colors.textLight} />
            <Text style={styles.time}>{formatTime(emergency.timestamp)}</Text>
          </View>
        </View>
        <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(emergency.severity) }]}>
          {getSeverityIcon(emergency.severity)}
          <Text style={styles.severityText}>{emergency.severity.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.issue} numberOfLines={2}>
        {emergency.issue}
      </Text>
      
      {emergency.notes && (
        <Text style={styles.notes} numberOfLines={2}>
          {emergency.notes}
        </Text>
      )}
      
      <View style={styles.footer}>
        <Text style={styles.status}>
          Status: {emergency.status.charAt(0).toUpperCase() + emergency.status.slice(1)}
        </Text>
        {emergency.assignedDoctor && (
          <Text style={styles.assignedDoctor}>
            Assigned to: {emergency.assignedDoctor}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: getResponsiveValue(16, 20, 24),
    marginVertical: getResponsiveValue(6, 8, 10),
    marginHorizontal: getResponsiveValue(4, 6, 8),
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: getResponsiveValue(12, 16, 20),
  },
  patientInfo: {
    flex: 1,
    marginRight: getResponsiveValue(8, 12, 16),
  },
  patientName: {
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: getResponsiveValue(4, 6, 8),
    fontSize: getResponsiveValue(16, 18, 20),
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: getResponsiveValue(8, 10, 12),
    paddingVertical: getResponsiveValue(4, 6, 8),
    borderRadius: getResponsiveValue(12, 16, 20),
  },
  time: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginLeft: getResponsiveValue(4, 6, 8),
    fontWeight: '500',
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: getResponsiveValue(10, 12, 16),
    paddingVertical: getResponsiveValue(6, 8, 10),
    borderRadius: getResponsiveValue(20, 24, 28),
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  severityText: {
    fontSize: typography.caption,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginLeft: getResponsiveValue(4, 6, 8),
    letterSpacing: 0.5,
  },
  issue: {
    fontSize: typography.body,
    color: colors.textPrimary,
    marginBottom: getResponsiveValue(10, 12, 16),
    lineHeight: typography.lineHeight ? typography.lineHeight.body : 22,
    fontWeight: '500',
  },
  notes: {
    fontSize: typography.caption,
    color: colors.textLight,
    fontStyle: 'italic',
    marginBottom: getResponsiveValue(10, 12, 16),
    backgroundColor: colors.backgroundAlt,
    padding: getResponsiveValue(8, 10, 12),
    borderRadius: getResponsiveValue(8, 10, 12),
    borderLeftWidth: 2,
    borderLeftColor: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: getResponsiveValue(8, 10, 12),
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  status: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  assignedDoctor: {
    fontSize: typography.caption,
    color: colors.primary,
    fontWeight: '600',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: getResponsiveValue(8, 10, 12),
    paddingVertical: getResponsiveValue(4, 6, 8),
    borderRadius: getResponsiveValue(12, 16, 20),
  },
});

export default EmergencyCard;

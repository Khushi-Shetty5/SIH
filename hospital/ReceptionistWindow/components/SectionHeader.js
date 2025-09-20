import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { commonStyles } from '../../../theme/styles';
import { getResponsiveValue } from '../../../utils/responsive';

const SectionHeader = ({ title, actionText, onActionPress, icon }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={commonStyles.sectionHeader}>{title}</Text>
      </View>
      {actionText && onActionPress && (
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={onActionPress}
          activeOpacity={0.7}
        >
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: getResponsiveValue(8, 12, 16),
    paddingHorizontal: getResponsiveValue(2, 4, 6),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: getResponsiveValue(6, 8, 10),
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical: getResponsiveValue(6, 8, 10),
    paddingHorizontal: getResponsiveValue(12, 16, 20),
    borderRadius: getResponsiveValue(6, 8, 10),
    minWidth: getResponsiveValue(60, 80, 100),
    alignItems: 'center',
    justifyContent: 'center',
    // Enhanced shadow for better visibility
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  actionText: {
    fontSize: getResponsiveValue(12, 14, 14),
    color: colors.textWhite,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SectionHeader;
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { commonStyles  } from '../../../theme/styles';
import { getResponsiveValue } from '../../../utils/responsive';

const QuickActionCard = ({ title, description, icon, color, onPress, style }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isSmallScreen = width < 375;

  return (
    <TouchableOpacity style={[styles.card, { borderLeftColor: color }, style]}
    onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderLeftWidth: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: getResponsiveValue(40, 48, 56),
    height: getResponsiveValue(40, 48, 56),
    borderRadius: getResponsiveValue(20, 24, 28),
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: getResponsiveValue(10, 12, 16),
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.h6,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: typography.body,
    color: colors.textSecondary,
    lineHeight: typography.lineHeight.body,
  },
  arrowContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    fontSize: 20,
    color: colors.textLight,
    fontWeight: 'bold',
  },
});

export default QuickActionCard;

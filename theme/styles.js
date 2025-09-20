import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from './colors';
import { typography } from './typography';
import { getResponsiveFontSize, getResponsiveValue } from '../utils/responsive';

const { width: screenWidth } = Dimensions.get('window');

// Re-export responsive functions for convenience
export { getResponsiveFontSize, getResponsiveValue };


export const getCardWidth = () => {
  if (screenWidth >= 1024) return screenWidth / 4 - 24;
  if (screenWidth >= 768) return screenWidth / 3 - 20;
  if (screenWidth >= 480) return screenWidth / 2 - 16;
  return screenWidth - 24;
};

/**
 * Get number of grid columns
 */
export const getGridColumns = () => {
  if (screenWidth >= 1024) return 4;
  if (screenWidth >= 768) return 3;
  if (screenWidth >= 480) return 2;
  return 1;
};

export const commonStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
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
  sectionHeader: {
    fontSize: typography.h5,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  // Button styles
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButtonText: {
    color: colors.textWhite,
    fontSize: typography.body,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '600',
  },
});
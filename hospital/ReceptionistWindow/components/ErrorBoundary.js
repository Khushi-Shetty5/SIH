import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { commonStyles } from '../../../theme/styles';
import logger from '../../../utils/logger';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error
    logger.errorBoundary(error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    logger.info('ERROR_BOUNDARY', 'User requested retry');
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.errorMessage}>
              We're sorry, but something unexpected happened. Please try again.
            </Text>
            
            {__DEV__ && this.state.error && (
              <View style={styles.debugContainer}>
                <Text style={styles.debugTitle}>Debug Information:</Text>
                <Text style={styles.debugText}>
                  {this.state.error.toString()}
                </Text>
                <Text style={styles.debugText}>
                  {this.state.errorInfo.componentStack}
                </Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={[commonStyles.primaryButton, styles.retryButton]} 
              onPress={this.handleRetry}
            >
              <Text style={commonStyles.primaryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
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
    maxWidth: 400,
  },
  errorTitle: {
    fontSize: typography.h5,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.body,
    marginBottom: 24,
  },
  debugContainer: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    width: '100%',
  },
  debugTitle: {
    fontSize: typography.caption,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  debugText: {
    fontSize: typography.small,
    color: colors.textSecondary,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  retryButton: {
    marginTop: 8,
  },
});

export default ErrorBoundary;

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { commonStyles } from '../../../theme/styles';
import { getEmergencyRequests } from '../services/patientService';
import EmergencyCard from '../components/EmergencyCard';
import SectionHeader from '../components/SectionHeader';
import logger from '../../../utils/logger';

const EmergencyRequestsScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isSmallScreen = width < 375;
  const [emergencies, setEmergencies] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    logger.info('SCREEN', 'EmergencyRequestsScreen mounted', { 
      screenWidth: width, 
      isTablet, 
      isSmallScreen 
    });
    loadEmergencies();
    
    return () => {
      logger.debug('SCREEN', 'EmergencyRequestsScreen unmounted');
    };
  }, []);

  const loadEmergencies = () => {
    logger.debug('SCREEN', 'Loading emergency requests');
    const startTime = Date.now();
    
    try {
      const emergencyList = getEmergencyRequests();
      setEmergencies(emergencyList);
      
      const loadTime = Date.now() - startTime;
      logger.performance('Emergency requests load', loadTime, {
        count: emergencyList.length
      });
      
      logger.info('SCREEN', 'Emergency requests loaded successfully', {
        count: emergencyList.length,
        highPriority: emergencyList.filter(e => e.severity === 'high').length
      });
    } catch (error) {
      logger.error('SCREEN', 'Failed to load emergency requests', { error: error.message });
      Alert.alert('Error', 'Failed to load emergency requests. Please try again.');
    }
  };

  const handleEmergencyPress = (emergency) => {
    logger.userAction('Emergency card pressed', 'EmergencyRequests', { 
      emergencyId: emergency.id, 
      patientName: emergency.patientName,
      severity: emergency.severity
    });
    navigation.navigate('PatientDetails', { 
      patientId: emergency.patientId,
      emergencyId: emergency.id 
    });
  };

  const handleFilterChange = (newFilter) => {
    logger.userAction('Filter changed', 'EmergencyRequests', { 
      oldFilter: filter, 
      newFilter 
    });
    setFilter(newFilter);
  };

  const getFilteredEmergencies = () => {
    if (filter === 'all') return emergencies;
    return emergencies.filter(emergency => emergency.severity === filter);
  };

  const getFilterButtonStyle = (filterType) => {
    return [
      styles.filterButton,
      filter === filterType ? styles.filterButtonActive : styles.filterButtonInactive
    ];
  };

  const getFilterTextStyle = (filterType) => {
    return [
      styles.filterButtonText,
      filter === filterType ? styles.filterButtonTextActive : styles.filterButtonTextInactive
    ];
  };

  const getSeverityCount = (severity) => {
    return emergencies.filter(emergency => emergency.severity === severity).length;
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Emergency Requests</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={getFilterButtonStyle('all')}
            onPress={() => handleFilterChange('all')}
          >
            <Text style={getFilterTextStyle('all')}>
              All ({emergencies.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={getFilterButtonStyle('high')}
            onPress={() => handleFilterChange('high')}
          >
            <Text style={getFilterTextStyle('high')}>
              High ({getSeverityCount('high')})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={getFilterButtonStyle('medium')}
            onPress={() => handleFilterChange('medium')}
          >
            <Text style={getFilterTextStyle('medium')}>
              Medium ({getSeverityCount('medium')})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={getFilterButtonStyle('low')}
            onPress={() => handleFilterChange('low')}
          >
            <Text style={getFilterTextStyle('low')}>
              Low ({getSeverityCount('low')})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Emergency List */}
        <ScrollView style={styles.emergencyList} showsVerticalScrollIndicator={false}>
          {getFilteredEmergencies().length > 0 ? (
            getFilteredEmergencies().map((emergency) => (
              <EmergencyCard
                key={emergency.id}
                emergency={emergency}
                onPress={() => handleEmergencyPress(emergency)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🚨</Text>
              <Text style={styles.emptyStateTitle}>No Emergency Requests</Text>
              <Text style={styles.emptyStateText}>
                {filter === 'all' 
                  ? 'No emergency requests at the moment'
                  : `No ${filter} severity emergency requests`
                }
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[commonStyles.primaryButton, styles.quickActionButton]}
            onPress={() => navigation.navigate('ScheduleConsultation')}
          >
            <Text style={commonStyles.primaryButtonText}>Schedule Consultation</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: typography.h5,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerRight: {
    width: 60,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonInactive: {
    backgroundColor: 'transparent',
  },
  filterButtonText: {
    fontSize: typography.caption,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: colors.textWhite,
  },
  filterButtonTextInactive: {
    color: colors.textSecondary,
  },
  emergencyList: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: typography.h5,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: typography.lineHeight.body,
  },
  quickActions: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  quickActionButton: {
    marginVertical: 0,
  },
});

export default EmergencyRequestsScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, useWindowDimensions, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { commonStyles, getCardWidth, getGridColumns } from '../../../theme/styles';
import { getResponsiveValue } from '../../../utils/responsive';
import { Icons } from '../components/Icon';
import logger from '../../../utils/logger';
import { getEmergencyRequests, startEmergencySimulation, resolveOldEmergencies } from '../services/patientService';
import { getDoctorStats } from '../services/doctorService';
import { getUpcomingAppointments } from '../services/appointmentService';
import EmergencyCard from '../components/EmergencyCard';
import QuickActionCard from '../components/QuickActionCard';
import SectionHeader from '../components/SectionHeader';

const DashboardScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isSmallScreen = width < 375;
  const [emergencies, setEmergencies] = useState([]);
  const [doctorStats, setDoctorStats] = useState({});
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    logger.info('SCREEN', 'DashboardScreen mounted', { 
      screenWidth: width, 
      isTablet, 
      isSmallScreen 
    });
    loadDashboardData();
    
    // Start emergency simulation for demo purposes
    startEmergencySimulation();
    
    // Set up periodic cleanup of old emergencies
    const cleanupInterval = setInterval(() => {
      resolveOldEmergencies();
    }, 60000); // Check every minute
    
    return () => {
      logger.debug('SCREEN', 'DashboardScreen unmounted');
      if (cleanupInterval) {
        clearInterval(cleanupInterval);
      }
    };
  }, []);

  const loadDashboardData = () => {
    logger.debug('SCREEN', 'Loading dashboard data');
    const startTime = Date.now();
    
    try {
      const emergencyList = getEmergencyRequests().slice(0, 3);
      const stats = getDoctorStats();
      
      // Enhanced mock appointments with more realistic data
      const mockAppointments = [
        {
          id: '1',
          patientId: '1',
          patientName: 'John Smith',
          doctorName: 'Dr. Sarah Johnson',
          date: new Date().toLocaleDateString(),
          time: '10:30 AM',
          type: 'video',
          status: 'confirmed',
          department: 'Cardiology'
        },
        {
          id: '2',
          patientId: '2',
          patientName: 'Maria Garcia',
          doctorName: 'Dr. Michael Chen',
          date: new Date().toLocaleDateString(),
          time: '2:15 PM',
          type: 'chat',
          status: 'confirmed',
          department: 'General Medicine'
        },
        {
          id: '3',
          patientId: '3',
          patientName: 'Robert Johnson',
          doctorName: 'Dr. Emily Williams',
          date: new Date(Date.now() + 86400000).toLocaleDateString(), // Tomorrow
          time: '9:00 AM',
          type: 'video',
          status: 'pending',
          department: 'Pediatrics'
        },
        {
          id: '4',
          patientId: '4',
          patientName: 'Lisa Anderson',
          doctorName: 'Dr. James Wilson',
          date: new Date(Date.now() + 86400000).toLocaleDateString(), // Tomorrow
          time: '11:45 AM',
          type: 'video',
          status: 'confirmed',
          department: 'Orthopedics'
        }
      ];
      
      setEmergencies(emergencyList);
      setDoctorStats(stats);
      setUpcomingAppointments(mockAppointments);
      
      // Simulate real-time emergency updates
      const emergencyUpdateInterval = setInterval(() => {
        const newEmergencyList = getEmergencyRequests().slice(0, 3);
        if (newEmergencyList.length !== emergencyList.length) {
          setEmergencies(newEmergencyList);
          logger.info('SCREEN', 'Emergency list updated', { count: newEmergencyList.length });
        }
      }, 30000); // Check every 30 seconds
      
      const loadTime = Date.now() - startTime;
      logger.performance('Dashboard data load', loadTime, {
        emergencyCount: emergencyList.length,
        doctorStats: stats,
        appointmentCount: mockAppointments.length
      });
      
      logger.info('SCREEN', 'Dashboard data loaded successfully', {
        emergencyCount: emergencyList.length,
        availableDoctors: stats.available,
        appointmentCount: mockAppointments.length
      });
      
      // Cleanup interval on component unmount
      return () => {
        if (emergencyUpdateInterval) {
          clearInterval(emergencyUpdateInterval);
        }
      };
    } catch (error) {
      logger.error('SCREEN', 'Failed to load dashboard data', { error: error.message });
      Alert.alert('Error', 'Failed to load dashboard data. Please try again.');
    }
  };

  const handleEmergencyPress = (emergency) => {
    logger.userAction('Emergency card pressed', 'Dashboard', { 
      emergencyId: emergency.id, 
      patientName: emergency.patientName,
      severity: emergency.severity
    });
    navigation.navigate('PatientDetails', { 
      patientId: emergency.patientId,
      emergencyId: emergency.id 
    });
  };

  const handleViewEmergencies = () => {
    logger.userAction('View emergencies pressed', 'Dashboard');
    navigation.navigate('Emergencies');
  };

  const handleViewDoctors = () => {
    logger.userAction('View doctors pressed', 'Dashboard');
    navigation.navigate('Doctors');
  };

  const handleViewAppointments = () => {
    logger.userAction('View appointments pressed', 'Dashboard');
    navigation.navigate('Appointments');
  };

  const handleScheduleConsultation = () => {
    logger.userAction('Schedule consultation pressed', 'Dashboard');
    navigation.navigate('ScheduleConsultation');
  };

  const handleJoinAppointment = (appointment) => {
    logger.userAction('Join appointment pressed', 'Dashboard', { 
      appointmentId: appointment.id,
      patientName: appointment.patientName,
      type: appointment.type
    });
    if (appointment.type === 'video') {
      navigation.navigate('VideoConsultation', {
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        appointmentId: appointment.id
      });
    } else {
      // Navigate to chat consultation
      console.log('Chat consultation not yet implemented');
    }
  };

  const handleRescheduleAppointment = (appointment) => {
    logger.userAction('Reschedule appointment pressed', 'Dashboard', { 
      appointmentId: appointment.id,
      patientName: appointment.patientName
    });
    navigation.navigate('ScheduleConsultation', {
      appointmentId: appointment.id,
      patientId: appointment.patientId,
      reschedule: true
    });
  };

  const getAvailabilityColor = (rate) => {
    if (rate >= 70) return colors.success;
    if (rate >= 40) return colors.warning;
    return colors.error;
  };

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <ScrollView    style={{ flex: 1, padding: 16 }}
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerIconContainer}>
              <Icons.hospital size={getResponsiveValue(24, 28, 32)} color={colors.textWhite} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Rural Hospital</Text>
              <Text style={styles.headerSubtitle}>Receptionist Dashboard</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <SectionHeader title="Quick Actions" />
          <View style={[styles.quickActionsGrid, { flexDirection: isTablet ? 'row' : 'column' }]}>
            <QuickActionCard
              title="View Emergencies"
              description="Manage emergency requests and assign doctors"
              icon={<Icons.emergency size={getResponsiveValue(20, 24, 28)} />}
              color={colors.emergencyHigh}
              onPress={handleViewEmergencies}
              style={isTablet ? styles.quickActionCardTablet : styles.quickActionCard}
            />
            <QuickActionCard
              title="Doctor Availability"
              description="Check doctor schedules and availability"
              icon={<Icons.doctors size={getResponsiveValue(20, 24, 28)} />}
              color={colors.primary}
              onPress={handleViewDoctors}
              style={isTablet ? styles.quickActionCardTablet : styles.quickActionCard}
            />
            <QuickActionCard
              title="Schedule Consultation"
              description="Book new patient consultations"
              icon={<Icons.appointments size={getResponsiveValue(20, 24, 28)} />}
              color={colors.secondary}
              onPress={handleScheduleConsultation}
              style={isTablet ? styles.quickActionCardTablet : styles.quickActionCard}
            />
          </View>
        </View>

        {/* Emergency Cases Overview */}
        <View style={styles.sectionContainer}>
          <SectionHeader
            title="Top Emergency Cases"
            actionText="View All"
            onActionPress={handleViewEmergencies}
          />
          {emergencies.length > 0 ? (
            <View style={[styles.emergenciesGrid, { flexDirection: isTablet ? 'row' : 'column' }]}>
              {emergencies.map((emergency) => (
                <View key={emergency.id} style={isTablet ? styles.emergencyCardTablet : styles.emergencyCard}>
                  <EmergencyCard
                    emergency={emergency}
                    onPress={() => handleEmergencyPress(emergency)}
                  />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Icons.info size={getResponsiveValue(32, 40, 48)} color={colors.textLight} />
              <Text style={styles.emptyStateText}>No emergency cases at the moment</Text>
            </View>
          )}
        </View>

        {/* Doctor Availability Summary */}
        <View style={styles.sectionContainer}>
          <SectionHeader
            title="Doctor Availability"
            actionText="View All"
            onActionPress={handleViewDoctors}
            icon={<Text>👨‍⚕️</Text>}
          />
          <View style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{doctorStats.available}</Text>
                <Text style={styles.statLabel}>Available</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{doctorStats.busy}</Text>
                <Text style={styles.statLabel}>Busy</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{doctorStats.unavailable}</Text>
                <Text style={styles.statLabel}>Unavailable</Text>
              </View>
            </View>
            <View style={styles.availabilityBar}>
              <View style={styles.availabilityBarBackground}>
                <View
                  style={[
                    styles.availabilityBarFill,
                    {
                      width: `${doctorStats.availabilityRate}%`,
                      backgroundColor: getAvailabilityColor(doctorStats.availabilityRate),
                    },
                  ]}
                />
              </View>
              <Text style={styles.availabilityText}>
                {doctorStats.availabilityRate}% Available
              </Text>
            </View>
          </View>
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.sectionContainer}>
          <SectionHeader
            title="Upcoming Appointments"
            actionText="View All"
            onActionPress={handleViewAppointments}
            icon={<Text>📅</Text>}
          />
          {upcomingAppointments.length > 0 ? (
            <View style={[styles.appointmentsGrid, { flexDirection: isTablet ? 'row' : 'column' }]}>
              {upcomingAppointments.map((appointment) => (
                <View 
                  key={appointment.id} 
                  style={[
                    styles.appointmentCard,
                    isTablet ? styles.appointmentCardTablet : styles.appointmentCardMobile
                  ]}
                >
                  <View style={styles.appointmentHeader}>
                    <Text style={styles.appointmentPatient}>{appointment.patientName}</Text>
                    <Text style={styles.appointmentTime}>
                      {appointment.date} at {appointment.time}
                    </Text>
                  </View>
                  <View style={styles.appointmentDetails}>
                    <Text style={styles.appointmentDoctor}>{appointment.doctorName}</Text>
                    <Text style={styles.appointmentType}>
                      {appointment.type === 'video' ? '📹 Video' : '💬 Chat'}
                    </Text>
                  </View>
                  <View style={styles.appointmentActions}>
                    <TouchableOpacity 
                      style={[styles.appointmentButton, styles.joinButton]}
                      onPress={() => handleJoinAppointment(appointment)}
                    >
                      <Text style={styles.joinButtonText}>Join</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.appointmentButton, styles.rescheduleButton]}
                      onPress={() => handleRescheduleAppointment(appointment)}
                    >
                      <Text style={styles.rescheduleButtonText}>Reschedule</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No upcoming appointments</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: getResponsiveValue(24, 32, 40),
    paddingHorizontal: getResponsiveValue(4, 8, 12),
  },
  header: {
    backgroundColor: colors.primary,
    padding: getResponsiveValue(16, 20, 24),
    marginHorizontal: getResponsiveValue(-12, -16, -24),
    marginTop: getResponsiveValue(-12, -16, -24),
    marginBottom: getResponsiveValue(20, 24, 32),
    borderBottomLeftRadius: getResponsiveValue(16, 20, 24),
    borderBottomRightRadius: getResponsiveValue(16, 20, 24),
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    marginRight: getResponsiveValue(12, 16, 20),
  },
  headerTitle: {
    fontSize: typography.h2,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: typography.body,
    color: colors.textWhite,
    opacity: 0.9,
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: getResponsiveValue(24, 32, 40),
    alignItems: 'center',
    marginVertical: getResponsiveValue(8, 12, 16),
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: typography.body,
    color: colors.textLight,
    fontStyle: 'italic',
    marginTop: getResponsiveValue(8, 12, 16),
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: getResponsiveValue(20, 24, 28),
    marginVertical: getResponsiveValue(8, 12, 16),
    borderWidth: 1,
    borderColor: colors.border,
    // Use boxShadow for better cross-platform compatibility
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.12)',
      },
    }),
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: typography.h3,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
  availabilityBar: {
    marginTop: 8,
  },
  availabilityBarBackground: {
    height: 8,
    backgroundColor: colors.divider,
    borderRadius: 4,
    overflow: 'hidden',
  },
  availabilityBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  availabilityText: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  appointmentsGrid: {
    flexWrap: 'wrap',
    gap: getResponsiveValue(8, 12, 16),
  },
  appointmentCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: getResponsiveValue(18, 22, 26),
    marginVertical: getResponsiveValue(8, 10, 12),
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
    // Use boxShadow for better cross-platform compatibility
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  appointmentCardMobile: {
    width: '100%',
    marginHorizontal: 0,
  },
  appointmentCardTablet: {
    width: '48%',
    marginHorizontal: '1%',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentPatient: {
    fontSize: typography.h6,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  appointmentTime: {
    fontSize: typography.caption,
    color: colors.textLight,
  },
  appointmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appointmentDoctor: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  appointmentType: {
    fontSize: typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: getResponsiveValue(12, 16, 20),
    paddingTop: getResponsiveValue(8, 12, 16),
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  appointmentButton: {
    flex: 1,
    paddingVertical: getResponsiveValue(8, 10, 12),
    paddingHorizontal: getResponsiveValue(12, 16, 20),
    borderRadius: getResponsiveValue(8, 10, 12),
    alignItems: 'center',
    marginHorizontal: getResponsiveValue(4, 6, 8),
  },
  joinButton: {
    backgroundColor: colors.primary,
  },
  rescheduleButton: {
    backgroundColor: colors.backgroundAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  joinButtonText: {
    color: colors.textWhite,
    fontSize: typography.caption,
    fontWeight: '600',
  },
  rescheduleButtonText: {
    color: colors.textPrimary,
    fontSize: typography.caption,
    fontWeight: '600',
  },
});

export default DashboardScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { commonStyles } from '../../../theme/styles';
import { getAppointments, updateAppointmentStatus } from '../services/appointmentService';
import SectionHeader from '../components/SectionHeader';

const AppointmentsScreen = ({ navigation }) => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = () => {
    const appointmentsData = getAppointments();
    setAppointments(appointmentsData);
  };

  const handleAppointmentPress = (appointment) => {
    Alert.alert(
      'Appointment Details',
      `Patient: ${appointment.patientName}
Doctor: ${appointment.doctorName}
Date: ${appointment.date}
Time: ${appointment.time}
Type: ${appointment.type}
Status: ${appointment.status}`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'Start Call', onPress: () => handleStartCall(appointment) }
      ]
    );
  };

  const handleStartCall = (appointment) => {
    navigation.navigate('VideoConsultation', {
      patientId: appointment.patientId,
      patientName: appointment.patientName
    });
  };

  const handleStatusChange = (appointmentId, newStatus) => {
    const success = updateAppointmentStatus(appointmentId, newStatus);
    if (success) {
      loadAppointments();
      Alert.alert('Success', 'Appointment status updated');
    } else {
      Alert.alert('Error', 'Failed to update appointment status');
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const getFilteredAppointments = () => {
    if (filter === 'all') return appointments;
    return appointments.filter(appointment => appointment.status === filter);
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

  const getStatusCount = (status) => {
    return appointments.filter(appointment => appointment.status === status).length;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return colors.info;
      case 'completed':
        return colors.success;
      case 'cancelled':
        return colors.error;
      default:
        return colors.textLight;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <Text>📹</Text>;
      case 'chat':
        return <Text>💬</Text>;
      case 'phone':
        return <Text>📞</Text>;
      default:
        return <Text>📅</Text>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
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
          <Text style={styles.headerTitle}>Appointments</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('ScheduleConsultation')}
          >
            <Text style={styles.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={getFilterButtonStyle('all')}
            onPress={() => handleFilterChange('all')}
          >
            <Text style={getFilterTextStyle('all')}>
              All ({appointments.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={getFilterButtonStyle('scheduled')}
            onPress={() => handleFilterChange('scheduled')}
          >
            <Text style={getFilterTextStyle('scheduled')}>
              Scheduled ({getStatusCount('scheduled')})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={getFilterButtonStyle('completed')}
            onPress={() => handleFilterChange('completed')}
          >
            <Text style={getFilterTextStyle('completed')}>
              Completed ({getStatusCount('completed')})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={getFilterButtonStyle('cancelled')}
            onPress={() => handleFilterChange('cancelled')}
          >
            <Text style={getFilterTextStyle('cancelled')}>
              Cancelled ({getStatusCount('cancelled')})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Appointments List */}
        <ScrollView style={styles.appointmentsList} showsVerticalScrollIndicator={false}>
          {getFilteredAppointments().length > 0 ? (
            getFilteredAppointments().map((appointment) => (
              <TouchableOpacity
                key={appointment.id}
                style={styles.appointmentCard}
                onPress={() => handleAppointmentPress(appointment)}
              >
                <View style={styles.appointmentHeader}>
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.patientName}>{appointment.patientName}</Text>
                    <Text style={styles.doctorName}>{appointment.doctorName}</Text>
                    <Text style={styles.department}>{appointment.department}</Text>
                  </View>
                  <View style={styles.appointmentMeta}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
                      <Text style={styles.statusText}>{appointment.status.toUpperCase()}</Text>
                    </View>
                    <Text style={styles.typeIcon}>{getTypeIcon(appointment.type)}</Text>
                  </View>
                </View>
                
                <View style={styles.appointmentDetails}>
                  <View style={styles.timeInfo}>
                    <Text style={styles.dateText}>{formatDate(appointment.date)}</Text>
                    <Text style={styles.timeText}>{formatTime(appointment.time)}</Text>
                  </View>
                  <Text style={styles.typeText}>
                    {appointment.type === 'video' ? 'Video Call' : 
                     appointment.type === 'chat' ? 'Chat' : 'Phone Call'}
                  </Text>
                </View>

                {appointment.notes && (
                  <Text style={styles.notes} numberOfLines={2}>
                    {appointment.notes}
                  </Text>
                )}

                <View style={styles.appointmentActions}>
                  {appointment.status === 'scheduled' && (
                    <>
                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: colors.success }]}
                        onPress={() => handleStatusChange(appointment.id, 'completed')}
                      >
                        <Text style={styles.actionButtonText}>Complete</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: colors.error }]}
                        onPress={() => handleStatusChange(appointment.id, 'cancelled')}
                      >
                        <Text style={styles.actionButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: colors.primary }]}
                    onPress={() => handleStartCall(appointment)}
                  >
                    <Text style={styles.actionButtonText}>Start Call</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📅</Text>
              <Text style={styles.emptyStateTitle}>No Appointments</Text>
              <Text style={styles.emptyStateText}>
                {filter === 'all' 
                  ? 'No appointments scheduled'
                  : `No ${filter} appointments found`
                }
              </Text>
              <TouchableOpacity
                style={[commonStyles.primaryButton, styles.scheduleButton]}
                onPress={() => navigation.navigate('ScheduleConsultation')}
              >
                <Text style={commonStyles.primaryButtonText}>Schedule New Appointment</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
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
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: typography.body,
    color: colors.textWhite,
    fontWeight: '600',
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
    paddingHorizontal: 8,
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
    textAlign: 'center',
  },
  filterButtonTextActive: {
    color: colors.textWhite,
  },
  filterButtonTextInactive: {
    color: colors.textSecondary,
  },
  appointmentsList: {
    flex: 1,
  },
  appointmentCard: {
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
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: typography.h6,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  doctorName: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  department: {
    fontSize: typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  appointmentMeta: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: typography.caption,
    color: colors.textWhite,
    fontWeight: 'bold',
  },
  typeIcon: {
    fontSize: 20,
  },
  appointmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
    marginRight: 8,
  },
  timeText: {
    fontSize: typography.body,
    color: colors.textSecondary,
  },
  typeText: {
    fontSize: typography.caption,
    color: colors.textLight,
  },
  notes: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
    marginBottom: 4,
  },
  actionButtonText: {
    fontSize: typography.caption,
    color: colors.textWhite,
    fontWeight: '600',
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
    marginBottom: 24,
  },
  scheduleButton: {
    marginVertical: 0,
  },
});

export default AppointmentsScreen;

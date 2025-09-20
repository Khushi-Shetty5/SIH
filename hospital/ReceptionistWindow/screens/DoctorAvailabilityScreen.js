import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { commonStyles } from '../../../theme/styles';
import { getDoctorsByDepartment, getDoctorStats, updateDoctorAvailability } from '../services/doctorService';
import DoctorCard from '../components/DoctorCard';
import SectionHeader from '../components/SectionHeader';

const DoctorAvailabilityScreen = ({ navigation }) => {
  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = () => {
    const doctorsData = getDoctorsByDepartment();
    const statsData = getDoctorStats();
    setDoctors(doctorsData);
    setStats(statsData);
  };

  const handleDoctorPress = (doctor) => {
    Alert.alert(
      'Doctor Details',
      `Name: ${doctor.name}
Department: ${doctor.department}
Specialization: ${doctor.specialization}
Phone: ${doctor.phone}
Email: ${doctor.email}`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'Call', onPress: () => Alert.alert('Call', `Calling ${doctor.phone}`) }
      ]
    );
  };

  const handleAvailabilityChange = (doctorId, newAvailability) => {
    const success = updateDoctorAvailability(doctorId, newAvailability);
    if (success) {
      loadDoctors(); // Reload to reflect changes
      Alert.alert('Success', 'Doctor availability updated');
    } else {
      Alert.alert('Error', 'Failed to update doctor availability');
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const getFilteredDoctors = () => {
    if (filter === 'all') return doctors;
    return doctors.filter(doctor => doctor.availability === filter);
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

  const getAvailabilityCount = (availability) => {
    return doctors.filter(doctor => doctor.availability === availability).length;
  };

  const getDepartments = () => {
    const departments = [...new Set(doctors.map(doctor => doctor.department))];
    return departments;
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
          <Text style={styles.headerTitle}>Doctor Availability</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.available }]}>
                  {stats.available}
                </Text>
                <Text style={styles.statLabel}>Available</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.busy }]}>
                  {stats.busy}
                </Text>
                <Text style={styles.statLabel}>Busy</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.unavailable }]}>
                  {stats.unavailable}
                </Text>
                <Text style={styles.statLabel}>Unavailable</Text>
              </View>
            </View>
            <View style={styles.availabilityBar}>
              <View style={styles.availabilityBarBackground}>
                <View
                  style={[
                    styles.availabilityBarFill,
                    {
                      width: `${stats.availabilityRate}%`,
                      backgroundColor: stats.availabilityRate >= 70 ? colors.available : 
                                     stats.availabilityRate >= 40 ? colors.warning : colors.error,
                    },
                  ]}
                />
              </View>
              <Text style={styles.availabilityText}>
                {stats.availabilityRate}% Available
              </Text>
            </View>
          </View>
        </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={getFilterButtonStyle('all')}
            onPress={() => handleFilterChange('all')}
          >
            <Text style={getFilterTextStyle('all')}>
              All ({doctors.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={getFilterButtonStyle('available')}
            onPress={() => handleFilterChange('available')}
          >
            <Text style={getFilterTextStyle('available')}>
              Available ({getAvailabilityCount('available')})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={getFilterButtonStyle('busy')}
            onPress={() => handleFilterChange('busy')}
          >
            <Text style={getFilterTextStyle('busy')}>
              Busy ({getAvailabilityCount('busy')})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={getFilterButtonStyle('unavailable')}
            onPress={() => handleFilterChange('unavailable')}
          >
            <Text style={getFilterTextStyle('unavailable')}>
              Unavailable ({getAvailabilityCount('unavailable')})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Department Sections */}
        <ScrollView style={styles.doctorsList} showsVerticalScrollIndicator={false}>
          {getDepartments().map((department) => {
            const departmentDoctors = getFilteredDoctors().filter(
              doctor => doctor.department === department
            );
            
            if (departmentDoctors.length === 0) return null;
            
            return (
              <View key={department} style={styles.departmentSection}>
                <SectionHeader 
                  title={department} 
                  icon="🏥"
                  showAction={false}
                />
                {departmentDoctors.map((doctor) => (
                  <View key={doctor.id} style={styles.doctorCardContainer}>
                    <DoctorCard
                      doctor={doctor}
                      onPress={() => handleDoctorPress(doctor)}
                    />
                    <View style={styles.availabilityActions}>
                      <TouchableOpacity
                        style={[
                          styles.availabilityButton,
                          { backgroundColor: colors.available }
                        ]}
                        onPress={() => handleAvailabilityChange(doctor.id, 'available')}
                      >
                        <Text style={styles.availabilityButtonText}>Available</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.availabilityButton,
                          { backgroundColor: colors.busy }
                        ]}
                        onPress={() => handleAvailabilityChange(doctor.id, 'busy')}
                      >
                        <Text style={styles.availabilityButtonText}>Busy</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.availabilityButton,
                          { backgroundColor: colors.unavailable }
                        ]}
                        onPress={() => handleAvailabilityChange(doctor.id, 'unavailable')}
                      >
                        <Text style={styles.availabilityButtonText}>Unavailable</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            );
          })}
          
          {getFilteredDoctors().length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>👨‍⚕️</Text>
              <Text style={styles.emptyStateTitle}>No Doctors Found</Text>
              <Text style={styles.emptyStateText}>
                {filter === 'all' 
                  ? 'No doctors available'
                  : `No ${filter} doctors found`
                }
              </Text>
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
  headerRight: {
    width: 60,
  },
  statsContainer: {
    marginBottom: 20,
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
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
  doctorsList: {
    flex: 1,
  },
  departmentSection: {
    marginBottom: 24,
  },
  doctorCardContainer: {
    marginBottom: 16,
  },
  availabilityActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  availabilityButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  availabilityButtonText: {
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
  },
});

export default DoctorAvailabilityScreen;

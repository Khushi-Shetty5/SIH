// screens/AdminDashboardScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { commonStyles } from '../../../theme/styles';
import AdminCard from '../components/AdminCard';
import SectionHeaderAdmin from '../components/SectionHeaderAdmin';

const AdminDashboardScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    patients: 1247,
    doctors: 48,
    staff: 163,
    appointments: 87,
  });
  const [recentActivity, setRecentActivity] = useState([
    { id: '1', action: 'New patient registered', time: '5 mins ago', type: 'patient' },
    { id: '2', action: 'Doctor updated availability', time: '12 mins ago', type: 'doctor' },
    { id: '3', action: 'Staff member clocked in', time: '25 mins ago', type: 'staff' },
  ]);
  const [systemHealth, setSystemHealth] = useState({
    serverStatus: 'operational',
    databaseStatus: 'operational',
    backupStatus: 'completed',
    lastUpdate: '2 hours ago',
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const navigateToSection = (section) => {
    console.log('Navigating to:', section);
    switch (section) {
      case 'Patients':
        navigation.navigate('Patients');
        break;
      case 'Doctors':
        navigation.navigate('Doctors');
        break;
      case 'Staff':
        navigation.navigate('StaffList');
        break;
      case 'Appointments':
        // navigation.navigate('Appointments'); // Uncomment when implemented
        console.log('Appointments screen not yet implemented');
        break;
      case 'AuditLog':
        navigation.navigate('AuditLog');
        break;
      default:
        console.log('Unknown section:', section);
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.header}>Hospital Admin Dashboard</Text>
      
        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <AdminCard
            title="Patients"
            value={stats.patients}
            color={colors.primary}
            icon={<Text>👥</Text>}
            onPress={() => navigateToSection('Patients')}
          />
          <AdminCard
            title="Doctors"
            value={stats.doctors}
            color={colors.success}
            icon={<Text>👨‍⚕️</Text>}
            onPress={() => navigateToSection('Doctors')}
          />
          <AdminCard
            title="Staff"
            value={stats.staff}
            color={colors.accent}
            icon={<Text>👩‍💼</Text>}
            onPress={() => navigateToSection('Staff')}
          />
          <AdminCard
            title="Appointments"
            value={stats.appointments}
            color={colors.warning}
            icon={<Text>📅</Text>}
            onPress={() => navigateToSection('Appointments')}
          />
        </View>

        {/* Quick Actions Section */}
        <SectionHeaderAdmin title="Quick Actions" />
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigateToSection('Patients')}
          >
            <Text style={styles.quickActionIcon}>👥</Text>
            <Text style={styles.quickActionText}>Manage Patients</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigateToSection('Doctors')}
          >
            <Text style={styles.quickActionIcon}>👨‍⚕️</Text>
            <Text style={styles.quickActionText}>Manage Doctors</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigateToSection('Staff')}
          >
            <Text style={styles.quickActionIcon}>👩‍💼</Text>
            <Text style={styles.quickActionText}>Manage Staff</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => navigateToSection('AuditLog')}
          >
            <Text style={styles.quickActionIcon}>📋</Text>
            <Text style={styles.quickActionText}>Audit Log</Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Section */}
        <SectionHeaderAdmin title="Recent Emergency Requests" />
        <View style={styles.emergencyContainer}>
          <Text style={styles.placeholderText}>No emergency requests at this time</Text>
        </View>

        {/* Doctor Availability Section */}
        <SectionHeaderAdmin title="Doctor Availability" />
        <View style={styles.availabilityContainer}>
          <View style={styles.availabilityItem}>
            <Text style={styles.availabilityLabel}>Available</Text>
            <Text style={[styles.availabilityCount, { color: colors.success }]}>12</Text>
          </View>
          <View style={styles.availabilityItem}>
            <Text style={styles.availabilityLabel}>Busy</Text>
            <Text style={[styles.availabilityCount, { color: colors.warning }]}>8</Text>
          </View>
          <View style={styles.availabilityItem}>
            <Text style={styles.availabilityLabel}>Unavailable</Text>
            <Text style={[styles.availabilityCount, { color: colors.error }]}>3</Text>
          </View>
        </View>

        {/* Recent Activity Section */}
        <SectionHeaderAdmin title="Recent Activity" />
        <View style={styles.activityContainer}>
          {recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Text style={styles.activityIcon}>
                  {activity.type === 'patient' ? '👤' : 
                   activity.type === 'doctor' ? '👨‍⚕️' : '👩‍💼'}
                </Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityAction}>{activity.action}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* System Health Section */}
        <SectionHeaderAdmin title="System Status" />
        <View style={styles.systemHealthContainer}>
          <View style={styles.healthItem}>
            <Text style={styles.healthLabel}>Server</Text>
            <View style={[styles.healthStatus, { backgroundColor: colors.success }]}>
              <Text style={styles.healthStatusText}>Operational</Text>
            </View>
          </View>
          <View style={styles.healthItem}>
            <Text style={styles.healthLabel}>Database</Text>
            <View style={[styles.healthStatus, { backgroundColor: colors.success }]}>
              <Text style={styles.healthStatusText}>Operational</Text>
            </View>
          </View>
          <View style={styles.healthItem}>
            <Text style={styles.healthLabel}>Backup</Text>
            <View style={[styles.healthStatus, { backgroundColor: colors.primary }]}>
              <Text style={styles.healthStatusText}>Completed</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    fontSize: typography.h3,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: typography.body,
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: '600',
  },
  emergencyContainer: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeholderText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  availabilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  availabilityItem: {
    alignItems: 'center',
  },
  availabilityLabel: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  availabilityCount: {
    fontSize: typography.h4,
    fontWeight: 'bold',
  },
  activityContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIcon: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: typography.caption,
    color: colors.textSecondary,
  },
  systemHealthContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  healthItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  healthLabel: {
    fontSize: typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  healthStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  healthStatusText: {
    fontSize: typography.caption,
    color: colors.textWhite,
    fontWeight: '600',
  },
});

export default AdminDashboardScreen;
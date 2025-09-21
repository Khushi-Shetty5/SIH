// screens/AuditLogScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { commonStyles } from '../../../theme/styles';
import SectionHeaderAdmin from '../components/SectionHeaderAdmin';
import AdminFormField from '../components/AdminFormField';

const AuditLogScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('All');
  const [selectedAction, setSelectedAction] = useState('All');
  const [auditLogs, setAuditLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [searchQuery, selectedEntity, selectedAction, auditLogs]);

  const loadAuditLogs = () => {
    // Mock audit log data
    const mockLogs = [
      {
        id: '1',
        timestamp: '2023-06-15 14:30:25',
        user: 'admin@hospital.com',
        entity: 'Patient',
        entityId: '123',
        action: 'CREATE',
        details: 'Created new patient record for John Doe',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      {
        id: '2',
        timestamp: '2023-06-15 13:45:12',
        user: 'doctor.chen@hospital.com',
        entity: 'Appointment',
        entityId: '456',
        action: 'UPDATE',
        details: 'Updated appointment status to Completed',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
      },
      {
        id: '3',
        timestamp: '2023-06-15 12:20:38',
        user: 'admin@hospital.com',
        entity: 'Doctor',
        entityId: '789',
        action: 'DELETE',
        details: 'Deleted doctor record for Dr. Smith',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      {
        id: '4',
        timestamp: '2023-06-15 11:15:42',
        user: 'nurse.jones@hospital.com',
        entity: 'Patient',
        entityId: '123',
        action: 'VIEW',
        details: 'Viewed patient medical records',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    ];
    setAuditLogs(mockLogs);
  };

  const filterLogs = () => {
    let filtered = auditLogs;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.user.toLowerCase().includes(query) ||
          log.entity.toLowerCase().includes(query) ||
          log.details.toLowerCase().includes(query) ||
          log.entityId.toLowerCase().includes(query)
      );
    }

    if (selectedEntity !== 'All') {
      filtered = filtered.filter((log) => log.entity === selectedEntity);
    }

    if (selectedAction !== 'All') {
      filtered = filtered.filter((log) => log.action === selectedAction);
    }

    setFilteredLogs(filtered);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadAuditLogs();
      setRefreshing(false);
    }, 2000);
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE': return colors.success;
      case 'UPDATE': return colors.warning;
      case 'DELETE': return colors.error;
      case 'VIEW': return colors.primary;
      default: return colors.textLight;
    }
  };

  const renderLogItem = ({ item }) => {
    const actionColor = getActionColor(item.action);
    
    return (
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontWeight: 'bold', color: colors.primary }}>{item.user}</Text>
          <Text style={{ color: colors.textLight }}>{item.timestamp}</Text>
        </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <View style={{
            backgroundColor: actionColor,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
            marginRight: 8,
          }}>
            <Text style={{ color: 'white', fontSize: typography.caption, fontWeight: 'bold' }}>
              {item.action}
            </Text>
          </View>
          <Text style={{ fontWeight: '600' }}>{item.entity}</Text>
          <Text style={{ color: colors.textLight, marginLeft: 4 }}>(ID: {item.entityId})</Text>
        </View>
        
        <Text style={{ marginBottom: 8 }}>{item.details}</Text>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: typography.caption, color: colors.textLight }}>
            IP: {item.ipAddress}
          </Text>
          <Text style={{ fontSize: typography.caption, color: colors.textLight }}>
            Device: {item.userAgent.split('(')[1]?.split(')')[0] || 'Unknown'}
          </Text>
        </View>
      </View>
    );
  };

  const entities = ['All', 'Patient', 'Doctor', 'Staff', 'Appointment'];
  const actions = ['All', 'CREATE', 'UPDATE', 'DELETE', 'VIEW'];

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.container}>
        <SectionHeaderAdmin title="Audit Log" />
        
        <AdminFormField
          placeholder="Search audit logs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon="search"
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <View style={{ width: '48%' }}>
            <Text style={styles.label}>Entity Type:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {entities.map((entity) => (
                <TouchableOpacity
                  key={entity}
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                    backgroundColor: selectedEntity === entity ? colors.primary : colors.border,
                    marginRight: 4,
                    marginBottom: 4,
                  }}
                  onPress={() => setSelectedEntity(entity)}
                >
                  <Text style={{
                    color: selectedEntity === entity ? 'white' : colors.textSecondary,
                    fontSize: typography.caption,
                  }}>
                    {entity}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={{ width: '48%' }}>
            <Text style={styles.label}>Action Type:</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {actions.map((action) => (
                <TouchableOpacity
                  key={action}
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                    backgroundColor: selectedAction === action ? colors.primary : colors.border,
                    marginRight: 4,
                    marginBottom: 4,
                  }}
                  onPress={() => setSelectedAction(action)}
                >
                  <Text style={{
                    color: selectedAction === action ? 'white' : colors.textSecondary,
                    fontSize: typography.caption,
                  }}>
                    {action}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <FlatList
          data={filteredLogs}
          renderItem={renderLogItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text>No audit logs found</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
});

export default AuditLogScreen;
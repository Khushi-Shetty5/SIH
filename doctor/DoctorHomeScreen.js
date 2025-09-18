import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, FlatList } from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useDoctor } from "../context/DoctorContext";

export default function DoctorHomeScreen({ navigation }) {
  const { doctorData, emergencies,notifications } = useDoctor();
  
  React.useEffect(() => {
    navigation.setOptions({
      title: "MedKit",
      headerTitleAlign: "left",
      headerStyle: { backgroundColor: "#ffffff" },
      headerTintColor: "#2E86C1",
      headerTitleStyle: { color: "#2E86C1", fontWeight: "800" },
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity style={{ padding: 6 }} onPress={() => navigation.navigate("DoctorProfile")}>
            <FontAwesome5 name="user-md" size={22} color="#2E86C1" />
          </TouchableOpacity>

          <TouchableOpacity style={{ padding: 6, marginLeft: 12 }} onPress={() => navigation.navigate("Notifications")}>
            {/* <Ionicons name="notifications" size={24} color="#2E86C1" /> */}
            {notifications.length > 0 && (
              <View style={{
                position: "absolute",
                top: -2,
                right: -2,
                backgroundColor: "#dc3545",
                borderRadius: 8,
                width: 16,
                height: 16,
                justifyContent: "center",
                alignItems: "center",
              }}>
                <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>{notifications.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, notifications]);

  const buttons = [
    { key: "Emergency", label: "Emergencies", icon: <MaterialIcons name="warning" size={22} color="#2E86C1" />, route: "Emergency" },
    { key: "Patients", label: "Patients", icon: <Ionicons name="people" size={22} color="#2E86C1" />, route: "PatientList" },
    { key: "LabReports", label: "Lab Reports", icon: <MaterialIcons name="science" size={22} color="#2E86C1" />, route: "LabReports" },
    { key: "Medicines", label: "Medicines", icon: <FontAwesome5 name="pills" size={22} color="#2E86C1" />, route: "Medicines" },
    { key: "VideoCall", label: "Video Call", icon: <Ionicons name="videocam" size={22} color="#2E86C1" />, route: "VideoCall" },
    { key: "Calendar", label: "Calendar", icon: <Ionicons name="calendar" size={22} color="#2E86C1" />, route: "Calendar" },
  ];

  // Filter high priority emergencies
  const highPriorityEmergencies = React.useMemo(() => {
    return emergencies.filter(emergency => {
      const priority = (emergency.priority || '').toLowerCase();
      return priority === 'high' || priority === 'critical';
    });
  }, [emergencies]);

  // Get time ago string
  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown time';
    
    const date = new Date(dateString);
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const renderHighEmergencyItem = ({ item }) => {
    const patientName = item.patientName || item.patient?.name || 'Unknown Patient';
    const emergencyTitle = item.title || item.reason || item.type || 'Emergency Case';
    const timeReported = item.timeReported || item.createdAt || item.timestamp;
    const priority = (item.priority || 'Unknown').toUpperCase();
    const description = item.description || item.details || 'No description available';
    
    const getPriorityColor = (priority) => {
      const p = priority.toLowerCase();
      switch (p) {
        case 'critical':
          return '#FF0000';
        case 'high':
          return '#FF6B35';
        default:
          return '#FF6B35';
      }
    };
    
    return (
      <TouchableOpacity 
        style={styles.emergencyCard}
        onPress={() => navigation.navigate('Emergency')}
      >
        <View style={styles.emergencyCardHeader}>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(priority) }]}>
            <Text style={styles.priorityText}>{priority}</Text>
          </View>
          <Text style={styles.emergencyTimeText}>{getTimeAgo(timeReported)}</Text>
        </View>
        
        <Text style={styles.emergencyCardTitle} numberOfLines={1}>{emergencyTitle}</Text>
        <Text style={styles.emergencyCardDescription} numberOfLines={2}>{description}</Text>
        
        <View style={styles.emergencyCardFooter}>
          <View style={styles.patientInfo}>
            <MaterialIcons name="person" size={16} color="#666" />
            <Text style={styles.patientNameText}>{patientName}</Text>
          </View>
          {!item.acknowledged && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>URGENT</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.alertsRow}>
        {doctorData?.emergencies && doctorData.emergencies.length > 0 && (
          <View style={styles.alertCard}>
            <Ionicons name="warning" size={18} color="#dc3545" />
            <Text style={styles.alertText}> Emergencies: {doctorData.emergencies.length}</Text>
          </View>
        )}
      </View>

      {/* Grid Buttons */}
      <View style={styles.grid}>
        {buttons.map(b => (
          <TouchableOpacity
            key={b.key}
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => {
              if (!b.route) return;
              if (b.key === "VideoCall") {
                const roomId = `MedKitRoom-${Date.now()}`;
                navigation.navigate(b.route, { roomId });
              } else {
                navigation.navigate(b.route);
              }
            }}
          >
            <View style={styles.iconCircle}>
              {b.icon}
              {b.count > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{b.count}</Text>
                </View>
              )}
            </View>
            <Text style={styles.cardLabel}>{b.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* High Priority Emergencies Section */}
      {highPriorityEmergencies.length > 0 && (
        <View style={styles.emergenciesSection}>
          <View style={styles.emergenciesHeader}>
            <Text style={styles.emergenciesTitle}>High Priority Emergencies</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Emergency')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={highPriorityEmergencies.slice(0, 3)}
            keyExtractor={(item) => item._id || item.id || Math.random().toString()}
            renderItem={renderHighEmergencyItem}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </ScrollView>
  );
}

const { width } = Dimensions.get("window");
const CONTAINER_PADDING = 16;
// Force exactly 2 items per row - calculate precise width
const totalWidth = width - (CONTAINER_PADDING * 2); // Available width after container padding
const gapBetweenItems = 10; // Fixed gap between the 2 items
const itemWidth = (totalWidth - gapBetweenItems) / 2; // Exact width for 2 items

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 16 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: '100%',
  },
  card: {
    backgroundColor: "#fff",
    width: itemWidth,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 6,
    marginBottom: 12,
    alignItems: "center",
    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.08)",
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e6eef7",
    // Absolutely ensure 2 per row
    maxWidth: itemWidth,
    minWidth: itemWidth,
  },
  iconCircle: {
    width: 44, // Reduced from 56
    height: 44, // Reduced from 56
    borderRadius: 22, // Reduced from 28
    backgroundColor: "#e8f1f9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8, // Reduced from 10
  },
  cardLabel: { 
    color: "#2E4053", 
    fontWeight: "700", 
    fontSize: 12, // Reduced font size
    textAlign: "center",
  },
  alertsRow: { flexDirection: "row", marginBottom: 12 },
  alertCard: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#fff", 
    paddingHorizontal: 10, 
    paddingVertical: 8, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: "#e6eef7", 
    marginRight: 8, 
    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.05)",
    elevation: 1 
  },
  alertText: { marginLeft: 6, color: "#2E4053", fontWeight: "700", fontSize: 12 },
  
  // High Priority Emergencies Styles
  emergenciesSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  emergenciesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  emergenciesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E4053',
  },
  viewAllText: {
    fontSize: 14,
    color: '#2E86C1',
    fontWeight: '600',
  },
  emergencyCard: {
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e6eef7',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  emergencyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  emergencyTimeText: {
    fontSize: 12,
    color: '#666',
  },
  emergencyCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E4053',
    marginBottom: 8,
  },
  emergencyCardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  emergencyCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  patientNameText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  urgentBadge: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  urgentText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
});
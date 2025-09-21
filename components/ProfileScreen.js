import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { MaterialIcons, Ionicons, AntDesign } from "@expo/vector-icons";

export default function ProfileScreen({ navigation, route }) {
  // Get user data from route parameters
  const { userData } = route.params || {};
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: "",
    email: "",
    role: ""
  });

  // Initialize edited profile with current data
  useEffect(() => {
    if (userData) {
      setEditedProfile({
        name: userData.name || "",
        email: userData.email || "",
        role: userData.role || ""
      });
    }
  }, [userData]);

  const handleSave = () => {
    // In a real app, this would make an API call to update the profile
    Alert.alert(
      "Profile Updated",
      "Your profile information has been updated successfully!",
      [{ text: "OK" }]
    );
    setIsEditing(false);
  };

  const StatCard = ({ title, value, icon, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        {icon}
      </View>
      <View style={styles.statTextContainer}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
  );

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialIcons name="hourglass-empty" size={48} color="#6c757d" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // Role-specific display names
  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'receptionist':
        return 'Receptionist';
      case 'doctor':
        return 'Doctor';
      case 'lab':
        return 'Lab Doctor';
      default:
        return role;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <MaterialIcons name="person" size={48} color="#2E86C1" />
        </View>
        
        {isEditing ? (
          <>
            <TextInput
              style={styles.editInput}
              value={editedProfile.name}
              onChangeText={(text) => setEditedProfile({...editedProfile, name: text})}
              placeholder="Full Name"
            />
            <TextInput
              style={styles.editInput}
              value={editedProfile.email}
              onChangeText={(text) => setEditedProfile({...editedProfile, email: text})}
              placeholder="Email"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.editInput}
              value={editedProfile.role}
              onChangeText={(text) => setEditedProfile({...editedProfile, role: text})}
              placeholder="Role"
            />
            <View style={styles.editActions}>
              <TouchableOpacity style={[styles.editButton, styles.cancelButton]} onPress={() => setIsEditing(false)}>
                <Text style={styles.editButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.editButton, styles.saveButton]} onPress={handleSave}>
                <Text style={styles.editButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.name}>{userData.name || "User"}</Text>
            <Text style={styles.role}>{getRoleDisplayName(userData.role) || "Staff Member"}</Text>
            <Text style={styles.email}>{userData.email || "Not provided"}</Text>
            <TouchableOpacity style={styles.editProfileButton} onPress={() => setIsEditing(true)}>
              <MaterialIcons name="edit" size={16} color="#2E86C1" />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.statsContainer}>
        <StatCard 
          title="User ID" 
          value={userData.id ? userData.id.slice(-8) : "Not available"} 
          icon={<Ionicons name="person" size={24} color="#2E86C1" />} 
          color="#2E86C1" 
        />
        <StatCard 
          title="Role" 
          value={getRoleDisplayName(userData.role) || "Not specified"} 
          icon={<MaterialIcons name="work" size={24} color="#28A745" />} 
          color="#28A745" 
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Account Information</Text>
        </View>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialIcons name="badge" size={20} color="#6c757d" />
            <Text style={styles.infoLabel}>User ID</Text>
            <Text style={styles.infoValue}>{userData.id || "Not available"}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="work" size={20} color="#6c757d" />
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={styles.infoValue}>{getRoleDisplayName(userData.role) || "Not specified"}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="email" size={20} color="#6c757d" />
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{userData.email || "Not provided"}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialIcons name="access-time" size={20} color="#6c757d" />
            <Text style={styles.infoLabel}>Member Since</Text>
            <Text style={styles.infoValue}>
              {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "Not available"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>System</Text>
        </View>
        
        <TouchableOpacity style={styles.menuItem}>
          <AntDesign name="setting" size={20} color="#2E86C1" />
          <Text style={styles.menuText}>Settings</Text>
          <MaterialIcons name="chevron-right" size={20} color="#6c757d" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <MaterialIcons name="help-outline" size={20} color="#2E86C1" />
          <Text style={styles.menuText}>Help & Support</Text>
          <MaterialIcons name="chevron-right" size={20} color="#6c757d" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Login')}>
          <MaterialIcons name="logout" size={20} color="#e74c3c" />
          <Text style={[styles.menuText, { color: '#e74c3c' }]}>Logout</Text>
          <MaterialIcons name="chevron-right" size={20} color="#6c757d" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6c757d",
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e8f1f9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E4053",
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: "#2E86C1",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 16,
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2E86C1",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editProfileText: {
    color: "#2E86C1",
    marginLeft: 6,
    fontWeight: "600",
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    width: "80%",
    fontSize: 16,
  },
  editActions: {
    flexDirection: "row",
    marginTop: 10,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
  },
  saveButton: {
    backgroundColor: "#2E86C1",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  statTextContainer: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E4053",
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: "#6c757d",
    textAlign: "center",
  },
  section: {
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  sectionHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E4053",
  },
  infoCard: {
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  infoLabel: {
    flex: 1,
    fontSize: 16,
    color: "#6c757d",
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 16,
    color: "#2E4053",
    fontWeight: "500",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#2E4053",
    marginLeft: 12,
  },
});
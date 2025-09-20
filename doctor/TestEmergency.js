import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useDoctor } from "../context/DoctorContext";
import { MaterialIcons } from "@expo/vector-icons";

export default function TestEmergency({ navigation }) {
  const { addEmergency, patients } = useDoctor();
  
  const testAddEmergency = async () => {
    // Check if we have patients to test with
    if (patients.length === 0) {
      Alert.alert("No Patients", "Please add some patients before testing");
      return;
    }
    
    // Use the first patient for testing
    const patientId = patients[0]._id || patients[0].id;
    
    try {
      const result = await addEmergency({
        doctorId: "68cb7fd9a0b6194b8ede0320",
        patientId: patientId,
        title: "Test Emergency Case",
        details: "This is a test emergency case for verification purposes",
        priority: "medium"
      });
      
      if (result.success) {
        Alert.alert("Success", "Emergency case added successfully!");
      } else {
        Alert.alert("Error", result.error || "Failed to add emergency case");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
      console.error("Test error:", error);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="warning" size={32} color="#FF4757" />
        <Text style={styles.title}>Test Emergency Functionality</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.description}>
          This screen is for testing the addEmergency function in DoctorContext.
        </Text>
        
        <TouchableOpacity style={styles.testButton} onPress={testAddEmergency}>
          <MaterialIcons name="play-arrow" size={20} color="#fff" />
          <Text style={styles.testButtonText}>Test Add Emergency</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigation.navigate("AddEmergency")}
        >
          <MaterialIcons name="add" size={20} color="#2E86C1" />
          <Text style={styles.navButtonText}>Go to Add Emergency Screen</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E4053',
    marginLeft: 10,
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#2E4053',
    marginBottom: 30,
    lineHeight: 24,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4757',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f1f9',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#cfe3f5',
  },
  navButtonText: {
    color: '#2E86C1',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});
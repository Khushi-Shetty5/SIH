import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

function RoleSelectionScreen({ onSelectRole }) {
  return (
    <View style={{ 
      flex: 1, 
      alignItems: "center", 
      justifyContent: "center", 
      padding: 24, 
      backgroundColor: "#f8f9fa" 
    }}>
      <Text style={{ 
        fontSize: 22, 
        fontWeight: "800", 
        color: "#2E4053", 
        marginBottom: 16 
      }}>
        Who are you?
      </Text>
      <Text style={{ 
        fontSize: 14, 
        color: "#6c757d", 
        marginBottom: 24 
      }}>
        Choose your role to continue
      </Text>
      
      <TouchableOpacity
        onPress={() => onSelectRole("lab")}
        activeOpacity={0.9}
        style={{ 
          backgroundColor: "#2E86C1", 
          paddingVertical: 14, 
          paddingHorizontal: 22, 
          borderRadius: 12, 
          width: "100%", 
          marginBottom: 12, 
          alignItems: "center", 
          shadowColor: "#000", 
          shadowOpacity: 0.12, 
          shadowRadius: 6, 
          elevation: 4 
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>
          I am a Lab Worker
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => onSelectRole("doctor")}
        activeOpacity={0.9}
        style={{ 
          backgroundColor: "#28A745", 
          paddingVertical: 14, 
          paddingHorizontal: 22, 
          borderRadius: 12, 
          width: "100%", 
          alignItems: "center", 
          shadowColor: "#000", 
          shadowOpacity: 0.12, 
          shadowRadius: 6, 
          elevation: 4 
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "700" }}>
          I am a Doctor
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default RoleSelectionScreen;
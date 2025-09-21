
import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useDoctor } from "../context/DoctorContext";

export default function VideoCallRequestsScreen({ navigation }) {
  const { videoCalls = [], attendVideoCall } = useDoctor();

  const pendingCalls = videoCalls.filter(v => !v.attendedBy);

  const handleAttend = (call) => {
    // Mark attended
    attendVideoCall(call.id, "Dr. Robin");

    // Redirect to Jitsi Meet
    const roomId = `MedKitRoom-${call.id}`;
    navigation.navigate("VideoCallScreen", { roomId });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={pendingCalls}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No pending video calls</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>Patient: {item.patientName}</Text>
            <Text style={styles.time}>Requested: {new Date(item.time).toLocaleTimeString()}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleAttend(item)}>
              <Text style={styles.buttonText}>Attend</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8f9fa" },
  card: { backgroundColor: "#fff", padding: 16, marginBottom: 12, borderRadius: 12, borderWidth: 1, borderColor: "#e6eef7", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  title: { fontWeight: "700", marginBottom: 4 },
  time: { color: "#555", marginBottom: 8 },
  button: { backgroundColor: "#2E86C1", padding: 8, borderRadius: 8, alignSelf: "flex-start" },
  buttonText: { color: "#fff", fontWeight: "700" },
});

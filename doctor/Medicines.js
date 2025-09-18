import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useDoctor } from "../context/DoctorContext";

export default function Medicines({ navigation }) {
  const { medicines } = useDoctor();

  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredMedicines = medicines.filter(medicine => 
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMedicineItem = ({ item }) => (
    <View style={styles.medicineCard}>
      <View style={styles.medicineInfo}>
        <Text style={styles.medicineName}>{item.name}</Text>
        <Text style={styles.medicineStock}>In Stock: {item.stock}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.prescribeButton}>
          <MaterialIcons name="prescription" size={16} color="#fff" />
          <Text style={styles.buttonText}>Prescribe</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.requestButton}>
          <MaterialIcons name="inventory" size={16} color="#fff" />
          <Text style={styles.buttonText}>Request Stock</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput 
          style={styles.searchInput}
          placeholder="Search medicines..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <FlatList
        data={filteredMedicines}
        renderItem={renderMedicineItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="medication" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No medicines found</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  medicineCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medicineInfo: {
    marginBottom: 12,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E4053",
  },
  medicineStock: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  prescribeButton: {
    flex: 1,
    backgroundColor: "#2E86C1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  requestButton: {
    flex: 1,
    backgroundColor: "#dc3545",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6c757d",
    fontWeight: "600",
  },
});